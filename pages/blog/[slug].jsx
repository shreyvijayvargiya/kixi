import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import fs from "fs";
import Head from "next/head";
import SingleBlog from "../../components/SingleBlog";
import { blogs } from "../../content/blogs/blogs";

const blogsDir = path.join(process.cwd(), "content/blogs");

export async function getStaticPaths() {
	const files = fs.readdirSync(blogsDir);
	const paths = files
		.filter((file) => file.endsWith(".md"))
		.map((file) => ({
			params: { slug: file.replace(/\.md$/, "") },
		}));
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	const { slug } = params;
	const filePath = path.join(blogsDir, `${slug}.md`);
	const fileContents = fs.readFileSync(filePath, "utf-8");

	const { data, content } = matter(fileContents);

	const processedContent = await remark().use(html).process(content);
	const contentHtml = processedContent.toString();

	// Find blog metadata from blogs.js
	const blogData = blogs.find((blog) => {
		const blogSlug = blog.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
		return blogSlug === slug;
	});

	return {
		props: {
			data: data,
			contentHtml: contentHtml,
			blogData: blogData,
			slug: slug,
		},
	};
}

export default function BlogPage({ data, contentHtml, blogData, slug }) {
	const title = blogData?.title || slug.replace(/-/g, " ");
	const description = blogData?.description || "Read our latest blog post";
	const bannerImage = blogData?.banner || "/kixi-logo";
	const tags = blogData?.tags || [];
	const date = blogData?.date || data?.date;

	return (
		<>
			<Head>
				<title>{title} | kixi</title>
				<meta name="description" content={description} />
				<meta name="keywords" content={tags.join(", ")} />
				<meta name="author" content="kixi" />
				<meta name="date" content={date} />

				{/* Open Graph / Facebook */}
				<meta property="og:type" content="article" />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={bannerImage} />
				<meta property="og:url" content={`https://kixi.app/blog/${slug}`} />
				<meta property="og:site_name" content="kixi" />

				{/* Twitter */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:title" content={title} />
				<meta property="twitter:description" content={description} />
				<meta property="twitter:image" content={bannerImage} />

				{/* Additional SEO */}
				<meta name="robots" content="index, follow" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="canonical" href={`https://kixi.app/blog/${slug}`} />

				{/* Structured Data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "BlogPosting",
							headline: title,
							description: description,
							image: bannerImage,
							author: {
								"@type": "Organization",
								name: "kixi",
								url: "https://kixi.app",
							},
							publisher: {
								"@type": "Organization",
								name: "kixi",
								logo: {
									"@type": "ImageObject",
									url: "https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYXsV5GymbVd2Mtl4Hmexp9KNSOJIvg1WqDs0k",
								},
							},
							datePublished: date,
							dateModified: date,
							mainEntityOfPage: {
								"@type": "WebPage",
								"@id": `https://kixi.app/blog/${slug}`,
							},
						}),
					}}
				/>
			</Head>
			<SingleBlog data={data} contentHtml={contentHtml} />
		</>
	);
}
