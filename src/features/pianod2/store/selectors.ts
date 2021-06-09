import { RootState } from "../../../app/store"

export const getCredentials = (state: RootState) => state.pianod2.credentials;
