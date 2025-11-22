import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";

const useLemonSqueezy = () => {
	const { user } = useSelector((state) => state.auth);
	const router = useRouter();

	const createCheckout = useMutation({
		mutationFn: async ({ variantId, price }) => {
			if (!user?.uid) {
				throw new Error("User must be logged in to purchase");
			}

			if (!variantId) {
				throw new Error("Product ID is required");
			}

			try {
				// Create or update user document in Firestore
				const userRef = doc(db, "users", user.uid);
				await setDoc(
					userRef,
					{
						email: user.email,
						displayName: user.displayName,
						photoURL: user.photoURL,
						updatedAt: new Date().toISOString(),
					},
					{ merge: true }
				);

				const response = await fetch("/api/create-payment", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						variantId: parseInt(variantId),
						userId: user.uid,
						price: price,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(
						data?.errors?.[0]?.detail || "Failed to create checkout"
					);
				}

				if (!data.url) {
					throw new Error("No checkout URL received from server");
				}

				return data;
			} catch (error) {
				console.error("Checkout creation error:", error);
				throw new Error(
					error.message ||
						"An unexpected error occurred while creating checkout"
				);
			}
		},
		onSuccess: (data) => {
			// Instead of redirecting to Lemon Squeezy, redirect to home page
			router.push("/");
			return data;
		},
		onError: (error) => {
			console.error("Error creating checkout:", error);
			throw error;
		},
	});

	const getSubscriptionStatus = async () => {
		if (!user?.uid) return null;

		try {
			const userRef = doc(db, "users", user.uid);
			const userDoc = await getDoc(userRef);

			if (!userDoc.exists()) return null;

			const userData = userDoc.data();
			return {
				subscriptionType: userData.subscriptionType,
				subscriptionId: userData.subscriptionId,
				subscriptionStatus: userData.subscriptionStatus,
				updatedAt: userData.updatedAt,
				subscriptionStartDate: userData.subscriptionStartDate,
				subscriptionEndDate: userData.subscriptionEndDate,
				price: userData.price,
			};
		} catch (error) {
			console.error("Error fetching subscription status:", error);
			return null;
		}
	};

	return {
		createCheckout: createCheckout.mutateAsync,
		isLoading: createCheckout.isPending,
		error: createCheckout.error,
		getSubscriptionStatus,
	};
};

export default useLemonSqueezy;
