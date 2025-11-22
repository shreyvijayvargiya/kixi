import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useDispatch } from "react-redux";
import { setSubscriptionStatus } from "../../redux/slices/authSlice";

const useSubscriptionCheck = () => {
	const dispatch = useDispatch();
	const { user, isAuthenticated } = useSelector((state) => state.auth);

	useEffect(() => {
		const checkSubscription = async () => {
			if (!isAuthenticated || !user?.uid) return;

			try {
				const userDoc = await getDoc(doc(db, "users", user.uid));
				if (userDoc.exists()) {
					const userData = userDoc.data();
					dispatch(
						setSubscriptionStatus({
							status: userData.subscriptionStatus || null,
							subscriptionId: userData.subscriptionId || null,
							subscriptionType: userData.subscriptionType || null,
							price: userData.price || null,
							subscriptionStartDate: userData.subscriptionStartDate || null,
							subscriptionEndDate: userData.subscriptionEndDate || null,
							lastWebhookEvent: userData.lastWebhookEvent || null,
						})
					);
				}
			} catch (error) {
				console.error("Error checking subscription status:", error);
			}
		};

		checkSubscription();
	}, [isAuthenticated, user?.uid, dispatch]);

	return null;
};

export default useSubscriptionCheck;
