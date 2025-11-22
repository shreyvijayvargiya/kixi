import React from "react";
import { useRouter } from "next/router";
import { blogs } from "../content/blogs/blogs";
import { ArrowLeft } from "lucide-react";
import Navbar from "../modules/Navbar";

const SingleBlog = ({ data, contentHtml }) => {
	const router = useRouter();

	const slug = router.query.slug;
	const blogData = blogs.find((blog) => {
		const blogSlug = blog.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
		return blogSlug === slug;
	});

	return (
		<div className="prose p-4 max-w-7xl mx-auto border-l border-r border-dashed border-zinc-200 min-h-screen">
			<Navbar />
			<div className="pt-20 max-w-4xl mx-auto">
				<div
					className="w-fit flex items-center gap-1 mb-8 hover:border border-dashed border-zinc-200 p-1 cursor-pointer"
					onClick={() => router.push("/blogs")}
				>
					<ArrowLeft className="w-4 h-4" />
					<span className="text-zinc-900 hover:text-zinc-700 transition-all text-sm whitespace-nowrap">
						Blogs
					</span>
				</div>
				{blogData?.banner && (
					<img
						src={blogData.banner}
						alt={blogData.title}
						className="w-full h-full border border-zinc-100 border-dashed object-contain rounded-md mb-4"
					/>
				)}
				<h1 className="text-4xl font-bold mb-4">
					{router.query.slug.replace(/-/g, " ")}
				</h1>
				<p className="text-gray-500 text-sm mb-6">{blogData.description}</p>
				<p className="text-gray-500 text-sm mb-6">{data.date}</p>
				<div className="flex flex-wrap gap-2 my-2">
					{blogData.tags.map((tag) => (
						<span
							key={tag}
							className="border border-zinc-200 border-dashed text-zinc-800 text-xs px-2 py-1 rounded-full"
						>
							{tag}
						</span>
					))}
				</div>
				<div
					dangerouslySetInnerHTML={{ __html: contentHtml }}
					className="my-2 [&_p]:my-4 [&_h1]:my-4 [&_h2]:my-4 [&_h3]:my-4 [&_h4]:my-4 [&_h5]:my-4 [&_h6]:my-4 [&_a]:text-black [&_a:hover]:text-black [&_a]:underline [&_a]:cursor-pointer [&_li]:list-disc [&_li]:list-inside"
				/>
			</div>
		</div>
	);
};
export default SingleBlog;
