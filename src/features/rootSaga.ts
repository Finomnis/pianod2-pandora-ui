import { all } from "redux-saga/effects";

import { pianod2Sagas } from "./pianod2/sagas";
import { snackbarSagas } from "./snackbar/sagas";

export default function* rootSaga() {
    yield all([
        pianod2Sagas(),
        snackbarSagas(),
    ]);
}
