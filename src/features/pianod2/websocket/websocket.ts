import { call } from "@redux-saga/core/effects";

import { WEBSOCKET_PORT } from "../../../config";
import Pianod2Client from "./protocol/websocket_client";
import websocket from "./websocket";

export function* pianobarWebsocketSaga() {
    // Start connection
    yield call(websocket.main.bind(websocket));
}

// Create websocket
export default new Pianod2Client("ws://" + window.location.hostname + ":" + WEBSOCKET_PORT + "/pianod?protocol=json");
