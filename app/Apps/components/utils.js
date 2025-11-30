import { toast } from "react-toastify";

export const formatShadowCSS = (shadow) => {
	if (!shadow || !shadow.enabled) return "none";
	return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color}`;
};

export const formatTextContent = (content, styles) => {
	if (!content) return "";
	let formatted = content;
	if (styles.listStyle === "unordered") {
		formatted = content
			.split("\n")
			.map((line) => `<li>${line}</li>`)
			.join("");
		return `<ul>${formatted}</ul>`;
	}
	if (styles.listStyle === "ordered") {
		formatted = content
			.split("\n")
			.map((line) => `<li>${line}</li>`)
			.join("");
		return `<ol>${formatted}</ol>`;
	}
	return formatted.replace(/\n/g, "<br/>");
};

export const formatDropShadowCSS = (shadow) => {
	if (!shadow || !shadow.enabled) return "none";
	return `drop-shadow(${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color})`;
};

export const copyToClipboard = async (text, type) => {
	try {
		await navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard!");
		return true;
	} catch (err) {
		console.error("Failed to copy:", err);
		toast.error("Failed to copy to clipboard");
		return false;
	}
};
