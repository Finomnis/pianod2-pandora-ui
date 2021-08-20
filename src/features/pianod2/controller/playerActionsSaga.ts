import { Action } from "redux";
import { takeEvery, call } from "redux-saga/effects";
import { changeStationAction } from "../../playerActions";
import pianod2_client from "../connection/pianod2_client";

const call_pianod2 = (command: string, args: object) => call(
    pianod2_client.execute_command.bind(pianod2_client),
    command, args
);

function* handlePlayerAction(action: Action) {
    try {
        if (changeStationAction.match(action)) {
            yield call_pianod2(
                "select",
                {
                    playbackOptions: {
                        select: 'playlist',
                        playlist: {
                            manner: "id",
                            items: [action.payload.stationId]
                        }
                    }
                }
            );
        }
    } catch (e) {
        console.error("Error while executing action:", action, e);
    }
}

// TODO clean this up ... put handlers in a list and write wrapper or something

export function* playerActionsSaga() {
    yield takeEvery(changeStationAction.match, handlePlayerAction);
}
