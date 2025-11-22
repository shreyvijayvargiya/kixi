import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const { userId, subscriptionId } = req.body;

		if (!userId || !subscriptionId) {
			return res
				.status(400)
				.json({ message: "User ID and subscription ID are required" });
		}

		// Get user document from Firestore to verify subscription
		const userRef = doc(db, "users", userId);
		const userDoc = await getDoc(userRef);

		if (!userDoc.exists()) {
			return res.status(404).json({ message: "User not found" });
		}

		const userData = userDoc.data();

		// Verify the subscription belongs to the user
		if (userData.lastWebhookEvent?.subscriptionId !== subscriptionId) {
			return res.status(403).json({ message: "Invalid subscription" });
		}

		// Call Polar API to cancel the subscription
		const polarApiKey =
			process.env.POLAR_API_KEY || process.env.POLAR_ACCESS_TOKEN;

		if (!polarApiKey) {
			console.error("Polar API key not configured");
			return res.status(500).json({
				message: "Server configuration error: Polar API key not found",
			});
		}

		console.log(subscriptionId, "subscriptionId");

		const response = await fetch(
			`https://api.polar.sh/v1/subscriptions/${subscriptionId}`,
			{
				method: "PATCH",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${polarApiKey}`,
				},
				body: JSON.stringify({
					cancel_at_period_end: true,
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error("Polar API error:", errorData);
			return res.status(response.status || 500).json({
				message:
					errorData.message ||
					errorData.error ||
					"Failed to cancel subscription",
				error: errorData,
			});
		}

		const result = await response.json().catch(() => ({}));

		// Note: Firestore update will be handled by the Polar webhook
		// when it receives the subscription.canceled event
		console.log(
			"Subscription cancellation initiated via Polar API:",
			subscriptionId
		);

		return res.status(200).json({
			message: "Subscription cancellation initiated successfully",
			subscriptionId: subscriptionId,
			// Polar webhook will update Firestore automatically
		});
	} catch (error) {
		console.error("Subscription cancellation error:", error);
		return res.status(500).json({
			message: error.message || "Failed to cancel subscription",
		});
	}
}
