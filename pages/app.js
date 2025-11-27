import Head from "next/head";
import AnimatedGradientGenerator from "../app/Apps/AnimatedGradientGenerator";

export default function App() {
	return (
		<>
			<Head>
				<link
					rel="icon"
					href="https://b4fcijccdw.ufs.sh/f/mVUSE925dTRYkSFej94aXep3F9GfAyq0Rdi1PvjVE5n8tmCr"
					type="image/png"
				/>
				<title>kixi - creative design app</title>
				<meta
					name="description"
					content="Create beautiful animated gradients with kixi. Generate custom gradient animations for your projects."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<AnimatedGradientGenerator />
		</>
	);
}
