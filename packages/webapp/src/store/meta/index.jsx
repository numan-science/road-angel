import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
	selectedCompany: null,
	selectedClient: null,
};

export const metaSlice = createSlice({
	name: "meta",
	initialState,
	reducers: {
		setCompany: (state, action) => {
			state.selectedCompany = action.payload;
		},
		setClient: (state, action) => {
			state.selectedClient = action.payload;
		},
		resetMetaData: () => initialState,
	},
});

export const { setCompany, setClient, resetMetaData } = metaSlice.actions;

export default metaSlice.reducer;
