import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useVariantGenerator = () => {
	const [generatedVariants, setGeneratedVariants] = useState([]);
	const [isVariantsModalOpen, setIsVariantsModalOpen] = useState(false);

	const generateVariantsMutation = useMutation({
		mutationFn: async ({ state, prompt }) => {
			const response = await fetch("/api/generate-variants", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ state, prompt }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to generate variants");
			}

			return response.json();
		},
		onSuccess: (data, variables) => {
			// If we are loading more (variables.append is true), append to existing
			// But currently we just replace or handle manually in component
			// Let's just return the data here and let the component handle merging if needed
			// Or we can assume this always replaces unless we add specific logic

			// For now, let's keep it simple: this hook manages the state.
			// We might need to differentiate between "initial generation" and "load more"
			// But the API returns a fresh list.
			// We'll handle "Load More" by appending in the component or updating state here if we pass a flag.

			// Actually, let's just expose the setter so the component can decide.
			// But default behavior:
			setGeneratedVariants(data.variants || []);
			setIsVariantsModalOpen(true);
			toast.success("Variants generated successfully!");
		},
		onError: (error) => {
			console.error("Error generating variants:", error);
			toast.error(error.message || "Failed to generate variants");
		},
	});

	return {
		generateVariantsMutation,
		generatedVariants,
		setGeneratedVariants, // Expose setter for appending
		isVariantsModalOpen,
		setIsVariantsModalOpen,
	};
};
