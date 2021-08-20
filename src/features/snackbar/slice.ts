import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationSeverity } from "../notificationActions";

let initialState: {
    severity: NotificationSeverity,
    message: string,
    key: number,
    open: boolean
} = {
    severity: NotificationSeverity.Info,
    message: "",
    key: -1,
    open: false,
};

export interface SnackbarPayload {
    severity: NotificationSeverity,
    message: string,
    key: number,
}

const slice = createSlice({
    name: "snackbar",
    initialState,
    reducers: {
        snackbarOpenAction: (state, action: PayloadAction<SnackbarPayload>) => {
            const payload = action.payload;
            state.severity = payload.severity;
            state.message = payload.message;
            state.key = payload.key;
            state.open = true;
        },
        snackbarCloseAction: (state) => {
            state.open = false;
        }
    },
});

// Slice exports
export const { snackbarOpenAction, snackbarCloseAction } = slice.actions;

export default slice.reducer;
