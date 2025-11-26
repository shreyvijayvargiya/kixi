import React from "react";
import {
	Zap,
	Code,
	Download,
	ShieldCheck,
	Sparkles,
	Rocket,
	Camera,
} from "lucide-react";

const FeaturesSection = () => {
	const features = [
		{
			icon: <Sparkles className="w-6 h-6 text-zinc-800" />,
			title: "Animated Gradients",
			description:
				"Create stunning animated gradients with customizable colors, angles, and animation types.",
			bgColor: "bg-purple-50",
		},
		{
			icon: <Zap className="w-6 h-6 text-zinc-800" />,
			title: "Real-Time Preview",
			description:
				"See your gradient animations in real-time as you customize them. No waiting, instant results.",
			bgColor: "bg-yellow-50",
		},
		{
			icon: <Download className="w-6 h-6 text-zinc-800" />,
			title: "Multiple Export Formats",
			description:
				"Export your gradients as PNG, SVG, GIF, MP4, or React code. Perfect for any use case.",
			bgColor: "bg-blue-50",
		},
		// {
		// 	icon: <Code className="w-6 h-6 text-zinc-800" />,
		// 	title: "React Code Export",
		// 	description:
		// 		"Generate production-ready React code for your gradients. Copy and paste into your project.",
		// 	bgColor: "bg-zinc-50",
		// },
		// {
		// 	icon: <ShieldCheck className="w-6 h-6 text-zinc-800" />,
		// 	title: "AI Multi-Object Support",
		// 	description:
		// 		"Ask AI to layout images, text, video, shapes, background layers, and icons in one shot.",
		// 	bgColor: "bg-green-50",
		// },
		{
			icon: <Camera className="w-6 h-6 text-zinc-800" />,
			title: "URL to Screenshot",
			description:
				"Paste any URL and instantly capture a pixel-perfect screenshot you can drop into your scene.",
			bgColor: "bg-emerald-50",
		},
		{
			icon: <Rocket className="w-6 h-6 text-zinc-800" />,
			title: "Unlimited Projects",
			description:
				"Create and save unlimited gradient projects. Access them anytime, anywhere.",
			bgColor: "bg-pink-50",
		},
	];

	return (
		<section
			id="features"
			className="py-16 my-16 border-t border-b border-dashed border-zinc-100"
		>
			<div className="max-w-7xl mx-auto px-4">
				<span className="mb-6 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 w-fit mx-auto">
					<Sparkles className="w-3 h-3" />
					Features
				</span>
				<h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
					Everything You Need to Create Stunning Designs
				</h2>
				<p className="text-zinc-600 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
					Powerful tools to create, animate, and export beautiful designs for
					your projects.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-xl border border-zinc-100 hover:shadow-xl hover:shadow-zinc-200 hover:border-zinc-200 transition-all duration-300 relative hover:scale-105"
						>
							<div className={`p-3 ${feature.bgColor} rounded-xl mb-4 w-fit`}>
								{feature.icon}
							</div>
							<h3 className="font-semibold text-zinc-900 mb-2">
								{feature.title}
							</h3>
							<p className="text-zinc-600 text-sm leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FeaturesSection;
