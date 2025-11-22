import { useState, useCallback, useRef } from "react";

export const useGradientState = (previewRef) => {
	const [gradient, setGradient] = useState({
		type: "linear",
		angle: 45,
		stops: [
			{ id: 1, color: "#FF8D00", position: { x: 0, y: 0 } },
			{ id: 2, color: "#FFB870", position: { x: 50, y: 30 } },
		],
		noise: {
			enabled: true,
			intensity: 0.3,
		},
		animation: {
			enabled: true,
			type: "rotate",
			duration: 3,
			easing: "ease-in-out",
			direction: "normal",
		},
		backgroundAnimation: {
			enabled: true,
			type: "slide",
			direction: "right",
			speed: 5,
			easing: "linear",
		},
		dimensions: {
			width: 1080,
			height: 1920,
		},
	});

	const [selectedStop, setSelectedStop] = useState(null);
	const [isDragging, setIsDragging] = useState(false);

	const addColorStop = () => {
		const newStop = {
			id: Date.now(),
			color: "#10b981",
			position: {
				x: Math.random() * 80 + 10,
				y: Math.random() * 80 + 10,
			},
		};
		setGradient((prev) => ({
			...prev,
			stops: [...prev.stops, newStop],
		}));
	};

	const removeColorStop = (id) => {
		setGradient((prev) => ({
			...prev,
			stops: prev.stops.filter((stop) => stop.id !== id),
		}));
	};

	const updateColorStop = (id, property, value) => {
		setGradient((prev) => ({
			...prev,
			stops: prev.stops.map((stop) =>
				stop.id === id ? { ...stop, [property]: value } : stop
			),
		}));
	};

	const handleMouseDown = useCallback((e, stopId) => {
		e.preventDefault();
		setIsDragging(true);
		setSelectedStop(stopId);

		const previewRect = previewRef.current.getBoundingClientRect();

		const handleMouseMove = (e) => {
			const x = ((e.clientX - previewRect.left) / previewRect.width) * 100;
			const y = ((e.clientY - previewRect.top) / previewRect.height) * 100;

			const clampedX = Math.max(0, Math.min(100, x));
			const clampedY = Math.max(0, Math.min(100, y));

			updateColorStop(stopId, "position", { x: clampedX, y: clampedY });
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			setSelectedStop(null);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	}, [previewRef]);

	const handleKeyDown = useCallback(
		(e, stopId) => {
			if (!selectedStop || selectedStop !== stopId) return;

			const step = e.shiftKey ? 10 : 1;
			const stop = gradient.stops.find((s) => s.id === stopId);
			if (!stop) return;

			let newPosition = { ...stop.position };

			switch (e.key) {
				case "ArrowLeft":
					newPosition.x = Math.max(0, stop.position.x - step);
					break;
				case "ArrowRight":
					newPosition.x = Math.min(100, stop.position.x + step);
					break;
				case "ArrowUp":
					newPosition.y = Math.max(0, stop.position.y - step);
					break;
				case "ArrowDown":
					newPosition.y = Math.min(100, stop.position.y + step);
					break;
				case "Delete":
				case "Backspace":
					removeColorStop(stopId);
					return;
				default:
					return;
			}

			e.preventDefault();
			updateColorStop(stopId, "position", newPosition);
		},
		[selectedStop, gradient.stops]
	);

	const generateGradientCSS = () => {
		const sortedStops = [...gradient.stops].sort((a, b) => {
			const distA = Math.sqrt(
				a.position.x * a.position.x + a.position.y * a.position.y
			);
			const distB = Math.sqrt(
				b.position.x * b.position.x + b.position.y * b.position.y
			);
			return distA - distB;
		});

		if (gradient.type === "linear") {
			const firstStop = sortedStops[0];
			const lastStop = sortedStops[sortedStops.length - 1];
			const angle =
				Math.atan2(
					lastStop?.position.y - firstStop?.position.y,
					lastStop?.position.x - firstStop?.position.x
				) *
				(180 / Math.PI);

			const stopsString = sortedStops
				.map((stop) => `${stop?.color} ${Math.round(stop?.position.x)}%`)
				.join(", ");

			return `linear-gradient(${Math.round(angle)}deg, ${stopsString})`;
		}

		if (gradient.type === "radial") {
			const stopsString = sortedStops
				.map(
					(stop) =>
						`${stop.color} ${Math.round(
							Math.sqrt(
								Math.pow(stop?.position?.x - 50, 2) +
									Math.pow(stop?.position?.y - 50, 2)
							)
						)}%`
				)
				.join(", ");

			return `radial-gradient(circle at 50% 50%, ${stopsString})`;
		}

		if (gradient.type === "conic") {
			const stopsString = sortedStops
				.map((stop) => `${stop.color} ${Math.round(stop.position.x)}%`)
				.join(", ");

			return `conic-gradient(from 0deg, ${stopsString})`;
		}

		if (gradient.type === "rectangle") {
			const stopsString = sortedStops
				.map(
					(stop) =>
						`${stop.color} ${Math.round(
							Math.max(
								Math.abs(stop.position.x - 50),
								Math.abs(stop.position.y - 50)
							) * 2
						)}%`
				)
				.join(", ");

			return `radial-gradient(ellipse at 50% 50%, ${stopsString})`;
		}

		if (gradient.type === "ellipse") {
			const stopsString = sortedStops
				.map(
					(stop) =>
						`${stop.color} ${Math.round(
							Math.sqrt(
								Math.pow((stop.position.x - 50) / 1.5, 2) +
									Math.pow((stop.position.y - 50) / 0.8, 2)
							) * 2
						)}%`
				)
				.join(", ");

			return `radial-gradient(ellipse 150% 80% at 50% 50%, ${stopsString})`;
		}

		if (gradient.type === "polygon") {
			const stopsString = sortedStops
				.map(
					(stop) =>
						`${stop.color} ${Math.round(
							Math.sqrt(
								Math.pow(stop.position.x - 50, 2) +
									Math.pow(stop.position.y - 50, 2)
							) * 1.5
						)}%`
				)
				.join(", ");

			return `radial-gradient(polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) at 50% 50%, ${stopsString})`;
		}

		if (gradient.type === "mesh") {
			const stopsString = sortedStops
				.map(
					(stop) =>
						`${stop.color} ${Math.round(
							Math.sqrt(
								Math.pow(stop.position.x - 50, 2) +
									Math.pow(stop.position.y - 50, 2)
							) * 0.8
						)}%`
				)
				.join(", ");

			return `radial-gradient(circle at ${sortedStops[0]?.position.x || 50}% ${
				sortedStops[0]?.position.y || 50
			}%, ${stopsString})`;
		}

		return "";
	};

	const generateAnimationCSS = () => {
		const { type, duration, easing, direction } = gradient.animation;
		const {
			type: bgType,
			direction: bgDirection,
			speed,
			easing: bgEasing,
			repeat,
		} = gradient.backgroundAnimation;

		let animation = "";
		let backgroundAnimation = "";

		if (gradient.animation.enabled) {
			const infinite = repeat ? "infinite" : "1";
			switch (type) {
				case "rotate":
					animation = `spin ${duration}s ${easing} ${direction} ${infinite}`;
					break;
				case "pulse":
					animation = `pulse ${duration}s ${easing} ${direction} ${infinite}`;
					break;
				case "shift":
					animation = `bounce ${duration}s ${easing} ${direction} ${infinite}`;
					break;
			}
		}

		if (gradient.backgroundAnimation.enabled) {
			const infinite = repeat ? "infinite" : "1";
			switch (bgType) {
				case "slide":
					if (bgDirection === "right") {
						backgroundAnimation = `slideRight ${speed}s ${bgEasing} ${infinite}`;
					} else if (bgDirection === "left") {
						backgroundAnimation = `slideLeft ${speed}s ${bgEasing} ${infinite}`;
					} else if (bgDirection === "up") {
						backgroundAnimation = `slideUp ${speed}s ${bgEasing} ${infinite}`;
					} else if (bgDirection === "down") {
						backgroundAnimation = `slideDown ${speed}s ${bgEasing} ${infinite}`;
					}
					break;
				case "rotate":
					backgroundAnimation = `spin ${speed}s ${bgEasing} ${infinite}`;
					break;
				case "pulse":
					backgroundAnimation = `pulse ${speed}s ${bgEasing} ${infinite}`;
					break;
			}
		}

		return { animation, backgroundAnimation };
	};

	return {
		gradient,
		setGradient,
		selectedStop,
		setSelectedStop,
		isDragging,
		setIsDragging,
		addColorStop,
		removeColorStop,
		updateColorStop,
		handleMouseDown,
		handleKeyDown,
		generateGradientCSS,
		generateAnimationCSS,
	};
};

