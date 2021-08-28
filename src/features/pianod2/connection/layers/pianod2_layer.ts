import { channel, Channel, END } from "@redux-saga/core";
import { call, delay, put, race, take, takeMaybe } from "@redux-saga/core/effects";
import { connectionEstablished, connectionLost, dataReceived } from "../../store/slices/websocket";
import { WebsocketData } from "../../types";
import { WebsocketConnection } from "./websocket_layer";

type CommandError = {
    reason: string,
    message?: object,
    exception?: any
}

type CommandRequest = {
    name: string,
    args: object,
    resolve: (value: object | PromiseLike<object | null> | null) => void,
    reject: (reason: CommandError) => void,
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

    * run_rpc(connection: WebsocketConnection, command: CommandRequest) {
        try {
            connection.send_command(command.name, command.args);

            while (true) {
                const message: WebsocketData | END = yield takeMaybe(connection.receive_channel);

                yield call(this.handle_message.bind(this), message);

                if ("code" in message) {
                    const code = message["code"];
                    if (typeof code != "number") {
                        command.reject({ reason: "Invalid return packet received.", message });
                    } else if (code >= 200 && code <= 299) {
                        if ("data" in message) {
                            command.resolve(message["data"]);
                        } else {
                            command.resolve(null);
                        }
                    } else {
                        if ("status" in message) {
                            command.reject({ reason: message["status"], message });
                        } else {
                            command.reject({ reason: "Unknown error", message });
                        }
                    }
                    break;
                }
            }
        } catch (e) {
            command.reject({ reason: "Unknown exception occurred", exception: e });
            throw e;
        }
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
                        const { timeout } = yield race({
                            timeout: delay(1000),
                            run: call(this.run_rpc.bind(this), connection, command),
                        })
                        if (timeout) {
                            command.reject({ reason: "Command timed out." });
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
