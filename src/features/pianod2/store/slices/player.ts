import { createSlice, PayloadAction } from "@reduxjs/toolkit";

let initialState: {
    song: string | null;
    artist: string | null;
    album: string | null;
    albumArt: string | null;
    playlistId: string | null;
    playlistName: string | null;
    playbackState: string;
    duration: number | null;
    position: {
        lastKnownPosition: number | null;
        lastPositionUpdate: number | null;
    };
} = {
    song: null,
    artist: null,
    album: null,
    albumArt: null,
    playlistId: null,
    playlistName: null,
    playbackState: "idle",
    duration: null,
    position: {
        lastKnownPosition: null,
        lastPositionUpdate: null,
    },
};

export interface PlaybackStateUpdate {
    song?: string;
    artist?: string;
    album?: string;
    albumArt?: string;
    playlistId?: string;
    playlistName?: string;
    playbackState?: string;
    duration?: number;
    position?: {
        lastKnownPosition: number;
        lastPositionUpdate: number;
    };
}

const slice = createSlice({
    name: "pianod2/player",
    initialState,
    reducers: {
        playbackStateChanged: (
            state,
            action: PayloadAction<PlaybackStateUpdate | null>
        ) => {
            const payload = action.payload;

            if (payload === null) {
                // Delete everything but the playlist info.
                // This payload gets received when the current song
                // gets stopped.
                // This does NOT invalidate the playlist.
                const playlistId = state.playlistId;
                const playlistName = state.playlistName;
                Object.assign(state, initialState);
                state.playlistId = playlistId;
                state.playlistName = playlistName;
                return;
            }

            Object.assign(state, payload);
        },
    },
});

// Slice exports
export const { playbackStateChanged } = slice.actions;

export default slice.reducer;
