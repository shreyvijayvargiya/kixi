import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Loader2, Rocket, Command, Info, MessageSquareWarning, Send } from "lucide-react";
import { Folder01Icon, Add01Icon, NewTwitterIcon } from "hugeicons-react";
import LayerList from "../../../lib/utils/LayerList";
import useOutsideClick from "../../../lib/hooks/useOutsideClick";

const Sidebar = ({
	isSidebarDrawerOpen,
	setIsProjectModalOpen,
	isAuthenticated,
	isLoadingProjects,
	projects,
	handleNewProject,
	currentProjectId,
	loadProject,
	router,
	editingProjectId,
	editingProjectName,
	setEditingProjectName,
	handleRenameProject,
	setEditingProjectId,
	handleDeleteProject,
	images,
	videos,
	texts,
	shapes,
	icons,
	backgroundShapeRects,
	handleUpdateZIndex,
	selectedImage,
	selectedVideo,
	selectedText,
	selectedShape,
	selectedIcon,
	selectedBackgroundShapeRect,
	handleLayerSelect,
	handleDeleteLayer,
	keyboardShortcutsRef,
	isKeyboardShortcutsOpen,
	setIsKeyboardShortcutsOpen,
	setIsOpenAboutModal,
	// showSubscriptionModal, // Was commented out in original usage
	// setShowSubscriptionModal, // Was commented out in original usage
	isReleasesModalOpen,
	setIsReleasesModalOpen,
}) => {
	const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
	const [issueMessage, setIssueMessage] = useState("");
	const [isSendingIssue, setIsSendingIssue] = useState(false);
	const reportIssueRef = useRef(null);

	useOutsideClick(reportIssueRef, () => {
		if (isReportIssueOpen) setIsReportIssueOpen(false);
	});

	const handleReportIssue = async () => {
		if (!issueMessage.trim()) return;
		setIsSendingIssue(true);
		try {
			await fetch("/api/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					subject: "Issue Report from App",
					message: issueMessage,
					name: "App User",
					email: "user@kixi.app",
				}),
			});
			setIssueMessage("");
			setIsReportIssueOpen(false);
			// Optional: Show success toast
		} catch (error) {
			console.error(error);
		} finally {
			setIsSendingIssue(false);
		}
	};

	return (
		<motion.aside
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			className={`bg-white top-[88px] w-[85vw] max-w-sm space-y-4 z-50 h-[calc(100vh-140px)] overflow-y-auto hidescrollbar border border-zinc-100 rounded-xl fixed left-2 flex flex-col transition-transform duration-300 ease-out -translate-x-full lg:translate-x-0 lg:left-4 lg:top-[20px] lg:w-[280px] lg:h-[calc(100vh-56px)] ${
				isSidebarDrawerOpen ? "translate-x-0 shadow-2xl lg:shadow-none" : ""
			} lg:z-40`}
		>
			<div className="flex-1 overflow-y-auto p-2 flex flex-col justify-between items-start">
				<div className="w-full">
					<div className="flex w-full items-center justify-between gap-2 mb-2">
						<img src="./kixi-logo.png" alt="kixi" className="w-10 h-10" />
						<button
							onClick={() => setIsProjectModalOpen(true)}
							className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-500 hover:text-zinc-900 transition-colors"
							title="All Projects"
						>
							<Folder01Icon className="w-5 h-5" />
						</button>
					</div>
					<hr />

					{isAuthenticated && (
						<div className="flex justify-between items-center ">
							<h3 className="text-sm text-black">My Kixi's</h3>
							<div className="p-2">
								<button
									onClick={handleNewProject}
									className="w-fit flex items-center justify-center gap-1 p-1.5 text-xs bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 rounded transition-all"
								>
									<Add01Icon className="w-3 h-3" />
								</button>
							</div>
						</div>
					)}
					{isAuthenticated && isLoadingProjects ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
						</div>
					) : projects.length === 0 ? (
						<div className="text-left py-2 space-y-2 text-zinc-500 text-sm">
							{isAuthenticated
								? "No projects yet. Create your first one!"
								: "Sign in to save and manage your projects"}
							{/* <GoogleLoginButton /> */}
						</div>
					) : (
						isAuthenticated && (
							<div className="space-y-2">
								{projects.map((project) => (
									<div
										key={project.id}
										className={`group relative p-1 hover:ring hover:ring-zinc-100 rounded-xl cursor-pointer transition-all ${
											currentProjectId === project.id
												? "bg-zinc-50 ring ring-zinc-50 border border-zinc-100"
												: "hover:bg-zinc-50"
										}`}
										onClick={() => {
											if (project.id !== currentProjectId) {
												loadProject(project.id);
												router.push(`/app?projectId=${project.id}`, undefined, {
													shallow: true,
												});
											}
										}}
									>
										<div className="flex items-center justify-between gap-2 mb-1 p-1 relative z-10">
											<div className="flex-1 min-w-0">
												{editingProjectId === project.id ? (
													<input
														type="text"
														value={editingProjectName}
														onChange={(e) =>
															setEditingProjectName(e.target.value)
														}
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																handleRenameProject(
																	project.id,
																	editingProjectName
																);
															} else if (e.key === "Escape") {
																setEditingProjectId(null);
																setEditingProjectName("");
															}
														}}
														onClick={(e) => e.stopPropagation()}
														autoFocus
														className="text-sm text-zinc-800 rounded w-full bg-white border border-zinc-300 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-zinc-400"
													/>
												) : (
													<h4
														className="text-sm text-zinc-800 truncate cursor-text hover:bg-zinc-100 px-1 py-0.5 rounded"
														onClick={(e) => {
															e.stopPropagation();
															setEditingProjectId(project.id);
															setEditingProjectName(
																project.name || "Untitled Project"
															);
														}}
														title="Click to rename"
													>
														{project.name || "Untitled Project"}
													</h4>
												)}
											</div>
											<button
												onClick={(e) => {
													e.stopPropagation();
													e.preventDefault();
													handleDeleteProject(project.id);
												}}
												className="p-1 hover:bg-red-100 rounded-xl transition-all relative z-20 flex-shrink-0"
											>
												<Trash2 className="w-3 h-3 text-red-400" />
											</button>
										</div>
										{/* Layer List - Fixed on Left Side */}
										{currentProjectId === project.id && (
											<LayerList
												images={images}
												videos={videos}
												texts={texts}
												shapes={shapes}
												icons={icons}
												backgroundShapeRects={backgroundShapeRects}
												onUpdateZIndex={handleUpdateZIndex}
												selectedImage={selectedImage}
												selectedVideo={selectedVideo}
												selectedText={selectedText}
												selectedShape={selectedShape}
												selectedIcon={selectedIcon}
												selectedBackgroundShapeRect={
													selectedBackgroundShapeRect
												}
												onSelect={handleLayerSelect}
												onDelete={handleDeleteLayer}
											/>
										)}
									</div>
								))}
							</div>
						)
					)}
				</div>
				<div className="space-y-2 flex flex-col px-2 w-full">
					{/* Keyboard Shortcuts Info Button */}
					<div ref={keyboardShortcutsRef} className="">
						<motion.button
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							onClick={() =>
								setIsKeyboardShortcutsOpen(!isKeyboardShortcutsOpen)
							}
							className="text-sm cursor-pointer flex gap-1 justify-start hover:text-black text-zinc-500 rounded-xl transition-colors items-center"
							title="Keyboard Shortcuts"
						>
							<Command className="w-3.5 h-3.5" />
							Keyboard Shortcuts
						</motion.button>
					</div>
					<button
						onClick={() => setIsReleasesModalOpen(true)}
						className="text-sm cursor-pointer flex gap-1 justify-start hover:text-black text-zinc-500 rounded-xl transition-colors items-center"
						title="Releases"
					>
						<Rocket className="w-3.5 h-3.5" />
						Releases
					</button>

					<button
						className="hover:text-black text-zinc-500 text-sm w-fit transition-all duration-100 ease-in flex gap-1 items-center"
						onClick={() => setIsOpenAboutModal(true)}
					>
						<Info className="w-3.5 h-3.5" />
						About
					</button>
					<a
						href="https://x.com/@treyvijay"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-black text-zinc-500 text-sm w-full transition-all duration-100 ease-in flex gap-1 items-center"
					>
						<NewTwitterIcon className="w-3.5 h-3.5" />
						Twitter
					</a>

					<div className="relative w-full pt-2 border-t border-zinc-100" ref={reportIssueRef}>
						<AnimatePresence>
							{isReportIssueOpen && (
								<motion.div
									initial={{ opacity: 0, y: 10, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 10, scale: 0.95 }}
									className="absolute bottom-full mb-2 left-0 w-full bg-white border border-zinc-200 rounded-xl shadow-xl p-3 z-50"
								>
									<div className="flex flex-col gap-2">
										<textarea
											value={issueMessage}
											onChange={(e) => setIssueMessage(e.target.value)}
											placeholder="What's the issue?"
											className="w-full text-sm p-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500 min-h-[80px] resize-none text-zinc-800"
											autoFocus
										/>
										<button
											onClick={handleReportIssue}
											disabled={isSendingIssue || !issueMessage.trim()}
											className="w-full py-1.5 bg-zinc-900 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
										>
											{isSendingIssue ? (
												<Loader2 className="w-3 h-3 animate-spin" />
											) : (
												<>
													Send Report <Send className="w-3 h-3" />
												</>
											)}
										</button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
						<button
							onClick={() => setIsReportIssueOpen(!isReportIssueOpen)}
							className={`w-full hover:text-black text-zinc-500 text-sm transition-all duration-100 ease-in flex gap-2 items-center p-2 rounded-xl ${
								isReportIssueOpen ? "bg-zinc-100 text-black" : ""
							}`}
						>
							<MessageSquareWarning className="w-3 h-3" />
							Report Issue
						</button>
					</div>
				</div>
			</div>
		</motion.aside>
	);
};

export default Sidebar;
