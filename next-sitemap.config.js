/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: "https://kixi.app",
	generateRobotsTxt: true,
	exclude: ["/account", "/app", "/admin/*", "/p/*", "/server-sitemap.xml"],
	additionalPaths: async (config) => {
		const fs = require("fs");
		const path = require("path");

		try {
			// Read blogs file
			const blogsPath = path.join(__dirname, "content/blogs/blogs.js");
			if (!fs.existsSync(blogsPath)) return [];

			const fileContent = fs.readFileSync(blogsPath, "utf8");

			// Extract titles using regex
			// Matches title: "Something"
			const titleRegex = /title:\s*"([^"]+)"/g;
			let match;
			const paths = [];
			while ((match = titleRegex.exec(fileContent)) !== null) {
				const title = match[1];
				const slug = title
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-+|-+$/g, "");

				paths.push({
					loc: `/blog/${slug}`,
					changefreq: "weekly",
					priority: 0.7,
					lastmod: new Date().toISOString(),
				});
			}
			return paths;
		} catch (error) {
			console.error("Error generating blog paths for sitemap:", error);
			return [];
		}
	},
};
