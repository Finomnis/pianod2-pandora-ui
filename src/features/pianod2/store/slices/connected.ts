import { createSlice } from "@reduxjs/toolkit";

let initialState: {
    connected: boolean
} = {
    connected: false
};

const slice = createSlice({
    name: "connected",
    initialState,
    reducers: {
        connectionEstablished: (state) => {
            state.connected = true;
        },
        connectionLost: (state) => {
            state.connected = false;
        },
    },
});

// Slice exports
export const {
    connectionEstablished,
    connectionLost
} = slice.actions;

export default slice.reducer;
