import React, { useState, useMemo } from "react";

import { motion, AnimatePresence } from "framer-motion";

import Fuse from "fuse.js";

import {
	Folder,
	FolderOpen,
	FileText,
	File,
	FileImage,
	FileCode,
	FileVideo,
	FileAudio,
	FileSpreadsheet,
	FileArchive,
	FileCheck,
	FileX,
	FilePlus,
	FileMinus,
	FileEdit,
	FileSearch,
	FileHeart,
	FileClock,
	FileWarning,
	FileQuestion,
	FileSliders,
	FileBarChart,
	FileLineChart,
	Database,
	Activity,
	Server,
	Cloud,
	Upload,
	Share2,
	Unlock,
	Shield,
	Settings,
	Cog,
	Wrench,
	Hammer,
	PenTool,
	Zap,
	CloudLightning,
	Star,
	Bookmark,
	Tag,
	Text,
	Award,
	Crown,
	Gem,
	Diamond,
	Circle,
	Square,
	Triangle,
	Hexagon,
	Octagon,
	EllipsisVertical,
	RectangleEllipsis,
	Package,
	ShoppingBasket,
	Briefcase,
	Badge,
	Key,
	Lock,
	Box,
	FolderPlus,
	FolderEdit,
	FolderHeart,
	FolderClock,
	FolderMinus,
	FolderSearch,
	Info,
	Settings2,
	Image as ImageIcon,
	Camera,
	Video,
	Mic,
	Volume2,
	VolumeX,
	Music2,
	Play,
	Pause,
	StopCircle,
	Clipboard,
	ClipboardCheck,
	Grid,
	Layout,
	Columns,
	Rows,
	Palette,
	Brush,
	PenSquare,
	PenLine,
	Layers,
	Move,
	MousePointer2,
	Monitor,
	Tablet,
	Smartphone,
	Sparkles,
	GalleryHorizontal,
	GalleryVertical,
	Shapes,
	Globe,
} from "lucide-react";

const IconSelector = ({
	isOpen,

	onClose,

	onSelectIcon,

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

	position = { x: 0, y: 0 },
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

	const icons = [
		{ name: "Folder", component: Folder },

		{ name: "FolderOpen", component: FolderOpen },

		{ name: "FolderPlus", component: FolderPlus },

		{ name: "FolderMinus", component: FolderMinus },

		{ name: "FolderEdit", component: FolderEdit },

		{ name: "FolderSearch", component: FolderSearch },

		{ name: "FolderHeart", component: FolderHeart },

		{ name: "FolderClock", component: FolderClock },

		{ name: "Globe", component: Globe },

		{ name: "FileWarning", component: FileWarning },

		{ name: "FileQuestion", component: FileQuestion },

		{ name: "Info", component: Info },

		{ name: "Settings2", component: Settings2 },

		{ name: "Layers", component: Layers },

		{ name: "Move", component: Move },

		{ name: "Cursor", component: MousePointer2 },

		{ name: "Monitor", component: Monitor },

		{ name: "Tablet", component: Tablet },

		{ name: "Smartphone", component: Smartphone },

		{ name: "CloudLightning", component: CloudLightning },

		{ name: "FileText", component: FileText },

		{ name: "File", component: File },

		{ name: "FileImage", component: FileImage },

		{ name: "Image", component: ImageIcon },

		{ name: "FileCode", component: FileCode },

		{ name: "FileVideo", component: FileVideo },

		{ name: "FileAudio", component: FileAudio },

		{ name: "FileSpreadsheet", component: FileSpreadsheet },

		{ name: "FileArchive", component: FileArchive },

		{ name: "FileCheck", component: FileCheck },

		{ name: "FileX", component: FileX },

		{ name: "FilePlus", component: FilePlus },

		{ name: "FileMinus", component: FileMinus },

		{ name: "FileEdit", component: FileEdit },

		{ name: "FileSearch", component: FileSearch },

		{ name: "FileHeart", component: FileHeart },

		{ name: "FileClock", component: FileClock },

		{ name: "FileSliders", component: FileSliders },

		{ name: "FileBarChart", component: FileBarChart },

		{ name: "FileLineChart", component: FileLineChart },

		{ name: "Activity", component: Activity },

		{ name: "Database", component: Database },

		{ name: "Server", component: Server },

		{ name: "Cloud", component: Cloud },

		{ name: "Camera", component: Camera },

		{ name: "VideoCamera", component: Video },

		{ name: "Download", component: Upload },

		{ name: "Share", component: Share2 },

		{ name: "Clipboard", component: Clipboard },

		{ name: "ClipboardCheck", component: ClipboardCheck },

		{ name: "Lock", component: Lock },

		{ name: "Unlock", component: Unlock },

		{ name: "Shield", component: Shield },

		{ name: "Key", component: Key },

		{ name: "Settings", component: Settings },

		{ name: "Cog", component: Cog },

		{ name: "Wrench", component: Wrench },

		{ name: "Hammer", component: Hammer },

		{ name: "Tool", component: PenTool },

		{ name: "Zap", component: Zap },

		{ name: "Lightning", component: CloudLightning },

		{ name: "Sparkles", component: Sparkles },

		{ name: "GalleryHorizontal", component: GalleryHorizontal },

		{ name: "GalleryVertical", component: GalleryVertical },

		{ name: "Star", component: Star },

		{ name: "Bookmark", component: Bookmark },

		{ name: "Tag", component: Tag },

		{ name: "Label", component: Text },

		{ name: "Palette", component: Palette },

		{ name: "Brush", component: Brush },

		{ name: "PenSquare", component: PenSquare },

		{ name: "PenLine", component: PenLine },

		{ name: "Badge", component: Badge },

		{ name: "Award", component: Award },

		{ name: "Trophy", component: Crown },

		{ name: "Gem", component: Gem },

		{ name: "Diamond", component: Diamond },

		{ name: "Circle", component: Circle },

		{ name: "Square", component: Square },

		{ name: "Triangle", component: Triangle },

		{ name: "Hexagon", component: Hexagon },

		{ name: "Octagon", component: Octagon },

		{ name: "Ellipse", component: EllipsisVertical },

		{ name: "Rectangle", component: RectangleEllipsis },

		{ name: "Shapes", component: Shapes },

		{ name: "Grid", component: Grid },

		{ name: "Layout", component: Layout },

		{ name: "Columns", component: Columns },

		{ name: "Rows", component: Rows },

		{ name: "Box", component: Box },

		{ name: "Package", component: Package },

		{ name: "Basket", component: ShoppingBasket },

		{ name: "Briefcase", component: Briefcase },

		{ name: "Mic", component: Mic },

		{ name: "VolumeUp", component: Volume2 },

		{ name: "VolumeMute", component: VolumeX },

		{ name: "Music", component: Music2 },

		{ name: "Play", component: Play },

		{ name: "Pause", component: Pause },

		{ name: "Stop", component: StopCircle },
	];

	// Configure Fuse.js for fuzzy search

	const fuse = useMemo(() => {
		return new Fuse(icons, {
			keys: ["name"],

			threshold: 0.3,

			includeScore: true,
		});
	}, []);

	// Filter icons based on search query

	const filteredIcons = useMemo(() => {
		if (!searchQuery.trim()) {
			return icons;
		}

		const results = fuse.search(searchQuery);

		return results.map((result) => result.item);
	}, [searchQuery, fuse]);

	const handleIconClick = (iconName, IconComponent) => {
		onSelectIcon(iconName, IconComponent);
	};

	const handleClose = () => {
		setSearchQuery("");
		setDragPosition({ x: 0, y: 0 }); // Reset position on close
		onClose();
	};

	return (
		<motion.div
			initial={{ scale: 0.8, opacity: 0, x: 0, y: 0 }}
			animate={{
				scale: 1,
				opacity: 1,
				x: dragPosition.x,
				y: dragPosition.y,
			}}
			exit={{ scale: 0.8, opacity: 0, x: dragPosition.x, y: dragPosition.y }}
			drag
			dragMomentum={false}
			dragElastic={0}
			onDrag={(event, info) => {
				setDragPosition({ x: info.offset.x, y: info.offset.y });
			}}
			className={`fixed z-50 ${colors.card} rounded-xl shadow-xl border ${colors.border} overflow-hidden cursor-move`}
			style={{
				left: "50%",
				top: "50%",
				width: "400px",
				height: "420px",
				maxWidth: "90vw",
				maxHeight: "80vh",
				transform: "translate(-50%, -50%)",
			}}
			onClick={(e) => e.stopPropagation()}
		>
			{/* Header - Draggable area */}
			<div
				className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 cursor-move select-none"
				onMouseDown={(e) => {
					// Prevent text selection while dragging
					if (e.target === e.currentTarget || e.target.closest("h3")) {
						e.preventDefault();
					}
				}}
			>
				<h3 className={`text-lg font-semibold ${colors.text} select-none`}>
					Select Icon {icons.length}
				</h3>

				<button
					onClick={handleClose}
					onMouseDown={(e) => {
						e.stopPropagation();
						e.preventDefault();
					}}
					className={`p-1 ${colors.buttonSecondary} rounded-xl transition-colors hover:${colors.hover} cursor-pointer`}
				>
					<svg
						className={`w-3 h-3 ${colors.textMuted}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			{/* Search Input */}

			<div className="px-4 py-2 border-b border-zinc-200">
				<div
					className={`flex gap-1 items-center justify-start ${colors.input} ${colors.text} rounded-xl hover:bg-zinc-50 px-2`}
				>
					<svg
						className={`w-3 h-3 ${colors.textMuted}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>

					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search icons..."
						className={`w-full py-1 ${colors.input} rounded-xl border-none  ${colors.textPlaceholder} focus:outline-none transition-colors`}
						autoFocus
					/>

					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${colors.textMuted} hover:${colors.text} transition-colors`}
						>
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</div>
			</div>

			{/* Icons Grid */}

			<div
				className="p-4 overflow-y-auto"
				style={{ height: "calc(100% - 10px)" }}
			>
				<div className="flex flex-wrap gap-2 items-center">
					{filteredIcons.length > 0 ? (
						filteredIcons.map((icon, index) => {
							const IconComponent = icon.component;

							return (
								<motion.button
									key={index}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => handleIconClick(icon.name, IconComponent)}
									className={`w-fit p-2 rounded-xl transition-colors hover:${colors.hover} flex items-center justify-center group`}
									title={icon.name}
								>
									<IconComponent
										className={`w-5 h-5 group-hover:${colors.text} transition-colors`}
									/>
								</motion.button>
							);
						})
					) : (
						<div className={`w-full text-center py-8 ${colors.textMuted}`}>
							<svg
								className="w-8 h-8 mx-auto mb-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709"
								/>
							</svg>

							<p className="text-sm">No icons found</p>

							<p className="text-xs mt-1">Try a different search term</p>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default IconSelector;
export { IconSelector };
