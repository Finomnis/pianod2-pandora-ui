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
    onmessage(event: MessageEvent) {
        // Check if payload is string
        const data = event.data;
        if (typeof data !== 'string') {
            console.warn("Received unexpected non-textual websocket data!");
            return;
        }

        // Parse payload data to dictionary
        let parsed_data: { [key: string]: object } = {};
        try {
            // Decode JSON
            const potentially_parsed_data = JSON.parse(data)

            // Make sure it's a dictionary
            if (!potentially_parsed_data || potentially_parsed_data.constructor !== Object) {
                console.warn("Received unexpected non-object websocket json data!");
                return;
            }

            parsed_data = potentially_parsed_data;
        } catch (e) {
            console.warn("Received unexpected non-json websocket data!", e);
            return;
        }

        store.dispatch(dataReceived(parsed_data));
    }

    execute_command() {

    }

    * main() {
        while (true) {
            console.info("Opening websocket connection ...")
            const connection = new WebsocketConnection(this.hostname, this.port);
            const receive_channel = connection.receive_channel;
            console.info("Websocket connection initialized.")

            try {
                const message: WebsocketData = yield take(receive_channel);
                console.info("Websocket connection opened.")
                yield put(connectionEstablished());
                store.dispatch(dataReceived(message));
                while (true) {
                    const message: WebsocketData | END = yield takeMaybe(receive_channel);
                    if (message === END) {
                        break;
                    }

                    store.dispatch(dataReceived(message as WebsocketData));
                    console.log("Message:", message);
                }
            } catch (e) {
                console.error("Websocket threw an error: ", e);
            } finally {
                yield put(connectionLost());
                console.warn("Websocket connection closed.")
                receive_channel.close()
                yield delay(1000);
            }
        }
    }
}
