import { call } from "@redux-saga/core/effects";

import { WEBSOCKET_PORT } from "../../../config";
import Pianod2Client from "./layers/pianod2_layer";

// Create websocket
const pianod2_client = new Pianod2Client(window.location.hostname, WEBSOCKET_PORT);

export function* pianod2ConnectionSaga() {
    // Start connection
    yield call(pianod2_client.main.bind(pianod2_client));
}

export default pianod2_client;
