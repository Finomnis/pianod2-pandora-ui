import { call, delay } from "@redux-saga/core/effects";
import store from "../../../../app/store";
import { connectionEstablished, connectionLost } from "../../store/slices/connected";
import { websocketSignalAction } from "../actions";

export default class Pianod2Client {
    websocket: WebSocket;
    connected: boolean;

    constructor(hostname: string, port: string) {
        const url = "ws://" + hostname + ":" + port + "/pianod?protocol=json"
        this.connected = false;
        this.websocket = new WebSocket(url);
        this.websocket.onopen = this.onopen.bind(this);
        this.websocket.onclose = this.onclose.bind(this);
        this.websocket.onerror = this.onerror.bind(this);
        this.websocket.onmessage = this.onmessage.bind(this);
    }

    onopen(event: Event) {
        this.connected = true;
        store.dispatch(connectionEstablished());
    }

    onclose(event: CloseEvent) {
        if (this.connected) {
            this.connected = false;
            store.dispatch(connectionLost());
        }

        // When closed, try to open again
        setTimeout(() => {
            this.websocket = new WebSocket(this.websocket.url);
            this.websocket.onopen = this.onopen.bind(this);
            this.websocket.onclose = this.onclose.bind(this);
            this.websocket.onerror = this.onerror.bind(this);
            this.websocket.onmessage = this.onmessage.bind(this);
        }, 500);
    }

    onerror(event: Event) {
        console.error("Pianod2 websocket error: ", event);
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

        store.dispatch(websocketSignalAction(parsed_data));
    }

    * main() {
        while (true) {
            yield delay(1000);
            yield call(console.log, "A");
        }
    }
}
