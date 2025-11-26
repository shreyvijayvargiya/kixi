import React, { useState } from "react";
import { MessageSquare, PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const FAQSection = () => {
	const [activeFaq, setActiveFaq] = useState(null);

	const faqs = [
		{
			question: "What exactly is kixi?",
			answer:
				"kixi is an advanced creative canvas where you can design animated gradients, mix media, and export production-ready assets without leaving the browser.",
		},
		{
			question: "How is the editor different from Figma or Canva?",
			answer:
				"We focus on gradient-first motion design. Kixi ships timeline controls, warp tools, AI-assisted layouts, and instant exports that are tailored for generative visuals rather than traditional UI mockups.",
		},
		{
			question: "What can I place on the canvas?",
			answer:
				"You can combine images, videos, icons, shapes, multi-line text, and reusable background patterns. Everything supports drag, resize, z-index management, and precise numeric inputs.",
		},
		{
			question: "Does kixi support AI workflows?",
			answer:
				"Yes. You can prompt AI to compose multi-object scenes, ask it to restyle existing layouts, and even generate gradients or icon sets that match your brand palette.",
		},
		{
			question: "Can I capture a web page into my design?",
			answer:
				"The URL-to-screenshot tool lets you paste any link, grab a high-res capture, and drop it straight into your project with auto-scaling and masks.",
		},
		{
			question: "How do exports work?",
			answer:
				"Create once and export as PNG, SVG, GIF, MP4, or copy the React code. You control frame sizes, animation duration, and render quality from the control panel.",
		},
		{
			question: "Can I save and manage multiple projects?",
			answer:
				"Sign in with Google to access the project sidebar. You can create unlimited canvases, rename them, reload older versions, and publish shareable links.",
		},
		{
			question: "Is there a team or client workflow?",
			answer:
				"We support multi-device previews, exported code handoffs, and collaboration via shared project links today. Real-time co-editing is on the roadmap.",
		},
		{
			question: "Do I need to pay to get started?",
			answer:
				"The playground is free. Upgrading to kixi PRO unlocks advanced exports, priority rendering, increased storage, and upcoming automation features.",
		},
		{
			question: "Which devices are supported?",
			answer:
				"The editor is optimized for desktop and large tablets. Small screens will see a prompt asking you to switch to a bigger display so the timeline and control panels have room.",
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
