import { combineReducers } from "redux";
import pianod2Reducer from "./pianod2/store/reducers";
import snackbarReducer from "./snackbar/slice";
import uiReducer from "./ui/defaultLayout/state/slice";

export default combineReducers({
    pianod2: pianod2Reducer,
    snackbar: snackbarReducer,
    ui: uiReducer,
});
