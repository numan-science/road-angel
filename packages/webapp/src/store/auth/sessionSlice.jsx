import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
	name: "auth/session",
	initialState: {
		token: "",
		signedIn: false,
		greeted: false,
	},
	reducers: {
		onSignInSuccess: (state, action) => {
			state.signedIn = true;
			state.token = action.payload;
		},
		onSignOutSuccess: (state) => {
			state.signedIn = false;
			state.token = "";
		},
		setToken: (state, action) => {
			state.token = action.payload;
		},
		setGreeting: (state, action) => {
			state.greeted = action.payload;
		},
	},
});

export const { onSignInSuccess, onSignOutSuccess, setToken, setGreeting } =
	sessionSlice.actions;

export default sessionSlice.reducer;
