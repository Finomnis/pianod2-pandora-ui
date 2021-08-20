import { put, take } from "@redux-saga/core/effects";
import { dataReceived } from "../store/slices/websocket";
import {
    playbackStateChanged,
    PlaybackStateUpdate,
} from "../store/slices/player";

interface CurrentSongMessage {
    trackName?: string;
    artistName?: string;
    albumName?: string;
    albumArtUrl?: string;
    duration?: number;
    timeIndex?: number;
    playlistId?: string;
    playlistName?: string;
}

interface StateMessage {
    playbackState?: string;
    selectedPlaylist? :{
        id?: string,
        name?: string
    }
}

function objectNonEmpty(obj: object) {
    for (var i in obj) return true;
    return false;
}

export function* songStateSaga() {
    while (true) {
        // Receive next message
        const message: ReturnType<typeof dataReceived> = yield take(
            dataReceived
        );
        const payload = message.payload;

        const playerUpdate: PlaybackStateUpdate = {};

        if ("currentSong" in payload) {
            const currentSongMessage: CurrentSongMessage | null =
                payload["currentSong"];

            if (currentSongMessage === null) {
                yield put(playbackStateChanged(null));
            } else {
                if (currentSongMessage.trackName !== undefined) {
                    playerUpdate.song = currentSongMessage.trackName;
                }
                if (currentSongMessage.artistName !== undefined) {
                    playerUpdate.artist = currentSongMessage.artistName;
                }
                if (currentSongMessage.albumName !== undefined) {
                    playerUpdate.album = currentSongMessage.albumName;
                }
                if (currentSongMessage.albumArtUrl !== undefined) {
                    playerUpdate.albumArt = currentSongMessage.albumArtUrl;
                }
                if (currentSongMessage.playlistId !== undefined) {
                    playerUpdate.playlistId = currentSongMessage.playlistId;
                }
                if (currentSongMessage.playlistName !== undefined) {
                    playerUpdate.playlistName = currentSongMessage.playlistName;
                }
                if (currentSongMessage.duration !== undefined) {
                    playerUpdate.duration = currentSongMessage.duration;
                }
                if (currentSongMessage.timeIndex !== undefined) {
                    playerUpdate.position = {
                        lastKnownPosition: currentSongMessage.timeIndex,
                        lastPositionUpdate: Date.now(),
                    };
                }
            }
        }

        if ("state" in payload) {
            const stateMessage: StateMessage = payload["state"];
            if (stateMessage.playbackState !== undefined) {
                playerUpdate.playbackState = stateMessage.playbackState;
            }
            const selectedPlaylist = stateMessage.selectedPlaylist;
            if (selectedPlaylist !== undefined) {
                if (selectedPlaylist.id !== undefined) {
                    playerUpdate.playlistId = selectedPlaylist.id;
                }
                if (selectedPlaylist.name !== undefined) {
                    playerUpdate.playlistName = selectedPlaylist.name;
                }
            }
        }

        if (objectNonEmpty(playerUpdate)) {
            yield put(playbackStateChanged(playerUpdate));
        }
    }
}
