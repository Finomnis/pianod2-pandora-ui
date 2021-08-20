import { Action } from "redux";
import { TakeableChannel } from "redux-saga";
import { actionChannel, delay, take } from "redux-saga/effects";
import { notifcationAction } from "../notificationActions";


export function* snackbarSagas() {
    const channel: TakeableChannel<Action> = yield actionChannel(notifcationAction.match);

    while (true) {
        const action: Action = yield take(channel);
        if (notifcationAction.match(action)) {
            console.log("Notification:", action.payload);
            yield delay(2000);
            console.log("Notification done.");
        }
    }
}
