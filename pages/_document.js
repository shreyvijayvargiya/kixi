/* eslint-disable @next/next/next-script-for-ga */
import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	constructor() {
		super();
	}
	render() {
		return (
			<Html lang="en">
				<Head>
					{/* Default Meta Tags */}
					<meta charSet="utf-8" />
					<meta name="theme-color" content="#000000" />
					<meta name="msapplication-TileColor" content="#000000" />
					<meta name="robots" content="index, follow" />
					<meta name="author" content="shrey vijayvargiya" />
					<meta
						name="keywords"
						content="kixi, templates, reactjs template, nextjs templates, react code, ui libraries, tailwind, portfolio, landing page, web development"
					/>
					<meta
						name="description"
						content="kixi is the advance creative design tool to create designs and creatives with ease"
					/>
					<meta
						name="keywords"
						content="gradient, animation, generator, kixi, design, tools"
					/>

					{/* Favicon and App Icons */}
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="https://kixi.app/kixi-logo"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="https://kixi.app/kixi-logo"
					/>
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="https://kixi.app/kixi-logo"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="192x192"
						href="https://kixi.app/kixi-logo"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="512x512"
						href="https://kixi.app/kixi-logo"
					/>

					{/* Manifest */}
					<link rel="manifest" href="/manifest.json" />
					<link rel="canonical" href="https://kixi.app" />

					{/* Default Open Graph Tags */}
					<meta property="og:type" content="website" />
					<meta property="og:site_name" content="kixi" />
					<meta property="og:locale" content="en_US" />
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
					{this.props?.logData && (
						<meta property="og:title" content={this.props?.logData?.title} />
					)}
					{this.props?.logData && (
						<meta
							property="og:description"
							content={this.props?.logData?.description}
						/>
					)}
					{this.props?.logData && (
						<meta
							property="og:image"
							content={
								this.props?.logData?.bannerImage ||
								this.props?.logData?.bannerImageUrl ||
								this.props?.logData?.thumbnail
							}
						/>
					)}

					{/* Default Twitter Tags */}
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:site" content="@treyvijay" />
					<meta name="twitter:creator" content="@treyvijay" />
					<meta name="twitter:title" content="kixi - creative design app" />
					<meta
						name="twitter:description"
						content="Create beautiful animated gradients with kixi. Generate custom gradient animations for your projects."
					/>
					<meta
						name="twitter:image"
						content="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYmGOp1T5dTRYUQ1ZJNSXlV8uxqtfcEz9rp62L"
					/>
					{this.props?.logData && (
						<meta name="twitter:title" content={this.props?.logData?.title} />
					)}
					{this.props?.logData && (
						<meta
							name="twitter:description"
							content={this.props?.logData?.description}
						/>
					)}
					{this.props?.logData && (
						<meta
							name="twitter:image"
							content={
								this.props?.logData?.bannerImage ||
								this.props?.logData?.bannerImageUrl ||
								this.props?.logData?.thumbnail
							}
						/>
					)}

					{/* Analytics Scripts */}
					<script
						defer
						data-domain="kixi.app"
						src="https://plausible.io/js/script.js"
					/>
					<script
						async
						src="https://www.googletagmanager.com/gtag/js?id=UA-171687918-1"
					/>

					<script
						defer
						src="https://cloud.umami.is/script.js"
						data-website-id="dee9e1e2-e8cb-4a30-b545-611c2eea3244"
					/>

					{/* AdSense Scripts */}
					<script
						async
						src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9790775004792093"
						crossOrigin="anonymous"
					/>
					<script
						async
						custom-element="amp-ad"
						src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
					/>
				</Head>
				<body
					style={{
						margin: 0,
						WebkitFontSmoothing: "antialiased",
						MozOsxFontSmoothing: "grayscale",
					}}
				>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

MyDocument.getInitialProps = async (ctx) => {
	const originalRenderPage = ctx.renderPage;
	let logData;
	// Set default logData based on pathname
	if (ctx.pathname === "" || ctx.pathname === "/") {
		logData = {
			title: "kixi - React & Next.js Templates",
			description:
				"kixi is the advance creative design tool to create designs and creatives with ease",
			bannerImage: "https://kixi.app/kixi-logo",
			bannerImageUrl: "https://kixi.app/kixi-logo",
			thumbnail: "https://kixi.app/kixi-logo",
		};
	} else if (ctx.pathname === "/templates") {
		logData = {
			title: "kixi Templates",
			description:
				"kixi is the advance creative design tool to create designs and creatives with ease",
			bannerImage: "https://kixi.app/kixi-logo",
			bannerImageUrl: "https://kixi.app/kixi-logo",
			thumbnail: "https://kixi.app/kixi-logo",
		};
	} else if (ctx.pathname.startsWith("/template/")) {
		logData = {
			title: "kixi - creative design app",
			description: "kixi is the advance creative design tool to create designs and creatives with ease",
			bannerImage: "https://kixi.app/kixi-logo",
			bannerImageUrl: "https://kixi.app/kixi-logo",
			thumbnail: "https://kixi.app/kixi-logo",
		};
	} else if (ctx.pathname === "/account") {
		logData = {
			title: "Account - kixi",
			description: "Manage your kixi account and subscriptions",
			bannerImage: "https://kixi.app/kixi-logo",
			bannerImageUrl: "https://kixi.app/kixi-logo",
			thumbnail: "https://kixi.app/kixi-logo",
		};
	}

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App) => (props) => <App {...props} />,
		});

	const initialProps = await Document.getInitialProps(ctx);

	return {
		...initialProps,
		logData,
	};
};
