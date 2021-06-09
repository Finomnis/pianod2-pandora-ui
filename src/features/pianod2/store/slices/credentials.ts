import { createSlice, PayloadAction } from "@reduxjs/toolkit";

let initialState: {
    username: string,
    password: string,
} = {
    username: "admin",
    password: "admin",
};


const slice = createSlice({
    name: "pianod2/credentials",
    initialState,
    reducers: {
        credentialsChanged: (state, action: PayloadAction<{ username: string, password: string }>) => {
            state.username = action.payload.username;
            state.password = action.payload.password;
        },
    },
});

// Slice exports
export const {
    credentialsChanged,
} = slice.actions;

export default slice.reducer;
