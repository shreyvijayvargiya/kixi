import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
	apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const { state, prompt } = req.body;

		if (!state) {
			return res.status(400).json({ error: "State is required" });
		}

		// System prompt to guide the AI
		const systemPrompt = `You are an expert React developer and UI designer.
Your task is to generate 3 DISTINCT, CREATIVE variants of a given design state.

INPUT: A JSON object representing the current design state (gradient, images, shapes, texts, icons).
OUTPUT: A JSON object containing 3 variants. Each variant must have:
1. "name": A creative name for the variant.
2. "description": A short description.
3. "state": A COMPLETE JSON state object representing the variant (same structure as input).
4. "code": Clean, SIMPLE React code for the variant (NO ANIMATIONS, use standard Tailwind classes).

DESIGN RULES FOR VARIANTS:
1. "Cool & Different": Make them visually distinct from the original and each other.
2. NO ANIMATIONS: The user specifically requested "not animated ones". Focus on static composition, color, and layout.
3. PRESERVE CONTENT: Keep the images and texts from the original input, but you can resize, reposition, or style them (border-radius, shadows, opacity).
4. ENHANCE: Add new shapes (circles, rects) or icons to make the design "cool".
5. COLORS: Experiment with different gradient types (radial, conic) and color palettes (neon, pastel, dark mode).

CODE RULES:
1. Return a single functional component.
2. Use Tailwind CSS.
3. Use absolute positioning to match the "state" (x, y percentages).
4. No Framer Motion (unless absolutely necessary for static transforms, but prefer standard CSS).
5. Clean, readable code.`;

		let customPromptInstructions = "";
		if (prompt) {
			customPromptInstructions = `
USER CUSTOM PROMPT:
The user has provided specific instructions for these variants: "${prompt}"
IMPORTANT: You MUST follow these instructions while generating the variants.
`;
		} else {
			customPromptInstructions = `
Generate 3 variants based on this state.
Variant 1: Modern/Clean (different colors, clean layout)
Variant 2: Dark/Cyberpunk (neon colors, dark bg, maybe some glow)
Variant 3: Playful/Bold (bright colors, interesting shapes)
`;
		}

		const stateDescription = `
CURRENT DESIGN STATE (JSON):
${JSON.stringify(state, null, 2)}

${customPromptInstructions}

Return ONLY valid JSON with the following structure:
{
  "variants": [
    {
      "name": "String",
      "description": "String",
      "state": { ...full state object... },
      "code": "React component code string"
    }
  ]
}
`;

		const { text: jsonResponse } = await generateText({
			model: google("gemini-2.0-flash"),
			system: systemPrompt,
			prompt: stateDescription,
			temperature: 0.7,
			maxTokens: 8000,
			responseFormat: { type: "json_object" },
		});

		let cleanedJson = jsonResponse.trim();
		// Remove markdown code blocks if present
		if (cleanedJson.startsWith("```json")) {
			cleanedJson = cleanedJson
				.replace(/^```json\n?/i, "")
				.replace(/\n?```$/i, "");
		} else if (cleanedJson.startsWith("```")) {
			cleanedJson = cleanedJson.replace(/^```\n?/i, "").replace(/\n?```$/i, "");
		}

		let variants;
		try {
			const parsed = JSON.parse(cleanedJson);
			variants = parsed.variants || parsed; // Handle case where AI returns array directly or wrapped
			if (!Array.isArray(variants) && parsed.variants)
				variants = parsed.variants;
		} catch (e) {
			console.error("Failed to parse variants JSON:", e);
			return res
				.status(500)
				.json({ error: "Failed to parse generated variants" });
		}

		return res.status(200).json({
			variants: variants,
			success: true,
		});
	} catch (err) {
		console.error("/api/generate-variants error", err);
		return res.status(500).json({
			error: "Failed to generate variants",
			success: false,
			message: err.message || "An error occurred while generating variants",
		});
	}
}
