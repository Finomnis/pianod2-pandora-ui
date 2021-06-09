import { all } from "redux-saga/effects";

import { pianod2ConnectionSaga } from "./backend/client_instance";

export function* pianod2Sagas() {
    yield all([pianod2ConnectionSaga()]);
}
