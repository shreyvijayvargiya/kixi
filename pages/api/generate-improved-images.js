import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
	apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const { imageBase64, prompt, ast } = req.body;

		if (!imageBase64) {
			return res.status(400).json({ error: "Image is required" });
		}

		if (!prompt) {
			return res.status(400).json({ error: "Prompt is required" });
		}

		// Convert base64 to buffer for Gemini Vision
		const imageData = imageBase64.replace(/^data:image\/\w+;base64,/, "");
		const imageBuffer = Buffer.from(imageData, "base64");

		// Build comprehensive design context from AST
		const buildDesignContext = (ast) => {
			if (!ast) return "No design structure information available.";

			let context = "Design Structure:\n";
			context += `- Gradient Type: ${ast.gradient?.type || "linear"}\n`;
			context += `- Color Stops: ${ast.gradient?.stops?.length || 0} stops\n`;
			if (ast.gradient?.stops?.length > 0) {
				context += `  Colors: ${ast.gradient.stops.map((s) => s.color).join(", ")}\n`;
			}
			context += `- Animation: ${ast.gradient?.animation?.enabled ? ast.gradient.animation.type : "none"}\n`;
			context += `- Background Animation: ${ast.gradient?.backgroundAnimation?.enabled ? ast.gradient.backgroundAnimation.type : "none"}\n`;
			context += `- Dimensions: ${ast.gradient?.dimensions?.width}x${ast.gradient?.dimensions?.height}\n`;
			context += `- Images: ${ast.images?.length || 0}\n`;
			context += `- Texts: ${ast.texts?.length || 0}\n`;
			context += `- Videos: ${ast.videos?.length || 0}\n`;
			context += `- Shapes: ${ast.shapes?.length || 0}\n`;
			context += `- Icons: ${ast.icons?.length || 0}\n`;
			context += `- Background Image: ${ast.backgroundImage ? "Yes" : "No"}\n`;

			if (ast.shapes?.length > 0) {
				context += `\nShape Types: ${ast.shapes.map((s) => s.type).join(", ")}\n`;
			}
			if (ast.texts?.length > 0) {
				context += `\nText Elements: ${ast.texts.length} text elements with various styles\n`;
			}

			return context;
		};

		const designContext = buildDesignContext(ast);

		// Use Gemini Vision to analyze the image and generate improvement suggestions
		const geminiModel = google("gemini-2.0-flash-exp");

		const generateImprovements = async () => {
			try {
				const systemPrompt = `You are an expert gradient design AI assistant. Analyze the provided gradient design image and its complete design structure (AST - Abstract Syntax Tree) to generate 5 creative variations.

${designContext}

User Request: "${prompt}"

Generate 5 distinct design variations that:
1. Maintain the core design structure and layout
2. Explore different color palettes, moods, and aesthetics
3. Vary composition, spacing, and visual hierarchy
4. Experiment with different styles (modern, vintage, minimalist, bold, etc.)
5. Consider the existing elements (images, texts, shapes, icons) and suggest how they could be enhanced

For each variation, provide:
- "description": A detailed description of the variation (2-3 sentences)
- "colors": Specific color palette or gradient changes (hex codes if possible)
- "composition": How layout and element positioning could change
- "style": Style direction (e.g., "modern minimalist", "vibrant and bold", "elegant and sophisticated")
- "prompt": A detailed, specific prompt that could recreate this variation (include specific colors, styles, moods)
- "variations": Specific changes to make (e.g., "Change gradient from warm to cool tones", "Add more contrast", "Simplify composition")

Return ONLY a valid JSON array with exactly 5 objects. No markdown, no code blocks, just pure JSON.`;

				const { text } = await generateText({
					model: geminiModel,
					messages: [
						{
							role: "user",
							content: [
								{
									type: "image",
									image: imageBuffer,
								},
								{
									type: "text",
									text: systemPrompt,
								},
							],
						},
					],
				});

				// Parse JSON from response
				let textContent = text.trim();
				// Remove markdown code blocks if present
				textContent = textContent
					.replace(/```json\n?/g, "")
					.replace(/```\n?/g, "")
					.replace(/^json\s*/i, "")
					.trim();

				// Try to find JSON array
				let jsonMatch = textContent.match(/\[[\s\S]*\]/);
				if (jsonMatch) {
					try {
						const parsed = JSON.parse(jsonMatch[0]);
						if (Array.isArray(parsed) && parsed.length > 0) {
							return parsed;
						}
					} catch (e) {
						console.error("JSON parse error:", e);
					}
				}

				// If no valid JSON found, return null to use fallback
				console.warn("Could not parse JSON from Gemini response");
				return null;
			} catch (error) {
				console.error("Error analyzing image with Gemini:", error);
				return null;
			}
		};

		// Generate improvements using Gemini Vision
		const improvements = await generateImprovements();

		// If Gemini analysis fails, create fallback suggestions based on AST
		if (
			!improvements ||
			!Array.isArray(improvements) ||
			improvements.length === 0
		) {
			// Generate fallback suggestions based on AST if available
			const gradientType = ast?.gradient?.type || "linear";
			const colorCount = ast?.gradient?.stops?.length || 2;
			const hasElements =
				(ast?.images?.length || 0) +
					(ast?.texts?.length || 0) +
					(ast?.shapes?.length || 0) >
				0;

			const fallbackImprovements = [
				{
					description: `${prompt}. Enhanced with better color harmony and visual balance.`,
					colors:
						"Improved color gradients with smoother transitions and complementary hues",
					composition: hasElements
						? "Better visual balance and element positioning"
						: "Enhanced gradient distribution",
					style: "More polished and professional appearance",
					prompt: `${prompt}. Use a ${gradientType} gradient with ${colorCount} carefully selected colors that create visual harmony.`,
					variations: [
						"Adjust color saturation",
						"Improve gradient flow",
						"Enhance visual balance",
					],
				},
				{
					description: `${prompt}. Modern aesthetic with improved visual impact.`,
					colors: "Vibrant and contemporary color palette with high contrast",
					composition: hasElements
						? "Enhanced composition with better focal points and spacing"
						: "Dynamic gradient positioning",
					style:
						"Contemporary design with refined details and modern aesthetics",
					prompt: `${prompt}. Create a modern ${gradientType} gradient with bold, vibrant colors and contemporary styling.`,
					variations: [
						"Increase color vibrancy",
						"Add modern styling",
						"Enhance visual impact",
					],
				},
				{
					description: `${prompt}. Enhanced depth and sophistication.`,
					colors: "Sophisticated color palette with rich, deep tones",
					composition: hasElements
						? "Improved depth, layering, and visual hierarchy"
						: "Multi-layered gradient effect",
					style: "Elegant and refined artistic approach with premium feel",
					prompt: `${prompt}. Design an elegant ${gradientType} gradient with sophisticated, rich colors and refined aesthetics.`,
					variations: [
						"Deepen color tones",
						"Add depth layers",
						"Refine artistic style",
					],
				},
				{
					description: `${prompt}. Better contrast and visual balance.`,
					colors: "High contrast color scheme with complementary opposites",
					composition: hasElements
						? "Improved visual hierarchy and element contrast"
						: "High contrast gradient transitions",
					style: "Bold and impactful design with strong visual presence",
					prompt: `${prompt}. Create a high-contrast ${gradientType} gradient with bold, complementary colors for maximum visual impact.`,
					variations: [
						"Increase contrast",
						"Bold color choices",
						"Enhance visual hierarchy",
					],
				},
				{
					description: `${prompt}. Premium design with modern principles.`,
					colors: "Premium color gradients with carefully curated palette",
					composition: hasElements
						? "Professional composition with optimal spacing"
						: "Premium gradient distribution",
					style: "Modern design principles applied with attention to detail",
					prompt: `${prompt}. Design a premium ${gradientType} gradient following modern design principles with a carefully curated color palette.`,
					variations: [
						"Apply premium styling",
						"Refine composition",
						"Modern design principles",
					],
				},
			];

			return res.status(200).json({
				images: [
					imageBase64,
					imageBase64,
					imageBase64,
					imageBase64,
					imageBase64,
				], // Return original 5 times as placeholder
				count: 5,
				improvements: fallbackImprovements,
				note: "Fallback suggestions generated based on design structure. Images are placeholders showing the original design.",
			});
		}

		// Return the original image 5 times with improvement suggestions
		// Note: Gemini doesn't generate images, so we return the original with suggestions
		return res.status(200).json({
			images: [imageBase64, imageBase64, imageBase64, imageBase64, imageBase64],
			count: 5,
			improvements: improvements,
			note: "Improvement suggestions generated by Gemini Vision. Original image shown with enhancement recommendations.",
		});
	} catch (err) {
		console.error("/api/generate-improved-images error", err);
		return res.status(500).json({
			error: "Failed to process image with Gemini",
			message: err.message,
		});
	}
}
