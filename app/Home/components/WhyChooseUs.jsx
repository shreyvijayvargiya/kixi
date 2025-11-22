import React from "react";
import {
	BsCreditCard,
	BsDownload,
	BsPlayCircle,
	BsCloudUpload,
} from "react-icons/bs";

const HowItWorks = () => {
	const steps = [
		{
			title: "Search the template",
			description:
				"Quikly login and got to templates to search for the template",
			icon: BsCreditCard,
			image:
				"https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYA0iFxZEHGZL8fNSDOxQyIaCqpw719ilKV4ej",
		},
		{
			title: "Download the Source Code",
			description: "Download the template code repository for your choice.",
			icon: BsDownload,
			image:
				"https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYyj0ENcSnwDYs1AMchQFyb07I84jWivdH9mO2",
		},
		{
			title: "Customise the Template",
			description:
				"Install dependencies and run the project locally to customise the template for further needs.",
			icon: BsPlayCircle,
			image:
				"https://b4fcijccdw.ufs.sh/f/mVUSE925dTRY9D4vCszjmW83AwLxrBOKas0hEe26Ygzp1Tiu",
		},
		{
			title: "Deploy the project",
			description:
				"Deploy the project to your own domain or Vercel for seamless deployment.",
			icon: BsCloudUpload,
			image:
				"https://b4fcijccdw.ufs.sh/f/mVUSE925dTRY22MQ7QyGv8aYwER3mjJuFHt4rhsTgi0foZBC",
		},
	];

	return (
		<section className="my-16 py-16 group">
			<div className="max-w-4xl mx-auto px-4">
				<div className="text-zinc-900 font-bold text-2xl text-center mb-2 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
					<h4>See how it works</h4>
				</div>
				<p className="text-zinc-600 text-center mb-12 max-w-2xl mx-auto">
					5 steps to quickly build stunning websites
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 hover:gap-4 justify-center gap-6 relative w-full max-w-6xl mx-auto transition-all duration-300 ease-in">
					{steps.map((step, index) => (
						<article
							key={index}
							className="bg-white p-6 rounded-xl hover:shadow-xl hover:shadow-zinc-200 hover:border-zinc-200 text-left border border-zinc-100 transition-all duration-300 relative hover:scale-105"
						>
							<div className="p-3 bg-stone-50 rounded-xl mb-4 w-fit">
								<step.icon className="w-6 h-6 text-zinc-900 group-hover:text-zinc-900 group-hover:rotate-180 transition-all duration-300 ease-in" />
							</div>
							<p className="font-semibold text-zinc-800 mb-2 flex items-center gap-2">
								{step.title}
							</p>
							<p className="text-zinc-600 text-sm leading-relaxed">
								{step.description}
							</p>
							<img
								src={step.image}
								alt={step.title}
								className="w-full border border-zinc-100 mt-4 h-60 object-cover rounded-2xl"
							/>
						</article>
					))}
				</div>
			</div>
		</section>
	);
};

export default HowItWorks;
