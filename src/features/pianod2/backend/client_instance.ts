import { call } from "@redux-saga/core/effects";

import { WEBSOCKET_PORT } from "../../../config";
import Pianod2Client from "./protocol/pianod2_connection";

// Create websocket
const client = new Pianod2Client(window.location.hostname, WEBSOCKET_PORT);

export function* pianod2ConnectionSaga() {
    // Start connection
    yield call(client.main.bind(client));
}

export default client;
