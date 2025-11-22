import React from "react";
import { ArrowRight, FileCode, PlusIcon } from "lucide-react";
import { motion } from "framer-motion";
import router from "next/router";

// Sample templates data
const templates = [
	{
		id: 1,
		name: "E-commerce Landing Page",
		description:
			"Modern e-commerce landing page with product showcase and checkout flow",
		isNew: true,
	},
	{
		id: 2,
		name: "SaaS Dashboard",
		description:
			"Clean SaaS dashboard with analytics and user management features",
		isNew: false,
	},
	{
		id: 3,
		name: "Portfolio Website",
		description:
			"Professional portfolio website with project showcase and contact form",
		isNew: true,
	},
	{
		id: 4,
		name: "Blog Template",
		description: "Responsive blog template with article layout and sidebar",
		isNew: false,
	},
	{
		id: 5,
		name: "Restaurant Website",
		description:
			"Elegant restaurant website with menu display and reservation system",
		isNew: true,
	},
	{
		id: 6,
		name: "Agency Landing Page",
		description:
			"Creative agency landing page with service showcase and team section",
		isNew: false,
	},
	{
		id: 7,
		name: "Mobile App Landing",
		description:
			"Mobile app landing page with feature highlights and download links",
		isNew: true,
	},
	{
		id: 8,
		name: "Corporate Website",
		description:
			"Professional corporate website with company information and contact",
		isNew: false,
	},
];

const TemplatesSection = () => {
	// Filter templates based on active tab
	const filteredTemplates = templates
		.sort(() => 0.5 - Math.random())
		.slice(0, 20);

	return (
		<section
			id="templates"
			className="py-16 border-t border-b border-dashed border-zinc-100 relative"
		>
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
					Categories of Templates
				</h2>
				<p className=" text-zinc-600 text-center mb-12 max-w-2xl mx-auto">
					Discover beautifully crafted templates for every project you need
				</p>

				{/* Templates Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-hidden hidescrollbar items-start gap-4 p-4">
					{filteredTemplates.slice(0, 6).map((template) => {
						return (
							<motion.div
								key={template.id}
								className="flex flex-col min-w-72 h-40 cursor-pointer group relative"
								onClick={() => {
									router.push(
										`/template/${template.name.replaceAll(" ", "-")}`
									);
								}}
							>
								<div className="relative border p-4 border-zinc-100 hover:shadow-xl hover:shadow-zinc-200 rounded-xl shadow-sm transition-all duration-300 h-full bg-stone-50/10">
									<div className="relative mb-2 space-y-2">
										<p className="font-bold text-sm">{template.name}</p>
										<p className="text-zinc-600 text-sm">
											{template.description}
										</p>
									</div>
									{template.isNew && (
										<span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 z-40">
											New
										</span>
									)}
									<div className="flex items-center gap-2 mt-3">
										<ArrowRight className="w-4 h-4" />
										<span className=" font-medium">View Template</span>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
				<div className="flex items-center justify-center mt-6">
					<button
						onClick={() => router.push("/templates")}
						className="group inline-flex items-center font-semibold gap-2 bg-zinc-800 text-white px-2 py-2 text-xs rounded-xl hover:bg-black hover:shadow-xl transition-colors shadow-sm"
					>
						<span>Explore Templates</span>
						<ArrowRight className="w-4 h-4 text-zinc-200 group-hover:rotate-180 rotate-0 transition-all group-hover:text-zinc-100 duration-100 ease-in" />
					</button>
				</div>
			</div>
		</section>
	);
};

export default TemplatesSection;
