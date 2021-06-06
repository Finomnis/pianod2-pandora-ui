import { all } from "redux-saga/effects";

// import { simpleActionsSaga } from "./pianobar/actions/simpleActions";
import { pianobarWebsocketSaga } from "./pianod2/websocket/websocket";

export default function* rootSaga() {
    yield all([pianobarWebsocketSaga()]);
}
