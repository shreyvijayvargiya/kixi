import { useMutation } from "@tanstack/react-query";
import JSZip from "jszip";

const useGenerateViteRepository = () => {
	const generateRepository = useMutation({
		mutationFn: async ({
			componentName,
			componentCode,
			description = "A modern Vite + React project",
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

			// Create src directory
			const srcDir = zip.folder("src");
			const categoryFolder = srcDir.folder(categoryDir);

			// Add component file
			categoryFolder.file(`${componentName}.jsx`, componentCode);

			// Add main files
			srcDir.file(
				"App.jsx",
				`import ${componentName} from './${categoryDir}/${componentName}'
import './App.css'

function App() {
  return (
    <div className="app">
      <${componentName} />
    </div>
  )
}

export default App`
			);

			srcDir.file(
				"main.jsx",
				`import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`
			);

			srcDir.file(
				"App.css",
				`@tailwind base;
@tailwind components;
@tailwind utilities;

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}`
			);

			srcDir.file(
				"index.css",
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
						private: true,
						version: "0.0.0",
						type: "module",
						scripts: {
							dev: "vite",
							build: "vite build",
							preview: "vite preview",
						},
						dependencies: {
							react: "^18.2.0",
							"react-dom": "^18.2.0",
							"framer-motion": "^11.0.8",
							gsap: "^3.12.5",
							"lucide-react": "^0.344.0",
							"react-syntax-highlighter": "^15.5.0",
							"react-icons": "^5.0.1",
						},
						devDependencies: {
							"@types/react": "^18.2.55",
							"@types/react-dom": "^18.2.19",
							"@vitejs/plugin-react": "^4.2.1",
							autoprefixer: "^10.4.18",
							postcss: "^8.4.35",
							tailwindcss: "^3.4.1",
							vite: "^5.1.0",
						},
					},
					null,
					2
				)
			);

			zip.file(
				"tailwind.config.js",
				`/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
			);

			zip.file(
				"vite.config.js",
				`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`
			);

			zip.file(
				"postcss.config.js",
				`export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
			);

			zip.file(
				"index.html",
				`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${componentName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
			);

			zip.file(
				"README.md",
				`# ${componentName}

A modern template built with Vite, React, and Tailwind CSS.

## Features

- Modern UI with Tailwind CSS
- Smooth animations with GSAP
- Responsive design
- Dark mode support
- Code syntax highlighting

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Technologies Used

- Vite
- React
- Tailwind CSS
- GSAP
- Framer Motion`
			);

			return await zip.generateAsync({ type: "blob" });
		},
	});

	const downloadRepository = (zipBlob, componentName) => {
		const url = window.URL.createObjectURL(zipBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${componentName.toLowerCase()}-vite.zip`;
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

export default useGenerateViteRepository;
