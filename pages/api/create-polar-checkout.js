import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res
			.status(405)
			.json({ success: false, error: "Method not allowed" });
	}

	try {
		const { productId, userId } = req.body;

		// Validate required fields
		if (!productId) {
			return res.status(400).json({
				success: false,
				error: "Missing required fields: productId",
			});
		}

		// Validate userId if provided
		let userEmail = null;
		if (userId) {
			const userRef = doc(db, "users", userId);
			const userDoc = await getDoc(userRef);
			if (userDoc.exists()) {
				userEmail = userDoc.data().email;
			}
		}

		// Check if Polar API key is configured
		const POLAR_API_KEY = process.env.POLAR_API_KEY;
		if (!POLAR_API_KEY) {
			return res.status(500).json({
				success: false,
				error: "Polar API key is not configured",
			});
		}

		// Get the domain for redirect URL
		const host = req.headers.host;
		const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
		const domain = `${protocol}://${host}`;
		const redirectUrl = `${domain}/pricing?subscription=true`;

		// Prepare checkout payload
		const checkoutPayload = {
			allow_discount_codes: true,
			require_billing_address: false,
			is_business_customer: false,
			products: [productId],
			success_url: redirectUrl,
			metadata: userId
				? {
						userId: userId,
						userEmail: userEmail,
					}
				: undefined,
		};

		// Create checkout with the product
		const checkoutResponse = await fetch("https://api.polar.sh/v1/checkouts/", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${POLAR_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(checkoutPayload),
		});

		if (!checkoutResponse.ok) {
			const errorData = await checkoutResponse.json();
			console.error("Polar checkout creation failed:", errorData);
			return res.status(checkoutResponse.status).json({
				success: false,
				error: errorData.detail || "Failed to create Polar checkout",
			});
		}

		const checkoutData = await checkoutResponse.json();

		return res.status(200).json({
			success: true,
			checkoutData,
		});
	} catch (error) {
		console.error("Error creating Polar checkout:", error);
		return res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}
