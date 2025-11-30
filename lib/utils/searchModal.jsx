import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import {
	Search,
	Circle,
	Type,
	Video,
	Image as ImageIcon,
	Square,
	RectangleHorizontal,
	Triangle,
	X,
	Command,
} from "lucide-react";

const SearchModal = ({
	isOpen,
	onClose,
	onAddShape,
	onAddText,
	onAddImage,
	onAddVideo,
	colors = {
		card: "bg-white",
		border: "border-zinc-200",
		text: "text-zinc-900",
		textMuted: "text-zinc-500",
		textPlaceholder: "placeholder-zinc-400",
		input: "bg-zinc-50",
		buttonSecondary: "bg-transparent",
		hover: "bg-zinc-100",
	},
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const inputRef = React.useRef(null);
	const [selectedIndex, setSelectedIndex] = useState(0);

	// Define available items to add
	const items = useMemo(
		() => [
			{
				id: "circle",
				name: "Circle",
				description: "Add a circle shape",
				icon: Circle,
				type: "shape",
				action: () => onAddShape?.("circle"),
			},
			{
				id: "rectangle",
				name: "Rectangle",
				description: "Add a rectangle shape",
				icon: RectangleHorizontal,
				type: "shape",
				action: () => onAddShape?.("rectangle"),
			},
			{
				id: "square",
				name: "Square",
				description: "Add a square shape",
				icon: Square,
				type: "shape",
				action: () => onAddShape?.("square"),
			},
			{
				id: "triangle",
				name: "Triangle",
				description: "Add a triangle shape",
				icon: Triangle,
				type: "shape",
				action: () => onAddShape?.("triangle"),
			},
			{
				id: "text",
				name: "Text",
				description: "Add a text element",
				icon: Type,
				type: "text",
				action: () => onAddText?.(),
			},
			{
				id: "image",
				name: "Image",
				description: "Add an image",
				icon: ImageIcon,
				type: "image",
				action: () => onAddImage?.(),
			},
			{
				id: "video",
				name: "Video",
				description: "Add a video",
				icon: Video,
				type: "video",
				action: () => onAddVideo?.(),
			},
		],
		[onAddShape, onAddText, onAddImage, onAddVideo]
	);

	// Configure Fuse.js for fuzzy search
	const fuse = useMemo(() => {
		return new Fuse(items, {
			keys: ["name", "description"],
			threshold: 0.3,
			includeScore: true,
		});
	}, [items]);

	// Filter items based on search query
	const filteredItems = useMemo(() => {
		if (!searchQuery.trim()) {
			return items;
		}

		const results = fuse.search(searchQuery);
		return results.map((result) => result.item);
	}, [searchQuery, fuse]);

	// Reset selected index when filtered items change
	useEffect(() => {
		setSelectedIndex(0);
	}, [filteredItems]);

	// Focus input when modal opens
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		} else {
			setSearchQuery("");
			setSelectedIndex(0);
		}
	}, [isOpen]);

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(e) => {
			if (!isOpen) return;

			if (e.key === "Escape") {
				onClose();
				return;
			}

			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < filteredItems.length - 1 ? prev + 1 : prev
				);
				return;
			}

			if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
				return;
			}

			if (e.key === "Enter") {
				e.preventDefault();
				if (filteredItems[selectedIndex]) {
					filteredItems[selectedIndex].action();
					onClose();
				}
				return;
			}
		},
		[isOpen, filteredItems, selectedIndex, onClose]
	);

	useEffect(() => {
		if (isOpen) {
			window.addEventListener("keydown", handleKeyDown);
			return () => {
				window.removeEventListener("keydown", handleKeyDown);
			};
		}
	}, [isOpen, handleKeyDown]);

	const handleItemClick = (item) => {
		item.action();
		onClose();
	};

	const handleClose = () => {
		setSearchQuery("");
		setSelectedIndex(0);
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
						onClick={handleClose}
					/>

					{/* Centered Modal */}
					<motion.div
						initial={{ scale: 0.95, opacity: 0, y: -20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.95, opacity: 0, y: -20 }}
						transition={{ type: "spring", duration: 0.2 }}
						className={`fixed z-50 ${colors.card} rounded-xl shadow-2xl border ${colors.border} overflow-hidden`}
						style={{
							left: "50%",
							top: "50%",
							transform: "translate(-50%, -50%)",
							width: "600px",
							maxWidth: "90vw",
							maxHeight: "80vh",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Search Input */}
						<div className="p-4 border-b border-zinc-200">
							<div className="flex items-center gap-3">
								<Search className={`w-5 h-5 ${colors.textMuted}`} />
								<input
									ref={inputRef}
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search for elements to add..."
									className={`flex-1 ${colors.input} ${colors.text} ${colors.textPlaceholder} border-0 outline-none text-sm`}
								/>
								<div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-100 text-xs text-zinc-600">
									<Command className="w-3 h-3" />
									<span>K</span>
								</div>
							</div>
						</div>

						{/* Items List */}
						<div className="max-h-[400px] overflow-y-auto">
							{filteredItems.length > 0 ? (
								<div className="p-2">
									{filteredItems.map((item, index) => {
										const IconComponent = item.icon;
										const isSelected = index === selectedIndex;

										return (
											<motion.div
												key={item.id}
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.02 }}
												onClick={() => handleItemClick(item)}
												onMouseEnter={() => setSelectedIndex(index)}
												className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
													isSelected
														? `${colors.hover} ${colors.text}`
														: `${colors.text} hover:${colors.hover}`
												}`}
											>
												<div
													className={`p-2 rounded-xl ${
														isSelected ? "bg-zinc-200" : "bg-zinc-100"
													}`}
												>
													<IconComponent
														className={`w-5 h-5 ${
															isSelected ? colors.text : colors.textMuted
														}`}
													/>
												</div>
												<div className="flex-1">
													<div
														className={`font-medium ${
															isSelected ? colors.text : colors.text
														}`}
													>
														{item.name}
													</div>
													<div className={`text-xs ${colors.textMuted}`}>
														{item.description}
													</div>
												</div>
												{isSelected && (
													<motion.div
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														className="text-xs text-zinc-500"
													>
														Press Enter
													</motion.div>
												)}
											</motion.div>
										);
									})}
								</div>
							) : (
								<div className={`p-8 text-center ${colors.textMuted}`}>
									<Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
									<p className="text-sm">No items found</p>
									<p className="text-xs mt-1">Try a different search term</p>
								</div>
							)}
						</div>

						{/* Footer */}
						<div className="p-3 border-t border-zinc-200 bg-zinc-50">
							<div className="flex items-center justify-between text-xs text-zinc-500">
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-1">
										<span className="px-1.5 py-0.5 rounded bg-white border border-zinc-200">
											↑↓
										</span>
										<span>Navigate</span>
									</div>
									<div className="flex items-center gap-1">
										<span className="px-1.5 py-0.5 rounded bg-white border border-zinc-200">
											↵
										</span>
										<span>Select</span>
									</div>
									<div className="flex items-center gap-1">
										<span className="px-1.5 py-0.5 rounded bg-white border border-zinc-200">
											Esc
										</span>
										<span>Close</span>
									</div>
								</div>
								<button
									onClick={handleClose}
									className="p-1 hover:bg-zinc-200 rounded transition-colors"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

// Hook to manage the search modal with CMD+K shortcut
export const useSearchModal = (
	onAddShape,
	onAddText,
	onAddImage,
	onAddVideo
) => {
	const [isOpen, setIsOpen] = useState(false);

	// Handle CMD+K (or CTRL+K on Windows/Linux)
	useEffect(() => {
		const handleKeyDown = (e) => {
			// Check for CMD+K (Mac) or CTRL+K (Windows/Linux)
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setIsOpen((prev) => !prev);
			}

			// Close on Escape
			if (e.key === "Escape" && isOpen) {
				setIsOpen(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	return {
		isOpen,
		openModal,
		closeModal,
		SearchModalComponent: (
			<SearchModal
				isOpen={isOpen}
				onClose={closeModal}
				onAddShape={onAddShape}
				onAddText={onAddText}
				onAddImage={onAddImage}
				onAddVideo={onAddVideo}
			/>
		),
	};
};

export default SearchModal;
