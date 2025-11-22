import React from "react";
import { Lightbulb, Target, Heart } from "lucide-react";

const WhyWeMadeSection = () => {
	const reasons = [
		{
			icon: <Lightbulb className="w-6 h-6 text-zinc-800" />,
			title: "The Problem",
			description:
				"Creating beautiful animated gradients is time-consuming and requires design skills. Developers and designers waste hours trying to get the perfect gradient animation.",
			bgColor: "bg-yellow-50",
		},
		{
			icon: <Target className="w-6 h-6 text-zinc-800" />,
			title: "Our Solution",
			description:
				"kixi makes it easy to create stunning animated gradients in minutes. No design skills needed - just choose colors, add animation, and export in any format you need.",
			bgColor: "bg-blue-50",
		},
		{
			icon: <Heart className="w-6 h-6 text-zinc-800" />,
			title: "Our Mission",
			description:
				"To empower developers and designers to create beautiful gradients quickly and easily, so they can focus on building amazing products instead of struggling with design tools.",
			bgColor: "bg-pink-50",
		},
	];

	return (
		<section
			id="why-we-made"
			className="py-16 my-16 border-t border-b border-dashed border-zinc-100"
		>
			<div className="max-w-7xl mx-auto px-4">
				<span className="mb-6 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 w-fit mx-auto">
					<Heart className="w-3 h-3" />
					Why We Made This
				</span>
				<h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
					Built Out of Necessity
				</h2>
				<p className="text-zinc-600 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
					We understand the struggle of creating perfect animated gradients.
					That's why we created kixi.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{reasons.map((reason, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-xl border border-zinc-100 hover:shadow-xl hover:shadow-zinc-200 hover:border-zinc-200 transition-all duration-300 relative hover:scale-105"
						>
							<div className={`p-3 ${reason.bgColor} rounded-xl mb-4 w-fit`}>
								{reason.icon}
							</div>
							<h3 className="font-semibold text-zinc-900 mb-2">
								{reason.title}
							</h3>
							<p className="text-zinc-600 text-sm leading-relaxed">
								{reason.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default WhyWeMadeSection;
