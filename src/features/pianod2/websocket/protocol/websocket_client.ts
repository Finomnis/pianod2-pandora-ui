import { call, delay } from "@redux-saga/core/effects";
import store from "../../../../app/store";
import { connectionEstablished, connectionLost } from "../../store/slices/connected";

export default class Pianod2Client {
    websocket: WebSocket;
    connected: boolean;

    constructor(url: string) {
        this.connected = false;
        this.websocket = new WebSocket(url);
        this.websocket.onopen = this.onopen.bind(this);
        this.websocket.onclose = this.onclose.bind(this);
        this.websocket.onerror = this.onerror.bind(this);
        this.websocket.onmessage = this.onmessage.bind(this);
    }

    onopen(event: Event): any {
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
        console.log("message", event);
    }

    * main() {
        while (true) {
            yield delay(1000);
            yield call(console.log, "A");
        }
    }
}
