import { addDoc, collection } from "firebase/firestore";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../lib/firebase";
import Head from "next/head";
import { useRouter } from "next/router";
import { sendMessageEmail } from "../lib/sendMessageEmail";
import Navbar from "../modules/Navbar";

const ConnectPage = () => {
	const generateMetadata = () => {
		return {
			title: `Premium Templates - kixi`,
			description:
				"Discover our collection of professionally designed, production-ready premium templates",
			keywords: `premium templates, react, next, tailwind, portfolio, landing page, web development`,
			openGraph: {
				title: `Premium Templates - kixi`,
				description:
					"Discover our collection of professionally designed, production-ready premium templates",
				url: `https://kixi.app/premium-templates`,
				siteName: "kixi.app",
				images: [
					{
						url: "https://kixi.app/kixi-logo",
						width: 1200,
						height: 630,
						alt: `kixi premium templates`,
					},
				],
				locale: "en_US",
				type: "website",
			},
			twitter: {
				card: "summary_large_image",
				title: `Premium Templates - kixi`,
				description:
					"Discover our collection of professionally designed, production-ready premium templates",
				images: ["https://kixi.app/kixi-logo"],
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
	const router = useRouter();
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const templateCategories = [
		{ value: "landing-pages", label: "Landing Pages" },
		{ value: "saas-apps", label: "SaaS Apps" },
		{ value: "ai-apps", label: "AI Apps" },
		{ value: "e-commerce", label: "E-commerce" },
		{ value: "docs", label: "Docs" },
		{ value: "content-management", label: "Content Management" },
		{ value: "crm", label: "CRM" },
		{ value: "erp", label: "ERP" },
		{ value: "chat-apps", label: "Chat Apps" },
		{ value: "finance-dashboards", label: "Finance Dashboards" },
	];
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [feedback, setFeedback] = useState({
		loading: false,
		name: "",
		templateCategory: "",
		message: "",
	});

	const handleSubmitFeedback = async () => {
		setFeedback({ ...feedback, loading: true });
		if (
			feedback.name === "" ||
			feedback.templateCategory === "" ||
			feedback.message === ""
		) {
			setFeedback({ ...feedback, loading: false });
			toast.error("Please fill all the fields");
			return;
		}
		await addDoc(collection(db, "feedback"), {
			name: feedback.name,
			templateCategory: feedback.templateCategory,
			message: feedback.message,
			createdAt: new Date().toISOString(),
		});
		setShowFeedbackModal(false);
		setIsDropdownOpen(false);
		toast.success("Thank you for your feedback!");
		setFeedback({
			name: "",
			templateCategory: "",
			message: "",
			loading: false,
		});
	};

	const handleSelectCategory = (value, label) => {
		setFeedback({ ...feedback, templateCategory: value });
		setIsDropdownOpen(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isDropdownOpen]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate form
		if (
			!formData.name ||
			!formData.email ||
			!formData.subject ||
			!formData.message
		) {
			toast.error("Please fill in all fields");
			return;
		}

		if (!formData.email.includes("@")) {
			toast.error("Please enter a valid email address");
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await sendMessageEmail(formData);

			if (result.success) {
				toast.success(
					"Message received successfully! We'll get back to you soon."
				);
				setFormData({
					name: "",
					email: "",
					subject: "",
					message: "",
				});
			} else {
				toast.error("Failed to send message. Please try again.");
			}
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
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
				<link rel="icon" type="image/png" href="https://kixi.app/kixi-logo" />
			</Head>
			<div>
				<Navbar />
				<div className="max-w-7xl mx-auto py-16 border-l border-r border-zinc-200 border-dashed">
					<div className="flex relative py-10">
						<div
							className={`absolute -top-2 -left-2 w-4 h-4 flex items-center justify-center`}
						>
							<PlusIcon size={16} className="text-stone-200" />
						</div>
						<div
							className={`absolute -bottom-2 -left-2 w-4 h-4 flex items-center justify-center`}
						>
							<PlusIcon size={16} className="text-stone-200" />
						</div>
						<div className="relative max-w-xl mx-auto space-y-2 group md:p-0 p-4">
							<p className="md:text-9xl text-7xl flex md:justify-center justify-start items-center gap-1 font-sans text-center my-4 bg-gradient-to-r from-stone-700 via-zinc-900 to-stone-500 bg-clip-text text-transparent">
								<span className="">C</span>{" "}
								<span className="p-4 md:w-28 md:h-28 w-20 h-20 rounded-full group-hover:bg-white md:border-8 border-2 border-zinc-700 flex justify-center items-center">
									<motion.img
										src="./connect-person.svg"
										className="w-20 z-0 h-20 group-hover:animate-pulse animate-none group-hover:translate-y-0 translate-y-1/2 group-hover:opacity-100 opacity-0 duration-100 ease-in transition-all"
									/>
									<motion.img
										src="./message-sent.svg"
										className="w-24 h-24 mr-8 group-hover:-translate-x-1/2 translate-x-0 text-zinc-700 group-hover:text-zinc-200 group-hover:hidden visible transition-all duration-100 ease-in delay-100"
									/>
								</span>{" "}
								<span className="">nnect</span>
							</p>
							<p className="mt-4">Tell us about you next custom template</p>
							<motion.svg
								initial={{ width: 0 }}
								// whileInView={{ width: "50px" }}
								animate={{ width: "50px" }}
								exit={{ width: 0 }}
								transition={{ duration: 0.5 }}
								version="1.1"
								id="Capa_1"
								x="0px"
								y="0px"
								viewBox="0 0 352.2 352.2"
								style={{ enableBackground: "new 0 0 352.2 352.2" }}
								className="rotate-180 animate-pulse fill-stone-300 my-4"
							>
								<g>
									<path
										d="M348.232,100.282c-13.464-32.436-35.496-60.588-45.9-94.86c-1.836-5.508-11.016-7.956-13.464-1.836
		c-14.688,34.272-36.72,65.484-47.124,101.592c-1.836,6.732,7.344,13.464,12.24,7.344c7.344-9.18,15.912-16.524,24.479-25.092
		c-1.224,52.632,0,105.264-9.18,157.284c-4.896,28.152-11.628,59.977-31.824,81.396c-24.479,25.704-55.08,2.448-68.544-21.42
		c-11.628-20.809-31.823-110.772-72.215-79.561c-23.868,18.36-29.988,43.452-37.332,70.992c-1.836,7.956-4.896,15.3-8.568,22.032
		c-14.076,26.316-32.436-16.524-33.048-26.928c-1.224-20.809,4.896-42.229,9.792-62.424c1.836-6.12-7.344-8.568-9.792-2.448
		c-11.016,28.764-26.316,77.724,0,102.815c23.256,21.42,42.84,7.345,52.02-17.748c6.12-16.523,29.376-108.323,56.304-65.483
		c17.748,28.151,22.644,61.812,44.064,88.128c15.3,18.359,42.84,22.644,64.26,13.464c25.704-11.628,36.72-45.9,43.452-70.38
		c16.523-61.2,16.523-127.296,14.688-190.332c14.688,9.792,31.212,18.972,47.736,25.092
		C347.008,113.746,350.681,105.178,348.232,100.282z M268.672,78.25c7.956-17.136,17.748-34.272,26.316-51.408
		c9.18,21.42,20.808,40.392,31.824,61.2c-12.853-7.956-25.092-17.136-39.168-18.972c-3.061-0.612-5.509,1.224-6.732,3.672
		C276.628,73.354,272.345,75.19,268.672,78.25z"
									/>
								</g>
							</motion.svg>
							<input
								name="name"
								placeholder="Enter name"
								value={formData.name}
								onChange={handleInputChange}
								className="w-full focus:outline-none hover:border-zinc-300 hover:bg-zinc-50 p-2 text-xs rounded-xl border border-dashed border-zinc-200 bg-stone-50"
							/>
							<input
								name="email"
								type="email"
								placeholder="Enter email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full focus:outline-none hover:border-zinc-300 hover:bg-zinc-50 p-2 text-xs rounded-xl border border-dashed border-zinc-200 bg-stone-50"
							/>
							<input
								name="subject"
								placeholder="Enter subject"
								value={formData.subject}
								onChange={handleInputChange}
								className="w-full focus:outline-none hover:border-zinc-300 hover:bg-zinc-50 p-2 text-xs rounded-xl border border-dashed border-zinc-200 bg-stone-50"
							/>
							<textarea
								name="message"
								rows={3}
								placeholder="Enter message"
								value={formData.message}
								onChange={handleInputChange}
								className="w-full focus:outline-none hover:border-zinc-300 hover:bg-zinc-50 p-2 text-xs rounded-xl border border-dashed border-zinc-200 bg-stone-50"
							/>
							<button
								onClick={handleSubmit}
								disabled={isSubmitting}
								className="w-fit text-xs font-semibold p-2 rounded-xl text-left bg-zinc-900 hover:bg-black shadow-xl shadow-zinc-200 hover:shadow-zinc-400 text-white disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? "Sending..." : "10% off send message"}
							</button>
							<br />
							<hr className="border-t border-dashed border-zinc-50 my-4" />
							<br />
							<a
								href="mailto@shreyvijayvargiya26@gmal.com"
								target="_blank"
								className="text-zinc-800 hover:text-zinc-600 bg-zinc-50 p-2 rounded-xl hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold"
							>
								Email us
							</a>
						</div>
					</div>
				</div>
				<footer className="mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-t border-zinc-200 border-dashed">
					<div className="flex items-center justify-between w-full mx-auto max-w-7xl p-10 border-l border-r border-zinc-200 border-dashed">
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
						<div className="flex flex-col gap-2 text-xs mt-4">
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

export default ConnectPage;
