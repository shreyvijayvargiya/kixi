import GoogleLoginButton from "../components/GoogleLoginButton";
import Head from "next/head";
import { motion } from "framer-motion";
import { templates } from "../app/PortfolioTemplates";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const LoginPage = () => {
	// Get first 10 templates for the sidebar
	const sidebarTemplates = templates.slice(0, 10);
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);


	return (
		<>
			<Head>
				<title>Login - GetTemplate</title>
				<meta
					name="description"
					content="Sign in to GetTemplate to access templates and source code"
				/>
			</Head>

			<div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex">
				{/* Left Sidebar with Templates */}
				<div className="w-80 bg-white border-r border-zinc-200 p-6 overflow-hidden">
					<motion.div
						initial={{ x: 0 }}
						animate={{ x: -1000 }}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "linear",
						}}
						className="flex gap-6"
					>
						{/* First set of templates */}
						{sidebarTemplates.map((template, index) => (
							<motion.div
								key={`first-${template.id}`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="flex-shrink-0 w-64 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
							>
								<div className="aspect-video bg-zinc-100 relative">
									<div className="absolute inset-0 scale-[1] origin-top-left">
										<template.component />
									</div>
								</div>
								<div className="h-32 bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-lg mb-3 flex items-center justify-center">
									<span className="text-zinc-500 text-sm font-medium">
										{template.name}
									</span>
								</div>
								<h3 className="font-semibold text-zinc-900 text-sm mb-2 group-hover:text-zinc-700 transition-colors">
									{template.name}
								</h3>
								<p className="text-xs text-zinc-600 line-clamp-2">
									{template.description}
								</p>
								<div className="mt-3">
									<span className="inline-block px-2 py-1 bg-zinc-200 text-zinc-700 text-xs rounded-full capitalize">
										{template.category}
									</span>
								</div>
							</motion.div>
						))}

						{/* Duplicate set for seamless loop */}
						{sidebarTemplates.map((template, index) => (
							<motion.div
								key={`second-${template.id}`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="flex-shrink-0 w-64 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
							>
								<div className="aspect-video bg-zinc-100 relative">
									<div className="absolute inset-0 scale-[1] origin-top-left">
										<template.component />
									</div>
								</div>
								<div className="h-32 bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-lg mb-3 flex items-center justify-center">
									<span className="text-zinc-500 text-sm font-medium">
										{template.name}
									</span>
								</div>
								<h3 className="font-semibold text-zinc-900 text-sm mb-2 group-hover:text-zinc-700 transition-colors">
									{template.name}
								</h3>
								<p className="text-xs text-zinc-600 line-clamp-2">
									{template.description}
								</p>
								<div className="mt-3">
									<span className="inline-block px-2 py-1 bg-zinc-200 text-zinc-700 text-xs rounded-full capitalize">
										{template.category}
									</span>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>

				{/* Main Content Area */}
				<div className="flex-1 flex items-center justify-center p-8">
					<GoogleLoginButton />
				</div>
			</div>
		</>
	);
};

export default LoginPage;
