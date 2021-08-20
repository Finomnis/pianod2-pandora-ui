import { createAction } from '@reduxjs/toolkit'

export const changeStationAction =
    createAction<{ stationId: string }>('player/actions/changeStation');
