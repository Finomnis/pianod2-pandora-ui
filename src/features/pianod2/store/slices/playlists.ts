import { createSlice, PayloadAction } from "@reduxjs/toolkit";

let initialState: { items: { [name: string]: string } } = { items: {} };

export interface PlaylistsUpdate {
    [name: string]: string;
}

const slice = createSlice({
    name: "pianod2/playlists",
    initialState,
    reducers: {
        playlistsChanged: (state, action: PayloadAction<PlaylistsUpdate>) => {
            const payload = action.payload;
            state.items = payload;
        },
    },
});

// Slice exports
export const { playlistsChanged } = slice.actions;

export default slice.reducer;
