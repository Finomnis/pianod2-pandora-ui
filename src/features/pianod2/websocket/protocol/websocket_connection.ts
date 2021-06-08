import { END, EventChannel, eventChannel } from "@redux-saga/core";

export type Pianod2WebsocketMessage = { [key: string]: object };

export class WebsocketConnection {
    #websocket: WebSocket;
    receive_channel: EventChannel<Pianod2WebsocketMessage | Error>;

    constructor(hostname: string, port: string) {
        const url = "ws://" + hostname + ":" + port + "/pianod?protocol=json";

        this.#websocket = new WebSocket(url);
        this.receive_channel = eventChannel(emit => {

            this.#websocket.onopen = (event) => {
            };

            this.#websocket.onclose = (event) => {
                console.warn("Websocket closed:", event.reason);
                emit(END);
            };

            this.#websocket.onerror = (event) => {
                emit(new Error("Websocket threw an error."));
            };

            this.#websocket.onmessage = (event) => {
                // Check if payload is string
                const data = event.data;
                if (typeof data !== 'string') {
                    console.warn("Received unexpected non-textual websocket data!");
                    return;
                }

                // Parse payload data to dictionary
                let parsed_data: Pianod2WebsocketMessage = {};
                try {
                    // Decode JSON
                    const potentially_parsed_data = JSON.parse(data);

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

                emit(parsed_data);
            };

            return () => {
                this.#websocket.close();
            }
        })
    }

    send_command(name: string, args: object) {
        let command: { [name: string]: object } = {};
        command[name] = args;
        this.#websocket.send(JSON.stringify(command));
    }
}
