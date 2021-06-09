import { all } from "redux-saga/effects";

import { pianod2ConnectionSaga } from "./backend/client_instance";
import { authenticationSaga } from "./controller/authenticationSaga";

export function* pianod2Sagas() {
    yield all([
        pianod2ConnectionSaga(),
        authenticationSaga(),
    ]);
}
