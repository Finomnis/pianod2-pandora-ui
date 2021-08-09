import { combineReducers } from "redux";

import websocketReducer from "./slices/websocket";
import credentialsReducer from "./slices/credentials";
import playerReducer from "./slices/player";

export default combineReducers({
    websocket: websocketReducer,
    credentials: credentialsReducer,
    player: playerReducer,
});
