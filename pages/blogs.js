import React, { useState } from "react";
import { useRouter } from "next/router";
import { blogs } from "../content/blogs/blogs";
import { PlusIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../modules/Navbar";

export default function BlogsPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");

	// Email subscription mutation
	const emailSubscriptionMutation = useMutation({
		mutationFn: async (emailData) => {
			await addDoc(collection(db, "gt-email-subs"), {
				email: emailData.email,
				timestamp: new Date().toISOString(),
				createdAt: new Date(),
			});
		},
		onSuccess: () => {
			toast.success("Successfully subscribed!");
			setEmail("");
		},
		onError: (error) => {
			toast.error("Failed to subscribe. Please try again.");
			console.error("Email subscription error:", error);
		},
	});

	const handleEmailSubscription = () => {
		if (!email || !email.includes("@")) {
			toast.error("Please enter a valid email address");
			return;
		}
		emailSubscriptionMutation.mutate({ email });
	};

	return (
		<div className="max-w-7xl mx-auto p-4 border-l border-r border-dashed border-zinc-200 px-4 min-h-screen bg-stone-50/20">
			<Navbar />
			<div className="pt-20">
				<div className="max-w-5xl mx-auto group text-left mb-8 flex justify-between items-center flex-wrap">
					<p className="font-mono">Blogs</p>
					<div className="flex gap-2 items-start justify-center">
						<div className="flex flex-col">
							<input
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && handleEmailSubscription()
								}
								className="flex-1 min-w-48 px-2 py-1.5 text-xs border border-zinc-200 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors bg-white"
							/>
						</div>
						<button
							onClick={handleEmailSubscription}
							disabled={emailSubscriptionMutation.isPending}
							className="px-2 py-2 bg-zinc-900 text-white text-xs rounded-full hover:bg-black transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{emailSubscriptionMutation.isPending
								? "Subscribing..."
								: "Subscribe"}
						</button>
					</div>
				</div>
				<div
					className={`relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 items-stretch max-w-5xl mx-auto`}
				>
					{blogs.map((blog) => (
						<a
							key={blog.title}
							href={`/blog/${blog.title
								.toLowerCase()
								.replace(/[^a-z0-9]+/g, "-")
								.replace(/^-+|-+$/g, "")}`}
						>
							<a className="relative hover:bg-white block h-full border border-zinc-200 border-dashed hover:shadow-xl hover:shadow-zinc-200 transition-shadow duration-300">
								<div
									className={`absolute -top-2 -left-2 w-4 h-4 flex items-center justify-center`}
								>
									<PlusIcon size={16} className="text-stone-200" />
								</div>
								{blog.banner && (
									<img
										src={blog.banner}
										alt={blog.title}
										className="w-full h-48 object-cover mb-4"
									/>
								)}
								<div className="p-4">
									<p className="text-gray-500 text-xs mb-4">{blog.date}</p>
									<h2 className="text-xl font-semibold my-4">{blog.title}</h2>
									<p className="text-gray-600 text-sm my-4 line-clamp-3">
										{blog.description}
									</p>
								</div>
							</a>
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
