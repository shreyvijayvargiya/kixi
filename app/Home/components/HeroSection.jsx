import React from "react";
import { ArrowRight, ShieldCheck, Download, Heart } from "lucide-react";
import router from "next/router";

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

const HeroSection = () => {
	return (
		<section
			id="home"
			className="mx-auto flex flex-col items-center justify-center max-w-7xl text-center px-4"
		>
			{/* Product Hunt Badge */}
			<div className="mt-10 flex justify-center w-fit mx-auto">
				<a
					href="https://www.producthunt.com/products/kixi?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-kixi"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=982647&theme=dark&t=1760875867727"
						alt="kixi - React&#0032;&#0038;&#0032;next&#0046;js&#0032;template&#0044;&#0032;Inspiration&#0032;for&#0032;Building&#0032;websites | Product Hunt"
						style={{ width: "fit-content", height: "36px" }}
						className="transition-opacity duration-200 text-xs hover:shadow-xl hover:shadow-zinc-200 hover:border-zinc-200 rounded-xl"
					/>
				</a>
			</div>
			<div className="w-full flex justify-center items-center py-5">
				<div className="flex flex-col justify-center items-center mt-4 gap-2 max-w-3xl mx-auto">
					<span
						onClick={() => router.push("/templates")}
						className="cursor-pointer text-zinc-800 bg-zinc-50/50 hover:bg-zinc-100 py-1 px-4 rounded-full text-xs flex items-center gap-2"
					>
						Press "T" to view all templates
					</span>
					<p className="text-5xl font-semibold">
						Build stunning <b>websites</b> with premium templates
					</p>
					<div className="flex items-center justify-center flex-wrap gap-3 text-sm font-semibold max-w-xl mx-auto my-8">
						<span className="group relative w-fit px-4 py-1 rounded-xl bg-zinc-50 flex justify-center items-center gap-2">
							🚀
							<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-100 text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
								Landing pages
								<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-zinc-800"></div>
							</div>
						</span>
						Ready-to-use Reactjs, Nextjs and Vite code
						<span className="group relative w-fit px-4 py-1 rounded-xl bg-yellow-50 flex justify-center items-center gap-2">
							🔥
							<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-50 text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
								Portfolio Templates
								<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-zinc-800"></div>
							</div>
						</span>
						Built with modern tech stack
						<span className="group relative px-4 py-1 rounded-xl bg-green-50 flex justify-center items-center gap-2">
							<ShieldCheck className="w-5 h-5 text-green-500 " />
							<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-50 text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
								AI Templates
								<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-zinc-800"></div>
							</div>
						</span>
						<span>Production Ready</span>
						<span className="group relative px-4 py-1 rounded-xl bg-blue-50 flex justify-center items-center gap-2">
							<Download className="w-5 h-5 text-blue-500" />
							<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-50 text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
								Content Templates
								<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-zinc-800"></div>
							</div>
						</span>
						<span>Instant Download</span>
						<span className="group relative px-4 py-1 rounded-xl bg-red-50 flex justify-center items-center gap-2">
							<Heart className="w-5 h-5 text-red-500" />
							<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-50 text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
								Payment & Forms
								<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-zinc-800"></div>
							</div>
						</span>
						<span>with latest source code for developers</span>
					</div>
					<div className="flex items-center gap-3 flex-wrap justify-start mt-2">
						<button
							onClick={() => router.push("/templates")}
							className="group inline-flex items-center font-semibold gap-2 bg-zinc-800 text-white px-2 py-2 text-xs rounded-xl hover:bg-black hover:shadow-xl transition-colors shadow-sm"
						>
							<span>Explore Templates</span>
							<ArrowRight className="w-4 h-4 text-zinc-200 group-hover:rotate-180 rotate-0 transition-all group-hover:text-zinc-100 duration-100 ease-in" />
						</button>
						<GoogleLoginButton />
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
