import Head from "next/head";
import AnimatedGradientGenerator from "../app/Apps/AnimatedGradientGenerator";

export default function Home() {
	return (
		<>
			<Head>
				<title>kixi - Animated Gradient Generator</title>
				<meta
					name="description"
					content="Create beautiful animated gradients with kixi. Generate custom gradient animations for your projects."
				/>
				<meta
					name="keywords"
					content="gradient, animation, generator, kixi, design, tools"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="index, follow" />

				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta
					property="og:title"
					content="kixi - Animated Gradient Generator"
				/>
				<meta
					property="og:description"
					content="Create beautiful animated gradients with kixi. Generate custom gradient animations for your projects."
				/>
				<meta
					property="og:image"
					content="https://gettemplate.website/kixi-logo.png"
				/>
				<meta property="og:url" content="https://gettemplate.website" />
				<meta property="og:site_name" content="kixi" />

				{/* Twitter */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content="kixi - Animated Gradient Generator"
				/>
				<meta
					name="twitter:description"
					content="Create beautiful animated gradients with kixi. Generate custom gradient animations for your projects."
				/>
				<meta
					name="twitter:image"
					content="https://gettemplate.website/kixi-logo.png"
				/>

				{/* Canonical URL */}
				<link rel="canonical" href="https://gettemplate.website" />
			</Head>
			<AnimatedGradientGenerator />
		</>
	);
}
