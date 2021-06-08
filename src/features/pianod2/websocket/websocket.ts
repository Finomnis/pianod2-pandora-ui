import { call } from "@redux-saga/core/effects";

import { WEBSOCKET_PORT } from "../../../config";
import Pianod2Client from "./protocol/pianod2_connection";
import websocket from "./websocket";

export function* pianobarWebsocketSaga() {
    // Start connection
    yield call(websocket.main.bind(websocket));
}

// Create websocket
export default new Pianod2Client(window.location.hostname, WEBSOCKET_PORT);
