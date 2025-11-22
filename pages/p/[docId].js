import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/utils/firebase";
import Head from "next/head";

export default function PublishedProject() {
	const router = useRouter();
	const { docId } = router.query;
	const [htmlContent, setHtmlContent] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [projectName, setProjectName] = useState("");

	useEffect(() => {
		if (!docId) return;

		const loadPublishedProject = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const publishedDocRef = doc(db, "published-projects", docId);
				const publishedDoc = await getDoc(publishedDocRef);

				if (!publishedDoc.exists()) {
					setError("Project not found");
					setIsLoading(false);
					return;
				}

				const data = publishedDoc.data();
				
				if (!data.isPublic) {
					setError("This project is not publicly available");
					setIsLoading(false);
					return;
				}

				setHtmlContent(data.publicHtmlContent || "");
				setProjectName(data.projectName || "Published Project");
			} catch (err) {
				console.error("Error loading published project:", err);
				setError("Failed to load project");
			} finally {
				setIsLoading(false);
			}
		};

		loadPublishedProject();
	}, [docId]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-zinc-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-zinc-600">Loading project...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-zinc-50">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-zinc-900 mb-2">Error</h1>
					<p className="text-zinc-600">{error}</p>
					<button
						onClick={() => router.push("/")}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						Go Home
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<Head>
				<title>{projectName} - Kixr</title>
				<meta name="description" content={`View ${projectName} on Kixr`} />
			</Head>
			<div
				dangerouslySetInnerHTML={{ __html: htmlContent }}
				style={{ minHeight: "100vh" }}
			/>
		</>
	);
}

