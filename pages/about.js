import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import FeaturesSectionModal from "../app/Apps/FeaturesSectionModal";

const About = () => {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(true);

	const handleClose = () => {
		setIsModalOpen(false);
		router.push("/");
	};

	// Ensure the modal reopens if the user navigates back to this page
	useEffect(() => {
		setIsModalOpen(true);
	}, []);

	return (
		<>
			<Head>
				<link
					rel="icon"
					href="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYkSFej94aXep3F9GfAyq0Rdi1PvjVE5n8tmCr"
					type="image/png"
				/>
				<title>About kixi – creative design app</title>
				<meta
					name="description"
					content="Learn what makes kixi the fastest way to design animated gradients, collaborate, and export production-ready assets."
				/>
				<meta
					name="keywords"
					content="about kixi, gradient editor, animation tools, design platform"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="index, follow" />

				<meta property="og:type" content="website" />
				<meta property="og:title" content="About kixi – creative design app" />
				<meta
					property="og:description"
					content="Discover the product philosophy behind kixi and explore its signature features."
				/>
				<meta
					property="og:image"
					content="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYmGOp1T5dTRYUQ1ZJNSXlV8uxqtfcEz9rp62L"
				/>
				<meta property="og:url" content="https://kixi.app/about" />
				<meta property="og:site_name" content="kixi" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="About kixi – creative design app" />
				<meta
					name="twitter:description"
					content="See how kixi helps you create gradients, animate assets, and export anywhere."
				/>
				<meta
					name="twitter:image"
					content="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYmGOp1T5dTRYUQ1ZJNSXlV8uxqtfcEz9rp62L"
				/>

				<link rel="canonical" href="https://kixi.app/about" />
			</Head>

			<div className="min-h-screen bg-stone-50">
				<FeaturesSectionModal isOpen={isModalOpen} onClose={handleClose} />
			</div>
		</>
	);
};

export default About;
