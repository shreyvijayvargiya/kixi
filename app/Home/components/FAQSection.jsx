import React from "react";
import { Code2, PersonStanding, Sparkles, PenTool, Heart } from "lucide-react";

const WhoCanUse = () => {
	return (
		<section id="how-it-works" className="my-16 w-full max-w-7xl mx-auto px-4">
			<span className="mb-6 border border-zinc-200 rounded-full bg-zinc-100 text-xs  px-4 py-2 flex items-center justify-center w-fit mx-auto">
				<Heart className="w-3 h-3 mr-2" />
				Who can use kixi?
			</span>
			<div className="flex flex-wrap justify-center items-center flex-col relative">
				<div className="mb-4">
					<h3 className="font-semibold text-4xl mb-2 mx-auto text-center bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
						kixi is for everyone
					</h3>
					<p className=" text-zinc-600 max-w-md mx-auto text-center leading-relaxed">
						kixi is built to get inspiration and to use it for your next project
						and product, it saves times, give ideas and inspire to solve
						problems.
					</p>
				</div>
				<div className="flex flex-col justify-start items-start gap-2 hover:gap-0 transition-all duration-100 ease-in bg-zinc-50/10">
					<div className="p-4 flex gap-2 items-center rounded-2xl hover:scale-105 scale-95 transition-all duration-100 ease-in bg-gradient-to-br border border-stone-100 w-full">
						<div className="flex items-center gap-2">
							<div className="w-12 h-12 rounded-2xl text-zinc-800 flex items-center justify-center">
								<Code2 className="w-6 h-6 text-zinc-800" />
							</div>
						</div>
						<div className="">
							<h4 className="font-bold text-zinc-900">Developers</h4>
							<p className="text-zinc-600 text-xs ">
								Get production-ready code and save development time
							</p>
						</div>
					</div>
					<div className="p-4 flex gap-2 items-center rounded-2xl hover:scale-105 scale-95 transition-all duration-100 ease-in bg-gradient-to-br from-green-50/50 to-emerald-50/50 border border-stone-100 w-full">
						<div className="flex items-center gap-2">
							<div className="w-12 h-12 rounded-2xl  text-zinc-800 flex items-center justify-center">
								<PersonStanding className="w-6 h-6 text-zinc-800" />
							</div>
						</div>
						<div className="">
							<h4 className="font-bold text-zinc-900">Designers</h4>
							<p className="text-zinc-600 text-xs ">
								Find inspiration and modern design patterns
							</p>
						</div>
					</div>
					<div className="p-4 flex gap-2 items-center rounded-2xl hover:scale-105 scale-95 transition-all duration-100 ease-in bg-gradient-to-br from-purple-50/50 to-violet-50/50 border border-stone-100 w-full">
						<div className="flex items-center gap-2">
							<div className="w-12 h-12 rounded-2xl text-zinc-800 flex items-center justify-center">
								<Sparkles className="w-6 h-6 text-zinc-800" />
							</div>
						</div>
						<div className="">
							<h4 className="font-bold text-zinc-900">Entrepreneurs</h4>
							<p className="text-zinc-600 text-xs ">
								Launch faster with professional templates
							</p>
						</div>
					</div>
					<div className="p-4 flex gap-2 items-center rounded-2xl hover:scale-105 scale-95 transition-all duration-100 ease-in bg-gradient-to-br from-pink-50/50 to-pink-50/50 border border-stone-100 w-full">
						<div className="flex items-center gap-2">
							<div className="w-12 h-12 rounded-2xl text-zinc-800 flex items-center justify-center">
								<PenTool className="w-6 h-6 text-zinc-800" />
							</div>
						</div>
						<div className="">
							<h4 className="font-bold text-zinc-900">Indie Hackers</h4>
							<p className="text-zinc-600 text-xs ">
								Inspiration to solve modern problems
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default WhoCanUse;
