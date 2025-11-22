import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
	LogOut,
	User,
	Mail,
	Crown,
	Calendar,
	CreditCard,
	Tag,
	XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import useGoogleAuth from "../lib/hooks/useGoogleAuth";
import { deleteCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import Navbar from "../modules/Navbar";

const AccountPage = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const {
		user,
		isAuthenticated,
		subscriptionStatus,
		subscriptionId,
		subscriptionType,
		price,
		subscriptionStartDate,
		subscriptionEndDate,
		lastWebhookEvent,
	} = useSelector((state) => state.auth);
	const { signOut } = useGoogleAuth();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);

	console.log(lastWebhookEvent?.subscriptionId, "subscriptionStatus");

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/");
		}
	}, [isAuthenticated, router]);

	const handleLogout = async () => {
		try {
			await signOut();
			deleteCookie("userId");
			deleteCookie("userData");
			dispatch(logout());
			toast.success("Logged out successfully");
			router.push("/");
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Error signing out");
		}
	};

	const handleCancelSubscription = async () => {
		if (!subscriptionId) {
			toast.error("No active subscription found");
			return;
		}

		try {
			setIsCancelling(true);
			const response = await fetch("/api/cancel-subscription", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: user.uid,
					subscriptionId: lastWebhookEvent?.subscriptionId,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to cancel subscription");
			}

			toast.success("Subscription cancelled successfully");
			setShowConfirmModal(false);
			// Refresh the page to update the UI
			window.location.reload();
		} catch (error) {
			console.error("Error cancelling subscription:", error);
			toast.error(error.message || "Failed to cancel subscription");
		} finally {
			setIsCancelling(false);
		}
	};

	// Format date helper
	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch (error) {
			return "Invalid date";
		}
	};

	// Format price helper
	const formatPrice = (priceValue) => {
		if (!priceValue) return "N/A";
		return `$${parseFloat(priceValue).toFixed(2)}`;
	};

	// Format subscription type
	const formatSubscriptionType = (type) => {
		if (!type) return "N/A";
		const typeMap = {
			oneTime: "One-time Purchase",
			monthly: "Monthly",
			yearly: "Yearly",
			recurring: "Recurring",
		};
		return typeMap[type] || type;
	};

	// Get status badge color
	const getStatusBadgeColor = (status) => {
		switch (status) {
			case "active":
				return "bg-green-50 text-green-700 border-green-200";
			case "cancelled":
			case "canceled":
				return "bg-red-50 text-red-700 border-red-200";
			case "past_due":
				return "bg-yellow-50 text-yellow-700 border-yellow-200";
			default:
				return "bg-zinc-50 text-zinc-700 border-zinc-200";
		}
	};

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="">
			<Navbar />
			<div className="mx-auto max-w-7xl border-l border-r border-dashed border-zinc-200 min-h-screen">
				{/* Header */}
				<div className="max-w-2xl mx-auto py-20">
					<h1 className="text-2xl font-semibold text-zinc-900">
						Account Settings
					</h1>
					<p className="text-zinc-500 text-sm mt-1">
						Manage your account settings and preferences
					</p>
					<br />
					<div className="">
						<div className="grid grid-cols-1 md:grid-cols-1 gap-6">
							{/* Profile Section */}
							<div className="md:col-span-2 space-y-6">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="bg-white rounded-xl border border-zinc-200 border-dashed p-6 space-y-4"
								>
									<div className="flex items-center flex-wrap gap-2">
										{user?.photoURL ? (
											<img
												src={user.photoURL}
												alt={user.displayName}
												className="w-10 h-10 rounded-full border-2 border-zinc-100"
											/>
										) : (
											<div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center border-2 border-zinc-100">
												<span className="text-lg text-white">
													{user?.displayName?.[0]?.toUpperCase()}
												</span>
											</div>
										)}
										<div>
											<h2 className="text-lg font-semibold text-zinc-900">
												{user?.displayName}
											</h2>
										</div>
									</div>
									<div className="space-y-4">
										<div className="flex items-center gap-3">
											<User className="w-5 h-5 text-zinc-500" />
											<div>
												<p className="text-sm text-zinc-500">Display Name</p>
												<p className="text-zinc-900">{user?.displayName}</p>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<Mail className="w-5 h-5 text-zinc-500" />
											<div>
												<p className="text-sm text-zinc-500">Email Address</p>
												<p className="text-zinc-900 break-all md:break-normal">
													{user?.email}
												</p>
											</div>
										</div>
									</div>
									<button
										onClick={handleLogout}
										className="w-fit my-2 flex items-center justify-center gap-2 bg-red-50/50 hover:bg-red-100 text-red-600 px-2 py-1.5 text-sm rounded-xl transition-colors"
									>
										<LogOut className="w-4 h-4" />
										Sign Out
									</button>
								</motion.div>

								{/* Subscription Section */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
									className="bg-white rounded-xl border border-zinc-200 border-dashed p-6 space-y-4"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Crown className="w-5 h-5 text-yellow-500" />
											<h2 className="text font-semibold text-zinc-900">
												Subscription Details
											</h2>
										</div>
										{subscriptionStatus && (
											<span
												className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(
													subscriptionStatus
												)}`}
											>
												{subscriptionStatus.charAt(0).toUpperCase() +
													subscriptionStatus.slice(1)}
											</span>
										)}
									</div>

									{subscriptionId ? (
										<div className="space-y-4">
											<div className="flex items-center gap-3">
												<Tag className="w-5 h-5 text-zinc-500" />
												<div className="flex-1">
													<p className="text-sm text-zinc-500">
														Subscription Type
													</p>
													<p className="text-zinc-900">
														{formatSubscriptionType(subscriptionType)}
													</p>
												</div>
											</div>

											<div className="flex items-center gap-3">
												<CreditCard className="w-5 h-5 text-zinc-500" />
												<div className="flex-1">
													<p className="text-sm text-zinc-500">Price</p>
													<p className="text-zinc-900">{formatPrice(price)}</p>
												</div>
											</div>

											<div className="flex items-center gap-3">
												<Calendar className="w-5 h-5 text-zinc-500" />
												<div className="flex-1">
													<p className="text-sm text-zinc-500">Start Date</p>
													<p className="text-zinc-900">
														{formatDate(subscriptionStartDate)}
													</p>
												</div>
											</div>

											<div className="flex items-center gap-3">
												<Calendar className="w-5 h-5 text-zinc-500" />
												<div className="flex-1">
													<p className="text-sm text-zinc-500">End Date</p>
													<p className="text-zinc-900">
														{formatDate(subscriptionEndDate)}
													</p>
												</div>
											</div>

											{subscriptionStatus === "active" && (
												<button
													onClick={() => setShowConfirmModal(true)}
													className="w-fit my-2 flex items-center justify-center gap-2 bg-red-50/50 hover:bg-red-100 text-red-600 px-2 py-1.5 text-sm rounded-xl transition-colors"
												>
													<XCircle className="w-4 h-4" />
													Cancel Subscription
												</button>
											)}
											{/* <br />
											<a
												href="mailto:shreyvijayvargiya26@gmail.com"
												target="_blank"
												rel="noopener noreferrer"
												className="w-fit p-2 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-sm"
											>
												Contact Me
											</a> */}
										</div>
									) : (
										<div className="py-4">
											<p className="text-sm text-zinc-500 mb-4">
												You don't have an active subscription.
											</p>
											<button
												onClick={() => router.push("/pricing")}
												className="px-4 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium"
											>
												View Pricing Plans
											</button>
										</div>
									)}
								</motion.div>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
			</div>
			<footer className="mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-t border-zinc-200 border-dashed">
				<div className="flex items-center justify-between w-full mx-auto max-w-7xl p-10 border-l border-r border-zinc-200 border-dashed">
					<div className="flex flex-col gap-4">
						<div>
							<p className="text-lg text-black font-medium">gettemplate</p>
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
								© 2025 gettemplate. All rights reserved.
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
							href="mailto:connect@ihatereading.in"
							className="text-zinc-600 hover:text-zinc-900 transition-colors"
						>
							Contact Us
						</a>
					</div>
				</div>
			</footer>

			{/* Confirmation Modal */}
			<AnimatePresence>
				{showConfirmModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-white rounded-xl p-6 max-w-lg w-full mx-4"
						>
							<h3 className="text-xl font-semibold text-zinc-900 mb-4">
								Cancel Subscription
							</h3>
							<p className="text-zinc-600 mb-6">
								Are you sure you want to cancel your subscription? This action
								cannot be undone.
							</p>
							<div className="flex gap-3 justify-start">
								<button
									onClick={handleCancelSubscription}
									className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
									disabled={isCancelling}
								>
									{isCancelling ? (
										<>
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
											Cancelling...
										</>
									) : (
										"Yes, Cancel Subscription"
									)}
								</button>
								<button
									onClick={() => setShowConfirmModal(false)}
									className="px-4 py-2 text-zinc-600 hover:text-zinc-900 border border-zinc-200 border-dashed rounded-xl bg-zinc-50 transition-colors"
									disabled={isCancelling}
								>
									No, Keep Subscription
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default AccountPage;
