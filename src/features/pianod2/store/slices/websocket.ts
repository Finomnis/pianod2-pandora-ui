import { createSlice, PayloadAction } from "@reduxjs/toolkit";

let initialState: {
    connected: boolean
} = {
    connected: false
};

type WebsocketData = {
    [key: string]: object
};

const slice = createSlice({
    name: "pianod2/websocket",
    initialState,
    reducers: {
        connectionEstablished: (state) => {
            state.connected = true;
        },
        connectionLost: (state) => {
            state.connected = false;
        },
        dataReceived: (_state, _action: PayloadAction<WebsocketData>) => { }
    },
});

// Slice exports
export const {
    connectionEstablished,
    connectionLost,
    dataReceived,
} = slice.actions;

export default slice.reducer;
