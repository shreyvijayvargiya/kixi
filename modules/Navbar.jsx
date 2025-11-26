import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { BiMoney } from "react-icons/bi";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { checkChangelogUpdate } from "../redux/slices/changelogSlice";

// Latest changelog ID - update this when adding new changelog entries
const LATEST_CHANGELOG_ID = "changelog-2025-11-2"; // Use date or UUID from first item

const Navbar = () => {
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();
	const { isViewed, lastViewedChangelogId } = useSelector(
		(state) => state.changelog
	);
	const { subscriptionStatus } = useSelector((state) => state.auth);

	// Check for new changelog updates on mount
	useEffect(() => {
		dispatch(checkChangelogUpdate(LATEST_CHANGELOG_ID));
	}, [dispatch]);

	// Check if there's a new changelog
	const hasNewChangelog =
		!isViewed || lastViewedChangelogId !== LATEST_CHANGELOG_ID;

	return (
		<nav className="sticky top-0 left-0 right-0 px-8 md:px-0 bg-opacity-80 backdrop-blur-sm z-50 border-b border-dashed border-zinc-200">
			<div className="flex items-center justify-between mx-auto md:max-w-7xl w-full p-2 md:border-l md:border-r border-zinc-200 border-dashed">
				<div className="flex items-center">
					<div
						className="cursor-pointer hover:bg-zinc-100 rounded-xl p-1.5"
						onClick={() => router.push("/")}
					>
						<img src="/kixi-logo" alt="kixi" className="w-8 h-8" />
					</div>
					<a
						href="/blogs"
						className="text-xs font-semibold transition-colors text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100"
					>
						Blogs
					</a>
					<a
						href="/templates"
						className="text-xs font-semibold transition-colors text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100"
					>
						Templates
					</a>
					<a
						href="/premium-templates"
						className="text-xs font-semibold transition-colors text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100"
					>
						Premium Templates
					</a>
				</div>
				<div className="items-center gap-2 md:flex hidden">
					<div className="items-center gap-2 lg:flex hidden text-xs">
						<a
							href="/changelog"
							className="relative flex gap-2 text-xs font-semibold items-center text-pink-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-pink-100"
						>
							{hasNewChangelog && (
								<span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full animate-pulse">
									!
								</span>
							)}
							{!hasNewChangelog && (
								<span className="p-1 rounded-full animate-pulse bg-pink-400 w-2 h-2 ring-2 ring-pink-100"></span>
							)}
							Releases
						</a>
						{subscriptionStatus === "active" ? (
							<div className="flex gap-2 items-center px-3 py-2 rounded-xl bg-green-50 border border-green-200">
								<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
								<span className="text-xs font-semibold text-green-700">
									PRO plan active
								</span>
							</div>
						) : (
							<button
								onClick={() => router.push("/pricing")}
								className="flex gap-2 items-center group shadow font-semibold hover:shadow-xl relative justify-center overflow-hidden rounded-xl bg-zinc-800 px-3 py-2 text-white duration-300 hover:bg-black text-xs"
							>
								<BiMoney className="w-4 h-4 text-zinc-200 group-hover:text-zinc-100 group-hover:rotate-180 rotate-0 duration-100 ease-in" />
								Buy PRO
							</button>
						)}
						<GoogleLoginButton />
					</div>
				</div>
			</div>
			{/* Mobile Menu Dropdown */}
			{showMobileMenu && (
				<div className="md:hidden fixed inset-x-0 top-[72px] bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-lg z-50">
					<div className="flex flex-col space-y-2 container mx-auto px-6 py-6">
						<div className="flex items-center">
							<div
								className="cursor-pointer hover:bg-zinc-100 rounded-xl p-1.5"
								onClick={() => router.push("/")}
							>
								<img src="/kixi-logo" alt="kixi" className="w-8 h-8" />
							</div>
							<a
								href="/blogs"
								className="text-xs font-semibold transition-colors text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100"
							>
								Blogs
							</a>
							<a
								href="/templates"
								className="text-xs font-semibold transition-colors text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100"
							>
								Templates
							</a>
							<a
								href="/premium-templates"
								className="text-xs font-semibold transition-colors text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-100"
							>
								Premium Templates
							</a>
						</div>
						<div className="items-center gap-2 md:flex hidden">
							<div className="items-center gap-2 lg:flex hidden text-xs">
								<a
									href="/changelog"
									className="relative flex gap-2 text-xs font-semibold items-center text-pink-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-pink-100"
								>
									{hasNewChangelog && (
										<span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
											!
										</span>
									)}
									{!hasNewChangelog && (
										<span className="p-1 rounded-full animate-pulse bg-pink-400 w-2 h-2 ring-2 ring-pink-100"></span>
									)}
									Releases
								</a>
								{subscriptionStatus === "active" ? (
									<div className="flex gap-2 items-center px-3 py-2 rounded-xl bg-green-50 border border-green-200">
										<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
										<span className="text-xs font-semibold text-green-700">
											PRO plan active
										</span>
									</div>
								) : (
									<button
										onClick={() => router.push("/pricing")}
										className="flex gap-2 items-center group font-semibold hover:shadow-xl relative justify-center overflow-hidden rounded-xl bg-zinc-800 px-3 py-2 text-white duration-300 hover:bg-black text-xs"
									>
										<BiMoney className="w-4 h-4 text-zinc-200 group-hover:text-zinc-100 group-hover:rotate-180 rotate-0 duration-100 ease-in" />
										Buy PRO
									</button>
								)}
								<GoogleLoginButton />
							</div>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
};
export default Navbar;
