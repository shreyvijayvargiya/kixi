import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Sparkles, Loader2, Plus } from "lucide-react";
import VariantPreview from "./VariantPreview";
import { toast } from "react-toastify";

const VariantSelectionModal = ({
	isOpen,
	onClose,
	variants,
	onGenerateMore,
	isGeneratingMore,
}) => {
	const [prompt, setPrompt] = useState("");
	const [localVariants, setLocalVariants] = useState(variants);

	// Sync local variants when props change, but only if we are opening or receiving new props
	React.useEffect(() => {
		if (variants) setLocalVariants(variants);
	}, [variants]);

	const handleGenerateMore = () => {
		onGenerateMore(prompt);
		setPrompt(""); // Clear prompt after submission
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
					onClick={onClose}
				>
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white z-10">
							<div className="flex items-center gap-2">
								<h2 className="text-lg font-semibold text-zinc-800">
									AI Generated Variants
								</h2>
								<span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-1 rounded-full">
									{localVariants.length} variants
								</span>
							</div>
							<button
								onClick={onClose}
								className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
							>
								<X className="w-5 h-5 text-zinc-500" />
							</button>
						</div>

						<div className="flex-1 overflow-y-auto p-6 bg-zinc-50">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
								{localVariants.map((variant, idx) => (
									<div
										key={idx}
										className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col w-full max-w-[320px]"
									>
										<div className="w-full bg-zinc-100 relative flex justify-center items-center p-4 border-b border-zinc-100">
											<VariantPreview state={variant.state} width={280} />
										</div>

										<div className="p-4 flex flex-col flex-1">
											<div className="flex items-start justify-between mb-2">
												<h3 className="font-semibold text-zinc-800">
													{variant.name || `Variant ${idx + 1}`}
												</h3>
											</div>
											<p className="text-sm text-zinc-500 mb-4 flex-1 line-clamp-3">
												{variant.description}
											</p>

											<button
												onClick={() => {
													navigator.clipboard.writeText(variant.code);
													toast.success("React Code Copied!");
												}}
												className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
											>
												<Copy className="w-4 h-4" />
												Copy React Code
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Bottom Bar for Generating More */}
						<div className="p-4 border-t border-zinc-100 bg-white flex flex-col sm:flex-row gap-3 items-center">
							<div className="relative flex-1 w-full">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Sparkles className="h-4 w-4 text-zinc-400" />
								</div>
								<input
									type="text"
									value={prompt}
									onChange={(e) => setPrompt(e.target.value)}
									placeholder="E.g., 'Make them retro wave style' or 'Use pastel colors'"
									className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-xl text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
									onKeyDown={(e) => {
										if (e.key === "Enter" && !isGeneratingMore) {
											handleGenerateMore();
										}
									}}
								/>
							</div>
							<button
								onClick={handleGenerateMore}
								disabled={isGeneratingMore}
								className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
							>
								{isGeneratingMore ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Generating...
									</>
								) : (
									<>
										<Plus className="w-4 h-4" />
										Generate More
									</>
								)}
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default VariantSelectionModal;
