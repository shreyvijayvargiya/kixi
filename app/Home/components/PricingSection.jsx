import React from "react";
import { Check, ArrowRight } from "lucide-react";
import router from "next/router";

const PricingSection = () => {
	const plans = [
		{
			name: "Free",
			price: "$0",
			period: "forever",
			description: "Perfect for getting started",
			features: [
				"Basic gradient creation",
				"Standard export formats",
				"Community support",
				"Limited projects",
			],
			cta: "Get Started",
			ctaAction: () => router.push("/app"),
			popular: false,
		},
		{
			name: "PRO",
			price: "$99",
			period: "year",
			description: "Best for professionals",
			features: [
				"⭐ All Templates Access",
				"💻 Unlimited projects",
				"🚀 New Templates every week",
				"AI-powered generation",
				"Priority support",
				"All export formats",
			],
			cta: "Buy PRO",
			ctaAction: () => router.push("/pricing"),
			popular: true,
		},
	];

	return (
		<section
			id="pricing"
			className="py-16 my-16 border-t border-b border-dashed border-zinc-100 bg-gradient-to-br from-zinc-50/50 to-white"
		>
			<div className="max-w-7xl mx-auto px-4">
				<span className="mb-6 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 w-fit mx-auto">
					💳 Pricing
				</span>
				<h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
					Simple, Transparent Pricing
				</h2>
				<p className="text-zinc-600 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
					Choose the plan that works best for you. Annual subscription with all features included.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
					{plans.map((plan, index) => (
						<div
							key={index}
							className={`bg-white p-8 rounded-xl border transition-all duration-300 relative ${
								plan.popular
									? "border-zinc-900 shadow-xl shadow-zinc-200 scale-105"
									: "border-zinc-100 hover:shadow-xl hover:shadow-zinc-200 hover:border-zinc-200"
							}`}
						>
							{plan.popular && (
								<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
									<span className="bg-zinc-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
										Most Popular
									</span>
								</div>
							)}
							<div className="mb-6">
								<h3 className="text-2xl font-bold text-zinc-900 mb-2">
									{plan.name}
								</h3>
								<div className="flex items-baseline gap-2 mb-2">
									<span className="text-4xl font-bold text-zinc-900">
										{plan.price}
									</span>
									<span className="text-zinc-600 text-sm">
										/{plan.period}
									</span>
								</div>
								<p className="text-zinc-600 text-sm">{plan.description}</p>
							</div>
							<ul className="space-y-3 mb-8">
								{plan.features.map((feature, idx) => (
									<li key={idx} className="flex items-start gap-3">
										<Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										<span className="text-zinc-700 text-sm">{feature}</span>
									</li>
								))}
							</ul>
							<button
								onClick={plan.ctaAction}
								className={`w-full group inline-flex items-center justify-center font-semibold gap-2 px-4 py-3 text-sm rounded-xl transition-colors ${
									plan.popular
										? "bg-zinc-900 text-white hover:bg-black hover:shadow-xl"
										: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
								}`}
							>
								<span>{plan.cta}</span>
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</button>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default PricingSection;
