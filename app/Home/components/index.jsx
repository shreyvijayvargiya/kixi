// Component imports
import Header from "./Header";
import HeroSection from "./HeroSection";
import EmailSubscription from "./ClientLogos";
import TemplatesSection from "./SoftwareProjectsShowcase";
import HowItWorks from "./WhyChooseUs";
import WhoCanUse from "./FAQSection";
import TechStack from "./PricingSection";
import FAQSection from "./FooterCTA";
import CTASection from "./CTASection";
import Footer from "./Footer";

// Raw content imports using raw-loader
import HeaderRaw from "!!raw-loader!./Header.jsx";
import HeroSectionRaw from "!!raw-loader!./HeroSection.jsx";
import EmailSubscriptionRaw from "!!raw-loader!./ClientLogos.jsx";
import TemplatesSectionRaw from "!!raw-loader!./SoftwareProjectsShowcase.jsx";
import HowItWorksRaw from "!!raw-loader!./WhyChooseUs.jsx";
import WhoCanUseRaw from "!!raw-loader!./FAQSection.jsx";
import TechStackRaw from "!!raw-loader!./PricingSection.jsx";
import FAQSectionRaw from "!!raw-loader!./FooterCTA.jsx";
import CTASectionRaw from "!!raw-loader!./CTASection.jsx";
import FooterRaw from "!!raw-loader!./Footer.jsx";

// Components array export
export const landingPagecomponents = [
	{
		id: 1,
		name: "Header",
		component: Header,
		description: "Modern navigation header with mobile menu and authentication",
		category: "navigation",
		rawContent: HeaderRaw,
	},
	{
		id: 2,
		name: "Hero Section",
		component: HeroSection,
		description:
			"Main hero section with Product Hunt badge and feature highlights",
		category: "hero",
		rawContent: HeroSectionRaw,
	},
	{
		id: 3,
		name: "Email Subscription",
		component: EmailSubscription,
		description: "Email subscription section with Firebase integration",
		category: "subscription",
		rawContent: EmailSubscriptionRaw,
	},
	{
		id: 4,
		name: "Templates Section",
		component: TemplatesSection,
		description: "Templates showcase with grid layout and navigation",
		category: "showcase",
		rawContent: TemplatesSectionRaw,
	},
	{
		id: 5,
		name: "How It Works",
		component: HowItWorks,
		description: "Step-by-step process explanation with images",
		category: "process",
		rawContent: HowItWorksRaw,
	},
	{
		id: 6,
		name: "Who Can Use",
		component: WhoCanUse,
		description: "Target audience section with user personas",
		category: "audience",
		rawContent: WhoCanUseRaw,
	},
	{
		id: 7,
		name: "Tech Stack",
		component: TechStack,
		description: "Technology showcase with icons and descriptions",
		category: "technology",
		rawContent: TechStackRaw,
	},
	{
		id: 8,
		name: "FAQ Section",
		component: FAQSection,
		description: "Comprehensive FAQ with expandable answers",
		category: "faq",
		rawContent: FAQSectionRaw,
	},
	{
		id: 9,
		name: "CTA Section",
		component: CTASection,
		description: "Call-to-action section with interactive elements",
		category: "cta",
		rawContent: CTASectionRaw,
	},
	{
		id: 10,
		name: "Footer",
		component: Footer,
		description: "Footer with links and company information",
		category: "footer",
		rawContent: FooterRaw,
	},
];
