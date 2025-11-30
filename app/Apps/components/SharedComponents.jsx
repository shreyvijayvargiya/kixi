import React, { useState, useRef, useCallback, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Tailwind CSS Colors
export const tailwindColors = {
	stone: {
		50: "#fafaf9",
		100: "#f5f5f4",
		200: "#e7e5e4",
		300: "#d6d3d1",
		400: "#a8a29e",
		500: "#78716c",
		600: "#57534e",
		700: "#44403c",
		800: "#292524",
		900: "#1c1917",
	},
	zinc: {
		50: "#fafafa",
		100: "#f4f4f5",
		200: "#e4e4e7",
		300: "#d4d4d8",
		400: "#a1a1aa",
		500: "#71717a",
		600: "#52525b",
		700: "#3f3f46",
		800: "#27272a",
		900: "#18181b",
	},
	purple: {
		50: "#faf5ff",
		100: "#f3e8ff",
		200: "#e9d5ff",
		300: "#d8b4fe",
		400: "#c084fc",
		500: "#a855f7",
		600: "#9333ea",
		700: "#7e22ce",
		800: "#6b21a8",
		900: "#581c87",
	},
	orange: {
		50: "#fff7ed",
		100: "#ffedd5",
		200: "#fed7aa",
		300: "#fdba74",
		400: "#fb923c",
		500: "#f97316",
		600: "#ea580c",
		700: "#c2410c",
		800: "#9a3412",
		900: "#7c2d12",
	},
	yellow: {
		50: "#fefce8",
		100: "#fef9c3",
		200: "#fef08a",
		300: "#fde047",
		400: "#facc15",
		500: "#eab308",
		600: "#ca8a04",
		700: "#a16207",
		800: "#854d0e",
		900: "#713f12",
	},
	green: {
		50: "#f0fdf4",
		100: "#dcfce7",
		200: "#bbf7d0",
		300: "#86efac",
		400: "#4ade80",
		500: "#22c55e",
		600: "#16a34a",
		700: "#15803d",
		800: "#166534",
		900: "#14532d",
	},
	black: {
		50: "#fafafa",
		100: "#f4f4f5",
		200: "#e4e4e7",
		300: "#d4d4d8",
		400: "#a1a1aa",
		500: "#71717a",
		600: "#52525b",
		700: "#3f3f46",
		800: "#27272a",
		900: "#000000",
	},
	sky: {
		50: "#f0f9ff",
		100: "#e0f2fe",
		200: "#bae6fd",
		300: "#7dd3fc",
		400: "#38bdf8",
		500: "#0ea5e9",
		600: "#0284c7",
		700: "#0369a1",
		800: "#075985",
		900: "#0c4a6e",
	},
	red: {
		50: "#fef2f2",
		100: "#fee2e2",
		200: "#fecaca",
		300: "#fca5a5",
		400: "#f87171",
		500: "#ef4444",
		600: "#dc2626",
		700: "#b91c1c",
		800: "#991b1b",
		900: "#7f1d1d",
	},
	blue: {
		50: "#eff6ff",
		100: "#dbeafe",
		200: "#bfdbfe",
		300: "#93c5fd",
		400: "#60a5fa",
		500: "#3b82f6",
		600: "#2563eb",
		700: "#1d4ed8",
		800: "#1e40af",
		900: "#1e3a8a",
	},
};

// ColorPicker Component with Tabs
export const ColorPicker = ({ value, onChange, label }) => {
	const [activeTab, setActiveTab] = useState("colors");
	const [searchQuery, setSearchQuery] = useState("");

	const colorShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

	// Filter colors based on search
	const filteredColorGroups = Object.entries(tailwindColors).filter(
		([colorName]) => colorName.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="space-y-2">
			{label && (
				<label className="block text-xs font-medium text-zinc-700 mb-1.5">
					{label}
				</label>
			)}
			{/* Tabs */}
			<div className="flex gap-1 border-b border-zinc-200">
				<button
					type="button"
					onClick={() => setActiveTab("colors")}
					className={`px-3 py-1.5 text-xs font-medium transition-colors ${
						activeTab === "colors"
							? "text-zinc-900 border-b-2 border-zinc-900"
							: "text-zinc-500 hover:text-zinc-700"
					}`}
				>
					Colors
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("tailwind")}
					className={`px-3 py-1.5 text-xs font-medium transition-colors ${
						activeTab === "tailwind"
							? "text-zinc-900 border-b-2 border-zinc-900"
							: "text-zinc-500 hover:text-zinc-700"
					}`}
				>
					Tailwind
				</button>
			</div>

			{/* Colors Tab */}
			{activeTab === "colors" && (
				<div className="flex items-center gap-2">
					<input
						type="color"
						value={value || "#000000"}
						onChange={(e) => onChange(e.target.value)}
						className="w-10 h-6 rounded border border-zinc-300 cursor-pointer"
					/>
					<input
						type="text"
						value={value || "#000000"}
						onChange={(e) => onChange(e.target.value)}
						className="flex-1 h-8 rounded-xl border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-900 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-zinc-300"
						placeholder="#000000"
					/>
				</div>
			)}

			{/* Tailwind Tab */}
			{activeTab === "tailwind" && (
				<div className="space-y-3">
					{/* Search */}
					<div className="flex items-center gap-2 bg-zinc-50 rounded-xl px-3 py-2 border border-zinc-200">
						<Search className="w-4 h-4 text-zinc-500" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search colors..."
							className="flex-1 bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
						/>
					</div>

					{/* Color Groups */}
					<div className="max-h-64 overflow-y-auto space-y-4">
						{filteredColorGroups.map(([colorName, shades]) => (
							<div key={colorName} className="space-y-2">
								<div className="text-xs font-semibold text-zinc-700 capitalize">
									{colorName}
								</div>
								<div className="grid grid-cols-10 gap-1">
									{colorShades.map((shade) => (
										<button
											key={shade}
											type="button"
											onClick={() => onChange(shades[shade])}
											className="w-8 h-8 rounded border border-zinc-200 hover:border-zinc-400 hover:scale-110 transition-all cursor-pointer"
											style={{ backgroundColor: shades[shade] }}
											title={`${colorName}-${shade}`}
										/>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

// Gradient Presets
export const gradientPresets = [
	{
		id: 1,
		name: "Sunset",
		type: "linear",
		angle: 45,
		stops: [
			{ id: 1, color: "#FF6B6B", position: { x: 0, y: 0 } },
			{ id: 2, color: "#FFE66D", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 2,
		name: "Ocean",
		type: "linear",
		angle: 135,
		stops: [
			{ id: 1, color: "#4ECDC4", position: { x: 0, y: 0 } },
			{ id: 2, color: "#44A08D", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 3,
		name: "zinc Dream",
		type: "linear",
		angle: 90,
		stops: [
			{ id: 1, color: "#667EEA", position: { x: 0, y: 0 } },
			{ id: 2, color: "#764BA2", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 4,
		name: "Forest",
		type: "linear",
		angle: 45,
		stops: [
			{ id: 1, color: "#11998E", position: { x: 0, y: 0 } },
			{ id: 2, color: "#38EF7D", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 5,
		name: "Coral",
		type: "linear",
		angle: 120,
		stops: [
			{ id: 1, color: "#FF9A9E", position: { x: 0, y: 0 } },
			{ id: 2, color: "#FECFEF", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 6,
		name: "Blue Sky",
		type: "linear",
		angle: 180,
		stops: [
			{ id: 1, color: "#3494E6", position: { x: 0, y: 0 } },
			{ id: 2, color: "#EC6EAD", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 7,
		name: "Peach",
		type: "linear",
		angle: 45,
		stops: [
			{ id: 1, color: "#FFECD2", position: { x: 0, y: 0 } },
			{ id: 2, color: "#FCB69F", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 8,
		name: "Midnight",
		type: "linear",
		angle: 135,
		stops: [
			{ id: 1, color: "#0F2027", position: { x: 0, y: 0 } },
			{ id: 2, color: "#203A43", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 9,
		name: "Rose Gold",
		type: "linear",
		angle: 90,
		stops: [
			{ id: 1, color: "#F093FB", position: { x: 0, y: 0 } },
			{ id: 2, color: "#F5576C", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 10,
		name: "Mint",
		type: "linear",
		angle: 45,
		stops: [
			{ id: 1, color: "#A8EDEA", position: { x: 0, y: 0 } },
			{ id: 2, color: "#FED6E3", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 11,
		name: "Fire",
		type: "linear",
		angle: 45,
		stops: [
			{ id: 1, color: "#FF416C", position: { x: 0, y: 0 } },
			{ id: 2, color: "#FF4B2B", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 12,
		name: "Lavender",
		type: "linear",
		angle: 135,
		stops: [
			{ id: 1, color: "#E0C3FC", position: { x: 0, y: 0 } },
			{ id: 2, color: "#8EC5FC", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 13,
		name: "zinc Tea",
		type: "linear",
		angle: 90,
		stops: [
			{ id: 1, color: "#D4FC79", position: { x: 0, y: 0 } },
			{ id: 2, color: "#96E6A1", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 14,
		name: "Cherry",
		type: "linear",
		angle: 45,
		stops: [
			{ id: 1, color: "#EB3349", position: { x: 0, y: 0 } },
			{ id: 2, color: "#F45C43", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 15,
		name: "Sky Blue",
		type: "linear",
		angle: 180,
		stops: [
			{ id: 1, color: "#89F7FE", position: { x: 0, y: 0 } },
			{ id: 2, color: "#66A6FF", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 16,
		name: "Orange",
		type: "linear",
		angle: 120,
		stops: [
			{ id: 1, color: "#FFB347", position: { x: 0, y: 0 } },
			{ id: 2, color: "#FFCC33", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 17,
		name: "Violet",
		type: "linear",
		angle: 135,
		stops: [
			{ id: 1, color: "#8360C3", position: { x: 0, y: 0 } },
			{ id: 2, color: "#2EBF91", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 18,
		name: "Pink",
		type: "linear",
		angle: 45,
		stops: [
			{ id: 1, color: "#FF6B95", position: { x: 0, y: 0 } },
			{ id: 2, color: "#FFC796", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 19,
		name: "Cyan",
		type: "linear",
		angle: 90,
		stops: [
			{ id: 1, color: "#00F5FF", position: { x: 0, y: 0 } },
			{ id: 2, color: "#00D4FF", position: { x: 100, y: 100 } },
		],
	},
	{
		id: 20,
		name: "Golden",
		type: "linear",
		angle: 45,
		stops: [
			{ id: 1, color: "#F6D365", position: { x: 0, y: 0 } },
			{ id: 2, color: "#FDA085", position: { x: 100, y: 100 } },
		],
	},
];

// Helper function to generate gradient CSS from preset
export const generatePresetGradientCSS = (preset) => {
	if (preset.type === "linear") {
		return `linear-gradient(${preset.angle || 45}deg, ${
			preset.stops[0].color
		}, ${preset.stops[1].color})`;
	} else if (preset.type === "radial") {
		return `radial-gradient(circle, ${preset.stops[0].color}, ${preset.stops[1].color})`;
	} else if (preset.type === "conic") {
		return `conic-gradient(${preset.stops[0].color}, ${preset.stops[1].color})`;
	}
	return `linear-gradient(45deg, ${preset.stops[0].color}, ${preset.stops[1].color})`;
};

// Custom Dropdown Component
export const Dropdown = ({
	value,
	onChange,
	options,
	placeholder,
	icon,
	className = "",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const handleClickOutside = useCallback((event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [handleClickOutside]);

	const selectedOption = options.find((option) => option.value === value);

	return (
		<div ref={dropdownRef} className={`relative ${className}`}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full px-2 py-1 text-sm border border-zinc-200 hover:bg-zinc-100 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-100 focus:border-zinc-100 transition-all duration-100 ease-in flex items-center justify-between"
			>
				<span className="text-left">
					{selectedOption?.label || placeholder || icon}
				</span>
				<ChevronDown
					className={`w-4 h-4 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.15 }}
						className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow overflow-hidden"
					>
						{options.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => {
									onChange(option.value);
									setIsOpen(false);
								}}
								className={`w-full px-2 py-1 text-sm text-left hover:bg-zinc-50 transition-colors ${
									value === option.value
										? "bg-zinc-100 text-zinc-900"
										: "text-zinc-700"
								}`}
							>
								{option.label}
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
