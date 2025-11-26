import React, { useState } from "react";
import { MessageSquare, PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const FAQSection = () => {
	const [activeFaq, setActiveFaq] = useState(null);

	const faqs = [
		{
			question: "What is kixi?",
			answer:
				"kixi is a collection of React website templates designed for developers, designers, and entrepreneurs. We provide high-quality, modern templates for building landing pages, portfolio websites, and micro SaaS applications. All templates are FREE to use and built with the latest technologies and best practices.",
		},
		{
			question: "What tech stack do you use?",
			answer:
				"All templates are built with modern technologies including Next.js, React, TypeScript, Tailwind CSS, and Framer Motion. They're optimized for performance, SEO, and developer experience. Each template comes with production-ready code that follows industry best practices.",
		},
		{
			question: "How do I use a template?",
			answer:
				"Using our templates is simple: 1) Browse our collection and find a template you like, 2) View the live preview, 3) Click 'View Source Code' to access the repository, 4) Download or clone the code, 5) Install dependencies and run locally, 6) Customize with your content, and 7) Deploy to your preferred platform.",
		},
		{
			question: "How do I view the source code?",
			answer:
				"Each template has a 'Source' button that takes you directly to the code repository. You can view the complete source code, including all components, styles, and assets. The code is well-organized with clear documentation and setup instructions.",
		},
		{
			question: "Are templates really FREE to use?",
			answer:
				"Yes! All our templates are completely FREE to use for personal and commercial projects. You can download the source code, customize it, and deploy it without any restrictions. We believe in making quality templates accessible to everyone.",
		},
		{
			question: "What are premium templates?",
			answer:
				"Premium templates are advanced, feature-rich templates with additional functionality like authentication systems, payment integration, admin dashboards, and more complex UI components. Check out our <a href='/premium-templates' class='text-blue-600 hover:underline'>premium templates collection</a> for these enhanced options.",
		},
		{
			question: "Can I customize the templates?",
			answer:
				"Absolutely! All templates are fully customizable. You can modify the design, add your own content, change colors and fonts, and extend the functionality. The code is well-documented and follows best practices for easy customization. You have complete control over the final product.",
		},
		{
			question: "How do I download the code repository?",
			answer:
				"To download a template's code repository: 1) Click the 'Source' button on any template, 2) This opens the GitHub repository, 3) Click 'Code' and then 'Download ZIP' or clone using Git, 4) Extract the files to your local machine, 5) Follow the README instructions to set up the project.",
		},
		{
			question: "How do I deploy the code repository?",
			answer:
				"Deploying is straightforward: 1) Customize your template locally, 2) Push your code to GitHub, 3) Connect to deployment platforms like Vercel, Netlify, or GitHub Pages, 4) Configure your domain and environment variables, 5) Deploy! Most platforms offer one-click deployment from GitHub repositories.",
		},
		{
			question: "What kind of support do you provide?",
			answer:
				"We provide comprehensive email support for all users. You can reach us at connect@ihatereading.in for any questions about implementation, customization, or technical issues. We also offer community support through GitHub issues and our Discord community.",
		},
		{
			question: "Can I use templates for client projects?",
			answer:
				"Yes! You can use our templates for client projects, personal websites, and commercial applications. The templates are free to use for any purpose. However, you cannot resell or redistribute the templates themselves as standalone products.",
		},
		{
			question: "How often do you release new templates?",
			answer:
				"We release new templates regularly to keep our collection fresh and up-to-date. Follow our changelog to stay informed about new additions. All templates are immediately available to all users at no cost.",
		},
		{
			question: "Are these FREE React.js templates for commercial use?",
			answer:
				"Yes! All our FREE React.js templates are completely free for both personal and commercial use. You can use them for client projects, startups, SaaS applications, and any commercial venture without any restrictions. Our templates are built with modern React.js best practices and are production-ready.",
		},
		{
			question: "Do you have FREE Next.js Tailwind CSS templates?",
			answer:
				"Absolutely! We specialize in FREE Next.js Tailwind CSS templates that are perfect for modern web development. All our templates use Next.js for optimal performance and SEO, combined with Tailwind CSS for beautiful, responsive designs. These templates are ideal for landing pages, portfolios, and SaaS applications.",
		},
		{
			question: "What makes your templates SEO-friendly?",
			answer:
				"Our templates are built with SEO best practices including: Next.js for server-side rendering, optimized meta tags, structured data, fast loading times, mobile-responsive design, semantic HTML, and clean URL structures. Each template is designed to rank well in search engines and provide excellent user experience.",
		},
		{
			question: "Can I use these templates for SaaS applications?",
			answer:
				"Definitely! Our FREE React.js and Next.js templates are perfect for building SaaS applications. They include modern UI components, responsive designs, and are built with scalability in mind. Many developers use our templates as starting points for their SaaS products, adding authentication, payment systems, and other features as needed.",
		},
		{
			question: "Are your templates mobile-responsive?",
			answer:
				"Yes! All our FREE templates are fully mobile-responsive and built with mobile-first design principles. They use Tailwind CSS for responsive layouts that work perfectly on desktop, tablet, and mobile devices. Each template is tested across different screen sizes to ensure optimal user experience on all devices.",
		},
	];

	return (
		<section id="faq" className="py-10 my-10 px-4 md:p-0 p-4 bg-white">
			<div className="max-w-4xl mx-auto">
				<span className="mb-6 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 w-fit mx-auto">
					<MessageSquare className="w-3 h-3" />
					FAQ
				</span>
				<h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
					Frequently Asked Questions
				</h2>
				<p className=" text-zinc-600 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
					Find answers to common questions about our templates and services
				</p>

				<div className="space-y-2 relative max-w-md mx-auto p-2 border border-zinc-200 rounded-xl">
					{faqs.map((faq, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
						>
							<button
								onClick={() => setActiveFaq(activeFaq === index ? null : index)}
								className="group w-full text-left text-sm py-1 bg-zinc-50/50 px-2 hover:bg-zinc-50 bg-white border border-zinc-200 rounded-xl transition-colors"
							>
								<div className="flex items-center justify-between ">
									<h3 className="pr-2">{faq.question}</h3>
									<div className="p-2 group-hover:visible invisible hover:bg-zinc-100 bg-zinc-50 rounded">
										<PlusIcon
											size={16}
											className={`w-3 h-3 text-zinc-600 transition-transform duration-200 ${
												activeFaq === index ? "rotate-45" : ""
											}`}
										/>
									</div>
								</div>
								<AnimatePresence>
									{activeFaq === index && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.2 }}
											className="overflow-hidden"
										>
											<p className="mb-4 text-zinc-600 leading-relaxed">
												{faq.answer}
											</p>
										</motion.div>
									)}
								</AnimatePresence>
							</button>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FAQSection;
