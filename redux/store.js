import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import authReducer from "./slices/authSlice";
import changelogReducer from "./slices/changelogSlice";

const rootReducer = combineReducers({
	auth: authReducer,
	changelog: changelogReducer,
});

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["auth", "changelog", "chats", "theme"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				ignoredPaths: [
					"auth.subscriptionStartDate",
					"auth.subscriptionEndDate",
					"auth.savedTemplates",
				],
			},
		}),
});

export const persistor = persistStore(store);
