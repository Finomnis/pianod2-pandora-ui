import { createSlice } from "@reduxjs/toolkit";
import { HistoryEntry, historyResponseAction } from "../../../playerActions";


let initialState: {
    history: {
        entries: HistoryEntry[],
        shown: boolean,
    },
} = {
    history: {
        entries: [],
        shown: false,
    },
};


const slice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        historyClosed: (state) => {
            state.history.shown = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(historyResponseAction, (state, action) => {
                state.history.entries = action.payload;
                state.history.shown = true;
            })
    }
});

// Slice exports
export const { historyClosed } = slice.actions;

export default slice.reducer;
