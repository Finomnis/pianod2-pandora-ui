import { combineReducers } from "redux";

import websocketReducer from "./slices/websocket";
import credentialsReducer from "./slices/credentials";

export default combineReducers({
    websocket: websocketReducer,
    credentials: credentialsReducer,
});
