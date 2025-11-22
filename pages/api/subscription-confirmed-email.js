import { Resend } from "resend";

const resend = new Resend(
	process.env.RESEND_API_KEY || "re_V1pvhE6X_HbnDpnVWBhiATKSxtGrTmCTy"
);

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const {
			customerName,
			customerEmail,
			planName,
			amount,
			currency = "USD",
			startDate,
			endDate,
			nextBillingDate,
			paymentMethod,
			transactionId,
			purchaseDate,
			dashboardUrl = "https://gettemplate.com/dashboard",
		} = req.body;

		// Validate required fields
		// Note: amount can be 0, so we check for undefined/null instead of falsy
		if (
			!customerName ||
			!customerEmail ||
			!planName ||
			amount === undefined ||
			amount === null ||
			!transactionId
		) {
			console.error("Missing required fields in subscription email API:", {
				customerName: customerName || "MISSING",
				customerEmail: customerEmail || "MISSING",
				planName: planName || "MISSING",
				amount: amount,
				transactionId: transactionId || "MISSING",
				receivedBody: req.body,
			});
			return res.status(400).json({
				error:
					"Missing required fields: customerName, customerEmail, planName, amount, and transactionId are required",
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(customerEmail)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		// Format amount with currency symbol
		const formattedAmount = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
		}).format(amount);

		// Format dates
		const formatDate = (dateString) => {
			if (!dateString) return "N/A";
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		};

		console.log("Sending subscription confirmation email:", {
			customerName,
			customerEmail,
			planName,
			amount: formattedAmount,
		});

		const emailData = await resend.emails.send({
			from: "connect@ihatereading.in",
			to: [customerEmail],
			subject: `Subscription Confirmed - Welcome to ${planName}! 🎉`,
			html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body {
                font-family: "Segoe UI", Arial, sans-serif;
                line-height: 1.6;
                color: #2d3748;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f7fafc;
              }
              .header {
                text-align: center;
                padding: 30px 0;
                background: linear-gradient(135deg, #10b981, #059669);
                border-radius: 12px 12px 0 0;
                margin-bottom: 0;
              }
              .header h1 {
                color: white;
                margin: 0;
                font-size: 28px;
                font-weight: 600;
              }
              .content {
                background-color: #ffffff;
                padding: 40px;
                border-radius: 0 0 12px 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .button {
                display: inline-block;
                padding: 14px 28px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                margin: 25px 0;
                font-weight: 600;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 13px;
                color: #718096;
              }
              .feature-list {
                background-color: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .feature-list li {
                margin-bottom: 12px;
                position: relative;
                padding-left: 25px;
              }
              .feature-list li:before {
                content: "✓";
                color: #10b981;
                position: absolute;
                left: 0;
                font-weight: bold;
                font-size: 18px;
              }
              .subscription-details {
                background-color: #f0fdf4;
                padding: 25px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #10b981;
              }
              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .detail-row:last-child {
                border-bottom: none;
              }
              .detail-label {
                color: #6b7280;
                font-weight: 500;
              }
              .detail-value {
                color: #1f2937;
                font-weight: 600;
              }
              .amount {
                font-size: 24px;
                color: #10b981;
                font-weight: bold;
              }
              .highlight {
                color: #10b981;
                font-weight: 600;
              }
              .success-badge {
                display: inline-block;
                background-color: #d1fae5;
                color: #065f46;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 20px;
              }
              .transaction-info {
                background-color: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #e5e7eb;
              }
              .timeline {
                margin: 30px 0;
              }
              .timeline-item {
                margin-bottom: 15px;
                padding-left: 25px;
                position: relative;
              }
              .timeline-item:before {
                content: "→";
                position: absolute;
                left: 0;
                color: #10b981;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎉 Subscription Confirmed!</h1>
            </div>

            <div class="content">
              <div class="success-badge">✓ Payment Successful</div>
              
              <p>Dear <span class="highlight">${customerName}</span>,</p>

              <p>
                Thank you for your subscription! Your payment has been successfully processed 
                and your account has been upgraded. You now have full access to all premium 
                features on Gettemplate.
              </p>

              <div class="subscription-details">
                <h3 style="margin-top: 0; color: #1f2937; font-size: 18px;">Subscription Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Plan:</span>
                  <span class="detail-value">${planName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount Paid:</span>
                  <span class="detail-value amount">${formattedAmount}</span>
                </div>
                ${
									startDate && endDate
										? `
                <div class="detail-row">
                  <span class="detail-label">Subscription Period:</span>
                  <span class="detail-value">${formatDate(startDate)} - ${formatDate(endDate)}</span>
                </div>
                `
										: ""
								}
                ${
									nextBillingDate
										? `
                <div class="detail-row">
                  <span class="detail-label">Next Billing Date:</span>
                  <span class="detail-value">${formatDate(nextBillingDate)}</span>
                </div>
                `
										: ""
								}
                ${
									paymentMethod
										? `
                <div class="detail-row">
                  <span class="detail-label">Payment Method:</span>
                  <span class="detail-value">${paymentMethod}</span>
                </div>
                `
										: ""
								}
              </div>

              <div class="transaction-info">
                <h3 style="margin-top: 0; color: #1f2937; font-size: 16px;">Transaction Information</h3>
                <p style="margin: 5px 0; color: #6b7280;">
                  <strong style="color: #374151;">Transaction ID:</strong> 
                  <span class="highlight">${transactionId}</span>
                </p>
                ${
									purchaseDate
										? `
                <p style="margin: 5px 0; color: #6b7280;">
                  <strong style="color: #374151;">Purchase Date:</strong> 
                  <span>${formatDate(purchaseDate)}</span>
                </p>
                `
										: ""
								}
              </div>

              <div class="feature-list">
                <h3 style="margin-top: 0; color: #2d3748">
                  What You Get with ${planName}:
                </h3>
                <ul style="list-style: none; padding-left: 0">
                  <li>
                    <strong>Unlimited Templates:</strong> Access to our entire library 
                    of premium templates
                  </li>
                  <li>
                    <strong>Priority Support:</strong> Get help when you need it with 
                    24/7 priority support
                  </li>
                  <li>
                    <strong>Advanced Customization:</strong> Full access to customization 
                    features and tools
                  </li>
                  <li>
                    <strong>Regular Updates:</strong> Receive all new templates and 
                    features as they're released
                  </li>
                  <li>
                    <strong>Commercial License:</strong> Use templates for any commercial 
                    project without restrictions
                  </li>
                  <li>
                    <strong>Source Code Access:</strong> Full access to all template 
                    source code
                  </li>
                </ul>
              </div>

              <div class="timeline">
                <h3>Get Started:</h3>
                <div class="timeline-item">
                  Explore your dashboard and access all premium templates
                </div>
                <div class="timeline-item">
                  Download and customize templates for your projects
                </div>
                <div class="timeline-item">
                  Set up your account preferences and notifications
                </div>
                <div class="timeline-item">
                  Contact support if you need any assistance
                </div>
              </div>

              <div style="text-align: center">
                <a href="${dashboardUrl}" class="button">Access Your Dashboard →</a>
              </div>

              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-top: 30px; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; margin: 0; font-weight: 500;">
                  💡 <strong>Tip:</strong> Save this email for your records. You can also 
                  view your subscription details and manage your account anytime from your dashboard.
                </p>
              </div>

              <h3>Need Help?</h3>
              <p>
                If you have any questions about your subscription or need assistance with 
                your account, our support team is here to help. You can reach us at:
              </p>
              <ul>
                <li>Email: support@gettemplate.com</li>
                <li>Help Center: help.gettemplate.com</li>
                <li>Live Chat: Available 24/7 in your dashboard</li>
              </ul>

              <p>
                Best regards,<br />
                <span class="highlight">The Gettemplate Team</span><br />
                <span style="font-size: 14px; color: #718096"
                  >Thank you for choosing Gettemplate!</span
                >
              </p>
            </div>

            <div class="footer">
              <p>
                This is an automated confirmation email for your subscription purchase.
              </p>
              <p>© 2024 Gettemplate. All rights reserved.</p>
              <p style="font-size: 12px; color: #a0aec0">
                Need help? Contact us at support@gettemplate.com
              </p>
            </div>
          </body>
        </html>
      `,
		});

		console.log(
			"Subscription confirmation email sent successfully:",
			emailData
		);
		res.status(200).json({ success: true, data: emailData });
	} catch (error) {
		console.error("Error sending subscription confirmation email:", error);
		res.status(500).json({
			success: false,
			error: error.message || "Failed to send subscription confirmation email",
		});
	}
}
