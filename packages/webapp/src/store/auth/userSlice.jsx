import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
	user: {
		username: "",
		email: "",
		authority: [],
		profilePic: "",
	},
};

export const userSlice = createSlice({
	name: "auth/loggedInUser",
	initialState,
	reducers: {
		setLoggedInUser: (_, action) => action.payload,
		setUser: (state, action) => {
			state.user = action.payload;
		},
		userLoggedOut: () => initialState,
	},
});

export const { setUser, setLoggedInUser } = userSlice.actions;

export default userSlice.reducer;
