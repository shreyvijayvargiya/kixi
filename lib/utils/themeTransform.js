// Theme transformation utilities
// This file contains helper functions for transforming component themes

// Predefined color mappings for each theme
export const themeColorMappings = {
	// Dark theme - dark backgrounds, light text
	dark: {
		// Background colors
		"bg-white": "bg-zinc-900",
		"bg-gray-50": "bg-zinc-800",
		"bg-gray-100": "bg-zinc-800",
		"bg-gray-200": "bg-zinc-700",
		"bg-zinc-50": "bg-zinc-800",
		"bg-zinc-100": "bg-zinc-800",
		"bg-zinc-200": "bg-zinc-700",
		"bg-slate-50": "bg-slate-800",
		"bg-slate-100": "bg-slate-800",
		"bg-slate-200": "bg-slate-700",
		"bg-black/20": "bg-zinc-900/80",
		"bg-black/10": "bg-zinc-900/60",
		"bg-black/5": "bg-zinc-900/40",

		// Text colors
		"text-zinc-900": "text-zinc-100",
		"text-zinc-800": "text-zinc-200",
		"text-zinc-700": "text-zinc-300",
		"text-zinc-600": "text-zinc-400",
		"text-zinc-500": "text-zinc-400",
		"text-gray-900": "text-gray-100",
		"text-gray-800": "text-gray-200",
		"text-gray-700": "text-gray-300",
		"text-gray-600": "text-gray-400",
		"text-black": "text-white",

		// Border colors
		"border-zinc-200": "border-zinc-700",
		"border-zinc-300": "border-zinc-600",
		"border-gray-200": "border-gray-700",
		"border-gray-300": "border-gray-600",
		"border-black": "border-white",

		// Hover states
		"hover:bg-zinc-100": "hover:bg-zinc-700",
		"hover:bg-gray-100": "hover:bg-gray-700",
		"hover:text-zinc-700": "hover:text-zinc-300",
		"hover:text-gray-700": "hover:text-gray-300",
		"hover:border-zinc-300": "hover:border-zinc-600",

		// Focus states
		"focus:ring-zinc-500": "focus:ring-zinc-400",
		"focus:border-zinc-500": "focus:border-zinc-400",
	},

	// Light theme - light backgrounds, dark text
	light: {
		// Background colors
		"bg-zinc-900": "bg-white",
		"bg-zinc-800": "bg-gray-50",
		"bg-zinc-700": "bg-gray-100",
		"bg-slate-800": "bg-slate-50",
		"bg-slate-700": "bg-slate-100",
		"bg-gray-800": "bg-gray-50",
		"bg-gray-700": "bg-gray-100",
		"bg-black": "bg-white",

		// Text colors
		"text-zinc-100": "text-zinc-900",
		"text-zinc-200": "text-zinc-800",
		"text-zinc-300": "text-zinc-700",
		"text-zinc-400": "text-zinc-600",
		"text-gray-100": "text-gray-900",
		"text-gray-200": "text-gray-800",
		"text-gray-300": "text-gray-700",
		"text-gray-400": "text-gray-600",
		"text-white": "text-black",

		// Border colors
		"border-zinc-700": "border-zinc-200",
		"border-zinc-600": "border-zinc-300",
		"border-gray-700": "border-gray-200",
		"border-gray-600": "border-gray-300",
		"border-white": "border-black",

		// Hover states
		"hover:bg-zinc-700": "hover:bg-zinc-100",
		"hover:bg-gray-700": "hover:bg-gray-100",
		"hover:text-zinc-300": "hover:text-zinc-700",
		"hover:text-gray-300": "hover:text-gray-700",
		"hover:border-zinc-600": "hover:border-zinc-300",
	},

	// Colorful theme - vibrant colors
	colorful: {
		// Background colors
		"bg-white": "bg-gradient-to-br from-purple-500 to-pink-500",
		"bg-gray-50": "bg-gradient-to-r from-blue-400 to-purple-500",
		"bg-gray-100": "bg-gradient-to-r from-green-400 to-blue-500",
		"bg-zinc-50": "bg-gradient-to-r from-yellow-400 to-orange-500",
		"bg-zinc-100": "bg-gradient-to-r from-pink-400 to-red-500",
		"bg-zinc-200": "bg-gradient-to-r from-indigo-400 to-purple-500",
		"bg-zinc-900": "bg-gradient-to-br from-purple-600 to-pink-600",
		"bg-zinc-800": "bg-gradient-to-r from-blue-500 to-purple-600",

		// Text colors
		"text-zinc-900": "text-white",
		"text-zinc-800": "text-white",
		"text-zinc-700": "text-white",
		"text-zinc-600": "text-white",
		"text-gray-900": "text-white",
		"text-gray-800": "text-white",
		"text-gray-700": "text-white",
		"text-black": "text-white",

		// Border colors
		"border-zinc-200": "border-white/20",
		"border-zinc-300": "border-white/30",
		"border-gray-200": "border-white/20",
		"border-gray-300": "border-white/30",

		// Hover states
		"hover:bg-zinc-100": "hover:bg-white/20",
		"hover:bg-gray-100": "hover:bg-white/20",
		"hover:text-zinc-700": "hover:text-white",
		"hover:text-gray-700": "hover:text-white",
	},

	// Minimal theme - clean and simple
	minimal: {
		// Background colors
		"bg-zinc-900": "bg-white",
		"bg-zinc-800": "bg-gray-50",
		"bg-zinc-700": "bg-gray-100",
		"bg-gradient-to-br": "bg-white",
		"bg-gradient-to-r": "bg-gray-50",

		// Text colors
		"text-zinc-100": "text-gray-900",
		"text-zinc-200": "text-gray-800",
		"text-zinc-300": "text-gray-700",
		"text-zinc-400": "text-gray-600",
		"text-white": "text-gray-900",

		// Border colors
		"border-zinc-700": "border-gray-200",
		"border-zinc-600": "border-gray-300",
		"border-white/20": "border-gray-200",
		"border-white/30": "border-gray-300",

		// Hover states
		"hover:bg-zinc-700": "hover:bg-gray-100",
		"hover:bg-white/20": "hover:bg-gray-100",
		"hover:text-zinc-300": "hover:text-gray-700",
		"hover:text-white": "hover:text-gray-900",
	},

	// Modern theme - contemporary design
	modern: {
		// Background colors
		"bg-white": "bg-slate-50",
		"bg-gray-50": "bg-slate-100",
		"bg-gray-100": "bg-slate-200",
		"bg-zinc-50": "bg-slate-100",
		"bg-zinc-100": "bg-slate-200",
		"bg-zinc-200": "bg-slate-300",
		"bg-zinc-900": "bg-slate-900",
		"bg-zinc-800": "bg-slate-800",
		"bg-zinc-700": "bg-slate-700",

		// Text colors
		"text-zinc-900": "text-slate-900",
		"text-zinc-800": "text-slate-800",
		"text-zinc-700": "text-slate-700",
		"text-zinc-600": "text-slate-600",
		"text-gray-900": "text-slate-900",
		"text-gray-800": "text-slate-800",
		"text-gray-700": "text-slate-700",
		"text-gray-600": "text-slate-600",
		"text-black": "text-slate-900",

		// Border colors
		"border-zinc-200": "border-slate-200",
		"border-zinc-300": "border-slate-300",
		"border-gray-200": "border-slate-200",
		"border-gray-300": "border-slate-300",

		// Hover states
		"hover:bg-zinc-100": "hover:bg-slate-100",
		"hover:bg-gray-100": "hover:bg-slate-100",
		"hover:text-zinc-700": "hover:text-slate-700",
		"hover:text-gray-700": "hover:text-slate-700",
		"hover:border-zinc-300": "hover:border-slate-300",
	},

	// Retro theme - vintage-inspired
	retro: {
		// Background colors
		"bg-white": "bg-orange-50",
		"bg-gray-50": "bg-yellow-50",
		"bg-gray-100": "bg-orange-100",
		"bg-zinc-50": "bg-yellow-100",
		"bg-zinc-100": "bg-orange-100",
		"bg-zinc-200": "bg-yellow-200",
		"bg-zinc-900": "bg-orange-900",
		"bg-zinc-800": "bg-orange-800",
		"bg-zinc-700": "bg-orange-700",

		// Text colors
		"text-zinc-900": "text-orange-900",
		"text-zinc-800": "text-orange-800",
		"text-zinc-700": "text-orange-700",
		"text-zinc-600": "text-orange-600",
		"text-gray-900": "text-orange-900",
		"text-gray-800": "text-orange-800",
		"text-gray-700": "text-orange-700",
		"text-gray-600": "text-orange-600",
		"text-black": "text-orange-900",

		// Border colors
		"border-zinc-200": "border-orange-200",
		"border-zinc-300": "border-orange-300",
		"border-gray-200": "border-orange-200",
		"border-gray-300": "border-orange-300",

		// Hover states
		"hover:bg-zinc-100": "hover:bg-orange-100",
		"hover:bg-gray-100": "hover:bg-orange-100",
		"hover:text-zinc-700": "hover:text-orange-700",
		"hover:text-gray-700": "hover:text-orange-700",
		"hover:border-zinc-300": "hover:border-orange-300",
	},

	// Corporate theme - professional blues and grays
	corporate: {
		// Background colors
		"bg-white": "bg-blue-50",
		"bg-gray-50": "bg-slate-50",
		"bg-gray-100": "bg-blue-100",
		"bg-zinc-50": "bg-slate-100",
		"bg-zinc-100": "bg-blue-100",
		"bg-zinc-200": "bg-slate-200",
		"bg-zinc-900": "bg-blue-900",
		"bg-zinc-800": "bg-blue-800",
		"bg-zinc-700": "bg-blue-700",

		// Text colors
		"text-zinc-900": "text-blue-900",
		"text-zinc-800": "text-blue-800",
		"text-zinc-700": "text-blue-700",
		"text-zinc-600": "text-blue-600",
		"text-gray-900": "text-blue-900",
		"text-gray-800": "text-blue-800",
		"text-gray-700": "text-blue-700",
		"text-gray-600": "text-blue-600",
		"text-black": "text-blue-900",

		// Border colors
		"border-zinc-200": "border-blue-200",
		"border-zinc-300": "border-blue-300",
		"border-gray-200": "border-blue-200",
		"border-gray-300": "border-blue-300",

		// Hover states
		"hover:bg-zinc-100": "hover:bg-blue-100",
		"hover:bg-gray-100": "hover:bg-blue-100",
		"hover:text-zinc-700": "hover:text-blue-700",
		"hover:text-gray-700": "hover:text-blue-700",
		"hover:border-zinc-300": "hover:border-blue-300",
	},

	// Playful theme - fun and bright
	playful: {
		// Background colors
		"bg-white": "bg-yellow-50",
		"bg-gray-50": "bg-pink-50",
		"bg-gray-100": "bg-yellow-100",
		"bg-zinc-50": "bg-pink-100",
		"bg-zinc-100": "bg-yellow-100",
		"bg-zinc-200": "bg-pink-200",
		"bg-zinc-900": "bg-purple-900",
		"bg-zinc-800": "bg-purple-800",
		"bg-zinc-700": "bg-purple-700",

		// Text colors
		"text-zinc-900": "text-purple-900",
		"text-zinc-800": "text-purple-800",
		"text-zinc-700": "text-purple-700",
		"text-zinc-600": "text-purple-600",
		"text-gray-900": "text-purple-900",
		"text-gray-800": "text-purple-800",
		"text-gray-700": "text-purple-700",
		"text-gray-600": "text-purple-600",
		"text-black": "text-purple-900",

		// Border colors
		"border-zinc-200": "border-purple-200",
		"border-zinc-300": "border-purple-300",
		"border-gray-200": "border-purple-200",
		"border-gray-300": "border-purple-300",

		// Hover states
		"hover:bg-zinc-100": "hover:bg-purple-100",
		"hover:bg-gray-100": "hover:bg-purple-100",
		"hover:text-zinc-700": "hover:text-purple-700",
		"hover:text-gray-700": "hover:text-purple-700",
		"hover:border-zinc-300": "hover:border-purple-300",
	},
};

/**
 * Transform color classes in a string based on the selected theme
 * @param {string} code - The original component code
 * @param {string} theme - The theme to apply
 * @returns {string} - The transformed code
 */
export const transformColorClasses = (code, theme) => {
	if (!themeColorMappings[theme]) {
		return code; // Return original code if theme not found
	}

	const mappings = themeColorMappings[theme];
	let transformedCode = code;

	// Apply color transformations
	Object.entries(mappings).forEach(([oldClass, newClass]) => {
		// Use word boundaries to ensure we only replace complete class names
		const regex = new RegExp(
			`\\b${oldClass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
			"g"
		);
		transformedCode = transformedCode.replace(regex, newClass);
	});

	return transformedCode;
};

/**
 * Transform inline styles based on the selected theme
 * @param {string} code - The original component code
 * @param {string} theme - The theme to apply
 * @returns {string} - The transformed code
 */
export const transformInlineStyles = (code, theme) => {
	if (!themeColorMappings[theme]) {
		return code;
	}

	// Common color transformations for inline styles
	const styleMappings = {
		dark: {
			backgroundColor: {
				"#ffffff": "#18181b", // white to zinc-900
				"#f9fafb": "#27272a", // gray-50 to zinc-800
				"#f3f4f6": "#27272a", // gray-100 to zinc-800
				"#e5e7eb": "#3f3f46", // gray-200 to zinc-700
			},
			color: {
				"#111827": "#fafafa", // gray-900 to gray-100
				"#1f2937": "#e5e7eb", // gray-800 to gray-200
				"#374151": "#d1d5db", // gray-700 to gray-300
				"#4b5563": "#9ca3af", // gray-600 to gray-400
				"#000000": "#ffffff", // black to white
			},
			borderColor: {
				"#e5e7eb": "#3f3f46", // gray-200 to zinc-700
				"#d1d5db": "#52525b", // gray-300 to zinc-600
			},
		},
		light: {
			backgroundColor: {
				"#18181b": "#ffffff", // zinc-900 to white
				"#27272a": "#f9fafb", // zinc-800 to gray-50
				"#3f3f46": "#f3f4f6", // zinc-700 to gray-100
			},
			color: {
				"#fafafa": "#111827", // gray-100 to gray-900
				"#e5e7eb": "#1f2937", // gray-200 to gray-800
				"#d1d5db": "#374151", // gray-300 to gray-700
				"#9ca3af": "#4b5563", // gray-400 to gray-600
				"#ffffff": "#000000", // white to black
			},
			borderColor: {
				"#3f3f46": "#e5e7eb", // zinc-700 to gray-200
				"#52525b": "#d1d5db", // zinc-600 to gray-300
			},
		},
	};

	const styleMapping = styleMappings[theme];
	if (!styleMapping) return code;

	let transformedCode = code;

	// Transform inline styles
	Object.entries(styleMapping).forEach(([property, colorMap]) => {
		Object.entries(colorMap).forEach(([oldColor, newColor]) => {
			const regex = new RegExp(
				`${property}\\s*:\\s*['"]?${oldColor}['"]?`,
				"g"
			);
			transformedCode = transformedCode.replace(
				regex,
				`${property}: '${newColor}'`
			);
		});
	});

	return transformedCode;
};

/**
 * Main function to transform component theme
 * @param {string} componentCode - The original component code
 * @param {string} theme - The theme to apply
 * @returns {string} - The transformed code
 */
export const transformComponentTheme = (componentCode, theme) => {
	if (!componentCode || !theme) {
		return componentCode;
	}

	// Transform Tailwind classes
	let transformedCode = transformColorClasses(componentCode, theme);

	// Transform inline styles
	transformedCode = transformInlineStyles(transformedCode, theme);

	return transformedCode;
};

/**
 * Get available themes
 * @returns {Array} - Array of available theme names
 */
export const getAvailableThemes = () => {
	return Object.keys(themeColorMappings);
};

/**
 * Check if a theme is valid
 * @param {string} theme - The theme to check
 * @returns {boolean} - Whether the theme is valid
 */
export const isValidTheme = (theme) => {
	return themeColorMappings.hasOwnProperty(theme);
};
