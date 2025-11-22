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
		const { state } = req.body;

		if (!state) {
			return res.status(400).json({ error: "State is required" });
		}

		const systemPrompt = `You are an expert React developer specializing in creating beautiful, animated components using Next.js, Tailwind CSS, and Framer Motion.

Your task is to convert a gradient/animation design state into a clean, production-ready React component.

REQUIREMENTS:
1. Use Next.js (React 18+)
2. Use Tailwind CSS for all styling
3. Use Framer Motion for all animations
4. Create a single, self-contained component file
5. Make it responsive and performant
6. Use proper TypeScript/JSX syntax
7. Include all necessary imports
8. Preserve all visual elements: gradients, colors, shapes, images, videos, text, icons
9. Convert animations to Framer Motion animations
10. Use proper React hooks (useState, useEffect if needed)
11. Make the component reusable and well-structured

GRADIENT CONVERSION:
- Linear gradients: Use CSS linear-gradient or Tailwind gradient utilities
- Radial gradients: Use CSS radial-gradient
- Conic gradients: Use CSS conic-gradient
- Convert color stops to proper gradient syntax
- Handle gradient angles properly

ANIMATION CONVERSION:
- Rotate animations: Use Framer Motion's animate prop with rotation
- Pulse animations: Use Framer Motion's scale animations
- Shift animations: Use Framer Motion's x/y position animations
- Background animations: Use Framer Motion's backgroundPosition or similar
- Use proper easing functions from Framer Motion

ELEMENTS TO CONVERT:
- Images: Use Next.js Image component when possible, or regular img tag
- Videos: Use HTML5 video element
- Text: Use proper typography with Tailwind classes
- Shapes: Use div elements with Tailwind styling (rounded, absolute positioning)
- Icons: Use Lucide React icons (import from 'lucide-react')

POSITIONING:
- Convert percentage-based positioning to absolute positioning with proper left/top values
- Use responsive units (%, vw, vh) where appropriate
- Maintain aspect ratios and responsive behavior

OUTPUT FORMAT:
- Return ONLY the React component code
- No explanations, no markdown code blocks
- Just the pure JSX/TSX code
- Include all necessary imports at the top
- Export the component as default or named export

EXAMPLE STRUCTURE:
\`\`\`
import React from 'react';
import { motion } from 'framer-motion';
import { IconName } from 'lucide-react';
import Image from 'next/image';

const GradientComponent = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, #FF8D00, #FFB870)',
        }}
        animate={{
          // animation properties
        }}
      />
      {/* Other elements */}
    </div>
  );
};

export default GradientComponent;
\`\`\`

IMPORTANT:
- Make the code production-ready and clean
- Use semantic HTML
- Ensure accessibility where possible
- Optimize for performance
- Use proper React patterns`;

		const stateDescription = `
CURRENT DESIGN STATE:

Gradient:
- Type: ${state.gradient?.type || "linear"}
- Angle: ${state.gradient?.angle || 0}deg
- Color Stops: ${JSON.stringify(state.gradient?.stops || [])}
- Noise: ${state.gradient?.noise?.enabled ? `Enabled (intensity: ${state.gradient?.noise?.intensity})` : "Disabled"}
- Animation: ${state.gradient?.animation?.enabled ? `${state.gradient?.animation?.type} (duration: ${state.gradient?.animation?.duration}s)` : "Disabled"}
- Background Animation: ${state.gradient?.backgroundAnimation?.enabled ? `${state.gradient?.backgroundAnimation?.type} (direction: ${state.gradient?.backgroundAnimation?.direction}, speed: ${state.gradient?.backgroundAnimation?.speed})` : "Disabled"}
- Dimensions: ${state.gradient?.dimensions?.width || 1080}x${state.gradient?.dimensions?.height || 1920}

Images (${state.images?.length || 0}):
${state.images?.map((img, i) => `
  Image ${i + 1}:
  - Position: ${img.x}%, ${img.y}%
  - Size: ${img.width}x${img.height}px
  - Object Fit: ${img.styles?.objectFit || "contain"}
  - Opacity: ${img.styles?.opacity || 1}
  - Border Radius: ${img.styles?.borderRadius || 0}px
  - Z-Index: ${img.styles?.zIndex || 1}
  - Caption: ${img.caption || "none"}
`).join("")}

Videos (${state.videos?.length || 0}):
${state.videos?.map((vid, i) => `
  Video ${i + 1}:
  - Position: ${vid.x}%, ${vid.y}%
  - Size: ${vid.width}x${vid.height}px
  - Object Fit: ${vid.styles?.objectFit || "contain"}
  - Opacity: ${vid.styles?.opacity || 1}
  - Z-Index: ${vid.styles?.zIndex || 1}
  - Caption: ${vid.caption || "none"}
`).join("")}

Text Elements (${state.texts?.length || 0}):
${state.texts?.map((text, i) => `
  Text ${i + 1}:
  - Content: "${text.content}"
  - Position: ${text.x}%, ${text.y}%
  - Size: ${text.width}x${text.height}px
  - Font Size: ${text.styles?.fontSize || 24}px
  - Font Weight: ${text.styles?.fontWeight || "normal"}
  - Font Style: ${text.styles?.fontStyle || "normal"}
  - Color: ${text.styles?.color || "#000000"}
  - Text Align: ${text.styles?.textAlign || "left"}
  - Background: ${text.styles?.backgroundColor || "transparent"}
  - Padding: ${text.styles?.padding || 0}px
  - Border Radius: ${text.styles?.borderRadius || 0}px
  - Z-Index: ${text.styles?.zIndex || 2}
`).join("")}

Shapes (${state.shapes?.length || 0}):
${state.shapes?.map((shape, i) => `
  Shape ${i + 1}:
  - Type: ${shape.shapeType}
  - Position: ${shape.x}%, ${shape.y}%
  - Size: ${shape.width}x${shape.height}px
  - Fill Color: ${shape.fillColor || "#000000"}
  - Stroke Color: ${shape.strokeColor || "transparent"}
  - Stroke Width: ${shape.strokeWidth || 0}px
  - Border Radius: ${shape.borderRadius || 0}px
  - Opacity: ${shape.opacity || 1}
  - Z-Index: ${shape.zIndex || 1}
`).join("")}

Icons (${state.icons?.length || 0}):
${state.icons?.map((icon, i) => `
  Icon ${i + 1}:
  - Name: ${icon.iconName}
  - Position: ${icon.x}%, ${icon.y}%
  - Size: ${icon.width}x${icon.height}px
  - Color: ${icon.styles?.color || "#000000"}
  - Icon Size: ${icon.styles?.size || 24}px
  - Stroke Width: ${icon.styles?.strokeWidth || 2}
  - Opacity: ${icon.styles?.opacity || 1}
  - Z-Index: ${icon.styles?.zIndex || 1}
`).join("")}

Convert this design state into a complete React component using Next.js, Tailwind CSS, and Framer Motion.`;

		const { text } = await generateText({
			model: google("gemini-2.0-flash"),
			system: systemPrompt,
			prompt: stateDescription,
			temperature: 0.3,
			maxTokens: 8000,
		});

		// Clean up the response (remove markdown code blocks if present)
		let cleanedCode = text.trim();
		if (cleanedCode.startsWith("```")) {
			// Remove markdown code blocks
			cleanedCode = cleanedCode.replace(/^```(?:jsx|tsx|javascript|typescript|js|ts)?\n?/i, "");
			cleanedCode = cleanedCode.replace(/\n?```$/i, "");
		}

		return res.status(200).json({
			code: cleanedCode.trim(),
			success: true,
		});
	} catch (err) {
		console.error("/api/convert-to-react error", err);
		return res.status(500).json({
			error: "Failed to generate React component",
			success: false,
			message: err.message || "An error occurred while generating the component",
		});
	}
}

