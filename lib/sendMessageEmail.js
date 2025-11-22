export const sendMessageEmail = async (formData) => {
	try {
		const { name, email, subject, message } = formData;

		// Validate required fields
		if (!name || !email || !subject || !message) {
			throw new Error("Missing required fields");
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new Error("Invalid email format");
		}

		console.log("Sending email with data:", { name, email, subject });

		// Use the API route instead of direct Resend call
		const response = await fetch("/api/send-email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				email,
				subject,
				message,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.error || `HTTP error! status: ${response.status}`
			);
		}

		const result = await response.json();
		console.log("Email sent successfully:", result);
		return result;
	} catch (error) {
		console.error("Error sending email:", error);
		console.error("Error details:", {
			message: error.message,
			name: error.name,
			stack: error.stack,
		});
		return { success: false, error: error.message };
	}
};
