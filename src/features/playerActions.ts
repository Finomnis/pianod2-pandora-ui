import { createAction } from '@reduxjs/toolkit'

export const changeStationAction =
    createAction<{ stationId: string }>('player/actions/changeStation');
export const skipAction =
    createAction('player/actions/skip');
export const resumeAction =
    createAction('player/actions/resume');
export const pauseAction =
    createAction('player/actions/pause');
