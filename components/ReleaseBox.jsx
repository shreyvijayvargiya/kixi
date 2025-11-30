import React from "react";
import { X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const releases = [
	{
		id: 1,
		image:
			"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
		date: "Nov 29, 2025",
		title: "Multiple Frames & Projects Directory",
		description:
			"Added the ability to create and manage multiple frames within a project, plus an all-projects directory to view and organize all your projects and their frames.",
	},
	{
		id: 2,
		image:
			"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
		date: "Nov 25, 2025",
		title: "Sidebar Improvements",
		description:
			"The sidebar is now collapsible and includes easier access to your projects and settings.",
	},
	{
		id: 3,
		image:
			"https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop",
		date: "Nov 20, 2025",
		title: "React Code Export",
		description:
			"You can now export your designs directly to React code with Tailwind CSS support.",
	},
];

const ReleaseBox = ({ isOpen, onClose }) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm"
						onClick={onClose}
					/>
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ duration: 0.2 }}
						className="relative z-50 w-full max-w-lg bg-white rounded-xl shadow-2xl mx-4 overflow-hidden"
					>
						<button
							onClick={onClose}
							className="absolute top-4 right-4 p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors z-10"
						>
							<X className="w-5 h-5" />
						</button>
						<div className="p-6">
							<div className="flex flex-col max-h-[70vh]">
								{/* Header */}
								<div className="flex items-center gap-2 mb-4">
									<h2 className="text-lg font-semibold text-zinc-900">
										What's New
									</h2>
									<span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full text-xs font-medium">
										{releases.length}
									</span>
								</div>

								{/* Content */}
								<div className="overflow-y-auto space-y-4 pr-2 -mr-2">
									{releases.map((release) => (
										<div
											key={release.id}
											className="flex gap-4 p-3 hover:bg-zinc-50 rounded-xl transition-colors border border-transparent hover:border-zinc-100 group"
										>
											<div className="flex-shrink-0 w-20 h-20 bg-zinc-100 rounded-xl overflow-hidden border border-zinc-100">
												<img
													src={release.image}
													alt={release.title}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											</div>
											<div className="flex flex-col gap-1.5 flex-1 min-w-0 justify-center">
												<div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
													<Calendar className="w-3 h-3" />
													{release.date}
												</div>
												<h3 className="font-semibold text-zinc-900 text-sm truncate">
													{release.title}
												</h3>
												<p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
													{release.description}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default ReleaseBox;
