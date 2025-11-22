import React from "react";
import { Twitter, Github, Mail } from "lucide-react";
import router from "next/router";

const Footer = () => {
	return (
		<footer className="mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-t border-zinc-100 border-dashed">
			<div className="flex items-center justify-between w-full mx-auto max-w-7xl p-10 border-l border-r border-zinc-100 border-dashed">
				<div className="flex flex-col gap-4">
					<div>
						<p className="text-lg text-black font-medium">gettemplate</p>
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
						<div className="flex items-center gap-3 mt-2">
							<a
								href="https://twitter.com/treyvijay"
								target="_blank"
								rel="noopener noreferrer"
								className="text-zinc-600 hover:text-zinc-900 transition-colors"
								aria-label="Twitter"
							>
								<Twitter className="w-4 h-4" />
							</a>
							<a
								href="mailto:connect@ihatereading.in"
								className="text-zinc-600 hover:text-zinc-900 transition-colors"
								aria-label="Email"
							>
								<Mail className="w-4 h-4" />
							</a>
						</div>
						<p className="text-zinc-400 ">
							© 2025 gettemplate. All rights reserved.
						</p>
					</div>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-8">
					{/* Links Column */}
					<div className="flex flex-col gap-2 text-xs">
						<h4 className="font-semibold text-zinc-900 mb-2">Links</h4>
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
							href="/connect"
							className="text-zinc-600 hover:text-zinc-900 transition-colors"
						>
							Connect
						</a>
					</div>
					{/* Pricing Column */}
					<div className="flex flex-col gap-2 text-xs">
						<h4 className="font-semibold text-zinc-900 mb-2">Pricing</h4>
						<button
							onClick={() => router.push("/pricing")}
							className="text-left text-zinc-600 hover:text-zinc-900 transition-colors"
						>
							View Pricing
						</button>
						<a
							href="/pricing#free"
							className="text-zinc-600 hover:text-zinc-900 transition-colors"
						>
							Free Plan
						</a>
						<a
							href="/pricing#pro"
							className="text-zinc-600 hover:text-zinc-900 transition-colors"
						>
							PRO Plan
						</a>
					</div>
					{/* Social Column */}
					<div className="flex flex-col gap-2 text-xs">
						<h4 className="font-semibold text-zinc-900 mb-2">Social</h4>
						<a
							href="https://twitter.com/treyvijay"
							target="_blank"
							rel="noopener noreferrer"
							className="text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-2"
						>
							<Twitter className="w-4 h-4" />
							Twitter
						</a>
						<a
							href="mailto:connect@ihatereading.in"
							className="text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-2"
						>
							<Mail className="w-4 h-4" />
							Email
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
