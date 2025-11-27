import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/utils/firebase";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const HtmlPreview = ({ html, title, frameId }) => {
	if (!html) return null;
	return (
		<div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
			<iframe
				key={frameId}
				title={title}
				srcDoc={html}
				sandbox="allow-scripts allow-same-origin"
				className="w-full h-[80vh]"
			/>
		</div>
	);
};

export default function PublishedProject() {
	const router = useRouter();
	const { docId, frame: frameQueryParam } = router.query;
	const [selectedFrameId, setSelectedFrameId] = useState(null);
	const [isFrameDropdownOpen, setIsFrameDropdownOpen] = useState(false);
	const frameDropdownRef = useRef(null);

	const {
		data: publishedProjectData,
		isLoading: isProjectLoading,
		error: projectError,
	} = useQuery({
		queryKey: ["publishedProject", docId],
		queryFn: async () => {
			if (!docId) return null;
			const publishedDocRef = doc(db, "published-projects", docId);
			const publishedDoc = await getDoc(publishedDocRef);

			if (!publishedDoc.exists()) {
				throw new Error("Project not found");
			}

			const data = publishedDoc.data();

			if (!data.isPublic) {
				throw new Error("This project is not publicly available");
			}

			return {
				id: publishedDoc.id,
				...data,
			};
		},
		enabled: !!docId,
		staleTime: 1000 * 60,
		cacheTime: 1000 * 60 * 5,
	});

	const {
		data: framesData = [],
		isLoading: isFramesLoading,
		error: framesError,
	} = useQuery({
		queryKey: ["publishedProjectFrames", docId],
		queryFn: async () => {
			if (!docId) return [];
			const framesRef = collection(db, "published-projects", docId, "frames");
			const framesSnapshot = await getDocs(framesRef);
			const fetchedFrames = framesSnapshot.docs.map((frameDoc) => ({
				id: frameDoc.id,
				...frameDoc.data(),
			}));
			fetchedFrames.sort((a, b) => {
				const frameA = a.frameNumber ?? Number.MAX_SAFE_INTEGER;
				const frameB = b.frameNumber ?? Number.MAX_SAFE_INTEGER;
				if (frameA === frameB) {
					return (a.createdAt || "").localeCompare(b.createdAt || "");
				}
				return frameA - frameB;
			});
			return fetchedFrames;
		},
		enabled: !!docId,
		staleTime: 1000 * 30,
		cacheTime: 1000 * 60 * 5,
	});

	const frames = framesData;
	const hasFrames = frames.length > 0;
	const activeFrame = useMemo(() => {
		if (!hasFrames) return null;
		if (!selectedFrameId) {
			return frames[0];
		}
		return frames.find((frame) => frame.id === selectedFrameId) || frames[0];
	}, [frames, hasFrames, selectedFrameId]);

	useEffect(() => {
		if (framesError) {
			console.error("Error loading published frames:", framesError);
		}
	}, [framesError]);

	useEffect(() => {
		if (!frames.length) {
			setSelectedFrameId(null);
			return;
		}

		const normalizedFrameId = Array.isArray(frameQueryParam)
			? frameQueryParam[0]
			: frameQueryParam || null;

		if (normalizedFrameId) {
			const exists = frames.some((frame) => frame.id === normalizedFrameId);
			if (exists) {
				if (normalizedFrameId !== selectedFrameId) {
					setSelectedFrameId(normalizedFrameId);
				}
				return;
			}
		}

		const fallbackFrameId = frames[0].id;
		if (selectedFrameId !== fallbackFrameId) {
			setSelectedFrameId(fallbackFrameId);
		}
		if (fallbackFrameId !== normalizedFrameId) {
			updateFrameQuery(fallbackFrameId);
		}
	}, [frames, frameQueryParam, selectedFrameId]);

	const updateFrameQuery = (frameId) => {
		const nextQuery = { ...router.query };
		if (frameId) {
			nextQuery.frame = frameId;
		} else {
			delete nextQuery.frame;
		}

		router.replace({
			pathname: router.pathname,
			query: nextQuery,
		});
	};

	const handleFrameSelect = (frameId) => {
		setSelectedFrameId(frameId);
		updateFrameQuery(frameId);
		setIsFrameDropdownOpen(false);
	};

	const handleFrameNavigate = (direction) => {
		if (!frames.length || !selectedFrameId) return;
		const currentIndex = frames.findIndex(
			(frame) => frame.id === selectedFrameId
		);
		if (currentIndex === -1) return;

		const nextIndex =
			direction === "prev" ? currentIndex - 1 : currentIndex + 1;

		if (nextIndex < 0 || nextIndex >= frames.length) {
			return;
		}

		const nextFrameId = frames[nextIndex].id;
		handleFrameSelect(nextFrameId);
	};

	const fallbackHtml = publishedProjectData?.publicHtmlContent || "";
	const projectName = publishedProjectData?.projectName || "Published Project";
	const isLoading = isProjectLoading;
	const error = projectError ? projectError.message : null;
	const hasFrameControls = isFramesLoading || frames.length > 0;
	const selectedFrameLabel = useMemo(() => {
		if (!frames.length) {
			return isFramesLoading ? "Loading frames..." : "No frames";
		}
		const target = frames.find((frame) => frame.id === selectedFrameId);
		if (!target) {
			return "Select frame";
		}
		return (
			target.name ||
			(target.frameNumber ? `Frame ${target.frameNumber}` : target.id)
		);
	}, [frames, isFramesLoading, selectedFrameId]);

	useEffect(() => {
		if (!isFrameDropdownOpen) return;
		const handleClickOutside = (event) => {
			if (
				frameDropdownRef.current &&
				!frameDropdownRef.current.contains(event.target)
			) {
				setIsFrameDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isFrameDropdownOpen]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-zinc-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-500 mx-auto mb-4"></div>
					<p className="text-zinc-600">Loading project...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-zinc-50">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-zinc-900 mb-2">Error</h1>
					<p className="text-zinc-600">{error}</p>
					<button
						onClick={() => router.push("/")}
						className="mt-4 px-4 py-2 bg-zinc-500 text-white rounded-xl hover:bg-zinc-600 transition-colors"
					>
						Go Home
					</button>
				</div>
			</div>
		);
	}

	const previewHtml = (() => {
		if (hasFrames && activeFrame?.htmlContent) {
			return (
				<HtmlPreview
					html={activeFrame.htmlContent}
					title={
						activeFrame.name ||
						(activeFrame.frameNumber
							? `Frame ${activeFrame.frameNumber}`
							: "Frame")
					}
					frameId={activeFrame.id}
				/>
			);
		}

		if (fallbackHtml) {
			return (
				<HtmlPreview html={fallbackHtml} title={projectName} frameId="project" />
			);
		}

		return (
			<div className="text-center text-sm text-zinc-500 py-20">
				No preview available.
			</div>
		);
	})();

	return (
		<>
			<Head>
				<title>{projectName} - kixi</title>
				<meta name="description" content={`View ${projectName} on kixi`} />
			</Head>
			<div
				className={`min-h-screen bg-zinc-50 ${hasFrameControls ? "pt-24" : ""}`}
			>
				{hasFrameControls && (
					<div className="fixed bottom-4 right-4 z-[2147483000] bg-white shadow-md rounded-xl border border-zinc-200">
						<div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
							<button
								type="button"
								onClick={() => handleFrameNavigate("prev")}
								disabled={
									isFramesLoading ||
									!selectedFrameId ||
									frames.findIndex((frame) => frame.id === selectedFrameId) <= 0
								}
								className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white transition-colors bg-white"
								title="Previous frame"
							>
								<ChevronLeft className="w-4 h-4" />
							</button>
							<div className="flex-1 relative" ref={frameDropdownRef}>
								<button
									type="button"
									onClick={() => setIsFrameDropdownOpen((prev) => !prev)}
									disabled={isFramesLoading || frames.length === 0}
									className="w-full flex items-center justify-between text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
								>
									<span className="truncate text-left">
										{selectedFrameLabel}
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
											initial={{ opacity: 0, y: -8 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -8 }}
											transition={{ duration: 0.15 }}
											className="absolute mt-2 left-0 right-0 bottom-full bg-white border border-zinc-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50"
										>
											{frames.length === 0 ? (
												<div className="px-3 py-2 text-sm text-zinc-500">
													{isFramesLoading ? "Loading frames..." : "No frames"}
												</div>
											) : (
												frames.map((frame) => {
													const label =
														frame.name ||
														(frame.frameNumber
															? `Frame ${frame.frameNumber}`
															: frame.id);
													const isActive = selectedFrameId === frame.id;
													return (
														<button
															type="button"
															key={frame.id}
															onClick={() => handleFrameSelect(frame.id)}
															className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 ${
																isActive
																	? "text-zinc-600 font-medium"
																	: "text-zinc-800"
															}`}
														>
															{label}
														</button>
													);
												})
											)}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
							<button
								type="button"
								onClick={() => handleFrameNavigate("next")}
								disabled={
									isFramesLoading ||
									!selectedFrameId ||
									frames.findIndex((frame) => frame.id === selectedFrameId) ===
										frames.length - 1
								}
								className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white transition-colors bg-white"
								title="Next frame"
							>
								<ChevronRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}
				<div className="max-w-6xl mx-auto px-4 pb-24">{previewHtml}</div>
			</div>
		</>
	);
}
