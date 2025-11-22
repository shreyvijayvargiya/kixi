import React, { useState } from "react";
import { PlusIcon } from "lucide-react";

const EmailSubscription = () => {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleEmailSubscription = () => {
		if (!email || !email.includes("@")) {
			alert("Please enter a valid email address");
			return;
		}

		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false);
			setIsSuccess(true);
			setEmail("");

			// Reset success state after 3 seconds
			setTimeout(() => {
				setIsSuccess(false);
			}, 3000);
		}, 1000);
	};

	return (
		<section className="py-16 border-t border-dashed border-zinc-100 relative bg-gradient-to-br from-zinc-50/50 to-white gradientAnimation">
			<div
				className={`absolute -top-2 -left-2 w-4 h-4 flex items-center justify-center`}
			>
				<PlusIcon size={16} className="text-stone-200" />
			</div>
			<div className="flex gap-2 items-start justify-center">
				<div className="flex flex-col">
					<input
						type="email"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && handleEmailSubscription()}
						className="flex-1 px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors bg-white"
					/>
				</div>
				<button
					onClick={handleEmailSubscription}
					disabled={isSubmitting}
					className={`px-4 py-2 text-xs rounded-xl transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
						isSuccess
							? "bg-green-600 text-white hover:bg-green-700"
							: "bg-zinc-900 text-white hover:bg-black"
					}`}
				>
					{isSubmitting
						? "Subscribing..."
						: isSuccess
							? "Subscribed!"
							: "Subscribe"}
				</button>
			</div>
			<p className="text-xs text-center text-zinc-500 mt-2 leading-relaxed">
				New releases almost everyday
			</p>
		</section>
	);
};

export default EmailSubscription;
