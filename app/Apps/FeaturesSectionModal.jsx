import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Zap,
	Download,
	Sparkles,
	Rocket,
	ChevronLeft,
	ChevronRight,
	X,
	Camera,
} from "lucide-react";

const FeaturesSectionModal = ({ isOpen, onClose }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
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
			title: "Multi frames",
			description: "Create and save multiple pages/frames per project",
			bgColor: "bg-pink-50",
		},
	];

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
	};

	const getCardPosition = (index) => {
		if (index === currentIndex) return "center";

		// Calculate previous index (with wrap-around)
		const prevIndex =
			currentIndex === 0 ? features.length - 1 : currentIndex - 1;
		if (index === prevIndex) return "left";

		// Calculate next index (with wrap-around)
		const nextIndex =
			currentIndex === features.length - 1 ? 0 : currentIndex + 1;
		if (index === nextIndex) return "right";

		return "hidden";
	};

	const getCardStyle = (position) => {
		switch (position) {
			case "center":
				return {
					scale: 1,
					opacity: 1,
					rotateY: 0,
					zIndex: 10,
				};
			case "left":
				return {
					scale: 0.85,
					opacity: 0.6,
					rotateY: 15,
					zIndex: 5,
					x: -100,
				};
			case "right":
				return {
					scale: 0.85,
					opacity: 0.6,
					rotateY: -15,
					zIndex: 5,
					x: 100,
				};
			default:
				return {
					scale: 0,
					opacity: 0,
					zIndex: 0,
				};
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
						onClick={onClose}
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className="fixed inset-0 z-50 flex items-center flex-col justify-center p-4"
						onClick={onClose}
					>
						<div className="flex items-center justify-between max-w-2xl w-full mx-auto">
							<span className="m-2 flex items-center gap-2 p-2 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 w-fit">
								<Sparkles className="w-3 h-3" />
								kixi
							</span>
							<button
								onClick={onClose}
								className="p-1.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-colors"
							>
								<X className="w-4 h-4 text-zinc-600" />
							</button>
						</div>
						<motion.div
							onClick={(e) => e.stopPropagation()}
							className="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
						>
							{/* Header */}
							<div className="flex items-center justify-center p-2">
								<h2 className="text-lg font-semibold font-sans mt-2 text-center">
									Introduction to Kixi
								</h2>
							</div>
							{/* Carousel Container */}
							<div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
								{/* Left Arrow */}
								<button
									onClick={handlePrevious}
									className="absolute left-4 z-20 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-zinc-200"
								>
									<ChevronLeft className="w-6 h-6 text-zinc-700" />
								</button>

								{/* Cards Container */}
								<div
									className="relative w-full h-[400px] flex items-center justify-center"
									style={{ perspective: "1000px" }}
								>
									{features.map((feature, index) => {
										const position = getCardPosition(index);
										const style = getCardStyle(position);

										if (position === "hidden") return null;

										return (
											<motion.div
												key={index}
												initial={false}
												animate={{
													scale: style.scale,
													opacity: style.opacity,
													rotateY: style.rotateY,
													x: style.x || 0,
												}}
												transition={{
													type: "spring",
													stiffness: 300,
													damping: 30,
												}}
												className="absolute w-[350px]"
												style={{
													transformStyle: "preserve-3d",
													zIndex: style.zIndex,
												}}
											>
												<div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-lg h-full">
													<div
														className={`p-3 ${feature.bgColor} rounded-xl mb-4 w-fit`}
													>
														{feature.icon}
													</div>
													<h3 className="font-semibold text-zinc-900 mb-2 text-lg">
														{feature.title}
													</h3>
													<p className="text-zinc-600 text-sm leading-relaxed">
														{feature.description}
													</p>
												</div>
											</motion.div>
										);
									})}
								</div>

								{/* Right Arrow */}
								<button
									onClick={handleNext}
									className="absolute right-4 z-20 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-zinc-200"
								>
									<ChevronRight className="w-6 h-6 text-zinc-700" />
								</button>
							</div>

							{/* Dots Indicator */}
							<div className="flex items-center justify-center gap-2 p-6">
								{features.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentIndex(index)}
										className={`w-2 h-2 rounded-full transition-all ${
											index === currentIndex
												? "bg-zinc-900 w-8"
												: "bg-zinc-300 hover:bg-zinc-400"
										}`}
									/>
								))}
							</div>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default FeaturesSectionModal;
