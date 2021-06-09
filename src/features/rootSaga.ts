import { all } from "redux-saga/effects";

import { pianod2Sagas } from "./pianod2/sagas";

export default function* rootSaga() {
    yield all([pianod2Sagas()]);
}
