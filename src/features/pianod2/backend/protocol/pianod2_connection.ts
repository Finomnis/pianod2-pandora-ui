import { channel, Channel, END } from "@redux-saga/core";
import { call, delay, put, race, take, takeMaybe } from "@redux-saga/core/effects";
import { connectionEstablished, connectionLost, dataReceived } from "../../store/slices/websocket";
import { WebsocketData } from "../../types";
import { WebsocketConnection } from "./websocket_connection";

type CommandRequest = {
    name: string,
    args: object,
    resolve: (value: object | PromiseLike<object | null> | null) => void,
    reject: (reason?: any) => void,
};


export default class Pianod2Client {
    hostname: string
    port: string
    command_channel: Channel<CommandRequest>

    constructor(hostname: string, port: string) {
        this.hostname = hostname
        this.port = port
        this.command_channel = channel();
    }

    execute_command(name: string, args: object): Promise<object | null> {
        return new Promise((resolve, reject) => {
            let command_request: CommandRequest = {
                name, args,
                resolve, reject,
            };
            this.command_channel.put(command_request);
        })
    }

    * handle_message(message: WebsocketData | END) {
        if (message === END) {
            throw new Error("Connection closed.");
        }

        yield put(dataReceived(message as WebsocketData));
    }

    * main() {
        while (true) {
            console.info("Opening websocket connection ...");
            const connection = new WebsocketConnection(this.hostname, this.port);
            const receive_channel = connection.receive_channel;

            let connected = false;
            try {
                const message: WebsocketData = yield take(receive_channel);

                if (!("code" in message && message["code"] >= 200 && message["code"] <= 299)) {
                    throw new Error("Invalid welcome message received.");
                }

                console.info("Websocket connection opened.");
                connected = true;
                yield put(connectionEstablished());

                yield call(this.handle_message.bind(this), message);

                while (true) {
                    type RaceResult = { message: WebsocketData | END | undefined, command: CommandRequest | undefined };
                    const result: RaceResult = yield race({
                        message: takeMaybe(receive_channel),
                        command: takeMaybe(this.command_channel),
                    });

                    const message = result.message;
                    const command = result.command;

                    if (message) {
                        yield call(this.handle_message.bind(this), message);
                    }

                    if (command) {
                        try {
                            while (true) {
                                const message: WebsocketData | END = yield takeMaybe(receive_channel);

                                yield call(this.handle_message.bind(this), message);

                                if ("code" in message) {
                                    const code = message["code"];
                                    if (typeof code != "number") {
                                        command.reject("Invalid return packet received.");
                                    } else if (code >= 200 && code <= 299) {
                                        if ("data" in message) {
                                            command.resolve(message["data"]);
                                        } else {
                                            command.resolve(null);
                                        }
                                    } else {
                                        if ("status" in message) {
                                            command.reject(message["status"]);
                                        } else {
                                            command.reject("Unknown error");
                                        }
                                    }
                                    break;
                                }
                            }
                        } catch (e) {
                            command.reject(e);
                            throw e;
                        }
                    }
                }
            } catch (e) {
                console.error("Websocket threw an error: ", e);
            } finally {
                if (connected) {
                    yield put(connectionLost());
                }
                receive_channel.close()
                yield delay(1000);
            }
        }
    }
}