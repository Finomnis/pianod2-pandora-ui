import { all } from "redux-saga/effects";

import { pianod2ConnectionSaga } from "./connection/pianod2_client";
import { authenticationSaga } from "./controller/authenticationSaga";

export function* pianod2Sagas() {
    yield all([
        pianod2ConnectionSaga(),
        authenticationSaga(),
    ]);
}
