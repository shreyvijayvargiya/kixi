import { Loader2, PlusIcon, Mail, InfoIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";

const subscriptionPlans = {
	halfYearly: {
		id: "05fee37c-d369-49fa-bb5b-b606df933a61",
		priceUSD: 49,
		title: "6 months",
		features: [
			{
				title: "🎨 Advanced editor like Figma",
				description:
					"Design with vector tools, grids, and component presets that feel familiar",
			},
			{
				title: "📁 Create unlimited projects",
				description: "Start, duplicate, and organize every idea without limits",
			},
			{
				title: "🔔 Access to new updates",
				description:
					"Receive every feature and template refresh the moment it ships",
			},
		],
	},
	yearly: {
		id: "05fee37c-d369-49fa-bb5b-b606df933a61",
		priceUSD: 99,
		title: "Annual",
		features: [
			{
				title: "🧠 Smart presets library",
				description: "600+ ready-made gradients, shapes, and typography kits",
			},
			{
				title: "🤝 Team co-editing",
				description: "Invite 3 collaborators with shared asset trays",
			},
			{
				title: "🔁 Version timeline",
				description: "Snapshot every iteration and roll back instantly",
			},
			{
				title: "🧵 Workflow automations",
				description: "Export directly to Figma, Webflow, and Framer",
			},
		],
	},
	lifetime: {
		id: "05fee37c-d369-49fa-bb5b-b606df933a61",
		priceUSD: 199,
		title: "Lifetime",
		features: [
			{
				title: "🚀 Infinite updates",
				description: "Lifetime access to every future tool and template",
			},
			{
				title: "🛠️ Beta feature invites",
				description: "Try AI layout assistants before public launch",
			},
			{
				title: "🔐 Secure asset vault",
				description: "2TB encrypted storage for brand kits and exports",
			},
			{
				title: "🎯 White-glove onboarding",
				description: "1:1 sessions with the Kixi design team",
			},
		],
	},
};

const faqData = [
	{
		question: "What does kixi PRO unlock?",
		answer:
			"Every plan unlocks the advanced gradient editor, motion timeline, and export studio. You can mix templates, drop in media, and ship production-ready assets without leaving Kixi.",
	},
	{
		question: "Can I cancel or switch plans?",
		answer:
			"Yes. Quarterly and annual plans renew automatically but can be cancelled at any time from your dashboard. You keep access until the billing cycle ends, and you can upgrade to Lifetime whenever you like.",
	},
	{
		question: "Do I keep my projects if I cancel?",
		answer:
			"Your canvases stay saved. You can view them on the free tier, but editing, exporting, and AI-powered features pause until you restart a PRO plan.",
	},
	{
		question: "How often do you add new templates?",
		answer:
			"We publish fresh gradients, layout blueprints, and motion recipes every week. Lifetime members automatically receive every new release forever.",
	},
	{
		question: "Can I use Kixi output commercially?",
		answer:
			"Absolutely. Anything you export—graphics, animations, or code snippets—is yours to use in personal, client, or commercial projects with no attribution required.",
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
							Kixi
						</p>
					</motion.div>
					<br />
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-4xl font-bold text-zinc-900"
					>
						kixi Subscription
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="text-zinc-600 max-w-xs mx-auto text-center"
					>
						Buy the plan that suits your need.
					</motion.p>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ staggerChildren: 0.1 }}
					className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
				>
					{Object.entries(subscriptionPlans).map(([key, plan], index) => (
						<motion.div
							key={key}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
							className="border border-zinc-200 bg-stone-50/50 rounded-2xl p-6 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
						>
							<div className="mb-4">
								<p className="text-sm uppercase tracking-wide text-zinc-500">
									{plan.title}
								</p>
								<p className="text-3xl font-bold text-zinc-900 mt-2">
									${plan.priceUSD}
									<span className="text-sm font-medium text-zinc-500 ml-1">
										{plan.title === "Lifetime" ? "/once" : "/plan"}
									</span>
								</p>
								<p className="text-sm text-zinc-500 mt-1">
									Total: ${plan.priceUSD} for {plan.title}
								</p>
							</div>
							<ul className="space-y-3 flex-1">
								{plan.features.map((feature, featureIndex) => (
									<li key={featureIndex} className="text-sm text-zinc-700">
										<span className="font-semibold text-zinc-900">
											{feature.title}
										</span>{" "}
										– {feature.description}
									</li>
								))}
							</ul>
							<button
								onClick={() => handleSubscribe(plan.id, key)}
								disabled={loadingPlan === key}
								className="mt-6 w-full border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white p-2 text-xs rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{loadingPlan === key ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Processing...
									</>
								) : (
									<>
										Choose {plan.title} · Total ${plan.priceUSD}
									</>
								)}
							</button>
						</motion.div>
					))}
				</motion.div>
				<span className="text-xs p-5 my-2 max-w-xs mx-auto rounded-xl bg-orange-50 flex items-start justify-start gap-2">
					<InfoIcon className="w-8 h-8" />
					We usually provide half-yearly or annual subscription for better
					trust. Cancel anytime you want.
				</span>

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
