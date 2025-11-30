import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
	ChevronDown,
	ChevronUp,
	Upload,
	Loader2,
	Globe,
	Bolt,
	Square,
	RectangleHorizontalIcon,
	Minus,
	Triangle,
	Circle,
	Camera,
	Plus,
	Trash2,
	Check,
	ZoomIn,
	ZoomOut,
	ArrowLeft,
	ArrowRight,
	Copy,
	Image as ImageIcon,
	PlusCircle,
} from "lucide-react";
import {
	TextIcon,
	Image01Icon,
	Video01Icon,
	Camera01Icon,
	Delete01Icon,
} from "hugeicons-react";
import IconSelector from "./IconSelectorModal";

const TopCenterToolbar = ({
	addText,
	projects = [],
	backgroundImageDropdownRef,
	backgroundImageInputRef,
	handleBackgroundImageUpload,
	isBackgroundImageDropdownOpen,
	setIsBackgroundImageDropdownOpen,
	backgroundImage,
	setBackgroundImage,
	fileInputRef,
	macAssetImages,
	images,
	setImages,
	setSelectedImage,
	setSelectedImages,
	videoInputRef,
	iconSelectorDropdownRef,
	isIconSelectorOpen,
	setIsIconSelectorOpen,
	setIconSearchQuery,
	addIcon,
	shapeDropdownRef,
	isShapeDropdownOpen,
	setIsShapeDropdownOpen,
	addShape,
	urlScreenshotDropdownRef,
	isUrlScreenshotOpen,
	setIsUrlScreenshotOpen,
	urlInputRef,
	urlInput,
	setUrlInput,
	handleUrlScreenshot,
	isScreenshotLoading,
	screenshotImage,
	setScreenshotImage,
	handleAddScreenshotToCanvas,
	framesList,
	activeFrameId,
	handleFrameSelect,
	isLoadingFrames,
	handleAddFrame,
	isFrameActionLoading,
	isAuthenticated,
	handleDeleteFrame,
	setPreviewZoom,
	undo,
	historyIndex,
	historyLength,
	redo,
	handleCopyHTML,
	copied,
}) => {
	const router = useRouter();
	const frameDropdownOptions = useMemo(
		() =>
			framesList.map((frame) => ({
				value: frame.id,
				label: frame.name || `Frame ${frame.frameNumber}`,
			})),
		[framesList]
	);

	const isFrameSelectDisabled =
		frameDropdownOptions.length === 0 || isLoadingFrames;

	const canDeleteFrame =
		isAuthenticated && !isFrameActionLoading && framesList.length > 0;

	const [isFrameDropdownOpen, setIsFrameDropdownOpen] = useState(false);
	const [pendingDeleteFrameId, setPendingDeleteFrameId] = useState(null);
	const frameDropdownRef = useRef(null);

	useEffect(() => {
		if (!router?.isReady || !isAuthenticated || !projects.length) {
			return;
		}

		const currentProjectQuery =
			router.query.projectId || router.query.docId || null;
		if (currentProjectQuery) {
			return;
		}

		const firstProjectId = projects[0]?.id;
		if (!firstProjectId) {
			return;
		}

		const nextQuery = { ...router.query, projectId: firstProjectId };
		router.replace({ pathname: "/app", query: nextQuery }, undefined, {
			shallow: true,
		});
	}, [isAuthenticated, projects, router]);

	useEffect(() => {
		if (
			!router?.isReady ||
			!isAuthenticated ||
			activeFrameId ||
			!framesList.length
		) {
			return;
		}

		const currentFrameQuery =
			router.query.frame && !Array.isArray(router.query.frame)
				? router.query.frame
				: router.query.frame?.[0] || null;
		if (currentFrameQuery) {
			return;
		}

		const firstFrameId = framesList[0]?.id;
		if (!firstFrameId) {
			return;
		}

		handleFrameSelect(firstFrameId);
	}, [router, isAuthenticated, framesList, handleFrameSelect, activeFrameId]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				frameDropdownRef.current &&
				!frameDropdownRef.current.contains(event.target)
			) {
				setIsFrameDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (!isFrameDropdownOpen) {
			setPendingDeleteFrameId(null);
		}
	}, [isFrameDropdownOpen]);

	const handleFrameOptionClick = (frameId) => {
		handleFrameSelect(frameId);
		setIsFrameDropdownOpen(false);
	};

	const startDeleteConfirmation = (frame) => {
		if (!frame || !canDeleteFrame) return;
		setPendingDeleteFrameId(frame.value);
	};

	const confirmAndDeleteFrame = async (frame) => {
		if (!frame) return;
		try {
			await handleDeleteFrame(frame.value);
		} finally {
			setPendingDeleteFrameId(null);
			setIsFrameDropdownOpen(false);
		}
	};

	return (
		<div className="fixed top-4 flex items-center gap-1 z-30 border border-zinc-100 w-fit mx-auto left-0 right-0 p-1 bg-white rounded-xl ">
			{/* Add Text Button */}
			<button
				onClick={addText}
				className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50 rounded-xl transition-colors h-8"
				title="Add text"
			>
				<TextIcon className="w-4 h-4" />
			</button>
			{/* Background Image Dropdown */}
			<div ref={backgroundImageDropdownRef} className="relative">
				<input
					type="file"
					ref={backgroundImageInputRef}
					onChange={handleBackgroundImageUpload}
					accept="image/*"
					className="hidden"
				/>
				<button
					onClick={() =>
						setIsBackgroundImageDropdownOpen(!isBackgroundImageDropdownOpen)
					}
					className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-100 rounded-xl transition-colors h-8"
					title="Set background image"
				>
					<Image01Icon className="w-4 h-4" />
					<ChevronDown
						className={`w-3 h-3 transition-transform ${
							isBackgroundImageDropdownOpen ? "rotate-180" : ""
						}`}
					/>
				</button>
				<AnimatePresence>
					{isBackgroundImageDropdownOpen && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.15 }}
							className="absolute z-50 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden min-w-[280px] max-w-[320px]"
						>
							{/* Remove Background Option */}
							{backgroundImage && (
								<button
									type="button"
									onClick={() => {
										setBackgroundImage(null);
										setIsBackgroundImageDropdownOpen(false);
									}}
									className="w-full px-3 py-2 text-sm text-left hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600 border-b border-zinc-100"
								>
									<Delete01Icon className="w-4 h-4" />
									Remove Background
								</button>
							)}
							{/* Upload Custom Image */}
							<button
								type="button"
								onClick={() => {
									fileInputRef.current?.click();
									setIsBackgroundImageDropdownOpen(false);
								}}
								className="w-full px-3 py-2 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-b border-zinc-100"
							>
								<Upload className="w-4 h-4" />
								Upload Custom Image
							</button>
							{/* Mac Asset Images Grid */}
							<div className="p-3">
								<div className="text-xs font-medium text-zinc-600 mb-2">
									Preset Images
								</div>
								<div className="grid grid-cols-3 gap-2">
									{macAssetImages.map((asset) => {
										const isImageAdded = images.some(
											(img) => img.src === asset.src
										);
										return (
											<button
												key={asset.id}
												type="button"
												onClick={() => {
													const img = new Image();
													img.onload = () => {
														const maxWidth = 400;
														const maxHeight = 400;
														let width = img.width;
														let height = img.height;

														if (width > maxWidth || height > maxHeight) {
															const ratio = Math.min(
																maxWidth / width,
																maxHeight / height
															);
															width = width * ratio;
															height = height * ratio;
														}

														const newImage = {
															id: Date.now() + Math.random(),
															src: asset.src,
															x: 50,
															y: 50,
															width,
															height,
															caption: "",
															styles: {
																objectFit: "contain",
																borderWidth: 0,
																borderColor: "#000000",
																borderStyle: "solid",
																ringWidth: 0,
																ringColor: "#3b82f6",
																shadow: {
																	enabled: false,
																	x: 0,
																	y: 0,
																	blur: 0,
																	color: "#000000",
																},
																borderRadius: 0,
																opacity: 1,
																zIndex: 1,
																rotation: 0,
																skewX: 0,
																skewY: 0,
																noise: {
																	enabled: false,
																	intensity: 0.3,
																},
															},
														};
														setImages((prev) => [...prev, newImage]);
														setSelectedImage(newImage.id);
														setSelectedImages([newImage.id]);
													};
													img.src = asset.src;
													setIsBackgroundImageDropdownOpen(false);
												}}
												className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors focus:outline-none focus:ring focus:ring-zinc-400 ${
													isImageAdded
														? "border-zinc-500 ring ring-zinc-400"
														: "border-zinc-200 hover:border-zinc-400"
												}`}
												title={asset.name}
											>
												<img
													src={asset.src}
													alt={asset.name}
													className="w-full h-full object-cover"
												/>
											</button>
										);
									})}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			{/* Add Video Button */}
			<button
				onClick={() => videoInputRef.current?.click()}
				className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50 rounded-xl transition-colors h-8"
				title="Upload videos"
			>
				<Video01Icon className="w-4 h-4" />
			</button>

			{/* Add Icon Dropdown */}
			<div ref={iconSelectorDropdownRef} className="relative">
				<button
					onClick={() => {
						setIsIconSelectorOpen(!isIconSelectorOpen);
						if (!isIconSelectorOpen) {
							setIconSearchQuery("");
						}
					}}
					className="flex items-center gap-2 px-3 py-1.5 text-sm  hover:bg-zinc-100 rounded-xl transition-colors h-8"
					title="Add icon"
				>
					<Bolt className="w-4 h-4" />
					{isIconSelectorOpen ? (
						<ChevronDown className="w-3 h-3" />
					) : (
						<ChevronUp className="w-3 h-3 transition-transform" />
					)}
				</button>
				<AnimatePresence>
					{isIconSelectorOpen && (
						<IconSelector
							isOpen={isIconSelectorOpen}
							onClose={() => setIsIconSelectorOpen(false)}
							onSelectIcon={addIcon}
							onSelectShape={addShape}
						/>
					)}
				</AnimatePresence>
			</div>

			<div ref={shapeDropdownRef} className="relative">
				<button
					onClick={() => setIsShapeDropdownOpen(!isShapeDropdownOpen)}
					className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-100 rounded-xl transition-colors h-8"
					title="Add shapes"
				>
					<Square className="w-4 h-4" />
					{isShapeDropdownOpen ? (
						<ChevronDown className="w-3 h-3 transition-transform" />
					) : (
						<ChevronUp className="w-3 h-3 transition-transform" />
					)}
				</button>
				<AnimatePresence>
					{isShapeDropdownOpen && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.15 }}
							className="absolute z-50 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden min-w-[160px]"
						>
							<button
								type="button"
								onClick={() => addShape("rectangle")}
								className="w-full px-3 py-2 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2"
							>
								<RectangleHorizontalIcon className="w-4 h-4" />
								Rectangle
							</button>
							<button
								type="button"
								onClick={() => addShape("square")}
								className="w-full px-3 py-2 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
							>
								<Square className="w-4 h-4" />
								Square
							</button>
							<button
								type="button"
								onClick={() => addShape("line")}
								className="w-full px-3 py-2 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
							>
								<Minus className="w-4 h-4" />
								Line
							</button>
							<button
								type="button"
								onClick={() => addShape("triangle")}
								className="w-full px-3 py-2 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
							>
								<Triangle className="w-4 h-4" />
								Triangle
							</button>
							<button
								type="button"
								onClick={() => addShape("circle")}
								className="w-full px-3 py-2 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
							>
								<Circle className="w-4 h-4" />
								Circle
							</button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			{/* URL Screenshot Dropdown */}
			<div ref={urlScreenshotDropdownRef} className="relative">
				<button
					onClick={() => {
						setIsUrlScreenshotOpen(!isUrlScreenshotOpen);
						if (!isUrlScreenshotOpen) {
							setUrlInput("");
							setScreenshotImage(null);
						}
					}}
					className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50 rounded-xl transition-colors h-8"
					title="Take screenshot from URL"
				>
					<Camera01Icon className="w-4 h-4" />
					<ChevronDown
						className={`w-3 h-3 transition-transform ${
							isUrlScreenshotOpen ? "rotate-180" : ""
						}`}
					/>
				</button>
				<AnimatePresence>
					{isUrlScreenshotOpen && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.15 }}
							className="absolute z-50 mt-1 border border-zinc-200 bg-white rounded-xl shadow-lg overflow-hidden min-w-[400px] max-w-[500px]"
						>
							<div className="p-4">
								{/* URL Input */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-zinc-700 mb-2">
										Website URL
									</label>
									<div className="flex gap-2">
										<input
											ref={urlInputRef}
											type="url"
											value={urlInput}
											onChange={(e) => setUrlInput(e.target.value)}
											placeholder="https://example.com"
											className="flex-1 px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring focus:ring-zinc-200"
											disabled={isScreenshotLoading}
											onKeyDown={(e) => {
												if (
													e.key === "Enter" &&
													!isScreenshotLoading &&
													urlInput.trim()
												) {
													e.preventDefault();
													handleUrlScreenshot();
												}
											}}
										/>
										<button
											onClick={handleUrlScreenshot}
											disabled={isScreenshotLoading || !urlInput.trim()}
											className="px-4 py-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm"
										>
											{isScreenshotLoading ? (
												<>
													<Loader2 className="w-4 h-4 animate-spin" />
													Capturing...
												</>
											) : (
												<>
													<Camera className="w-4 h-4" />
													Capture
												</>
											)}
										</button>
									</div>
									<p className="text-xs text-zinc-500 mt-2">
										Enter a valid URL (e.g., https://example.com) and click
										Capture
									</p>
								</div>

								{/* Screenshot Preview */}
								{screenshotImage && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="mb-4"
									>
										<h4 className="text-sm font-semibold text-zinc-700 mb-2">
											Screenshot Preview
										</h4>
										<div className="relative border border-zinc-200 rounded-xl overflow-hidden bg-zinc-100 max-h-[300px] overflow-y-auto">
											<img
												src={screenshotImage}
												alt="Screenshot preview"
												className="w-full h-auto object-contain"
												onError={(e) => {
													e.target.src =
														"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'%3EFailed to load%3C/text%3E%3C/svg%3E";
												}}
											/>
										</div>
										<button
											onClick={() => {
												handleAddScreenshotToCanvas();
												setIsUrlScreenshotOpen(false);
											}}
											className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-sm"
										>
											<ImageIcon className="w-4 h-4" />
											Add Image to Canvas
										</button>
									</motion.div>
								)}

								{/* Empty State */}
								{!screenshotImage && !isScreenshotLoading && (
									<div className="text-center text-zinc-500 py-8">
										<Globe className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
										<p className="text-xs">
											Enter a URL and click Capture to generate a screenshot
										</p>
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Zoom Controls */}
			<button
				onClick={() => setPreviewZoom((prev) => Math.min(prev + 0.1, 1))}
				className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
				title="Zoom In"
				aria-label="Zoom In"
			>
				<ZoomIn className="w-4 h-4 text-zinc-700" />
			</button>

			<button
				onClick={() => setPreviewZoom((prev) => Math.max(prev - 0.1, 0.1))}
				className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
				title="Zoom Out"
				aria-label="Zoom Out"
			>
				<ZoomOut className="w-4 h-4 text-zinc-700" />
			</button>
			{/* Undo/Redo Navigation */}
			<button
				onClick={undo}
				disabled={historyIndex <= 0}
				className={`p-1.5 rounded transition-colors ${
					historyIndex <= 0
						? "opacity-50 cursor-not-allowed"
						: "hover:bg-zinc-100"
				}`}
				title="Undo (⌘Z)"
				aria-label="Undo"
			>
				<ArrowLeft className="w-4 h-4 text-zinc-700" />
			</button>
			<button
				onClick={redo}
				disabled={historyIndex >= historyLength - 1}
				className={`p-1.5 rounded transition-colors ${
					historyIndex >= historyLength - 1
						? "opacity-50 cursor-not-allowed"
						: "hover:bg-zinc-100"
				}`}
				title="Redo (⌘⇧Z)"
				aria-label="Redo"
			>
				<ArrowRight className="w-4 h-4 text-zinc-700" />
			</button>

			<button
				onClick={handleCopyHTML}
				className={`p-1.5 hover:bg-zinc-100 rounded transition-colors ${
					copied === "html" ? "bg-green-100" : ""
				}`}
				title="Copy HTML"
				aria-label="Copy HTML"
			>
				<Copy className="w-4 h-4 text-zinc-700" />
			</button>
			{/* Frame Navigation */}
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2">
					<div ref={frameDropdownRef} className="relative min-w-[160px]">
						<button
							type="button"
							onClick={() =>
								!isFrameSelectDisabled &&
								setIsFrameDropdownOpen((prev) => !prev)
							}
							className={`w-full bg-stone-50 p-1.5 text-xs border border-zinc-100 rounded-xl focus:outline-none  transition flex items-center justify-between ${
								isFrameSelectDisabled ? "opacity-60 cursor-not-allowed" : ""
							}`}
							disabled={isFrameSelectDisabled}
						>
							<span className="truncate">
								{frameDropdownOptions.find(
									(option) => option.value === activeFrameId
								)?.label || "Select frame"}
							</span>
							<ChevronDown
								className={`w-4 h-4 transition-transform ${
									isFrameDropdownOpen ? "rotate-180" : ""
								}`}
							/>
						</button>
						<AnimatePresence>
							{isFrameDropdownOpen && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.15 }}
									className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow overflow-hidden"
								>
									<button
										type="button"
										onClick={() => {
											setIsFrameDropdownOpen(false);
											handleAddFrame();
										}}
										className="w-full px-3 py-2 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2"
										disabled={
											isFrameActionLoading ||
											!isAuthenticated ||
											isLoadingFrames
										}
									>
										<PlusCircle className="w-3 h-3" />
										Add Frame
									</button>
									<div className="border-t border-zinc-100" />
									{frameDropdownOptions.length === 0 ? (
										<div className="px-3 py-2 text-sm text-zinc-500">
											No frames yet
										</div>
									) : (
										frameDropdownOptions.map((option) => (
											<div
												key={option.value}
												className="flex items-center justify-between px-3 py-2 text-sm hover:bg-zinc-50 transition-colors gap-2"
											>
												<button
													type="button"
													onClick={() => handleFrameOptionClick(option.value)}
													className={`text-left flex-1 truncate ${
														option.value === activeFrameId
															? "font-semibold text-zinc-900"
															: "text-zinc-700"
													}`}
												>
													{option.label}
												</button>
												<AnimatePresence mode="wait" initial={false}>
													{pendingDeleteFrameId === option.value ? (
														<motion.button
															key="confirm"
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																confirmAndDeleteFrame(option);
															}}
															className="px-2 py-1 rounded-xl text-[10px] font-semibold bg-red-600 text-white shadow hover:bg-red-700 transition-colors flex items-center gap-1"
															disabled={isFrameActionLoading}
															title="Confirm delete"
															aria-label={`Confirm delete ${option.label}`}
															initial={{ opacity: 0, scale: 0.8, y: -4 }}
															animate={{ opacity: 1, scale: 1, y: 0 }}
															exit={{ opacity: 0, scale: 0.8, y: 4 }}
														>
															<Check className="w-3 h-3" />
															Confirm
														</motion.button>
													) : (
														<motion.button
															key="trash"
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																startDeleteConfirmation(option);
															}}
															className="p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
															disabled={!canDeleteFrame || isFrameActionLoading}
															title="Delete Frame"
															aria-label={`Delete ${option.label}`}
															initial={{ opacity: 0, scale: 0.8 }}
															animate={{ opacity: 1, scale: 1 }}
															exit={{ opacity: 0, scale: 0.8 }}
														>
															<Trash2 className="w-3.5 h-3.5 text-red-600" />
														</motion.button>
													)}
												</AnimatePresence>
											</div>
										))
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
					{isLoadingFrames && (
						<Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
					)}
				</div>
			</div>
		</div>
	);
};

export default TopCenterToolbar;
