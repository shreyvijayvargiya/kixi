import { Loader2, PlusIcon, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";

const subscriptionPlans = {
	yearly: {
		id: "05fee37c-d369-49fa-bb5b-b606df933a61",
		priceUSD: 99,
		title: "Annual",
		features: [
			{
				title: "⭐ All Templates Access",
				description: "Access to all premium templates",
			},
			{
				title: "💻 Unlimited projects",
				description: "Create unlimited kixi on the app",
			},
			{
				title: "🚀 New Templates",
				description: "Get new templates every week",
			},
		],
	},
};

const faqData = [
	{
		question: "What do I get when I subscribe?",
		answer:
			"You get instant access to all premium React and Next.js templates with complete source code. Download any template in ZIP format, view the code repository, and customize it for your projects.",
	},
	{
		question: "Can I cancel my subscription anytime?",
		answer:
			"Yes, you can cancel your annual subscription anytime. However, there are no refunds for remaining months. For custom enterprise plans, please contact our sales team to discuss cancellation terms.",
	},
	{
		question: "What's included in the source code?",
		answer:
			"The source code includes all React/Next.js components, CSS files (Tailwind), configuration files, and project structure. Everything you need to run the template locally or deploy it to your hosting platform.",
	},
	{
		question: "Do I get support and updates?",
		answer:
			"Yes! All plans include new template updates every week. Enterprise and custom plan customers get priority support with faster response times for any questions or issues you may have.",
	},
	{
		question: "Can I use templates for commercial projects?",
		answer:
			"Absolutely! All templates come with full commercial rights. You can use them for client projects, personal websites, or any commercial application without any restrictions or attribution required.",
	},
];

const SubscriptionModal = () => {
	const { user, subscriptionStatus } = useSelector((state) => state.auth);
	const [loadingPlan, setLoadingPlan] = useState(null);

	const handleSubscribe = async (productId, planType) => {
		setLoadingPlan(planType);

		if (!user) {
			toast.error("Please log in to subscribe");
			return;
		}

		// Check if user already has an active subscription
		if (subscriptionStatus === "active" || subscriptionStatus === "on_trial") {
			toast.error("You already have an active subscription");
			setLoadingPlan(null);
			return;
		}

		try {
			const response = await fetch("/api/create-polar-checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					productId: productId,
					userId: user.uid,
				}),
			});

			const data = await response.json();

			console.log(data, "data");
			if (data.success && data.checkoutData?.url) {
				// Redirect to Polar checkout
				window.location.href = data.checkoutData.url;
			} else {
				throw new Error(data.error || "No checkout URL received");
			}
		} catch (error) {
			console.error("Error in handleSubscribe:", error);
			toast.error(
				error.message || "Failed to create checkout. Please try again."
			);
			setLoadingPlan(null);
		}
	};

	return (
		<motion.div className="max-w-7xl mx-auto bg-transparent">
			<motion.div
				initial={{ scale: 0.95, opacity: 0, y: 0 }}
				animate={{ scale: 1, opacity: 1, y: 0 }}
				exit={{ scale: 0.95, opacity: 0, y: 20 }}
				transition={{ type: "spring", damping: 20, stiffness: 300 }}
				className="relative border-dashed p-6 md:p-8 max-w-7xl w-full transition-all duration-300 ease-in mx-auto my-auto"
			>
				<div className="relative flex flex-col items-center justify-center px-4 my-10">
					{/* Location indicator */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="mt-2 text-xs text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full"
					>
						Pricing in $
					</motion.div>
					<br />
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ type: "spring", stiffness: 200, damping: 10 }}
						className="p-2 rounded-xl bg-black animate-[spin_6s_linear_infinite] shadow-2xl shadow-zinc-400"
					>
						<p className="text-white p-4 rounded-xl bg-zinc-900 animate-[spin_3s_linear_infinite] backdrop-blur-md">
							PRO
						</p>
					</motion.div>
					<br />
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-4xl font-bold text-zinc-900"
					>
						kixi PRO
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="text-zinc-600 max-w-xs mx-auto text-center"
					>
						Get access to view and download the complete code repository for all
						templates.
					</motion.p>
				</div>

				<motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 max-w-4xl mx-auto">
					{/* Annual Plan */}
					<motion.div className="bg-gradient-to-tr from-zinc-100 to-white hover:shadow-2xl hover:bg-white ring-4 ring-zinc-50 hover:ring-8 hover:ring-zinc-100 transition-all duration-300 ease-in rounded-2xl border border-zinc-200 border-dashed p-8 shadow relative">
						<div className="text-center mb-8">
							<h3 className="text-2xl font-semibold text-zinc-900 mb-2">
								Annual
							</h3>
							<p className="text-zinc-600">Best for yearly projects</p>
						</div>
						<div className="text-3xl font-bold text-zinc-900 mb-6">
							${subscriptionPlans.yearly.priceUSD}/year
						</div>
						<ul className="space-y-4">
							{subscriptionPlans.yearly.features.map((feature, index) => (
								<li key={index} className="flex items-start gap-3">
									<div>
										<p className="font-medium text-zinc-900">{feature.title}</p>
										<p className="text-sm text-zinc-600">
											{feature.description}
										</p>
									</div>
								</li>
							))}
						</ul>
						<br />
						<button
							onClick={() =>
								handleSubscribe(subscriptionPlans.yearly.id, "yearly")
							}
							disabled={loadingPlan === "yearly"}
							className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{loadingPlan === "yearly" ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									Processing...
								</>
							) : (
								<>${subscriptionPlans.yearly.priceUSD}/year - Subscribe</>
							)}
						</button>
					</motion.div>

					{/* Contact Sales */}
					<motion.div className="bg-gradient-to-tr from-white to-zinc-100 hover:shadow-2xl hover:bg-white ring-4 ring-zinc-50 hover:ring-8 hover:ring-zinc-100 transition-all duration-300 ease-in rounded-2xl border border-zinc-200 p-8 shadow-md relative">
						<div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
							Custom
						</div>
						<div className="text-center mb-8">
							<h3 className="text-2xl font-semibold text-zinc-900 mb-2">
								Contact Sales
							</h3>
							<p className="text-zinc-600">
								Need a custom plan or enterprise solution?
							</p>
						</div>
						<div className="text-3xl font-bold text-zinc-900 mb-6">
							Custom Pricing
						</div>
						<ul className="space-y-4">
							<li className="flex items-start gap-3">
								<div>
									<p className="font-medium text-zinc-900">
										💼 Enterprise Solutions
									</p>
									<p className="text-sm text-zinc-600">
										Tailored plans for teams and organizations
									</p>
								</div>
							</li>
							<li className="flex items-start gap-3">
								<div>
									<p className="font-medium text-zinc-900">
										🎯 Custom Features
									</p>
									<p className="text-sm text-zinc-600">
										Get exactly what you need for your project
									</p>
								</div>
							</li>
							<li className="flex items-start gap-3">
								<div>
									<p className="font-medium text-zinc-900">
										🤝 Dedicated Support
									</p>
									<p className="text-sm text-zinc-600">
										Priority support and personalized assistance
									</p>
								</div>
							</li>
							<li className="flex items-start gap-3">
								<div>
									<p className="font-medium text-zinc-900">
										📞 Direct Communication
									</p>
									<p className="text-sm text-zinc-600">
										Work directly with our team to find the best solution
									</p>
								</div>
							</li>
						</ul>
						<br />
						<a
							href="mailto:connect@ihatereading.in?subject=Enterprise/Custom Plan Inquiry"
							className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
						>
							<Mail className="w-4 h-4" />
							Contact Sales
						</a>
					</motion.div>
				</motion.div>

				{/* FAQ Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="mt-12 max-w-xl mx-auto"
				>
					<motion.div className="text-center mb-8">
						<h3 className="text-2xl font-bold text-zinc-900 mb-2">
							Frequently Asked Questions
						</h3>
						<p className="text-zinc-600 text-sm">
							Everything you need to know about our templates
						</p>
					</motion.div>

					<div className="space-y-2 bg-stone-50/50 p-2 rounded-xl border border-zinc-100">
						{faqData.map((faq, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.7 + index * 0.05 }}
								className="bg-zinc-50/50 border border-zinc-200 rounded-xl overflow-hidden"
							>
								<details className="group">
									<summary className="list-none cursor-pointer p-2 flex items-center justify-between">
										<h4 className="font-medium text-sm text-zinc-900 flex items-start gap-2">
											{faq.question}
										</h4>
										<div className="group-hover:visible invisible">
											<PlusIcon className="w-3 h-3 group-hover:rotate-180 transition-all duration-75 ease-in" />
										</div>
									</summary>
									<div className="pb-6 pt-0">
										<p className="text-sm text-zinc-600 pl-2">{faq.answer}</p>
									</div>
								</details>
							</motion.div>
						))}
					</div>
				</motion.div>
			</motion.div>
		</motion.div>
	);
};

export default SubscriptionModal;
