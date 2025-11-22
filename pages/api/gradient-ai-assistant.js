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
		change_gradient_type: `Change gradient type to ${action.gradientType || "radial"}`,
		add_color_stop: `Add color stop${action.color ? ` with color ${action.color}` : ""}`,
		modify_color_stop: `Modify color stop${action.color ? ` to ${action.color}` : ""}${action.colorStopPosition ? ` at position ${action.colorStopPosition.x}%, ${action.colorStopPosition.y}%` : ""}`,
		remove_color_stop: "Remove color stop",
		add_image: "Add image",
		add_video: "Add video",
		add_text: `Add text${action.textContent ? `: "${action.textContent}"` : ""}`,
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
		apply_pattern: `Apply ${patternName || action.patternName || "pattern"} template`,
		add_shape: `Add ${action.shapeType || "shape"}${action.fillColor ? ` with color ${action.fillColor}` : ""}${action.x !== undefined && action.y !== undefined ? ` at position ${action.x}%, ${action.y}%` : ""}`,
		modify_shape: "Modify shape properties",
		delete_shape: "Delete shape",
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
	elementType: z.enum(["image", "video", "text"]).optional(),
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
			width: z.number().min(30).max(800),
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
});

const outputSchema = z.object({
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
				response: `I'll create a ${pattern.name.toLowerCase()} background for you! This will take ${pattern.actions.length} steps. Review the steps below and click 'Execute All' to proceed.`,
				stepByStep: true,
			});
		}

		const systemPrompt = `You are an AI assistant for an animated gradient generator tool. Users can ask you to edit their gradient designs using natural language.

AVAILABLE ACTIONS:
1. change_background_color - Change gradient colors (use color or colorName like "dark", "light", "blue", "red")
2. change_gradient_type - Change gradient type: linear, radial, conic, rectangle, ellipse, polygon, mesh
3. add_color_stop - Add new color stop (can specify color)
4. remove_color_stop - Remove color stop (need colorStopId)
5. modify_color_stop - Change color stop color or position (need colorStopId)
6. add_image - Trigger image upload dialog
7. add_video - Trigger video upload dialog
8. add_text - Add text element (can include textContent)
9. modify_text - Modify text properties (need textId, can modify: fontSize, textColor, textContent, fontWeight, fontStyle, fontFamily, textAlign, backgroundColor, padding, borderRadius, borderWidth, borderColor)
10. delete_text - Delete text element (need textId)
11. modify_image - Modify image properties (need elementId, can modify: objectFit, opacity, shadow, ringWidth, ringColor, borderRadius, borderWidth, borderColor, position, size)
12. delete_image - Delete image (need elementId)
13. modify_video - Modify video properties (same as modify_image)
14. delete_video - Delete video (need elementId)
15. change_animation - Modify animation (animationType: rotate/pulse/shift, animationEnabled, animationDuration)
16. change_background_animation - Modify background animation (backgroundAnimationType: slide/wave, backgroundAnimationDirection: right/left/up/down, backgroundAnimationSpeed, backgroundAnimationEnabled)
17. toggle_animation - Toggle animation on/off
18. change_frame_size - Change frame size (frameSize: mobile/tablet/desktop/laptop/ultrawide/custom)
19. change_noise - Modify noise settings (noiseEnabled, noiseIntensity 0-1)
20. modify_element_position - Move element (need elementId, elementType, position: {x, y})
21. modify_element_size - Resize element (need elementId, elementType, size: {width, height})
22. modify_element_style - Modify element styles (need elementId, elementType, and style properties)
23. select_element - Select an element (need elementId, elementType)
24. apply_pattern - Apply a pattern template (sun, sunset, ocean, forest, night_sky, clouds, mountains, landscape)
25. add_shape - Add a shape (shapeType: rectangle/square/triangle/line, can specify x, y, width, height, fillColor, strokeColor, strokeWidth, borderRadius, opacity, zIndex, shadow)
26. modify_shape - Modify shape properties (need shapeId, can modify all shape properties)
27. delete_shape - Delete a shape (need shapeId)

AVAILABLE PATTERNS:
- sun: Creates a radial gradient sun with yellow center, orange middle, and sky blue outer
- sunset: Creates a beautiful sunset gradient
- ocean: Creates an ocean-themed gradient
- forest: Creates a forest-themed gradient
- night_sky: Creates a dark night sky with stars effect
- clouds: Creates fluffy clouds using rounded rectangles
- mountains: Creates a mountain range using triangles
- landscape: Creates a complete landscape with sky, mountains, and clouds

CURRENT STATE:
- Gradient type: ${currentState?.gradient?.type || "linear"}
- Color stops: ${currentState?.gradient?.stops?.length || 0}
- Images: ${currentState?.images || 0}
- Texts: ${currentState?.texts || 0}
- Videos: ${currentState?.videos || 0}
- Shapes: ${currentState?.shapes || 0}
- Selected image: ${currentState?.selectedImage || "none"}
- Selected text: ${currentState?.selectedText || "none"}
- Selected video: ${currentState?.selectedVideo || "none"}
- Selected shape: ${currentState?.selectedShape || "none"}
- Animation enabled: ${currentState?.gradient?.animation?.enabled || false}
- Background animation enabled: ${currentState?.gradient?.backgroundAnimation?.enabled || false}
- Frame size: ${currentState?.previewFrameSize || "mobile"}

RULES:
- If user requests a complex multi-step operation (like "create a sun background", "make a sunset", "build a custom gradient with multiple stops", etc.), break it down into multiple actions in the "actions" array
- For simple single-step operations, use the "action" field
- Always set "stepByStep: true" when returning multiple actions
- For each action in the array, provide a clear description of what it does
- Parse user intent accurately and map to the most appropriate action or actions
- For color names, convert to hex: dark/black -> #1a1a1a, light/white -> #f5f5f5, blue -> #3b82f6, red -> #ef4444, green -> #10b981, etc.
- When modifying elements, use elementId from currentState if available (selectedImage, selectedText, selectedVideo)
- For size modifications, ensure reasonable values (width: 30-800px, height: 20-800px)
- For position, use percentages (0-100 for both x and y)
- When user says "bigger" or "smaller", infer appropriate size changes
- When user says "move left/right/up/down", calculate position changes
- Always provide a friendly, natural response message
- If unsure about specific values, use reasonable defaults

EXAMPLES:
- "change background to dark" -> {action: {type: "change_background_color", colorName: "dark"}, response: "Changed background to dark"}
- "create a sun background" or "make a sun" -> {actions: [{type: "change_gradient_type", gradientType: "radial"}, {type: "modify_color_stop", ...}, ...], stepByStep: true, response: "I'll create a sun background for you!"}
- "make a sunset" -> {actions: [{type: "change_gradient_type", gradientType: "linear", angle: 90}, {type: "modify_color_stop", ...}, ...], stepByStep: true, response: "Creating a beautiful sunset gradient..."}
- "add clouds" or "create clouds" -> Use clouds pattern template
- "add mountains" or "create mountains" -> Use mountains pattern template
- "create a landscape" or "make a landscape" -> Use landscape pattern template
- "add a triangle" -> {action: {type: "add_shape", shapeType: "triangle", x: 50, y: 50, width: 200, height: 150, fillColor: "#3b82f6"}, response: "Added triangle shape"}
- "add a rectangle at top left" -> {action: {type: "add_shape", shapeType: "rectangle", x: 25, y: 25, width: 150, height: 100, fillColor: "#ef4444"}, response: "Added rectangle at top left"}
- "add a video" -> {action: {type: "add_video"}, response: "Opening video upload dialog"}
- "make text bigger" -> {action: {type: "modify_text", fontSize: 36}, response: "Made text bigger"} (use selectedText as textId)
- "add red color stop" -> {action: {type: "add_color_stop", color: "#ff0000"}, response: "Added red color stop"}
- "change to radial gradient" -> {action: {type: "change_gradient_type", gradientType: "radial"}, response: "Changed gradient to radial"}

IMPORTANT:
- ALWAYS include elementId when modifying images/videos/texts (use selectedImage, selectedText, selectedVideo from currentState)
- For "radius" or "border radius", use borderRadius property in modify_image action
- For "big", "full screen", "entire screen", use large size values (width: 600-800, height: 600-800) and objectFit: "cover" or "fill"
- When user mentions "fix" or "cover", use objectFit: "cover"`;

		const { object } = await generateObject({
			model: google("gemini-2.0-flash"),
			schema: outputSchema,
			system: systemPrompt,
			prompt: prompt,
			temperature: 0.3,
		});

		// If actions array is returned, add step numbers and descriptions
		if (object.actions && object.actions.length > 1) {
			object.actions = object.actions.map((action, index) => ({
				...action,
				stepNumber: index + 1,
				description: getActionDescription(action, index + 1),
			}));
			object.stepByStep = true;
		}

		return res.status(200).json(object);
	} catch (err) {
		console.error("/api/gradient-ai-assistant error", err);
		return res.status(500).json({
			error: "Failed to process AI request",
			action: { type: "unknown" },
			response: "Sorry, I encountered an error. Please try again.",
		});
	}
}
