import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { setChangelogViewed } from "../redux/slices/changelogSlice";
import Navbar from "../modules/Navbar";

const changelogData = [
	{
		id: uuidv4(),
		title: "New Paynex Hero Section",
		name: "Paynex Hero Section",
		description: "Added a new Paynex hero section with smooth animations.",
		link: "/template/paynex-hero-section",
		date: "2025-11-04",
		category: "hero",
		isNew: true,
	},
	{
		id: uuidv4(),
		title: "New Planzee Hero Section",
		name: "Planzee Hero Section",
		description: "Added a new Planzee hero section with smooth animations.",
		link: "/template/planzee-hero-section",
		date: "2025-11-02",
		category: "hero",
		isNew: true,
	},
	{
		id: uuidv4(),
		title: "New Rotating Clock Template",
		name: "Rotating Clock",
		description: "Added a new rotating clock template with smooth animations.",
		link: "/template/rotating-clock",
		date: "2025-10-31",
		category: "animations",
	},
	{
		id: uuidv4(),
		title: "New Cloth Studio Template",
		name: "Cloth Studio",
		description:
			"Added a new circular clothes studio template with smooth animations.",
		link: "/template/Cloth-Studio",
		date: "2025-10-24",
		category: "ecommerce",
	},
	{
		id: uuidv4(),
		title: "New Darky Clothes Commerce Template",
		name: "Darky Clothes Commerce",
		description:
			"Added a new ecommerce template with a modern design and smooth animations.",
		link: "/template/Darky-Clothes-Commerce",
		date: "2025-10-22",
		category: "ecommerce",
	},
	{
		id: uuidv4(),
		title: "New Platform Landing Page",
		name: "PlatformLandingPage",
		description:
			"Added a modern platform landing section with bordered layout, crosshair markers, and writer-focused messaging. Features gradient background, dashed borders, and professional design elements.",
		link: "/template/Platform-Landing-Page",
		date: "2025-01-15",
		category: "hero",
	},
	{
		id: uuidv4(),
		title: "2 new galleries templates",
		name: "Animation Gallery templates",
		description: "2 new Animations categories galleries templates added",
		links: [
			{
				text: "Dark Inset Gallery",
				url: "/template/Dark-Image-Masonary-Gallery",
			},
			{
				text: "Horizontal Grid Gallery",
				url: "/template/Horizontal-Grid-Gallery",
			},
		],
		date: "2025-10-11",
		category: "animations",
	},
	{
		id: 1,
		title: "New Login Form Template",
		name: "OneDay Login Form",
		description:
			"Added a modern login form with GSAP animations, testimonial cards, and user avatars. Features smooth card stack animations and glassmorphism design.",
		image:
			"/api/og-image?title=OneDay%20Login%20Form&description=Modern%20login%20form%20with%20animations",
		link: "/template/One-Day-Login-Form",
		date: "2024-01-15",
		category: "onboarding",
	},
	{
		id: 2,
		title: "Enhanced Portfolio Templates",
		name: "Modern Developer Portfolio",
		description:
			"Updated portfolio templates with better animations, improved responsive design, and new dark theme options.",
		image:
			"/api/og-image?title=Modern%20Developer%20Portfolio&description=Enhanced%20portfolio%20templates",
		link: "/template/Modern-Developer-Portfolio",
		date: "2024-01-10",
		category: "portfolio",
	},
	{
		id: 3,
		title: "Payment Integration Updates",
		name: "Google Pay Checkout",
		description:
			"Added new payment templates including Google Pay, PhonePe, and UPI checkout forms with modern UI design.",
		image:
			"/api/og-image?title=Google%20Pay%20Checkout&description=Modern%20payment%20integration",
		link: "/template/Google-Pay-Checkout",
		date: "2024-01-05",
		category: "payment",
	},
];

// Latest changelog ID - should match the one in Navbar.jsx
const LATEST_CHANGELOG_ID = "changelog-2025-11-1";

const ChangelogPage = () => {
	const dispatch = useDispatch();

	// Mark changelog as viewed when page loads
	useEffect(() => {
		dispatch(setChangelogViewed(LATEST_CHANGELOG_ID));
	}, [dispatch]);

	const generateMetadata = () => {
		return {
			title: `Changelog - gettemplate`,
			description:
				"Stay updated with the latest features, improvements, and new templates added to our collection",
			keywords: `changelog, updates, new features, templates, react, next, tailwind`,
			openGraph: {
				title: `Changelog - gettemplate`,
				description:
					"Stay updated with the latest features, improvements, and new templates added to our collection",
				url: `https://gettemplate.website/changelog`,
				siteName: "gettemplate.website",
				images: [
					{
						url: "https://gettemplate.website/logo.png",
						width: 1200,
						height: 630,
						alt: `gettemplate changelog`,
					},
				],
				locale: "en_US",
				type: "website",
			},
			twitter: {
				card: "summary_large_image",
				title: `Changelog - gettemplate`,
				description:
					"Stay updated with the latest features, improvements, and new templates added to our collection",
				images: ["https://gettemplate.website/logo.png"],
				creator: "@treyvijay",
				site: "@treyvijay",
			},
			robots: {
				index: true,
				follow: true,
			},
			viewport: "width=device-width, initial-scale=1",
			themeColor: "#ffffff",
		};
	};

	const metadata = generateMetadata();

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getCategoryColor = (category) => {
		const colors = {
			onboarding: "bg-blue-100 text-blue-800 border-blue-200",
			portfolio: "bg-purple-100 text-purple-800 border-purple-200",
			payment: "bg-green-100 text-green-800 border-green-200",
			landing: "bg-orange-100 text-orange-800 border-orange-200",
			forms: "bg-pink-100 text-pink-800 border-pink-200",
			tables: "bg-indigo-100 text-indigo-800 border-indigo-200",
			animations: "bg-yellow-100 text-yellow-800 border-yellow-200",
			content: "bg-gray-100 text-gray-800 border-gray-200",
			ai: "bg-red-100 text-red-800 border-red-200",
			hero: "bg-teal-100 text-teal-800 border-teal-200",
		};
		return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
	};

	return (
		<>
			<Head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
				<meta name="keywords" content={metadata.keywords} />
				<meta name="viewport" content={metadata.viewport} />
				<meta name="theme-color" content={metadata.themeColor} />
				<meta name="robots" content="index, follow" />

				{/* Open Graph */}
				<meta property="og:type" content={metadata.openGraph.type} />
				<meta property="og:url" content={metadata.openGraph.url} />
				<meta property="og:title" content={metadata.openGraph.title} />
				<meta
					property="og:description"
					content={metadata.openGraph.description}
				/>
				<meta property="og:image" content={metadata.openGraph.images[0].url} />
				<meta property="og:site_name" content={metadata.openGraph.siteName} />
				<meta property="og:locale" content={metadata.openGraph.locale} />

				{/* Twitter Card */}
				<meta name="twitter:card" content={metadata.twitter.card} />
				<meta name="twitter:site" content={metadata.twitter.site} />
				<meta name="twitter:creator" content={metadata.twitter.creator} />
				<meta name="twitter:title" content={metadata.twitter.title} />
				<meta name="twitter:image" content={metadata.twitter.images[0]} />
				<meta
					name="twitter:description"
					content={metadata.twitter.description}
				/>

				{/* Canonical URL */}
				<link rel="canonical" href={metadata.openGraph.url} />

				{/* Favicon */}
				<link
					rel="icon"
					type="image/png"
					href="https://gettemplate.website/logo.png"
				/>
			</Head>
			<div className="">
				<Navbar />

				<div className="flex max-w-7xl mx-auto pt-16 border-l border-r border-dashed border-zinc-200">
					{/* Main Content */}
					<main className="w-full p-6 z-0">
						<div className="min-h-screen overflow-hidden">
							<div className="max-w-2xl mx-auto px-4 py-8">
								{/* Header */}
								<div className="text-left mb-8 w-full">
									<h1 className="text-2xl font-bold text-zinc-900 mb-2">
										Changelog
									</h1>
									<p className="text-zinc-600 text-sm mb-4">
										Stay updated with the latest features, improvements, and new
										templates added to our collection
									</p>
								</div>

								{/* Timeline Items */}
								<div className="space-y-8">
									{changelogData.map((item, index) => (
										<motion.div
											key={item.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.5, delay: index * 0.1 }}
											className="bg-white rounded-xl border border-zinc-200 border-dashed overflow-hidden transition-all duration-300 hover:shadow-lg"
										>
											{/* Content */}
											<div className="p-6">
												{/* Title and Name */}
												<div className="mb-4">
													<h2 className="text-2xl font-bold text-zinc-900 mb-2">
														{item.title}
													</h2>
													<h3 className="text-lg font-semibold text-zinc-700">
														{item.name}
													</h3>
												</div>

												{/* Description */}
												<p className="text-zinc-600 mb-6 leading-relaxed">
													{item.description}
												</p>

												{/* Links */}
												{item.link && (
													<div className="flex justify-start">
														<a
															href={item.link}
															rel="noopener noreferrer"
															className="inline-flex items-center rounded-xl gap-2 px-4 py-1.5 border border-dashed border-zinc-200 hover:bg-zinc-100 bg-zinc-50 transition-all duration-300 text-sm font-medium"
														>
															<ExternalLink className="w-3 h-3" />
															View Template
														</a>
													</div>
												)}
												{item.links && (
													<div className="flex flex-wrap gap-3 justify-start">
														{item.links.map((linkItem, linkIndex) => (
															<a
																key={linkIndex}
																href={linkItem.url}
																target="_blank"
																rel="noopener noreferrer"
																className="inline-flex items-center rounded-xl gap-2 px-4 py-2 border border-dashed border-zinc-200 hover:bg-zinc-100 bg-zinc-50 transition-all duration-300 text-sm font-medium"
															>
																<ExternalLink className="w-3 h-3" />
																{linkItem.text}
															</a>
														))}
													</div>
												)}
											</div>

											{/* Timeline Header */}
											<div className="px-6 py-2 border-t border-zinc-100">
												<div className="flex items-start justify-between">
													{/* Left Side - Date and Category */}
													<div className="flex items-center gap-4">
														<div className="flex items-center gap-2 text-zinc-500">
															<Calendar className="w-4 h-4" />
															<span className="text-sm font-medium">
																{formatDate(item.date)}
															</span>
														</div>
														<div className="flex items-center gap-2">
															<Tag className="w-4 h-4 text-zinc-400" />
															<span
																className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
																	item.category
																)}`}
															>
																{item.category}
															</span>
														</div>
													</div>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</div>
						</div>
					</main>
				</div>

				{/* Footer */}
				<footer className="py-2 px-8 *:border-t border-dashed border-zinc-200 w-full">
					<div className="mx-auto flex flex-col md:flex-row max-w-7xl justify-between items-start md:items-center p-10 bg-white border-l border-r border-zinc-200 border-dashed">
						<div className="flex flex-col gap-4">
							<div>
								<p className="text-2xl text-black font-medium">gettemplate</p>
								<p className="text-zinc-500 text-sm">
									Discover real world websites code samples
								</p>
							</div>
							<div className="flex flex-col gap-2">
								<a
									href="/templates"
									className="text-zinc-500 hover:text-zinc-800 text-sm"
								>
									Templates
								</a>
								<a
									href="mailto:connect@ihatereading.in"
									className="text-zinc-500 hover:text-zinc-800 text-sm"
								>
									Contact Us
								</a>
							</div>
						</div>
						<div className="flex flex-col gap-4 mt-6 md:mt-0">
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
							<p className="text-zinc-400 text-sm">
								© 2024 gettemplate. All rights reserved.
							</p>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
};

export default ChangelogPage;
