import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
	setGithubToken,
	setGithubUserInfo,
} from "../../redux/slices/authSlice";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import { getGitHubUserDetails } from "../utils/github";

const useGithubConnection = ({ cb = () => {} } = {}) => {
	const dispatch = useDispatch();
	const currentUser = auth.currentUser;

	// Helper function to get cookie - decode URL-encoded values
	const getCookie = (name) => {
		if (typeof window === "undefined") return null;
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) {
			const cookieValue = parts.pop().split(";").shift();
			// Decode in case the cookie was URL encoded (we encode it in callback.js)
			try {
				return decodeURIComponent(cookieValue);
			} catch (e) {
				// If decoding fails, return raw value (might not be encoded)
				return cookieValue;
			}
		}
		return null;
	};

	// Check for OAuth token in cookie first (priority)
	// Always enabled when user is logged in, will check for cookies inside the query
	const queryEnabled = typeof window !== "undefined" && !!currentUser?.uid;

	const { data: cookieToken } = useQuery({
		queryKey: ["githubOAuthCookie", currentUser?.uid],
		queryFn: async () => {
			if (typeof window === "undefined" || !currentUser?.uid) {
				return null;
			}

			const token = getCookie("github_oauth_token");
			const success = getCookie("github_oauth_success");
			const error = getCookie("github_oauth_error");

			if (error) {
				console.error("❌ OAuth error cookie detected:", error);
				document.cookie = "github_oauth_error=; Path=/; Max-Age=0";
				throw new Error(error);
			}

			if (!token || !success) {
				return null;
			}

			try {
				// Store token in Redux and Firestore
				await storeGithubToken(token, currentUser.uid);

				// Clean up cookies
				document.cookie = "github_oauth_token=; Path=/; Max-Age=0";
				document.cookie = "github_oauth_success=; Path=/; Max-Age=0";

				// Clean URL if it has github_oauth param
				const urlParams = new URLSearchParams(window.location.search);
				if (urlParams.get("github_oauth")) {
					const newUrl = window.location.pathname;
					window.history.replaceState({}, "", newUrl);
				}

				return token;
			} catch (error) {
				console.error("❌ Failed to store token from cookie:", error);
				// Clean up on error
				document.cookie = "github_oauth_token=; Path=/; Max-Age=0";
				document.cookie = "github_oauth_success=; Path=/; Max-Age=0";
				throw error;
			}
		},
		enabled: queryEnabled,
		retry: false,
		staleTime: 0, // Don't cache - always check fresh
		refetchInterval: (query) => {
			// If cookies exist but query returned null, keep checking every 2 seconds
			if (typeof window === "undefined" || !currentUser?.uid) {
				console.log("⏸️ Refetch interval: No window or user");
				return false;
			}
			const hasToken = getCookie("github_oauth_token");
			const hasSuccess = getCookie("github_oauth_success");

			const shouldRefetch = hasToken && hasSuccess && !query.state.data;
			return shouldRefetch ? 2000 : false;
		},
		refetchOnWindowFocus: true,
		refetchOnMount: true,
	});

	// Store token in both Redux and Firestore
	const storeGithubToken = async (token, userUid) => {
		try {
			// Store in Redux
			const userDocRef = doc(db, "users", userUid);
			await setDoc(userDocRef, { githubToken: token }, { merge: true });
			dispatch(setGithubToken({ token }));
		} catch (error) {
			console.error("Error storing GitHub token:", error);
			throw error;
		}
	};

	// Load GitHub connection from Firestore when user is logged in
	const { data: firestoreGithub, isLoading: isLoadingFirestore } = useQuery({
		queryKey: ["githubFirestore", currentUser?.uid],
		queryFn: async () => {
			if (!currentUser?.uid) return null;
			try {
				const userDocRef = doc(db, "users", currentUser.uid);
				const snap = await getDoc(userDocRef);
				if (!snap.exists()) return null;
				const data = snap.data() || {};
				const token = data.githubToken || null;
				const userInfo = data.githubUserInfo || null;
				// Update Redux from Firestore if needed
				if (token) {
					dispatch(setGithubToken({ token }));
				}
				if (userInfo) {
					dispatch(setGithubUserInfo(userInfo));
				}
				return { token, userInfo };
			} catch (err) {
				console.error("Error loading GitHub data from Firestore:", err);
				return null;
			}
		},
		enabled: !!currentUser?.uid,
		staleTime: 1000 * 60 * 5,
		retry: 1,
	});

	// Connect to GitHub (opens in new tab)
	const connectGithubMutation = useMutation({
		mutationFn: async ({ cb }) => {
			try {
				if (!currentUser?.uid) {
					throw new Error("User must be logged in to connect GitHub");
				}

				// Generate state for OAuth security
				const state = Math.random().toString(36).substring(2, 15);
				sessionStorage.setItem("github_oauth_state", state);
				sessionStorage.setItem("github_oauth_redirect", window.location.href);

				// Open GitHub OAuth in new tab
				const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

				if (!clientId) {
					throw new Error(
						"GitHub Client ID not configured. Please set NEXT_PUBLIC_GITHUB_CLIENT_ID"
					);
				}

				// Use env var if provided, otherwise use /api/auth/callback
				const baseUrl = window.location.origin;
				const redirectUri =
					process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI ||
					`${baseUrl}/api/auth/callback`;
				const scope = "repo,user";

				const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

				// Open in new tab
				window.open(githubAuthUrl);
			} catch (error) {
				console.error("GitHub connection error:", error);
				throw error;
			}
		},
	});

	// Get token and user info from Redux store
	const reduxToken = useSelector((state) => state.auth.githubToken);
	const reduxUserInfo = useSelector((state) => state.auth.githubUserInfo);

	// Priority: cookieToken (from OAuth) > githubToken (Redux)
	const finalToken = cookieToken || reduxToken || firestoreGithub?.token;
	const isConnected = !!finalToken;

	// Fetch GitHub user info when connected
	const { data: fetchedUserInfo, isLoading: isLoadingUserInfo } = useQuery({
		queryKey: ["githubUserInfo", finalToken],
		queryFn: async () => {
			if (!finalToken) {
				return null;
			}

			try {
				const userInfo = await getGitHubUserDetails(finalToken);

				// Store in Redux
				dispatch(setGithubUserInfo(userInfo));

				// Store in Firestore if user exists
				if (currentUser?.uid) {
					try {
						const userDocRef = doc(db, "users", currentUser.uid);
						await setDoc(
							userDocRef,
							{ githubUserInfo: userInfo },
							{ merge: true }
						);
					} catch (error) {
						console.error(
							"Error storing GitHub user info in Firestore:",
							error
						);
					}
				}

				return userInfo;
			} catch (error) {
				console.error("Error fetching GitHub user info:", error);
				return null;
			}
		},
		enabled:
			isConnected &&
			!!finalToken &&
			!reduxUserInfo &&
			!(firestoreGithub && firestoreGithub.userInfo),
		staleTime: 1000 * 60 * 5, // 5 minutes
		retry: 1,
	});

	const effectiveUserInfo =
		reduxUserInfo || firestoreGithub?.userInfo || fetchedUserInfo;

	return {
		connectGithub: connectGithubMutation.mutate,
		isLoading:
			connectGithubMutation.isPending ||
			isLoadingUserInfo ||
			isLoadingFirestore,
		error: connectGithubMutation.error,
		githubToken: finalToken,
		isConnected: isConnected,
		githubUserInfo: effectiveUserInfo,
	};
};

export default useGithubConnection;
