import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	X,
	Calendar,
	MoreVertical,
	Copy,
	Trash2,
	Edit,
	ArrowLeft,
	ExternalLink,
	Pencil,
} from "lucide-react";
import {
	collection,
	doc,
	deleteDoc,
	updateDoc,
	addDoc,
	getDocs,
	query,
	orderBy,
} from "firebase/firestore";
import { db } from "../../lib/utils/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Folder01Icon } from "hugeicons-react";

const DropdownMenu = ({ isOpen, onClose, items }) => {
	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: -10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: -10 }}
					className="absolute z-[70] bg-white rounded-xl shadow-xl border border-zinc-100 p-1 w-36 right-2 top-10"
					onClick={(e) => e.stopPropagation()}
				>
					{items.map((item, index) => (
						<button
							key={index}
							onClick={(e) => {
								e.stopPropagation();
								item.onClick();
								onClose();
							}}
							className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-xl transition-colors ${
								item.danger
									? "text-red-500 hover:bg-red-50"
									: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
							}`}
						>
							{item.icon}
							{item.label}
						</button>
					))}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const ProjectsModal = ({
	isOpen,
	onClose,
	projects,
	onSelectProject,
	currentProjectId,
	user,
	onProjectsChange,
}) => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState("projects"); // 'projects' or 'frames'
	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedFrame, setSelectedFrame] = useState(null);
	const [frames, setFrames] = useState([]);
	const [isLoadingFrames, setIsLoadingFrames] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState(null); // 'project-id' or 'frame-id'
	const [renamingId, setRenamingId] = useState(null); // 'project-id' or 'frame-id'
	const [renameValue, setRenameValue] = useState("");

	// Reset state when modal closes
	useEffect(() => {
		if (!isOpen) {
			setViewMode("projects");
			setSelectedProject(null);
			setSelectedFrame(null);
			setFrames([]);
			setActiveDropdown(null);
			setRenamingId(null);
		}
	}, [isOpen]);

	const filteredProjects = useMemo(() => {
		if (!searchQuery.trim()) return projects;
		return projects.filter((project) =>
			(project.name || "Untitled Project")
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		);
	}, [projects, searchQuery]);

	// Fetch frames for selected project
	const fetchFrames = async (projectId) => {
		if (!user?.uid || !projectId) return;

		setIsLoadingFrames(true);
		try {
			const framesRef = collection(
				db,
				"users",
				user.uid,
				"kixi-projects",
				projectId,
				"frames"
			);
			const framesQuery = query(framesRef, orderBy("frameNumber", "asc"));
			const framesSnapshot = await getDocs(framesQuery);

			const framesList = framesSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setFrames(framesList);
		} catch (error) {
			console.error("Error loading frames:", error);
			toast.error("Failed to load frames");
		} finally {
			setIsLoadingFrames(false);
		}
	};

	const handleProjectClick = (project) => {
		setSelectedProject(project);
		setSelectedFrame(null);
		setViewMode("frames");
		fetchFrames(project.id);
	};

	const handleBackToProjects = () => {
		setViewMode("projects");
		setSelectedProject(null);
		setSelectedFrame(null);
		setFrames([]);
	};

	const handleBackToFrameList = () => {
		setSelectedFrame(null);
	};

	// --- Action Handlers ---

	// Duplicate Project
	const handleDuplicateProject = async (project) => {
		if (!user?.uid) return;
		try {
			// 1. Create new project doc
			const newProjectData = {
				...project,
				name: `${project.name} (Copy)`,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			delete newProjectData.id; // Remove old ID

			const projectsRef = collection(db, "users", user.uid, "kixi-projects");
			const newProjectDoc = await addDoc(projectsRef, newProjectData);

			// 2. Fetch and copy frames
			const oldFramesRef = collection(
				db,
				"users",
				user.uid,
				"kixi-projects",
				project.id,
				"frames"
			);
			const oldFramesSnapshot = await getDocs(oldFramesRef);

			const newFramesRef = collection(
				db,
				"users",
				user.uid,
				"kixi-projects",
				newProjectDoc.id,
				"frames"
			);

			const batchPromises = oldFramesSnapshot.docs.map((frameDoc) => {
				const frameData = frameDoc.data();
				return addDoc(newFramesRef, frameData);
			});

			await Promise.all(batchPromises);

			toast.success("Project duplicated successfully");
			if (onProjectsChange) onProjectsChange();
		} catch (error) {
			console.error("Error duplicating project:", error);
			toast.error("Failed to duplicate project");
		}
	};

	// Delete Project
	const handleDeleteProject = async (projectId) => {
		if (!confirm("Are you sure you want to delete this project?")) return;
		if (!user?.uid) return;

		try {
			// Delete frames subcollection first (client-side iteration)
			const framesRef = collection(
				db,
				"users",
				user.uid,
				"kixi-projects",
				projectId,
				"frames"
			);
			const framesSnapshot = await getDocs(framesRef);
			const deletePromises = framesSnapshot.docs.map((doc) =>
				deleteDoc(doc.ref)
			);
			await Promise.all(deletePromises);

			await deleteDoc(doc(db, "users", user.uid, "kixi-projects", projectId));
			toast.success("Project deleted");
			if (onProjectsChange) onProjectsChange();
		} catch (error) {
			console.error("Error deleting project:", error);
			toast.error("Failed to delete project");
		}
	};

	// Rename Project
	const handleRenameProject = async (projectId, newName) => {
		if (!user?.uid || !newName.trim()) return;
		try {
			const projectRef = doc(db, "users", user.uid, "kixi-projects", projectId);
			await updateDoc(projectRef, {
				name: newName.trim(),
				updatedAt: new Date().toISOString(),
			});
			toast.success("Project renamed");
			setRenamingId(null);
			setRenameValue("");
			if (onProjectsChange) onProjectsChange();
		} catch (error) {
			console.error("Error renaming project:", error);
			toast.error("Failed to rename project");
		}
	};

	// Duplicate Frame
	const handleDuplicateFrame = async (frame) => {
		if (!user?.uid || !selectedProject?.id) return;
		try {
			const framesRef = collection(
				db,
				"users",
				user.uid,
				"kixi-projects",
				selectedProject.id,
				"frames"
			);

			const newFrameData = {
				...frame,
				name: `${frame.name || "Frame"} (Copy)`,
				// Ensure we handle frameNumber if needed, or just append
				// If we want to insert it next to the current one, we need to adjust frameNumbers.
				// For simplicity, just append or give it same number and let sort handle it (might be messy).
				// Let's just add it.
				updatedAt: new Date().toISOString(),
			};
			delete newFrameData.id;

			await addDoc(framesRef, newFrameData);
			toast.success("Frame duplicated");
			fetchFrames(selectedProject.id); // Refresh frames
		} catch (error) {
			console.error("Error duplicating frame:", error);
			toast.error("Failed to duplicate frame");
		}
	};

	// Delete Frame
	const handleDeleteFrame = async (frameId) => {
		if (!confirm("Are you sure you want to delete this frame?")) return;
		if (!user?.uid || !selectedProject?.id) return;

		try {
			await deleteDoc(
				doc(
					db,
					"users",
					user.uid,
					"kixi-projects",
					selectedProject.id,
					"frames",
					frameId
				)
			);
			toast.success("Frame deleted");
			fetchFrames(selectedProject.id); // Refresh frames
		} catch (error) {
			console.error("Error deleting frame:", error);
			toast.error("Failed to delete frame");
		}
	};

	// Rename Frame
	const handleRenameFrame = async (frameId, newName) => {
		if (!user?.uid || !selectedProject?.id || !newName.trim()) return;
		try {
			const frameRef = doc(
				db,
				"users",
				user.uid,
				"kixi-projects",
				selectedProject.id,
				"frames",
				frameId
			);
			await updateDoc(frameRef, {
				name: newName.trim(),
				updatedAt: new Date().toISOString(),
			});
			toast.success("Frame renamed");
			setRenamingId(null);
			setRenameValue("");
			fetchFrames(selectedProject.id);
		} catch (error) {
			console.error("Error renaming frame:", error);
			toast.error("Failed to rename frame");
		}
	};

	const openProject = (project, frameId = null) => {
		onSelectProject(project);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
					className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
				>
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						onClick={(e) => {
							e.stopPropagation();
							setActiveDropdown(null);
						}}
						className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
					>
						{/* Header */}
						<div className="p-4 border-b border-zinc-100 flex items-center justify-between gap-4 bg-white z-10">
							<div className="flex items-center gap-3 flex-1">
								<div className="bg-zinc-100 p-2 rounded-xl">
									<Folder01Icon className="w-4 h-4" />
								</div>

								<h2 className="text-lg font-semibold text-zinc-800">
									My Kixi Projects
								</h2>
							</div>

							<div className="flex-1 max-w-md relative">
								<Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
								<input
									type="text"
									placeholder={
										viewMode === "frames"
											? "Search frames..."
											: "Search projects..."
									}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-9 pr-4 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 transition-all text-xs"
								/>
							</div>

							<button
								onClick={onClose}
								className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500 transition-colors"
							>
								<X className="w-4 h-4" />
							</button>
						</div>

						{/* Breadcrumb & Navigation */}
						<div className="px-4 py-3 flex items-center gap-2 border-b border-zinc-100 bg-white">
							{viewMode === "frames" && selectedProject ? (
								<div className="flex items-center gap-2">
									<button
										onClick={
											selectedFrame
												? handleBackToFrameList
												: handleBackToProjects
										}
										className="p-1.5 hover:bg-zinc-100 rounded-xl text-zinc-500 transition-colors"
									>
										<ArrowLeft className="w-3.5 h-3.5" />
									</button>
									<span
										onClick={handleBackToProjects}
										className="text-zinc-500 hover:text-zinc-800 cursor-pointer font-medium text-xs"
									>
										Projects
									</span>
									<span className="text-zinc-300">/</span>
									<span
										onClick={selectedFrame ? handleBackToFrameList : undefined}
										className={`${
											selectedFrame
												? "text-zinc-500 hover:text-zinc-800 cursor-pointer"
												: "text-zinc-800"
										} font-semibold text-xs transition-colors`}
									>
										{selectedProject.name}
									</span>
									{selectedFrame && (
										<>
											<span className="text-zinc-300">/</span>
											<span className="text-zinc-800 font-semibold text-xs">
												{selectedFrame.name || "Untitled Frame"}
											</span>
										</>
									)}
								</div>
							) : (
								<div className="text-xs font-medium text-zinc-500">
									Projects
								</div>
							)}
						</div>

						{/* Content */}
						<div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50">
							{viewMode === "projects" ? (
								// --- Projects Grid ---
								filteredProjects.length === 0 ? (
									<div className="h-full flex flex-col items-center justify-center text-zinc-400">
										<Folder01Icon className="w-12 h-12 mb-4 opacity-20" />
										<p className="text-sm">No projects found</p>
									</div>
								) : (
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
										{filteredProjects.map((project) => (
											<div
												key={project.id}
												className={`group relative flex flex-col rounded-2xl border transition-all hover:shadow-lg bg-white ${
													currentProjectId === project.id
														? "border-zinc-300 ring-2 ring-zinc-200"
														: "border-zinc-200 hover:border-zinc-300"
												}`}
											>
												<button
													onClick={() => handleProjectClick(project)}
													className="flex-1 p-3 flex flex-col items-center w-full"
												>
													<div className="w-full aspect-[4/3] bg-zinc-50 rounded-xl mb-3 flex items-center justify-center group-hover:bg-zinc-100 transition-colors relative overflow-hidden">
														<Folder01Icon
															className={`w-10 h-10 transition-colors ${
																currentProjectId === project.id
																	? "text-zinc-600"
																	: "text-zinc-300 group-hover:text-zinc-400"
															}`}
															strokeWidth={1.5}
														/>
													</div>

													{renamingId === project.id ? (
														<input
															type="text"
															value={renameValue}
															onChange={(e) => setRenameValue(e.target.value)}
															onKeyDown={(e) => {
																if (e.key === "Enter")
																	handleRenameProject(project.id, renameValue);
																if (e.key === "Escape") setRenamingId(null);
															}}
															onClick={(e) => e.stopPropagation()}
															autoFocus
															className="w-full text-center text-xs border border-zinc-300 rounded px-1 py-0.5"
														/>
													) : (
														<div className="w-full text-center">
															<h3 className="font-medium text-zinc-700 truncate w-full text-xs group-hover:text-zinc-900">
																{project.name || "Untitled Project"}
															</h3>
															<div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-zinc-400">
																<Calendar className="w-2.5 h-2.5" />
																<span>
																	{new Date(
																		project.updatedAt || Date.now()
																	).toLocaleDateString()}
																</span>
															</div>
														</div>
													)}
												</button>

												{/* Dropdown Trigger */}
												<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
													<button
														onClick={(e) => {
															e.stopPropagation();
															setActiveDropdown(
																activeDropdown === project.id
																	? null
																	: project.id
															);
														}}
														className="p-1 bg-white/90 hover:bg-white rounded-xl shadow-sm border border-zinc-200 text-zinc-500 hover:text-zinc-900"
													>
														<MoreVertical className="w-3.5 h-3.5" />
													</button>
													<DropdownMenu
														isOpen={activeDropdown === project.id}
														onClose={() => setActiveDropdown(null)}
														items={[
															{
																label: "Open Project",
																icon: <ExternalLink className="w-3.5 h-3.5" />,
																onClick: () => openProject(project),
															},
															{
																label: "Rename",
																icon: <Pencil className="w-3.5 h-3.5" />,
																onClick: () => {
																	setRenamingId(project.id);
																	setRenameValue(project.name || "");
																},
															},
															{
																label: "Duplicate",
																icon: <Copy className="w-3.5 h-3.5" />,
																onClick: () => handleDuplicateProject(project),
															},
															{
																label: "Delete",
																icon: <Trash2 className="w-3.5 h-3.5" />,
																danger: true,
																onClick: () => handleDeleteProject(project.id),
															},
														]}
													/>
												</div>
											</div>
										))}
									</div>
								)
							) : (
								// --- Frames Grid (Folder View) ---
								<div className="space-y-6">
									<div className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
										<div>
											<h3 className="text-base font-medium text-zinc-900">
												{selectedProject?.name}
											</h3>
											<p className="text-xs text-zinc-500">
												{frames.length} frames
											</p>
										</div>
										<button
											onClick={() => openProject(selectedProject)}
											className="px-3 py-1.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-2 text-xs font-medium"
										>
											<Edit className="w-3.5 h-3.5" />
											Edit Project
										</button>
									</div>

									{isLoadingFrames ? (
										<div className="flex justify-center py-12">
											<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
										</div>
									) : frames.length === 0 ? (
										<div className="text-center py-12 text-zinc-400">
											<Folder01Icon className="w-10 h-10 mx-auto mb-3 opacity-20" />
											<p className="text-sm">No frames in this project</p>
										</div>
									) : (
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
											{frames.map((frame, index) => (
												<div
													key={frame.id}
													onClick={() => setSelectedFrame(frame)}
													className={`group relative flex flex-col rounded-2xl border transition-all hover:shadow-lg bg-white overflow-hidden cursor-pointer ${
														selectedFrame?.id === frame.id
															? "border-zinc-900 ring-2 ring-zinc-900/10"
															: "border-zinc-200 hover:border-zinc-300"
													}`}
												>
													<div className="w-full aspect-[9/16] bg-zinc-100 relative">
														{/* Frame Preview - ideally renders frame content, but for now placeholder */}
														<div className="absolute inset-0 flex items-center justify-center text-zinc-300 font-bold text-2xl select-none">
															{index + 1}
														</div>

														{/* If frame has preview image/data, render here */}
													</div>

													<div className="p-3 bg-white border-t border-zinc-100">
														{renamingId === frame.id ? (
															<input
																type="text"
																value={renameValue}
																onChange={(e) => setRenameValue(e.target.value)}
																onKeyDown={(e) => {
																	if (e.key === "Enter")
																		handleRenameFrame(frame.id, renameValue);
																	if (e.key === "Escape") setRenamingId(null);
																}}
																onClick={(e) => e.stopPropagation()}
																autoFocus
																className="w-full text-xs border border-zinc-300 rounded px-1 py-0.5"
															/>
														) : (
															<h4 className="text-xs font-medium text-zinc-700 truncate">
																{frame.name || `Frame ${index + 1}`}
															</h4>
														)}
													</div>

													{/* Dropdown Trigger */}
													<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
														<button
															onClick={(e) => {
																e.stopPropagation();
																setActiveDropdown(
																	activeDropdown === frame.id ? null : frame.id
																);
															}}
															className="p-1 bg-white/90 hover:bg-white rounded-xl shadow-sm border border-zinc-200 text-zinc-500 hover:text-zinc-900"
														>
															<MoreVertical className="w-3.5 h-3.5" />
														</button>
														<DropdownMenu
															isOpen={activeDropdown === frame.id}
															onClose={() => setActiveDropdown(null)}
															items={[
																{
																	label: "Edit",
																	icon: <Edit className="w-3.5 h-3.5" />,
																	onClick: () =>
																		openProject(selectedProject, frame.id),
																},
																{
																	label: "Rename",
																	icon: <Pencil className="w-3.5 h-3.5" />,
																	onClick: () => {
																		setRenamingId(frame.id);
																		setRenameValue(frame.name || "");
																	},
																},
																{
																	label: "Duplicate",
																	icon: <Copy className="w-3.5 h-3.5" />,
																	onClick: () => handleDuplicateFrame(frame),
																},
																{
																	label: "Delete",
																	icon: <Trash2 className="w-3.5 h-3.5" />,
																	danger: true,
																	onClick: () => handleDeleteFrame(frame.id),
																},
															]}
														/>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ProjectsModal;
