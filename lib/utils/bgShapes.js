import React from "react";

// Background shape patterns using SVG patterns
export const backgroundShapes = [
	{
		id: "dots",
		name: "Dots",
		pattern: (scale = 1, uniqueId = "dots") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={20 * scale}
						height={20 * scale}
						patternUnits="userSpaceOnUse"
					>
						<circle
							cx={10 * scale}
							cy={10 * scale}
							r={2 * scale}
							fill="currentColor"
							opacity="0.3"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "dots-large",
		name: "Large Dots",
		pattern: (scale = 1, uniqueId = "dots-large") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={40 * scale}
						height={40 * scale}
						patternUnits="userSpaceOnUse"
					>
						<circle
							cx={20 * scale}
							cy={20 * scale}
							r={4 * scale}
							fill="currentColor"
							opacity="0.3"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "grid",
		name: "Grid",
		pattern: (scale = 1, uniqueId = "grid") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={30 * scale}
						height={30 * scale}
						patternUnits="userSpaceOnUse"
					>
						<path
							d={`M ${30 * scale} 0 L 0 0 0 ${30 * scale}`}
							fill="none"
							stroke="currentColor"
							strokeWidth={1 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "grid-dots",
		name: "Grid Dots",
		pattern: (scale = 1, uniqueId = "grid-dots") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={30 * scale}
						height={30 * scale}
						patternUnits="userSpaceOnUse"
					>
						<circle
							cx={15 * scale}
							cy={15 * scale}
							r={1.5 * scale}
							fill="currentColor"
							opacity="0.3"
						/>
						<path
							d={`M ${30 * scale} 0 L 0 0 0 ${30 * scale}`}
							fill="none"
							stroke="currentColor"
							strokeWidth={0.5 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "diagonal-lines",
		name: "Diagonal Lines",
		pattern: (scale = 1, uniqueId = "diagonal-lines") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={40 * scale}
						height={40 * scale}
						patternUnits="userSpaceOnUse"
					>
						<path
							d={`M 0 ${40 * scale} L ${40 * scale} 0`}
							fill="none"
							stroke="currentColor"
							strokeWidth={1 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "diagonal-lines-reverse",
		name: "Diagonal Lines (Reverse)",
		pattern: (scale = 1, uniqueId = "diagonal-lines-reverse") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={40 * scale}
						height={40 * scale}
						patternUnits="userSpaceOnUse"
					>
						<path
							d={`M 0 0 L ${40 * scale} ${40 * scale}`}
							fill="none"
							stroke="currentColor"
							strokeWidth={1 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "crosshatch",
		name: "Crosshatch",
		pattern: (scale = 1, uniqueId = "crosshatch") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={40 * scale}
						height={40 * scale}
						patternUnits="userSpaceOnUse"
					>
						<path
							d={`M 0 ${40 * scale} L ${40 * scale} 0 M 0 0 L ${40 * scale} ${40 * scale}`}
							fill="none"
							stroke="currentColor"
							strokeWidth={1 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "waves",
		name: "Waves",
		pattern: (scale = 1, uniqueId = "waves") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={60 * scale}
						height={30 * scale}
						patternUnits="userSpaceOnUse"
					>
						<path
							d={`M 0 ${15 * scale} Q ${15 * scale} ${5 * scale}, ${30 * scale} ${15 * scale} T ${60 * scale} ${15 * scale}`}
							fill="none"
							stroke="currentColor"
							strokeWidth={1.5 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "hexagons",
		name: "Hexagons",
		pattern: (scale = 1, uniqueId = "hexagons") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={50 * scale}
						height={43.3 * scale}
						patternUnits="userSpaceOnUse"
					>
						<polygon
							points={`${25 * scale},${5 * scale} ${45 * scale},${15 * scale} ${45 * scale},${28.3 * scale} ${25 * scale},${38.3 * scale} ${5 * scale},${28.3 * scale} ${5 * scale},${15 * scale}`}
							fill="none"
							stroke="currentColor"
							strokeWidth={1 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "circles",
		name: "Circles",
		pattern: (scale = 1, uniqueId = "circles") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={50 * scale}
						height={50 * scale}
						patternUnits="userSpaceOnUse"
					>
						<circle
							cx={25 * scale}
							cy={25 * scale}
							r={20 * scale}
							fill="none"
							stroke="currentColor"
							strokeWidth={1 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "squares",
		name: "Squares",
		pattern: (scale = 1, uniqueId = "squares") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={30 * scale}
						height={30 * scale}
						patternUnits="userSpaceOnUse"
					>
						<rect
							x={5 * scale}
							y={5 * scale}
							width={20 * scale}
							height={20 * scale}
							fill="none"
							stroke="currentColor"
							strokeWidth={1 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "triangles",
		name: "Triangles",
		pattern: (scale = 1, uniqueId = "triangles") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={40 * scale}
						height={34.64 * scale}
						patternUnits="userSpaceOnUse"
					>
						<polygon
							points={`${20 * scale},${5 * scale} ${35 * scale},${29.64 * scale} ${5 * scale},${29.64 * scale}`}
							fill="none"
							stroke="currentColor"
							strokeWidth={1 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "zigzag",
		name: "Zigzag",
		pattern: (scale = 1, uniqueId = "zigzag") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={40 * scale}
						height={20 * scale}
						patternUnits="userSpaceOnUse"
					>
						<path
							d={`M 0 ${10 * scale} L ${10 * scale} ${5 * scale} L ${20 * scale} ${10 * scale} L ${30 * scale} ${5 * scale} L ${40 * scale} ${10 * scale}`}
							fill="none"
							stroke="currentColor"
							strokeWidth={1.5 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "dots-scattered",
		name: "Scattered Dots",
		pattern: (scale = 1, uniqueId = "dots-scattered") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={50 * scale}
						height={50 * scale}
						patternUnits="userSpaceOnUse"
					>
						<circle
							cx={10 * scale}
							cy={15 * scale}
							r={2 * scale}
							fill="currentColor"
							opacity="0.3"
						/>
						<circle
							cx={35 * scale}
							cy={20 * scale}
							r={1.5 * scale}
							fill="currentColor"
							opacity="0.25"
						/>
						<circle
							cx={20 * scale}
							cy={40 * scale}
							r={2.5 * scale}
							fill="currentColor"
							opacity="0.2"
						/>
						<circle
							cx={45 * scale}
							cy={5 * scale}
							r={1 * scale}
							fill="currentColor"
							opacity="0.3"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "vertical-lines",
		name: "Vertical Lines",
		pattern: (scale = 1, uniqueId = "vertical-lines") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width={20 * scale}
						height="100%"
						patternUnits="userSpaceOnUse"
					>
						<line
							x1={10 * scale}
							y1="0"
							x2={10 * scale}
							y2="100%"
							stroke="currentColor"
							strokeWidth={1 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
	{
		id: "horizontal-lines",
		name: "Horizontal Lines",
		pattern: (scale = 1, uniqueId = "horizontal-lines") => (
			<svg width="100%" height="100%" className="absolute inset-0">
				<defs>
					<pattern
						id={`${uniqueId}-pattern`}
						x="0"
						y="0"
						width="100%"
						height={20 * scale}
						patternUnits="userSpaceOnUse"
					>
						<line
							x1="0"
							y1={10 * scale}
							x2="100%"
							y2={10 * scale}
							stroke="currentColor"
							strokeWidth={1 * scale}
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${uniqueId}-pattern)`} />
			</svg>
		),
	},
];

// Component to render a background shape
export const BackgroundShape = ({ shapeId, scale = 1, color = "#000000" }) => {
	const shape = backgroundShapes.find((s) => s.id === shapeId);
	if (!shape) return null;

	// Generate unique ID for this pattern instance
	const uniqueId = `${shapeId}-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<div
			className="absolute inset-0 pointer-events-none"
			style={{ color }}
		>
			{shape.pattern(scale, uniqueId)}
		</div>
	);
};

// Get shape options for dropdown
export const getShapeOptions = () => {
	return backgroundShapes.map((shape) => ({
		value: shape.id,
		label: shape.name,
	}));
};

