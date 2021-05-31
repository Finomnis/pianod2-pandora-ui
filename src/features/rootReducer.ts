import { combineReducers } from "redux";
import pianod2Reducer from "./pianod2/store/slice";

export default combineReducers({
    pianod2: pianod2Reducer,
});
