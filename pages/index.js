import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import FeaturesSectionModal from "../app/Apps/FeaturesSectionModal";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Home() {
	const router = useRouter();
	const { isAuthenticated, user } = useSelector((state) => state.auth);
	const [showFeaturesModal, setShowFeaturesModal] = useState(false);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);

	// Redirect to /app if authenticated
	useEffect(() => {
		// Small delay to ensure redux state is hydrated
		const timer = setTimeout(() => {
			setIsCheckingAuth(false);
			if (isAuthenticated && user) {
				router.push("/app");
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [isAuthenticated, user, router]);

	// Show loading while checking auth
	if (isCheckingAuth) {
		return (
			<div className="min-h-screen bg-stone-50 flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
			</div>
		);
	}

	// If authenticated, show loading while redirecting
	if (isAuthenticated && user) {
		return (
			<div className="min-h-screen bg-stone-50 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-8 h-8 animate-spin text-zinc-400 mx-auto mb-4" />
					<p className="text-zinc-600 text-sm">Redirecting to app...</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<Head>
				<link
					rel="icon"
					href="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYkSFej94aXep3F9GfAyq0Rdi1PvjVE5n8tmCr"
					type="image/png"
				/>
				<title>kixi - creative design app</title>
				<meta
					name="description"
					content="Create beautiful animated gradients with kixi. Generate custom gradient animations for your projects."
				/>
				<meta
					name="keywords"
					content="gradient, animation, generator, kixi, design, tools"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="index, follow" />

				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:title" content="kixi - creative design app" />
				<meta
					property="og:description"
					content="Create beautiful animated gradients with kixi. Generate custom gradient animations for your projects."
				/>
				<meta
					property="og:image"
					content="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYmGOp1T5dTRYUQ1ZJNSXlV8uxqtfcEz9rp62L"
				/>
				<meta property="og:url" content="https://kixi.app" />
				<meta property="og:site_name" content="kixi" />

				{/* Twitter */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="kixi - creative design app" />
				<meta
					name="twitter:description"
					content="Create beautiful animated gradients with kixi. Generate custom gradient animations for your projects."
				/>
				<meta
					name="twitter:image"
					content="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYmGOp1T5dTRYUQ1ZJNSXlV8uxqtfcEz9rp62L"
				/>

				{/* Canonical URL */}
				<link rel="canonical" href="https://kixi.app" />
			</Head>

			<div className="min-h-screen bg-stone-50 relative overflow-hidden">
				{/* Background Pattern */}
				<div
					className="fixed inset-0 opacity-20 pointer-events-none"
					style={{
						backgroundImage:
							"radial-gradient(circle, #d1d5db 1.5px, transparent 1.5px)",
						backgroundSize: "20px 20px",
					}}
				/>

				{/* Animated Gradient Background */}
				<div className="fixed inset-0 pointer-events-none overflow-hidden">
					<motion.div
						animate={{
							scale: [1, 1.2, 1],
							rotate: [0, 180, 360],
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "linear",
						}}
						className="absolute -top-1/2 -left-1/2 w-full h-full opacity-30"
						style={{
							background:
								"radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
						}}
					/>
					<motion.div
						animate={{
							scale: [1.2, 1, 1.2],
							rotate: [360, 180, 0],
						}}
						transition={{
							duration: 25,
							repeat: Infinity,
							ease: "linear",
						}}
						className="absolute -bottom-1/2 -right-1/2 w-full h-full opacity-30"
						style={{
							background:
								"radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
						}}
					/>
				</div>

				{/* Content */}
				<div className="relative z-10 min-h-screen flex flex-col">
					{/* Header */}
					<header className="w-full py-4 px-6">
						<div className="max-w-6xl mx-auto flex items-center justify-between">
							<div className="flex items-center gap-2">
								<img src="./kixi-logo.png" alt="kixi" className="w-10 h-10" />
							</div>
							<GoogleLoginButton
								callBack={() => {
									router.push("/app");
								}}
							/>
						</div>
					</header>

					{/* Hero Section */}
					<main className="flex-1 flex items-center justify-center px-6 py-12">
						<div className="max-w-4xl mx-auto text-center">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
							>
								<div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-full shadow-sm mb-8">
									<Sparkles className="w-4 h-4 text-purple-500" />
									<span className="text-sm text-zinc-600">
										Create stunning designs with ease
									</span>
								</div>
							</motion.div>

							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.1 }}
								className="text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight"
							>
								Design beautiful
								<br />
								<span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
									creatives
								</span>
							</motion.h1>

							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-lg md:text-xl text-zinc-600 mb-10 max-w-2xl mx-auto leading-relaxed"
							>
								Create, customize, and export stunning designs, creatives and posters
								Perfect for websites, apps, and social media content.
							</motion.p>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.3 }}
								className="flex flex-col sm:flex-row items-center justify-center gap-4"
							>
								<GoogleLoginButton
									callBack={() => {
										router.push("/app");
									}}
								/>
								<button
									onClick={() => setShowFeaturesModal(true)}
									className="flex items-center gap-2 px-6 py-3 text-zinc-700 hover:text-zinc-900 hover:bg-white border border-zinc-200 rounded-xl transition-all shadow-sm hover:shadow"
								>
									<Sparkles className="w-4 h-4" />
									See Features
								</button>
							</motion.div>
						</div>
					</main>

					{/* Preview Section */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="w-full max-w-5xl mx-auto px-6 pb-12"
					>
						<div className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-2xl bg-white">
							<div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10" />
							<div className="relative p-1">
								<div
									className="w-full aspect-video rounded-xl"
									style={{
										background:
											"linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
										backgroundSize: "200% 200%",
										animation: "gradientShift 8s ease infinite",
									}}
								/>
							</div>
						</div>
					</motion.div>

					{/* Footer */}
					<footer className="w-full py-6 px-6 border-t border-zinc-200 bg-white/50 backdrop-blur-sm">
						<div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
							<div className="flex items-center gap-2">
								<img src="./kixi-logo.png" alt="kixi" className="w-6 h-6" />
								<span className="text-sm text-zinc-500">
									© 2024 kixi. All rights reserved.
								</span>
							</div>
							<div className="flex items-center gap-6">
								<button
									onClick={() => setShowFeaturesModal(true)}
									className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
								>
									Features
								</button>
								<a
									href="/pricing"
									className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
								>
									Pricing
								</a>
								<a
									href="/blogs"
									className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
								>
									Blog
								</a>
							</div>
						</div>
					</footer>
				</div>

				{/* Features Modal */}
				<FeaturesSectionModal
					isOpen={showFeaturesModal}
					onClose={() => setShowFeaturesModal(false)}
				/>
			</div>

			{/* CSS Animation for gradient preview */}
			<style jsx global>{`
				@keyframes gradientShift {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}
			`}</style>
		</>
	);
}
