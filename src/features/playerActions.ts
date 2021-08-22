import { createAction } from '@reduxjs/toolkit'

export type HistoryEntry = {
    song: string,
    artist: string,
    album: string,
    albumArt: string,
};

export const changeStationAction =
    createAction<{ stationId: string }>('player/actions/changeStation');
export const skipAction =
    createAction('player/actions/skip');
export const resumeAction =
    createAction('player/actions/resume');
export const pauseAction =
    createAction('player/actions/pause');
export const requestHistoryAction =
    createAction('player/actions/requestHistory');
export const historyResponseAction =
    createAction<HistoryEntry[]>('player/actions/historyResponse');
