import { createSlice/*, PayloadAction*/ } from "@reduxjs/toolkit";

let initialState: {
} = {
};

const slice = createSlice({
    name: "pianod2",
    initialState,
    reducers: {
    },
});

// Slice exports
//export const {
//} = slice.actions;

export default slice.reducer;
