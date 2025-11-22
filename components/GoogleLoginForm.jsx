import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import useGoogleAuth from "../lib/hooks/useGoogleAuth";
import { SlSocialGoogle } from "react-icons/sl";
import { Loader2, X } from "lucide-react";

const GoogleLoginForm = ({ showModal, setShowModal }) => {
	const { signInWithGoogle, isLoading } = useGoogleAuth({
		cb: () => {
			setShowModal(false);
		},
	});
	return (
		<>
			<AnimatePresence>
				{showModal && (
					<div className="fixed inset-0 z-50">
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => {
								setShowModal(false);
							}}
							className="absolute inset-0 bg-black/20 backdrop-blur-sm"
						/>

						{/* Modal Content */}
						<div className="absolute inset-0 flex items-center justify-center">
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 10 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 10 }}
								transition={{ type: "spring", duration: 0.3 }}
								className="relative w-full max-w-md bg-white rounded-xl border border-zinc-200 shadow-xl p-10"
							>
								<button
									onClick={() => setShowModal(false)}
									className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors p-2 rounded-full bg-zinc-100 hover:bg-zinc-200"
								>
									<X className="w-5 h-5" />
								</button>
								<div className="relative text-left mb-10 mt-6">
									<h2 className="text-2xl font-semibold text-zinc-900 mb-2">
										Get started
									</h2>
									<p className="text-zinc-500 text-sm">
										Sign in to get started in one-step
									</p>
								</div>

								<button
									onClick={() =>
										signInWithGoogle({
											cb: () => {
												setShowModal(false);
												// Force a re-render to ensure state updates are reflected
												setTimeout(() => {
													window.location.reload();
												}, 100);
											},
										})
									}
									disabled={isLoading}
									className="w-full flex items-center justify-center gap-2 bg-zinc-50 border border-zinc-900 hover:bg-zinc-800 hover:text-white text-black px-4 py-3 rounded-xl shadow hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

								<p className="text-center text-xs text-zinc-500 mt-4">
									By signing in, you agree to our Terms of Service and Privacy
									Policy
								</p>
							</motion.div>
						</div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
};

export default GoogleLoginForm;
