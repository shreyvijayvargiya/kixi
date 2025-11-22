import { useState, useCallback } from "react";
import { transformComponentTheme } from "../utils/themeTransform";

export const useThemeChange = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const changeTheme = useCallback(async (componentCode, theme, onChunk) => {
		setIsLoading(true);
		setError(null);

		try {
			// Use fast rule-based transformation instead of LLM API
			const transformedCode = transformComponentTheme(componentCode, theme);

			// Simulate streaming for compatibility with existing UI
			const chunks = transformedCode.split("\n");
			for (let i = 0; i < chunks.length; i++) {
				const chunk = chunks[i] + (i < chunks.length - 1 ? "\n" : "");
				if (onChunk) {
					onChunk(chunk);
				}
				// Small delay to simulate streaming
				await new Promise((resolve) => setTimeout(resolve, 10));
			}
		} catch (err) {
			setError(err.message);
			console.error("Theme change error:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		changeTheme,
		isLoading,
		error,
	};
};
