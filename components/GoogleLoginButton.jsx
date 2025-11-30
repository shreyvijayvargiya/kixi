import { useState, useRef, useEffect } from "react";
import useGoogleAuth from "../lib/hooks/useGoogleAuth";
import { Loader2, X, LogOut, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { SlSocialGoogle } from "react-icons/sl";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { logout } from "../redux/slices/authSlice";
import { deleteCookie } from "cookies-next";

const GoogleLoginButton = ({ callBack, show, hideUserName }) => {
	const { signInWithGoogle, signOut, isLoading, error } = useGoogleAuth({
		cb: callBack,
	});

	const { user, isAuthenticated } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const [showModal, setShowModal] = useState(
		show && show !== undefined ? show : false
	);
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const router = useRouter();

	// Handle click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};

		if (showDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showDropdown]);

	const handleLogout = async () => {
		try {
			await signOut();
			deleteCookie("userId");
			deleteCookie("userData");
			dispatch(logout());
			toast.success("Logged out successfully");
			setShowDropdown(false);
			router.push("/");
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Error signing out");
		}
	};

	// Handle error from Google auth
	if (error) {
		toast.error("Error in google login");
		console.error("Login error:", error);
	}

	// Show avatar and dropdown if user is authenticated
	if (isAuthenticated && user) {
		return (
			<div className="relative" ref={dropdownRef}>
				<button
					onClick={() => setShowDropdown(!showDropdown)}
					className="group flex items-center gap-2 hover:bg-zinc-100 border border-zinc-200 text-black px-2 py-1 rounded-xl transition-colors"
				>
					{user?.photoURL ? (
						<img
							src={user.photoURL}
							alt={user.displayName}
							className="w-6 h-6 rounded-xl translate-x-0 transition-all duration-300 ease-in"
						/>
					) : (
						<div className="w-6 h-6 md:flex items-center justify-center hidden bg-zinc-200 rounded-xl">
							<span className="text-xs font-medium">
								{user?.displayName?.[0]?.toUpperCase() ||
									user?.email?.[0]?.toUpperCase()}
							</span>
						</div>
					)}
					{!hideUserName && (
						<span className="text-xs hidden sm:inline-block">
							{user?.displayName || user?.email}
						</span>
					)}
				</button>

				{/* Dropdown Menu */}
				<AnimatePresence>
					{showDropdown && (
						<motion.div
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -10, scale: 0.95 }}
							transition={{ duration: 0.2 }}
							className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-zinc-200 z-50 overflow-hidden"
						>
							{/* User Info Section */}
							<div className="p-4 border-b border-zinc-100">
								<div className="flex items-center gap-3">
									{user?.photoURL ? (
										<img
											src={user.photoURL}
											alt={user.displayName}
											className="w-10 h-10 rounded-xl"
										/>
									) : (
										<div className="w-10 h-10 bg-zinc-200 rounded-xl flex items-center justify-center">
											<span className="text-sm font-medium text-zinc-700">
												{user?.displayName?.[0]?.toUpperCase() ||
													user?.email?.[0]?.toUpperCase()}
											</span>
										</div>
									)}
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold text-zinc-900 truncate">
											{user?.displayName || "User"}
										</p>
										<p className="text-xs text-zinc-500 truncate">
											{user?.email}
										</p>
									</div>
								</div>
							</div>

							{/* Menu Items */}
							<div className="py-1">
								<button
									onClick={() => {
										setShowDropdown(false);
										router.push("/account");
									}}
									className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
								>
									<User className="w-4 h-4" />
									Account Settings
								</button>
								<button
									onClick={handleLogout}
									className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
								>
									<LogOut className="w-4 h-4" />
									Logout
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	}

	// Show login button if not authenticated
	return (
		<>
			<button
				onClick={() => setShowModal(true)}
				className="flex items-center justify-center gap-2 hover:bg-zinc-900 bg-white border border-zinc-200 hover:border-zinc-900 hover:shadow-xl hover:text-white text-black px-3 py-2 transition-all duration-200 rounded-xl text-xs group"
			>
				<SlSocialGoogle className="group-hover:rotate-180 transition-all duration-200 ease-in" />
				Get Started
			</button>

			{/* Login Modal */}
			<AnimatePresence>
				{showModal && (
					<div
						className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
						style={{
							backgroundColor: "rgba(250, 250, 248, 0.95)",
							backdropFilter: "blur(6px)",
						}}
					>
						<div
							className="absolute inset-0 opacity-20 pointer-events-none"
							style={{
								backgroundImage:
									"radial-gradient(circle, rgba(0, 0, 0, 0.1) 1.5px, transparent 1.5px)",
								backgroundSize: "20px 20px",
							}}
						/>
						{/* Modal Content */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 10 }}
							transition={{ type: "spring", duration: 0.3 }}
							className="relative w-full max-w-xl ring ring-zinc-100 shadow-2xl shadow-zinc-200 bg-white rounded-2xl z-[10000] overflow-hidden"
						>
							<button
								onClick={() => setShowModal(false)}
								className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors p-2  hover:bg-zinc-100 z-20 rounded-xl"
							>
								<X className="w-5 h-5" />
							</button>
							<div className="grid grid-cols-1 lg:grid-cols-1 min-h-[600px]">
								{/* Right Side - Login Form */}
								<div className="p-12 flex flex-col justify-center">
									<motion.div
										initial={{ opacity: 0, x: -30 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.6, delay: 0.2 }}
										className="text-center lg:text-left"
									>
										<motion.img
											className="w-10 h-10"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.6, delay: 0.3 }}
											src="./kixi-logo.png"
											alt="kixi"
										/>
										<motion.p
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.6, delay: 0.4 }}
											className="text-lg text-zinc-600 mb-8 leading-relaxed"
										>
											Create stunning designs with ease
										</motion.p>
									</motion.div>
									<motion.div
										initial={{ opacity: 0, x: 30 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.6, delay: 0.3 }}
										className="w-full"
									>
										<div className="text-left mb-8">
											<motion.h3
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5, delay: 0.5 }}
												className="text-xl text-zinc-900 mb-2"
											>
												Get Started
											</motion.h3>
											<motion.p
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5, delay: 0.6 }}
												className="text-zinc-600 text-sm"
											>
												Sign in to get started in one-step
											</motion.p>
										</div>

										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.6, delay: 0.7 }}
										>
											<button
												onClick={() =>
													signInWithGoogle({
														cb: () => {
															setShowModal(false);
															// Redirect to /app after login
															setTimeout(() => {
																router.push("/app");
															}, 100);
														},
													})
												}
												disabled={isLoading}
												className="w-full flex items-center rounded-xl justify-center bg-stone-100 gap-2 border border-zinc-900 hover:bg-zinc-800 hover:text-white text-black px-4 py-3 hover:shadow-xl  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{isLoading ? (
													<Loader2 className="w-5 h-5 animate-spin" />
												) : (
													<>
														<SlSocialGoogle className="w-5 h-5" />
														Sign in with Google
													</>
												)}
											</button>
										</motion.div>

										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.6, delay: 0.8 }}
											className="mt-6 text-center"
										>
											<p className="text-xs text-zinc-500">
												By signing in, you agree to our Terms of Service and
												Privacy Policy
											</p>
										</motion.div>
									</motion.div>
								</div>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
};

export default GoogleLoginButton;
