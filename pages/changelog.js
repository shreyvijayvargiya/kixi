import React from "react";
import Navbar from "../modules/Navbar";
import { releases } from "../components/ReleaseBox";
import { Calendar } from "lucide-react";
import Head from "next/head";

const ChangelogPage = () => {
	return (
		<div className="min-h-screen bg-stone-50/20">
			<Head>
				<title>Changelog - kixi</title>
				<meta
					name="description"
					content="Latest updates, improvements, and fixes for kixi."
				/>
			</Head>
			<div className="max-w-7xl mx-auto p-4 border-l border-r border-dashed border-zinc-200 px-4 min-h-screen">
				<Navbar />
				<div className="pt-24 max-w-3xl mx-auto">
					<div className="mb-12 text-center">
						<h1 className="text-4xl font-bold text-zinc-900 mb-4">Changelog</h1>
						<p className="text-zinc-600">
							Stay up to date with the latest improvements and features.
						</p>
					</div>

					<div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
						{releases.map((release) => (
							<div
								key={release.id}
								className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
							>
								{/* Icon */}
								<div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-zinc-900 text-slate-500 group-[.is-active]:text-zinc-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
									<Calendar className="w-5 h-5" />
								</div>
								{/* Card */}
								<div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
									<div className="flex flex-col gap-4">
										{release.image && (
											<div className="w-full h-48 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-100">
												<img
													src={release.image}
													alt={release.title}
													className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
												/>
											</div>
										)}
										<div className="flex flex-col gap-2">
											<time className="font-mono text-xs text-zinc-500 mb-1">
												{release.date}
											</time>
											<h3 className="text-lg font-bold text-zinc-900">
												{release.title}
											</h3>
											<p className="text-zinc-600 text-sm leading-relaxed">
												{release.description}
											</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<footer className="mt-24 mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-t border-zinc-200 border-dashed pt-10 pb-10">
					<div className="flex items-center justify-between w-full">
						<div className="flex flex-col gap-4">
							<div>
								<p className="text-lg text-black font-medium">kixi</p>
								<p className="text-zinc-500 text-xs">
									Discover real world websites code samples
								</p>
							</div>

							<div className="flex flex-col gap-4 mt-6 md:mt-0 text-xs">
								<div className="flex items-center gap-2">
									<span className="text-zinc-500">Made with ❤️ by</span>
									<a
										href="https://ihatereading.in"
										className="text-zinc-800 hover:text-zinc-600 font-medium"
										target="_blank"
										rel="noopener noreferrer"
									>
										iHateReading
									</a>
								</div>
								<p className="text-zinc-400 ">
									© 2025 kixi. All rights reserved.
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 text-xs text-right">
							<a
								href="/templates"
								className="text-zinc-600 hover:text-zinc-900 transition-colors"
							>
								Templates
							</a>
							<a
								href="/premium-templates"
								className="text-zinc-600 hover:text-zinc-900 transition-colors"
							>
								Premium Templates
							</a>
							<a
								href="/blogs"
								className="text-zinc-600 hover:text-zinc-900 transition-colors"
							>
								Blogs
							</a>
							<a
								href="/changelog"
								className="text-zinc-600 hover:text-zinc-900 transition-colors"
							>
								Changelog
							</a>
							<a
								href="mailto:connect@ihatereading.in"
								className="text-zinc-600 hover:text-zinc-900 transition-colors"
							>
								Contact Us
							</a>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
};

export default ChangelogPage;

