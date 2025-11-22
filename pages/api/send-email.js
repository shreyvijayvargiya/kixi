import { Resend } from "resend";

const resend = new Resend(
	process.env.RESEND_API_KEY || "re_V1pvhE6X_HbnDpnVWBhiATKSxtGrTmCTy"
);

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const { name, email, subject, message } = req.body;

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		console.log("Sending email with data:", { name, email, subject });

		const emailData = await resend.emails.send({
			from: "connect@ihatereading.in",
			to: ["shreyvijayvargiya@gmail.com"],
			subject: `New message from the client for project ${name}`,
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1f2937, #374151); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Custom Template Request</h1>
            <p style="color: #d1d5db; margin: 10px 0 0 0;">Someone wants a custom template built!</p>
          </div>
          
          <div style="background: #f9fafb; padding: 25px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 18px;">Contact Information</h2>
            <div style="margin-bottom: 15px;">
              <strong style="color: #374151;">Name:</strong> 
              <span style="color: #6b7280; margin-left: 8px;">${name}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #374151;">Email:</strong> 
              <span style="color: #6b7280; margin-left: 8px;">${email}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #374151;">Subject:</strong> 
              <span style="color: #6b7280; margin-left: 8px;">${subject}</span>
            </div>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 20px;">
            <h3 style="color: #1f2937; margin-top: 0; font-size: 16px;">Message Details</h3>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 3px solid #10b981;">
              <p style="color: #374151; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #f59e0b;">
            <p style="color: #92400e; margin: 0; font-weight: 500;">
              💡 <strong>Next Steps:</strong> Review this request and reach out to ${name} at ${email} to discuss the custom template requirements.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              This email was sent from the gettemplate contact form
            </p>
          </div>
        </div>
      `,
		});

		console.log("Email sent successfully:", emailData);
		res.status(200).json({ success: true, data: emailData });
	} catch (error) {
		console.error("Error sending email:", error);
		res.status(500).json({
			success: false,
			error: error.message || "Failed to send email",
		});
	}
}
