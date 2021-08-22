import { Action } from "redux";
import { takeEvery, call, put } from "redux-saga/effects";
import { notifcationAction, NotificationSeverity } from "../../notificationActions";
import { changeStationAction, historyResponseAction, pauseAction, requestHistoryAction, resumeAction, skipAction } from "../../playerActions";
import pianod2_client from "../connection/pianod2_client";

const call_pianod2 = (command: string, args: object) => call(
    pianod2_client.execute_command.bind(pianod2_client),
    command, args
);


function* handleChangeStationAction(action: Action) {
    if (!(changeStationAction.match(action))) return;

    yield call_pianod2(
        "play",
        {
            playbackOptions: {
                now: 'now',
                playback: 'resume',
                queueMode: 'random',
                select: 'playlist',
                playlist: {
                    manner: "id",
                    items: [action.payload.stationId]
                }
            }
        }
    );
}


function* handleResumeAction(action: Action) {
    if (!(resumeAction.match(action))) return;

    yield call_pianod2(
        "resume", {}
    );
}

function* handlePauseAction(action: Action) {
    if (!(pauseAction.match(action))) return;

    yield call_pianod2(
        "pause", {}
    );
}

function* handleSkipAction(action: Action) {
    if (!(skipAction.match(action))) return;

    yield call_pianod2(
        "skip", {}
    );
}

function* handleRequestHistoryAction(action: Action) {
    if (!(requestHistoryAction.match(action))) return;

    const history: [{
        albumArtUrl: string,
        albumName: string,
        artistName: string,
        trackName: string,
    }] | null = yield call_pianod2(
        "getHistory", {}
    );

    const processedHistory = (history === null) ? [] : history.map(
        (element) => ({
            song: element.trackName,
            artist: element.artistName,
            album: element.albumName,
            albumArt: element.albumArtUrl,
        })
    )

    yield put(historyResponseAction(processedHistory))
}

const tryRun = (actionHandler: (action: Action) => any) => (
    function* saga(action: Action) {
        try {
            yield actionHandler(action);
        } catch (e) {
            const actionType = `${action.type}`.replace(/^.*\//gm, "");

            let message = `Action '${actionType}' failed!`;

            if ('reason' in e) {
                message = `Action '${actionType}' failed: ${e.reason}`;
            }

            yield put(notifcationAction({
                severity: NotificationSeverity.Error,
                message,
            }));

            console.error("Action failed:", action, e);
        }
    });

// TODO clean this up ... put handlers in a list and write wrapper or something

export function* playerActionsSaga() {
    yield takeEvery(changeStationAction.match, tryRun(handleChangeStationAction));
    yield takeEvery(resumeAction.match, tryRun(handleResumeAction));
    yield takeEvery(pauseAction.match, tryRun(handlePauseAction));
    yield takeEvery(skipAction.match, tryRun(handleSkipAction));
    yield takeEvery(requestHistoryAction.match, tryRun(handleRequestHistoryAction));
}
