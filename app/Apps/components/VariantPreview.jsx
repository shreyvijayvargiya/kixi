import React from "react";
import * as LucideIcons from "lucide-react";

const VariantPreview = ({ state, width = 240 }) => {
	if (!state) return null;

	const { gradient, shapes = [], images = [], texts = [], icons = [] } = state;
	const dimensions = gradient?.dimensions || { width: 1080, height: 1920 };
	const aspectRatio = dimensions.height / dimensions.width;
	const height = width * aspectRatio;
	const scale = width / dimensions.width;

	const getGradientStyle = () => {
		if (!gradient) return { background: "#fff" };
		const { type, angle, stops } = gradient;
		const safeStops = stops || [];

		if (!safeStops.length) return { background: "#fff" };

		// Sort stops by position if needed, or assume they are sorted
		const sortedStops = [...safeStops].sort(
			(a, b) => (a.position?.x || 0) - (b.position?.x || 0)
		);

		const stopsStr = sortedStops
			.map((s) => `${s.color} ${s.position?.x || 0}%`)
			.join(", ");

		if (type === "linear") {
			return { background: `linear-gradient(${angle || 0}deg, ${stopsStr})` };
		}
		if (type === "radial") {
			return { background: `radial-gradient(circle at center, ${stopsStr})` };
		}
		if (type === "conic") {
			return { background: `conic-gradient(from 0deg, ${stopsStr})` };
		}

		return { background: safeStops[0]?.color || "#fff" };
	};

	return (
		<div
			className="relative overflow-hidden shadow-sm border border-zinc-200 rounded-xl select-none bg-white"
			style={{
				width,
				height,
				...getGradientStyle(),
			}}
		>
			{/* Images */}
			{images.map((img, i) => (
				<img
					key={`img-${i}`}
					src={img.src}
					alt={img.caption || ""}
					className="absolute object-cover pointer-events-none"
					style={{
						left: `${img.x}%`,
						top: `${img.y}%`,
						width: img.width * scale,
						height: img.height * scale,
						transform: "translate(-50%, -50%)",
						opacity: img.styles?.opacity ?? 1,
						borderRadius: (img.styles?.borderRadius || 0) * scale,
						objectFit: img.styles?.objectFit || "cover",
						zIndex: img.styles?.zIndex || 1,
					}}
				/>
			))}

			{/* Shapes */}
			{shapes.map((shape, i) => (
				<div
					key={`shape-${i}`}
					className="absolute flex items-center justify-center pointer-events-none"
					style={{
						left: `${shape.x}%`,
						top: `${shape.y}%`,
						width: shape.width * scale,
						height: shape.height * scale,
						transform: "translate(-50%, -50%)",
						backgroundColor: shape.fillColor || "transparent",
						border: `${(shape.strokeWidth || 0) * scale}px solid ${
							shape.strokeColor || "transparent"
						}`,
						borderRadius:
							shape.shapeType === "circle"
								? "50%"
								: (shape.borderRadius || 0) * scale,
						opacity: shape.opacity ?? 1,
						zIndex: shape.zIndex || 1,
					}}
				/>
			))}

			{/* Icons */}
			{icons.map((icon, i) => {
				// Dynamically get the icon component
				const IconComponent = LucideIcons[icon.iconName] || LucideIcons.Circle;
				return (
					<div
						key={`icon-${i}`}
						className="absolute flex items-center justify-center pointer-events-none"
						style={{
							left: `${icon.x}%`,
							top: `${icon.y}%`,
							width: icon.width * scale,
							height: icon.height * scale,
							transform: "translate(-50%, -50%)",
							opacity: icon.styles?.opacity ?? 1,
							zIndex: icon.styles?.zIndex || 1,
							color: icon.styles?.color || "#000",
						}}
					>
						<IconComponent
							size={Math.min(icon.width, icon.height) * scale}
							strokeWidth={icon.styles?.strokeWidth || 2}
						/>
					</div>
				);
			})}

			{/* Texts */}
			{texts.map((text, i) => (
				<div
					key={`text-${i}`}
					className="absolute whitespace-pre-wrap pointer-events-none flex"
					style={{
						left: `${text.x}%`,
						top: `${text.y}%`,
						width: text.width * scale,
						height: text.height * scale,
						transform: "translate(-50%, -50%)",
						fontSize: (text.styles?.fontSize || 24) * scale,
						color: text.styles?.color || "#000",
						fontWeight: text.styles?.fontWeight || "normal",
						fontStyle: text.styles?.fontStyle || "normal",
						zIndex: text.styles?.zIndex || 2,
						alignItems: "center",
						justifyContent:
							text.styles?.textAlign === "center"
								? "center"
								: text.styles?.textAlign === "right"
									? "flex-end"
									: "flex-start",
						textAlign: text.styles?.textAlign || "left",
						// Handle text wrapping if needed, but flex container might behave differently
						// Adding specific line-height for fidelity
						lineHeight: 1.2,
					}}
				>
					{text.content}
				</div>
			))}
		</div>
	);
};

export default VariantPreview;
