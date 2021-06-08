import { END } from "@redux-saga/core";
import { delay, put, take, takeMaybe } from "@redux-saga/core/effects";
import store from "../../../../app/store";
import { connectionEstablished, connectionLost, dataReceived } from "../../store/slices/websocket";
import { WebsocketData } from "../../types";
import { WebsocketConnection } from "./websocket_connection";

export default class Pianod2Client {
    hostname: string
    port: string

    constructor(hostname: string, port: string) {
        this.hostname = hostname
        this.port = port
    }

    execute_command() {

    }

    * main() {
        while (true) {
            console.info("Opening websocket connection ...")
            const connection = new WebsocketConnection(this.hostname, this.port);
            const receive_channel = connection.receive_channel;

            try {
                const message: WebsocketData = yield take(receive_channel);
                console.info("Websocket connection opened.")
                yield put(connectionEstablished());
                store.dispatch(dataReceived(message));
                while (true) {
                    const message: WebsocketData | END = yield takeMaybe(receive_channel);
                    if (message === END) {
                        console.warn("Websocket connection closed.")
                        break;
                    }

                    store.dispatch(dataReceived(message as WebsocketData));
                    console.log("Message:", message);
                }
            } catch (e) {
                console.error("Websocket threw an error: ", e);
            } finally {
                yield put(connectionLost());
                receive_channel.close()
                yield delay(1000);
            }
        }
    }
}
