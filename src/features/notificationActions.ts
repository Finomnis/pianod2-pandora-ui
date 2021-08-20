import { createAction } from '@reduxjs/toolkit'

export enum NotificationSeverity {
    Success = "success",
    Info = "info",
    Warning = "warning",
    Error = "error",
};

export const notifcationAction =
    createAction<{
        severity: NotificationSeverity,
        message: string,
    }>('notification');
