import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	Image as ImageIcon,
	Video,
	Type,
	Square,
	Circle,
	Triangle,
	RectangleHorizontal,
	Minus,
	GripVertical,
	Layers,
} from "lucide-react";

const LayerList = ({
	images,
	videos,
	texts,
	shapes,
	icons,
	backgroundShapeRects,
	onUpdateZIndex,
	selectedImage,
	selectedVideo,
	selectedText,
	selectedShape,
	selectedIcon,
	selectedBackgroundShapeRect,
	onSelect,
}) => {
	const [draggedItem, setDraggedItem] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);

	// Combine all elements with their types and z-index
	const getAllElements = () => {
		const elements = [
			...backgroundShapeRects.map((rect) => ({
				id: rect.id,
				type: "backgroundShape",
				name: `Background Shape`,
				zIndex: rect.styles?.zIndex || 0,
				icon: Square,
				element: rect,
			})),
			...images.map((img, idx) => ({
				id: img.id,
				type: "image",
				name: img.caption || `Image ${idx + 1}`,
				zIndex: img.styles?.zIndex || 1,
				icon: ImageIcon,
				element: img,
			})),
			...videos.map((vid, idx) => ({
				id: vid.id,
				type: "video",
				name: vid.caption || `Video ${idx + 1}`,
				zIndex: vid.styles?.zIndex || 1,
				icon: Video,
				element: vid,
			})),
			...shapes.map((shape) => {
				let IconComponent = Square;
				if (shape.type === "circle") IconComponent = Circle;
				else if (shape.type === "triangle") IconComponent = Triangle;
				else if (shape.type === "rectangle")
					IconComponent = RectangleHorizontal;
				else if (shape.type === "line") IconComponent = Minus;

				return {
					id: shape.id,
					type: "shape",
					name: `${shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}`,
					zIndex: shape.styles?.zIndex || 1,
					icon: IconComponent,
					element: shape,
				};
			}),
			...icons.map((icon, idx) => ({
				id: icon.id,
				type: "icon",
				name: icon.iconName
					? `${icon.iconName.charAt(0).toUpperCase() + icon.iconName.slice(1)}`
					: `Icon ${idx + 1}`,
				zIndex: icon.styles?.zIndex || 1,
				icon: Layers,
				element: icon,
			})),
			...texts.map((txt, idx) => ({
				id: txt.id,
				type: "text",
				name:
					txt.content?.substring(0, 20) +
						(txt.content?.length > 20 ? "..." : "") || `Text ${idx + 1}`,
				zIndex: txt.styles?.zIndex || 2,
				icon: Type,
				element: txt,
			})),
		];

		// Sort by z-index
		return elements.sort((a, b) => a.zIndex - b.zIndex);
	};

	const elements = getAllElements();

	const handleDragStart = (e, index) => {
		setDraggedItem(index);
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/html", e.target);
	};

	const handleDragOver = (e, index) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		setDragOverIndex(index);
	};

	const handleDragLeave = () => {
		setDragOverIndex(null);
	};

	const handleDrop = (e, dropIndex) => {
		e.preventDefault();
		if (draggedItem === null || draggedItem === dropIndex) {
			setDraggedItem(null);
			setDragOverIndex(null);
			return;
		}

		// Create new array with reordered elements
		const newElements = [...elements];
		const [draggedElement] = newElements.splice(draggedItem, 1);
		newElements.splice(dropIndex, 0, draggedElement);

		// Update z-indexes for all elements based on their new position
		// Start from 0 and increment
		newElements.forEach((element, index) => {
			if (onUpdateZIndex && element.zIndex !== index) {
				onUpdateZIndex(element.type, element.id, index);
			}
		});

		setDraggedItem(null);
		setDragOverIndex(null);
	};

	const handleDragEnd = () => {
		setDraggedItem(null);
		setDragOverIndex(null);
	};

	const isSelected = (element) => {
		if (element.type === "image") return selectedImage === element.id;
		if (element.type === "video") return selectedVideo === element.id;
		if (element.type === "text") return selectedText === element.id;
		if (element.type === "shape") return selectedShape === element.id;
		if (element.type === "icon") return selectedIcon === element.id;
		if (element.type === "backgroundShape")
			return selectedBackgroundShapeRect === element.id;
		return false;
	};

	const handleClick = (element) => {
		if (onSelect) {
			onSelect(element.type, element.id);
		}
	};

	if (elements.length === 0) {
		return null;
	}

	return (
		<div className="w-full bg-white border border-zinc-200 rounded-xl overflow-hidden flex-col">
			{/* List */}
			<div className="overflow-y-auto hidescrollbar flex-1">
				<div className="p-1.5 space-y-1">
					{elements.map((element, index) => {
						const IconComponent = element.icon;
						const selected = isSelected(element);

						return (
							<motion.div
								key={`${element.type}-${element.id}`}
								draggable
								onDragStart={(e) => handleDragStart(e, index)}
								onDragOver={(e) => handleDragOver(e, index)}
								onDragLeave={handleDragLeave}
								onDrop={(e) => handleDrop(e, index)}
								onDragEnd={handleDragEnd}
								onClick={() => handleClick(element)}
								className={`
                  flex items-center gap-2 px-2 py-1 rounded-xl cursor-move
                  transition-colors
                  ${
										dragOverIndex === index
											? "bg-blue-50 border-2 border-blue-300"
											: selected
												? "bg-orange-50"
												: "bg-zinc-50/10 hover:bg-zinc-100 border border-transparent"
									}
                  ${draggedItem === index ? "opacity-50" : ""}
                `}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								{/* Drag Handle */}
								<GripVertical className="w-3 h-3 text-zinc-400 flex-shrink-0" />

								{/* Icon */}
								<IconComponent
									className={`w-4 h-4 flex-shrink-0 ${
										selected ? "text-orange-600" : "text-zinc-600"
									}`}
								/>

								{/* Name */}
								<span
									className={`flex-1 text-xs truncate ${
										selected ? "font-semibold text-orange-900" : "text-zinc-700"
									}`}
									title={element.name}
								>
									{element.name}
								</span>

								{/* Z-Index Badge */}
								<span
									className={`text-xs rounded ${
										selected
											? "bg-orange-100 text-zinc-600"
											: "text-zinc-600"
									}`}
								>
									{element.zIndex}
								</span>
							</motion.div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default LayerList;
