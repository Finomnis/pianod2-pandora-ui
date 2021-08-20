import { Action } from "redux";
import { TakeableChannel } from "redux-saga";
import { actionChannel, delay, put, take } from "redux-saga/effects";
import { notifcationAction } from "../notificationActions";
import { snackbarCloseAction, snackbarOpenAction } from "./slice";


export function* snackbarSagas() {
    const channel: TakeableChannel<Action> = yield actionChannel(notifcationAction.match);

    let nextSnackbarKey = 0;

    while (true) {
        const action: Action = yield take(channel);
        if (notifcationAction.match(action)) {
            // Open snackbar
            nextSnackbarKey += 1;
            yield put(snackbarOpenAction({
                severity: action.payload.severity,
                message: action.payload.message,
                key: nextSnackbarKey
            }));

            // Wait a little
            yield delay(2000);

            // Close snackbar
            yield put(snackbarCloseAction());
        }
    }
}
