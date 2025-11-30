import { z } from "zod";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
	apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

// Pattern Templates for common visual effects
const patternTemplates = {
	sun: {
		name: "Sun Background",
		description:
			"Creates a radial gradient sun with yellow center, orange middle, and light blue outer",
		keywords: ["sun", "sunny", "sunlight"],
		actions: [
			{ type: "change_gradient_type", gradientType: "radial" },
			{
				type: "modify_color_stop",
				colorStopId: 1,
				color: "#FFD700",
				colorStopPosition: { x: 50, y: 50 },
			},
			{ type: "add_color_stop", color: "#FF8C00" },
			{
				type: "modify_color_stop",
				colorStopId: 2,
				colorStopPosition: { x: 60, y: 60 },
			},
			{ type: "add_color_stop", color: "#87CEEB" },
			{
				type: "modify_color_stop",
				colorStopId: 3,
				colorStopPosition: { x: 80, y: 80 },
			},
		],
	},
	sunset: {
		name: "Sunset",
		description: "Creates a beautiful sunset gradient",
		keywords: ["sunset", "dusk", "evening"],
		actions: [
			{ type: "change_gradient_type", gradientType: "linear", angle: 90 },
			{
				type: "modify_color_stop",
				colorStopId: 1,
				color: "#FF6B6B",
				colorStopPosition: { x: 0, y: 0 },
			},
			{
				type: "modify_color_stop",
				colorStopId: 2,
				color: "#FFE66D",
				colorStopPosition: { x: 100, y: 100 },
			},
			{
				type: "add_color_stop",
				color: "#4ECDC4",
				colorStopPosition: { x: 50, y: 50 },
			},
		],
	},
	ocean: {
		name: "Ocean",
		description: "Creates an ocean-themed gradient",
		keywords: ["ocean", "sea", "water"],
		actions: [
			{ type: "change_gradient_type", gradientType: "linear", angle: 135 },
			{
				type: "modify_color_stop",
				colorStopId: 1,
				color: "#4ECDC4",
				colorStopPosition: { x: 0, y: 0 },
			},
			{
				type: "modify_color_stop",
				colorStopId: 2,
				color: "#44A08D",
				colorStopPosition: { x: 100, y: 100 },
			},
		],
	},
	forest: {
		name: "Forest",
		description: "Creates a forest-themed gradient",
		keywords: ["forest", "trees", "nature"],
		actions: [
			{ type: "change_gradient_type", gradientType: "linear", angle: 45 },
			{
				type: "modify_color_stop",
				colorStopId: 1,
				color: "#11998E",
				colorStopPosition: { x: 0, y: 0 },
			},
			{
				type: "modify_color_stop",
				colorStopId: 2,
				color: "#38EF7D",
				colorStopPosition: { x: 100, y: 100 },
			},
		],
	},
	night_sky: {
		name: "Night Sky",
		description: "Creates a dark night sky with stars effect",
		keywords: ["night", "dark", "sky", "stars"],
		actions: [
			{ type: "change_gradient_type", gradientType: "radial" },
			{
				type: "modify_color_stop",
				colorStopId: 1,
				color: "#0F2027",
				colorStopPosition: { x: 50, y: 50 },
			},
			{
				type: "add_color_stop",
				color: "#203A43",
				colorStopPosition: { x: 70, y: 70 },
			},
			{
				type: "add_color_stop",
				color: "#2C5364",
				colorStopPosition: { x: 100, y: 100 },
			},
		],
	},
	clouds: {
		name: "Clouds",
		description: "Creates fluffy clouds using rounded rectangles",
		keywords: ["cloud", "clouds", "cloudy", "sky"],
		actions: [
			{
				type: "add_shape",
				shapeType: "rectangle",
				x: 20,
				y: 25,
				width: 120,
				height: 80,
				fillColor: "#FFFFFF",
				strokeColor: "transparent",
				strokeWidth: 0,
				shapeBorderRadius: 60,
				shapeOpacity: 0.9,
				shapeZIndex: 2,
			},
			{
				type: "add_shape",
				shapeType: "rectangle",
				x: 35,
				y: 30,
				width: 100,
				height: 70,
				fillColor: "#FFFFFF",
				strokeColor: "transparent",
				strokeWidth: 0,
				shapeBorderRadius: 50,
				shapeOpacity: 0.9,
				shapeZIndex: 2,
			},
			{
				type: "add_shape",
				shapeType: "rectangle",
				x: 50,
				y: 25,
				width: 130,
				height: 85,
				fillColor: "#FFFFFF",
				strokeColor: "transparent",
				strokeWidth: 0,
				shapeBorderRadius: 65,
				shapeOpacity: 0.9,
				shapeZIndex: 2,
			},
			{
				type: "add_shape",
				shapeType: "rectangle",
				x: 70,
				y: 30,
				width: 110,
				height: 75,
				fillColor: "#FFFFFF",
				strokeColor: "transparent",
				strokeWidth: 0,
				shapeBorderRadius: 55,
				shapeOpacity: 0.9,
				shapeZIndex: 2,
			},
			{
				type: "add_shape",
				shapeType: "rectangle",
				x: 80,
				y: 25,
				width: 100,
				height: 70,
				fillColor: "#FFFFFF",
				strokeColor: "transparent",
				strokeWidth: 0,
				shapeBorderRadius: 50,
				shapeOpacity: 0.9,
				shapeZIndex: 2,
			},
		],
	},
	mountains: {
		name: "Mountains",
		description: "Creates mountain range using triangles",
		keywords: ["mountain", "mountains", "hill", "hills", "landscape"],
		actions: [
			{
				type: "add_shape",
				shapeType: "triangle",
				x: 15,
				y: 85,
				width: 200,
				height: 150,
				fillColor: "#2D5016",
				strokeColor: "#1a3d0e",
				strokeWidth: 2,
				shapeZIndex: 2,
			},
			{
				type: "add_shape",
				shapeType: "triangle",
				x: 35,
				y: 80,
				width: 180,
				height: 140,
				fillColor: "#3d6b20",
				strokeColor: "#2D5016",
				strokeWidth: 2,
				shapeZIndex: 2,
			},
			{
				type: "add_shape",
				shapeType: "triangle",
				x: 50,
				y: 75,
				width: 220,
				height: 160,
				fillColor: "#4a7c29",
				strokeColor: "#3d6b20",
				strokeWidth: 2,
				shapeZIndex: 2,
			},
			{
				type: "add_shape",
				shapeType: "triangle",
				x: 70,
				y: 82,
				width: 190,
				height: 145,
				fillColor: "#5d9540",
				strokeColor: "#4a7c29",
				strokeWidth: 2,
				shapeZIndex: 2,
			},
			{
				type: "add_shape",
				shapeType: "triangle",
				x: 85,
				y: 78,
				width: 200,
				height: 155,
				fillColor: "#6ba84f",
				strokeColor: "#5d9540",
				strokeWidth: 2,
				shapeZIndex: 2,
			},
		],
	},
	landscape: {
		name: "Landscape",
		description: "Creates a complete landscape with sky, mountains, and clouds",
		keywords: ["landscape", "scenery", "nature", "view"],
		actions: [
			// Sky gradient
			{
				type: "change_gradient_type",
				gradientType: "linear",
				angle: 180,
			},
			{
				type: "modify_color_stop",
				colorStopId: 1,
				color: "#87CEEB",
				colorStopPosition: { x: 50, y: 0 },
			},
			{
				type: "modify_color_stop",
				colorStopId: 2,
				color: "#E0F6FF",
				colorStopPosition: { x: 50, y: 100 },
			},
			// Mountains
			{
				type: "add_shape",
				shapeType: "triangle",
				x: 15,
				y: 85,
				width: 200,
				height: 150,
				fillColor: "#2D5016",
				strokeColor: "#1a3d0e",
				strokeWidth: 2,
				shapeZIndex: 2,
			},
			{
				type: "add_shape",
				shapeType: "triangle",
				x: 50,
				y: 75,
				width: 220,
				height: 160,
				fillColor: "#4a7c29",
				strokeColor: "#3d6b20",
				strokeWidth: 2,
				shapeZIndex: 2,
			},
			{
				type: "add_shape",
				shapeType: "triangle",
				x: 85,
				y: 78,
				width: 200,
				height: 155,
				fillColor: "#6ba84f",
				strokeColor: "#5d9540",
				strokeWidth: 2,
				shapeZIndex: 2,
			},
			// Clouds
			{
				type: "add_shape",
				shapeType: "rectangle",
				x: 25,
				y: 25,
				width: 120,
				height: 80,
				fillColor: "#FFFFFF",
				strokeColor: "transparent",
				strokeWidth: 0,
				shapeBorderRadius: 60,
				shapeOpacity: 0.9,
				shapeZIndex: 3,
			},
			{
				type: "add_shape",
				shapeType: "rectangle",
				x: 50,
				y: 25,
				width: 130,
				height: 85,
				fillColor: "#FFFFFF",
				strokeColor: "transparent",
				strokeWidth: 0,
				shapeBorderRadius: 65,
				shapeOpacity: 0.9,
				shapeZIndex: 3,
			},
			{
				type: "add_shape",
				shapeType: "rectangle",
				x: 75,
				y: 30,
				width: 110,
				height: 75,
				fillColor: "#FFFFFF",
				strokeColor: "transparent",
				strokeWidth: 0,
				shapeBorderRadius: 55,
				shapeOpacity: 0.9,
				shapeZIndex: 3,
			},
		],
	},
};

// Helper function to generate action descriptions
function getActionDescription(action, stepNumber, patternName = "") {
	const actionNames = {
		change_background_color: "Change background color",
		change_gradient_type: `Change gradient type to ${
			action.gradientType || "radial"
		}`,
		add_color_stop: `Add color stop${
			action.color ? ` with color ${action.color}` : ""
		}`,
		modify_color_stop: `Modify color stop${
			action.color ? ` to ${action.color}` : ""
		}${
			action.colorStopPosition
				? ` at position ${action.colorStopPosition.x}%, ${action.colorStopPosition.y}%`
				: ""
		}`,
		remove_color_stop: "Remove color stop",
		add_image: "Add image",
		add_video: "Add video",
		add_text: `Add text${
			action.textContent ? `: "${action.textContent}"` : ""
		}`,
		modify_text: "Modify text properties",
		delete_text: "Delete text",
		modify_image: "Modify image properties",
		delete_image: "Delete image",
		modify_video: "Modify video properties",
		delete_video: "Delete video",
		change_animation: "Change animation settings",
		change_background_animation: "Change background animation",
		toggle_animation: "Toggle animation",
		change_frame_size: "Change frame size",
		change_noise: "Modify noise settings",
		modify_element_position: "Move element",
		modify_element_size: "Resize element",
		modify_element_style: "Modify element style",
		select_element: "Select element",
		apply_pattern: `Apply ${
			patternName || action.patternName || "pattern"
		} template`,
		add_shape: `Add ${action.shapeType || "shape"}${
			action.fillColor ? ` with color ${action.fillColor}` : ""
		}${
			action.x !== undefined && action.y !== undefined
				? ` at position ${action.x}%, ${action.y}%`
				: ""
		}`,
		modify_shape: "Modify shape properties",
		delete_shape: "Delete shape",
		add_icon: `Add icon ${action.iconName}`,
		modify_icon: "Modify icon properties",
		delete_icon: "Delete icon",
		capture_url_screenshot: `Capture screenshot of ${action.url}`,
		add_frame: "Add new frame",
		delete_frame: "Delete frame",
		switch_frame: "Switch frame",
	};

	return actionNames[action.type] || `Step ${stepNumber}: ${action.type}`;
}

// Define the action schema
const actionSchema = z.object({
	type: z.enum([
		"change_background_color",
		"change_gradient_type",
		"add_color_stop",
		"remove_color_stop",
		"modify_color_stop",
		"add_image",
		"add_video",
		"add_text",
		"modify_text",
		"delete_text",
		"modify_image",
		"delete_image",
		"modify_video",
		"delete_video",
		"change_animation",
		"change_background_animation",
		"toggle_animation",
		"change_frame_size",
		"change_noise",
		"modify_element_position",
		"modify_element_size",
		"modify_element_style",
		"select_element",
		"apply_pattern",
		"add_shape",
		"modify_shape",
		"delete_shape",
		"add_icon",
		"modify_icon",
		"delete_icon",
		"capture_url_screenshot",
		"add_frame",
		"delete_frame",
		"switch_frame",
		"unknown",
	]),
	// Gradient actions
	color: z.string().optional().describe("Hex color code (e.g., #FF0000)"),
	colorName: z
		.string()
		.optional()
		.describe("Color name (dark, light, blue, red, etc.)"),
	gradientType: z
		.enum([
			"linear",
			"radial",
			"conic",
			"rectangle",
			"ellipse",
			"polygon",
			"mesh",
		])
		.optional(),
	colorStopId: z
		.number()
		.optional()
		.describe("ID of color stop to modify or remove"),
	colorStopPosition: z
		.object({
			x: z.number().min(0).max(100),
			y: z.number().min(0).max(100),
		})
		.optional(),
	// Element actions
	elementType: z.enum(["image", "video", "text", "shape", "icon"]).optional(),
	elementId: z
		.number()
		.optional()
		.describe("ID of element to modify or delete"),
	// Text actions
	textContent: z.string().optional().describe("Text content"),
	textId: z.number().optional(),
	fontSize: z.number().optional(),
	fontWeight: z.enum(["normal", "bold"]).optional(),
	fontStyle: z.enum(["normal", "italic"]).optional(),
	fontFamily: z.string().optional(),
	textColor: z.string().optional(),
	textAlign: z.enum(["left", "center", "right"]).optional(),
	backgroundColor: z.string().optional(),
	padding: z.number().optional(),
	borderRadius: z.number().optional(),
	borderWidth: z.number().optional(),
	borderColor: z.string().optional(),
	// Image/Video actions
	objectFit: z
		.enum(["contain", "cover", "fill", "none", "scale-down"])
		.optional(),
	opacity: z.number().min(0).max(1).optional(),
	shadow: z.enum(["none", "sm", "md", "lg", "xl", "2xl"]).optional(),
	ringWidth: z.number().optional(),
	ringColor: z.string().optional(),
	// Animation actions
	animationType: z.enum(["rotate", "pulse", "shift"]).optional(),
	animationEnabled: z.boolean().optional(),
	animationDuration: z.number().optional(),
	backgroundAnimationType: z.enum(["slide", "wave"]).optional(),
	backgroundAnimationDirection: z
		.enum(["right", "left", "up", "down"])
		.optional(),
	backgroundAnimationSpeed: z.number().optional(),
	backgroundAnimationEnabled: z.boolean().optional(),
	// Frame/Dimension actions
	frameSize: z
		.enum(["mobile", "tablet", "desktop", "laptop", "ultrawide", "custom"])
		.optional(),
	// Position/Size actions
	position: z
		.object({
			x: z.number().min(0).max(100),
			y: z.number().min(0).max(100),
		})
		.optional(),
	size: z
		.object({
			width: z.number().min(20).max(800),
			height: z.number().min(20).max(800),
		})
		.optional(),
	// Noise
	noiseEnabled: z.boolean().optional(),
	noiseIntensity: z.number().min(0).max(1).optional(),
	// Pattern
	patternName: z
		.string()
		.optional()
		.describe(
			"Pattern template name (sun, sunset, ocean, forest, night_sky, clouds, mountains, landscape)"
		),
	// Shape actions
	shapeType: z
		.enum(["rectangle", "square", "triangle", "line"])
		.optional()
		.describe("Type of shape to add"),
	shapeId: z.number().optional().describe("ID of shape to modify or delete"),
	fillColor: z.string().optional().describe("Fill color for shape (hex code)"),
	strokeColor: z
		.string()
		.optional()
		.describe("Stroke color for shape (hex code)"),
	strokeWidth: z.number().optional().describe("Stroke width for shape"),
	shapeBorderRadius: z
		.number()
		.optional()
		.describe("Border radius for rectangle/square shapes"),
	shapeOpacity: z
		.number()
		.min(0)
		.max(1)
		.optional()
		.describe("Opacity for shape"),
	shapeZIndex: z.number().optional().describe("Z-index for shape"),
	shapeShadow: z
		.enum(["none", "sm", "md", "lg", "xl", "2xl"])
		.optional()
		.describe("Shadow for shape"),
	// Icon actions
	iconName: z
		.string()
		.optional()
		.describe("Name of the icon to add (Lucide icon name)"),
	iconId: z.number().optional(),
	iconSize: z.number().optional(),
	iconColor: z.string().optional(),
	// URL Screenshot
	url: z.string().optional().describe("URL to capture screenshot of"),
	// Frame actions
	frameId: z.string().optional().describe("ID of frame to switch to or delete"),
});

const outputSchema = z.object({
	design_reasoning: z
		.string()
		.describe(
			"Explain the design thinking, React/CSS structure, and composition choices made to achieve the user's goal."
		),
	action: actionSchema.optional(),
	actions: z
		.array(actionSchema)
		.optional()
		.describe("Array of actions for multi-step operations"),
	pattern: z
		.string()
		.optional()
		.describe("Pattern template name if user requests a pattern"),
	response: z.string().describe("Friendly confirmation message to show user"),
	stepByStep: z
		.boolean()
		.optional()
		.describe(
			"Whether this is a multi-step operation that should be shown step-by-step"
		),
});

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const { prompt, currentState } = req.body;

		if (!prompt) {
			return res.status(400).json({ error: "Prompt is required" });
		}

		// Check if prompt matches a pattern template
		const promptLower = prompt.toLowerCase();
		let matchedPattern = null;
		for (const [key, pattern] of Object.entries(patternTemplates)) {
			if (
				promptLower.includes(key) ||
				promptLower.includes(pattern.name.toLowerCase()) ||
				pattern.keywords?.some((kw) => promptLower.includes(kw))
			) {
				matchedPattern = key;
				break;
			}
		}

		// If pattern matched, return pattern actions
		if (matchedPattern) {
			const pattern = patternTemplates[matchedPattern];
			return res.status(200).json({
				pattern: matchedPattern,
				actions: pattern.actions.map((action, index) => ({
					...action,
					stepNumber: index + 1,
					description: getActionDescription(action, index + 1, pattern.name),
				})),
				response: `I'll create a ${pattern.name.toLowerCase()} background for you! This will take ${
					pattern.actions.length
				} steps. Review the steps below and click 'Execute All' to proceed.`,
				stepByStep: true,
			});
		}

		// Pre-process current state string to ensure it's safe for the prompt
		const currentStateString = JSON.stringify(currentState, null, 2);

		const systemPrompt = `You are a world-class AI Design Agent for Kixi.
You have a unique dual-process brain:
1.  **THE DESIGNER (React/CSS Expert)**: First, you mentally design the requested output as a high-quality, modern, responsive React component using Tailwind CSS or standard CSS. You think about composition, spacing (padding/margin), typography (font size, weight), color theory, shadows, and layout.
2.  **THE COMPILER (Kixi AST Expert)**: Then, you accurately translate this mental React component into a sequence of Kixi AST Actions (add_text, add_shape, add_icon, etc.) to recreate that exact design on the canvas.

TOOLS & CAPABILITIES:
1.  **Gradient Control**: Change type, colors, stops, animation.
2.  **Element Management**: Add/Modify/Delete Images, Videos, Text, Shapes, Icons.
3.  **Icon Selector**: Add icons by name (e.g., "Home", "User", "Twitter") using 'add_icon'.
4.  **URL Screenshot**: Capture websites by URL using 'capture_url_screenshot'. This is useful when user wants to add a website preview.
5.  **Frames**: Create multi-page designs (books, decks, carousels) using 'add_frame'. Switch between frames with 'switch_frame'.
6.  **Web Knowledge**: You have internal knowledge of the web. If a user asks for "Elon Musk", you cannot download his photo directly, but you can suggest adding an image placeholder or asking for a URL. OR, if the user provides a URL, use 'capture_url_screenshot'.

AST / STATE STRUCTURE:
The 'currentState' provided to you acts as the AST. It contains:
- gradient: { type, stops, animation, ... }
- images: Array of image objects { id, x, y, width, height, styles... }
- texts: Array of text objects
- videos: Array of video objects
- shapes: Array of shape objects
- icons: Array of icon objects
- frames: List of frames (if multiple)
- activeFrameId: Current frame ID

YOUR GOAL:
Interpret the user's design intent, generate a mental React/CSS design, and output the Kixi actions to build it.

DESIGN PROCESS (Mental Steps):
1.  **Analyze Request**: "Create a YouTube Thumbnail for a Podcast with Elon Musk".
2.  **React Design Concept**:
    *   *Container*: 1280x720px, dark gradient background (slate-900 to slate-800).
    *   *Layout*: Flex row. Left side: Text. Right side: Image.
    *   *Typography*: Title "The Future of AI" (text-6xl, bold, white). Subtitle "ft. Elon Musk" (text-3xl, gray-300).
    *   *Image*: Large image of Elon on the right, object-cover, maybe a glow effect.
    *   *Decorations*: A subtle circle shape behind the text for contrast. YouTube logo in corner.
3.  **Kixi Translation**:
    *   Action 1: Set Frame to 'custom' or 'desktop'.
    *   Action 2: change_background_color (gradient dark slate).
    *   Action 3: add_shape (circle) at x=25%, y=50% with low opacity.
    *   Action 4: add_text "The Future of AI" at x=10%, y=40%, fontSize=60, bold, white.
    *   Action 5: add_text "ft. Elon Musk" at x=10%, y=55%, fontSize=30, gray.
    *   Action 6: add_image (placeholder) at x=60%, y=20%, width=400px.
    *   Action 7: add_icon "Youtube" at x=90%, y=90%, color=red.

ACTIONS LIST:
- change_background_color, change_gradient_type, add/remove/modify_color_stop
- add_image, add_video, add_text, add_shape, add_icon
- modify_text (fontSize, color, content, etc.)
- modify_image (objectFit, opacity, shadow, radius, etc.)
- modify_shape (color, border, etc.)
- modify_icon (color, size, etc.)
- modify_element_position (x, y in %)
- modify_element_size (width, height in px)
- capture_url_screenshot (url)
- add_frame, switch_frame, delete_frame
- apply_pattern (sun, sunset, etc.)

RULES:
- **Always provide 'design_reasoning'**: Explain your design choices briefly.
- **Precision**: Convert CSS properties (px, %, hex) to Kixi properties accurately.
- **Composition**: Don't just dump elements. Place them thoughtfully (x, y coordinates).
- **Style**: Use good defaults. Avoid "default blue" unless requested. Use gradients, shadows, and proper sizing.
- **Global Changes**: If user says "Make all text white", iterate and generate modify actions for ALL elements.

CURRENT STATE AST:
${currentStateString}
`;

		const { object } = await generateObject({
			model: google("gemini-2.0-flash"),
			schema: outputSchema,
			system: systemPrompt,
			prompt: prompt,
			temperature: 0.4, // Slightly higher creativity for design
		});

		// If actions array is returned, add step numbers and descriptions
		if (object.actions && object.actions.length > 1) {
			object.actions = object.actions.map((action, index) => ({
				...action,
				stepNumber: index + 1,
				description: getActionDescription(action, index + 1),
			}));
			object.stepByStep = true;
		} else if (object.action) {
			// Single action wrap
			object.actions = [
				{
					...object.action,
					stepNumber: 1,
					description: getActionDescription(object.action, 1),
				},
			];
			object.stepByStep = true; // Uniform handling
		}

		return res.status(200).json(object);
	} catch (err) {
		console.error("/api/ai-assistant error", err);
		return res.status(500).json({
			error: "Failed to process AI request",
			action: { type: "unknown" },
			response: "Sorry, I encountered an error. Please try again.",
		});
	}
}
