import React, { useState, useEffect, useRef } from "react";
import {
	ArrowRight,
	X,
	Menu,
	Download,
	ShieldCheck,
	Heart,
	PlusIcon,
	FileCode,
	Code2,
	PersonStanding,
	Sparkles,
	PenTool,
	MessageSquare,
	Code,
	Copy,
	Eye,
	Loader2,
	ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import router from "next/router";
import {
	BsCreditCard,
	BsDownload,
	BsPlayCircle,
	BsCloudUpload,
} from "react-icons/bs";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
	SiNextdotjs,
	SiTailwindcss,
	SiTypescript,
	SiReact,
	SiVercel,
	SiFramer,
} from "react-icons/si";
import SubscriptionModal from "../../components/SubscriptionModal";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import ScrollToPlugin from "gsap/dist/ScrollToPlugin";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { landingPagecomponents } from "./components";
import SyntaxHighlighter from "react-syntax-highlighter";
import Navbar from "../../modules/Navbar";
import { useSelector } from "react-redux";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import PricingSection from "./components/PricingSection";
import WhyWeMadeSection from "./components/WhyWeMadeSection";
import FAQSection from "./components/FooterCTA";
import Footer from "./components/Footer";
import HowItWorks from "./components/WhyChooseUs";
import WhoCanUse from "./components/FAQSection";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const faqs = [
	{
		question: "What is kixi?",
		answer:
			"kixi is a powerful creative design app that helps you create stunning, animated gradients for your projects. Create beautiful gradients with customizable colors, animations, and export them in multiple formats including PNG, SVG, GIF, MP4, or React code.",
	},
	{
		question: "How do I create a gradient?",
		answer:
			"Creating a gradient is simple: 1) Choose your gradient type (linear, radial, or conic), 2) Add color stops and customize their positions, 3) Adjust animation settings, 4) Preview in real-time, and 5) Export in your preferred format. The interface is intuitive and user-friendly.",
	},
	{
		question: "What export formats are available?",
		answer:
			"kixi supports multiple export formats: PNG (static images), SVG (vector graphics), GIF (animated), MP4 (video), and React code (for direct use in your projects). PRO users get access to all formats with higher quality options.",
	},
	{
		question: "Can I use AI to generate gradients?",
		answer:
			"Yes! PRO users have access to AI-powered gradient generation. Simply describe what you want in natural language, and our AI will create the perfect gradient for you. This feature is available in the PRO plan.",
	},
	{
		question: "How many projects can I create?",
		answer:
			"Free users can create a limited number of projects. PRO users get unlimited projects and can save them to access later. All projects are saved to your account and can be edited anytime.",
	},
	{
		question: "Can I export React code?",
		answer:
			"Absolutely! kixi can generate production-ready React code for your gradients. Simply click the export button and select 'React Code' to get clean, copy-paste ready code that you can use directly in your React or Next.js projects.",
	},
	{
		question: "What's included in the PRO plan?",
		answer:
			"The PRO plan includes: unlimited projects, AI-powered gradient generation, all export formats (PNG, SVG, GIF, MP4, React code), priority support, early access to new features, and new templates every week. It's an annual subscription at $99/year.",
	},
	{
		question: "Can I cancel my subscription?",
		answer:
			"Yes, you can cancel your annual subscription anytime. However, there are no refunds for remaining months. Once canceled, you'll retain access until the end of your billing period.",
	},
	{
		question: "Do I own the gradients I create?",
		answer:
			"Yes! You have full ownership and commercial rights to all gradients you create with kixi. Use them in any project, commercial or personal, without any restrictions or attribution required.",
	},
	{
		question: "What kind of support do you provide?",
		answer:
			"We provide email support for all users. PRO users get priority support with faster response times. You can reach us at connect@ihatereading.in for any questions or technical issues.",
	},
	{
		question: "Can I use gradients for commercial projects?",
		answer:
			"Absolutely! All gradients created with kixi can be used for commercial projects, client work, personal websites, or any application. You have complete commercial rights to everything you create.",
	},
	{
		question: "How do I save my projects?",
		answer:
			"Simply click the 'Save Project' button in the editor. Your projects are automatically saved to your account and can be accessed anytime. PRO users get unlimited project storage.",
	},
];

const Templates = () => {
	const [showModal, setShowModal] = useState(false);
	const [hoveredCard, setHoveredCard] = useState(false);
	const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });
	const [email, setEmail] = useState("");
	const [devMode, setDevMode] = useState(false);
	const [showCodeModal, setShowCodeModal] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState(null);
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const [feedback, setFeedback] = useState({
		loading: false,
		name: "",
		templateCategory: "",
		message: "",
	});
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const { isAuthenticated } = useSelector((state) => state.auth);

	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setCirclePosition({ x, y });
		setHoveredCard(true);
	};

	const handleMouseLeave = () => {
		setHoveredCard(false);
	};

	// Query for keyboard events
	useQuery({
		queryKey: ["keyboardEvents"],
		queryFn: () => {
			const handleKeyPress = (event) => {
				if (event.key.toLowerCase() === "t") {
					router.push("/templates");
				}
			};

			window.addEventListener("keydown", handleKeyPress);
			return () => window.removeEventListener("keydown", handleKeyPress);
		},
		staleTime: Infinity,
	});

	// Email subscription mutation
	const emailSubscriptionMutation = useMutation({
		mutationFn: async (emailData) => {
			await addDoc(collection(db, "gt-email-subs"), {
				email: emailData.email,
				timestamp: new Date().toISOString(),
				createdAt: new Date(),
			});
		},
		onSuccess: () => {
			toast.success("Successfully subscribed!.");
			setEmail("");
		},
		onError: (error) => {
			toast.error("Failed to subscribe. Please try again.");
			console.error("Email subscription error:", error);
		},
	});

	const handleEmailSubscription = () => {
		if (!email || !email.includes("@")) {
			toast.error("Please enter a valid email address");
			return;
		}
		emailSubscriptionMutation.mutate({ email });
	};

	// Dev Mode functions
	const handleViewCode = (componentName) => {
		const component = landingPagecomponents.find(
			(comp) => comp.name === componentName
		);
		if (component) {
			setSelectedComponent(component);
			setShowCodeModal(true);
		}
	};

	const handleCopyCode = (componentName) => {
		const component = landingPagecomponents.find(
			(comp) => comp.name === componentName
		);
		if (component) {
			navigator.clipboard.writeText(component.rawContent);
			toast.success(`Copied ${componentName} code to clipboard!`);
		}
	};

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

	return (
		<div className={`min-h-screen ${devMode ? "bg-stone-50/50" : "bg-white"}`}>
			<div className="relative ">
				<div className="mx-auto ">
					<Navbar showDevMove={devMode} setDevMode={setDevMode} />
					<div className="max-w-7xl mx-auto pt-10 border-l border-r border-dashed border-zinc-100">
						{/* Hero Section */}
						<section
							id="home"
							className={`mx-auto flex flex-col items-center justify-center max-w-7xl text-center px-4 relative transition-all duration-300 ${
								devMode
									? "border-2 border-dashed border-green-400 bg-green-50/30 rounded-xl m-4"
									: ""
							}`}
						>
							<HeroSection />
						</section>
						{/* Features Section */}
						<FeaturesSection />
						{/* Why We Made Section */}
						<WhyWeMadeSection />
						{/* How It Works Section */}
						<section
							id="how-it-works"
							className={`my-16 py-16 group relative transition-all duration-300 ${
								devMode
									? "border-2 border-dashed border-green-400 bg-green-50/30 rounded-xl m-4"
									: ""
							}`}
						>
							{/* Dev Mode Buttons */}
							{devMode && (
								<div className="absolute top-4 right-4 flex gap-2 z-10">
									<button
										onClick={() => handleViewCode("Hero Section")}
										className="flex items-center gap-1 bg-zinc-800 text-white px-2 py-1 rounded text-xs hover:bg-zinc-900 transition-colors"
									>
										<Eye className="w-3 h-3" />
										View Code
									</button>
									<button
										onClick={() => handleCopyCode("Hero Section")}
										className="flex items-center gap-1 bg-zinc-600 text-white px-2 py-1 rounded text-xs hover:bg-zinc-700 transition-colors"
									>
										<Copy className="w-3 h-3" />
										Copy
									</button>
								</div>
							)}
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
										onClick={() => router.push("/app")}
										className="cursor-pointer text-zinc-800 bg-zinc-50/50 hover:bg-zinc-100 py-1 px-4 rounded-full text-xs flex items-center gap-2"
									>
										Start creating beautiful gradients
									</span>
									<p className="text-5xl font-semibold">
										Create stunning <b>animated gradients</b> for your projects
									</p>
									<div className="flex items-center justify-center flex-wrap gap-3 text-sm font-semibold max-w-xl mx-auto my-8">
										<span className="group relative w-fit px-4 py-1 rounded-xl bg-zinc-50 flex justify-center items-center gap-2">
											🚀
											<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-100 text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
												Animated Gradients
												<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-zinc-800"></div>
											</div>
										</span>
										Real-time preview and customization
										<span className="group relative w-fit px-4 py-1 rounded-xl bg-yellow-50 flex justify-center items-center gap-2">
											🔥
											<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-50 text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
												AI Generation
												<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-zinc-800"></div>
											</div>
										</span>
										Multiple export formats
										<span className="group relative px-4 py-1 rounded-xl bg-green-50 flex justify-center items-center gap-2">
											<ShieldCheck className="w-5 h-5 text-green-500 " />
											<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-50 text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
												React Code Export
												<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-zinc-800"></div>
											</div>
										</span>
										<span>Production Ready</span>
										<span className="group relative px-4 py-1 rounded-xl bg-blue-50 flex justify-center items-center gap-2">
											<Download className="w-5 h-5 text-blue-500" />
											<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-50 text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
												PNG, SVG, GIF, MP4
												<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-zinc-800"></div>
											</div>
										</span>
										<span>Instant Export</span>
										<span className="group relative px-4 py-1 rounded-xl bg-red-50 flex justify-center items-center gap-2">
											<Heart className="w-5 h-5 text-red-500" />
											<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-50 text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
												Unlimited Projects
												<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-zinc-800"></div>
											</div>
										</span>
										<span>for designers and developers</span>
									</div>
									<div className="flex items-center gap-3 flex-wrap justify-start mt-2">
										<button
											onClick={() => router.push("/app")}
											className="group inline-flex items-center font-semibold gap-2 bg-zinc-800 text-white px-2 py-2 text-xs rounded-xl hover:bg-black hover:shadow-xl transition-colors shadow-sm"
										>
											<span>Start Creating</span>
											<ArrowRight className="w-4 h-4 text-zinc-200 group-hover:rotate-180 rotate-0 transition-all group-hover:text-zinc-100 duration-100 ease-in" />
										</button>
										{!isAuthenticated && <GoogleLoginButton />}
									</div>
								</div>
							</div>
						</section>
						{/* Email Subscription Section */}
						<section
							className={`py-16 border-t border-dashed border-zinc-100 relative bg-gradient-to-br from-zinc-50/50 to-white gradientAnimation transition-all duration-300 ${
								devMode
									? "border-2 border-dashed border-green-400 bg-green-50/30 rounded-xl m-4"
									: ""
							}`}
						>
							{/* Dev Mode Buttons */}
							{devMode && (
								<div className="absolute top-4 right-4 flex gap-2 z-10">
									<button
										onClick={() => handleViewCode("Email Subscription")}
										className="flex items-center gap-1 bg-zinc-800 text-white px-2 py-1 rounded text-xs hover:bg-zinc-900 transition-colors"
									>
										<Eye className="w-3 h-3" />
										View Code
									</button>
									<button
										onClick={() => handleCopyCode("Email Subscription")}
										className="flex items-center gap-1 bg-zinc-600 text-white px-2 py-1 rounded text-xs hover:bg-zinc-700 transition-colors"
									>
										<Copy className="w-3 h-3" />
										Copy
									</button>
								</div>
							)}
							<div
								className={`absolute -top-2 -left-2 w-4 h-4 flex items-center justify-center`}
							>
								<PlusIcon size={16} className="text-stone-200" />
							</div>
							<div className="flex gap-2 items-start justify-center">
								<div className="flex flex-col">
									<input
										type="email"
										placeholder="Enter your email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										onKeyPress={(e) =>
											e.key === "Enter" && handleEmailSubscription()
										}
										className="flex-1 px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors bg-white"
									/>
								</div>
								<button
									onClick={handleEmailSubscription}
									disabled={emailSubscriptionMutation.isPending}
									className="px-4 py-2 bg-zinc-900 text-white text-xs rounded-xl hover:bg-black transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{emailSubscriptionMutation.isPending
										? "Subscribing..."
										: "Subscribe"}
								</button>
							</div>
							<p className="text-xs text-center text-zinc-500 mt-2 leading-relaxed">
								New releases almost everyday
							</p>
						</section>

						{/* Templates Section */}
						<section
							id="templates"
							className={`py-16 border-t border-b border-dashed border-zinc-100 relative transition-all duration-300 ${
								devMode
									? "border-2 border-dashed border-green-400 bg-green-50/30 rounded-xl m-4"
									: ""
							}`}
						>
							{/* Dev Mode Buttons */}
							{devMode && (
								<div className="absolute top-4 right-4 flex gap-2 z-10">
									<button
										onClick={() => handleViewCode("Templates Section")}
										className="flex items-center gap-1 bg-zinc-800 text-white px-2 py-1 rounded text-xs hover:bg-zinc-900 transition-colors"
									>
										<Eye className="w-3 h-3" />
										View Code
									</button>
									<button
										onClick={() => handleCopyCode("Templates Section")}
										className="flex items-center gap-1 bg-zinc-600 text-white px-2 py-1 rounded text-xs hover:bg-zinc-700 transition-colors"
									>
										<Copy className="w-3 h-3" />
										Copy
									</button>
								</div>
							)}
							{[
								{
									className: "absolute -top-2 -left-2",
								},
								{
									className: "absolute -bottom-2 -left-2",
								},
							].map((position, idx) => (
								<div
									key={idx}
									className={`${position.className} w-4 h-4 flex items-center justify-center`}
								>
									<PlusIcon size={16} className="text-stone-200" />
								</div>
							))}
							<div className="max-w-7xl mx-auto">
								<span className="mb-6 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-zinc-50 text-xs font-medium text-zinc-600 w-fit mx-auto">
									<FileCode className="w-3 h-3" />
									Categories
								</span>
								<h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
									Create Beautiful Gradients
								</h2>
								<p className=" text-zinc-600 text-center mb-12 max-w-2xl mx-auto">
									Design stunning animated gradients for your websites, apps,
									and projects
								</p>
							</div>
						</section>

						{/* How It Works Section */}
						<HowItWorks />
						{/* Who Can Use Section */}
						<WhoCanUse />
						{/* Pricing Section */}
						<PricingSection />

						{/* Who is kixi for */}
						<section
							id="how-it-works"
							className={`my-16 w-full max-w-7xl mx-auto px-4 relative transition-all duration-300 ${
								devMode
									? "border-2 border-dashed border-green-400 bg-green-50/30 rounded-xl m-4"
									: ""
							}`}
						>
							{/* Dev Mode Buttons */}
							{devMode && (
								<div className="absolute top-4 right-4 flex gap-2 z-10">
									<button
										onClick={() => handleViewCode("Who Can Use")}
										className="flex items-center gap-1 bg-zinc-800 text-white px-2 py-1 rounded text-xs hover:bg-zinc-900 transition-colors"
									>
										<Eye className="w-3 h-3" />
										View Code
									</button>
									<button
										onClick={() => handleCopyCode("Who Can Use")}
										className="flex items-center gap-1 bg-zinc-600 text-white px-2 py-1 rounded text-xs hover:bg-zinc-700 transition-colors"
									>
										<Copy className="w-3 h-3" />
										Copy
									</button>
								</div>
							)}
							<span className="mb-6 border border-zinc-200 rounded-full bg-zinc-100 text-xs  px-4 py-2 flex items-center justify-center w-fit mx-auto">
								<Heart className="w-3 h-3 mr-2" />
								Who can use kixi?
							</span>
							<div className="flex flex-wrap justify-center items-center flex-col relative">
								<div className="mb-4">
									<h3 className="font-semibold text-4xl mb-2 mx-auto text-center bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
										kixi is for everyone
									</h3>
									<p className=" text-zinc-600 max-w-md mx-auto text-center leading-relaxed">
										kixi is built to help you create stunning animated gradients
										quickly and easily. Save time, get inspired, and bring your
										designs to life.
									</p>
								</div>
								<div className="flex flex-col justify-start items-start gap-2 hover:gap-0 transition-all duration-100 ease-in bg-zinc-50/10">
									<div className="p-4 flex gap-2 items-center rounded-2xl hover:scale-105 scale-95 transition-all duration-100 ease-in bg-gradient-to-br border border-stone-100 w-full">
										<div className="flex items-center gap-2">
											<div className="w-12 h-12 rounded-2xl text-zinc-800 flex items-center justify-center">
												<Code2 className="w-6 h-6 text-zinc-800" />
											</div>
										</div>
										<div className="">
											<h4 className="font-bold text-zinc-900">Developers</h4>
											<p className="text-zinc-600 text-xs ">
												Get production-ready code and save development time
											</p>
										</div>
									</div>
									<div className="p-4 flex gap-2 items-center rounded-2xl hover:scale-105 scale-95 transition-all duration-100 ease-in bg-gradient-to-br from-green-50/50 to-emerald-50/50 border border-stone-100 w-full">
										<div className="flex items-center gap-2">
											<div className="w-12 h-12 rounded-2xl  text-zinc-800 flex items-center justify-center">
												<PersonStanding className="w-6 h-6 text-zinc-800" />
											</div>
										</div>
										<div className="">
											<h4 className="font-bold text-zinc-900">Designers</h4>
											<p className="text-zinc-600 text-xs ">
												Find inspiration and modern design patterns
											</p>
										</div>
									</div>
									<div className="p-4 flex gap-2 items-center rounded-2xl hover:scale-105 scale-95 transition-all duration-100 ease-in bg-gradient-to-br from-purple-50/50 to-violet-50/50 border border-stone-100 w-full">
										<div className="flex items-center gap-2">
											<div className="w-12 h-12 rounded-2xl text-zinc-800 flex items-center justify-center">
												<Sparkles className="w-6 h-6 text-zinc-800" />
											</div>
										</div>
										<div className="">
											<h4 className="font-bold text-zinc-900">Entrepreneurs</h4>
											<p className="text-zinc-600 text-xs ">
												Launch faster with professional templates
											</p>
										</div>
									</div>
									<div className="p-4 flex gap-2 items-center rounded-2xl hover:scale-105 scale-95 transition-all duration-100 ease-in bg-gradient-to-br from-pink-50/50 to-pink-50/50 border border-stone-100 w-full">
										<div className="flex items-center gap-2">
											<div className="w-12 h-12 rounded-2xl text-zinc-800 flex items-center justify-center">
												<PenTool className="w-6 h-6 text-zinc-800" />
											</div>
										</div>
										<div className="">
											<h4 className="font-bold text-zinc-900">Indie Hackers</h4>
											<p className="text-zinc-600 text-xs ">
												Inspiration to solve modern problems
											</p>
										</div>
									</div>
								</div>
							</div>
						</section>

						{/* FAQ Section */}
						<FAQSection />

						{/* CTA Section */}
						<section
							className={`relative bg-gradient-to-tr	from-stone-50 to-transparent border-t border-dashed border-zinc-100 transition-all duration-300 ${
								devMode
									? "border-2 border-dashed border-green-400 bg-green-50/30 rounded-xl m-4"
									: ""
							}`}
							onMouseMove={(e) => handleMouseMove(e)}
							onMouseLeave={handleMouseLeave}
						>
							{/* Dev Mode Buttons */}
							{devMode && (
								<div className="absolute top-4 right-4 flex gap-2 z-10">
									<button
										onClick={() => handleViewCode("CTA Section")}
										className="flex items-center gap-1 bg-zinc-800 text-white px-2 py-1 rounded text-xs hover:bg-zinc-900 transition-colors"
									>
										<Eye className="w-3 h-3" />
										View Code
									</button>
									<button
										onClick={() => handleCopyCode("CTA Section")}
										className="flex items-center gap-1 bg-zinc-600 text-white px-2 py-1 rounded text-xs hover:bg-zinc-700 transition-colors"
									>
										<Copy className="w-3 h-3" />
										Copy
									</button>
								</div>
							)}
							{hoveredCard && (
								<div
									className="absolute transition-all duration-100 ease-in text-gray-400"
									style={{
										transform: `translate(${circlePosition.x}px, ${circlePosition.y}px)`,
									}}
								>
									<PlusIcon size={16} className="text-stone-200" />
								</div>
							)}
							{[
								{
									className: "absolute -top-2 -left-2",
								},
								{
									className: "absolute -bottom-2 -left-2",
								},
							].map((position, idx) => (
								<div
									key={idx}
									className={`${position.className} w-4 h-4 flex items-center justify-center`}
								>
									<PlusIcon size={16} className="text-stone-200" />
								</div>
							))}
							<div className="max-w-4xl mx-auto group text-center p-10 relative">
								<div className="w-full transition-all duration-300 ease-in rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text justify-center items-center absolute bottom-0 left-0 right-0 top-0 h-full z-0 overflow-hidden" />
								<div className="z-10 relative">
									<span className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 w-fit mx-auto">
										<Sparkles className="w-3 h-3" />
										Ready to Start?
									</span>
									<h2 className="text-2xl font-semibold text-center mb-2">
										Still here?
									</h2>
									<p className=" text-center mb-6 max-w-md mx-auto leading-relaxed">
										Start creating beautiful animated gradients for your
										projects today
									</p>
									<button
										onClick={() => router.push("/app")}
										className="group inline-flex items-center font-semibold gap-2 bg-zinc-800 text-white px-2 py-2 text-xs rounded-xl hover:bg-black hover:shadow-xl transition-colors shadow-sm"
									>
										<span>Start Creating</span>
										<ArrowRight className="w-4 h-4 text-zinc-200 group-hover:rotate-180 rotate-0 transition-all group-hover:text-zinc-100 duration-100 ease-in" />
									</button>
								</div>
							</div>
						</section>
					</div>

					{/* Footer */}
					<Footer />
				</div>
			</div>
			{
				<AnimatePresence>
					{showModal && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
						>
							<motion.div
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.95, opacity: 0 }}
								className="bg-white  p-6 max-w-md w-full mx-4"
							>
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-2xl font-bold text-zinc-900">
										Login Required
									</h2>
									<button
										onClick={() => setShowModal(false)}
										className="text-zinc-500 hover:text-zinc-700"
									>
										<X size={24} />
									</button>
								</div>

								<GoogleLoginButton />
								<p className="text-zinc-500  mt-4">
									By logging in, you agree to our terms of service and privacy
									policy.
								</p>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			}

			{/* Code Modal - Using simple pre tag to avoid SSR issues with SyntaxHighlighter */}
			<AnimatePresence>
				{showCodeModal && selectedComponent && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
						>
							<div className="flex justify-between items-center px-4 py-2 border-b border-zinc-200">
								<h2 className="font-semibold text-xs text-zinc-900">
									{selectedComponent.name} Source Code
								</h2>
								<div className="flex gap-2">
									<button
										onClick={() => handleCopyCode(selectedComponent.name)}
										className="flex items-center gap-2 bg-zinc-50 border border-dashed border-zinc-200 px-2 py-1.5 text-sm hover:bg-zinc-100 transition-colors"
									>
										<Copy className="w-3 h-3" />
										Copy Code
									</button>
									<button
										onClick={() => setShowCodeModal(false)}
										className="text-zinc-500 hover:text-zinc-700 p-2 text-sm hover:bg-zinc-100 bg-zinc-50 border border-dashed border-zinc-200"
									>
										<X size={16} />
									</button>
								</div>
							</div>
							<div className="overflow-auto max-h-[60vh] bg-zinc-900 text-green-400 font-mono text-xs">
								<SyntaxHighlighter
									language="jsx"
									className="hidescrollbar w-full md:min-w-3.5 mx-auto overflow-x-auto"
									customStyle={{
										margin: 0,
										padding: "0.75rem",
										height: "100%",
										wordBreak: "break-all",
										whiteSpace: "pre-wrap",
										wordWrap: "break-word",
										overflowWrap: "break-word",
										fontSize: "0.75rem",
										lineHeight: "1.5",
										"@media (min-width: 640px)": {
											fontSize: "0.875rem",
											padding: "1rem",
											margin: "0 auto",
											whiteSpace: "pre",
											wordBreak: "normal",
											wordWrap: "normal",
											overflowWrap: "normal",
										},
									}}
								>
									{selectedComponent.rawContent}
								</SyntaxHighlighter>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Template Request Modal */}
			<AnimatePresence>
				{showFeedbackModal && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						className="fixed inset-0 bg-black/50 z-50 h-full w-full flex flex-col justify-center items-center lg:p-0 p-2"
					>
						<div className="bg-white rounded-xl lg:w-1/4 w-full mx-auto p-6 shadow-lg">
							<div className="mb-4">
								<div className="flex items-center justify-between gap-2 w-full">
									<h2 className="text-lg font-semibold text-zinc-900">
										Request Next Template
									</h2>
									<X
										onClick={() => setShowFeedbackModal(false)}
										className="hover:bg-zinc-50 rounded-xl p-1 transition-all duration-100 ease-in cursor-pointer"
										size={24}
									/>
								</div>
								<p className="text-zinc-500 text-sm">
									Which template would you like us to build next?
								</p>
							</div>
							<div className="w-full">
								<div className="flex items-center justify-start h-full">
									<div className="flex flex-col gap-2 w-full">
										<input
											type="text"
											placeholder="Your Name"
											value={feedback.name}
											onChange={(e) =>
												setFeedback({ ...feedback, name: e.target.value })
											}
											className="w-full p-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors"
										/>

										{/* Custom Animated Dropdown */}
										<div className="relative w-full" ref={dropdownRef}>
											<button
												type="button"
												onClick={() => setIsDropdownOpen(!isDropdownOpen)}
												className="w-full p-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors flex items-center justify-between bg-white text-left"
											>
												<span
													className={
														feedback.templateCategory
															? "text-zinc-900"
															: "text-zinc-400"
													}
												>
													{feedback.templateCategory
														? templateCategories.find(
																(cat) => cat.value === feedback.templateCategory
															)?.label
														: "Select template category"}
												</span>
												<ChevronDown
													className={`w-4 h-4 transition-transform duration-200 ${
														isDropdownOpen ? "rotate-180" : ""
													}`}
												/>
											</button>

											<AnimatePresence>
												{isDropdownOpen && (
													<motion.div
														initial={{ opacity: 0, y: -10 }}
														animate={{ opacity: 1, y: 0 }}
														exit={{ opacity: 0, y: -10 }}
														transition={{ duration: 0.2 }}
														className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-60 overflow-auto"
													>
														<div className="p-1">
															{templateCategories.map((category) => (
																<button
																	key={category.value}
																	type="button"
																	onClick={() =>
																		handleSelectCategory(
																			category.value,
																			category.label
																		)
																	}
																	className={`w-full text-left p-2 text-xs rounded-xl transition-colors ${
																		feedback.templateCategory === category.value
																			? "bg-zinc-900 text-white"
																			: "hover:bg-zinc-100 text-zinc-700"
																	}`}
																>
																	{category.label}
																</button>
															))}
														</div>
													</motion.div>
												)}
											</AnimatePresence>
										</div>
										<textarea
											placeholder="Describe what you'd like to see in this template..."
											value={feedback.message}
											onChange={(e) =>
												setFeedback({ ...feedback, message: e.target.value })
											}
											className="w-full p-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors"
											rows={3}
										/>
										<button
											className="text-sm font-semibold bg-zinc-900 text-white px-4 py-2 mt-2 rounded-xl hover:bg-zinc-800 cursor-pointer mb-4 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
											onClick={handleSubmitFeedback}
											disabled={feedback.loading}
										>
											{feedback.loading ? (
												<Loader2 className="w-6 h-6 animate-spin" />
											) : (
												"Send Request"
											)}
										</button>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Templates;
