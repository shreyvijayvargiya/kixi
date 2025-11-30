import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { getCookie } from "cookies-next";

const safeParseDate = (dateString) => {
	if (!dateString) return null;
	try {
		if (dateString.seconds && dateString.nanoseconds) {
			return new Date(
				dateString.seconds * 1000 + dateString.nanoseconds / 1000000
			).toISOString();
		}
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? null : date.toISOString();
	} catch (error) {
		console.error("Error parsing date:", error);
		return null;
	}
};

const getInitialState = () => {
	const userId = getCookie("userId");
	const userData = getCookie("userData");

	return {
		user: userData ? JSON.parse(userData) : null,
		isAuthenticated: !!userId,
		subscriptionStatus: null,
		subscriptionId: null,
		subscriptionType: null,
		price: null,
		subscriptionStartDate: null,
		subscriptionEndDate: null,
		savedTemplates: [], // Array of template IDs
		githubToken: null, // GitHub access token
		githubConnected: false, // Whether GitHub is connected
		githubUserInfo: null, // GitHub user info: { id, login, name, email, avatar_url, bio, location, html_url }
	};
};

const authSlice = createSlice({
	name: "auth",
	initialState: getInitialState(),
	reducers: {
		setUserInStore: (state, action) => {
			console.log(action, "action");
			const userData = {
				uid: action.payload.userData.uid,
				email: action.payload.userData.email,
				displayName: action.payload.userData.displayName,
				photoURL: action.payload.userData.photoURL,
			};

			state.user = userData;
			state.isAuthenticated = true;
			// Set cookies
			Cookies.set("userId", userData.uid, { expires: 1 });
			Cookies.set("userData", JSON.stringify(userData), { expires: 1 });
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
		logout: (state) => {
			// Clear cookies
			Cookies.remove("userId");
			Cookies.remove("userData");

			// Reset state
			state.user = null;
			state.isAuthenticated = false;
			state.subscriptionStatus = null;
			state.subscriptionId = null;
			state.subscriptionType = null;
			state.price = null;
			state.subscriptionStartDate = null;
			state.subscriptionEndDate = null;
			state.savedTemplates = [];
			state.githubToken = null;
			state.githubConnected = false;
			state.githubUserInfo = null;
		},
		setActiveModel: (state, action) => {
			state.model.active = action.payload;
		},
		setSubscriptionStatus: (state, action) => {
			state.subscriptionStatus = action.payload.subscriptionStatus;
			state.subscriptionId = action.payload.subscriptionId;
			state.subscriptionType = action.payload.subscriptionType;
			state.price = action.payload.price || state.price;
			state.subscriptionStartDate =
				safeParseDate(action.payload.subscriptionStartDate) ||
				state.subscriptionStartDate;
			state.subscriptionEndDate =
				safeParseDate(action.payload.subscriptionEndDate) ||
				state.subscriptionEndDate;
			state.lastWebhookEvent = action.payload.lastWebhookEvent;
		},
		setSavedTemplates: (state, action) => {
			state.savedTemplates = action.payload;
		},
		addSavedTemplate: (state, action) => {
			if (!state.savedTemplates.includes(action.payload)) {
				state.savedTemplates.push(action.payload);
			}
		},
		removeSavedTemplate: (state, action) => {
			state.savedTemplates = state.savedTemplates.filter(
				(id) => id !== action.payload
			);
		},
		clearSavedTemplates: (state) => {
			state.savedTemplates = [];
		},
		setGithubToken: (state, action) => {
			state.githubToken = action.payload.token;
			state.githubConnected = !!action.payload.token;
			if (action.payload.userInfo) {
				state.githubUserInfo = action.payload.userInfo;
			}
		},
		setGithubUserInfo: (state, action) => {
			state.githubUserInfo = action.payload;
		},
		clearGithubConnection: (state) => {
			state.githubToken = null;
			state.githubConnected = false;
			state.githubUserInfo = null;
		},
	},
});

export const {
	setUserInStore,
	setLoading,
	setError,
	logout,
	setActiveModel,
	setSubscriptionStatus,
	setSavedTemplates,
	addSavedTemplate,
	removeSavedTemplate,
	clearSavedTemplates,
	setGithubToken,
	setGithubUserInfo,
	clearGithubConnection,
} = authSlice.actions;

export default authSlice.reducer;
