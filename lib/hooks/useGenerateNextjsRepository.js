import { useMutation } from "@tanstack/react-query";
import JSZip from "jszip";

const useGenerateNextjsRepository = () => {
	const generateRepository = useMutation({
		mutationFn: async ({
			componentName,
			componentCode,
			description = "A modern Next.js project",
			category = "templates",
		}) => {
			const zip = new JSZip();

			// Get the category directory name
			const getCategoryDirectory = (category) => {
				switch (category) {
					case "landing":
						return "LandingPages";
					case "payment":
						return "PaymentPages";
					case "hero":
						return "HeroSections";
					case "onboarding":
						return "OnboardingPages";
					case "portfolio":
						return "PortfolioTemplates";
					default:
						return "Templates";
				}
			};

			const categoryDir = getCategoryDirectory(category);

			// Create app directory
			const appDir = zip.folder("app");
			const categoryFolder = appDir.folder(categoryDir);

			componentName, componentCode, "code";
			// Add component file
			categoryFolder.file(`${componentName}.jsx`, componentCode);

			// Add app files
			appDir.file(
				"layout.jsx",
				`import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '${componentName}',
  description: '${description}',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`
			);

			appDir.file(
				"page.jsx",
				`import ${componentName} from './${categoryDir}/${componentName}'

export default function Home() {
  return <${componentName} />
}`
			);

			appDir.file(
				"globals.css",
				`@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
    to bottom,
    transparent,
    rgb(var(--background-end-rgb))
  )
  rgb(var(--background-start-rgb));
}`
			);

			// Create styles directory and add animations.css
			const stylesDir = zip.folder("styles");
			stylesDir.file(
				"animations.css",
				`/* GSAP Animations */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
}

.fade-in.active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* Custom Animations */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.float {
  animation: float 3s ease-in-out infinite;
}`
			);

			// Add config files
			zip.file(
				"package.json",
				JSON.stringify(
					{
						name: componentName.toLowerCase(),
						version: "0.1.0",
						private: true,
						scripts: {
							dev: "next dev",
							build: "next build",
							start: "next start",
							lint: "next lint",
						},
						dependencies: {
							next: "15.0.0",
							react: "^19.0.0",
							"react-dom": "^19.0.0",
							"framer-motion": "^11.0.8",
							gsap: "^3.12.5",
							"lucide-react": "^0.344.0",
							"react-syntax-highlighter": "^15.5.0",
							jszip: "^3.10.1",
							"react-icons": "^5.0.1",
						},
						devDependencies: {
							autoprefixer: "^10.4.18",
							postcss: "^8.4.35",
							tailwindcss: "^3.4.1",
						},
					},
					null,
					2
				)
			);

			zip.file(
				"tailwind.config.js",
				`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  plugins: [],
}`
			);

			zip.file(
				"next.config.js",
				`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig`
			);

			zip.file(
				"postcss.config.js",
				`module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
			);

			zip.file(
				"README.md",
				`# ${componentName} Template
## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- Next.js
- Tailwind CSS
- GSAP
- Framer Motion
- React Syntax Highlighter`
			);

			return await zip.generateAsync({ type: "blob" });
		},
	});

	const downloadRepository = (zipBlob, componentName) => {
		const url = window.URL.createObjectURL(zipBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${componentName.toLowerCase()}-nextjs.zip`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	};

	return {
		generateRepository: generateRepository.mutateAsync,
		isLoading: generateRepository.isPending,
		error: generateRepository.error,
		downloadRepository,
	};
};

export default useGenerateNextjsRepository;
