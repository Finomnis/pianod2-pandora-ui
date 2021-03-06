import { all } from "redux-saga/effects";

import { pianod2ConnectionSaga } from "./connection/pianod2_client";
import { authenticationSaga } from "./controller/authenticationSaga";
import { playerActionsSaga } from "./controller/playerActionsSaga";
import { playlistsSaga } from "./controller/playlistsSaga";
import { songStateSaga } from "./controller/songStateSaga";

export function* pianod2Sagas() {
    yield all([
        pianod2ConnectionSaga(),
        authenticationSaga(),
        songStateSaga(),
        playlistsSaga(),
        playerActionsSaga(),
    ]);
}
