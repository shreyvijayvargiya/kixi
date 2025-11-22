import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { setSubscriptionStatus } from "../../redux/slices/authSlice";
import { useQuery } from "@tanstack/react-query";

const useSubscriptionStatus = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);

	// Query to fetch user's subscription status
	const { data: userData, isLoading } = useQuery({
		queryKey: ["userSubscription", user?.uid],
		queryFn: async () => {
			if (!user?.uid) return null;

			const userRef = doc(db, "users", user.uid);
			const userSnap = await getDoc(userRef);

			if (userSnap.exists()) {
				return userSnap.data();
			}
			return null;
		},
		enabled: !!user?.uid,
		staleTime: 1000 * 60, // Consider data fresh for 1 minute
		cacheTime: 1000 * 60 * 5, // Keep data in cache for 5 minutes
	});

	// Update Redux store when user data changes
	useEffect(() => {
		if (userData) {
			dispatch(
				setSubscriptionStatus({
					status: userData.subscriptionStatus || "inactive",
					subscriptionId: userData.subscriptionId,
					subscriptionType: userData.subscriptionType,
					price: userData.price,
					subscriptionStartDate: userData.subscriptionStartDate,
					subscriptionEndDate: userData.subscriptionEndDate,
					lastWebhookEvent: userData.lastWebhookEvent,
				})
			);
		}
	}, [userData, dispatch]);

	// Get current subscription status from Redux
	const { subscriptionStatus } = useSelector((state) => state.auth);

	return {
		subscriptionStatus,
		isLoading,
	};
};

export default useSubscriptionStatus;
