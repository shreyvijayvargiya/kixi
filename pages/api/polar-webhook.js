import { db } from "../../lib/firebase";
import {
	doc,
	updateDoc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
	addDoc,
} from "firebase/firestore";
import crypto from "crypto";

export const config = {
	api: {
		bodyParser: false, // Disable the default body parser for raw body access
	},
};

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		// Get the raw body for signature verification
		const chunks = [];
		for await (const chunk of req) {
			chunks.push(chunk);
		}
		const rawBody = Buffer.concat(chunks).toString("utf8");

		const signature = req.headers["polar-signature"];

		// Verify webhook signature if webhook secret is configured
		if (process.env.POLAR_WEBHOOK_SECRET) {
			const expectedSignature = crypto
				.createHmac("sha256", process.env.POLAR_WEBHOOK_SECRET)
				.update(rawBody)
				.digest("hex");

			if (signature !== `sha256=${expectedSignature}`) {
				console.error("Invalid webhook signature");
				return res.status(401).json({ message: "Invalid signature" });
			}
		}

		const event = JSON.parse(rawBody);

		// Handle different event types
		switch (event.type) {
			// Checkout events
			case "checkout.created":
				// await handleCheckoutCreated(event.data);
				break;
			case "checkout.updated":
				// await handleCheckoutUpdated(event.data);
				break;
			case "checkout.completed":
				await handleCheckoutCompleted(event.data);
				break;
			// Subscription events
			case "subscription.created":
				await handleSubscriptionCreated(event.data);
				break;
			case "subscription.updated":
				await handleSubscriptionUpdated(event.data);
				break;
			case "subscription.canceled":
			case "subscription.cancelled":
				await handleSubscriptionCanceled(event.data);
				break;
			case "subscription.revoked":
				await handleSubscriptionRevoked(event.data);
				break;
			// Payment events
			case "order.updated":
				await handleOrderUpdated(event.data);
				break;
			case "order.paid":
				await handleOrderPaid(event.data);
				break;
			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		return res.status(200).json({ message: "Webhook processed successfully" });
	} catch (error) {
		console.error("Error processing Polar webhook:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

// Helper function to find user by email if userId is not available
async function findUserByEmail(email) {
	if (!email) return null;
	try {
		const usersRef = collection(db, "users");
		const q = query(usersRef, where("email", "==", email));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			const userDoc = querySnapshot.docs[0];
			return { userId: userDoc.id, userData: userDoc.data() };
		}
		return null;
	} catch (error) {
		console.error("Error finding user by email:", error);
		return null;
	}
}

// Helper function to extract user info from checkout/subscription data
async function getUserInfo(data) {
	// Try to get userId from metadata first
	const metadata = data.metadata || {};
	const userId = metadata.userId;
	const userEmail = metadata.userEmail || data.customer_email || data.email;

	// If userId is in metadata, use it
	if (userId) {
		const userRef = doc(db, "users", userId);
		const userDoc = await getDoc(userRef);
		if (userDoc.exists()) {
			return { userId, userData: userDoc.data() };
		}
	}

	// Otherwise, try to find by email
	if (userEmail) {
		const userInfo = await findUserByEmail(userEmail);
		if (userInfo) {
			return userInfo;
		}
	}

	return null;
}

// Helper function to update user subscription
async function updateUserSubscription(userId, subscriptionData) {
	try {
		const userRef = doc(db, "users", userId);
		const userDoc = await getDoc(userRef);

		if (!userDoc.exists()) {
			console.error("User document not found:", userId);
			return false;
		}

		const currentUserData = userDoc.data();
		const userData = {
			...currentUserData,
			...subscriptionData,
			updatedAt: new Date().toISOString(),
		};

		await updateDoc(userRef, userData);
		return true;
	} catch (error) {
		console.error("Error updating user subscription:", error);
		return false;
	}
}

// Helper function to save payment details to gt-payments collection
async function savePaymentDetails(paymentData, userInfo, subscriptionData) {
	try {
		const { userId, userData } = userInfo;

		// Extract all relevant payment information
		const paymentRecord = {
			// User information
			userId: userId,
			userEmail:
				userData?.email ||
				paymentData.customer_email ||
				paymentData.email ||
				null,
			userName:
				userData?.name ||
				userData?.displayName ||
				paymentData.customer_name ||
				null,

			// Payment identifiers
			paymentId: paymentData.id || null,
			transactionId:
				paymentData.id ||
				paymentData.checkout_id ||
				paymentData.subscription_id ||
				paymentData.payment_intent_id ||
				null,
			checkoutId: paymentData.checkout_id || null,
			subscriptionId:
				paymentData.subscription_id || subscriptionData?.subscriptionId || null,

			// Payment amounts
			amount: paymentData.amount || subscriptionData?.price || 0,
			currency: paymentData.currency || "USD",
			amountFormatted: paymentData.amount
				? new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: paymentData.currency || "USD",
					}).format(
						paymentData.amount > 1000
							? paymentData.amount / 100
							: paymentData.amount
					)
				: null,

			// Subscription details
			subscriptionType:
				subscriptionData?.subscriptionType ||
				paymentData.subscription_type ||
				"oneTime",
			subscriptionStatus:
				subscriptionData?.subscriptionStatus || paymentData.status || "active",
			planName:
				paymentData.product_name ||
				paymentData.plan_name ||
				paymentData.metadata?.planName ||
				"Premium Plan",

			// Dates - with proper validation
			paymentDate: (() => {
				try {
					if (!paymentData.created_at) return new Date().toISOString();

					// Check if it's already a valid date string
					if (typeof paymentData.created_at === "string") {
						const date = new Date(paymentData.created_at);
						if (!isNaN(date.getTime())) return date.toISOString();
					}

					// Check if it's a number (timestamp)
					if (typeof paymentData.created_at === "number") {
						// If it's less than 10000000000, it's in seconds, convert to milliseconds
						const timestamp =
							paymentData.created_at < 10000000000
								? paymentData.created_at * 1000
								: paymentData.created_at;
						const date = new Date(timestamp);
						if (!isNaN(date.getTime())) return date.toISOString();
					}

					return new Date().toISOString();
				} catch (error) {
					console.warn("Error parsing payment date:", error);
					return new Date().toISOString();
				}
			})(),
			subscriptionStartDate: subscriptionData?.subscriptionStartDate || null,
			subscriptionEndDate: subscriptionData?.subscriptionEndDate || null,
			nextBillingDate: (() => {
				try {
					if (!paymentData.current_period_end) return null;

					if (typeof paymentData.current_period_end === "number") {
						const timestamp =
							paymentData.current_period_end < 10000000000
								? paymentData.current_period_end * 1000
								: paymentData.current_period_end;
						const date = new Date(timestamp);
						if (!isNaN(date.getTime())) return date.toISOString();
					}

					return null;
				} catch (error) {
					console.warn("Error parsing next billing date:", error);
					return null;
				}
			})(),

			// Payment method
			paymentMethod:
				paymentData.payment_method ||
				paymentData.metadata?.paymentMethod ||
				"Credit Card",
			paymentMethodDetails: paymentData.payment_method_details || null,

			// Webhook event information
			webhookEvent: {
				type: "order.paid",
				timestamp: new Date().toISOString(),
				status: "completed",
			},

			// Additional metadata
			metadata: paymentData.metadata || {},

			// Raw payment data (store full object for reference)
			rawPaymentData: paymentData,

			// Record timestamps
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Save to gt-payments collection
		const paymentsRef = collection(db, "gt-payments");
		const paymentDocRef = await addDoc(paymentsRef, paymentRecord);

		console.log("Payment details saved to gt-payments:", paymentDocRef.id);
		return paymentDocRef.id;
	} catch (error) {
		console.error("Error saving payment details:", error);
		// Don't throw - payment processing should continue even if saving fails
		return null;
	}
}

// Helper function to send subscription confirmation email
async function sendSubscriptionConfirmationEmail(
	paymentData,
	userInfo,
	subscriptionData = null
) {
	try {
		const baseUrl =
			process.env.NEXT_PUBLIC_BASE_URL || "https://gettemplate.com";

		// Extract customer information
		const customerEmail =
			paymentData.customer_email ||
			paymentData.email ||
			userInfo?.userData?.email ||
			paymentData.metadata?.userEmail;

		const customerName =
			paymentData.customer_name ||
			userInfo?.userData?.name ||
			userInfo?.userData?.displayName ||
			paymentData.metadata?.userName ||
			"Valued Customer";

		if (!customerEmail) {
			console.warn("No customer email found, skipping confirmation email");
			return;
		}

		// Extract plan information
		const planName =
			paymentData.product_name ||
			paymentData.plan_name ||
			paymentData.metadata?.planName ||
			"Premium Plan";

		// Extract amount (convert from cents if needed)
		// Try multiple sources for amount
		let amount =
			paymentData.amount ||
			paymentData.price_amount ||
			paymentData.total ||
			subscriptionData?.price ||
			0;

		if (amount > 1000) {
			// Likely in cents, convert to dollars
			amount = amount / 100;
		}

		// Ensure amount is a valid number (default to 0 if invalid)
		if (typeof amount !== "number" || isNaN(amount)) {
			amount = 0;
		}

		// Extract dates - with proper validation
		const startDate = (() => {
			try {
				if (paymentData.subscriptionStartDate) {
					const date = new Date(paymentData.subscriptionStartDate);
					if (!isNaN(date.getTime())) return date.toISOString();
				}

				if (paymentData.current_period_start) {
					const timestamp =
						typeof paymentData.current_period_start === "number"
							? paymentData.current_period_start < 10000000000
								? paymentData.current_period_start * 1000
								: paymentData.current_period_start
							: paymentData.current_period_start;
					const date = new Date(timestamp);
					if (!isNaN(date.getTime())) return date.toISOString();
				}

				return new Date().toISOString();
			} catch (error) {
				console.warn("Error parsing start date:", error);
				return new Date().toISOString();
			}
		})();

		const endDate = (() => {
			try {
				if (paymentData.subscriptionEndDate) {
					const date = new Date(paymentData.subscriptionEndDate);
					if (!isNaN(date.getTime())) return date.toISOString();
				}

				if (paymentData.current_period_end) {
					const timestamp =
						typeof paymentData.current_period_end === "number"
							? paymentData.current_period_end < 10000000000
								? paymentData.current_period_end * 1000
								: paymentData.current_period_end
							: paymentData.current_period_end;
					const date = new Date(timestamp);
					if (!isNaN(date.getTime())) return date.toISOString();
				}

				return null;
			} catch (error) {
				console.warn("Error parsing end date:", error);
				return null;
			}
		})();

		const nextBillingDate = (() => {
			try {
				if (paymentData.nextBillingDate) {
					const date = new Date(paymentData.nextBillingDate);
					if (!isNaN(date.getTime())) return date.toISOString();
				}

				if (paymentData.current_period_end) {
					const timestamp =
						typeof paymentData.current_period_end === "number"
							? paymentData.current_period_end < 10000000000
								? paymentData.current_period_end * 1000
								: paymentData.current_period_end
							: paymentData.current_period_end;
					const date = new Date(timestamp);
					if (!isNaN(date.getTime())) return date.toISOString();
				}

				return null;
			} catch (error) {
				console.warn("Error parsing next billing date:", error);
				return null;
			}
		})();

		// Extract transaction/payment info
		let transactionId =
			paymentData.id ||
			paymentData.checkout_id ||
			paymentData.subscription_id ||
			paymentData.payment_intent_id ||
			paymentData.order_id ||
			`TXN-${Date.now()}`;

		// Ensure transactionId is a string
		if (!transactionId || typeof transactionId !== "string") {
			transactionId = `TXN-${Date.now()}`;
		}

		// Convert to string if it's a number
		transactionId = String(transactionId);

		const purchaseDate = (() => {
			try {
				if (!paymentData.created_at) return new Date().toISOString();

				// Check if it's already a valid date string
				if (typeof paymentData.created_at === "string") {
					const date = new Date(paymentData.created_at);
					if (!isNaN(date.getTime())) return date.toISOString();
				}

				// Check if it's a number (timestamp)
				if (typeof paymentData.created_at === "number") {
					// If it's less than 10000000000, it's in seconds, convert to milliseconds
					const timestamp =
						paymentData.created_at < 10000000000
							? paymentData.created_at * 1000
							: paymentData.created_at;
					const date = new Date(timestamp);
					if (!isNaN(date.getTime())) return date.toISOString();
				}

				return new Date().toISOString();
			} catch (error) {
				console.warn("Error parsing purchase date:", error);
				return new Date().toISOString();
			}
		})();

		// Extract payment method
		const paymentMethod =
			paymentData.payment_method ||
			paymentData.metadata?.paymentMethod ||
			"Credit Card";

		// Validate all required fields before sending
		if (
			!customerName ||
			!customerEmail ||
			!planName ||
			amount === undefined ||
			amount === null ||
			!transactionId
		) {
			console.error("Missing required fields for email:", {
				customerName: customerName || "MISSING",
				customerEmail: customerEmail || "MISSING",
				planName: planName || "MISSING",
				amount: amount,
				transactionId: transactionId || "MISSING",
				paymentDataKeys: Object.keys(paymentData),
				paymentDataSample: {
					id: paymentData.id,
					amount: paymentData.amount,
					price_amount: paymentData.price_amount,
					total: paymentData.total,
					customer_email: paymentData.customer_email,
					product_name: paymentData.product_name,
				},
				subscriptionDataPrice: subscriptionData?.price,
			});
			console.warn(
				"Skipping subscription confirmation email due to missing required fields"
			);
			return;
		}

		// Prepare email payload - ensure all required fields are strings/numbers
		const emailPayload = {
			customerName: String(customerName || "Valued Customer"),
			customerEmail: String(customerEmail),
			planName: String(planName || "Premium Plan"),
			amount: Number(amount || 0),
			currency: paymentData.currency || "USD",
			transactionId: String(transactionId),
			startDate: startDate || undefined,
			endDate: endDate || undefined,
			nextBillingDate: nextBillingDate || undefined,
			paymentMethod: paymentMethod || undefined,
			purchaseDate: purchaseDate || new Date().toISOString(),
			dashboardUrl: `${baseUrl}/dashboard`,
		};

		// Log the payload being sent for debugging
		console.log("Sending subscription confirmation email with payload:", {
			customerName: emailPayload.customerName,
			customerEmail: emailPayload.customerEmail,
			planName: emailPayload.planName,
			amount: emailPayload.amount,
			transactionId: emailPayload.transactionId,
			hasStartDate: !!emailPayload.startDate,
			hasEndDate: !!emailPayload.endDate,
		});

		// Send email via internal API call
		// Use localhost for local development, or the base URL for production
		const apiUrl =
			process.env.NODE_ENV === "development"
				? "http://localhost:3000/api/subscription-confirmed-email"
				: `${baseUrl}/api/subscription-confirmed-email`;

		try {
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(emailPayload),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				console.error(
					"Failed to send subscription confirmation email:",
					errorData
				);
				return;
			}

			const emailResult = await response.json();
		} catch (fetchError) {
			// If fetch fails (e.g., in local dev without server running), log but don't fail
			console.warn(
				"Could not send subscription email (this is OK in development):",
				fetchError.message
			);
		}
	} catch (error) {
		console.error("Error sending subscription confirmation email:", error);
		// Don't throw - email failure shouldn't break the webhook
	}
}

async function handleCheckoutCompleted(checkoutData) {
	try {
		const userInfo = await getUserInfo(checkoutData);
		if (!userInfo) {
			console.error("Could not find user for checkout:", checkoutData.id);
			return;
		}

		const { userId } = userInfo;
		const amount = checkoutData.amount || checkoutData.product_price || 0;

		// Calculate subscription dates (default to one-time purchase - 100 years)
		const now = new Date();
		const subscriptionStartDate = now.toISOString();
		const subscriptionEndDate = new Date(now);
		subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 100);

		const subscriptionData = {
			subscriptionStatus: "active",
			subscriptionId: checkoutData.id || null,
			subscriptionType: "oneTime",
			price: amount,
			subscriptionStartDate: subscriptionStartDate,
			subscriptionEndDate: subscriptionEndDate.toISOString(),
			lastWebhookEvent: {
				type: "checkout.completed",
				timestamp: new Date().toISOString(),
				status: "active",
				subscriptionId: checkoutData.id || null,
				subscriptionType: "oneTime",
				price: amount,
			},
		};

		await updateUserSubscription(userId, subscriptionData);
	} catch (error) {
		console.error("Error handling checkout completed:", error);
	}
}

async function handleSubscriptionCreated(subscriptionData) {
	try {
		const userInfo = await getUserInfo(subscriptionData);
		if (!userInfo) {
			console.error(
				"Could not find user for subscription:",
				subscriptionData.id
			);
			return;
		}

		const { userId } = userInfo;
		const amount =
			subscriptionData.price_amount || subscriptionData.amount || 0;

		// Determine subscription type based on product or metadata
		let subscriptionType = "oneTime";
		const metadata = subscriptionData.metadata || {};
		if (metadata.subscriptionType) {
			subscriptionType = metadata.subscriptionType;
		} else if (
			subscriptionData.status === "active" &&
			subscriptionData.current_period_end
		) {
			subscriptionType = "recurring";
		}

		// Calculate subscription dates
		const now = new Date();
		let subscriptionStartDate = now.toISOString();

		// Validate and parse current_period_start timestamp
		if (subscriptionData.current_period_start) {
			const startTimestamp = subscriptionData.current_period_start * 1000;
			const startDate = new Date(startTimestamp);
			if (!isNaN(startDate.getTime())) {
				subscriptionStartDate = startDate.toISOString();
			}
		}

		let subscriptionEndDate = new Date(now);
		// Validate and parse current_period_end timestamp
		if (subscriptionData.current_period_end) {
			const endTimestamp = subscriptionData.current_period_end * 1000;
			const endDate = new Date(endTimestamp);
			if (!isNaN(endDate.getTime())) {
				subscriptionEndDate = endDate;
			} else {
				// Default to 100 years for one-time purchases if invalid
				subscriptionEndDate.setFullYear(
					subscriptionEndDate.getFullYear() + 100
				);
			}
		} else {
			// Default to 100 years for one-time purchases
			subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 100);
		}

		const updateData = {
			subscriptionStatus: subscriptionData.status || "active",
			subscriptionId: subscriptionData.id || null,
			subscriptionType: subscriptionType,
			price: amount,
			subscriptionStartDate: subscriptionStartDate,
			subscriptionEndDate: subscriptionEndDate.toISOString(),
			lastWebhookEvent: {
				type: "subscription.created",
				timestamp: new Date().toISOString(),
				status: subscriptionData.status || "active",
				subscriptionId: subscriptionData.id || null,
				subscriptionType: subscriptionType,
				price: amount,
			},
		};

		await updateUserSubscription(userId, updateData);
	} catch (error) {
		console.error("Error handling subscription created:", error);
	}
}

async function handleSubscriptionUpdated(subscriptionData) {
	try {
		const userInfo = await getUserInfo(subscriptionData);
		if (!userInfo) {
			console.error(
				"Could not find user for subscription:",
				subscriptionData.id
			);
			return;
		}

		const { userId } = userInfo;
		const amount =
			subscriptionData.price_amount || subscriptionData.amount || 0;

		// Determine subscription type
		let subscriptionType = "oneTime";
		const metadata = subscriptionData.metadata || {};
		if (metadata.subscriptionType) {
			subscriptionType = metadata.subscriptionType;
		} else if (
			subscriptionData.status === "active" &&
			subscriptionData.current_period_end
		) {
			subscriptionType = "recurring";
		}

		// Calculate subscription dates
		const now = new Date();
		let subscriptionStartDate = now.toISOString();

		// Validate and parse current_period_start timestamp
		if (subscriptionData.current_period_start) {
			const startTimestamp = subscriptionData.current_period_start * 1000;
			const startDate = new Date(startTimestamp);
			if (!isNaN(startDate.getTime())) {
				subscriptionStartDate = startDate.toISOString();
			}
		}

		let subscriptionEndDate = new Date(now);
		// Validate and parse current_period_end timestamp
		if (subscriptionData.current_period_end) {
			const endTimestamp = subscriptionData.current_period_end * 1000;
			const endDate = new Date(endTimestamp);
			if (!isNaN(endDate.getTime())) {
				subscriptionEndDate = endDate;
			} else {
				// Default to 100 years for one-time purchases if invalid
				subscriptionEndDate.setFullYear(
					subscriptionEndDate.getFullYear() + 100
				);
			}
		} else {
			// Default to 100 years for one-time purchases
			subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 100);
		}

		const updateData = {
			subscriptionStatus: subscriptionData.status || "active",
			subscriptionId: subscriptionData.id || null,
			subscriptionType: subscriptionType,
			price: amount,
			subscriptionStartDate: subscriptionStartDate,
			subscriptionEndDate: subscriptionEndDate.toISOString(),
			lastWebhookEvent: {
				type: "subscription.updated",
				timestamp: new Date().toISOString(),
				status: subscriptionData.status || "active",
				subscriptionId: subscriptionData.id || null,
				subscriptionType: subscriptionType,
				price: amount,
			},
		};

		await updateUserSubscription(userId, updateData);

		console.log(
			"Successfully updated subscription for user:",
			userId,
			"Subscription ID:",
			subscriptionData.id
		);
	} catch (error) {
		console.error("Error handling subscription updated:", error);
	}
}

async function handleSubscriptionCanceled(subscriptionData) {
	try {
		const userInfo = await getUserInfo(subscriptionData);
		if (!userInfo) {
			console.error(
				"Could not find user for subscription:",
				subscriptionData.id
			);
			return;
		}

		const { userId } = userInfo;

		const updateData = {
			subscriptionStatus: "cancelled",
			subscriptionId: subscriptionData.id || null,
			subscriptionType: null,
			price: null,
			subscriptionStartDate: null,
			subscriptionEndDate: null,
			lastWebhookEvent: {
				type: "subscription.canceled",
				timestamp: new Date().toISOString(),
				status: "cancelled",
			},
		};

		await updateUserSubscription(userId, updateData);
	} catch (error) {
		console.error("Error handling subscription canceled:", error);
	}
}

async function handleSubscriptionRevoked(subscriptionData) {
	try {
		// Similar to canceled
		await handleSubscriptionCanceled(subscriptionData);
	} catch (error) {
		console.error("Error handling subscription revoked:", error);
	}
}

async function handleOrderUpdated(paymentData) {
	try {
		const userInfo = await getUserInfo(paymentData);
		if (!userInfo) {
			console.error("Could not find user for payment:", paymentData.id);
			return;
		}

		const { userId } = userInfo;
		const amount = paymentData.amount || 0;

		// Calculate subscription dates (default to one-time purchase - 100 years)
		const now = new Date();
		const subscriptionStartDate = now.toISOString();
		const subscriptionEndDate = new Date(now);
		subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 100);

		const subscriptionData = {
			subscriptionStatus: "active",
			subscriptionId: paymentData.subscription_id,
			subscriptionType: "oneTime",
			price: amount,
			subscriptionStartDate: subscriptionStartDate,
			subscriptionEndDate: subscriptionEndDate.toISOString(),
			lastWebhookEvent: {
				type: "payment.succeeded",
				timestamp: new Date().toISOString(),
				status: "active",
				subscriptionId: paymentData.subscription_id,
				subscriptionType: "oneTime",
				price: amount,
			},
		};

		await updateUserSubscription(userId, subscriptionData);
	} catch (error) {
		console.error("Error handling payment succeeded:", error);
	}
}

async function handleOrderPaid(paymentData) {
	try {
		console.log("Processing order paid:", paymentData.id);
		console.log("Order paid data sample:", {
			id: paymentData.id,
			amount: paymentData.amount,
			price_amount: paymentData.price_amount,
			total: paymentData.total,
			customer_email: paymentData.customer_email,
			product_name: paymentData.product_name,
			subscription_id: paymentData.subscription_id,
			checkout_id: paymentData.checkout_id,
			metadata: paymentData.metadata,
			keys: Object.keys(paymentData),
		});

		const userInfo = await getUserInfo(paymentData);
		if (!userInfo) {
			console.error("Could not find user for payment:", paymentData.id);
			return;
		}

		const { userId } = userInfo;

		// Extract amount from multiple possible sources
		let amount =
			paymentData.amount ||
			paymentData.price_amount ||
			paymentData.total ||
			paymentData.price?.amount ||
			0;

		// Convert from cents if needed (amount > 1000 likely means cents)
		if (amount > 1000) {
			amount = amount / 100;
		}

		// Ensure amount is a valid number
		if (typeof amount !== "number" || isNaN(amount)) {
			amount = 0;
		}

		// Calculate subscription dates (default to one-time purchase - 100 years)
		const now = new Date();
		const subscriptionStartDate = now.toISOString();
		const subscriptionEndDate = new Date(now);
		subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 100);

		const subscriptionData = {
			subscriptionStatus: "active",
			subscriptionId: paymentData.subscription_id || paymentData.id,
			subscriptionType: "oneTime",
			price: amount,
			subscriptionStartDate: subscriptionStartDate,
			subscriptionEndDate: subscriptionEndDate.toISOString(),
			lastWebhookEvent: {
				type: "order.paid",
				timestamp: new Date().toISOString(),
				status: "active",
				subscriptionId: paymentData.subscription_id,
				subscriptionType: "oneTime",
				price: amount,
			},
		};

		// Update subscription status in database
		await updateUserSubscription(userId, subscriptionData);

		// Save payment details to gt-payments collection for invoice generation
		await savePaymentDetails(paymentData, userInfo, subscriptionData);

		// Send subscription confirmation email after payment is confirmed
		await sendSubscriptionConfirmationEmail(
			paymentData,
			userInfo,
			subscriptionData
		);
	} catch (error) {
		console.error("Error handling order paid:", error);
	}
}
