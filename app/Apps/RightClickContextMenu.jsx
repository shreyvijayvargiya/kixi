import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RightClickContextMenu = ({ isOpen, position, onClose, items = [] }) => {
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				onClose();
			}
		};

		const handleEscape = (event) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen || !position) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={menuRef}
					initial={{ opacity: 0, scale: 0.95, y: -10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: -10 }}
					transition={{ duration: 0.15 }}
					className="fixed z-[9999] bg-white border border-zinc-200 rounded-xl shadow-xl py-1 min-w-[180px]"
					style={{
						left: `${position.x}px`,
						top: `${position.y}px`,
					}}
					onContextMenu={(e) => e.preventDefault()}
				>
					{items.length === 0 ? (
						<div className="px-3 py-2 text-xs text-zinc-500">
							No actions available
						</div>
					) : (
						items.map((item, index) => {
							if (item.divider) {
								return (
									<div
										key={`divider-${index}`}
										className="my-1 border-t border-zinc-200"
									/>
								);
							}

							return (
								<button
									key={index}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										if (item.onClick) {
											item.onClick();
										}
										onClose();
									}}
									disabled={item.disabled}
									className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 transition-colors ${
										item.disabled
											? "text-zinc-400 cursor-not-allowed"
											: item.danger
												? "text-red-600 hover:bg-red-50"
												: "text-zinc-700 hover:bg-zinc-50"
									}`}
								>
									{item.icon && <item.icon className="w-3.5 h-3.5" />}
									<span>{item.label}</span>
									{item.shortcut && (
										<span className="ml-auto text-zinc-400 text-[10px]">
											{item.shortcut}
										</span>
									)}
								</button>
							);
						})
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default RightClickContextMenu;
