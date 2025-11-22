import React, { useEffect } from "react";
import "tailwindcss/tailwind.css";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Body from "../modules/Body";
import { Analytics } from "@vercel/analytics/next";
import Router from "next/router";
import NProgress from "nprogress";

// Configure NProgress
NProgress.configure({ showSpinner: false });

function MyApp({ Component, pageProps }) {
	const queryClient = new QueryClient({
		defaultOptions: {
			refetchOnWindowFocus: false,
		},
	});

	useEffect(() => {
		// Start NProgress on route change start
		Router.events.on("routeChangeStart", () => {
			NProgress.start();
		});

		// Complete NProgress on route change complete
		Router.events.on("routeChangeComplete", () => {
			NProgress.done();
		});

		// Complete NProgress on route change error
		Router.events.on("routeChangeError", () => {
			NProgress.done();
		});

		return () => {
			// Clean up event listeners
			Router.events.off("routeChangeStart", () => {
				NProgress.start();
			});
			Router.events.off("routeChangeComplete", () => {
				NProgress.done();
			});
			Router.events.off("routeChangeError", () => {
				NProgress.done();
			});
		};
	}, []);

	return (
		<>
			
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<Analytics />
						<Body>
							<Component {...pageProps} />
						</Body>
					</PersistGate>
				</Provider>
			</QueryClientProvider>
		</>
	);
}

export default MyApp;
