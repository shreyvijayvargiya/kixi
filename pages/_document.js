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
						content="gettemplate, templates, reactjs template, nextjs templates, react code, ui libraries, tailwind, portfolio, landing page, web development"
					/>
					<meta
						name="description"
						content="gettemplate is the collection of react tailwind, next code templates such as landing pages, portfolios, onboardings, payment pages, animations etc"
					/>

					{/* Favicon and App Icons */}
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="https://gettemplate.website/logo.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="https://gettemplate.website/logo.png"
					/>
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="https://gettemplate.website/logo.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="192x192"
						href="https://gettemplate.website/logo.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="512x512"
						href="https://gettemplate.website/logo.png"
					/>

					{/* Manifest */}
					<link rel="manifest" href="/manifest.json" />

					{/* Default Open Graph Tags */}
					<meta property="og:type" content="website" />
					<meta property="og:site_name" content="gettemplate" />
					<meta property="og:locale" content="en_US" />
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
						data-domain="gettemplate.website"
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
			title: "gettemplate - React & Next.js Templates",
			description:
				"gettemplate is the collection of react tailwind, next code templates such as landing pages, portfolios, onboardings, payment pages, animations etc",
			bannerImage: "https://gettemplate.website/logo.png",
			bannerImageUrl: "https://gettemplate.website/logo.png",
			thumbnail: "https://gettemplate.website/logo.png",
		};
	} else if (ctx.pathname === "/templates") {
		logData = {
			title: "gettemplate Templates",
			description:
				"gettemplate is the collection of react tailwind, next code templates such as landing pages, portfolios, onboardings, payment pages, animations etc",
			bannerImage: "https://gettemplate.website/logo.png",
			bannerImageUrl: "https://gettemplate.website/logo.png",
			thumbnail: "https://gettemplate.website/logo.png",
		};
	} else if (ctx.pathname.startsWith("/template/")) {
		logData = {
			title: "gettemplate - React & Next.js Template",
			description: "Check out this nextjs template along with source code",
			bannerImage: "https://gettemplate.website/logo.png",
			bannerImageUrl: "https://gettemplate.website/logo.png",
			thumbnail: "https://gettemplate.website/logo.png",
		};
	} else if (ctx.pathname === "/account") {
		logData = {
			title: "Account - gettemplate",
			description: "Manage your gettemplate account and subscriptions",
			bannerImage: "https://gettemplate.website/logo.png",
			bannerImageUrl: "https://gettemplate.website/logo.png",
			thumbnail: "https://gettemplate.website/logo.png",
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
