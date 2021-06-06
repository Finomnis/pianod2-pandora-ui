import { combineReducers } from "redux";
import connectedReducer from "./slices/connected";

export default combineReducers({
    connected: connectedReducer,
});
