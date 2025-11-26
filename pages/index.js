import Head from "next/head";
import AnimatedGradientGenerator from "../app/Apps/AnimatedGradientGenerator";

export default function Home() {
	return (
		<>
			<Head>
				<link
					rel="icon"
					href="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYkSFej94aXep3F9GfAyq0Rdi1PvjVE5n8tmCr"
					type="image/png"
				/>
				<title>kixi - creative design app</title>
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
				<meta property="og:title" content="kixi - creative design app" />
				<meta
					property="og:description"
					content="Create beautiful animated gradients with kixi. Generate custom gradient animations for your projects."
				/>
				<meta
					property="og:image"
					content="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYmGOp1T5dTRYUQ1ZJNSXlV8uxqtfcEz9rp62L"
				/>
				<meta property="og:url" content="https://kixi.app" />
				<meta property="og:site_name" content="kixi" />

				{/* Twitter */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="kixi - creative design app" />
				<meta
					name="twitter:description"
					content="Create beautiful animated gradients with kixi. Generate custom gradient animations for your projects."
				/>
				<meta
					name="twitter:image"
					content="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYmGOp1T5dTRYUQ1ZJNSXlV8uxqtfcEz9rp62L"
				/>

				{/* Canonical URL */}
				<link rel="canonical" href="https://kixi.app" />
			</Head>
			<AnimatedGradientGenerator />
		</>
	);
}
