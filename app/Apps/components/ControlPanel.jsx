import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Copy,
	Plus,
	Trash2,
	ChevronDown,
	Download,
	Image as ImageIcon,
	Type,
	Video,
	Sparkles,
	Square,
	Loader2,
	Globe,
	Save,
	Zap,
	ExternalLink,
	Shapes,
	Minus,
	PlayIcon,
	X,
} from "lucide-react";
import {
	Dropdown,
	ColorPicker,
	gradientPresets,
	generatePresetGradientCSS,
} from "./SharedComponents";
import GoogleLoginButton from "../../../components/GoogleLoginButton";
import { getShapeOptions } from "../../../lib/utils/bgShapes";
import { LucideIcons, AllIcons } from "../lucideIcons";
import { formatShadowCSS, copyToClipboard } from "./utils";
import { useEditor } from "../context/EditorContext";

const ControlPanel = ({
	// Global State & User
	copied,
	setCopied,

	// Actions
	handleSaveProject,
	handlePublishProject,

	// Frame & Preview
	previewFrameSize,
	setPreviewFrameSize,
	previewFramePresets,
	setGradient,
	setIsModalOpen,
	gradient,

	// Uploads
	handleImageUpload,
	handleVideoUpload,
	fileInputRef,
	videoInputRef,

	// Code Generation
	generateReactCodeMutation,
	generatedReactCode,
	codeCopied,
	handleCopyGeneratedCode,

	// Elements
	addColorStop,
	updateColorStop,
	removeColorStop,
	addBackgroundShapeRect,
	setBackgroundImage,
	addShape,
	addText,
	addIcon,

	// Downloads
	downloadSVG,
	downloadRaster,
	downloadGIF,
	downloadMP4,

	// Refs
	controlPanelRef,
	handleControlPanelContextMenu,

	// Selection State
	selectedImage,
	selectedVideo,
	selectedText,
	selectedShape,
	selectedIcon,
	selectedBackgroundShapeRect,

	// Selection Updates
	images,
	updateImage,
	videos,
	updateVideo,
	texts,
	updateText,
	shapes,
	updateShape,
	icons,
	updateIcon,
	backgroundShapeRects,
	updateBackgroundShapeRect,

	// Background Image
	backgroundImage,
	handleBackgroundImageUpload,
	backgroundImageInputRef,
	isBackgroundImageDropdownOpen,
	setIsBackgroundImageDropdownOpen,
	backgroundImageDropdownRef,

	// URL Screenshot
	handleUrlScreenshot,
	handleAddScreenshotToCanvas,
	isUrlScreenshotOpen,
	setIsUrlScreenshotOpen,
	urlInput,
	setUrlInput,
	screenshotImage,
	isScreenshotLoading,

	// Misc
	isImageImprovementOpen,

	// Shapes Dropdown
	isShapeDropdownOpen,
	setIsShapeDropdownOpen,
	shapeDropdownRef,

	// Icon Selector
	isIconSelectorOpen,
	setIsIconSelectorOpen,
	iconSelectorDropdownRef,
	iconSearchQuery,
	setIconSearchQuery,
}) => {
	const {
		isAuthenticated,
		isSaving,
		hasUnsavedChanges,
		isPublishing,
		publicDocId,
		currentProjectId,
	} = useEditor();

	// Local State
	const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
	const [isGenerateCodeDropdownOpen, setIsGenerateCodeDropdownOpen] =
		useState(false);
	const [isGradientPresetsOpen, setIsGradientPresetsOpen] = useState(false);

	const downloadDropdownRef = useRef(null);
	const generateCodeDropdownRef = useRef(null);
	const gradientPresetsRef = useRef(null);
	const urlScreenshotDropdownRef = useRef(null);
	const urlInputRef = useRef(null);

	// Icon Filtering Logic
	const availableIcons = useMemo(() => {
		if (!LucideIcons || typeof LucideIcons !== "object") {
			return [];
		}
		return Object.keys(LucideIcons).sort();
	}, []);

	const filteredIcons = useMemo(() => {
		if (!availableIcons || availableIcons.length === 0) {
			return [];
		}
		if (!iconSearchQuery || !iconSearchQuery.trim()) {
			return availableIcons;
		}
		const query = iconSearchQuery.toLowerCase();
		return availableIcons.filter(
			(iconName) => iconName && iconName.toLowerCase().includes(query)
		);
	}, [iconSearchQuery, availableIcons]);

	// Click Outside Handlers (Local & Props)
	useEffect(() => {
		const handleClickOutside = (event) => {
			// Local refs
			if (
				downloadDropdownRef.current &&
				!downloadDropdownRef.current.contains(event.target)
			) {
				setIsDownloadDropdownOpen(false);
			}
			if (
				generateCodeDropdownRef.current &&
				!generateCodeDropdownRef.current.contains(event.target)
			) {
				setIsGenerateCodeDropdownOpen(false);
			}
			if (
				gradientPresetsRef.current &&
				!gradientPresetsRef.current.contains(event.target)
			) {
				setIsGradientPresetsOpen(false);
			}
			if (
				urlScreenshotDropdownRef.current &&
				!urlScreenshotDropdownRef.current.contains(event.target)
			) {
				setIsUrlScreenshotOpen(false);
			}

			// Prop refs (passed from parent)
			if (
				shapeDropdownRef &&
				shapeDropdownRef.current &&
				!shapeDropdownRef.current.contains(event.target)
			) {
				setIsShapeDropdownOpen(false);
			}
			if (
				backgroundImageDropdownRef &&
				backgroundImageDropdownRef.current &&
				!backgroundImageDropdownRef.current.contains(event.target)
			) {
				setIsBackgroundImageDropdownOpen(false);
			}
			if (
				iconSelectorDropdownRef &&
				iconSelectorDropdownRef.current &&
				!iconSelectorDropdownRef.current.contains(event.target)
			) {
				setIsIconSelectorOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [
		setIsUrlScreenshotOpen,
		setIsShapeDropdownOpen,
		setIsBackgroundImageDropdownOpen,
		setIsIconSelectorOpen,
		shapeDropdownRef,
		backgroundImageDropdownRef,
		iconSelectorDropdownRef,
	]);

	return (
		<div
			ref={controlPanelRef}
			onContextMenu={handleControlPanelContextMenu}
			className="hidden lg:block fixed right-4 top-[20px] w-[280px] space-y-4 h-[calc(100vh-56px)] overflow-y-auto hidescrollbar hidescrollbar rounded-xl py-3 z-40"
		>
			<div className="space-y-3">
				<div className="bg-white rounded-xl py-3 space-y-3 border border-zinc-100 ">
					<div className="flex items-center justify-between gap-2 px-3">
						<button
							onClick={handleSaveProject}
							disabled={isSaving || !isAuthenticated}
							className={`flex items-center gap-1.5 px-3 py-2 shadow border rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs ${
								hasUnsavedChanges && !isSaving && copied !== "saved"
									? "bg-orange-100 border-orange-300 hover:bg-orange-200 text-orange-800"
									: "bg-white hover:bg-zinc-100 border-zinc-200 text-black disabled:hover:bg-white"
							}`}
							title={
								hasUnsavedChanges ? "You have unsaved changes" : "Save project"
							}
						>
							{isSaving ? (
								<Loader2 className="w-3.5 h-3.5 animate-spin" />
							) : (
								<Save className="w-3.5 h-3.5" />
							)}
							<span className="text-xs">
								{copied === "saved"
									? "Saved!"
									: isSaving
										? "Saving..."
										: hasUnsavedChanges
											? "Save*"
											: "Save"}
							</span>
						</button>
						<GoogleLoginButton />
					</div>
					<div className="px-3 flex items-center gap-2 justify-start">
						<button
							onClick={(e) => {
								if (publicDocId && !isPublishing) {
									const publicUrl = `${window.location.origin}/p/${publicDocId}`;
									window.open(publicUrl, "_blank");
								} else {
									handlePublishProject();
								}
							}}
							disabled={isPublishing || !isAuthenticated || !currentProjectId}
							className="flex items-center p-1.5 bg-white border border-zinc-200 hover:bg-zinc-100 hover:shadow-xl gap-2 text-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-200 text-xs"
							title={
								publicDocId
									? `Click to view published project at /p/${publicDocId}`
									: "Publish and share your project"
							}
						>
							{isPublishing ? (
								<Loader2 className="w-3 h-3 animate-spin" />
							) : publicDocId ? (
								<ExternalLink className="w-3 h-3" />
							) : (
								<Globe className="w-3 h-3" />
							)}
							<span className="text-xs">
								{copied === "published"
									? "Published!"
									: isPublishing
										? "Publishing..."
										: publicDocId
											? "View Published"
											: "Publish"}
							</span>
						</button>
						<div ref={downloadDropdownRef} className="relative">
							<button
								onClick={() =>
									setIsDownloadDropdownOpen(!isDownloadDropdownOpen)
								}
								className="w-fit flex items-center gap-2 px-3 py-1.5 text-xs bg-white hover:bg-zinc-100 rounded-xl transition-all duration-100 ease-in border border-zinc-200"
							>
								<Download className="w-3 h-3" />
								Download
							</button>
							<AnimatePresence>
								{isDownloadDropdownOpen && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.15 }}
										className="absolute left-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50 w-fit min-w-[180px]"
									>
										<div className="flex flex-col">
											<button
												type="button"
												onClick={() => {
													downloadSVG(previewFrameSize);
													setIsDownloadDropdownOpen(false);
												}}
												className="w-full px-4 py-3 text-xs text-left hover:bg-zinc-50 transition-colors flex items-center gap-2"
											>
												<Download className="w-3 h-3" />
												<span>Download as SVG</span>
											</button>
											<button
												type="button"
												onClick={() => {
													downloadRaster("png", previewFrameSize);
													setIsDownloadDropdownOpen(false);
												}}
												className="w-full px-4 py-3 text-xs text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
											>
												<Download className="w-3 h-3" />
												<span>Download as PNG</span>
											</button>
											<button
												type="button"
												onClick={() => {
													downloadRaster("jpeg", previewFrameSize);
													setIsDownloadDropdownOpen(false);
												}}
												className="w-full px-4 py-3 text-xs text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
											>
												<Download className="w-3 h-3" />
												<span>Download as JPEG</span>
											</button>
											{gradient.backgroundAnimation.enabled && (
												<button
													type="button"
													onClick={() => {
														downloadGIF(previewFrameSize);
														setIsDownloadDropdownOpen(false);
													}}
													className="w-full px-4 py-3 text-xs text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
												>
													<Download className="w-3 h-3" />
													<span>Download as GIF</span>
												</button>
											)}
											<button
												type="button"
												onClick={() => {
													downloadMP4(previewFrameSize);
													setIsDownloadDropdownOpen(false);
												}}
												className="w-full px-4 py-3 text-xs text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
											>
												<Video className="w-3 h-3" />
												<span>Download as MP4</span>
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl border border-zinc-100">
					<div className="p-3 space-y-3">
						<div>
							{/* Frame Size Selector */}
							<label className="text-xs mb-2">Select frame</label>
							<div className="flex items-center">
								<Dropdown
									value={previewFrameSize}
									onChange={(value) => {
										setPreviewFrameSize(value);
										const frame = previewFramePresets[value];
										if (frame) {
											setGradient((prev) => ({
												...prev,
												dimensions: {
													width: frame.width,
													height: frame.height,
												},
											}));
										}
									}}
									options={Object.entries(previewFramePresets).map(
										([key, preset]) => ({
											value: key,
											label: preset.label,
										})
									)}
									placeholder="Select frame size"
									className="w-full"
								/>
							</div>

							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								multiple
								onChange={handleImageUpload}
								className="hidden"
							/>
							<input
								ref={videoInputRef}
								type="file"
								accept="video/*"
								multiple
								onChange={handleVideoUpload}
								className="hidden"
							/>
						</div>
						<button
							onClick={() => setIsModalOpen(true)}
							className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs border border-zinc-200 hover:bg-zinc-100 rounded-xl transition-all duration-100 ease-in"
						>
							<PlayIcon className="w-3 h-3" />
							Preview
						</button>

						{/* Generate React Code Button */}
						<div ref={generateCodeDropdownRef} className="relative">
							<button
								onClick={() => {
									if (!isGenerateCodeDropdownOpen && !generatedReactCode) {
										generateReactCodeMutation.mutate();
									} else {
										setIsGenerateCodeDropdownOpen(!isGenerateCodeDropdownOpen);
									}
								}}
								disabled={generateReactCodeMutation.isPending}
								className="w-full flex items-center gap-2 px-3 py-1.5 text-xs bg-white hover:bg-zinc-100 rounded-xl transition-all duration-100 ease-in border border-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
								title="Generate React code for this design"
							>
								{generateReactCodeMutation.isPending ? (
									<Loader2 className="w-3 h-3 animate-spin" />
								) : (
									<Zap className="w-3 h-3" />
								)}
								{generateReactCodeMutation.isPending
									? "Generating..."
									: "Get Code"}
							</button>
							<AnimatePresence>
								{isGenerateCodeDropdownOpen && generatedReactCode && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.15 }}
										className="absolute right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50"
										style={{ width: "240px", maxWidth: "240px" }}
									>
										<div className="flex flex-col">
											{/* Header */}
											<div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 bg-zinc-50">
												<span className="text-xs font-medium text-zinc-700">
													React Code
												</span>
												<button
													onClick={handleCopyGeneratedCode}
													className={`flex items-center gap-1 px-2 py-1 text-xs rounded-xl transition-colors ${
														codeCopied
															? "bg-green-100 text-green-700"
															: "hover:bg-zinc-200 text-zinc-600"
													}`}
												>
													<Copy className="w-3 h-3" />
													{codeCopied ? "Copied!" : "Copy"}
												</button>
											</div>
											{/* Code Preview */}
											<div className="p-2 max-h-[200px] overflow-auto">
												<pre className="text-[10px] leading-relaxed text-zinc-700 whitespace-pre-wrap break-words font-mono bg-zinc-50 p-2 rounded-xl">
													{generatedReactCode.length > 500
														? generatedReactCode.substring(0, 500) + "..."
														: generatedReactCode}
												</pre>
											</div>
											{/* Packages Section */}
											<div className="px-3 py-2 border-t border-zinc-100 bg-zinc-50">
												<span className="text-[10px] font-medium text-zinc-600 block mb-1.5">
													Install packages:
												</span>
												<div className="flex flex-wrap gap-1">
													<code className="text-[9px] bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-700">
														framer-motion
													</code>
													<code className="text-[9px] bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-700">
														lucide-react
													</code>
													<code className="text-[9px] bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-700">
														tailwindcss
													</code>
												</div>
												<div className="mt-2 p-1.5 bg-zinc-100 rounded text-[9px] font-mono text-zinc-600">
													npm i framer-motion lucide-react
												</div>
											</div>
											{/* Regenerate Button */}
											<div className="px-3 py-2 border-t border-zinc-100">
												<button
													onClick={() => generateReactCodeMutation.mutate()}
													disabled={generateReactCodeMutation.isPending}
													className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
												>
													{generateReactCodeMutation.isPending ? (
														<Loader2 className="w-3 h-3 animate-spin" />
													) : (
														<Sparkles className="w-3 h-3" />
													)}
													{generateReactCodeMutation.isPending
														? "Generating..."
														: "Regenerate"}
												</button>
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>

					<div className="border-t p-3 space-y-3">
						<label className="block text-xs font-medium text-zinc-700 my-1">
							Gradient Presets
						</label>
						<div ref={gradientPresetsRef} className="relative">
							<button
								type="button"
								onClick={() => setIsGradientPresetsOpen(!isGradientPresetsOpen)}
								className="w-full h-7 px-2 text-xs border border-zinc-200 hover:bg-zinc-100 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400 transition-colors flex items-center justify-between"
							>
								<span className="text-left">Choose Gradient</span>
								<ChevronDown
									className={`w-3 h-3 transition-transform ${isGradientPresetsOpen ? "rotate-180" : ""}`}
								/>
							</button>

							<AnimatePresence>
								{isGradientPresetsOpen && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.15 }}
										className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden"
										style={{ maxHeight: "400px", overflowY: "auto" }}
									>
										<div className="p-3">
											<div className="grid grid-cols-3 gap-2">
												{gradientPresets.map((preset) => (
													<button
														key={preset.id}
														type="button"
														onClick={() => {
															const newStops = preset.stops.map((stop) => ({
																...stop,
																id: Date.now() + Math.random(),
															}));
															setGradient((prev) => ({
																...prev,
																type: preset.type,
																angle: preset.angle,
																stops: newStops,
															}));
															setIsGradientPresetsOpen(false);
														}}
														className="aspect-square rounded-xl overflow-hidden border-2 border-zinc-200 hover:border-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400"
														style={{
															background: generatePresetGradientCSS(preset),
														}}
														title={preset.name}
													>
														<div className="w-full h-full flex items-end justify-center p-1">
															<span className="text-xs text-white bg-black bg-opacity-50 px-1.5 py-0.5 rounded text-center truncate w-full">
																{preset.name}
															</span>
														</div>
													</button>
												))}
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
						<div>
							<label className="block text-xs font-medium text-zinc-700 mb-1.5">
								Gradient Type
							</label>
							<Dropdown
								value={gradient.type}
								onChange={(value) =>
									setGradient((prev) => ({ ...prev, type: value }))
								}
								options={[
									{ value: "linear", label: "Linear" },
									{ value: "radial", label: "Radial" },
									{ value: "conic", label: "Conic" },
									{ value: "rectangle", label: "Rectangle" },
									{ value: "ellipse", label: "Ellipse" },
									{ value: "polygon", label: "Polygon" },
									{ value: "mesh", label: "Mesh" },
								]}
								placeholder="Select gradient type"
							/>
						</div>
					</div>

					{/* Color Stops */}
					<div className="border-t p-3">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-sm font-semibold">Color Stops</h3>
							<button
								onClick={addColorStop}
								className="flex items-center gap-1.5 px-2 py-1 bg-stone-50 shadow rounded hover:bg-zinc-100 transition-colors text-xs h-7"
							>
								<Plus className="w-3 h-3" />
							</button>
						</div>

						<div className="space-y-2">
							{gradient.stops.map((stop) => (
								<div
									key={stop.id}
									className="flex items-end gap-2 p-1 rounded-xl"
								>
									<div className="flex-1">
										<ColorPicker
											value={stop.color}
											onChange={(color) =>
												updateColorStop(stop.id, "color", color)
											}
										/>
									</div>
									<button
										onClick={() => removeColorStop(stop.id)}
										className="p-1.5 text-red-500 hover:bg-red-50 rounded"
										aria-label={`Remove color stop`}
									>
										<Trash2 className="w-3 h-3" />
									</button>
								</div>
							))}
						</div>
					</div>

					{/* Background Shapes Dropdown */}
					<div className="border-t p-3">
						<Dropdown
							value=""
							onChange={(value) => {
								if (value) {
									addBackgroundShapeRect(value);
									setBackgroundImage(null);
								}
							}}
							options={getShapeOptions()}
							placeholder="Add Background Shape"
						/>
					</div>

					{/* Background Image Upload */}
					<div className="border-t p-3">
						<div ref={backgroundImageDropdownRef} className="relative">
							<button
								onClick={() =>
									setIsBackgroundImageDropdownOpen(
										!isBackgroundImageDropdownOpen
									)
								}
								className="w-full flex items-center justify-between px-3 py-2 text-xs bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl transition-all"
							>
								<span className="text-zinc-700">
									{backgroundImage
										? "Change Background"
										: "Add Background Image"}
								</span>
								<ImageIcon className="w-3 h-3 text-zinc-500" />
							</button>
							<AnimatePresence>
								{isBackgroundImageDropdownOpen && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.15 }}
										className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden p-2"
									>
										<div className="space-y-2">
											<button
												onClick={() => backgroundImageInputRef.current?.click()}
												className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-zinc-100 rounded-xl transition-colors"
											>
												<ImageIcon className="w-3 h-3" />
												Upload Image
											</button>

											<div ref={urlScreenshotDropdownRef} className="relative">
												<button
													onClick={() =>
														setIsUrlScreenshotOpen(!isUrlScreenshotOpen)
													}
													className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-zinc-100 rounded-xl transition-colors"
												>
													<Globe className="w-3 h-3" />
													Screenshot URL
												</button>
												{isUrlScreenshotOpen && (
													<div className="absolute left-0 top-full mt-2 w-64 bg-white border border-zinc-200 rounded-xl shadow-lg p-3 z-50">
														<div className="space-y-3">
															<div className="space-y-1">
																<label className="text-xs font-medium text-zinc-700">
																	Website URL
																</label>
																<div className="flex gap-2">
																	<input
																		ref={urlInputRef}
																		type="url"
																		value={urlInput}
																		onChange={(e) =>
																			setUrlInput(e.target.value)
																		}
																		placeholder="https://example.com"
																		className="flex-1 px-2 py-1 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
																		onKeyDown={(e) => {
																			if (e.key === "Enter")
																				handleUrlScreenshot();
																		}}
																	/>
																	<button
																		onClick={handleUrlScreenshot}
																		disabled={isScreenshotLoading}
																		className="px-2 py-1 bg-zinc-900 text-white rounded-xl text-xs hover:bg-zinc-800 disabled:opacity-50"
																	>
																		{isScreenshotLoading ? (
																			<Loader2 className="w-3 h-3 animate-spin" />
																		) : (
																			"Go"
																		)}
																	</button>
																</div>
															</div>
															{screenshotImage && (
																<div className="space-y-2">
																	<div className="relative aspect-video bg-zinc-100 rounded-xl overflow-hidden">
																		<img
																			src={screenshotImage}
																			alt="Website screenshot"
																			className="w-full h-full object-cover"
																		/>
																	</div>
																	<button
																		onClick={handleAddScreenshotToCanvas}
																		className="w-full py-1.5 bg-zinc-900 text-white rounded-xl text-xs hover:bg-zinc-800"
																	>
																		Add to Canvas
																	</button>
																</div>
															)}
														</div>
													</div>
												)}
											</div>
											{backgroundImage && (
												<button
													onClick={() => {
														setBackgroundImage(null);
														setIsBackgroundImageDropdownOpen(false);
													}}
													className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors"
												>
													<Trash2 className="w-3 h-3" />
													Remove Background
												</button>
											)}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
							<input
								ref={backgroundImageInputRef}
								type="file"
								accept="image/*"
								onChange={handleBackgroundImageUpload}
								className="hidden"
							/>
						</div>
					</div>
				</div>

				{/* Add Elements Grid */}
				<div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-zinc-100">
					<button
						onClick={() => addShape("rectangle")}
						className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-zinc-50 rounded-xl transition-colors group"
						title="Add Rectangle (R)"
					>
						<Square className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900" />
					</button>
					<button
						onClick={() => addShape("square")}
						className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-zinc-50 rounded-xl transition-colors group"
						title="Add Square (S)"
					>
						<div className="w-3.5 h-3.5 border-2 border-zinc-500 group-hover:border-zinc-900 rounded-sm" />
					</button>
					<button
						onClick={() => addShape("circle")}
						className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-zinc-50 rounded-xl transition-colors group"
						title="Add Circle"
					>
						<div className="w-4 h-4 rounded-full border-2 border-zinc-500 group-hover:border-zinc-900" />
					</button>
					<button
						onClick={() => addShape("triangle")}
						className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-zinc-50 rounded-xl transition-colors group"
						title="Add Triangle"
					>
						<div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-zinc-500 group-hover:border-b-zinc-900" />
					</button>
					<button
						onClick={() => addShape("line")}
						className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-zinc-50 rounded-xl transition-colors group"
						title="Add Line (L)"
					>
						<Minus className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 -rotate-45" />
					</button>
					<button
						onClick={addText}
						className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-zinc-50 rounded-xl transition-colors group"
						title="Add Text (T)"
					>
						<Type className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900" />
					</button>
					<button
						onClick={() => fileInputRef.current?.click()}
						className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-zinc-50 rounded-xl transition-colors group"
						title="Add Image (I)"
					>
						<ImageIcon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900" />
					</button>
					<button
						onClick={() => videoInputRef.current?.click()}
						className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-zinc-50 rounded-xl transition-colors group"
						title="Add Video (V)"
					>
						<Video className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900" />
					</button>

					{/* Shape Dropdown */}
					<div ref={shapeDropdownRef} className="relative col-span-4">
						<button
							onClick={() => setIsShapeDropdownOpen(!isShapeDropdownOpen)}
							className="w-full flex items-center justify-center gap-2 p-2 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-colors text-xs text-zinc-600"
						>
							<Shapes className="w-3 h-3" />
							More Shapes
						</button>
						<AnimatePresence>
							{isShapeDropdownOpen && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.15 }}
									className="absolute z-50 w-full mt-2 left-0 bg-white border border-zinc-200 rounded-xl shadow-lg p-2"
								>
									<div className="grid grid-cols-4 gap-2">
										<button
											onClick={() => {
												addShape("star");
												setIsShapeDropdownOpen(false);
											}}
											className="p-2 hover:bg-zinc-50 rounded-xl flex justify-center"
											title="Star"
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												className="w-4 h-4"
											>
												<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
											</svg>
										</button>
										<button
											onClick={() => {
												addShape("arrow");
												setIsShapeDropdownOpen(false);
											}}
											className="p-2 hover:bg-zinc-50 rounded-xl flex justify-center"
											title="Arrow"
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												className="w-4 h-4"
											>
												<line x1="5" y1="12" x2="19" y2="12" />
												<polyline points="12 5 19 12 12 19" />
											</svg>
										</button>
										<button
											onClick={() => {
												addShape("hexagon");
												setIsShapeDropdownOpen(false);
											}}
											className="p-2 hover:bg-zinc-50 rounded-xl flex justify-center"
											title="Hexagon"
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												className="w-4 h-4"
											>
												<path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" />
											</svg>
										</button>
										<button
											onClick={() => {
												addShape("pentagon");
												setIsShapeDropdownOpen(false);
											}}
											className="p-2 hover:bg-zinc-50 rounded-xl flex justify-center"
											title="Pentagon"
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												className="w-4 h-4"
											>
												<path d="M12 2L2 9l4 13h12l4-13L12 2z" />
											</svg>
										</button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Icon Selector */}
					<div
						ref={iconSelectorDropdownRef}
						className="relative col-span-4 mt-2"
					>
						<button
							onClick={() => setIsIconSelectorOpen(!isIconSelectorOpen)}
							className="w-full flex items-center justify-center gap-2 p-2 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-colors text-xs text-zinc-600"
						>
							<Sparkles className="w-3 h-3" />
							Add Icons
						</button>
						<AnimatePresence>
							{isIconSelectorOpen && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.15 }}
									className="absolute z-50 w-full mt-2 left-0 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden"
									style={{ height: "300px" }}
								>
									<div className="p-2 border-b border-zinc-100">
										<input
											type="text"
											value={iconSearchQuery}
											onChange={(e) => setIconSearchQuery(e.target.value)}
											placeholder="Search icons..."
											className="w-full px-2 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
											autoFocus
										/>
									</div>
									<div
										className="overflow-y-auto p-2 grid grid-cols-4 gap-2"
										style={{ height: "calc(100% - 45px)" }}
									>
										{filteredIcons.map((iconName) => {
											const IconComponent = AllIcons[iconName];
											if (!IconComponent) return null;
											return (
												<button
													key={iconName}
													onClick={() => {
														addIcon(iconName, IconComponent);
														setIsIconSelectorOpen(false);
													}}
													className="p-2 hover:bg-zinc-50 rounded-xl flex flex-col items-center gap-1"
													title={iconName}
												>
													<IconComponent className="w-5 h-5 text-zinc-700" />
												</button>
											);
										})}
										{filteredIcons.length === 0 && (
											<div className="col-span-4 text-center py-4 text-xs text-zinc-500">
												No icons found
											</div>
										)}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>

				{/* Properties Panel (Conditional) */}
				<div className="py-3 bg-white rounded-xl border border-zinc-100">
					{/* Text Styling */}
					{selectedText &&
						(() => {
							const selectedTxt = texts.find((txt) => txt.id === selectedText);
							if (!selectedTxt) return null;
							const styles = selectedTxt.styles || {};
							return (
								<div className="p-3">
									<h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
										<Type className="w-4 h-4" />
										Text Styling
									</h3>
									{/* Font Size */}
									<div className="space-y-3">
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Font Size: {styles.fontSize || 24}px
											</label>
											<input
												type="range"
												min="8"
												max="120"
												step="1"
												value={styles.fontSize || 24}
												onChange={(e) =>
													updateText(selectedText, {
														styles: {
															...styles,
															fontSize: parseInt(e.target.value),
														},
													})
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>

										{/* Font Weight */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Font Weight
											</label>
											<Dropdown
												value={styles.fontWeight || "normal"}
												onChange={(value) =>
													updateText(selectedText, {
														styles: { ...styles, fontWeight: value },
													})
												}
												options={[
													{ value: "normal", label: "Normal" },
													{ value: "bold", label: "Bold" },
												]}
												placeholder="Select font weight"
											/>
										</div>

										{/* Font Style */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Font Style
											</label>
											<Dropdown
												value={styles.fontStyle || "normal"}
												onChange={(value) =>
													updateText(selectedText, {
														styles: { ...styles, fontStyle: value },
													})
												}
												options={[
													{ value: "normal", label: "Normal" },
													{ value: "italic", label: "Italic" },
												]}
												placeholder="Select font style"
											/>
										</div>

										{/* Text Color */}
										<ColorPicker
											value={styles.color || "#000000"}
											onChange={(color) =>
												updateText(selectedText, {
													styles: { ...styles, color: color },
												})
											}
											label="Text Color"
										/>

										{/* Text Align */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Text Align
											</label>
											<Dropdown
												value={styles.textAlign || "left"}
												onChange={(value) =>
													updateText(selectedText, {
														styles: { ...styles, textAlign: value },
													})
												}
												options={[
													{ value: "left", label: "Left" },
													{ value: "center", label: "Center" },
													{ value: "right", label: "Right" },
												]}
												placeholder="Select text align"
											/>
										</div>

										{/* Font Family */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Font Family
											</label>
											<Dropdown
												value={styles.fontFamily || "Arial"}
												onChange={(value) =>
													updateText(selectedText, {
														styles: { ...styles, fontFamily: value },
													})
												}
												options={[
													{ value: "Arial", label: "Arial" },
													{ value: "Helvetica", label: "Helvetica" },
													{
														value: "Times New Roman",
														label: "Times New Roman",
													},
													{ value: "Courier New", label: "Courier New" },
													{ value: "Verdana", label: "Verdana" },
													{ value: "Georgia", label: "Georgia" },
													{ value: "Palatino", label: "Palatino" },
													{ value: "Garamond", label: "Garamond" },
													{ value: "Comic Sans MS", label: "Comic Sans MS" },
													{ value: "Trebuchet MS", label: "Trebuchet MS" },
													{ value: "Impact", label: "Impact" },
												]}
												placeholder="Select font family"
											/>
										</div>

										{/* Opacity */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Opacity: {Math.round((styles.opacity || 1) * 100)}%
											</label>
											<input
												type="range"
												min="0"
												max="1"
												step="0.01"
												value={
													styles.opacity !== undefined ? styles.opacity : 1
												}
												onChange={(e) =>
													updateText(selectedText, {
														styles: {
															...styles,
															opacity: parseFloat(e.target.value),
														},
													})
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>

										{/* CSS Output */}
										<div className="border-t pt-3">
											<div className="flex items-center justify-between mb-1.5">
												<h4 className="text-xs font-medium">Text CSS</h4>
												<button
													onClick={() => {
														const css = `font-size: ${styles.fontSize || 24}px;
font-weight: ${styles.fontWeight || "normal"};
font-style: ${styles.fontStyle || "normal"};
color: ${styles.color || "#000000"};
text-align: ${styles.textAlign || "left"};
font-family: ${styles.fontFamily || "Arial"};
opacity: ${styles.opacity !== undefined ? styles.opacity : 1};`;
														copyToClipboard(css, "text-css");
													}}
													className="flex items-center gap-1 px-1.5 py-0.5 text-xs bg-zinc-50 hover:bg-zinc-100 rounded transition-colors"
												>
													<Copy className="w-3 h-3" />
													{copied === "text-css" ? "Copied!" : "Copy CSS"}
												</button>
											</div>
										</div>
									</div>
								</div>
							);
						})()}

					{/* Image Styling */}
					{selectedImage &&
						(() => {
							const selectedImg = images.find(
								(img) => img.id === selectedImage
							);
							if (!selectedImg) return null;
							const styles = selectedImg.styles || {};
							return (
								<div className="p-3 border-t">
									<h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
										<ImageIcon className="w-4 h-4" />
										Image Styling
									</h3>
									<div className="space-y-3">
										{/* Object Fit */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Object Fit
											</label>
											<Dropdown
												value={styles.objectFit || "contain"}
												onChange={(value) =>
													updateImage(selectedImage, {
														styles: { ...styles, objectFit: value },
													})
												}
												options={[
													{ value: "contain", label: "Contain" },
													{ value: "cover", label: "Cover" },
													{ value: "fill", label: "Fill" },
													{ value: "none", label: "None" },
													{ value: "scale-down", label: "Scale Down" },
												]}
												placeholder="Select object fit"
											/>
										</div>

										{/* Opacity */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Opacity: {Math.round((styles.opacity || 1) * 100)}%
											</label>
											<input
												type="range"
												min="0"
												max="1"
												step="0.01"
												value={
													styles.opacity !== undefined ? styles.opacity : 1
												}
												onChange={(e) =>
													updateImage(selectedImage, {
														styles: {
															...styles,
															opacity: parseFloat(e.target.value),
														},
													})
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>

										{/* Border Radius */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Border Radius: {styles.borderRadius || 0}px
											</label>
											<input
												type="range"
												min="0"
												max="100"
												step="1"
												value={styles.borderRadius || 0}
												onChange={(e) =>
													updateImage(selectedImage, {
														styles: {
															...styles,
															borderRadius: parseInt(e.target.value),
														},
													})
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>

										{/* CSS Output */}
										<div className="border-t pt-3">
											<div className="flex items-center justify-between mb-1.5">
												<h4 className="text-xs font-medium">Image CSS</h4>
												<button
													onClick={() => {
														const css = `object-fit: ${styles.objectFit || "contain"};
opacity: ${styles.opacity !== undefined ? styles.opacity : 1};
border-radius: ${styles.borderRadius || 0}px;`;
														copyToClipboard(css, "image-css");
													}}
													className="flex items-center gap-1 px-1.5 py-0.5 text-xs bg-zinc-50 hover:bg-zinc-100 rounded transition-colors"
												>
													<Copy className="w-3 h-3" />
													{copied === "image-css" ? "Copied!" : "Copy CSS"}
												</button>
											</div>
										</div>
									</div>
								</div>
							);
						})()}

					{/* Video Styling */}
					{selectedVideo &&
						(() => {
							const selectedVid = videos.find(
								(vid) => vid.id === selectedVideo
							);
							if (!selectedVid) return null;
							const styles = selectedVid.styles || {};
							return (
								<div className="p-3 border-t">
									<h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
										<Video className="w-4 h-4" />
										Video Styling
									</h3>
									<div className="space-y-3">
										{/* Object Fit */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Object Fit
											</label>
											<Dropdown
												value={styles.objectFit || "contain"}
												onChange={(value) =>
													updateVideo(selectedVideo, {
														styles: { ...styles, objectFit: value },
													})
												}
												options={[
													{ value: "contain", label: "Contain" },
													{ value: "cover", label: "Cover" },
													{ value: "fill", label: "Fill" },
													{ value: "none", label: "None" },
													{ value: "scale-down", label: "Scale Down" },
												]}
												placeholder="Select object fit"
											/>
										</div>

										{/* Opacity */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Opacity: {Math.round((styles.opacity || 1) * 100)}%
											</label>
											<input
												type="range"
												min="0"
												max="1"
												step="0.01"
												value={
													styles.opacity !== undefined ? styles.opacity : 1
												}
												onChange={(e) =>
													updateVideo(selectedVideo, {
														styles: {
															...styles,
															opacity: parseFloat(e.target.value),
														},
													})
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>

										{/* Border Radius */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Border Radius: {styles.borderRadius || 0}px
											</label>
											<input
												type="range"
												min="0"
												max="100"
												step="1"
												value={styles.borderRadius || 0}
												onChange={(e) =>
													updateVideo(selectedVideo, {
														styles: {
															...styles,
															borderRadius: parseInt(e.target.value),
														},
													})
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>
									</div>
								</div>
							);
						})()}

					{/* Background Shape Styling */}
					{selectedBackgroundShapeRect &&
						(() => {
							const selectedRect = backgroundShapeRects.find(
								(r) => r.id === selectedBackgroundShapeRect
							);
							if (!selectedRect) return null;
							const styles = selectedRect.styles || {};
							return (
								<div className="p-3 border-t">
									<h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
										<Square className="w-4 h-4" />
										BG Shape Styling
									</h3>
									<div className="space-y-3">
										{/* Scale */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Scale: {selectedRect.scale}x
											</label>
											<input
												type="range"
												min="0.1"
												max="3"
												step="0.1"
												value={selectedRect.scale}
												onChange={(e) =>
													updateBackgroundShapeRect(
														selectedBackgroundShapeRect,
														{
															scale: parseFloat(e.target.value),
														}
													)
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>

										{/* Opacity */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Opacity: {Math.round((styles.opacity || 1) * 100)}%
											</label>
											<input
												type="range"
												min="0"
												max="1"
												step="0.01"
												value={
													styles.opacity !== undefined ? styles.opacity : 1
												}
												onChange={(e) =>
													updateBackgroundShapeRect(
														selectedBackgroundShapeRect,
														{
															styles: {
																...styles,
																opacity: parseFloat(e.target.value),
															},
														}
													)
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>

										{/* Rotation */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Rotation: {styles.rotation || 0}°
											</label>
											<input
												type="range"
												min="-180"
												max="180"
												step="1"
												value={styles.rotation || 0}
												onChange={(e) =>
													updateBackgroundShapeRect(
														selectedBackgroundShapeRect,
														{
															styles: {
																...styles,
																rotation: parseInt(e.target.value),
															},
														}
													)
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>
									</div>
								</div>
							);
						})()}

					{/* Shape Styling */}
					{selectedShape &&
						(() => {
							const selectedShp = shapes.find(
								(shp) => shp.id === selectedShape
							);
							if (!selectedShp) return null;
							const styles = selectedShp.styles || {};
							return (
								<div className="p-3 border-t">
									<h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
										<Square className="w-4 h-4" />
										Shape Styling
									</h3>
									<div className="space-y-3">
										{/* Fill Color */}
										<ColorPicker
											value={styles.fillColor || "#3b82f6"}
											onChange={(color) =>
												updateShape(selectedShape, {
													styles: { ...styles, fillColor: color },
												})
											}
											label="Fill Color"
										/>

										{/* Stroke Color */}
										<ColorPicker
											value={styles.strokeColor || "#1e40af"}
											onChange={(color) =>
												updateShape(selectedShape, {
													styles: { ...styles, strokeColor: color },
												})
											}
											label="Stroke Color"
										/>

										{/* Stroke Width */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Stroke Width: {styles.strokeWidth ?? 2}px
											</label>
											<input
												type="range"
												min="0"
												max="20"
												step="1"
												value={styles.strokeWidth ?? 2}
												onChange={(e) =>
													updateShape(selectedShape, {
														styles: {
															...styles,
															strokeWidth: parseInt(e.target.value),
														},
													})
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>

										{/* Opacity */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Opacity: {Math.round((styles.opacity || 1) * 100)}%
											</label>
											<input
												type="range"
												min="0"
												max="1"
												step="0.01"
												value={
													styles.opacity !== undefined ? styles.opacity : 1
												}
												onChange={(e) =>
													updateShape(selectedShape, {
														styles: {
															...styles,
															opacity: parseFloat(e.target.value),
														},
													})
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>
									</div>
								</div>
							);
						})()}

					{/* Icon Styling */}
					{selectedIcon &&
						(() => {
							const selectedIc = icons.find((ic) => ic.id === selectedIcon);
							if (!selectedIc) return null;
							const styles = selectedIc.styles || {};
							return (
								<div className="p-3 border-t">
									<h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
										<Sparkles className="w-3 h-3" />
										Icon Styling
									</h3>
									<div className="space-y-3">
										<div className="text-xs text-zinc-500">
											Icon: {selectedIc.iconName}
										</div>

										{/* Color */}
										<ColorPicker
											value={styles.color || "#000000"}
											onChange={(color) =>
												updateIcon(selectedIcon, {
													styles: { ...styles, color: color },
												})
											}
											label="Icon Color"
										/>

										{/* Opacity */}
										<div>
											<label className="block text-xs font-medium text-zinc-700 mb-1.5">
												Opacity: {Math.round((styles.opacity || 1) * 100)}%
											</label>
											<input
												type="range"
												min="0"
												max="1"
												step="0.01"
												value={
													styles.opacity !== undefined ? styles.opacity : 1
												}
												onChange={(e) =>
													updateIcon(selectedIcon, {
														styles: {
															...styles,
															opacity: parseFloat(e.target.value),
														},
													})
												}
												className="w-full h-2 bg-zinc-200 rounded-xl appearance-none cursor-pointer slider"
											/>
										</div>
									</div>
								</div>
							);
						})()}
				</div>
			</div>
		</div>
	);
};

export default ControlPanel;
