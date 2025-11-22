import { useState, useCallback, useEffect, useRef } from "react";
import { LucideIcons } from "../lucideIcons";

export const useCanvasElements = (previewRef) => {
	// State for all canvas elements
	const [images, setImages] = useState([]);
	const [texts, setTexts] = useState([]);
	const [videos, setVideos] = useState([]);
	const [shapes, setShapes] = useState([]);
	const [icons, setIcons] = useState([]);
	const [backgroundImage, setBackgroundImage] = useState(null);

	// Selection state
	const [selectedImage, setSelectedImage] = useState(null);
	const [selectedText, setSelectedText] = useState(null);
	const [selectedVideo, setSelectedVideo] = useState(null);
	const [selectedShape, setSelectedShape] = useState(null);
	const [selectedIcon, setSelectedIcon] = useState(null);

	// Resizing state
	const [iconResizing, setIconResizing] = useState(null);
	const [imageResizing, setImageResizing] = useState(null);
	const [textResizing, setTextResizing] = useState(null);
	const [videoResizing, setVideoResizing] = useState(null);
	const [shapeResizing, setShapeResizing] = useState(null);

	// Editing state
	const [captionEditing, setCaptionEditing] = useState(null);
	const [textEditing, setTextEditing] = useState(null);

	// Dropdown state
	const [isShapeDropdownOpen, setIsShapeDropdownOpen] = useState(false);
	const [isBackgroundImageDropdownOpen, setIsBackgroundImageDropdownOpen] = useState(false);
	const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

	// Refs
	const shapeDropdownRef = useRef(null);
	const backgroundImageDropdownRef = useRef(null);
	const backgroundImageInputRef = useRef(null);

	// Image handling functions
	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		files.forEach((file) => {
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = (event) => {
					const img = new Image();
					img.onload = () => {
						const maxWidth = 400;
						const maxHeight = 400;
						let width = img.width;
						let height = img.height;

						// Scale down if too large
						if (width > maxWidth || height > maxHeight) {
							const ratio = Math.min(maxWidth / width, maxHeight / height);
							width = width * ratio;
							height = height * ratio;
						}

						const newImage = {
							id: Date.now() + Math.random(),
							src: event.target.result,
							x: 50,
							y: 50,
							width,
							height,
							caption: "",
							styles: {
								objectFit: "contain",
								borderWidth: 0,
								borderColor: "#000000",
								borderStyle: "solid",
								ringWidth: 0,
								ringColor: "#3b82f6",
								shadow: {
									enabled: false,
									x: 0,
									y: 0,
									blur: 0,
									color: "#000000",
								},
								borderRadius: 0,
								opacity: 1,
								zIndex: 1,
								rotation: 0,
								skewX: 0,
								skewY: 0,
								noise: {
									enabled: false,
									intensity: 0.3,
								},
							},
						};
						setImages((prev) => [...prev, newImage]);
					};
					img.src = event.target.result;
				};
				reader.readAsDataURL(file);
			}
		});
		e.target.value = "";
	};

	const removeImage = (id) => {
		setImages((prev) => prev.filter((img) => img.id !== id));
		if (selectedImage === id) setSelectedImage(null);
	};

	const handleImageReupload = (e, imageId) => {
		const file = e.target.files[0];
		if (!file || !file.type.startsWith("image/")) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				const maxWidth = 400;
				const maxHeight = 400;
				let width = img.width;
				let height = img.height;

				// Scale down if too large
				if (width > maxWidth || height > maxHeight) {
					const ratio = Math.min(maxWidth / width, maxHeight / height);
					width = width * ratio;
					height = height * ratio;
				}

				// Update the image while keeping all other properties
				updateImage(imageId, {
					src: event.target.result,
					width,
					height,
				});
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(file);
		e.target.value = "";
	};

	const updateImage = (id, updates) => {
		setImages((prev) =>
			prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
		);
	};

	const handleImageMouseDown = (e, imageId) => {
		e.stopPropagation();
		setSelectedImage(imageId);
		const image = images.find((img) => img.id === imageId);
		if (!image) return;

		const startX = e.clientX;
		const startY = e.clientY;
		const startImageX = image.x;
		const startImageY = image.y;

		const handleMouseMove = (e) => {
			const deltaX =
				((e.clientX - startX) / previewRef.current.offsetWidth) * 100;
			const deltaY =
				((e.clientY - startY) / previewRef.current.offsetHeight) * 100;

			const newX = Math.max(0, Math.min(100, startImageX + deltaX));
			const newY = Math.max(0, Math.min(100, startImageY + deltaY));

			updateImage(imageId, { x: newX, y: newY });
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleResizeStart = (e, imageId, corner) => {
		e.stopPropagation();
		e.preventDefault();
		setImageResizing({ imageId, corner });
		const image = images.find((img) => img.id === imageId);
		if (!image || !previewRef.current) return;

		const previewRect = previewRef.current.getBoundingClientRect();
		const startX = e.clientX;
		const startY = e.clientY;
		const startWidth = image.width;
		const startHeight = image.height;
		const startImageX = image.x;
		const startImageY = image.y;

		// Calculate image position in pixels relative to preview
		const imageCenterX = (startImageX / 100) * previewRect.width;
		const imageCenterY = (startImageY / 100) * previewRect.height;
		const imageLeft = imageCenterX - startWidth / 2;
		const imageTop = imageCenterY - startHeight / 2;
		const imageRight = imageLeft + startWidth;
		const imageBottom = imageTop + startHeight;

		const handleMouseMove = (e) => {
			if (!previewRef.current) return;

			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			let newWidth = startWidth;
			let newHeight = startHeight;
			let newX = startImageX;
			let newY = startImageY;

			// Calculate new bounds based on corner/edge
			let newLeft = imageLeft;
			let newTop = imageTop;
			let newRight = imageRight;
			let newBottom = imageBottom;

			if (corner.includes("e")) {
				newRight = imageRight + deltaX;
				newRight = Math.max(
					imageLeft + 30,
					Math.min(previewRect.width, newRight)
				);
			}
			if (corner.includes("w")) {
				newLeft = imageLeft + deltaX;
				newLeft = Math.max(0, Math.min(imageRight - 30, newLeft));
			}
			if (corner.includes("s")) {
				newBottom = imageBottom + deltaY;
				newBottom = Math.max(
					imageTop + 30,
					Math.min(previewRect.height, newBottom)
				);
			}
			if (corner.includes("n")) {
				newTop = imageTop + deltaY;
				newTop = Math.max(0, Math.min(imageBottom - 30, newTop));
			}

			// Calculate new dimensions and position
			newWidth = newRight - newLeft;
			newHeight = newBottom - newTop;

			// Ensure minimum size
			if (newWidth < 30) {
				newWidth = 30;
				if (corner.includes("w")) {
					newLeft = newRight - 30;
				} else {
					newRight = newLeft + 30;
				}
			}
			if (newHeight < 30) {
				newHeight = 30;
				if (corner.includes("n")) {
					newTop = newBottom - 30;
				} else {
					newBottom = newTop + 30;
				}
			}

			// Calculate center position in percentage
			const centerX = ((newLeft + newWidth / 2) / previewRect.width) * 100;
			const centerY = ((newTop + newHeight / 2) / previewRect.height) * 100;

			// Constrain to canvas bounds
			newX = Math.max(0, Math.min(100, centerX));
			newY = Math.max(0, Math.min(100, centerY));

			updateImage(imageId, {
				width: newWidth,
				height: newHeight,
				x: newX,
				y: newY,
			});
		};

		const handleMouseUp = () => {
			setImageResizing(null);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const toggleCaption = (imageId) => {
		setCaptionEditing(captionEditing === imageId ? null : imageId);
	};

	const toggleObjectFit = (imageId) => {
		const image = images.find((img) => img.id === imageId);
		if (!image) return;

		const objectFitOptions = ["contain", "cover", "fill", "none", "scale-down"];
		const currentIndex = objectFitOptions.indexOf(
			image.styles?.objectFit || "contain"
		);
		const nextIndex = (currentIndex + 1) % objectFitOptions.length;

		updateImage(imageId, {
			styles: {
				...image.styles,
				objectFit: objectFitOptions[nextIndex],
			},
		});
	};

	// Video handling functions
	const handleVideoUpload = (e) => {
		const files = Array.from(e.target.files);
		files.forEach((file) => {
			if (file.type.startsWith("video/")) {
				const reader = new FileReader();
				reader.onload = (event) => {
					const video = document.createElement("video");
					video.preload = "metadata";
					video.onloadedmetadata = () => {
						const maxWidth = 400;
						const maxHeight = 400;
						let width = video.videoWidth;
						let height = video.videoHeight;

						// Scale down if too large
						if (width > maxWidth || height > maxHeight) {
							const ratio = Math.min(maxWidth / width, maxHeight / height);
							width = width * ratio;
							height = height * ratio;
						}

						const newVideo = {
							id: Date.now() + Math.random(),
							src: event.target.result,
							x: 50,
							y: 50,
							width,
							height,
							caption: "",
							styles: {
								objectFit: "contain",
								borderWidth: 0,
								borderColor: "#000000",
								borderStyle: "solid",
								ringWidth: 0,
								ringColor: "#3b82f6",
								shadow: {
									enabled: false,
									x: 0,
									y: 0,
									blur: 0,
									color: "#000000",
								},
								borderRadius: 0,
								opacity: 1,
								zIndex: 1,
							},
						};
						setVideos((prev) => [...prev, newVideo]);
					};
					video.src = event.target.result;
				};
				reader.readAsDataURL(file);
			}
		});
		e.target.value = "";
	};

	const removeVideo = (id) => {
		setVideos((prev) => prev.filter((vid) => vid.id !== id));
		if (selectedVideo === id) setSelectedVideo(null);
	};

	const handleVideoReupload = (e, videoId) => {
		const file = e.target.files[0];
		if (!file || !file.type.startsWith("video/")) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const video = document.createElement("video");
			video.preload = "metadata";
			video.onloadedmetadata = () => {
				const maxWidth = 400;
				const maxHeight = 400;
				let width = video.videoWidth;
				let height = video.videoHeight;

				// Scale down if too large
				if (width > maxWidth || height > maxHeight) {
					const ratio = Math.min(maxWidth / width, maxHeight / height);
					width = width * ratio;
					height = height * ratio;
				}

				// Update the video while keeping all other properties
				updateVideo(videoId, {
					src: event.target.result,
					width,
					height,
				});
			};
			video.src = event.target.result;
		};
		reader.readAsDataURL(file);
		e.target.value = "";
	};

	const updateVideo = (id, updates) => {
		setVideos((prev) =>
			prev.map((vid) => (vid.id === id ? { ...vid, ...updates } : vid))
		);
	};

	const handleVideoMouseDown = (e, videoId) => {
		e.stopPropagation();
		setSelectedVideo(videoId);
		const video = videos.find((vid) => vid.id === videoId);
		if (!video) return;

		const startX = e.clientX;
		const startY = e.clientY;
		const startVideoX = video.x;
		const startVideoY = video.y;

		const handleMouseMove = (e) => {
			const deltaX =
				((e.clientX - startX) / previewRef.current.offsetWidth) * 100;
			const deltaY =
				((e.clientY - startY) / previewRef.current.offsetHeight) * 100;

			const newX = Math.max(0, Math.min(100, startVideoX + deltaX));
			const newY = Math.max(0, Math.min(100, startVideoY + deltaY));

			updateVideo(videoId, { x: newX, y: newY });
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleVideoResizeStart = (e, videoId, corner) => {
		e.stopPropagation();
		e.preventDefault();
		setVideoResizing({ videoId, corner });
		const video = videos.find((vid) => vid.id === videoId);
		if (!video || !previewRef.current) return;

		const previewRect = previewRef.current.getBoundingClientRect();
		const startX = e.clientX;
		const startY = e.clientY;
		const startWidth = video.width;
		const startHeight = video.height;
		const startVideoX = video.x;
		const startVideoY = video.y;

		const videoCenterX = (startVideoX / 100) * previewRect.width;
		const videoCenterY = (startVideoY / 100) * previewRect.height;
		const videoLeft = videoCenterX - startWidth / 2;
		const videoTop = videoCenterY - startHeight / 2;
		const videoRight = videoLeft + startWidth;
		const videoBottom = videoTop + startHeight;

		const handleMouseMove = (e) => {
			if (!previewRef.current) return;

			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			let newWidth = startWidth;
			let newHeight = startHeight;
			let newX = startVideoX;
			let newY = startVideoY;

			let newLeft = videoLeft;
			let newTop = videoTop;
			let newRight = videoRight;
			let newBottom = videoBottom;

			if (corner.includes("e")) {
				newRight = videoRight + deltaX;
				newRight = Math.max(
					videoLeft + 30,
					Math.min(previewRect.width, newRight)
				);
			}
			if (corner.includes("w")) {
				newLeft = videoLeft + deltaX;
				newLeft = Math.max(0, Math.min(videoRight - 30, newLeft));
			}
			if (corner.includes("s")) {
				newBottom = videoBottom + deltaY;
				newBottom = Math.max(
					videoTop + 30,
					Math.min(previewRect.height, newBottom)
				);
			}
			if (corner.includes("n")) {
				newTop = videoTop + deltaY;
				newTop = Math.max(0, Math.min(videoBottom - 30, newTop));
			}

			newWidth = newRight - newLeft;
			newHeight = newBottom - newTop;

			if (newWidth < 30) {
				newWidth = 30;
				if (corner.includes("w")) {
					newLeft = newRight - 30;
				} else {
					newRight = newLeft + 30;
				}
			}
			if (newHeight < 30) {
				newHeight = 30;
				if (corner.includes("n")) {
					newTop = newBottom - 30;
				} else {
					newBottom = newTop + 30;
				}
			}

			const centerX = ((newLeft + newWidth / 2) / previewRect.width) * 100;
			const centerY = ((newTop + newHeight / 2) / previewRect.height) * 100;

			newX = Math.max(0, Math.min(100, centerX));
			newY = Math.max(0, Math.min(100, centerY));

			updateVideo(videoId, {
				width: newWidth,
				height: newHeight,
				x: newX,
				y: newY,
			});
		};

		const handleMouseUp = () => {
			setVideoResizing(null);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const toggleVideoCaption = (videoId) => {
		setCaptionEditing(captionEditing === videoId ? null : videoId);
	};

	const toggleVideoObjectFit = (videoId) => {
		const video = videos.find((vid) => vid.id === videoId);
		if (!video) return;

		const objectFitOptions = ["contain", "cover", "fill", "none", "scale-down"];
		const currentIndex = objectFitOptions.indexOf(
			video.styles?.objectFit || "contain"
		);
		const nextIndex = (currentIndex + 1) % objectFitOptions.length;

		updateVideo(videoId, {
			styles: {
				...video.styles,
				objectFit: objectFitOptions[nextIndex],
			},
		});
	};

	// Shape handling functions
	const addShape = (shapeType) => {
		const newShape = {
			id: Date.now() + Math.random(),
			type: shapeType,
			x: 50,
			y: 50,
			width: shapeType === "line" ? 200 : shapeType === "square" ? 150 : 200,
			height: shapeType === "line" ? 2 : shapeType === "square" ? 150 : 150,
			styles: {
				fillColor: "#3b82f6",
				strokeColor: "#1e40af",
				strokeWidth: 2,
				strokeStyle: "solid",
				opacity: 1,
				borderRadius: 0,
				shadow: "none",
				zIndex: 1,
				rotation: 0,
				skewX: 0,
				skewY: 0,
			},
		};
		setShapes((prev) => [...prev, newShape]);
		setSelectedShape(newShape.id);
		setIsShapeDropdownOpen(false);
	};

	const removeShape = (id) => {
		setShapes((prev) => prev.filter((shape) => shape.id !== id));
		if (selectedShape === id) setSelectedShape(null);
	};

	const updateShape = (id, updates) => {
		setShapes((prev) =>
			prev.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape))
		);
	};

	const handleShapeMouseDown = (e, shapeId) => {
		e.stopPropagation();
		setSelectedShape(shapeId);
		const shape = shapes.find((s) => s.id === shapeId);
		if (!shape) return;

		const startX = e.clientX;
		const startY = e.clientY;
		const startShapeX = shape.x;
		const startShapeY = shape.y;

		const handleMouseMove = (e) => {
			const deltaX =
				((e.clientX - startX) / previewRef.current.offsetWidth) * 100;
			const deltaY =
				((e.clientY - startY) / previewRef.current.offsetHeight) * 100;

			const newX = Math.max(0, Math.min(100, startShapeX + deltaX));
			const newY = Math.max(0, Math.min(100, startShapeY + deltaY));

			updateShape(shapeId, { x: newX, y: newY });
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleShapeResizeStart = (e, shapeId, corner) => {
		e.stopPropagation();
		e.preventDefault();
		setShapeResizing({ shapeId, corner });
		const shape = shapes.find((s) => s.id === shapeId);
		if (!shape || !previewRef.current) return;

		const previewRect = previewRef.current.getBoundingClientRect();
		const startX = e.clientX;
		const startY = e.clientY;
		const startWidth = shape.width;
		const startHeight = shape.height;
		const startShapeX = shape.x;
		const startShapeY = shape.y;

		const shapeCenterX = (startShapeX / 100) * previewRect.width;
		const shapeCenterY = (startShapeY / 100) * previewRect.height;
		const shapeLeft = shapeCenterX - startWidth / 2;
		const shapeTop = shapeCenterY - startHeight / 2;
		const shapeRight = shapeLeft + startWidth;
		const shapeBottom = shapeTop + startHeight;

		const handleMouseMove = (e) => {
			if (!previewRef.current) return;

			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			let newWidth = startWidth;
			let newHeight = startHeight;
			let newX = startShapeX;
			let newY = startShapeY;

			let newLeft = shapeLeft;
			let newTop = shapeTop;
			let newRight = shapeRight;
			let newBottom = shapeBottom;

			if (corner.includes("e")) {
				newRight = shapeRight + deltaX;
				newRight = Math.max(
					shapeLeft + 20,
					Math.min(previewRect.width, newRight)
				);
			}
			if (corner.includes("w")) {
				newLeft = shapeLeft + deltaX;
				newLeft = Math.max(0, Math.min(shapeRight - 20, newLeft));
			}
			if (corner.includes("s")) {
				newBottom = shapeBottom + deltaY;
				newBottom = Math.max(
					shapeTop + 20,
					Math.min(previewRect.height, newBottom)
				);
			}
			if (corner.includes("n")) {
				newTop = shapeTop + deltaY;
				newTop = Math.max(0, Math.min(shapeBottom - 20, newTop));
			}

			newWidth = newRight - newLeft;
			newHeight = newBottom - newTop;

			// Ensure minimum size
			if (newWidth < 20) {
				newWidth = 20;
				if (corner.includes("w")) {
					newLeft = newRight - 20;
				} else {
					newRight = newLeft + 20;
				}
			}
			if (newHeight < 20) {
				newHeight = 20;
				if (corner.includes("n")) {
					newTop = newBottom - 20;
				} else {
					newBottom = newTop + 20;
				}
			}

			// For squares, maintain aspect ratio
			if (shape.type === "square") {
				const size = Math.max(newWidth, newHeight);
				newWidth = size;
				newHeight = size;
			}

			// Calculate center position in percentage
			const centerX = ((newLeft + newWidth / 2) / previewRect.width) * 100;
			const centerY = ((newTop + newHeight / 2) / previewRect.height) * 100;

			newX = Math.max(0, Math.min(100, centerX));
			newY = Math.max(0, Math.min(100, centerY));

			updateShape(shapeId, {
				width: newWidth,
				height: newHeight,
				x: newX,
				y: newY,
			});
		};

		const handleMouseUp = () => {
			setShapeResizing(null);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	// Icon handling functions
	const addIcon = (iconName) => {
		const IconComponent = LucideIcons[iconName];
		if (!IconComponent) return;

		const newIcon = {
			id: Date.now() + Math.random(),
			iconName: iconName,
			x: 50,
			y: 50,
			width: 48,
			height: 48,
			styles: {
				color: "#000000",
				size: 24,
				strokeWidth: 2,
				opacity: 1,
				zIndex: 1,
				rotation: 0,
				skewX: 0,
				skewY: 0,
			},
		};
		setIcons((prev) => [...prev, newIcon]);
		setSelectedIcon(newIcon.id);
		setIsIconSelectorOpen(false);
	};

	const removeIcon = (id) => {
		setIcons((prev) => prev.filter((icon) => icon.id !== id));
		if (selectedIcon === id) setSelectedIcon(null);
	};

	const updateIcon = (id, updates) => {
		setIcons((prev) =>
			prev.map((icon) => (icon.id === id ? { ...icon, ...updates } : icon))
		);
	};

	const handleIconMouseDown = (e, iconId) => {
		e.stopPropagation();
		setSelectedIcon(iconId);
		const icon = icons.find((i) => i.id === iconId);
		if (!icon) return;

		const startX = e.clientX;
		const startY = e.clientY;
		const startIconX = icon.x;
		const startIconY = icon.y;

		const handleMouseMove = (e) => {
			const deltaX =
				((e.clientX - startX) / previewRef.current.offsetWidth) * 100;
			const deltaY =
				((e.clientY - startY) / previewRef.current.offsetHeight) * 100;

			const newX = Math.max(0, Math.min(100, startIconX + deltaX));
			const newY = Math.max(0, Math.min(100, startIconY + deltaY));

			updateIcon(iconId, { x: newX, y: newY });
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleIconResizeStart = (e, iconId, corner) => {
		e.stopPropagation();
		e.preventDefault();
		setIconResizing({ iconId, corner });
		const icon = icons.find((i) => i.id === iconId);
		if (!icon || !previewRef.current) return;

		const previewRect = previewRef.current.getBoundingClientRect();
		const startX = e.clientX;
		const startY = e.clientY;
		const startWidth = icon.width;
		const startHeight = icon.height;
		const startIconX = icon.x;
		const startIconY = icon.y;

		const iconCenterX = (startIconX / 100) * previewRect.width;
		const iconCenterY = (startIconY / 100) * previewRect.height;
		const iconLeft = iconCenterX - startWidth / 2;
		const iconTop = iconCenterY - startHeight / 2;
		const iconRight = iconLeft + startWidth;
		const iconBottom = iconTop + startHeight;

		const handleMouseMove = (e) => {
			if (!previewRef.current) return;

			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			let newWidth = startWidth;
			let newHeight = startHeight;
			let newX = startIconX;
			let newY = startIconY;

			switch (corner) {
				case "nw":
					newWidth = Math.max(20, startWidth - deltaX);
					newHeight = Math.max(20, startHeight - deltaY);
					break;
				case "ne":
					newWidth = Math.max(20, startWidth + deltaX);
					newHeight = Math.max(20, startHeight - deltaY);
					break;
				case "sw":
					newWidth = Math.max(20, startWidth - deltaX);
					newHeight = Math.max(20, startHeight + deltaY);
					break;
				case "se":
					newWidth = Math.max(20, startWidth + deltaX);
					newHeight = Math.max(20, startHeight + deltaY);
					break;
				case "n":
					newHeight = Math.max(20, startHeight - deltaY);
					break;
				case "s":
					newHeight = Math.max(20, startHeight + deltaY);
					break;
				case "w":
					newWidth = Math.max(20, startWidth - deltaX);
					break;
				case "e":
					newWidth = Math.max(20, startWidth + deltaX);
					break;
			}

			// Update size and adjust position to keep center
			const sizeDeltaX = (newWidth - startWidth) / 2;
			const sizeDeltaY = (newHeight - startHeight) / 2;

			if (corner.includes("w")) {
				newX = startIconX - (sizeDeltaX / previewRect.width) * 100;
			} else if (corner.includes("e")) {
				newX = startIconX + (sizeDeltaX / previewRect.width) * 100;
			}

			if (corner.includes("n")) {
				newY = startIconY - (sizeDeltaY / previewRect.height) * 100;
			} else if (corner.includes("s")) {
				newY = startIconY + (sizeDeltaY / previewRect.height) * 100;
			}

			updateIcon(iconId, {
				width: newWidth,
				height: newHeight,
				x: Math.max(0, Math.min(100, newX)),
				y: Math.max(0, Math.min(100, newY)),
			});
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			setIconResizing(null);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	// Text handling functions
	const addText = () => {
		const newText = {
			id: Date.now() + Math.random(),
			content: "New Text",
			x: 50,
			y: 50,
			width: 200,
			height: 50,
			styles: {
				fontSize: 24,
				fontWeight: "normal",
				fontStyle: "normal",
				color: "#000000",
				textAlign: "left",
				fontFamily: "Arial",
				backgroundColor: "transparent",
				padding: 0,
				borderRadius: 0,
				borderWidth: 0,
				borderColor: "#000000",
				borderStyle: "solid",
				shadow: "none",
				opacity: 1,
				zIndex: 2,
				rotation: 0,
				skewX: 0,
				skewY: 0,
			},
		};
		setTexts((prev) => [...prev, newText]);
		setSelectedText(newText.id);
		setTextEditing(newText.id);
	};

	const removeText = (id) => {
		setTexts((prev) => prev.filter((txt) => txt.id !== id));
		if (selectedText === id) setSelectedText(null);
	};

	const updateText = (id, updates) => {
		setTexts((prev) =>
			prev.map((txt) => (txt.id === id ? { ...txt, ...updates } : txt))
		);
	};

	const handleTextMouseDown = (e, textId) => {
		e.stopPropagation();
		setSelectedText(textId);
		if (textEditing === textId) return; // Don't drag while editing

		const text = texts.find((txt) => txt.id === textId);
		if (!text) return;

		const startX = e.clientX;
		const startY = e.clientY;
		const startTextX = text.x;
		const startTextY = text.y;

		const handleMouseMove = (e) => {
			const deltaX =
				((e.clientX - startX) / previewRef.current.offsetWidth) * 100;
			const deltaY =
				((e.clientY - startY) / previewRef.current.offsetHeight) * 100;

			const newX = Math.max(0, Math.min(100, startTextX + deltaX));
			const newY = Math.max(0, Math.min(100, startTextY + deltaY));

			updateText(textId, { x: newX, y: newY });
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleTextResizeStart = (e, textId, corner) => {
		e.stopPropagation();
		e.preventDefault();
		setTextResizing({ textId, corner });
		const text = texts.find((txt) => txt.id === textId);
		if (!text || !previewRef.current) return;

		const previewRect = previewRef.current.getBoundingClientRect();
		const startX = e.clientX;
		const startY = e.clientY;
		const startWidth = text.width;
		const startHeight = text.height;
		const startTextX = text.x;
		const startTextY = text.y;

		const textCenterX = (startTextX / 100) * previewRect.width;
		const textCenterY = (startTextY / 100) * previewRect.height;
		const textLeft = textCenterX - startWidth / 2;
		const textTop = textCenterY - startHeight / 2;
		const textRight = textLeft + startWidth;
		const textBottom = textTop + startHeight;

		const handleMouseMove = (e) => {
			if (!previewRef.current) return;

			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			let newWidth = startWidth;
			let newHeight = startHeight;
			let newX = startTextX;
			let newY = startTextY;

			let newLeft = textLeft;
			let newTop = textTop;
			let newRight = textRight;
			let newBottom = textBottom;

			if (corner.includes("e")) {
				newRight = textRight + deltaX;
				newRight = Math.max(
					textLeft + 50,
					Math.min(previewRect.width, newRight)
				);
			}
			if (corner.includes("w")) {
				newLeft = textLeft + deltaX;
				newLeft = Math.max(0, Math.min(textRight - 50, newLeft));
			}
			if (corner.includes("s")) {
				newBottom = textBottom + deltaY;
				newBottom = Math.max(
					textTop + 20,
					Math.min(previewRect.height, newBottom)
				);
			}
			if (corner.includes("n")) {
				newTop = textTop + deltaY;
				newTop = Math.max(0, Math.min(textBottom - 20, newTop));
			}

			newWidth = newRight - newLeft;
			newHeight = newBottom - newTop;

			if (newWidth < 50) {
				newWidth = 50;
				if (corner.includes("w")) {
					newLeft = newRight - 50;
				} else {
					newRight = newLeft + 50;
				}
			}
			if (newHeight < 20) {
				newHeight = 20;
				if (corner.includes("n")) {
					newTop = newBottom - 20;
				} else {
					newBottom = newTop + 20;
				}
			}

			const centerX = ((newLeft + newWidth / 2) / previewRect.width) * 100;
			const centerY = ((newTop + newHeight / 2) / previewRect.height) * 100;

			newX = Math.max(0, Math.min(100, centerX));
			newY = Math.max(0, Math.min(100, centerY));

			updateText(textId, {
				width: newWidth,
				height: newHeight,
				x: newX,
				y: newY,
			});
		};

		const handleMouseUp = () => {
			setTextResizing(null);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	// Background image handling
	const handleBackgroundImageUpload = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = (event) => {
				setBackgroundImage(event.target.result);
				setIsBackgroundImageDropdownOpen(false);
			};
			reader.readAsDataURL(file);
		}
	};

	// Handle click outside shape dropdown
	const handleShapeDropdownClickOutside = useCallback((event) => {
		if (
			shapeDropdownRef.current &&
			!shapeDropdownRef.current.contains(event.target)
		) {
			setIsShapeDropdownOpen(false);
		}
	}, []);

	useEffect(() => {
		if (isShapeDropdownOpen) {
			document.addEventListener("mousedown", handleShapeDropdownClickOutside);
			return () =>
				document.removeEventListener(
					"mousedown",
					handleShapeDropdownClickOutside
				);
		}
	}, [isShapeDropdownOpen, handleShapeDropdownClickOutside]);

	// Handle click outside background image dropdown
	const handleBackgroundImageDropdownClickOutside = useCallback((event) => {
		if (
			backgroundImageDropdownRef.current &&
			!backgroundImageDropdownRef.current.contains(event.target)
		) {
			setIsBackgroundImageDropdownOpen(false);
		}
	}, []);

	useEffect(() => {
		if (isBackgroundImageDropdownOpen) {
			document.addEventListener(
				"mousedown",
				handleBackgroundImageDropdownClickOutside
			);
			return () =>
				document.removeEventListener(
					"mousedown",
					handleBackgroundImageDropdownClickOutside
				);
		}
	}, [
		isBackgroundImageDropdownOpen,
		handleBackgroundImageDropdownClickOutside,
	]);

	return {
		// State
		images,
		setImages,
		texts,
		setTexts,
		videos,
		setVideos,
		shapes,
		setShapes,
		icons,
		setIcons,
		backgroundImage,
		setBackgroundImage,
		selectedImage,
		setSelectedImage,
		selectedText,
		setSelectedText,
		selectedVideo,
		setSelectedVideo,
		selectedShape,
		setSelectedShape,
		selectedIcon,
		setSelectedIcon,
		iconResizing,
		imageResizing,
		textResizing,
		videoResizing,
		shapeResizing,
		captionEditing,
		setCaptionEditing,
		textEditing,
		setTextEditing,
		isShapeDropdownOpen,
		setIsShapeDropdownOpen,
		isBackgroundImageDropdownOpen,
		setIsBackgroundImageDropdownOpen,
		isIconSelectorOpen,
		setIsIconSelectorOpen,
		shapeDropdownRef,
		backgroundImageDropdownRef,
		backgroundImageInputRef,
		// Image functions
		handleImageUpload,
		removeImage,
		handleImageReupload,
		updateImage,
		handleImageMouseDown,
		handleResizeStart,
		toggleCaption,
		toggleObjectFit,
		// Video functions
		handleVideoUpload,
		removeVideo,
		handleVideoReupload,
		updateVideo,
		handleVideoMouseDown,
		handleVideoResizeStart,
		toggleVideoCaption,
		toggleVideoObjectFit,
		// Shape functions
		addShape,
		removeShape,
		updateShape,
		handleShapeMouseDown,
		handleShapeResizeStart,
		// Icon functions
		addIcon,
		removeIcon,
		updateIcon,
		handleIconMouseDown,
		handleIconResizeStart,
		// Text functions
		addText,
		removeText,
		updateText,
		handleTextMouseDown,
		handleTextResizeStart,
		// Background image
		handleBackgroundImageUpload,
	};
};

