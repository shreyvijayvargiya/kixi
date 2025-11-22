import { createSlice } from "@reduxjs/toolkit";

const changelogSlice = createSlice({
	name: "changelog",
	initialState: {
		lastViewedChangelogId: null, // ID of the last viewed changelog item
		isViewed: false, // Whether the latest changelog has been viewed
	},
	reducers: {
		setChangelogViewed: (state, action) => {
			// action.payload should be the latest changelog ID
			state.lastViewedChangelogId = action.payload;
			state.isViewed = true;
		},
		checkChangelogUpdate: (state, action) => {
			// action.payload should be the latest changelog ID
			// If it's different from lastViewed (or null), there's a new update
			if (
				!state.lastViewedChangelogId ||
				state.lastViewedChangelogId !== action.payload
			) {
				state.isViewed = false;
			} else {
				state.isViewed = true;
			}
		},
	},
});

export const { setChangelogViewed, checkChangelogUpdate } =
	changelogSlice.actions;

export default changelogSlice.reducer;
