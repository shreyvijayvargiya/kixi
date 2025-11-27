const FREEPIK_API_URL = "https://api.freepik.com/v1/ai/mystic";
const DEFAULT_VARIANTS = 3;
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 15;

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "25mb",
		},
	},
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clamp = (value, min, max) =>
	Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

const aspectRatioFromDimensions = (width = 1, height = 1) => {
	if (!width || !height) return "square_1_1";
	const ratio = width / height;
	if (Math.abs(ratio - 1) < 0.05) return "square_1_1";
	return ratio > 1 ? "landscape_16_9" : "portrait_3_4";
};

const extractImagesFromGenerated = (generated = []) =>
	generated
		.map((item) => {
			if (typeof item === "string") {
				return item;
			}
			return (
				item?.url ||
				item?.image_url ||
				item?.image ||
				item?.preview ||
				item?.thumb ||
				item?.thumbnail ||
				item?.cdnUrl ||
				null
			);
		})
		.filter(Boolean);

const pollFreepikTask = async (taskId, headers) => {
	for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
		await wait(POLL_INTERVAL_MS);
		const pollResponse = await fetch(`${FREEPIK_API_URL}/${taskId}`, {
			method: "GET",
			headers,
		});

		if (!pollResponse.ok) {
			const errorBody = await pollResponse.text();
			throw new Error(
				`Freepik poll failed (${pollResponse.status}): ${errorBody || "Unknown error"}`
			);
		}

		const pollData = await pollResponse.json();
		const status = pollData?.data?.status;

		if (status === "COMPLETED") {
			return pollData?.data ?? {};
		}

		if (status && status !== "IN_PROGRESS") {
			throw new Error(`Freepik task ended with status "${status}"`);
		}
	}

	throw new Error("Timed out waiting for Freepik Mystic to finish");
};

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).json({ error: "Method not allowed" });
	}

	if (!process.env.FREEPIK_API_KEY) {
		return res.status(500).json({
			error: "FREEPIK_API_KEY is not configured",
		});
	}

	try {
		const {
			imageBase64,
			prompt,
			ast,
			variantCount = DEFAULT_VARIANTS,
			options = {},
		} = req.body || {};

		if (!imageBase64) {
			return res.status(400).json({ error: "Image is required" });
		}

		const normalizedPrompt = prompt?.trim();
		if (!normalizedPrompt) {
			return res.status(400).json({ error: "Prompt is required" });
		}

		const sanitizedImage = imageBase64.replace(/^data:image\/\w+;base64,/, "");
		if (!sanitizedImage) {
			return res.status(400).json({
				error:
					"Invalid image data. Provide a base64 encoded PNG or JPEG image.",
			});
		}

		const safeVariantCount = Math.min(
			Math.max(parseInt(variantCount, 10) || 1, 1),
			4
		);
		const gradient = ast?.gradient || {};
		const dims = gradient.dimensions || {};

		const payload = {
			prompt: normalizedPrompt,
			structure_reference: sanitizedImage,
			style_reference: options.style_reference || sanitizedImage,
			structure_strength: clamp(options.structureStrength ?? 50, 0, 100),
			adherence: clamp(options.adherence ?? 50, 0, 100),
			hdr: clamp(options.hdr ?? 50, 0, 100),
			resolution: options.resolution || "2k",
			aspect_ratio:
				options.aspect_ratio ||
				aspectRatioFromDimensions(dims.width, dims.height),
			model: options.model || "realism",
			creative_detailing: clamp(options.creative_detailing ?? 33, 0, 100),
			engine: options.engine || "automatic",
			fixed_generation: Boolean(options.fixed_generation),
			filter_nsfw: options.filter_nsfw !== false,
			styling: options.styling || {
				styles: [],
				characters: [],
				colors: [],
			},
		};

		const headers = {
			"Content-Type": "application/json",
			"x-freepik-api-key": process.env.FREEPIK_API_KEY,
		};

		const response = await fetch(FREEPIK_API_URL, {
			method: "POST",
			headers,
			body: JSON.stringify(payload),
		});

		console.log(response, "response");
		if (!response.ok) {
			const errorBody = await response.text();
			return res.status(response.status).json({
				error: "Freepik Mystic request failed",
				message: errorBody || response.statusText,
			});
		}

		const data = await response.json();
		let finalData = data?.data;

		if (finalData?.status === "IN_PROGRESS" && finalData?.task_id) {
			finalData = await pollFreepikTask(finalData.task_id, headers);
		}

		if (!finalData) {
			throw new Error("Freepik Mystic returned an empty response");
		}

		const generated = Array.isArray(finalData.generated)
			? finalData.generated.slice(0, safeVariantCount)
			: [];
		const images = extractImagesFromGenerated(generated);

		if (!images.length) {
			throw new Error("Freepik Mystic did not return any image URLs");
		}

		return res.status(200).json({
			success: true,
			model: "freepik-mystic",
			count: images.length,
			images,
			generated,
			taskId: finalData.task_id,
			status: finalData.status,
		});
	} catch (error) {
		console.error("/api/generate-improved-images error", error);
		return res.status(500).json({
			error: "Failed to generate Freepik variants",
			message: error.message,
		});
	}
}
