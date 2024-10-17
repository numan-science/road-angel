import { combineReducers } from "@reduxjs/toolkit";
import session from "./sessionSlice";
import loggedInUser from "./userSlice";

const reducer = combineReducers({
	session,
	loggedInUser,
});

export default reducer;
