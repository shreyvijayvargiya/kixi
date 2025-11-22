import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import crypto from "crypto";
import { store } from "../../redux/store";
import {
	setSubscriptionStatus,
	setUserInStore,
} from "../../redux/slices/authSlice";

export const config = {
	api: {
		bodyParser: false, // Disable the default body parser
	},
};

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		// Get the raw body
		const chunks = [];
		for await (const chunk of req) {
			chunks.push(chunk);
		}
		const rawBody = Buffer.concat(chunks).toString("utf8");

		// Parse the body for processing
		const event = JSON.parse(rawBody);

		const signature = req.headers["x-signature"];

		// Verify webhook signature
		if (!process.env.LEMON_SQUEEZY_WEBHOOK_SECRET) {
			return res.status(500).json({ message: "Webhook configuration error" });
		}

		// Create HMAC using the webhook secret
		const hmac = crypto.createHmac(
			"sha256",
			process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
		);
		// Update HMAC with the raw request body
		hmac.update(rawBody);
		// Get the digest in hex format
		const digest = hmac.digest("hex");

		// Compare the signatures
		if (signature !== digest) {
			console.error("Invalid webhook signature", {
				received: signature,
				calculated: digest,
				secret: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
					? "present"
					: "missing",
				rawBody: rawBody,
			});
			return res.status(401).json({ message: "Invalid signature" });
		}

		// Handle different event types
		let updateResult;
		switch (event.meta.event_name) {
			case "subscription_created":
			case "subscription_updated":
				updateResult = await handleSubscriptionUpdate(event.data, event.meta);
				break;
			case "subscription_cancelled":
				updateResult = await handleSubscriptionCancellation(event.data);
				break;
			default:
				"Unhandled event type:", event.meta.event_name;
		}

		// Update Redux store if we have a result
		if (updateResult) {
			// store.dispatch(setUserInStore(updateResult));
			store.dispatch(
				setSubscriptionStatus({
					subscriptionStatus: updateResult.status,
					subscriptionId: updateResult.subscriptionId,
					subscriptionType: updateResult.subscriptionType,
					price: updateResult.price,
					subscriptionStartDate: updateResult.subscriptionStartDate,
					subscriptionEndDate: updateResult.subscriptionEndDate,
				})
			);
		}

		return res.status(200).json({ received: true });
	} catch (error) {
		console.error("Webhook error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

async function handleSubscriptionUpdate(data, meta) {
	try {
		// Extract data from the webhook payload
		const { attributes } = data;
		const { status, variant_id, total, total_usd } = attributes;
		const { custom_data } = meta;
		const user_id = custom_data?.user_id;

		if (!user_id) {
			console.error("No user_id in webhook data");
			return;
		}

		// Get the user document
		const userRef = doc(db, "users", user_id);
		const userDoc = await getDoc(userRef);

		if (!userDoc.exists()) {
			console.error("User document not found:", user_id);
			return;
		}

		// Get current user data
		const currentUserData = userDoc.data();

		// Determine subscription type based on variant_id
		let subscriptionType = "cancelled";
		if (variant_id) {
			switch (variant_id.toString()) {
				case "826440":
					subscriptionType = "monthly";
					break;
				case "840356":
					subscriptionType = "yearly";
					break;
				case "803582":
					subscriptionType = "oneTime";
					break;
			}
		}

		const price = custom_data?.price;

		// Calculate subscription dates
		const now = new Date();
		const subscriptionStartDate = new Date(now);
		const subscriptionEndDate = new Date(now);

		// Add appropriate duration based on subscription type
		if (subscriptionType === "monthly") {
			subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
		} else if (subscriptionType === "yearly") {
			subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
		} else if (subscriptionType === "oneTime") {
			subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 100);
		}

		// Convert dates to ISO strings
		const startDateISO = subscriptionStartDate.toISOString();
		const endDateISO = subscriptionEndDate.toISOString();

		// Prepare user data for update
		const userData = {
			...currentUserData,
			subscriptionStatus: status || "cancelled",
			subscriptionId: data.id || null,
			variantId: variant_id || null,
			subscriptionType: subscriptionType,
			price: price || total || total_usd || 0,
			subscriptionStartDate: startDateISO,
			subscriptionEndDate: endDateISO,
			updatedAt: new Date().toISOString(),
			lastWebhookEvent: {
				type: meta.event_name || "unknown",
				timestamp: new Date().toISOString(),
				status: status || "inactive",
				variantId: variant_id || null,
				subscriptionType: subscriptionType,
				price: price || total || total_usd || 0,
			},
		};

		// Update the user's subscription status
		await updateDoc(userRef, userData);

		// Prepare data for Redux store update
		const storeUpdateData = {
			uid: user_id,
			email: currentUserData.email,
			displayName: currentUserData.displayName,
			photoURL: currentUserData.photoURL,
			subscriptionStatus: status || "inactive",
			subscriptionId: data.id || null,
			subscriptionType: subscriptionType,
			price: price || total || total_usd || 0,
			subscriptionStartDate: startDateISO,
			subscriptionEndDate: endDateISO,
		};

		// Update Redux store
		store.dispatch(setUserInStore(currentUserData));
		store.dispatch(
			setSubscriptionStatus({
				subscriptionStatus: status || "inactive",
				subscriptionId: data.id || null,
				subscriptionType: subscriptionType,
				price: price || total || total_usd || 0,
				subscriptionStartDate: startDateISO,
				subscriptionEndDate: endDateISO,
			})
		);

		// Return the updated status for client-side updates
		return storeUpdateData;
	} catch (error) {
		console.error("Error updating subscription:", error);
		throw error;
	}
}

async function handleSubscriptionCancellation(data) {
	try {
		// Extract data from the webhook payload
		const { attributes } = data;
		const { custom_data } = attributes;
		const user_id = custom_data?.user_id;

		if (!user_id) {
			console.error("No user_id in webhook data");
			return;
		}

		// Get the user document
		const userRef = doc(db, "users", user_id);
		const userDoc = await getDoc(userRef);

		if (!userDoc.exists()) {
			console.error("User document not found:", user_id);
			return;
		}

		// Update the user's subscription status
		await updateDoc(userRef, {
			subscriptionStatus: "cancelled",
			subscriptionId: null,
			variantId: null,
			subscriptionType: null,
			price: null,
			updatedAt: new Date().toISOString(),
			lastWebhookEvent: {
				type: "subscription_cancellation",
				timestamp: new Date().toISOString(),
			},
		});

		// Return the updated status for client-side updates
		return {
			userId: user_id,
			status: "cancelled",
			isPro: false,
			variantId: null,
			subscriptionType: null,
			price: null,
			subscriptionId: null,
			subscriptionStartDate: null,
			subscriptionEndDate: null,
		};
	} catch (error) {
		console.error("Error cancelling subscription:", error);
		throw error;
	}
}
