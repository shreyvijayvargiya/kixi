import { useEffect } from "react";
import SubscriptionModal from "../components/SubscriptionModal";
import { useRouter } from "next/router";
import Head from "next/head";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useSelector, useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { setSubscriptionStatus } from "../redux/slices/authSlice";

const SubscriptionMeta = () => (
	<Head>
		<title>kixi - Pricing Page</title>
		<meta
			name="description"
			content="Upgrade to PRO and get access to all premium templates, priority support, unlimited downloads, and unlimited projects."
		/>
		<meta property="og:title" content="Upgrade to PRO - kixi" />
		<meta
			property="og:description"
			content="Upgrade to PRO and get access to all premium templates, priority support, unlimited downloads, and unlimited projects."
		/>
		<meta property="og:type" content="website" />
		<meta property="og:url" content="https://kixi.app/subscription" />
		<meta
			property="og:image"
			content="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYXsV5GymbVd2Mtl4Hmexp9KNSOJIvg1WqDs0k"
		/>
		<meta property="og:image:width" content="32" />
		<meta property="og:image:height" content="32" />
		<meta property="og:image:type" content="image/svg+xml" />

		{/* Twitter Card */}
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content="Upgrade to PRO - kixi" />
		<meta
			name="twitter:description"
			content="Upgrade to PRO and get access to all premium templates, priority support, unlimited downloads, and unlimited projects."
		/>
		<meta
			name="twitter:image"
			content="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYXsV5GymbVd2Mtl4Hmexp9KNSOJIvg1WqDs0k"
		/>
	</Head>
);

const BuyPro = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);

	// Handle subscription redirect and refresh user data
	useEffect(() => {
		const checkSubscriptionStatus = async () => {
			if (router.query.subscription === "true" && user?.uid) {
				try {
					// Fetch latest user data from Firestore
					const userRef = doc(db, "users", user.uid);
					const userDoc = await getDoc(userRef);

					if (userDoc.exists()) {
						const userData = userDoc.data();

						// Update Redux store with latest subscription data
						dispatch(
							setSubscriptionStatus({
								subscriptionStatus: userData.subscriptionStatus || null,
								subscriptionId: userData.subscriptionId || null,
								subscriptionType: userData.subscriptionType || null,
								price: userData.price || null,
								subscriptionStartDate: userData.subscriptionStartDate || null,
								subscriptionEndDate: userData.subscriptionEndDate || null,
								lastWebhookEvent: userData.lastWebhookEvent || null,
							})
						);

						// Remove query parameter to clean up URL
						router.replace("/pricing", undefined, { shallow: true });
					}
				} catch (error) {
					console.error("Error fetching subscription status:", error);
				}
			}
		};

		checkSubscriptionStatus();
	}, [router.query.subscription, user?.uid, dispatch, router]);

	return (
		<div className="bg-stone-50">
			<nav className="fixed top-2 bg-white rounded-xl left-0 right-0 p-1 z-40 border border-zinc-200 max-w-4xl mx-auto">
				<div className="flex items-center justify-between flex-wrap text-xs">
					<div className="flex items-center">
						<div
							className="cursor-pointer font-semibold text-lg hover:bg-zinc-100 rounded-xl p-1.5 bg-gradient-to-tr from-white to-pink-600 bg-clip-text text-transparent"
							onClick={() => router.push("/")}
						>
							kixi
						</div>

						<div className="items-center gap-1 lg:flex hidden ml-4">
							<a
								href="/app"
								className="cursor-pointer text-xs font-semibold transition-colors text-zinc-100 bg-black hover:text-white px-3 py-2 rounded-xl hover:font-semibold hover:shadow-xl"
							>
								Try App
							</a>
							<a
								href="/blogs"
								className="text-xs font-semibold transition-colors text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100"
							>
								Blogs
							</a>
						</div>
					</div>

					<div className="items-center gap-2 lg:flex hidden text-xs">
						{/* <a
							href="/changelog"
							className="relative flex gap-2 text-xs font-semibold items-center text-pink-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-pink-100"
						>
							<span className="p-1 rounded-full animate-pulse bg-pink-400 w-2 h-2 ring-2 ring-pink-100"></span>
							Releases
						</a> */}

						<GoogleLoginButton />
					</div>
				</div>
			</nav>

			<SubscriptionMeta />
			<SubscriptionModal />
			<footer
				className={`mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative transition-all duration-300
				`}
			>
				<div className="flex items-center justify-between w-full mx-auto max-w-4xl p-10 bg-white rounded-xl">
					<div className="flex flex-col gap-4">
						<div>
							<p className="text-lg text-black font-medium">kixi</p>
							<p className="text-zinc-500 text-xs">
								Discover real world websites code samples
							</p>
						</div>

						<div className="flex flex-col gap-4 mt-6 md:mt-0 text-xs">
							<div className="flex items-center gap-2">
								<span className="text-zinc-500">Made with ❤️ by</span>
								<a
									href="https://ihatereading.in"
									className="text-zinc-800 hover:text-zinc-600 font-medium"
									target="_blank"
									rel="noopener noreferrer"
								>
									iHateReading
								</a>
							</div>
							<p className="text-zinc-400 ">
								© 2025 kixi. All rights reserved.
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-2 text-xs mt-4">
						<a
							href="/templates"
							className="text-zinc-600 hover:text-zinc-900 transition-colors"
						>
							Templates
						</a>
						<a
							href="/premium-templates"
							className="text-zinc-600 hover:text-zinc-900 transition-colors"
						>
							Premium Templates
						</a>
						<a
							href="/blogs"
							className="text-zinc-600 hover:text-zinc-900 transition-colors"
						>
							Blogs
						</a>
						<a
							href="/changelog"
							className="text-zinc-600 hover:text-zinc-900 transition-colors"
						>
							Changelog
						</a>
						<a
							href="/connect"
							className="text-zinc-600 hover:text-zinc-900 transition-colors"
						>
							Connect
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
};
export default BuyPro;
