import { useMutation, useQuery } from "@tanstack/react-query";
import {
	signInWithPopup,
	GoogleAuthProvider,
	onAuthStateChanged,
	signOut as firebaseSignOut,
} from "firebase/auth";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import {
	setSubscriptionStatus,
	setUserInStore,
} from "../../redux/slices/authSlice";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const useGoogleAuth = ({ cb = () => {} } = {}) => {
	const dispatch = useDispatch();
	const provider = new GoogleAuthProvider();

	// Helper function to safely parse dates
	const safeParseDate = (dateString) => {
		if (!dateString) return null;
		try {
			// If it's a Firestore Timestamp object
			if (dateString.seconds && dateString.nanoseconds) {
				return new Date(
					dateString.seconds * 1000 + dateString.nanoseconds / 1000000
				).toISOString();
			}
			// If it's already an ISO string
			const date = new Date(dateString);
			return isNaN(date.getTime()) ? null : date.toISOString();
		} catch (error) {
			console.error("Error parsing date:", error);
			return null;
		}
	};
	// Check and create user profile in Firestore
	const ensureUserProfile = async (user) => {
		if (!user || !user.uid) return;

		const userDocRef = doc(db, "users", user.uid);
		const userDocSnap = await getDoc(userDocRef);

		if (!userDocSnap.exists()) {
			// User profile does not exist, create it
			const userDataToStore = {
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL,
				createdAt: new Date().toISOString(),
				emailVerified: user.emailVerified,
			};
			await setDoc(userDocRef, userDataToStore);
			return userDataToStore;
		} else {
			return userDocSnap.data();
		}
	};

	// Query for checking subscription status
	const checkSubscriptionStatus = async (uid) => {
		try {
			const userDoc = await getDoc(doc(db, "users", uid));
			if (userDoc.exists()) {
				const userData = userDoc.data();

				// Format the data to match Redux store structure
				const formattedData = {
					subscriptionStatus: userData.subscriptionStatus || null,
					subscriptionId: userData.subscriptionId || null,
					subscriptionType: userData.subscriptionType || null,
					price: userData.price || null,
					subscriptionStartDate: userData.subscriptionStartDate
						? safeParseDate(userData.subscriptionStartDate)
						: null,
					subscriptionEndDate: userData.subscriptionEndDate
						? safeParseDate(userData.subscriptionEndDate)
						: null,
					lastWebhookEvent: userData.lastWebhookEvent || null,
				};

				dispatch(setSubscriptionStatus(formattedData));
			}
		} catch (error) {
			console.error("Error checking subscription status:", error);
		}
	};

	// Query for auth state
	const { data: authState } = useQuery({
		queryKey: ["authState"],
		queryFn: () => {
			return new Promise((resolve) => {
				// First check if we have a valid cookie
				const userId = getCookie("userId");
				const userData = getCookie("userData");

				// Only proceed if both cookies exist and userData is not undefined
				if (
					userId &&
					typeof userId !== "undefined" &&
					userData &&
					typeof userData !== "undefined"
				) {
					try {
						const parsedUserData = JSON.parse(userData);
						// Verify the parsed data has required fields
						if (parsedUserData && parsedUserData.uid && parsedUserData.email) {
							// If we have a cookie, check if the user is already signed in
							const currentUser = auth.currentUser;
							if (currentUser) {
								dispatch(
									setUserInStore({
										userData: parsedUserData,
									})
								);
								// Fetch latest subscription status
								checkSubscriptionStatus(currentUser.uid);
								resolve(parsedUserData);
								return;
							}
						}
					} catch (error) {
						console.error("Error parsing user data:", error);
						// If parsing fails, clear invalid cookies
						deleteCookie("userId");
						deleteCookie("userData");
					}
				}

				// If no valid session found, set up the listener
				const unsubscribe = onAuthStateChanged(auth, async (user) => {
					if (user) {
						const userData = {
							uid: user.uid,
							email: user.email,
							displayName: user.displayName,
							photoURL: user.photoURL,
						};

						dispatch(setUserInStore({ userData }));

						// Fetch latest subscription status
						await checkSubscriptionStatus(user.uid);

						// Ensure user profile in Firestore
						await ensureUserProfile(user);

						resolve(userData);
					} else {
						// Clear cookies on sign out
						deleteCookie("userId");
						deleteCookie("userData");
						resolve(null);
					}
					unsubscribe();
				});
			});
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
		cacheTime: 1000 * 60 * 30, // 30 minutes
	});

	const googleAuthMutation = useMutation({
		mutationFn: async ({ cb }) => {
			try {
				const result = await signInWithPopup(auth, provider);
				const user = result.user;

				const userData = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
					photoURL: user.photoURL,
				};

				// Check subscription status
				await checkSubscriptionStatus(user.uid);

				// Ensure user profile in Firestore
				const userProfile = await ensureUserProfile(user);
				// Dispatch user data to Redux store
				dispatch(setUserInStore({ userData }));

				// Wait for a short moment to ensure state updates are complete
				await new Promise((resolve) => setTimeout(resolve, 100));

				// Call the callback if provided
				if (cb) {
					cb();
				}

				return userData;
			} catch (error) {
				console.error("Google auth error:", error);
				throw error;
			}
		},
	});

	const signOut = async () => {
		try {
			await firebaseSignOut(auth);
		} catch (error) {
			console.error("Sign out error:", error);
			throw error;
		}
	};

	return {
		signInWithGoogle: googleAuthMutation.mutate,
		signOut,
		isLoading: googleAuthMutation.isPending,
		error: googleAuthMutation.error,
		user: authState || googleAuthMutation.data,
	};
};

export default useGoogleAuth;
