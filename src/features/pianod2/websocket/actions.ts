import { createAction } from "@reduxjs/toolkit";

export const websocketSignalAction = createAction<{ [key: string]: object }>("pianod2/websocket/signal");
