import React, { useState } from "react";
import { X, Menu } from "lucide-react";
import router from "next/router";
import { BiMoney } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";

// GoogleLoginButton component
const GoogleLoginButton = () => {
	return (
		<button className="flex items-center gap-2 font-semibold text-zinc-600 text-xs hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100 transition-colors">
			<svg
				className="w-4 h-4"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					fill="#4285F4"
				/>
				<path
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					fill="#34A853"
				/>
				<path
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					fill="#FBBC05"
				/>
				<path
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					fill="#EA4335"
				/>
			</svg>
			Sign in
		</button>
	);
};

const Header = ({ onRequestTemplate }) => {
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [activeSection, setActiveSection] = useState("home");

	const sections = [
		{ id: "home", label: "Home" },
		{ id: "templates", label: "Categories" },
		{ id: "how-it-works", label: "How it Works" },
		{ id: "tech-stack", label: "Tech Stack" },
		{ id: "faq", label: "FAQ" },
	].filter((section) => section && section.id && section.label);

	const handleSectionClick = (sectionId) => {
		if (!sectionId || typeof sectionId !== "string") {
			console.warn(
				"Invalid sectionId provided to handleSectionClick:",
				sectionId
			);
			return;
		}

		setActiveSection(sectionId);
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		} else {
			console.warn("Element not found for sectionId:", sectionId);
		}
	};

	return (
		<nav className="fixed top-0 left-0 right-0 px-6 z-40 backdrop-blur-md">
			<div className="flex items-center justify-between w-full mx-auto text-xs max-w-7xl px-4 py-1">
				<div className="flex items-center">
					<div
						className="cursor-pointer hover:bg-zinc-100 rounded-xl p-1.5"
						onClick={() => router.push("/")}
					>
						<img src="/kixi-logo" alt="kixi" className="w-8 h-8" />
					</div>

					<div className="items-center gap-1 lg:flex hidden">
						<a
							href="/templates"
							className="text-xs font-semibold transition-colors text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100"
						>
							Templates
						</a>
						<a
							href="/blogs"
							className="text-xs font-semibold transition-colors text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100"
						>
							Blogs
						</a>
						<a
							href="/premium-templates"
							className="text-xs font-semibold transition-colors text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100"
						>
							Premium Templates
						</a>{" "}
					</div>
				</div>
				<div className="lg:hidden block">
					{showMobileMenu ? (
						<X
							onClick={() => setShowMobileMenu(false)}
							className="group-hover:rotate-180 transition-all duration-100 ease-in"
							size={16}
						/>
					) : (
						<Menu
							onClick={() => setShowMobileMenu(true)}
							className="group-hover:rotate-180 transition-all duration-100 ease-in"
							size={16}
						/>
					)}
				</div>
				<div className="items-center gap-2 lg:flex hidden text-xs">
					<a
						href="#changelog"
						className="relative flex gap-2 text-xs border border-pink-200 font-semibold items-center text-pink-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-pink-100"
					>
						<span className="p-1 rounded-full animate-pulse bg-pink-400 w-2 h-2 ring-2 ring-pink-100"></span>
						Releases
					</a>
					<button className="flex items-center gap-2 font-semibold text-zinc-600 text-xs hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100">
						Request Template
					</button>
					<a
						href="https://shreyvijayvargiya.gumroad.com/l/react-templates-bundle"
						target="_blank"
						rel="noopener noreferrer"
					>
						<button className="flex gap-2 items-center group font-semibold hover:shadow-xl relative justify-center overflow-hidden rounded-xl bg-zinc-800 px-3 py-2 text-white duration-300 hover:bg-black text-xs">
							<BiMoney className="w-4 h-4 text-zinc-200 group-hover:text-zinc-100 group-hover:rotate-180 rotate-0 duration-100 ease-in" />
							Buy bundle
						</button>
					</a>
					<GoogleLoginButton />
				</div>
			</div>

			{/* Mobile Menu Dropdown */}
			<AnimatePresence>
				{showMobileMenu && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className="md:hidden fixed inset-x-0 top-[72px] bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-lg z-50"
					>
						<div className="container mx-auto px-6 py-6">
							<div className="flex flex-col space-y-2">
								{/* Navigation Links */}
								<div className="flex flex-col space-y-1">
									{sections.map((section) => (
										<motion.button
											key={section.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.1 }}
											onClick={() => {
												if (section?.id) {
													handleSectionClick(section.id);
													setShowMobileMenu(false);
												}
											}}
											className={`text-left font-medium transition-colors px-3 py-2 rounded-xl ${
												activeSection === section.id
													? "text-zinc-900 bg-zinc-100"
													: "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
											}`}
										>
											{section.label}
										</motion.button>
									))}
								</div>

								{/* Auth & Subscription Section */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2 }}
									className="flex flex-col space-y-2 pt-4 border-t border-zinc-200"
								>
									<button
										className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 px-2 py-1.5 rounded-xl hover:bg-zinc-100"
										onClick={() => onRequestTemplate && onRequestTemplate()}
									>
										Request Template
									</button>
									<div className="w-full">
										<GoogleLoginButton />
									</div>
								</motion.div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default Header;
