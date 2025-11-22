import React, { useState } from "react";
import { ArrowRight, PlusIcon, Sparkles } from "lucide-react";
import router from "next/router";

const CTASection = () => {
	const [hoveredCard, setHoveredCard] = useState(false);
	const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setCirclePosition({ x, y });
		setHoveredCard(true);
	};

	const handleMouseLeave = () => {
		setHoveredCard(false);
	};

	return (
		<section
			className="relative bg-gradient-to-tr	from-stone-50 to-transparent border-t border-dashed border-zinc-100"
			onMouseMove={(e) => handleMouseMove(e)}
			onMouseLeave={handleMouseLeave}
		>
			{hoveredCard && (
				<div
					className="absolute transition-all duration-100 ease-in text-gray-400"
					style={{
						transform: `translate(${circlePosition.x}px, ${circlePosition.y}px)`,
					}}
				>
					<PlusIcon size={16} className="text-stone-200" />
				</div>
			)}
			{[
				{
					className: "absolute -top-2 -left-2",
				},
				{
					className: "absolute -bottom-2 -left-2",
				},
			].map((position, idx) => (
				<div
					key={idx}
					className={`${position.className} w-4 h-4 flex items-center justify-center`}
				>
					<PlusIcon size={16} className="text-stone-200" />
				</div>
			))}
			<div className="max-w-4xl mx-auto group text-center p-10 relative">
				<div className="w-full transition-all duration-300 ease-in rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text justify-center items-center absolute bottom-0 left-0 right-0 top-0 h-full z-0 overflow-hidden" />
				<div className="z-10 relative">
					<span className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 w-fit mx-auto">
						<Sparkles className="w-3 h-3" />
						Ready to Start?
					</span>
					<h2 className="text-2xl font-semibold text-center mb-2">
						Still here?
					</h2>
					<p className=" text-center mb-6 max-w-md mx-auto leading-relaxed">
						Then you should definitely explore our amazing template collection
					</p>
					<button
						onClick={() => router.push("/templates")}
						className="group inline-flex items-center font-semibold gap-2 bg-zinc-800 text-white px-2 py-2 text-xs rounded-xl hover:bg-black hover:shadow-xl transition-colors shadow-sm"
					>
						<span>Explore Templates</span>
						<ArrowRight className="w-4 h-4 text-zinc-200 group-hover:rotate-180 rotate-0 transition-all group-hover:text-zinc-100 duration-100 ease-in" />
					</button>
				</div>
			</div>
		</section>
	);
};

export default CTASection;
