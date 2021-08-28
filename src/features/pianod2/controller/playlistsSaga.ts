import pianod2_client from "../connection/pianod2_client";
import { connectionEstablished } from "../store/slices/websocket";
import { call, put, takeEvery } from "redux-saga/effects";
import { playlistsChanged } from "../store/slices/playlists";

interface PlaylistElement {
    playlistId: string;
    playlistName: string;
}

function* updatePlaylists() {
    try {
        const response: PlaylistElement[] = yield call(
            pianod2_client.execute_command.bind(pianod2_client),
            "getPlaylists",
            { list: "list" }
        );

        const playlists: { [name: string]: string } = {};

        for (const element of response) {
            playlists[element.playlistId] = element.playlistName;
        }

        yield put(playlistsChanged(playlists));
    } catch (e) {
        console.warn("Unable to update playlists", e);
    }
}

export function* playlistsSaga() {
    yield takeEvery(connectionEstablished.match, updatePlaylists);
}
