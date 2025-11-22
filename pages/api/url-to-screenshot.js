export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const { url } = req.body;

		if (!url || typeof url !== "string") {
			return res
				.status(400)
				.json({ error: "Missing or invalid 'url' in body" });
		}

		// Validate URL format
		let validUrl;
		try {
			validUrl = new URL(url);
		} catch (e) {
			return res.status(400).json({ error: "Invalid URL format" });
		}

		// Only allow http/https protocols
		if (!["http:", "https:"].includes(validUrl.protocol)) {
			return res
				.status(400)
				.json({ error: "Only http and https URLs are allowed" });
		}

		// Call external screenshot API
		const response = await fetch(
			"https://ihatereading-api.vercel.app/take-screenshot",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					url: url,
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.error || `External API returned status ${response.status}`
			);
		}

		const data = await response.json();

		// Return the screenshot URL from the external API
		return res.status(200).json({
			success: data.success || true,
			image: data.screenshot, // Map screenshot URL to image for frontend compatibility
			screenshot: data.screenshot,
			url: data.url,
			metadata: data.metadata,
		});
	} catch (error) {
		console.error("Error generating screenshot:", error);
		return res.status(500).json({
			error: "Failed to generate screenshot",
			message: error.message || "Unknown error",
		});
	}
}
