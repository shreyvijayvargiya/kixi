import React, {
	useState,
	useRef,
	useCallback,
	useEffect,
	useMemo,
} from "react";
import {
	Copy,
	Plus,
	Trash2,
	X,
	Circle,
	ChevronDown,
	Triangle,
	Download,
	Upload,
	Image as ImageIcon,
	Type,
	Video,
	Sparkles,
	Square,
	RectangleHorizontal,
	Loader2,
	Globe,
	Save,
	Search,
	Zap,
	ExternalLink,
	AlertTriangle,
	Shapes,
	Minus,
	Folder,
} from "lucide-react";
import ProjectsModal from "./ProjectsModal";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LucideIcons, AllIcons } from "./lucideIcons";
import { useSelector, useDispatch } from "react-redux";
import GoogleLoginButton from "../../components/GoogleLoginButton";

import LayerList from "../../lib/utils/LayerList";
import { db } from "../../lib/utils/firebase";
import {
	collection,
	addDoc,
	updateDoc,
	setDoc,
	doc,
	getDocs,
	getDoc,
	query,
	where,
	orderBy,
	deleteDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import {
	Add01Icon,
	Cancel01Icon,
	Folder01Icon,
	PenTool01Icon,
	PlayIcon,
} from "hugeicons-react";
import SubscriptionModal from "../../components/SubscriptionModal";
import FeaturesSectionModal from "./FeaturesSectionModal";
import { BackgroundShape, getShapeOptions } from "../../lib/utils/bgShapes";
import TopCenterToolbar from "./TopCenterToolbar";
import { toast } from "react-toastify";
import { useVariantGenerator } from "./hooks/useVariantGenerator";
import VariantSelectionModal from "./components/VariantSelectionModal";
import ControlPanel from "./components/ControlPanel";
import Sidebar from "./components/Sidebar";
import ReleaseBox from "../../components/ReleaseBox";
import {
	ColorPicker,
	Dropdown,
	gradientPresets,
	generatePresetGradientCSS,
} from "./components/SharedComponents";
import {
	formatShadowCSS,
	formatTextContent,
	formatDropShadowCSS,
	copyToClipboard,
} from "./components/utils";
import { EditorProvider } from "./context/EditorContext";

// Tailwind CSS Colors
const tailwindColors = {
	stone: {
		50: "#fafaf9",
		100: "#f5f5f4",
		200: "#e7e5e4",
		300: "#d6d3d1",
		400: "#a8a29e",
		500: "#78716c",
		600: "#57534e",
		700: "#44403c",
		800: "#292524",
		900: "#1c1917",
	},
	zinc: {
		50: "#fafafa",
		100: "#f4f4f5",
		200: "#e4e4e7",
		300: "#d4d4d8",
		400: "#a1a1aa",
		500: "#71717a",
		600: "#52525b",
		700: "#3f3f46",
		800: "#27272a",
		900: "#18181b",
	},
	purple: {
		50: "#faf5ff",
		100: "#f3e8ff",
		200: "#e9d5ff",
		300: "#d8b4fe",
		400: "#c084fc",
		500: "#a855f7",
		600: "#9333ea",
		700: "#7e22ce",
		800: "#6b21a8",
		900: "#581c87",
	},
	orange: {
		50: "#fff7ed",
		100: "#ffedd5",
		200: "#fed7aa",
		300: "#fdba74",
		400: "#fb923c",
		500: "#f97316",
		600: "#ea580c",
		700: "#c2410c",
		800: "#9a3412",
		900: "#7c2d12",
	},
	yellow: {
		50: "#fefce8",
		100: "#fef9c3",
		200: "#fef08a",
		300: "#fde047",
		400: "#facc15",
		500: "#eab308",
		600: "#ca8a04",
		700: "#a16207",
		800: "#854d0e",
		900: "#713f12",
	},
	green: {
		50: "#f0fdf4",
		100: "#dcfce7",
		200: "#bbf7d0",
		300: "#86efac",
		400: "#4ade80",
		500: "#22c55e",
		600: "#16a34a",
		700: "#15803d",
		800: "#166534",
		900: "#14532d",
	},
	black: {
		50: "#fafafa",
		100: "#f4f4f5",
		200: "#e4e4e7",
		300: "#d4d4d8",
		400: "#a1a1aa",
		500: "#71717a",
		600: "#52525b",
		700: "#3f3f46",
		800: "#27272a",
		900: "#000000",
	},
	sky: {
		50: "#f0f9ff",
		100: "#e0f2fe",
		200: "#bae6fd",
		300: "#7dd3fc",
		400: "#38bdf8",
		500: "#0ea5e9",
		600: "#0284c7",
		700: "#0369a1",
		800: "#075985",
		900: "#0c4a6e",
	},
};

// ColorPicker Component with Tabs

const createInitialGradient = () => ({
	type: "linear",
	angle: 45,
	stops: [],
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
		repeat: true,
	},
	backgroundAnimation: {
		enabled: true,
		type: "slide",
		direction: "right",
		speed: 5,
		easing: "linear",
		repeat: true,
	},
	dimensions: {
		width: 1080,
		height: 1920,
	},
});

const AnimatedGradientGenerator = () => {
	const {
		generateVariantsMutation,
		generatedVariants,
		isVariantsModalOpen,
		setIsVariantsModalOpen,
	} = useVariantGenerator();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isOpenAboutModal, setIsOpenAboutModal] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [publicDocId, setPublicDocId] = useState(null);
	const [gradient, setGradient] = useState(() => createInitialGradient());

	const [isPlaying, setIsPlaying] = useState(true);
	const [copied, setCopied] = useState("");
	const [selectedStop, setSelectedStop] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [downloadDimension, setDownloadDimension] = useState("mobile"); // mobile or desktop
	const [previewFrameSize, setPreviewFrameSize] = useState("mobile"); // mobile, tablet, desktop, etc.
	const [previewZoom, setPreviewZoom] = useState(1); // Zoom level for preview (1 = 100%)
	// Undo/Redo history state
	const [history, setHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const MAX_HISTORY = 5;
	const [images, setImages] = useState([]);
	const [texts, setTexts] = useState([]);
	const [videos, setVideos] = useState([]);
	const [shapes, setShapes] = useState([]);
	const [icons, setIcons] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const [selectedText, setSelectedText] = useState(null);
	const [selectedVideo, setSelectedVideo] = useState(null);
	const [selectedShape, setSelectedShape] = useState(null);
	const [selectedIcon, setSelectedIcon] = useState(null);
	// Multiple selection state
	const [selectedImages, setSelectedImages] = useState([]);
	const [selectedTexts, setSelectedTexts] = useState([]);
	const [selectedVideos, setSelectedVideos] = useState([]);
	const [selectedIcons, setSelectedIcons] = useState([]);
	const [isScalingMode, setIsScalingMode] = useState(false);
	const [isEqualScaling, setIsEqualScaling] = useState(true);
	const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
	const iconSelectorDropdownRef = useRef(null);
	const [iconSearchQuery, setIconSearchQuery] = useState("");
	const [isShapeDropdownOpen, setIsShapeDropdownOpen] = useState(false);
	const shapeDropdownRef = useRef(null);
	const [isBackgroundImageDropdownOpen, setIsBackgroundImageDropdownOpen] =
		useState(false);
	const backgroundImageDropdownRef = useRef(null);
	const backgroundImageInputRef = useRef(null);
	const [iconResizing, setIconResizing] = useState(null);
	const [imageResizing, setImageResizing] = useState(null);
	const [textResizing, setTextResizing] = useState(null);
	const [videoResizing, setVideoResizing] = useState(null);
	const [shapeResizing, setShapeResizing] = useState(null);
	const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
	const [isControlPanelDrawerOpen, setIsControlPanelDrawerOpen] =
		useState(false);
	const [isSmallDeviceModalOpen, setIsSmallDeviceModalOpen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setIsSidebarDrawerOpen(false);
				setIsControlPanelDrawerOpen(false);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		const checkViewportSize = () => {
			if (typeof window === "undefined") return;
			setIsSmallDeviceModalOpen(window.innerWidth < 1024);
		};

		checkViewportSize();
		window.addEventListener("resize", checkViewportSize);
		return () => {
			window.removeEventListener("resize", checkViewportSize);
		};
	}, []);

	useEffect(() => {
		if (typeof document === "undefined") return;

		const shouldLockScroll =
			isSidebarDrawerOpen || isControlPanelDrawerOpen || isSmallDeviceModalOpen;

		document.body.style.overflow = shouldLockScroll ? "hidden" : "";
	}, [isSidebarDrawerOpen, isControlPanelDrawerOpen, isSmallDeviceModalOpen]);
	const [captionEditing, setCaptionEditing] = useState(null);
	const [textEditing, setTextEditing] = useState(null);
	const [isGeneratingMP4, setIsGeneratingMP4] = useState(false);
	const [mp4Progress, setMp4Progress] = useState(0);
	const [isAIChatOpen, setIsAIChatOpen] = useState(false);
	const [aiMessages, setAiMessages] = useState([]);
	// Alignment guides state
	const [alignmentGuides, setAlignmentGuides] = useState({
		horizontal: [],
		vertical: [],
	});
	const [aiInput, setAiInput] = useState("");
	const [isAILoading, setIsAILoading] = useState(false);
	const [aiActionsEnabled, setAiActionsEnabled] = useState(true);
	const [aiMultiStepActions, setAiMultiStepActions] = useState([]);
	const [aiCurrentStep, setAiCurrentStep] = useState(0);
	const [aiCompletedSteps, setAiCompletedSteps] = useState(new Set());
	const [isExecutingSteps, setIsExecutingSteps] = useState(false);
	const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
	const [isReleasesModalOpen, setIsReleasesModalOpen] = useState(false);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const keyboardShortcutsRef = useRef(null);
	const fileInputRef = useRef(null);
	const videoInputRef = useRef(null);
	const imageReuploadRefs = useRef({});
	const videoReuploadRefs = useRef({});
	const previewRef = useRef(null);
	const modalPreviewRef = useRef(null);
	const previewCodeDropdownRef = useRef(null);
	const [generatedReactCode, setGeneratedReactCode] = useState("");
	const [codeCopied, setCodeCopied] = useState(false);
	const aiChatInputRef = useRef(null);
	const [isImageImprovementOpen, setIsImageImprovementOpen] = useState(false);
	const [improvementPrompt, setImprovementPrompt] = useState("");
	const [generatedImages, setGeneratedImages] = useState([]);
	const [variantNotes, setVariantNotes] = useState([]);
	const improvementPromptRef = useRef(null);
	const [isUrlScreenshotOpen, setIsUrlScreenshotOpen] = useState(false);
	const urlScreenshotDropdownRef = useRef(null);
	const [urlInput, setUrlInput] = useState("");
	const [screenshotImage, setScreenshotImage] = useState(null);
	const [isScreenshotLoading, setIsScreenshotLoading] = useState(false);
	const urlInputRef = useRef(null);
	const [isReactConvertOpen, setIsReactConvertOpen] = useState(false);
	const [reactCode, setReactCode] = useState("");
	const [isConvertingToReact, setIsConvertingToReact] = useState(false);
	// projects state moved to useQuery below
	const [currentProjectId, setCurrentProjectId] = useState(null);
	const [activeFrameId, setActiveFrameId] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const lastSavedStateRef = useRef(null);
	const autoSaveTimeoutRef = useRef(null);
	const handleSaveProjectRef = useRef(null);
	// isLoadingProjects state moved to useQuery below
	const [editingProjectId, setEditingProjectId] = useState(null);
	const [editingProjectName, setEditingProjectName] = useState("");
	const [isEditingFrameName, setIsEditingFrameName] = useState(false);
	const [editingFrameNameValue, setEditingFrameNameValue] = useState("");
	const [isFrameActionLoading, setIsFrameActionLoading] = useState(false);
	const [projectName, setProjectName] = useState("Untitled Project");
	const [backgroundImage, setBackgroundImage] = useState(null);
	const [backgroundShapeRects, setBackgroundShapeRects] = useState([]);
	const [selectedBackgroundShapeRect, setSelectedBackgroundShapeRect] =
		useState(null);
	const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
	const [contextMenu, setContextMenu] = useState({
		isOpen: false,
		position: { x: 0, y: 0 },
	});
	const controlPanelRef = useRef(null);

	// Mac asset images array
	const macAssetImages = Array.from({ length: 9 }, (_, i) => ({
		id: i + 1,
		src: `/mac-asset-${i + 1}.webp`,
		name: `Mac Asset ${i + 1}`,
	}));

	// Redux
	const dispatch = useDispatch();
	const { user, isAuthenticated, subscriptionStatus, subscriptionId } =
		useSelector((state) => state.auth);
	const router = useRouter();

	const queryClient = useQueryClient();

	const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
		queryKey: ["projects", user?.uid],
		queryFn: async () => {
			if (!user?.uid) return [];
			const projectsRef = collection(db, "users", user.uid, "kixi-projects");
			const q = query(projectsRef, orderBy("updatedAt", "desc"));
			const querySnapshot = await getDocs(q);
			const projectsList = [];
			querySnapshot.forEach((doc) => {
				projectsList.push({
					id: doc.id,
					...doc.data(),
				});
			});
			return projectsList;
		},
		enabled: !!isAuthenticated && !!user?.uid,
	});

	const dimensionPresets = {
		mobile: { width: 1080, height: 1920, label: "Mobile (1080×1920)" },
		desktop: { width: 1920, height: 1080, label: "Desktop (1920×1080)" },
	};

	const previewFramePresets = {
		mobile: {
			width: 1080,
			height: 1920,
			label: "Mobile (1080×1920)",
		},
		mobileSmall: {
			width: 375,
			height: 667,
			label: "Mobile Small (375×667)",
		},
		tablet: {
			width: 1024,
			height: 1366,
			label: "Tablet (1024×1366)",
		},
		desktop: {
			width: 1920,
			height: 1080,
			label: "Desktop (1920×1080)",
		},
		laptop: {
			width: 1366,
			height: 768,
			label: "Laptop (1366×768)",
		},
		ultrawide: {
			width: 2560,
			height: 1080,
			label: "Ultrawide (2560×1080)",
		},
		icon: {
			width: 100,
			height: 100,
			label: "Icon (100×100)",
		},
		a4: {
			width: 2480,
			height: 3508,
			label: "A4 (2480×3508)",
		},
		a5: {
			width: 1748,
			height: 2480,
			label: "A5 (1748×2480)",
		},
		square: {
			width: 1080,
			height: 1080,
			label: "Square (1080×1080)",
		},
	};

	const designAst = useMemo(
		() => ({
			gradient,
			images,
			texts,
			videos,
			shapes,
			icons,
			backgroundImage,
			backgroundShapeRects,
		}),
		[
			gradient,
			images,
			texts,
			videos,
			shapes,
			icons,
			backgroundImage,
			backgroundShapeRects,
		]
	);

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
								objectFit: "contain", // contain, cover, fill, none, scale-down
								borderWidth: 0,
								borderColor: "#000000",
								borderStyle: "solid", // solid, dashed, dotted
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
		e.target.value = ""; // Reset input
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
		e.target.value = ""; // Reset input
	};

	const updateImage = (id, updates) => {
		setImages((prev) =>
			prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
		);
	};

	// Calculate alignment guides based on element positions
	const calculateAlignmentGuides = (
		currentX,
		currentY,
		currentWidth,
		currentHeight,
		excludeId = null,
		excludeType = null
	) => {
		if (!previewRef.current) return { horizontal: [], vertical: [] };

		const previewWidth = previewRef.current.offsetWidth;
		const previewHeight = previewRef.current.offsetHeight;
		const snapThreshold = 5; // pixels - how close elements need to be to snap
		const guideVisibilityThreshold = 30; // pixels - show guides when within this distance

		const horizontalGuides = [];
		const verticalGuides = [];

		// Get all elements and their positions
		const allElements = [
			...images.map((img) => ({
				id: img.id,
				type: "image",
				x: img.x,
				y: img.y,
				width: img.width,
				height: img.height,
			})),
			...videos.map((vid) => ({
				id: vid.id,
				type: "video",
				x: vid.x,
				y: vid.y,
				width: vid.width,
				height: vid.height,
			})),
			...texts.map((txt) => ({
				id: txt.id,
				type: "text",
				x: txt.x,
				y: txt.y,
				width: txt.width,
				height: txt.height,
			})),
			...icons.map((icon) => ({
				id: icon.id,
				type: "icon",
				x: icon.x,
				y: icon.y,
				width: icon.width || 50,
				height: icon.height || 50,
			})),
			...shapes.map((shape) => ({
				id: shape.id,
				type: "shape",
				x: shape.x,
				y: shape.y,
				width: shape.width,
				height: shape.height,
			})),
			...backgroundShapeRects.map((rect) => ({
				id: rect.id,
				type: "backgroundShape",
				x: rect.x,
				y: rect.y,
				width: rect.width,
				height: rect.height,
			})),
		].filter((el) => !(el.id === excludeId && el.type === excludeType));

		// Calculate current element bounds in pixels
		const currentCenterX = (currentX / 100) * previewWidth;
		const currentCenterY = (currentY / 100) * previewHeight;
		const currentLeft = currentCenterX - currentWidth / 2;
		const currentRight = currentCenterX + currentWidth / 2;
		const currentTop = currentCenterY - currentHeight / 2;
		const currentBottom = currentCenterY + currentHeight / 2;

		// Check alignment with other elements
		allElements.forEach((element) => {
			const elCenterX = (element.x / 100) * previewWidth;
			const elCenterY = (element.y / 100) * previewHeight;
			const elLeft = elCenterX - element.width / 2;
			const elRight = elCenterX + element.width / 2;
			const elTop = elCenterY - element.height / 2;
			const elBottom = elCenterY + element.height / 2;

			// Horizontal alignment checks (vertical guides)
			// Center alignment
			if (Math.abs(currentCenterX - elCenterX) < guideVisibilityThreshold) {
				verticalGuides.push({
					position: elCenterX,
					type: "center",
					elementId: element.id,
					elementType: element.type,
				});
			}
			// Left edge alignment
			if (Math.abs(currentLeft - elLeft) < guideVisibilityThreshold) {
				verticalGuides.push({
					position: elLeft,
					type: "left",
					elementId: element.id,
					elementType: element.type,
				});
			}
			// Right edge alignment
			if (Math.abs(currentRight - elRight) < guideVisibilityThreshold) {
				verticalGuides.push({
					position: elRight,
					type: "right",
					elementId: element.id,
					elementType: element.type,
				});
			}
			// Current left to other right
			if (Math.abs(currentLeft - elRight) < guideVisibilityThreshold) {
				verticalGuides.push({
					position: elRight,
					type: "left-to-right",
					elementId: element.id,
					elementType: element.type,
				});
			}
			// Current right to other left
			if (Math.abs(currentRight - elLeft) < guideVisibilityThreshold) {
				verticalGuides.push({
					position: elLeft,
					type: "right-to-left",
					elementId: element.id,
					elementType: element.type,
				});
			}

			// Vertical alignment checks (horizontal guides)
			// Center alignment
			if (Math.abs(currentCenterY - elCenterY) < guideVisibilityThreshold) {
				horizontalGuides.push({
					position: elCenterY,
					type: "center",
					elementId: element.id,
					elementType: element.type,
				});
			}
			// Top edge alignment
			if (Math.abs(currentTop - elTop) < guideVisibilityThreshold) {
				horizontalGuides.push({
					position: elTop,
					type: "top",
					elementId: element.id,
					elementType: element.type,
				});
			}
			// Bottom edge alignment
			if (Math.abs(currentBottom - elBottom) < guideVisibilityThreshold) {
				horizontalGuides.push({
					position: elBottom,
					type: "bottom",
					elementId: element.id,
					elementType: element.type,
				});
			}
			// Current top to other bottom
			if (Math.abs(currentTop - elBottom) < guideVisibilityThreshold) {
				horizontalGuides.push({
					position: elBottom,
					type: "top-to-bottom",
					elementId: element.id,
					elementType: element.type,
				});
			}
			// Current bottom to other top
			if (Math.abs(currentBottom - elTop) < guideVisibilityThreshold) {
				horizontalGuides.push({
					position: elTop,
					type: "bottom-to-top",
					elementId: element.id,
					elementType: element.type,
				});
			}
		});

		// Remove duplicates and return unique guides
		const uniqueVertical = Array.from(
			new Map(verticalGuides.map((g) => [g.position, g])).values()
		);
		const uniqueHorizontal = Array.from(
			new Map(horizontalGuides.map((g) => [g.position, g])).values()
		);

		return {
			horizontal: uniqueHorizontal,
			vertical: uniqueVertical,
		};
	};

	const handleImageMouseDown = (e, imageId) => {
		e.stopPropagation();
		const image = images.find((img) => img.id === imageId);
		if (!image) return;

		// Handle CMD/CTRL+click for multiple selection
		if (e.metaKey || e.ctrlKey) {
			if (selectedImages.includes(imageId)) {
				setSelectedImages((prev) => prev.filter((id) => id !== imageId));
			} else {
				setSelectedImages((prev) => [...prev, imageId]);
			}
			setSelectedImage(imageId);
			return;
		}

		// Single selection
		setSelectedImage(imageId);
		setSelectedImages([imageId]);
		setSelectedTexts([]);
		setSelectedVideos([]);
		setSelectedIcons([]);

		const startX = e.clientX;
		const startY = e.clientY;
		const startImageX = image.x;
		const startImageY = image.y;

		const handleMouseMove = (e) => {
			if (!previewRef.current) return;

			const deltaX =
				((e.clientX - startX) / previewRef.current.offsetWidth) * 100;
			const deltaY =
				((e.clientY - startY) / previewRef.current.offsetHeight) * 100;

			let newX = Math.max(0, Math.min(100, startImageX + deltaX));
			let newY = Math.max(0, Math.min(100, startImageY + deltaY));

			// Calculate alignment guides
			const guides = calculateAlignmentGuides(
				newX,
				newY,
				image.width,
				image.height,
				imageId,
				"image"
			);

			// Apply snapping if guides are found
			if (guides.vertical.length > 0) {
				const previewWidth = previewRef.current.offsetWidth;
				const currentX = (newX / 100) * previewWidth;
				const closestGuide = guides.vertical.reduce((closest, guide) => {
					const dist = Math.abs(currentX - guide.position);
					const closestDist = Math.abs(currentX - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentX - closestGuide.position) < 5) {
					newX = (closestGuide.position / previewWidth) * 100;
				}
			}

			if (guides.horizontal.length > 0) {
				const previewHeight = previewRef.current.offsetHeight;
				const currentY = (newY / 100) * previewHeight;
				const closestGuide = guides.horizontal.reduce((closest, guide) => {
					const dist = Math.abs(currentY - guide.position);
					const closestDist = Math.abs(currentY - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentY - closestGuide.position) < 5) {
					newY = (closestGuide.position / previewHeight) * 100;
				}
			}

			// Update alignment guides state
			setAlignmentGuides(guides);

			// Move all selected images if multiple are selected
			if (selectedImages.length > 1 && selectedImages.includes(imageId)) {
				selectedImages.forEach((id) => {
					const img = images.find((i) => i.id === id);
					if (img) {
						const newImgX = Math.max(0, Math.min(100, img.x + deltaX));
						const newImgY = Math.max(0, Math.min(100, img.y + deltaY));
						updateImage(id, { x: newImgX, y: newImgY });
					}
				});
			} else {
				updateImage(imageId, { x: newX, y: newY });
			}
		};

		const handleMouseUp = () => {
			setAlignmentGuides({ horizontal: [], vertical: [] });
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
		e.target.value = ""; // Reset input
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
		e.target.value = ""; // Reset input
	};

	const updateVideo = (id, updates) => {
		setVideos((prev) =>
			prev.map((vid) => (vid.id === id ? { ...vid, ...updates } : vid))
		);
	};

	const handleVideoMouseDown = (e, videoId) => {
		e.stopPropagation();
		const video = videos.find((vid) => vid.id === videoId);
		if (!video) return;

		// Handle CMD/CTRL+click for multiple selection
		if (e.metaKey || e.ctrlKey) {
			if (selectedVideos.includes(videoId)) {
				setSelectedVideos((prev) => prev.filter((id) => id !== videoId));
			} else {
				setSelectedVideos((prev) => [...prev, videoId]);
			}
			setSelectedVideo(videoId);
			return;
		}

		// Single selection
		setSelectedVideo(videoId);
		setSelectedVideos([videoId]);
		setSelectedImages([]);
		setSelectedTexts([]);
		setSelectedIcons([]);

		const startX = e.clientX;
		const startY = e.clientY;
		const startVideoX = video.x;
		const startVideoY = video.y;

		const handleMouseMove = (e) => {
			if (!previewRef.current) return;

			const deltaX =
				((e.clientX - startX) / previewRef.current.offsetWidth) * 100;
			const deltaY =
				((e.clientY - startY) / previewRef.current.offsetHeight) * 100;

			let newX = Math.max(0, Math.min(100, startVideoX + deltaX));
			let newY = Math.max(0, Math.min(100, startVideoY + deltaY));

			// Calculate alignment guides
			const guides = calculateAlignmentGuides(
				newX,
				newY,
				video.width,
				video.height,
				videoId,
				"video"
			);

			// Apply snapping if guides are found
			if (guides.vertical.length > 0) {
				const previewWidth = previewRef.current.offsetWidth;
				const currentX = (newX / 100) * previewWidth;
				const closestGuide = guides.vertical.reduce((closest, guide) => {
					const dist = Math.abs(currentX - guide.position);
					const closestDist = Math.abs(currentX - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentX - closestGuide.position) < 5) {
					newX = (closestGuide.position / previewWidth) * 100;
				}
			}

			if (guides.horizontal.length > 0) {
				const previewHeight = previewRef.current.offsetHeight;
				const currentY = (newY / 100) * previewHeight;
				const closestGuide = guides.horizontal.reduce((closest, guide) => {
					const dist = Math.abs(currentY - guide.position);
					const closestDist = Math.abs(currentY - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentY - closestGuide.position) < 5) {
					newY = (closestGuide.position / previewHeight) * 100;
				}
			}

			// Update alignment guides state
			setAlignmentGuides(guides);

			// Move all selected videos if multiple are selected
			if (selectedVideos.length > 1 && selectedVideos.includes(videoId)) {
				selectedVideos.forEach((id) => {
					const vid = videos.find((v) => v.id === id);
					if (vid) {
						const newVidX = Math.max(0, Math.min(100, vid.x + deltaX));
						const newVidY = Math.max(0, Math.min(100, vid.y + deltaY));
						updateVideo(id, { x: newVidX, y: newVidY });
					}
				});
			} else {
				updateVideo(videoId, { x: newX, y: newY });
			}
		};

		const handleMouseUp = () => {
			setAlignmentGuides({ horizontal: [], vertical: [] });
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
	const addShape = (shapeType, svgString = null, shapeName = null) => {
		// Check if this is an SVG shape from the icon selector
		const isSvgShape = svgString !== null;

		const newShape = {
			id: Date.now() + Math.random(),
			type: isSvgShape ? "svg" : shapeType, // "rectangle", "square", "line", "triangle", "circle", "svg"
			svgString: svgString, // Store SVG string for SVG shapes
			shapeName: shapeName || shapeType, // Store shape name for display
			x: 50,
			y: 50,
			width: isSvgShape
				? 100
				: shapeType === "line"
					? 200
					: shapeType === "square" || shapeType === "circle"
						? 150
						: 200,
			height: isSvgShape
				? 100
				: shapeType === "line"
					? 2
					: shapeType === "square" || shapeType === "circle"
						? 150
						: 150,
			styles: {
				fillColor: "#3b82f6",
				strokeColor: "#1e40af",
				strokeWidth: 2,
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
		setIsIconSelectorOpen(false);
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

	// Update z-index for layer list drag and drop
	const handleUpdateZIndex = (type, id, newZIndex) => {
		if (type === "image") {
			updateImage(id, {
				styles: {
					...(images.find((img) => img.id === id)?.styles || {}),
					zIndex: newZIndex,
				},
			});
		} else if (type === "video") {
			updateVideo(id, {
				styles: {
					...(videos.find((vid) => vid.id === id)?.styles || {}),
					zIndex: newZIndex,
				},
			});
		} else if (type === "text") {
			updateText(id, {
				styles: {
					...(texts.find((txt) => txt.id === id)?.styles || {}),
					zIndex: newZIndex,
				},
			});
		} else if (type === "shape") {
			updateShape(id, {
				styles: {
					...(shapes.find((s) => s.id === id)?.styles || {}),
					zIndex: newZIndex,
				},
			});
		} else if (type === "icon") {
			updateIcon(id, {
				styles: {
					...(icons.find((i) => i.id === id)?.styles || {}),
					zIndex: newZIndex,
				},
			});
		} else if (type === "backgroundShape") {
			updateBackgroundShapeRect(id, {
				styles: {
					...(backgroundShapeRects.find((r) => r.id === id)?.styles || {}),
					zIndex: newZIndex,
				},
			});
		}
	};

	// Handle delete from layer list
	const handleDeleteLayer = (type, id) => {
		if (type === "image") {
			removeImage(id);
		} else if (type === "video") {
			removeVideo(id);
		} else if (type === "text") {
			removeText(id);
		} else if (type === "shape") {
			removeShape(id);
		} else if (type === "icon") {
			removeIcon(id);
		} else if (type === "backgroundShape") {
			removeBackgroundShapeRect(id);
		}
	};

	// Handle selection from layer list
	const handleLayerSelect = (type, id) => {
		// Deselect all first
		setSelectedImage(null);
		setSelectedVideo(null);
		setSelectedText(null);
		setSelectedShape(null);
		setSelectedIcon(null);
		setSelectedBackgroundShapeRect(null);

		// Select the clicked item
		if (type === "image") {
			setSelectedImage(id);
		} else if (type === "video") {
			setSelectedVideo(id);
		} else if (type === "text") {
			setSelectedText(id);
		} else if (type === "shape") {
			setSelectedShape(id);
		} else if (type === "icon") {
			setSelectedIcon(id);
		} else if (type === "backgroundShape") {
			setSelectedBackgroundShapeRect(id);
		}
	};

	// Background shape rectangle handling functions
	const addBackgroundShapeRect = (shapeId) => {
		if (!previewRef.current) return;

		const previewRect = previewRef.current.getBoundingClientRect();
		const newRect = {
			id: Date.now() + Math.random(),
			shapeId: shapeId,
			x: 50, // Center
			y: 50, // Center
			width: previewRect.width,
			height: previewRect.height,
			scale: 1,
			styles: {
				opacity: 1,
				zIndex: 1,
				rotation: 0,
				skewX: 0,
				skewY: 0,
			},
		};
		setBackgroundShapeRects((prev) => [...prev, newRect]);
		setSelectedBackgroundShapeRect(newRect.id);
		// Deselect other elements
		setSelectedImage(null);
		setSelectedText(null);
		setSelectedVideo(null);
		setSelectedShape(null);
		setSelectedIcon(null);
		setSelectedStop(null);
	};

	const removeBackgroundShapeRect = (id) => {
		setBackgroundShapeRects((prev) => prev.filter((rect) => rect.id !== id));
		if (selectedBackgroundShapeRect === id)
			setSelectedBackgroundShapeRect(null);
	};

	const updateBackgroundShapeRect = (id, updates) => {
		setBackgroundShapeRects((prev) =>
			prev.map((rect) => (rect.id === id ? { ...rect, ...updates } : rect))
		);
	};

	const handleBackgroundShapeRectMouseDown = (e, rectId) => {
		e.stopPropagation();
		// Set selection immediately on mousedown
		setSelectedBackgroundShapeRect(rectId);
		// Also deselect other elements
		setSelectedImage(null);
		setSelectedText(null);
		setSelectedVideo(null);
		setSelectedShape(null);
		setSelectedIcon(null);
		setSelectedStop(null);

		const rect = backgroundShapeRects.find((r) => r.id === rectId);
		if (!rect) return;

		const startX = e.clientX;
		const startY = e.clientY;
		const startRectX = rect.x;
		const startRectY = rect.y;

		const handleMouseMove = (e) => {
			if (!previewRef.current) return;

			const deltaX =
				((e.clientX - startX) / previewRef.current.offsetWidth) * 100;
			const deltaY =
				((e.clientY - startY) / previewRef.current.offsetHeight) * 100;

			let newX = Math.max(0, Math.min(100, startRectX + deltaX));
			let newY = Math.max(0, Math.min(100, startRectY + deltaY));

			// Calculate alignment guides
			const guides = calculateAlignmentGuides(
				newX,
				newY,
				rect.width,
				rect.height,
				rectId,
				"backgroundShape"
			);

			// Apply snapping if guides are found
			if (guides.vertical.length > 0) {
				const previewWidth = previewRef.current.offsetWidth;
				const currentX = (newX / 100) * previewWidth;
				const closestGuide = guides.vertical.reduce((closest, guide) => {
					const dist = Math.abs(currentX - guide.position);
					const closestDist = Math.abs(currentX - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentX - closestGuide.position) < 5) {
					newX = (closestGuide.position / previewWidth) * 100;
				}
			}

			if (guides.horizontal.length > 0) {
				const previewHeight = previewRef.current.offsetHeight;
				const currentY = (newY / 100) * previewHeight;
				const closestGuide = guides.horizontal.reduce((closest, guide) => {
					const dist = Math.abs(currentY - guide.position);
					const closestDist = Math.abs(currentY - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentY - closestGuide.position) < 5) {
					newY = (closestGuide.position / previewHeight) * 100;
				}
			}

			// Update alignment guides state
			setAlignmentGuides(guides);

			updateBackgroundShapeRect(rectId, { x: newX, y: newY });
		};

		const handleMouseUp = () => {
			setAlignmentGuides({ horizontal: [], vertical: [] });
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleBackgroundShapeRectResizeStart = (e, rectId, corner) => {
		e.stopPropagation();
		e.preventDefault();
		const rect = backgroundShapeRects.find((r) => r.id === rectId);
		if (!rect || !previewRef.current) return;

		const previewRect = previewRef.current.getBoundingClientRect();
		const startX = e.clientX;
		const startY = e.clientY;
		const startWidth = rect.width;
		const startHeight = rect.height;
		const startRectX = rect.x;
		const startRectY = rect.y;

		const rectCenterX = (startRectX / 100) * previewRect.width;
		const rectCenterY = (startRectY / 100) * previewRect.height;
		const rectLeft = rectCenterX - startWidth / 2;
		const rectTop = rectCenterY - startHeight / 2;

		const handleMouseMove = (e) => {
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			let newWidth = startWidth;
			let newHeight = startHeight;
			let newX = startRectX;
			let newY = startRectY;

			if (corner.includes("e")) {
				newWidth = Math.max(20, startWidth + deltaX);
			}
			if (corner.includes("w")) {
				newWidth = Math.max(20, startWidth - deltaX);
				newX = startRectX - (deltaX / previewRect.width) * 100;
			}
			if (corner.includes("s")) {
				newHeight = Math.max(20, startHeight + deltaY);
			}
			if (corner.includes("n")) {
				newHeight = Math.max(20, startHeight - deltaY);
				newY = startRectY - (deltaY / previewRect.height) * 100;
			}

			updateBackgroundShapeRect(rectId, {
				width: newWidth,
				height: newHeight,
				x: newX,
				y: newY,
			});
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
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
			if (!previewRef.current) return;

			const deltaX =
				((e.clientX - startX) / previewRef.current.offsetWidth) * 100;
			const deltaY =
				((e.clientY - startY) / previewRef.current.offsetHeight) * 100;

			let newX = Math.max(0, Math.min(100, startShapeX + deltaX));
			let newY = Math.max(0, Math.min(100, startShapeY + deltaY));

			// Calculate alignment guides
			const guides = calculateAlignmentGuides(
				newX,
				newY,
				shape.width,
				shape.height,
				shapeId,
				"shape"
			);

			// Apply snapping if guides are found
			if (guides.vertical.length > 0) {
				const previewWidth = previewRef.current.offsetWidth;
				const currentX = (newX / 100) * previewWidth;
				const closestGuide = guides.vertical.reduce((closest, guide) => {
					const dist = Math.abs(currentX - guide.position);
					const closestDist = Math.abs(currentX - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentX - closestGuide.position) < 5) {
					newX = (closestGuide.position / previewWidth) * 100;
				}
			}

			if (guides.horizontal.length > 0) {
				const previewHeight = previewRef.current.offsetHeight;
				const currentY = (newY / 100) * previewHeight;
				const closestGuide = guides.horizontal.reduce((closest, guide) => {
					const dist = Math.abs(currentY - guide.position);
					const closestDist = Math.abs(currentY - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentY - closestGuide.position) < 5) {
					newY = (closestGuide.position / previewHeight) * 100;
				}
			}

			// Update alignment guides state
			setAlignmentGuides(guides);

			updateShape(shapeId, { x: newX, y: newY });
		};

		const handleMouseUp = () => {
			setAlignmentGuides({ horizontal: [], vertical: [] });
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
			if (shape.type === "square" || shape.type === "circle") {
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

	// Handle click outside shape dropdown

	// Handle click outside background image dropdown

	// Handle background image upload
	const handleBackgroundImageUpload = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = (event) => {
				setBackgroundImage(event.target.result);
				setIsBackgroundImageDropdownOpen(false);
				// Clear gradient stops when background image is selected
				setGradient((prev) => ({
					...prev,
					stops: [],
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	// Handle click outside gradient presets dropdown

	// Handle click outside icon selector dropdown

	// Handle click outside URL screenshot dropdown

	// Text handling functions
	// Icon handling functions
	// Get all available icon names from LucideIcons

	const addIcon = (iconName, IconComponent) => {
		// Look up from AllIcons (combined Lucide + Huge icons) if no component passed
		const ResolvedComponent = IconComponent || AllIcons[iconName];
		if (!ResolvedComponent) return;

		// Determine the icon key for storage (try to find the display name)
		const iconKey = IconComponent?.displayName || iconName;

		const newIcon = {
			id: Date.now() + Math.random(),
			iconName: iconKey,
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
		const icon = icons.find((i) => i.id === iconId);
		if (!icon) return;

		// Handle CMD/CTRL+click for multiple selection
		if (e.metaKey || e.ctrlKey) {
			if (selectedIcons.includes(iconId)) {
				setSelectedIcons((prev) => prev.filter((id) => id !== iconId));
			} else {
				setSelectedIcons((prev) => [...prev, iconId]);
			}
			setSelectedIcon(iconId);
			return;
		}

		// Single selection
		setSelectedIcon(iconId);
		setSelectedIcons([iconId]);
		setSelectedImages([]);
		setSelectedTexts([]);
		setSelectedVideos([]);

		const startX = e.clientX;
		const startY = e.clientY;
		const startIconX = icon.x;
		const startIconY = icon.y;

		const handleMouseMove = (e) => {
			if (!previewRef.current) return;

			const deltaX =
				((e.clientX - startX) / previewRef.current.offsetWidth) * 100;
			const deltaY =
				((e.clientY - startY) / previewRef.current.offsetHeight) * 100;

			let newX = Math.max(0, Math.min(100, startIconX + deltaX));
			let newY = Math.max(0, Math.min(100, startIconY + deltaY));

			// Calculate alignment guides
			const iconWidth = icon.width || 50;
			const iconHeight = icon.height || 50;
			const guides = calculateAlignmentGuides(
				newX,
				newY,
				iconWidth,
				iconHeight,
				iconId,
				"icon"
			);

			// Apply snapping if guides are found
			if (guides.vertical.length > 0) {
				const previewWidth = previewRef.current.offsetWidth;
				const currentX = (newX / 100) * previewWidth;
				const closestGuide = guides.vertical.reduce((closest, guide) => {
					const dist = Math.abs(currentX - guide.position);
					const closestDist = Math.abs(currentX - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentX - closestGuide.position) < 5) {
					newX = (closestGuide.position / previewWidth) * 100;
				}
			}

			if (guides.horizontal.length > 0) {
				const previewHeight = previewRef.current.offsetHeight;
				const currentY = (newY / 100) * previewHeight;
				const closestGuide = guides.horizontal.reduce((closest, guide) => {
					const dist = Math.abs(currentY - guide.position);
					const closestDist = Math.abs(currentY - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentY - closestGuide.position) < 5) {
					newY = (closestGuide.position / previewHeight) * 100;
				}
			}

			// Update alignment guides state
			setAlignmentGuides(guides);

			// Move all selected icons if multiple are selected
			if (selectedIcons.length > 1 && selectedIcons.includes(iconId)) {
				selectedIcons.forEach((id) => {
					const ic = icons.find((i) => i.id === id);
					if (ic) {
						const newIcX = Math.max(0, Math.min(100, ic.x + deltaX));
						const newIcY = Math.max(0, Math.min(100, ic.y + deltaY));
						updateIcon(id, { x: newIcX, y: newIcY });
					}
				});
			} else {
				updateIcon(iconId, { x: newX, y: newY });
			}
		};

		const handleMouseUp = () => {
			setAlignmentGuides({ horizontal: [], vertical: [] });
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
				fontWeight: "normal", // normal, bold
				fontStyle: "normal", // normal, italic
				color: "#000000",
				textAlign: "left", // left, center, right
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
		if (textEditing === textId) return; // Don't drag while editing

		const text = texts.find((txt) => txt.id === textId);
		if (!text) return;

		// Handle CMD/CTRL+click for multiple selection
		if (e.metaKey || e.ctrlKey) {
			if (selectedTexts.includes(textId)) {
				setSelectedTexts((prev) => prev.filter((id) => id !== textId));
			} else {
				setSelectedTexts((prev) => [...prev, textId]);
			}
			setSelectedText(textId);
			return;
		}

		// Single selection
		setSelectedText(textId);
		setSelectedTexts([textId]);
		setSelectedImages([]);
		setSelectedVideos([]);
		setSelectedIcons([]);

		const startX = e.clientX;
		const startY = e.clientY;
		const startTextX = text.x;
		const startTextY = text.y;

		const handleMouseMove = (e) => {
			if (!previewRef.current) return;

			const deltaX =
				((e.clientX - startX) / previewRef.current.offsetWidth) * 100;
			const deltaY =
				((e.clientY - startY) / previewRef.current.offsetHeight) * 100;

			let newX = Math.max(0, Math.min(100, startTextX + deltaX));
			let newY = Math.max(0, Math.min(100, startTextY + deltaY));

			// Calculate alignment guides
			const guides = calculateAlignmentGuides(
				newX,
				newY,
				text.width,
				text.height,
				textId,
				"text"
			);

			// Apply snapping if guides are found
			if (guides.vertical.length > 0) {
				const previewWidth = previewRef.current.offsetWidth;
				const currentX = (newX / 100) * previewWidth;
				const closestGuide = guides.vertical.reduce((closest, guide) => {
					const dist = Math.abs(currentX - guide.position);
					const closestDist = Math.abs(currentX - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentX - closestGuide.position) < 5) {
					newX = (closestGuide.position / previewWidth) * 100;
				}
			}

			if (guides.horizontal.length > 0) {
				const previewHeight = previewRef.current.offsetHeight;
				const currentY = (newY / 100) * previewHeight;
				const closestGuide = guides.horizontal.reduce((closest, guide) => {
					const dist = Math.abs(currentY - guide.position);
					const closestDist = Math.abs(currentY - closest.position);
					return dist < closestDist ? guide : closest;
				});
				if (Math.abs(currentY - closestGuide.position) < 5) {
					newY = (closestGuide.position / previewHeight) * 100;
				}
			}

			// Update alignment guides state
			setAlignmentGuides(guides);

			// Move all selected texts if multiple are selected
			if (selectedTexts.length > 1 && selectedTexts.includes(textId)) {
				selectedTexts.forEach((id) => {
					const txt = texts.find((t) => t.id === id);
					if (txt) {
						const newTxtX = Math.max(0, Math.min(100, txt.x + deltaX));
						const newTxtY = Math.max(0, Math.min(100, txt.y + deltaY));
						updateText(id, { x: newTxtX, y: newTxtY });
					}
				});
			} else {
				updateText(textId, { x: newX, y: newY });
			}
		};

		const handleMouseUp = () => {
			setAlignmentGuides({ horizontal: [], vertical: [] });
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
	}, []);

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

	const generateGradientCSS = (sourceGradient = gradient) => {
		// Return white background if no color stops
		if (!sourceGradient?.stops || sourceGradient.stops.length === 0) {
			return "#ffffff";
		}

		const sortedStops = [...sourceGradient.stops].sort((a, b) => {
			// Sort by distance from top-left corner for consistent ordering
			const distA = Math.sqrt(
				a.position.x * a.position.x + a.position.y * a.position.y
			);
			const distB = Math.sqrt(
				b.position.x * b.position.x + b.position.y * b.position.y
			);
			return distA - distB;
		});

		if (sourceGradient.type === "linear") {
			// Calculate angle from first and last stop
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

		if (sourceGradient.type === "radial") {
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

		if (sourceGradient.type === "conic") {
			const stopsString = sortedStops
				.map((stop) => `${stop.color} ${Math.round(stop.position.x)}%`)
				.join(", ");

			return `conic-gradient(from 0deg, ${stopsString})`;
		}

		if (sourceGradient.type === "rectangle") {
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

		if (sourceGradient.type === "ellipse") {
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

		if (sourceGradient.type === "polygon") {
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

		if (sourceGradient.type === "mesh") {
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

	// Simple CSS generation for main preview
	const generateAnimationCSS = (sourceGradient = gradient) => {
		const { type, duration, easing, direction } = sourceGradient.animation;
		const {
			type: bgType,
			direction: bgDirection,
			speed,
			easing: bgEasing,
			repeat,
		} = sourceGradient.backgroundAnimation;

		let animation = "";
		let backgroundAnimation = "";

		// Element animation
		if (sourceGradient.animation.enabled) {
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

		// Background animation
		if (sourceGradient.backgroundAnimation.enabled) {
			const infinite = repeat ? "infinite" : "1";
			switch (bgType) {
				case "slide":
					if (bgDirection === "right") {
						backgroundAnimation = `slideRight ${speed}s ${bgEasing} ${infinite}`;
					} else if (bgDirection === "left") {
						backgroundAnimation = `slideLeft ${speed}s ${bgEasing} ${infinite}`;
					} else if (bgDirection === "up") {
						backgroundAnimation = `slideUp ${speed}s ${bgEasing} ${infinite}`;
					} else {
						backgroundAnimation = `slideDown ${speed}s ${bgEasing} ${infinite}`;
					}
					break;
				case "wave":
					backgroundAnimation = `wave ${speed}s ${bgEasing} ${infinite}`;
					break;
			}
		}

		return { animation, backgroundAnimation };
	};

	const buildFrameStateForHtml = (frameOverride = null) => {
		if (!frameOverride) {
			return {
				gradient,
				images,
				videos,
				texts,
				shapes,
				icons,
				backgroundImage,
				backgroundShapeRects,
			};
		}

		return {
			gradient: frameOverride.gradient || createInitialGradient(),
			images: Array.isArray(frameOverride.images) ? frameOverride.images : [],
			videos: Array.isArray(frameOverride.videos) ? frameOverride.videos : [],
			texts: Array.isArray(frameOverride.texts) ? frameOverride.texts : [],
			shapes: Array.isArray(frameOverride.shapes) ? frameOverride.shapes : [],
			icons: Array.isArray(frameOverride.icons) ? frameOverride.icons : [],
			backgroundImage:
				frameOverride.backgroundImage !== undefined
					? frameOverride.backgroundImage
					: null,
			backgroundShapeRects: Array.isArray(frameOverride.backgroundShapeRects)
				? frameOverride.backgroundShapeRects
				: [],
		};
	};

	// Simple modal animation styles - direct CSS animations
	const getModalStyles = () => {
		const { type, duration, easing, direction } = gradient.animation;
		const {
			type: bgType,
			direction: bgDirection,
			speed,
			easing: bgEasing,
			repeat,
		} = gradient.backgroundAnimation;

		let containerStyle = {
			width: "100%",
			height: "100%",
			background: generateGradientCSS(),
			filter: gradient.noise.enabled
				? `contrast(${1 + gradient.noise.intensity * 0.2}) brightness(${
						1 + gradient.noise.intensity * 0.1
					})`
				: "none",
		};

		let overlayStyle = {};

		// Element animations
		if (gradient.animation.enabled && isPlaying) {
			const infinite = repeat ? "infinite" : "1";
			switch (type) {
				case "rotate":
					overlayStyle.animation = `spin ${duration}s ${easing} ${direction} ${infinite}`;
					overlayStyle.transformOrigin = "center";
					break;
				case "pulse":
					overlayStyle.animation = `pulse ${duration}s ${easing} ${direction} ${infinite}`;
					break;
				case "shift":
					overlayStyle.animation = `bounce ${duration}s ${easing} ${direction} ${infinite}`;
					break;
			}
		}

		// Background animations
		if (gradient.backgroundAnimation.enabled && isPlaying) {
			const infinite = repeat ? "infinite" : "1";
			switch (bgType) {
				case "slide":
					containerStyle.backgroundSize = "200% 200%";
					if (bgDirection === "right") {
						containerStyle.animation = `slideRight ${speed}s ${bgEasing} ${infinite}`;
					} else if (bgDirection === "left") {
						containerStyle.animation = `slideLeft ${speed}s ${bgEasing} ${infinite}`;
					} else if (bgDirection === "up") {
						containerStyle.animation = `slideUp ${speed}s ${bgEasing} ${infinite}`;
					} else {
						containerStyle.animation = `slideDown ${speed}s ${bgEasing} ${infinite}`;
					}
					break;
				case "wave":
					containerStyle.backgroundSize = "200% 200%";
					containerStyle.animation = `wave ${speed}s ${bgEasing} ${infinite}`;
					break;
			}
		}

		return { containerStyle, overlayStyle };
	};

	// Helper function to format shadow CSS (for box-shadow)
	const formatShadowCSS = (shadow) => {
		if (!shadow || (typeof shadow === "string" && shadow === "none")) {
			return "none";
		}
		// Handle old string format for backward compatibility
		if (typeof shadow === "string") {
			switch (shadow) {
				case "sm":
					return "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
				case "md":
					return "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
				case "lg":
					return "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
				case "xl":
					return "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
				case "2xl":
					return "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
				default:
					return "none";
			}
		}
		// New object format
		if (
			!shadow.enabled ||
			(shadow.x === 0 && shadow.y === 0 && shadow.blur === 0)
		) {
			return "none";
		}
		const color = shadow.color || "#000000";
		// Convert hex to rgba with opacity
		let rgbaColor = color;
		if (color.startsWith("#") && color.length === 7) {
			const r = parseInt(color.slice(1, 3), 16);
			const g = parseInt(color.slice(3, 5), 16);
			const b = parseInt(color.slice(5, 7), 16);
			rgbaColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
		}
		return `${shadow.x || 0}px ${shadow.y || 0}px ${
			shadow.blur || 0
		}px ${rgbaColor}`;
	};

	// Helper function to format drop-shadow CSS (for filter)
	// Format text content with links and lists
	const formatTextContent = (content, styles) => {
		if (!content) return "";

		let formatted = content;

		// Handle list styles
		if (styles?.listStyle === "ordered" || styles?.listStyle === "unordered") {
			const lines = formatted.split("\n");
			const result = [];
			let currentList = [];
			let isInList = false;
			const listTag = styles.listStyle === "ordered" ? "ol" : "ul";

			lines.forEach((line) => {
				const trimmedLine = line.trim();
				// Check if line is a list item (supports: 1. text, - text, * text, • text)
				const isListItem =
					/^\d+\.\s/.test(trimmedLine) || /^[-*•]\s/.test(trimmedLine);

				if (isListItem) {
					if (!isInList) {
						isInList = true;
						currentList = [];
					}
					// Remove list marker and escape HTML
					const itemText = trimmedLine
						.replace(/^[-*•]\s/, "")
						.replace(/^\d+\.\s/, "")
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;");
					currentList.push(`<li>${itemText}</li>`);
				} else {
					// Close previous list if exists
					if (isInList && currentList.length > 0) {
						result.push(`<${listTag}>${currentList.join("")}</${listTag}>`);
						currentList = [];
						isInList = false;
					}
					// Add regular line as paragraph or empty
					if (trimmedLine) {
						const escapedLine = trimmedLine
							.replace(/</g, "&lt;")
							.replace(/>/g, "&gt;");
						result.push(`<p style="margin: 0;">${escapedLine}</p>`);
					}
				}
			});

			// Handle remaining list items
			if (isInList && currentList.length > 0) {
				result.push(`<${listTag}>${currentList.join("")}</${listTag}>`);
			}

			formatted = result.length > 0 ? result.join("") : formatted;
		} else {
			// Regular text - escape HTML and preserve line breaks
			formatted = formatted
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/\n/g, "<br />");
		}

		// Handle links
		if (styles?.linkUrl) {
			const linkTarget = styles.linkTarget || "_self";
			const escapedUrl = styles.linkUrl
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#39;");
			// Wrap entire content in link if linkUrl is set
			formatted = `<a href="${escapedUrl}" target="${linkTarget}" rel="noopener noreferrer" style="color: inherit; text-decoration: inherit;">${formatted}</a>`;
		}

		return formatted;
	};

	const formatDropShadowCSS = (shadow) => {
		if (!shadow || (typeof shadow === "string" && shadow === "none")) {
			return "none";
		}
		// Handle old string format for backward compatibility
		if (typeof shadow === "string") {
			switch (shadow) {
				case "sm":
					return "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))";
				case "md":
					return "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))";
				case "lg":
					return "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))";
				case "xl":
					return "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.1))";
				case "2xl":
					return "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))";
				default:
					return "none";
			}
		}
		// New object format
		if (
			!shadow.enabled ||
			(shadow.x === 0 && shadow.y === 0 && shadow.blur === 0)
		) {
			return "none";
		}
		const color = shadow.color || "#000000";
		// Convert hex to rgba with opacity
		let rgbaColor = color;
		if (color.startsWith("#") && color.length === 7) {
			const r = parseInt(color.slice(1, 3), 16);
			const g = parseInt(color.slice(3, 5), 16);
			const b = parseInt(color.slice(5, 7), 16);
			rgbaColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
		}
		return `drop-shadow(${shadow.x || 0}px ${shadow.y || 0}px ${
			shadow.blur || 0
		}px ${rgbaColor})`;
	};

	const copyToClipboard = async (text, type) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(type);
			setTimeout(() => setCopied(""), 2000);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	const generateFrameHTML = (frameOverride = null) => {
		const {
			gradient: frameGradient,
			images: frameImages,
			videos: frameVideos,
			texts: frameTexts,
			shapes: frameShapes,
			icons: frameIcons,
			backgroundImage: frameBackgroundImage,
			backgroundShapeRects: frameBackgroundShapeRects,
		} = buildFrameStateForHtml(frameOverride);

		const { width, height } = frameGradient.dimensions;
		const gradientCSS = generateGradientCSS(frameGradient);
		const { animation: elementAnimation, backgroundAnimation } =
			generateAnimationCSS(frameGradient);

		// Helper to build transform string
		const buildTransform = (element) => {
			const transforms = ["translate(-50%, -50%)"];
			if (element.styles?.rotation) {
				transforms.push(`rotate(${element.styles.rotation}deg)`);
			}
			if (element.styles?.skewX || element.styles?.skewY) {
				transforms.push(
					`skew(${element.styles.skewX || 0}deg, ${
						element.styles.skewY || 0
					}deg)`
				);
			}
			return transforms.join(" ");
		};

		// Helper to generate background shape SVG pattern
		const generateBackgroundShapePattern = (rect) => {
			// This is a simplified version - in production you'd want to import the actual patterns
			const uniqueId = `${rect.shapeId}-${rect.id}`;
			const scale = rect.scale || 1;
			// Basic pattern generation - you may want to expand this based on actual shape patterns
			return `<svg width="100%" height="100%" style="position: absolute; inset: 0; pointer-events: none;">
                <defs>
                    <pattern id="${uniqueId}-pattern" x="0" y="0" width="${
											20 * scale
										}" height="${20 * scale}" patternUnits="userSpaceOnUse">
                        <circle cx="${10 * scale}" cy="${10 * scale}" r="${
													2 * scale
												}" fill="currentColor" opacity="0.3" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#${uniqueId}-pattern)" />
            </svg>`;
		};

		// Collect all elements and sort by z-index
		const allElements = [
			// Background shapes
			...frameBackgroundShapeRects.map((rect) => ({
				type: "backgroundShape",
				element: rect,
				zIndex: rect.styles?.zIndex || 0,
			})),
			// Images
			...frameImages.map((image) => ({
				type: "image",
				element: image,
				zIndex: image.styles?.zIndex || 1,
			})),
			// Videos
			...frameVideos.map((video) => ({
				type: "video",
				element: video,
				zIndex: video.styles?.zIndex || 1,
			})),
			// Texts
			...frameTexts.map((text) => ({
				type: "text",
				element: text,
				zIndex: text.styles?.zIndex || 2,
			})),
			// Shapes
			...frameShapes.map((shape) => ({
				type: "shape",
				element: shape,
				zIndex: shape.styles?.zIndex || 1,
			})),
			// Icons
			...frameIcons.map((icon) => ({
				type: "icon",
				element: icon,
				zIndex: icon.styles?.zIndex || 1,
			})),
		].sort((a, b) => a.zIndex - b.zIndex);

		// Generate HTML for each element
		const elementsHTML = allElements
			.map(({ type, element }) => {
				if (type === "backgroundShape") {
					const rect = element;
					const styles = rect.styles || {};
					const transform = buildTransform(rect);
					const style = `
						position: absolute;
						left: ${rect.x}%;
						top: ${rect.y}%;
						width: ${rect.width}px;
						height: ${rect.height}px;
						transform: ${transform};
						z-index: ${styles.zIndex || 0};
						opacity: ${styles.opacity !== undefined ? styles.opacity : 1};
						color: #000000;
					`
						.trim()
						.replace(/\s+/g, " ");
					return `<div style="${style}">${generateBackgroundShapePattern(
						rect
					)}</div>`;
				}

				if (type === "image") {
					const image = element;
					const styles = image.styles || {};
					const transform = buildTransform(image);
					const borderRadius =
						styles.borderRadius === 100
							? "50%"
							: `${styles.borderRadius || 0}px`;
					const wrapperStyle = `
						position: absolute;
						left: ${image.x}%;
						top: ${image.y}%;
						width: ${image.width}px;
						height: ${image.height}px;
						transform: ${transform};
						z-index: ${styles.zIndex || 1};
						border-radius: ${borderRadius};
						overflow: hidden;
						border-width: ${styles.borderWidth || 0}px;
						border-color: ${styles.borderColor || "#000000"};
						border-style: ${styles.borderStyle || "solid"};
						opacity: ${styles.opacity !== undefined ? styles.opacity : 1};
						box-shadow: ${formatShadowCSS(styles.shadow)};
						${
							styles.ringWidth > 0
								? `outline: ${styles.ringWidth}px solid ${
										styles.ringColor || "#3b82f6"
									}; outline-offset: 2px;`
								: ""
						}
					`
						.trim()
						.replace(/\s+/g, " ");
					const imgStyle = `
						width: 100%;
						height: 100%;
						object-fit: ${styles.objectFit || "contain"};
						${
							styles.noise?.enabled
								? `filter: contrast(${
										1 + (styles.noise.intensity || 0.3) * 0.2
									}) brightness(${1 + (styles.noise.intensity || 0.3) * 0.1});`
								: ""
						}
					`
						.trim()
						.replace(/\s+/g, " ");
					return `<div style="${wrapperStyle}"><img src="${
						image.src
					}" style="${imgStyle}" alt="${(image.caption || "").replace(
						/"/g,
						"&quot;"
					)}" /></div>`;
				}

				if (type === "video") {
					const video = element;
					const styles = video.styles || {};
					const transform = buildTransform(video);
					const borderRadius =
						styles.borderRadius === 100
							? "50%"
							: `${styles.borderRadius || 0}px`;
					const wrapperStyle = `
						position: absolute;
						left: ${video.x}%;
						top: ${video.y}%;
						width: ${video.width}px;
						height: ${video.height}px;
						transform: ${transform};
						z-index: ${styles.zIndex || 1};
						border-radius: ${borderRadius};
						overflow: hidden;
						border-width: ${styles.borderWidth || 0}px;
						border-color: ${styles.borderColor || "#000000"};
						border-style: ${styles.borderStyle || "solid"};
						opacity: ${styles.opacity !== undefined ? styles.opacity : 1};
						box-shadow: ${formatShadowCSS(styles.shadow)};
						${
							styles.ringWidth > 0
								? `outline: ${styles.ringWidth}px solid ${
										styles.ringColor || "#3b82f6"
									}; outline-offset: 2px;`
								: ""
						}
					`
						.trim()
						.replace(/\s+/g, " ");
					const videoStyle = `
						width: 100%;
						height: 100%;
						object-fit: ${styles.objectFit || "contain"};
					`
						.trim()
						.replace(/\s+/g, " ");
					return `<div style="${wrapperStyle}"><video src="${
						video.src
					}" style="${videoStyle}" ${
						styles.autoplay !== false ? "autoplay loop muted playsinline" : ""
					} controls></video></div>`;
				}

				if (type === "text") {
					const text = element;
					const styles = text.styles || {};
					const transform = buildTransform(text);
					const borderRadius =
						styles.borderRadius === 100
							? "50%"
							: `${styles.borderRadius || 0}px`;
					const style = `
						position: absolute;
						left: ${text.x}%;
						top: ${text.y}%;
						width: ${text.width}px;
						min-height: ${text.height}px;
						transform: ${transform};
						z-index: ${styles.zIndex || 2};
						font-size: ${styles.fontSize || 24}px;
						font-weight: ${styles.fontWeight || "normal"};
						font-style: ${styles.fontStyle || "normal"};
						font-family: ${styles.fontFamily || "Arial"};
						color: ${styles.color || "#000000"};
						text-align: ${styles.textAlign || "left"};
						background: ${styles.backgroundColor || "transparent"};
						padding: ${styles.padding || 0}px;
						border-radius: ${borderRadius};
						border-width: ${styles.borderWidth || 0}px;
						border-color: ${styles.borderColor || "#000000"};
						border-style: ${styles.borderStyle || "solid"};
						opacity: ${styles.opacity !== undefined ? styles.opacity : 1};
						box-shadow: ${formatShadowCSS(styles.shadow)};
						white-space: ${styles.listStyle !== "none" ? "normal" : "pre-wrap"};
						word-wrap: break-word;
					`
						.trim()
						.replace(/\s+/g, " ");
					const formattedContent = formatTextContent(text.content, styles);
					return `<div style="${style}">${formattedContent}</div>`;
				}

				if (type === "shape") {
					const shape = element;
					const styles = shape.styles || {};
					const shapeType = shape.shapeType || shape.type;
					const transform = buildTransform(shape);
					let shapeStyle = `
						position: absolute;
						left: ${shape.x}%;
						top: ${shape.y}%;
						width: ${shape.width}px;
						height: ${shape.height}px;
						transform: ${transform};
						z-index: ${styles.zIndex || 1};
						opacity: ${styles.opacity !== undefined ? styles.opacity : 1};
					`
						.trim()
						.replace(/\s+/g, " ");

					const fillColor = shape.fillColor || styles.fillColor || "#3b82f6";
					const strokeColor =
						shape.strokeColor || styles.strokeColor || "#1e40af";
					const strokeWidth = shape.strokeWidth || styles.strokeWidth || 2;
					const borderRadius = shape.borderRadius || styles.borderRadius || 0;

					if (shapeType === "rectangle" || shapeType === "square") {
						return `<svg width="${shape.width}" height="${
							shape.height
						}" style="${shapeStyle} filter: ${formatDropShadowCSS(
							styles.shadow
						)};">
                            <rect x="0" y="0" width="100%" height="100%" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" rx="${borderRadius}" ry="${borderRadius}" />
                        </svg>`;
					} else if (shapeType === "circle") {
						const radius = Math.min(shape.width, shape.height) / 2;
						return `<svg width="${shape.width}" height="${
							shape.height
						}" style="${shapeStyle} filter: ${formatDropShadowCSS(
							styles.shadow
						)};">
                            <circle cx="50%" cy="50%" r="${radius}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
                        </svg>`;
					} else if (shapeType === "triangle") {
						return `<svg width="${shape.width}" height="${
							shape.height
						}" style="${shapeStyle} filter: ${formatDropShadowCSS(
							styles.shadow
						)};">
                            <polygon points="50%,0 0,100% 100%,100%" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
                        </svg>`;
					} else if (shapeType === "line") {
						return `<svg width="${shape.width}" height="${
							shape.height
						}" style="${shapeStyle} filter: ${formatDropShadowCSS(
							styles.shadow
						)};">
                            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
                        </svg>`;
					}
				}

				if (type === "icon") {
					const icon = element;
					const styles = icon.styles || {};
					const transform = buildTransform(icon);
					const iconColor = styles.color || "#000000";
					const iconOpacity = styles.opacity !== undefined ? styles.opacity : 1;
					const strokeWidth = styles.strokeWidth || 2;
					const style = `
						position: absolute;
						left: ${icon.x}%;
						top: ${icon.y}%;
						width: ${icon.width}px;
						height: ${icon.height}px;
						transform: ${transform};
						z-index: ${styles.zIndex || 1};
						opacity: ${iconOpacity};
						filter: ${formatDropShadowCSS(styles.shadow)};
					`
						.trim()
						.replace(/\s+/g, " ");
					// Render icon using Lucide's data-lucide attribute
					return `<i style="${style}" data-lucide="${icon.iconName}" data-icon-color="${iconColor}" data-icon-stroke="${strokeWidth}"></i>`;
				}

				return "";
			})
			.filter(Boolean)
			.join("\n        ");

		// Background style
		const backgroundStyle = frameBackgroundImage
			? `
				position: absolute;
				inset: 0;
				background-image: url(${frameBackgroundImage});
				background-size: cover;
				background-position: center;
				background-repeat: no-repeat;
				${backgroundAnimation ? `animation: ${backgroundAnimation};` : ""}
			`
			: `
				position: absolute;
				inset: 0;
				background: ${gradientCSS};
				${
					frameGradient.backgroundAnimation?.enabled &&
					frameGradient.backgroundAnimation.type === "slide"
						? `background-size: 200% 200%;`
						: ""
				}
				${backgroundAnimation ? `animation: ${backgroundAnimation};` : ""}
			`;

		// Element animation overlay
		const elementAnimationOverlay =
			frameGradient.animation?.enabled && elementAnimation
				? `<div class="element-animation-overlay" style="position: absolute; inset: 0; animation: ${elementAnimation};"></div>`
				: "";

		const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gradient Design</title>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            position: relative;
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
        }
        .background {
            ${backgroundStyle.trim().replace(/\s+/g, " ")}
        }
        ${
					frameGradient.animation?.enabled &&
					frameGradient.animation.type === "rotate"
						? `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        `
						: ""
				}
        ${
					frameGradient.animation?.enabled &&
					frameGradient.animation.type === "pulse"
						? `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        `
						: ""
				}
        ${
					frameGradient.backgroundAnimation?.enabled &&
					frameGradient.backgroundAnimation.type === "slide"
						? `
        @keyframes slideRight {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 0%; }
        }
        @keyframes slideLeft {
            0% { background-position: 100% 0%; }
            100% { background-position: 0% 0%; }
        }
        @keyframes slideUp {
            0% { background-position: 0% 100%; }
            100% { background-position: 0% 0%; }
        }
        @keyframes slideDown {
            0% { background-position: 0% 0%; }
            100% { background-position: 0% 100%; }
        }
        `
						: ""
				}
        ${
					frameGradient.backgroundAnimation?.enabled &&
					frameGradient.backgroundAnimation.type === "wave"
						? `
        @keyframes wave {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        `
						: ""
				}
        ${
					frameGradient.animation?.enabled &&
					frameGradient.animation.type === "shift"
						? `
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        `
						: ""
				}
    </style>
</head>
<body>
    <div class="container">
        <div class="background"></div>
        ${elementAnimationOverlay}
        ${elementsHTML}
    </div>
    <script>
        // Render Lucide icons after page load
        (function() {
            function renderIcons() {
                if (typeof lucide === 'undefined' || !lucide.createIcons) {
                    setTimeout(renderIcons, 100);
                    return;
                }
                
                // Create all icons with data-lucide attribute
                lucide.createIcons();
                
                // Apply custom colors and stroke widths
                const iconElements = document.querySelectorAll('[data-lucide]');
                iconElements.forEach(function(iconEl) {
                    const iconColor = iconEl.getAttribute('data-icon-color') || '#000000';
                    const iconStroke = iconEl.getAttribute('data-icon-stroke') || '2';
                    const svg = iconEl.querySelector('svg');
                    
                    if (svg) {
                        svg.setAttribute('stroke', iconColor);
                        svg.setAttribute('stroke-width', iconStroke);
                        svg.style.width = '100%';
                        svg.style.height = '100%';
                    }
                });
            }
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', renderIcons);
            } else {
                renderIcons();
            }
        })();
    </script>
</body>
</html>`;

		return html;
	};

	const generateHTML = () => generateFrameHTML();

	const handleCopyHTML = async () => {
		const html = generateHTML();
		await copyToClipboard(html, "html");
	};

	// Helper function to draw rounded rectangle on canvas
	const drawRoundedRect = (ctx, x, y, width, height, radius) => {
		if (!radius || radius === 0) {
			ctx.rect(x, y, width, height);
			return;
		}
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
	};

	// Simple SVG download - no canvas needed
	const downloadSVG = (dimensionType = downloadDimension) => {
		// Use previewFramePresets if dimensionType is a preview frame size, otherwise use dimensionPresets
		const dimensions =
			previewFramePresets[dimensionType] ||
			dimensionPresets[dimensionType] ||
			dimensionPresets.mobile;
		const width = dimensions.width;
		const height = dimensions.height;
		const gradientStops = Array.isArray(gradient?.stops)
			? gradient.stops.filter(
					(stop) =>
						stop &&
						stop.position &&
						typeof stop.position.x === "number" &&
						typeof stop.position.y === "number"
				)
			: [];
		const hasStops = gradientStops.length > 0;
		const sortedStops = hasStops
			? [...gradientStops].sort((a, b) => {
					const distA = Math.sqrt(
						a.position.x * a.position.x + a.position.y * a.position.y
					);
					const distB = Math.sqrt(
						b.position.x * b.position.x + b.position.y * b.position.y
					);
					return distA - distB;
				})
			: [];

		let backgroundElement = "";
		let gradientElement = "";

		if (backgroundImage) {
			backgroundElement = `<image href="${backgroundImage}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" />`;
		} else if (!hasStops) {
			gradientElement = `
      <linearGradient id="gradientFill" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#ffffff" />
      </linearGradient>`;
		} else {
			if (gradient.type === "linear") {
				const firstStop = sortedStops[0];
				const lastStop = sortedStops[sortedStops.length - 1] || firstStop;
				const angle =
					Math.atan2(
						lastStop.position.y - firstStop.position.y,
						lastStop.position.x - firstStop.position.x
					) *
					(180 / Math.PI);

				const radians = (angle * Math.PI) / 180;
				const x1 = 50 - 50 * Math.cos(radians);
				const y1 = 50 - 50 * Math.sin(radians);
				const x2 = 50 + 50 * Math.cos(radians);
				const y2 = 50 + 50 * Math.sin(radians);

				gradientElement = `
      <linearGradient id="gradientFill" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        ${sortedStops
					.map((stop) => {
						const offset = Math.max(0, Math.min(100, stop.position?.x ?? 0));
						return `<stop offset="${offset}%" stop-color="${stop.color}" />`;
					})
					.join("\n        ")}
      </linearGradient>`;
			} else {
				gradientElement = `
      <radialGradient id="gradientFill" cx="50%" cy="50%" r="50%">
        ${sortedStops
					.map((stop) => {
						const distance = Math.sqrt(
							Math.pow(stop.position.x - 50, 2) +
								Math.pow(stop.position.y - 50, 2)
						);
						const offset = Math.max(0, Math.min(100, distance));
						return `<stop offset="${offset}%" stop-color="${stop.color}" />`;
					})
					.join("\n        ")}
      </radialGradient>`;
			}
		}

		// Calculate scale factor from preview to actual dimensions
		const previewActualHeight = previewRef.current?.offsetHeight || height;
		const previewActualWidth = previewRef.current?.offsetWidth || width;
		const scaleX = width / previewActualWidth;
		const scaleY = height / previewActualHeight;

		// Add images to SVG with all styles
		const imagesSVG = images
			.map((image, index) => {
				const scaledX = (image.x / 100) * width - (image.width * scaleX) / 2;
				const scaledY = (image.y / 100) * height - (image.height * scaleY) / 2;
				const scaledWidth = image.width * scaleX;
				const scaledHeight = image.height * scaleY;
				const styles = image.styles || {};

				// Build style string for image container
				const imageStyles = [];
				if (styles.opacity !== undefined && styles.opacity < 1) {
					imageStyles.push(`opacity: ${styles.opacity}`);
				}
				if (styles.borderRadius && styles.borderRadius > 0) {
					const scaledRadius = styles.borderRadius * scaleY;
					imageStyles.push(`border-radius: ${scaledRadius}px`);
				}
				const styleAttr =
					imageStyles.length > 0 ? ` style="${imageStyles.join("; ")}"` : "";

				// Build filter for shadow if exists
				let shadowFilterId = "";
				let shadowFilterDef = "";
				if (
					styles.shadow &&
					(typeof styles.shadow === "object"
						? styles.shadow.enabled
						: styles.shadow !== "none")
				) {
					shadowFilterId = `shadow-${index}`;
					let shadowBlur, shadowX, shadowY;
					// Handle new object format
					if (typeof styles.shadow === "object" && styles.shadow.enabled) {
						shadowBlur = (styles.shadow.blur || 0) * scaleY;
						shadowX = (styles.shadow.x || 0) * scaleX;
						shadowY = (styles.shadow.y || 0) * scaleY;
					} else if (typeof styles.shadow === "string") {
						// Handle old string format for backward compatibility
						switch (styles.shadow) {
							case "sm":
								shadowBlur = 2 * scaleY;
								shadowX = 0;
								shadowY = 1 * scaleY;
								break;
							case "md":
								shadowBlur = 4 * scaleY;
								shadowX = 0;
								shadowY = 2 * scaleY;
								break;
							case "lg":
								shadowBlur = 10 * scaleY;
								shadowX = 0;
								shadowY = 4 * scaleY;
								break;
							case "xl":
								shadowBlur = 20 * scaleY;
								shadowX = 0;
								shadowY = 10 * scaleY;
								break;
							case "2xl":
								shadowBlur = 25 * scaleY;
								shadowX = 0;
								shadowY = 12 * scaleY;
								break;
							default:
								shadowBlur = 0;
								shadowX = 0;
								shadowY = 0;
						}
					}
					if (shadowBlur) {
						shadowFilterDef = `\n    <defs>
      <filter id="${shadowFilterId}">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${shadowBlur / 2}" />
        <feOffset dx="${shadowX}" dy="${shadowY}" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>`;
					}
				}

				// Build clip-path for border-radius
				let clipPathId = "";
				let clipPathDef = "";
				if (styles.borderRadius && styles.borderRadius > 0) {
					clipPathId = `clip-${index}`;
					const scaledRadius = styles.borderRadius * scaleY;
					clipPathDef = `\n    <defs>
      <clipPath id="${clipPathId}">
        <rect x="${scaledX}" y="${scaledY}" width="${scaledWidth}" height="${scaledHeight}" rx="${scaledRadius}" ry="${scaledRadius}" />
      </clipPath>
    </defs>`;
				}

				// Build transform attribute for rotation and skew
				let transformAttr = "";
				const rotation = styles.rotation || 0;
				const skewX = styles.skewX || 0;
				const skewY = styles.skewY || 0;
				const centerX = scaledX + scaledWidth / 2;
				const centerY = scaledY + scaledHeight / 2;

				if (rotation !== 0 || skewX !== 0 || skewY !== 0) {
					const transforms = [];
					if (rotation !== 0) {
						transforms.push(`rotate(${rotation} ${centerX} ${centerY})`);
					}
					if (skewX !== 0 || skewY !== 0) {
						transforms.push(`skewX(${skewX}) skewY(${skewY})`);
					}
					transformAttr = ` transform="${transforms.join(" ")}"`;
				}

				// Image element with clip-path and filter
				let imageElement = `<g${
					shadowFilterId ? ` filter="url(#${shadowFilterId})"` : ""
				}${
					clipPathId ? ` clip-path="url(#${clipPathId})"` : ""
				}${transformAttr}>`;

				// Border if exists
				if (styles.borderWidth && styles.borderWidth > 0) {
					const borderWidth = styles.borderWidth * scaleY;
					const borderColor = styles.borderColor || "#000000";
					const borderStyle = styles.borderStyle || "solid";
					const borderRadius = (styles.borderRadius || 0) * scaleY;

					if (borderStyle === "solid") {
						imageElement += `\n      <rect x="${scaledX}" y="${scaledY}" width="${scaledWidth}" height="${scaledHeight}" rx="${borderRadius}" ry="${borderRadius}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" />`;
					} else if (borderStyle === "dashed") {
						const dashArray = `${borderWidth * 3},${borderWidth * 2}`;
						imageElement += `\n      <rect x="${scaledX}" y="${scaledY}" width="${scaledWidth}" height="${scaledHeight}" rx="${borderRadius}" ry="${borderRadius}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" stroke-dasharray="${dashArray}" />`;
					} else if (borderStyle === "dotted") {
						imageElement += `\n      <rect x="${scaledX}" y="${scaledY}" width="${scaledWidth}" height="${scaledHeight}" rx="${borderRadius}" ry="${borderRadius}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" stroke-dasharray="${borderWidth},${borderWidth}" />`;
					}
				}

				// Image itself
				imageElement += `\n      <image href="${
					image.src
				}" x="${scaledX}" y="${scaledY}" width="${scaledWidth}" height="${scaledHeight}" preserveAspectRatio="${
					styles.objectFit === "cover"
						? "xMidYMid slice"
						: styles.objectFit === "fill"
							? "none"
							: "xMidYMid meet"
				}"${styleAttr} />`;

				// Ring if exists
				if (styles.ringWidth && styles.ringWidth > 0) {
					const ringWidth = styles.ringWidth * scaleY;
					const ringColor = styles.ringColor || "#3b82f6";
					const ringOffset = 2 * scaleY;
					const ringRadius = (styles.borderRadius || 0) * scaleY;
					imageElement += `\n      <rect x="${
						scaledX - ringOffset - ringWidth
					}" y="${scaledY - ringOffset - ringWidth}" width="${
						scaledWidth + (ringOffset + ringWidth) * 2
					}" height="${scaledHeight + (ringOffset + ringWidth) * 2}" rx="${
						ringRadius + ringOffset + ringWidth
					}" ry="${
						ringRadius + ringOffset + ringWidth
					}" fill="none" stroke="${ringColor}" stroke-width="${ringWidth}" />`;
				}

				imageElement += `\n    </g>`;

				// Add caption as text if exists
				if (image.caption) {
					const captionX = scaledX + scaledWidth / 2;
					const captionY = scaledY + scaledHeight + 20 * scaleY;
					imageElement += `\n    <text x="${captionX}" y="${captionY}" text-anchor="middle" fill="black" font-size="${
						16 * scaleY
					}" font-family="Arial">${image.caption
						.replace(/&/g, "&amp;")
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;")}</text>`;
				}

				return (shadowFilterDef || clipPathDef) + imageElement;
			})
			.join("\n    ");

		// Add text elements to SVG with all styles
		const textsSVG = texts
			.map((text, textIndex) => {
				const scaledX = (text.x / 100) * width;
				const scaledY = (text.y / 100) * height;
				const scaledWidth = text.width * scaleX;
				const scaledHeight = text.height * scaleY;
				const styles = text.styles || {};

				// Extract style values
				let textAnchor = "start";
				if (styles.textAlign === "center") {
					textAnchor = "middle";
				} else if (styles.textAlign === "right") {
					textAnchor = "end";
				}

				const fillColor = styles.color || "#000000";
				const fontSize = (styles.fontSize || 24) * scaleY;
				const fontFamily = styles.fontFamily || "Arial";
				const fontWeight = styles.fontWeight || "normal";
				const fontStyle = styles.fontStyle || "normal";
				const opacity = styles.opacity !== undefined ? styles.opacity : 1;
				const padding = (styles.padding || 0) * scaleY;
				const borderRadius = (styles.borderRadius || 0) * scaleY;
				const borderWidth = (styles.borderWidth || 0) * scaleY;
				const borderColor = styles.borderColor || "#000000";
				const borderStyle = styles.borderStyle || "solid";
				const backgroundColor = styles.backgroundColor || "transparent";

				// Calculate text bounds
				const textBoundsX = scaledX - scaledWidth / 2;
				const textBoundsY = scaledY - scaledHeight / 2;
				const textBoundsWidth = scaledWidth;
				const textBoundsHeight = scaledHeight;

				// Build shadow filter if exists
				let shadowFilterId = "";
				let shadowFilterDef = "";
				if (
					styles.shadow &&
					(typeof styles.shadow === "object"
						? styles.shadow.enabled
						: styles.shadow !== "none")
				) {
					shadowFilterId = `text-shadow-${textIndex}`;
					let shadowBlur, shadowX, shadowY, shadowColor;
					// Handle new object format
					if (typeof styles.shadow === "object" && styles.shadow.enabled) {
						shadowBlur = (styles.shadow.blur || 0) * scaleY;
						shadowX = (styles.shadow.x || 0) * scaleX;
						shadowY = (styles.shadow.y || 0) * scaleY;
						const color = styles.shadow.color || "#000000";
						// Convert hex to rgba
						if (color.startsWith("#") && color.length === 7) {
							const r = parseInt(color.slice(1, 3), 16);
							const g = parseInt(color.slice(3, 5), 16);
							const b = parseInt(color.slice(5, 7), 16);
							shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
						} else {
							shadowColor = color;
						}
					} else if (typeof styles.shadow === "string") {
						// Handle old string format for backward compatibility
						switch (styles.shadow) {
							case "sm":
								shadowBlur = 2 * scaleY;
								shadowX = 0;
								shadowY = 1 * scaleY;
								shadowColor = "rgba(0, 0, 0, 0.05)";
								break;
							case "md":
								shadowBlur = 4 * scaleY;
								shadowX = 0;
								shadowY = 2 * scaleY;
								shadowColor = "rgba(0, 0, 0, 0.1)";
								break;
							case "lg":
								shadowBlur = 10 * scaleY;
								shadowX = 0;
								shadowY = 4 * scaleY;
								shadowColor = "rgba(0, 0, 0, 0.1)";
								break;
							case "xl":
								shadowBlur = 20 * scaleY;
								shadowX = 0;
								shadowY = 10 * scaleY;
								shadowColor = "rgba(0, 0, 0, 0.1)";
								break;
							case "2xl":
								shadowBlur = 25 * scaleY;
								shadowX = 0;
								shadowY = 12 * scaleY;
								shadowColor = "rgba(0, 0, 0, 0.25)";
								break;
							default:
								shadowBlur = 0;
								shadowX = 0;
								shadowY = 0;
								shadowColor = "rgba(0, 0, 0, 0)";
						}
					}
					if (shadowBlur) {
						shadowFilterDef = `\n    <defs>
      <filter id="${shadowFilterId}">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${shadowBlur / 2}" />
        <feOffset dx="${shadowX}" dy="${shadowY}" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>`;
					}
				}

				// Escape text content for XML
				const escapedContent = text.content
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&apos;");

				// Build transform attribute for rotation and skew
				let transformAttr = "";
				const rotation = styles.rotation || 0;
				const skewX = styles.skewX || 0;
				const skewY = styles.skewY || 0;
				const centerX = scaledX;
				const centerY = scaledY;

				if (rotation !== 0 || skewX !== 0 || skewY !== 0) {
					const transforms = [];
					if (rotation !== 0) {
						transforms.push(`rotate(${rotation} ${centerX} ${centerY})`);
					}
					if (skewX !== 0 || skewY !== 0) {
						transforms.push(`skewX(${skewX}) skewY(${skewY})`);
					}
					transformAttr = ` transform="${transforms.join(" ")}"`;
				}

				// Build text group with background, border, and text
				let textGroup = `<g${
					shadowFilterId ? ` filter="url(#${shadowFilterId})"` : ""
				}${transformAttr} opacity="${opacity}">`;

				// Background rectangle
				if (backgroundColor !== "transparent") {
					textGroup += `\n      <rect x="${textBoundsX}" y="${textBoundsY}" width="${textBoundsWidth}" height="${textBoundsHeight}" rx="${borderRadius}" ry="${borderRadius}" fill="${backgroundColor}" />`;
				}

				// Border
				if (borderWidth > 0) {
					const borderX = textBoundsX;
					const borderY = textBoundsY;
					const borderRectWidth = textBoundsWidth;
					const borderRectHeight = textBoundsHeight;

					if (borderStyle === "solid") {
						textGroup += `\n      <rect x="${borderX}" y="${borderY}" width="${borderRectWidth}" height="${borderRectHeight}" rx="${borderRadius}" ry="${borderRadius}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" />`;
					} else if (borderStyle === "dashed") {
						const dashArray = `${borderWidth * 3},${borderWidth * 2}`;
						textGroup += `\n      <rect x="${borderX}" y="${borderY}" width="${borderRectWidth}" height="${borderRectHeight}" rx="${borderRadius}" ry="${borderRadius}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" stroke-dasharray="${dashArray}" />`;
					} else if (borderStyle === "dotted") {
						textGroup += `\n      <rect x="${borderX}" y="${borderY}" width="${borderRectWidth}" height="${borderRectHeight}" rx="${borderRadius}" ry="${borderRadius}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" stroke-dasharray="${borderWidth},${borderWidth}" />`;
					}
				}

				// Text element
				const lines = escapedContent.split("\n");
				lines.forEach((line, lineIndex) => {
					const lineY =
						scaledY + (lineIndex - (lines.length - 1) / 2) * fontSize * 1.2;
					textGroup += `\n      <text x="${scaledX}" y="${lineY}" text-anchor="${textAnchor}" fill="${fillColor}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" font-style="${fontStyle}">${line}</text>`;
				});

				textGroup += `\n    </g>`;

				return shadowFilterDef + textGroup;
			})
			.join("\n    ");

		// Collect all defs from images and texts (extract defs blocks and keep content)
		let allDefs = [];
		let imageContent = imagesSVG;
		let textContent = textsSVG;

		// Extract defs from images
		const imageDefsRegex = /    <defs>([\s\S]*?)    <\/defs>/g;
		let match;
		while ((match = imageDefsRegex.exec(imagesSVG)) !== null) {
			allDefs.push(match[1].trim());
		}
		imageContent = imagesSVG.replace(imageDefsRegex, "").trim();

		// Extract defs from texts
		const textDefsRegex = /    <defs>([\s\S]*?)    <\/defs>/g;
		while ((match = textDefsRegex.exec(textsSVG)) !== null) {
			allDefs.push(match[1].trim());
		}
		textContent = textsSVG.replace(textDefsRegex, "").trim();

		// Add shapes to SVG
		const shapesSVG = shapes
			.map((shape, shapeIndex) => {
				const scaledX = (shape.x / 100) * width - (shape.width * scaleX) / 2;
				const scaledY = (shape.y / 100) * height - (shape.height * scaleY) / 2;
				const scaledWidth = shape.width * scaleX;
				const scaledHeight = shape.height * scaleY;
				const styles = shape.styles || {};

				// Build shadow filter if exists
				let shadowFilterId = "";
				let shadowFilterDef = "";
				if (
					styles.shadow &&
					(typeof styles.shadow === "object"
						? styles.shadow.enabled
						: styles.shadow !== "none")
				) {
					shadowFilterId = `shape-shadow-${shapeIndex}`;
					let shadowBlur, shadowX, shadowY;
					// Handle new object format
					if (typeof styles.shadow === "object" && styles.shadow.enabled) {
						shadowBlur = (styles.shadow.blur || 0) * scaleY;
						shadowX = (styles.shadow.x || 0) * scaleX;
						shadowY = (styles.shadow.y || 0) * scaleY;
					} else if (typeof styles.shadow === "string") {
						// Handle old string format for backward compatibility
						switch (styles.shadow) {
							case "sm":
								shadowBlur = 2 * scaleY;
								shadowX = 0;
								shadowY = 1 * scaleY;
								break;
							case "md":
								shadowBlur = 4 * scaleY;
								shadowX = 0;
								shadowY = 2 * scaleY;
								break;
							case "lg":
								shadowBlur = 10 * scaleY;
								shadowX = 0;
								shadowY = 4 * scaleY;
								break;
							case "xl":
								shadowBlur = 20 * scaleY;
								shadowX = 0;
								shadowY = 10 * scaleY;
								break;
							case "2xl":
								shadowBlur = 25 * scaleY;
								shadowX = 0;
								shadowY = 12 * scaleY;
								break;
							default:
								shadowBlur = 0;
								shadowX = 0;
								shadowY = 0;
						}
					}
					if (shadowBlur) {
						shadowFilterDef = `\n    <defs>
      <filter id="${shadowFilterId}">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${shadowBlur / 2}" />
        <feOffset dx="${shadowX}" dy="${shadowY}" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>`;
					}
				}

				// Build transform attribute for rotation and skew
				let transformAttr = "";
				const rotation = styles.rotation || 0;
				const skewX = styles.skewX || 0;
				const skewY = styles.skewY || 0;
				const centerX = scaledX + scaledWidth / 2;
				const centerY = scaledY + scaledHeight / 2;

				if (rotation !== 0 || skewX !== 0 || skewY !== 0) {
					const transforms = [];
					if (rotation !== 0) {
						transforms.push(`rotate(${rotation} ${centerX} ${centerY})`);
					}
					if (skewX !== 0 || skewY !== 0) {
						transforms.push(`skewX(${skewX}) skewY(${skewY})`);
					}
					transformAttr = ` transform="${transforms.join(" ")}"`;
				}

				// Generate gradient def if needed
				let gradientDef = "";
				const fillValue = styles.fillGradient
					? `url(#shape-gradient-${shape.id})`
					: styles.fillColor || "#3b82f6";

				if (styles.fillGradient) {
					const sortedStops = [...styles.fillGradient.stops].sort(
						(a, b) => a.position.x - b.position.x
					);
					const stopsString = sortedStops
						.map(
							(stop) =>
								`\n        <stop offset="${stop.position.x}%" stop-color="${stop.color}" />`
						)
						.join("");
					gradientDef = `\n      <defs>
        <linearGradient id="shape-gradient-${
					shape.id
				}" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(${
					styles.fillGradient.angle || 45
				} ${scaledX + scaledWidth / 2} ${
					scaledY + scaledHeight / 2
				})">${stopsString}
        </linearGradient>
      </defs>`;
				}

				let shapeElement = `<g${
					shadowFilterId ? ` filter="url(#${shadowFilterId})"` : ""
				}${transformAttr} opacity="${
					styles.opacity !== undefined ? styles.opacity : 1
				}">${gradientDef}`;

				if (shape.type === "rectangle" || shape.type === "square") {
					shapeElement += `\n      <rect x="${scaledX}" y="${scaledY}" width="${scaledWidth}" height="${scaledHeight}" fill="${fillValue}" stroke="${
						styles.strokeColor || "#1e40af"
					}" stroke-width="${(styles.strokeWidth || 2) * scaleY}" rx="${
						(styles.borderRadius || 0) * scaleY
					}" ry="${(styles.borderRadius || 0) * scaleY}" />`;
				} else if (shape.type === "line") {
					const lineY = scaledY + scaledHeight / 2;
					shapeElement += `\n      <line x1="${scaledX}" y1="${lineY}" x2="${
						scaledX + scaledWidth
					}" y2="${lineY}" stroke="${
						styles.strokeColor || "#1e40af"
					}" stroke-width="${(styles.strokeWidth || 2) * scaleY}" />`;
				} else if (shape.type === "triangle") {
					const points = `${scaledX + scaledWidth / 2},${scaledY} ${scaledX},${
						scaledY + scaledHeight
					} ${scaledX + scaledWidth},${scaledY + scaledHeight}`;
					shapeElement += `\n      <polygon points="${points}" fill="${fillValue}" stroke="${
						styles.strokeColor || "#1e40af"
					}" stroke-width="${(styles.strokeWidth || 2) * scaleY}" />`;
				} else if (shape.type === "circle") {
					const radius = Math.min(scaledWidth, scaledHeight) / 2;
					const centerX = scaledX + scaledWidth / 2;
					const centerY = scaledY + scaledHeight / 2;
					shapeElement += `\n      <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="${fillValue}" stroke="${
						styles.strokeColor || "#1e40af"
					}" stroke-width="${(styles.strokeWidth || 2) * scaleY}" />`;
				}

				shapeElement += `\n    </g>`;

				return shadowFilterDef + shapeElement;
			})
			.join("\n    ");

		// Extract defs from shapes
		let shapeDefs = [];
		let shapeContent = shapesSVG;
		const shapeDefsRegex = /    <defs>([\s\S]*?)    <\/defs>/g;
		let shapeMatch;
		while ((shapeMatch = shapeDefsRegex.exec(shapesSVG)) !== null) {
			shapeDefs.push(shapeMatch[1].trim());
		}
		shapeContent = shapesSVG.replace(shapeDefsRegex, "").trim();

		const defsContent =
			allDefs.length > 0 || shapeDefs.length > 0
				? "\n    " + [...allDefs, ...shapeDefs].join("\n    ")
				: "";

		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>${gradientElement}${defsContent}
  </defs>
  ${
		backgroundImage
			? backgroundElement
			: `<rect width="100%" height="100%" fill="url(#gradientFill)" />`
	}
  ${imageContent}
  ${textContent}
  ${shapeContent}
</svg>`;

		const blob = new Blob([svg], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `gradient-${dimensionType}-${width}x${height}-${Date.now()}.svg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	// GIF download function - captures animated frames
	const downloadGIF = async (dimensionType = downloadDimension) => {
		// For now, show a message that GIF export is coming soon
		// or use a simpler approach
		toast.info(
			"GIF export is being processed. This feature will capture animated frames of your gradient."
		);
		// TODO: Implement GIF capture using gif.js or similar library
	};

	// MP4 download function using ffmpeg.wasm
	const downloadMP4 = async (dimensionType = downloadDimension) => {
		if (typeof window === "undefined") return;

		setIsGeneratingMP4(true);
		setMp4Progress(0);

		try {
			// Get dimensions
			const dimensions =
				previewFramePresets[dimensionType] ||
				dimensionPresets[dimensionType] ||
				dimensionPresets.mobile;
			const width = dimensions.width;
			const height = dimensions.height;

			setMp4Progress(10);

			// Create canvas
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");

			// Helper function to draw background image or gradient on canvas
			const drawGradient = async () => {
				if (backgroundImage) {
					const bgImg = new Image();
					bgImg.crossOrigin = "anonymous";
					await new Promise((resolve, reject) => {
						bgImg.onload = () => {
							ctx.drawImage(bgImg, 0, 0, width, height);
							resolve();
						};
						bgImg.onerror = reject;
						bgImg.src = backgroundImage;
					});
				} else {
					let gradientObj;
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
								lastStop?.position?.y - firstStop?.position?.y,
								lastStop?.position?.x - firstStop?.position?.x
							) *
							(180 / Math.PI);

						const radians = (angle * Math.PI) / 180;
						const x1 = width / 2 - (width / 2) * Math.cos(radians);
						const y1 = height / 2 - (width / 2) * Math.sin(radians);
						const x2 = width / 2 + (width / 2) * Math.cos(radians);
						const y2 = height / 2 + (width / 2) * Math.sin(radians);

						gradientObj = ctx.createLinearGradient(x1, y1, x2, y2);
						sortedStops.forEach((stop) => {
							const position = Math.round(stop.position.x) / 100;
							gradientObj.addColorStop(position, stop.color);
						});
					} else {
						gradientObj = ctx.createRadialGradient(
							width / 2,
							height / 2,
							0,
							width / 2,
							height / 2,
							Math.max(width, height) / 2
						);
						sortedStops.forEach((stop) => {
							const distance = Math.sqrt(
								Math.pow(stop.position.x - 50, 2) +
									Math.pow(stop.position.y - 50, 2)
							);
							const position = Math.round(distance) / 100;
							gradientObj.addColorStop(position, stop.color);
						});
					}

					ctx.fillStyle = gradientObj;
					ctx.fillRect(0, 0, width, height);
				}
			};

			// Helper function to draw all elements (similar to downloadRaster)
			const drawAllElements = async () => {
				if (!previewRef.current) return;

				const previewActualHeight = previewRef.current.offsetHeight;
				const previewActualWidth = previewRef.current.offsetWidth;
				const scaleX = width / previewActualWidth;
				const scaleY = height / previewActualHeight;

				// Load images
				const imageDrawFunctions = await Promise.all(
					images.map((image) => {
						return new Promise((resolve) => {
							const img = new Image();
							img.crossOrigin = "anonymous";
							img.onload = () => {
								resolve({ image, img, ready: true });
							};
							img.onerror = () => resolve({ image, img: null, ready: false });
							img.src = image.src;
						});
					})
				);

				// Load videos
				const videoDrawFunctions = await Promise.all(
					videos.map((video) => {
						return new Promise((resolve) => {
							const vid = document.createElement("video");
							vid.crossOrigin = "anonymous";
							vid.src = video.src;
							vid.muted = true;
							vid.loop = true;
							vid.playsInline = true;
							vid.onloadeddata = async () => {
								try {
									await vid.play();
									resolve({ video, vid, ready: true });
								} catch (error) {
									console.error("Error playing video:", error);
									resolve({ video, vid, ready: true }); // Still resolve, video might play later
								}
							};
							vid.onerror = () => resolve({ video, vid: null, ready: false });
							vid.load();
						});
					})
				);

				// Combine all elements and sort by z-index
				const allDrawableElements = [
					...imageDrawFunctions
						.filter((item) => item.ready)
						.map(({ image, img }) => ({
							type: "image",
							element: image,
							img,
							zIndex: image.styles?.zIndex || 1,
						})),
					...videoDrawFunctions
						.filter((item) => item.ready)
						.map(({ video, vid }) => ({
							type: "video",
							element: video,
							vid,
							zIndex: video.styles?.zIndex || 1,
						})),
					...texts.map((txt) => ({
						type: "text",
						element: txt,
						zIndex: txt.styles?.zIndex || 2,
					})),
					...shapes.map((shape) => ({
						type: "shape",
						element: shape,
						zIndex: shape.styles?.zIndex || 1,
					})),
					...icons.map((icon) => ({
						type: "icon",
						element: icon,
						zIndex: icon.styles?.zIndex || 1,
					})),
				].sort((a, b) => a.zIndex - b.zIndex);

				// Draw all elements (similar logic to downloadRaster but simplified for video frames)
				allDrawableElements.forEach(({ type, element, img, vid }) => {
					if (type === "image" && img) {
						const image = element;
						const scaledX =
							(image.x / 100) * width - (image.width * scaleX) / 2;
						const scaledY =
							(image.y / 100) * height - (image.height * scaleY) / 2;
						const scaledWidth = image.width * scaleX;
						const scaledHeight = image.height * scaleY;
						const styles = image.styles || {};

						// Calculate center point for transforms
						const centerX = scaledX + scaledWidth / 2;
						const centerY = scaledY + scaledHeight / 2;

						ctx.save();

						// Apply transforms (rotation and skew)
						const rotation = (styles.rotation || 0) * (Math.PI / 180);
						const skewX = (styles.skewX || 0) * (Math.PI / 180);
						const skewY = (styles.skewY || 0) * (Math.PI / 180);

						ctx.translate(centerX, centerY);
						if (rotation !== 0) {
							ctx.rotate(rotation);
						}
						if (skewX !== 0 || skewY !== 0) {
							ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);
						}
						ctx.translate(-centerX, -centerY);

						ctx.globalAlpha = styles.opacity !== undefined ? styles.opacity : 1;

						if (styles.borderRadius && styles.borderRadius > 0) {
							const borderRadius = styles.borderRadius * scaleY;
							drawRoundedRect(
								ctx,
								scaledX,
								scaledY,
								scaledWidth,
								scaledHeight,
								borderRadius
							);
							ctx.clip();
						}

						// Handle object-fit
						const tempCanvas = document.createElement("canvas");
						tempCanvas.width = scaledWidth;
						tempCanvas.height = scaledHeight;
						const tempCtx = tempCanvas.getContext("2d");

						if (styles.objectFit === "cover") {
							const imgAspect = img.width / img.height;
							const boxAspect = scaledWidth / scaledHeight;
							let drawWidth = scaledWidth;
							let drawHeight = scaledHeight;
							let drawX = 0;
							let drawY = 0;

							if (imgAspect > boxAspect) {
								drawHeight = scaledHeight;
								drawWidth = scaledHeight * imgAspect;
								drawX = (scaledWidth - drawWidth) / 2;
							} else {
								drawWidth = scaledWidth;
								drawHeight = scaledWidth / imgAspect;
								drawY = (scaledHeight - drawHeight) / 2;
							}
							tempCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
						} else {
							tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
						}

						ctx.drawImage(tempCanvas, scaledX, scaledY);
						ctx.restore();

						// Draw border
						if (styles.borderWidth && styles.borderWidth > 0) {
							const borderWidth = styles.borderWidth * scaleY;
							const borderColor = styles.borderColor || "#000000";
							const borderRadius = (styles.borderRadius || 0) * scaleY;

							ctx.strokeStyle = borderColor;
							ctx.lineWidth = borderWidth;
							drawRoundedRect(
								ctx,
								scaledX,
								scaledY,
								scaledWidth,
								scaledHeight,
								borderRadius
							);
							ctx.stroke();
						}
					} else if (type === "video" && vid) {
						const video = element;
						const scaledX =
							(video.x / 100) * width - (video.width * scaleX) / 2;
						const scaledY =
							(video.y / 100) * height - (video.height * scaleY) / 2;
						const scaledWidth = video.width * scaleX;
						const scaledHeight = video.height * scaleY;
						const styles = video.styles || {};

						ctx.save();
						ctx.globalAlpha = styles.opacity !== undefined ? styles.opacity : 1;

						if (styles.borderRadius && styles.borderRadius > 0) {
							const borderRadius = styles.borderRadius * scaleY;
							drawRoundedRect(
								ctx,
								scaledX,
								scaledY,
								scaledWidth,
								scaledHeight,
								borderRadius
							);
							ctx.clip();
						}

						// Draw video frame
						ctx.drawImage(vid, scaledX, scaledY, scaledWidth, scaledHeight);
						ctx.restore();

						// Draw border
						if (styles.borderWidth && styles.borderWidth > 0) {
							const borderWidth = styles.borderWidth * scaleY;
							const borderColor = styles.borderColor || "#000000";
							const borderRadius = (styles.borderRadius || 0) * scaleY;

							ctx.strokeStyle = borderColor;
							ctx.lineWidth = borderWidth;
							drawRoundedRect(
								ctx,
								scaledX,
								scaledY,
								scaledWidth,
								scaledHeight,
								borderRadius
							);
							ctx.stroke();
						}
					} else if (type === "text") {
						const text = element;
						const scaledX = (text.x / 100) * width;
						const scaledY = (text.y / 100) * height;
						const scaledWidth = text.width * scaleX;
						const scaledHeight = text.height * scaleY;
						const styles = text.styles || {};

						// Calculate center point for transforms
						const centerX = scaledX;
						const centerY = scaledY;

						ctx.save();

						// Apply transforms (rotation and skew)
						const rotation = (styles.rotation || 0) * (Math.PI / 180);
						const skewX = (styles.skewX || 0) * (Math.PI / 180);
						const skewY = (styles.skewY || 0) * (Math.PI / 180);

						ctx.translate(centerX, centerY);
						if (rotation !== 0) {
							ctx.rotate(rotation);
						}
						if (skewX !== 0 || skewY !== 0) {
							ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);
						}
						ctx.translate(-centerX, -centerY);

						ctx.globalAlpha = styles.opacity !== undefined ? styles.opacity : 1;

						const padding = (styles.padding || 0) * scaleY;
						const textBoundsX = scaledX - scaledWidth / 2;
						const textBoundsY = scaledY - scaledHeight / 2;
						const textBoundsWidth = scaledWidth;
						const textBoundsHeight = scaledHeight;
						const borderRadius = (styles.borderRadius || 0) * scaleY;

						// Draw background
						if (
							styles.backgroundColor &&
							styles.backgroundColor !== "transparent"
						) {
							ctx.fillStyle = styles.backgroundColor;
							drawRoundedRect(
								ctx,
								textBoundsX,
								textBoundsY,
								textBoundsWidth,
								textBoundsHeight,
								borderRadius
							);
							ctx.fill();
						}

						// Draw border
						if (styles.borderWidth && styles.borderWidth > 0) {
							const borderWidth = styles.borderWidth * scaleY;
							const borderColor = styles.borderColor || "#000000";
							ctx.strokeStyle = borderColor;
							ctx.lineWidth = borderWidth;
							drawRoundedRect(
								ctx,
								textBoundsX,
								textBoundsY,
								textBoundsWidth,
								textBoundsHeight,
								borderRadius
							);
							ctx.stroke();
						}

						// Draw text
						const fontSize = (styles.fontSize || 24) * scaleY;
						const fontFamily = styles.fontFamily || "Arial";
						ctx.font = `${styles.fontStyle || "normal"} ${
							styles.fontWeight || "normal"
						} ${fontSize}px ${fontFamily}`;
						ctx.fillStyle = styles.color || "#000000";
						ctx.textAlign = styles.textAlign || "left";
						ctx.textBaseline = "middle";

						const lines = text.content.split("\n");
						const lineHeight = fontSize * 1.2;
						const startY = scaledY - ((lines.length - 1) * lineHeight) / 2;

						lines.forEach((line, index) => {
							let lineX = scaledX;
							if (styles.textAlign === "left") {
								lineX = textBoundsX + padding;
							} else if (styles.textAlign === "right") {
								lineX = textBoundsX + textBoundsWidth - padding;
							}
							ctx.fillText(line, lineX, startY + index * lineHeight);
						});

						ctx.restore();
					} else if (type === "shape") {
						const shape = element;
						const scaledX =
							(shape.x / 100) * width - (shape.width * scaleX) / 2;
						const scaledY =
							(shape.y / 100) * height - (shape.height * scaleY) / 2;
						const scaledWidth = shape.width * scaleX;
						const scaledHeight = shape.height * scaleY;
						const styles = shape.styles || {};

						// Calculate center point for transforms
						const centerX = scaledX + scaledWidth / 2;
						const centerY = scaledY + scaledHeight / 2;

						ctx.save();

						// Apply transforms (rotation and skew)
						const rotation = (styles.rotation || 0) * (Math.PI / 180);
						const skewX = (styles.skewX || 0) * (Math.PI / 180);
						const skewY = (styles.skewY || 0) * (Math.PI / 180);

						ctx.translate(centerX, centerY);
						if (rotation !== 0) {
							ctx.rotate(rotation);
						}
						if (skewX !== 0 || skewY !== 0) {
							ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);
						}
						ctx.translate(-centerX, -centerY);

						ctx.globalAlpha = styles.opacity !== undefined ? styles.opacity : 1;

						// Draw shadow if exists
						if (styles.shadow && styles.shadow !== "none") {
							ctx.save();
							ctx.globalAlpha = 0.3;
							ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
							let shadowBlur = 0;
							let shadowY = 0;
							switch (styles.shadow) {
								case "sm":
									shadowBlur = 2 * scaleY;
									shadowY = 1 * scaleY;
									break;
								case "md":
									shadowBlur = 4 * scaleY;
									shadowY = 2 * scaleY;
									break;
								case "lg":
									shadowBlur = 10 * scaleY;
									shadowY = 4 * scaleY;
									break;
								case "xl":
									shadowBlur = 20 * scaleY;
									shadowY = 10 * scaleY;
									break;
								case "2xl":
									shadowBlur = 25 * scaleY;
									shadowY = 12 * scaleY;
									break;
							}
							if (shadowBlur > 0) {
								ctx.filter = `blur(${shadowBlur}px)`;
								if (shape.type === "rectangle" || shape.type === "square") {
									const shadowRadius = (styles.borderRadius || 0) * scaleY;
									drawRoundedRect(
										ctx,
										scaledX,
										scaledY + shadowY,
										scaledWidth,
										scaledHeight,
										shadowRadius
									);
									ctx.fill();
								} else if (shape.type === "triangle") {
									ctx.beginPath();
									ctx.moveTo(scaledX + scaledWidth / 2, scaledY + shadowY);
									ctx.lineTo(scaledX, scaledY + scaledHeight + shadowY);
									ctx.lineTo(
										scaledX + scaledWidth,
										scaledY + scaledHeight + shadowY
									);
									ctx.closePath();
									ctx.fill();
								} else if (shape.type === "line") {
									ctx.beginPath();
									ctx.moveTo(scaledX, scaledY + scaledHeight / 2 + shadowY);
									ctx.lineTo(
										scaledX + scaledWidth,
										scaledY + scaledHeight / 2 + shadowY
									);
									ctx.stroke();
								}
								ctx.filter = "none";
							}
							ctx.restore();
						}

						// Draw shape
						// Setup fill style (gradient or solid color)
						let fillStyle;
						if (styles.fillGradient) {
							const sortedStops = [...styles.fillGradient.stops].sort(
								(a, b) => a.position.x - b.position.x
							);
							const angle = (styles.fillGradient.angle || 45) * (Math.PI / 180);
							const centerX = scaledX + scaledWidth / 2;
							const centerY = scaledY + scaledHeight / 2;
							const length = Math.sqrt(
								scaledWidth * scaledWidth + scaledHeight * scaledHeight
							);
							const x1 = centerX - (length / 2) * Math.cos(angle);
							const y1 = centerY - (length / 2) * Math.sin(angle);
							const x2 = centerX + (length / 2) * Math.cos(angle);
							const y2 = centerY + (length / 2) * Math.sin(angle);

							const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
							sortedStops.forEach((stop) => {
								gradient.addColorStop(stop.position.x / 100, stop.color);
							});
							fillStyle = gradient;
						} else {
							fillStyle = styles.fillColor || "#3b82f6";
						}

						if (shape.type === "rectangle" || shape.type === "square") {
							const borderRadius = (styles.borderRadius || 0) * scaleY;
							ctx.fillStyle = fillStyle;
							drawRoundedRect(
								ctx,
								scaledX,
								scaledY,
								scaledWidth,
								scaledHeight,
								borderRadius
							);
							ctx.fill();

							if (styles.strokeWidth && styles.strokeWidth > 0) {
								ctx.strokeStyle = styles.strokeColor || "#1e40af";
								ctx.lineWidth = (styles.strokeWidth || 2) * scaleY;
								drawRoundedRect(
									ctx,
									scaledX,
									scaledY,
									scaledWidth,
									scaledHeight,
									borderRadius
								);
								ctx.stroke();
							}
						} else if (shape.type === "triangle") {
							ctx.fillStyle = fillStyle;
							ctx.beginPath();
							ctx.moveTo(scaledX + scaledWidth / 2, scaledY);
							ctx.lineTo(scaledX, scaledY + scaledHeight);
							ctx.lineTo(scaledX + scaledWidth, scaledY + scaledHeight);
							ctx.closePath();
							ctx.fill();

							if (styles.strokeWidth && styles.strokeWidth > 0) {
								ctx.strokeStyle = styles.strokeColor || "#1e40af";
								ctx.lineWidth = (styles.strokeWidth || 2) * scaleY;
								ctx.stroke();
							}
						} else if (shape.type === "line") {
							ctx.strokeStyle = styles.strokeColor || "#1e40af";
							ctx.lineWidth = (styles.strokeWidth || 2) * scaleY;
							ctx.beginPath();
							ctx.moveTo(scaledX, scaledY + scaledHeight / 2);
							ctx.lineTo(scaledX + scaledWidth, scaledY + scaledHeight / 2);
							ctx.stroke();
						}

						ctx.restore();
					}
				});
			};

			setMp4Progress(20);

			// Start video recording
			const stream = canvas.captureStream(30); // 30 FPS
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "video/webm;codecs=vp9",
			});

			const chunks = [];
			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunks.push(e.data);
				}
			};

			// Record duration - 5 seconds or animation duration
			const duration = 5000; // 5 seconds
			let frameCount = 0;
			const totalFrames = 150; // 30 fps * 5 seconds

			// Start recording
			mediaRecorder.start();

			// Wait for all media to load
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Animation loop using setInterval for better control
			const frameInterval = 1000 / 30; // 30 FPS
			const animate = async () => {
				const drawFrame = async () => {
					if (frameCount >= totalFrames) {
						mediaRecorder.stop();
						return;
					}

					// Draw gradient with animation
					await drawGradient();

					// Draw all elements
					await drawAllElements();

					// Update progress
					const progress = 20 + (frameCount / totalFrames) * 50;
					setMp4Progress(Math.min(progress, 70));

					frameCount++;
					if (frameCount < totalFrames) {
						setTimeout(drawFrame, frameInterval);
					}
				};

				await drawFrame();
			};

			// Start animation
			await animate();

			// Wait for recording to finish
			await new Promise((resolve) => {
				mediaRecorder.onstop = () => {
					resolve();
				};
			});

			setMp4Progress(75);

			// Convert WebM to MP4 using ffmpeg.wasm
			const webmBlob = new Blob(chunks, { type: "video/webm" });
			await convertWebmToMp4(webmBlob, width, height, dimensionType);
		} catch (error) {
			console.error("Error generating MP4:", error);
			setIsGeneratingMP4(false);
			setMp4Progress(0);
		}
	};

	// Convert WebM to MP4 using ffmpeg.wasm
	const convertWebmToMp4 = async (webmBlob, width, height, dimensionType) => {
		if (typeof window === "undefined") {
			setIsGeneratingMP4(false);
			return;
		}

		try {
			setMp4Progress(80);

			// Dynamically import ffmpeg
			const { FFmpeg } = await import("@ffmpeg/ffmpeg");
			const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

			const ffmpeg = new FFmpeg();
			ffmpeg.on("log", ({ message }) => {
				console.log(message);
			});

			setMp4Progress(85);

			// Load ffmpeg
			const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
			await ffmpeg.load({
				coreURL: await toBlobURL(
					`${baseURL}/ffmpeg-core.js`,
					"text/javascript"
				),
				wasmURL: await toBlobURL(
					`${baseURL}/ffmpeg-core.wasm`,
					"application/wasm"
				),
			});

			setMp4Progress(90);

			// Write input file
			await ffmpeg.writeFile("input.webm", await fetchFile(webmBlob));

			// Convert to MP4
			await ffmpeg.exec([
				"-i",
				"input.webm",
				"-c:v",
				"libx264",
				"-preset",
				"medium",
				"-crf",
				"23",
				"-c:a",
				"copy",
				"output.mp4",
			]);

			setMp4Progress(95);

			// Read output file
			const data = await ffmpeg.readFile("output.mp4");

			// Create download link
			const blob = new Blob([data], { type: "video/mp4" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `gradient-${dimensionType}-${width}x${height}-${Date.now()}.mp4`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			// Cleanup
			await ffmpeg.deleteFile("input.webm");
			await ffmpeg.deleteFile("output.mp4");

			setMp4Progress(100);
			setTimeout(() => {
				setIsGeneratingMP4(false);
				setMp4Progress(0);
			}, 500);
		} catch (error) {
			console.error("Error converting to MP4:", error);
			setIsGeneratingMP4(false);
			setMp4Progress(0);
		}
	};

	// Canvas-based download for PNG/JPEG
	const downloadRaster = async (
		format = "png",
		dimensionType = downloadDimension,
		options = {}
	) => {
		// Use previewFramePresets if dimensionType is a preview frame size, otherwise use dimensionPresets
		const dimensions =
			previewFramePresets[dimensionType] ||
			dimensionPresets[dimensionType] ||
			dimensionPresets.mobile;
		const canvas = document.createElement("canvas");
		const width = dimensions.width;
		const height = dimensions.height;
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");

		// Draw background image or gradient
		if (backgroundImage) {
			const bgImg = new Image();
			bgImg.crossOrigin = "anonymous";
			await new Promise((resolve, reject) => {
				bgImg.onload = () => {
					ctx.drawImage(bgImg, 0, 0, width, height);
					resolve();
				};
				bgImg.onerror = reject;
				bgImg.src = backgroundImage;
			});
		} else {
			// Create gradient based on type
			let gradientObj;
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
						lastStop.position.y - firstStop.position.y,
						lastStop.position.x - firstStop.position.x
					) *
					(180 / Math.PI);

				const radians = (angle * Math.PI) / 180;
				const x1 = width / 2 - (width / 2) * Math.cos(radians);
				const y1 = height / 2 - (width / 2) * Math.sin(radians);
				const x2 = width / 2 + (width / 2) * Math.cos(radians);
				const y2 = height / 2 + (width / 2) * Math.sin(radians);

				gradientObj = ctx.createLinearGradient(x1, y1, x2, y2);
				sortedStops.forEach((stop) => {
					const position = Math.round(stop.position.x) / 100;
					gradientObj.addColorStop(position, stop.color);
				});
			} else {
				// Radial and other types
				gradientObj = ctx.createRadialGradient(
					width / 2,
					height / 2,
					0,
					width / 2,
					height / 2,
					Math.max(width, height) / 2
				);
				sortedStops.forEach((stop) => {
					const distance = Math.sqrt(
						Math.pow(stop.position.x - 50, 2) +
							Math.pow(stop.position.y - 50, 2)
					);
					const position = Math.round(distance) / 100;
					gradientObj.addColorStop(position, stop.color);
				});
			}

			ctx.fillStyle = gradientObj;
			ctx.fillRect(0, 0, width, height);
		}

		// Draw all elements (images and texts) on canvas with all styles, respecting z-index
		const drawAllElements = async () => {
			if (!previewRef.current) return;

			const previewActualHeight = previewRef.current.offsetHeight;
			const previewActualWidth = previewRef.current.offsetWidth;
			const scaleX = width / previewActualWidth;
			const scaleY = height / previewActualHeight;

			// Load all images first and prepare draw functions
			const imageDrawFunctions = await Promise.all(
				images.map((image) => {
					return new Promise((resolve) => {
						const img = new Image();
						img.crossOrigin = "anonymous";
						img.onload = () => {
							resolve({ image, img, ready: true });
						};
						img.onerror = () => resolve({ image, img: null, ready: false });
						img.src = image.src;
					});
				})
			);

			// Combine all drawable elements and sort by z-index
			const allDrawableElements = [
				...imageDrawFunctions
					.filter((item) => item.ready)
					.map(({ image, img }) => ({
						type: "image",
						element: image,
						img,
						zIndex: image.styles?.zIndex || 1,
					})),
				...texts.map((txt) => ({
					type: "text",
					element: txt,
					zIndex: txt.styles?.zIndex || 2,
				})),
				...shapes.map((shape) => ({
					type: "shape",
					element: shape,
					zIndex: shape.styles?.zIndex || 1,
				})),
				...icons.map((icon) => ({
					type: "icon",
					element: icon,
					zIndex: icon.styles?.zIndex || 1,
				})),
			].sort((a, b) => a.zIndex - b.zIndex);

			// Draw all elements in z-index order
			allDrawableElements.forEach(({ type, element, img }) => {
				if (type === "image") {
					const image = element;
					const scaledX = (image.x / 100) * width - (image.width * scaleX) / 2;
					const scaledY =
						(image.y / 100) * height - (image.height * scaleY) / 2;
					const scaledWidth = image.width * scaleX;
					const scaledHeight = image.height * scaleY;
					const styles = image.styles || {};

					// Calculate center point for transforms
					const centerX = scaledX + scaledWidth / 2;
					const centerY = scaledY + scaledHeight / 2;

					// Save context
					ctx.save();

					// Apply transforms (rotation and skew)
					const rotation = (styles.rotation || 0) * (Math.PI / 180); // Convert to radians
					const skewX = (styles.skewX || 0) * (Math.PI / 180); // Convert to radians
					const skewY = (styles.skewY || 0) * (Math.PI / 180); // Convert to radians

					// Translate to center, apply transforms, then translate back
					ctx.translate(centerX, centerY);
					if (rotation !== 0) {
						ctx.rotate(rotation);
					}
					if (skewX !== 0 || skewY !== 0) {
						// Apply skew using transform matrix
						// skewX affects horizontal, skewY affects vertical
						ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);
					}
					ctx.translate(-centerX, -centerY);

					// Set opacity
					ctx.globalAlpha = styles.opacity !== undefined ? styles.opacity : 1;

					// Create clipping path for border-radius
					if (styles.borderRadius && styles.borderRadius > 0) {
						const borderRadius = styles.borderRadius * scaleY;
						drawRoundedRect(
							ctx,
							scaledX,
							scaledY,
							scaledWidth,
							scaledHeight,
							borderRadius
						);
						ctx.clip();
					}

					// Draw shadow if exists
					if (styles.shadow && styles.shadow !== "none") {
						ctx.save();
						ctx.globalAlpha = 0.3;
						ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
						let shadowBlur = 0;
						let shadowY = 0;
						switch (styles.shadow) {
							case "sm":
								shadowBlur = 2 * scaleY;
								shadowY = 1 * scaleY;
								break;
							case "md":
								shadowBlur = 4 * scaleY;
								shadowY = 2 * scaleY;
								break;
							case "lg":
								shadowBlur = 10 * scaleY;
								shadowY = 4 * scaleY;
								break;
							case "xl":
								shadowBlur = 20 * scaleY;
								shadowY = 10 * scaleY;
								break;
							case "2xl":
								shadowBlur = 25 * scaleY;
								shadowY = 12 * scaleY;
								break;
						}
						if (shadowBlur > 0) {
							ctx.filter = `blur(${shadowBlur}px)`;
							const shadowRadius = (styles.borderRadius || 0) * scaleY;
							drawRoundedRect(
								ctx,
								scaledX,
								scaledY + shadowY,
								scaledWidth,
								scaledHeight,
								shadowRadius
							);
							ctx.fill();
							ctx.filter = "none";
						}
						ctx.restore();
					}

					// Draw ring (outline) if exists - draw before image
					if (styles.ringWidth && styles.ringWidth > 0) {
						const ringWidth = styles.ringWidth * scaleY;
						const ringColor = styles.ringColor || "#3b82f6";
						const ringOffset = 2 * scaleY;
						const ringRadius =
							(styles.borderRadius || 0) * scaleY + ringOffset + ringWidth;
						ctx.strokeStyle = ringColor;
						ctx.lineWidth = ringWidth;
						drawRoundedRect(
							ctx,
							scaledX - ringOffset - ringWidth,
							scaledY - ringOffset - ringWidth,
							scaledWidth + (ringOffset + ringWidth) * 2,
							scaledHeight + (ringOffset + ringWidth) * 2,
							ringRadius
						);
						ctx.stroke();
					}

					// Draw image to temporary canvas for processing
					const tempCanvas = document.createElement("canvas");
					tempCanvas.width = scaledWidth;
					tempCanvas.height = scaledHeight;
					const tempCtx = tempCanvas.getContext("2d");

					// Handle object-fit
					if (styles.objectFit === "cover") {
						const imgAspect = img.width / img.height;
						const boxAspect = scaledWidth / scaledHeight;
						let drawWidth = scaledWidth;
						let drawHeight = scaledHeight;
						let drawX = 0;
						let drawY = 0;

						if (imgAspect > boxAspect) {
							drawHeight = scaledHeight;
							drawWidth = scaledHeight * imgAspect;
							drawX = (scaledWidth - drawWidth) / 2;
						} else {
							drawWidth = scaledWidth;
							drawHeight = scaledWidth / imgAspect;
							drawY = (scaledHeight - drawHeight) / 2;
						}
						tempCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
					} else if (styles.objectFit === "fill") {
						tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
					} else if (styles.objectFit === "none") {
						const imgScaledWidth = img.width * scaleX;
						const imgScaledHeight = img.height * scaleY;
						tempCtx.drawImage(img, 0, 0, imgScaledWidth, imgScaledHeight);
					} else if (styles.objectFit === "scale-down") {
						const imgAspect = img.width / img.height;
						const boxAspect = scaledWidth / scaledHeight;
						let drawWidth = Math.min(scaledWidth, img.width * scaleX);
						let drawHeight = Math.min(scaledHeight, img.height * scaleY);

						if (imgAspect > boxAspect) {
							drawHeight = drawWidth / imgAspect;
						} else {
							drawWidth = drawHeight * imgAspect;
						}
						const drawX = (scaledWidth - drawWidth) / 2;
						const drawY = (scaledHeight - drawHeight) / 2;
						tempCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
					} else {
						// contain (default)
						const imgAspect = img.width / img.height;
						const boxAspect = scaledWidth / scaledHeight;
						let drawWidth = scaledWidth;
						let drawHeight = scaledHeight;
						let drawX = 0;
						let drawY = 0;

						if (imgAspect > boxAspect) {
							drawHeight = scaledWidth / imgAspect;
							drawY = (scaledHeight - drawHeight) / 2;
						} else {
							drawWidth = scaledHeight * imgAspect;
							drawX = (scaledWidth - drawWidth) / 2;
						}
						tempCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
					}

					// Apply noise if enabled
					if (styles.noise?.enabled) {
						const imageData = tempCtx.getImageData(
							0,
							0,
							scaledWidth,
							scaledHeight
						);
						const data = imageData.data;
						const noiseIntensity = styles.noise.intensity || 0.3;

						for (let i = 0; i < data.length; i += 4) {
							const noise = (Math.random() - 0.5) * noiseIntensity * 50;
							data[i] = Math.max(0, Math.min(255, data[i] + noise)); // R
							data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
							data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
						}
						tempCtx.putImageData(imageData, 0, 0);
					}

					// Draw processed image to main canvas
					ctx.drawImage(tempCanvas, scaledX, scaledY);

					// Restore context (removes clipping)
					ctx.restore();

					// Draw border if exists (draw after image)
					if (styles.borderWidth && styles.borderWidth > 0) {
						const borderWidth = styles.borderWidth * scaleY;
						const borderColor = styles.borderColor || "#000000";
						const borderRadius = (styles.borderRadius || 0) * scaleY;

						ctx.strokeStyle = borderColor;
						ctx.lineWidth = borderWidth;

						if (styles.borderStyle === "dashed") {
							ctx.setLineDash([borderWidth * 3, borderWidth * 2]);
						} else if (styles.borderStyle === "dotted") {
							ctx.setLineDash([borderWidth, borderWidth]);
						} else {
							ctx.setLineDash([]);
						}

						drawRoundedRect(
							ctx,
							scaledX,
							scaledY,
							scaledWidth,
							scaledHeight,
							borderRadius
						);
						ctx.stroke();
						ctx.setLineDash([]);
					}

					// Draw caption if exists
					if (image.caption) {
						ctx.fillStyle = "black";
						ctx.font = `${16 * scaleY}px Arial`;
						ctx.textAlign = "center";
						ctx.fillText(
							image.caption,
							scaledX + scaledWidth / 2,
							scaledY + scaledHeight + 20 * scaleY
						);
					}
				} else if (type === "text") {
					const text = element;
					const scaledX = (text.x / 100) * width;
					const scaledY = (text.y / 100) * height;
					const scaledWidth = text.width * scaleX;
					const scaledHeight = text.height * scaleY;
					const styles = text.styles || {};

					// Calculate center point for transforms
					const centerX = scaledX;
					const centerY = scaledY;

					// Save context
					ctx.save();

					// Apply transforms (rotation and skew)
					const rotation = (styles.rotation || 0) * (Math.PI / 180); // Convert to radians
					const skewX = (styles.skewX || 0) * (Math.PI / 180); // Convert to radians
					const skewY = (styles.skewY || 0) * (Math.PI / 180); // Convert to radians

					// Translate to center, apply transforms, then translate back
					ctx.translate(centerX, centerY);
					if (rotation !== 0) {
						ctx.rotate(rotation);
					}
					if (skewX !== 0 || skewY !== 0) {
						// Apply skew using transform matrix
						ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);
					}
					ctx.translate(-centerX, -centerY);

					// Set global alpha
					ctx.globalAlpha = styles.opacity !== undefined ? styles.opacity : 1;

					// Calculate text bounds with padding
					const padding = (styles.padding || 0) * scaleY;
					const textBoundsX = scaledX - scaledWidth / 2;
					const textBoundsY = scaledY - scaledHeight / 2;
					const textBoundsWidth = scaledWidth;
					const textBoundsHeight = scaledHeight;

					// Draw shadow if exists
					if (
						styles.shadow &&
						(typeof styles.shadow === "object"
							? styles.shadow.enabled
							: styles.shadow !== "none")
					) {
						ctx.save();
						let shadowBlur = 0;
						let shadowX = 0;
						let shadowY = 0;
						let shadowColor = "rgba(0, 0, 0, 0.5)";
						// Handle new object format
						if (typeof styles.shadow === "object" && styles.shadow.enabled) {
							shadowBlur = (styles.shadow.blur || 0) * scaleY;
							shadowX = (styles.shadow.x || 0) * scaleX;
							shadowY = (styles.shadow.y || 0) * scaleY;
							const color = styles.shadow.color || "#000000";
							// Convert hex to rgba
							if (color.startsWith("#") && color.length === 7) {
								const r = parseInt(color.slice(1, 3), 16);
								const g = parseInt(color.slice(3, 5), 16);
								const b = parseInt(color.slice(5, 7), 16);
								shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
							} else {
								shadowColor = color;
							}
						} else if (typeof styles.shadow === "string") {
							// Handle old string format for backward compatibility
							ctx.globalAlpha = 0.3;
							switch (styles.shadow) {
								case "sm":
									shadowBlur = 2 * scaleY;
									shadowY = 1 * scaleY;
									break;
								case "md":
									shadowBlur = 4 * scaleY;
									shadowY = 2 * scaleY;
									break;
								case "lg":
									shadowBlur = 10 * scaleY;
									shadowY = 4 * scaleY;
									break;
								case "xl":
									shadowBlur = 20 * scaleY;
									shadowY = 10 * scaleY;
									break;
								case "2xl":
									shadowBlur = 25 * scaleY;
									shadowY = 12 * scaleY;
									break;
							}
						}
						ctx.fillStyle = shadowColor;
						if (shadowBlur > 0 || shadowX !== 0 || shadowY !== 0) {
							ctx.filter = shadowBlur > 0 ? `blur(${shadowBlur}px)` : "none";
							const borderRadius = (styles.borderRadius || 0) * scaleY;
							drawRoundedRect(
								ctx,
								textBoundsX + shadowX,
								textBoundsY + shadowY,
								textBoundsWidth,
								textBoundsHeight,
								borderRadius
							);
							ctx.fill();
							ctx.filter = "none";
						}
						ctx.restore();
					}

					// Draw background if not transparent
					const borderRadius = (styles.borderRadius || 0) * scaleY;
					if (
						styles.backgroundColor &&
						styles.backgroundColor !== "transparent"
					) {
						ctx.fillStyle = styles.backgroundColor;
						drawRoundedRect(
							ctx,
							textBoundsX,
							textBoundsY,
							textBoundsWidth,
							textBoundsHeight,
							borderRadius
						);
						ctx.fill();
					}

					// Draw border if exists
					if (styles.borderWidth && styles.borderWidth > 0) {
						const borderWidth = styles.borderWidth * scaleY;
						const borderColor = styles.borderColor || "#000000";

						ctx.strokeStyle = borderColor;
						ctx.lineWidth = borderWidth;

						if (styles.borderStyle === "dashed") {
							ctx.setLineDash([borderWidth * 3, borderWidth * 2]);
						} else if (styles.borderStyle === "dotted") {
							ctx.setLineDash([borderWidth, borderWidth]);
						} else {
							ctx.setLineDash([]);
						}

						drawRoundedRect(
							ctx,
							textBoundsX,
							textBoundsY,
							textBoundsWidth,
							textBoundsHeight,
							borderRadius
						);
						ctx.stroke();
						ctx.setLineDash([]);
					}

					// Set text style
					const fontStyle = styles.fontStyle || "normal";
					const fontWeight = styles.fontWeight || "normal";
					const fontSize = (styles.fontSize || 24) * scaleY;
					const fontFamily = styles.fontFamily || "Arial";
					ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
					ctx.fillStyle = styles.color || "#000000";

					// Map text-align values
					let textAlign = styles.textAlign || "left";
					if (textAlign === "center") {
						ctx.textAlign = "center";
					} else if (textAlign === "right") {
						ctx.textAlign = "right";
					} else {
						ctx.textAlign = "left";
					}

					ctx.textBaseline = "middle";

					// Draw text with proper alignment
					const lines = text.content.split("\n");
					const lineHeight = fontSize * 1.2;
					const startY = scaledY - ((lines.length - 1) * lineHeight) / 2;

					lines.forEach((line, index) => {
						let lineX = scaledX;
						// Adjust X position based on text align when using left/right
						if (textAlign === "left") {
							lineX = textBoundsX + padding;
						} else if (textAlign === "right") {
							lineX = textBoundsX + textBoundsWidth - padding;
						}
						ctx.fillText(line, lineX, startY + index * lineHeight);
					});

					// Restore context
					ctx.restore();
				} else if (type === "shape") {
					const shape = element;
					const scaledX = (shape.x / 100) * width - (shape.width * scaleX) / 2;
					const scaledY =
						(shape.y / 100) * height - (shape.height * scaleY) / 2;
					const scaledWidth = shape.width * scaleX;
					const scaledHeight = shape.height * scaleY;
					const styles = shape.styles || {};

					// Calculate center point for transforms
					const centerX = scaledX + scaledWidth / 2;
					const centerY = scaledY + scaledHeight / 2;

					ctx.save();

					// Apply transforms (rotation and skew)
					const rotation = (styles.rotation || 0) * (Math.PI / 180); // Convert to radians
					const skewX = (styles.skewX || 0) * (Math.PI / 180); // Convert to radians
					const skewY = (styles.skewY || 0) * (Math.PI / 180); // Convert to radians

					// Translate to center, apply transforms, then translate back
					ctx.translate(centerX, centerY);
					if (rotation !== 0) {
						ctx.rotate(rotation);
					}
					if (skewX !== 0 || skewY !== 0) {
						// Apply skew using transform matrix
						ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);
					}
					ctx.translate(-centerX, -centerY);

					ctx.globalAlpha = styles.opacity !== undefined ? styles.opacity : 1;

					// Draw shadow if exists
					if (styles.shadow && styles.shadow !== "none") {
						ctx.save();
						ctx.globalAlpha = 0.3;
						ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
						let shadowBlur = 0;
						let shadowY = 0;
						switch (styles.shadow) {
							case "sm":
								shadowBlur = 2 * scaleY;
								shadowY = 1 * scaleY;
								break;
							case "md":
								shadowBlur = 4 * scaleY;
								shadowY = 2 * scaleY;
								break;
							case "lg":
								shadowBlur = 10 * scaleY;
								shadowY = 4 * scaleY;
								break;
							case "xl":
								shadowBlur = 20 * scaleY;
								shadowY = 10 * scaleY;
								break;
							case "2xl":
								shadowBlur = 25 * scaleY;
								shadowY = 12 * scaleY;
								break;
						}
						if (shadowBlur > 0) {
							ctx.filter = `blur(${shadowBlur}px)`;
							if (shape.type === "rectangle" || shape.type === "square") {
								const shadowRadius = (styles.borderRadius || 0) * scaleY;
								drawRoundedRect(
									ctx,
									scaledX,
									scaledY + shadowY,
									scaledWidth,
									scaledHeight,
									shadowRadius
								);
								ctx.fill();
							} else if (shape.type === "triangle") {
								ctx.beginPath();
								ctx.moveTo(scaledX + scaledWidth / 2, scaledY + shadowY);
								ctx.lineTo(scaledX, scaledY + scaledHeight + shadowY);
								ctx.lineTo(
									scaledX + scaledWidth,
									scaledY + scaledHeight + shadowY
								);
								ctx.closePath();
								ctx.fill();
							} else if (shape.type === "line") {
								ctx.beginPath();
								ctx.moveTo(scaledX, scaledY + scaledHeight / 2 + shadowY);
								ctx.lineTo(
									scaledX + scaledWidth,
									scaledY + scaledHeight / 2 + shadowY
								);
								ctx.stroke();
							}
							ctx.filter = "none";
						}
						ctx.restore();
					}

					// Draw shape
					// Setup fill style (gradient or solid color)
					let fillStyle;
					if (styles.fillGradient) {
						const sortedStops = [...styles.fillGradient.stops].sort(
							(a, b) => a.position.x - b.position.x
						);
						const angle = (styles.fillGradient.angle || 45) * (Math.PI / 180);
						const centerX = scaledX + scaledWidth / 2;
						const centerY = scaledY + scaledHeight / 2;
						const length = Math.sqrt(
							scaledWidth * scaledWidth + scaledHeight * scaledHeight
						);
						const x1 = centerX - (length / 2) * Math.cos(angle);
						const y1 = centerY - (length / 2) * Math.sin(angle);
						const x2 = centerX + (length / 2) * Math.cos(angle);
						const y2 = centerY + (length / 2) * Math.sin(angle);

						const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
						sortedStops.forEach((stop) => {
							gradient.addColorStop(stop.position.x / 100, stop.color);
						});
						fillStyle = gradient;
					} else {
						fillStyle = styles.fillColor || "#3b82f6";
					}

					if (shape.type === "rectangle" || shape.type === "square") {
						const borderRadius = (styles.borderRadius || 0) * scaleY;
						ctx.fillStyle = fillStyle;
						drawRoundedRect(
							ctx,
							scaledX,
							scaledY,
							scaledWidth,
							scaledHeight,
							borderRadius
						);
						ctx.fill();

						if (styles.strokeWidth && styles.strokeWidth > 0) {
							ctx.strokeStyle = styles.strokeColor || "#1e40af";
							ctx.lineWidth = (styles.strokeWidth || 2) * scaleY;
							drawRoundedRect(
								ctx,
								scaledX,
								scaledY,
								scaledWidth,
								scaledHeight,
								borderRadius
							);
							ctx.stroke();
						}
					} else if (shape.type === "triangle") {
						ctx.fillStyle = fillStyle;
						ctx.beginPath();
						ctx.moveTo(scaledX + scaledWidth / 2, scaledY);
						ctx.lineTo(scaledX, scaledY + scaledHeight);
						ctx.lineTo(scaledX + scaledWidth, scaledY + scaledHeight);
						ctx.closePath();
						ctx.fill();

						if (styles.strokeWidth && styles.strokeWidth > 0) {
							ctx.strokeStyle = styles.strokeColor || "#1e40af";
							ctx.lineWidth = (styles.strokeWidth || 2) * scaleY;
							ctx.stroke();
						}
					} else if (shape.type === "line") {
						ctx.strokeStyle = styles.strokeColor || "#1e40af";
						ctx.lineWidth = (styles.strokeWidth || 2) * scaleY;
						ctx.beginPath();
						ctx.moveTo(scaledX, scaledY + scaledHeight / 2);
						ctx.lineTo(scaledX + scaledWidth, scaledY + scaledHeight / 2);
						ctx.stroke();
					} else if (shape.type === "circle") {
						const radius = Math.min(scaledWidth, scaledHeight) / 2;
						const centerX = scaledX + scaledWidth / 2;
						const centerY = scaledY + scaledHeight / 2;

						ctx.fillStyle = fillStyle;
						ctx.beginPath();
						ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
						ctx.fill();

						if (styles.strokeWidth && styles.strokeWidth > 0) {
							ctx.strokeStyle = styles.strokeColor || "#1e40af";
							ctx.lineWidth = (styles.strokeWidth || 2) * scaleY;
							ctx.stroke();
						}
					}

					ctx.restore();
				}
			});
		};

		// Convert to blob and download
		const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
		const quality = format === "jpeg" ? 0.92 : undefined;

		// Draw all elements in z-index order
		drawAllElements().then(() => {
			// Ensure all elements are drawn, then export
			setTimeout(() => {
				canvas.toBlob(
					(blob) => {
						const url = URL.createObjectURL(blob);
						const link = document.createElement("a");
						link.href = url;
						link.download = `gradient-${dimensionType}-${width}x${height}-${Date.now()}.${format}`;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						URL.revokeObjectURL(url);
					},
					mimeType,
					quality
				);
			}, 100);
		});
	};

	// Load projects using react-query above

	// Get projectId or docId from URL
	const projectIdFromUrl = router.query.projectId || router.query.docId;
	const rawFrameIdFromUrl = router.query.frame;
	const frameIdFromUrl = Array.isArray(rawFrameIdFromUrl)
		? rawFrameIdFromUrl[0]
		: rawFrameIdFromUrl || null;

	// Load project from URL using useQuery
	const {
		data: projectData,
		isLoading: isLoadingProject,
		error: projectError,
	} = useQuery({
		queryKey: ["project", projectIdFromUrl, user?.uid],
		queryFn: async () => {
			if (!projectIdFromUrl || !isAuthenticated || !user?.uid) {
				return null;
			}

			try {
				const projectRef = doc(
					db,
					"users",
					user.uid,
					"kixi-projects",
					projectIdFromUrl
				);
				const projectDoc = await getDoc(projectRef);

				if (!projectDoc.exists()) {
					return null;
				}

				const data = projectDoc.data();
				return {
					id: projectDoc.id,
					...data,
				};
			} catch (error) {
				console.error("Error loading project:", error);
				throw error;
			}
		},
		enabled: !!projectIdFromUrl && !!isAuthenticated && !!user?.uid,
		staleTime: 1000 * 60, // Consider data fresh for 1 minute
		cacheTime: 1000 * 60 * 5, // Keep data in cache for 5 minutes
	});

	const {
		data: projectFramesData,
		isLoading: isLoadingFrames,
		error: framesError,
		refetch: refetchFrames,
	} = useQuery({
		queryKey: ["projectFrames", projectIdFromUrl, user?.uid],
		queryFn: async () => {
			if (!projectIdFromUrl || !isAuthenticated || !user?.uid) {
				return [];
			}

			try {
				const framesRef = collection(
					db,
					"users",
					user.uid,
					"kixi-projects",
					projectIdFromUrl,
					"frames"
				);
				const framesQuery = query(framesRef, orderBy("frameNumber", "asc"));
				const framesSnapshot = await getDocs(framesQuery);

				if (framesSnapshot.empty) {
					return [];
				}

				return framesSnapshot.docs.map((frameDoc) => ({
					id: frameDoc.id,
					...frameDoc.data(),
				}));
			} catch (error) {
				console.error("Error loading frames:", error);
				throw error;
			}
		},
		enabled: !!projectIdFromUrl && !!isAuthenticated && !!user?.uid,
		staleTime: 1000 * 60,
		cacheTime: 1000 * 60 * 5,
	});

	useEffect(() => {
		if (framesError) {
			console.error("Error loading frames:", framesError);
			toast.error("Failed to load frames. Please try again.");
		}
	}, [framesError]);

	const framesList = useMemo(() => {
		if (!projectFramesData || projectFramesData.length === 0) return [];
		return [...projectFramesData]
			.sort(
				(a, b) =>
					(a.frameNumber ?? Number.MAX_SAFE_INTEGER) -
					(b.frameNumber ?? Number.MAX_SAFE_INTEGER)
			)
			.map((frame, index) => ({
				...frame,
				frameNumber: frame.frameNumber ?? index + 1,
			}));
	}, [projectFramesData]);

	const lastFrameQueryRef = useRef(null);

	const applyFrameState = useCallback((frameData) => {
		if (!frameData) return;

		if (frameData.gradient) {
			setGradient(JSON.parse(JSON.stringify(frameData.gradient)));
		}
		if (frameData.images !== undefined) {
			setImages(JSON.parse(JSON.stringify(frameData.images || [])));
		} else {
			setImages([]);
		}
		if (frameData.videos !== undefined) {
			setVideos(JSON.parse(JSON.stringify(frameData.videos || [])));
		} else {
			setVideos([]);
		}
		if (frameData.texts !== undefined) {
			setTexts(JSON.parse(JSON.stringify(frameData.texts || [])));
		} else {
			setTexts([]);
		}
		if (frameData.icons !== undefined) {
			setIcons(JSON.parse(JSON.stringify(frameData.icons || [])));
		} else {
			setIcons([]);
		}
		if (frameData.shapes !== undefined) {
			setShapes(JSON.parse(JSON.stringify(frameData.shapes || [])));
		} else {
			setShapes([]);
		}
		if (frameData.backgroundImage !== undefined) {
			setBackgroundImage(frameData.backgroundImage || null);
		} else {
			setBackgroundImage(null);
		}
		if (frameData.backgroundShapeRects !== undefined) {
			setBackgroundShapeRects(
				JSON.parse(JSON.stringify(frameData.backgroundShapeRects || []))
			);
		} else {
			setBackgroundShapeRects([]);
		}

		// Reset selections to avoid stale references when switching frames
		setSelectedImage(null);
		setSelectedImages([]);
		setSelectedVideo(null);
		setSelectedVideos([]);
		setSelectedText(null);
		setSelectedTexts([]);
		setSelectedShape(null);
		setSelectedIcon(null);
		setSelectedIcons([]);
		setSelectedBackgroundShapeRect(null);
		setSelectedStop(null);
		setAlignmentGuides({ horizontal: [], vertical: [] });
	}, []);

	const updateFrameQueryParam = useCallback(
		(frameId) => {
			if (!router.isReady) return;

			const currentQuery = router.query || {};
			const nextQuery = { ...currentQuery };

			if (frameId) {
				nextQuery.frame = frameId;
			} else {
				delete nextQuery.frame;
			}

			router.replace(
				{
					pathname: "/app",
					query: nextQuery,
				},
				undefined,
				{ shallow: true }
			);
		},
		[router.isReady, router.query]
	);

	const handleFrameSelect = useCallback(
		(frameId) => {
			if (!frameId) return;
			const targetFrame = framesList.find((frame) => frame.id === frameId);
			if (!targetFrame) return;
			if (frameId !== activeFrameId) {
				setActiveFrameId(frameId);
			}
			updateFrameQueryParam(frameId);
			applyFrameState(targetFrame);
		},
		[activeFrameId, framesList, applyFrameState, updateFrameQueryParam]
	);

	useEffect(() => {
		if (!router.isReady) return;

		if (!framesList.length) {
			if (activeFrameId) {
				setActiveFrameId(null);
			}
			lastFrameQueryRef.current = null;
			return;
		}

		const normalizedFrameQuery = frameIdFromUrl || null;
		const hasQueryChanged = lastFrameQueryRef.current !== normalizedFrameQuery;
		const frameExistsInList = normalizedFrameQuery
			? framesList.some((frame) => frame.id === normalizedFrameQuery)
			: false;

		if (hasQueryChanged) {
			lastFrameQueryRef.current = normalizedFrameQuery;
			if (normalizedFrameQuery && frameExistsInList) {
				if (normalizedFrameQuery !== activeFrameId) {
					const targetFrame = framesList.find(
						(f) => f.id === normalizedFrameQuery
					);
					if (targetFrame) {
						setActiveFrameId(normalizedFrameQuery);
						applyFrameState(targetFrame);
					}
				}
				return;
			}

			if (normalizedFrameQuery && !frameExistsInList && framesList[0]) {
				const firstFrame = framesList[0];
				setActiveFrameId(firstFrame.id);
				applyFrameState(firstFrame);
				updateFrameQueryParam(firstFrame.id);
				return;
			}
		}

		if (!normalizedFrameQuery && framesList[0]) {
			if (!activeFrameId) {
				const firstFrame = framesList[0];
				setActiveFrameId(firstFrame.id);
				applyFrameState(firstFrame);
				updateFrameQueryParam(firstFrame.id);
				return;
			}

			const activeExists = framesList.some(
				(frame) => frame.id === activeFrameId
			);
			if (!activeExists) {
				const firstFrame = framesList[0];
				setActiveFrameId(firstFrame.id);
				applyFrameState(firstFrame);
				updateFrameQueryParam(firstFrame.id);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [framesList, frameIdFromUrl, router.isReady]);

	// Update states when project data is loaded
	useEffect(() => {
		if (projectData && projectData.id !== currentProjectId) {
			setGradient(projectData.gradient || gradient);
			setImages(projectData.images || []);
			setTexts(projectData.texts || []);
			setVideos(projectData.videos || []);
			setShapes(projectData.shapes || []);
			setIcons(projectData.icons || []);
			setProjectName(projectData.name || "Untitled Project");
			setCurrentProjectId(projectData.id);
			setPublicDocId(projectData.publicDocId || null);
			setActiveFrameId(null);
		}
	}, [projectData]);

	// Handle project loading error
	useEffect(() => {
		if (projectError) {
			console.error("Error loading project:", projectError);
			if (projectError.message.includes("permission")) {
				toast.error("You don't have permission to access this project");
			} else {
				toast.error("Failed to load project. Please try again.");
			}
		}
	}, [projectError]);

	// Publish project to public collection
	const handlePublishProject = async () => {
		if (!isAuthenticated || !user?.uid) {
			toast.error("Please sign in to publish your project");
			return;
		}

		if (!currentProjectId) {
			toast.error("Please save your project first before publishing");
			return;
		}

		setIsPublishing(true);
		try {
			// Generate HTML content
			const htmlContent = generateHTML();

			// Check if already published
			const publishedProjectsRef = collection(db, "published-projects");
			const publishedQuery = query(
				publishedProjectsRef,
				where("projectId", "==", currentProjectId),
				where("userId", "==", user.uid)
			);
			const publishedSnapshot = await getDocs(publishedQuery);

			let publicDocRef;
			if (!publishedSnapshot.empty) {
				// Update existing published project
				publicDocRef = publishedSnapshot.docs[0].ref;
				await updateDoc(publicDocRef, {
					publicHtmlContent: htmlContent,
					projectName: projectName,
					updatedAt: new Date().toISOString(),
				});
			} else {
				// Create new published project
				const publishedData = {
					projectId: currentProjectId,
					userId: user.uid,
					userEmail: user.email,
					userDisplayName: user.displayName,
					publicHtmlContent: htmlContent,
					projectName: projectName,
					isPublic: true,
					publishedAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				publicDocRef = await addDoc(publishedProjectsRef, publishedData);
			}

			await publishFramesHtml(currentProjectId, publicDocRef.id);

			// Update original project with publish info
			const projectRef = doc(
				db,
				"users",
				user.uid,
				"kixi-projects",
				currentProjectId
			);
			await updateDoc(projectRef, {
				isPublic: true,
				publicDocId: publicDocRef.id,
				publicUrl: `/p/${publicDocRef.id}`,
			});

			setPublicDocId(publicDocRef.id);
			const publicUrl = `${window.location.origin}/p/${publicDocRef.id}`;

			// Copy URL to clipboard
			await navigator.clipboard.writeText(publicUrl);
			setCopied("published");
			setTimeout(() => setCopied(""), 3000);

			// Show success message with link
			if (
				window.confirm(
					`Project published! Link copied to clipboard.\n\n${publicUrl}\n\nClick OK to open in new tab, or Cancel to stay here.`
				)
			) {
				window.open(publicUrl, "_blank");
			}
		} catch (error) {
			console.error("Error publishing project:", error);
			toast.error("Failed to publish project. Please try again.");
		} finally {
			setIsPublishing(false);
		}
	};

	// Load project from Firestore
	const loadProject = async (projectId) => {
		if (!isAuthenticated || !user?.uid) return;

		try {
			const projectRef = doc(db, "users", user.uid, "kixi-projects", projectId);
			const projectDoc = await getDoc(projectRef);

			if (projectDoc.exists()) {
				const projectData = projectDoc.data();
				setGradient(projectData.gradient || gradient);
				setImages(projectData.images || []);
				setTexts(projectData.texts || []);
				setVideos(projectData.videos || []);
				setShapes(projectData.shapes || []);
				setIcons(projectData.icons || []);
				setProjectName(projectData.name || "Untitled Project");
				setCurrentProjectId(projectId);
				setPublicDocId(projectData.publicDocId || null);
				setActiveFrameId(null);
			}
		} catch (error) {
			console.error("Error loading project:", error);
			toast.error("Failed to load project. Please try again.");
		}
	};

	// Create new project
	const handleNewProject = async () => {
		if (!isAuthenticated || !user?.uid) {
			toast.error("Please sign in to create a new project");
			return;
		}

		const defaultGradient = {
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
		};

		// Set local state first
		setCurrentProjectId(null);
		setProjectName("Untitled Project");
		setGradient(defaultGradient);
		setImages([]);
		setTexts([]);
		setVideos([]);
		setShapes([]);
		setIcons([]);
		setActiveFrameId(null);

		// Save to Firestore
		try {
			const projectData = {
				name: "Untitled Project",
				gradient: defaultGradient,
				images: [],
				texts: [],
				videos: [],
				shapes: [],
				icons: [],
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			const projectsRef = collection(db, "users", user.uid, "kixi-projects");
			const docRef = await addDoc(projectsRef, projectData);
			setCurrentProjectId(docRef.id);
			await queryClient.invalidateQueries(["projects", user?.uid]);
			router.push(`/app?projectId=${docRef.id}`, undefined, {
				shallow: true,
			});
		} catch (error) {
			console.error("Error creating new project:", error);
			toast.error("Failed to create new project. Please try again.");
		}
	};

	// Delete project
	const handleDeleteProject = async (projectId) => {
		if (!confirm("Are you sure you want to delete this project?")) return;

		try {
			await deleteDoc(doc(db, "users", user.uid, "kixi-projects", projectId));
			if (currentProjectId === projectId) {
				handleNewProject();
			}
			await queryClient.invalidateQueries(["projects", user?.uid]);
		} catch (error) {
			console.error("Error deleting project:", error);
			toast.error("Failed to delete project. Please try again.");
		}
	};

	// Rename project
	const handleRenameProject = async (projectId, newName) => {
		if (!newName.trim()) {
			setEditingProjectId(null);
			setEditingProjectName("");
			return;
		}

		try {
			// Find the project to get its publicDocId
			const project = projects.find((p) => p.id === projectId);
			const trimmedName = newName.trim();

			// Update in users/kixi-projects
			const projectRef = doc(db, "users", user.uid, "kixi-projects", projectId);
			await updateDoc(projectRef, {
				name: trimmedName,
				updatedAt: new Date().toISOString(),
			});

			// If project is published, also update in published-projects
			if (project?.publicDocId) {
				const publishedDocRef = doc(
					db,
					"published-projects",
					project.publicDocId
				);
				await updateDoc(publishedDocRef, {
					projectName: trimmedName,
					updatedAt: new Date().toISOString(),
				});
			}

			// Update local state
			queryClient.setQueryData(["projects", user?.uid], (oldProjects) =>
				oldProjects
					? oldProjects.map((p) =>
							p.id === projectId ? { ...p, name: trimmedName } : p
						)
					: []
			);

			// If this is the current project, update the projectName state too
			if (currentProjectId === projectId) {
				setProjectName(trimmedName);
			}

			toast.success("Project renamed successfully");
		} catch (error) {
			console.error("Error renaming project:", error);
			toast.error("Failed to rename project. Please try again.");
		} finally {
			setEditingProjectId(null);
			setEditingProjectName("");
		}
	};

	// Rename frame
	const handleRenameFrame = async (newName) => {
		const trimmedName = newName?.trim();

		// Reset editing state regardless
		setIsEditingFrameName(false);
		setEditingFrameNameValue("");

		if (!trimmedName || !activeFrameId || !currentProjectId || !user?.uid) {
			return;
		}

		try {
			// Update frame name in Firestore
			const frameRef = doc(
				db,
				"users",
				user.uid,
				"kixi-projects",
				currentProjectId,
				"frames",
				activeFrameId
			);
			await updateDoc(frameRef, {
				name: trimmedName,
				updatedAt: new Date().toISOString(),
			});

			// Refetch frames to update local state
			refetchFrames();

			toast.success("Frame renamed successfully");
		} catch (error) {
			console.error("Error renaming frame:", error);
			toast.error("Failed to rename frame. Please try again.");
		}
	};

	// Get current active frame data
	const activeFrame = useMemo(() => {
		return framesList.find((frame) => frame.id === activeFrameId) || null;
	}, [framesList, activeFrameId]);

	// Image improvement mutation
	const generateImprovedImages = useMutation({
		mutationFn: async ({ imageBase64, prompt, ast, variantCount }) => {
			const response = await fetch("/api/generate-improved-images", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					imageBase64,
					prompt,
					ast,
					variantCount,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to generate images");
			}

			return response.json();
		},
		onSuccess: (data) => {
			setGeneratedImages(data.images || []);
			setVariantNotes(data.notes || []);
			toast.success("AI variants are ready.");
		},
		onError: (error) => {
			setVariantNotes([]);
			console.error("Error generating images:", error);
			toast.error(
				error.message || "Failed to generate images. Please try again."
			);
		},
	});

	const handleGenerateVariants = (prompt = null) => {
		const state = {
			gradient: {
				type: gradient.type,
				angle: gradient.angle,
				stops: gradient.stops,
				noise: gradient.noise,
				animation: gradient.animation,
				backgroundAnimation: gradient.backgroundAnimation,
				dimensions: gradient.dimensions,
			},
			images: images.map((img) => ({
				x: img.x,
				y: img.y,
				width: img.width,
				height: img.height,
				src: img.src,
				caption: img.caption,
				styles: img.styles,
			})),
			videos: videos.map((vid) => ({
				x: vid.x,
				y: vid.y,
				width: vid.width,
				height: vid.height,
				src: vid.src,
				caption: vid.caption,
				styles: vid.styles,
			})),
			texts: texts.map((text) => ({
				content: text.content,
				x: text.x,
				y: text.y,
				width: text.width,
				height: text.height,
				styles: text.styles,
			})),
			shapes: shapes.map((shape) => ({
				shapeType: shape.shapeType,
				x: shape.x,
				y: shape.y,
				width: shape.width,
				height: shape.height,
				fillColor: shape.fillColor,
				strokeColor: shape.strokeColor,
				strokeWidth: shape.strokeWidth,
				borderRadius: shape.borderRadius,
				opacity: shape.opacity,
				zIndex: shape.zIndex,
			})),
			icons: icons.map((icon) => ({
				iconName: icon.iconName,
				x: icon.x,
				y: icon.y,
				width: icon.width,
				height: icon.height,
				styles: icon.styles,
			})),
		};
		generateVariantsMutation.mutate({ state, prompt });
	};

	// Generate React Code mutation
	const generateReactCodeMutation = useMutation({
		mutationFn: async () => {
			const state = {
				gradient: {
					type: gradient.type,
					angle: gradient.angle,
					stops: gradient.stops,
					noise: gradient.noise,
					animation: gradient.animation,
					backgroundAnimation: gradient.backgroundAnimation,
					dimensions: gradient.dimensions,
				},
				images: images.map((img) => ({
					x: img.x,
					y: img.y,
					width: img.width,
					height: img.height,
					src: img.src,
					caption: img.caption,
					styles: img.styles,
				})),
				videos: videos.map((vid) => ({
					x: vid.x,
					y: vid.y,
					width: vid.width,
					height: vid.height,
					src: vid.src,
					caption: vid.caption,
					styles: vid.styles,
				})),
				texts: texts.map((text) => ({
					content: text.content,
					x: text.x,
					y: text.y,
					width: text.width,
					height: text.height,
					styles: text.styles,
				})),
				shapes: shapes.map((shape) => ({
					shapeType: shape.shapeType,
					x: shape.x,
					y: shape.y,
					width: shape.width,
					height: shape.height,
					fillColor: shape.fillColor,
					strokeColor: shape.strokeColor,
					strokeWidth: shape.strokeWidth,
					borderRadius: shape.borderRadius,
					opacity: shape.opacity,
					zIndex: shape.zIndex,
				})),
				icons: icons.map((icon) => ({
					iconName: icon.iconName,
					x: icon.x,
					y: icon.y,
					width: icon.width,
					height: icon.height,
					styles: icon.styles,
				})),
			};

			const response = await fetch("/api/convert-to-react", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ state }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to generate React code");
			}

			return response.json();
		},
		onSuccess: (data) => {
			setGeneratedReactCode(data.code || "");
			setIsGenerateCodeDropdownOpen(true);
			toast.success("React code generated successfully!");
		},
		onError: (error) => {
			console.error("Error generating React code:", error);
			toast.error(
				error.message || "Failed to generate code. Please try again."
			);
		},
	});

	// Copy generated code to clipboard
	const handleCopyGeneratedCode = async () => {
		try {
			await navigator.clipboard.writeText(generatedReactCode);
			setCodeCopied(true);
			toast.success("Code copied to clipboard!");
			setTimeout(() => setCodeCopied(false), 2000);
		} catch (err) {
			toast.error("Failed to copy code");
		}
	};

	// Auto-focus improvement prompt when modal opens
	useEffect(() => {
		if (isImageImprovementOpen && improvementPromptRef.current) {
			setTimeout(() => {
				improvementPromptRef.current?.focus();
			}, 100);
		}
	}, [isImageImprovementOpen]);

	// Auto-focus URL input when modal opens
	useEffect(() => {
		if (isUrlScreenshotOpen && urlInputRef.current) {
			setTimeout(() => {
				urlInputRef.current?.focus();
			}, 100);
		}
	}, [isUrlScreenshotOpen]);

	// Handle URL screenshot
	const handleUrlScreenshot = async () => {
		if (!urlInput.trim()) {
			toast.error("Please enter a URL");
			return;
		}

		// Validate URL
		try {
			new URL(urlInput.trim());
		} catch (e) {
			toast.error("Please enter a valid URL (e.g., https://example.com)");
			return;
		}

		setIsScreenshotLoading(true);
		setScreenshotImage(null);

		try {
			const response = await fetch("/api/url-to-screenshot", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					url: urlInput.trim(),
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to generate screenshot");
			}

			const data = await response.json();
			console.log("Screenshot response:", {
				success: data.success,
				hasImage: !!data.image,
				hasScreenshot: !!data.screenshot,
			});

			// Use screenshot URL from external API (or fallback to image)
			const screenshotUrl = data.screenshot || data.image;
			if (screenshotUrl) {
				setScreenshotImage(screenshotUrl);
			} else {
				throw new Error("No screenshot URL in response");
			}
		} catch (error) {
			console.error("Error generating screenshot:", error);
			toast.error(
				error.message || "Failed to generate screenshot. Please try again."
			);
		} finally {
			setIsScreenshotLoading(false);
		}
	};

	// Add screenshot to canvas
	const handleAddScreenshotToCanvas = () => {
		if (!screenshotImage) return;

		// Create a temporary image to get dimensions
		const img = new Image();
		img.crossOrigin = "anonymous"; // Handle CORS for external images
		img.onload = () => {
			const newImage = {
				id: Date.now() + Math.random(),
				src: screenshotImage, // This is now a URL, not base64
				x: 50, // Center
				y: 50, // Center
				width: Math.min(img.width, 600), // Limit max width
				height: Math.min(img.height, 400), // Limit max height
				styles: {
					objectFit: "contain",
					opacity: 1,
					shadow: "none",
					ringWidth: 0,
					ringColor: "#000000",
					borderRadius: 0,
					borderWidth: 0,
					borderColor: "#000000",
					borderStyle: "solid",
					zIndex: 2,
				},
			};

			setImages((prev) => [...prev, newImage]);
			setSelectedImage(newImage.id);
			setIsUrlScreenshotOpen(false);
			setUrlInput("");
			setScreenshotImage(null);
		};
		img.onerror = () => {
			toast.error("Failed to load screenshot image. Please try again.");
		};
		img.src = screenshotImage;
	};

	const blobToBase64 = (blob) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result;
				if (typeof result === "string") {
					const base64 = result.includes(",") ? result.split(",")[1] : result;
					resolve(base64);
				} else {
					reject(new Error("Failed to convert blob to base64"));
				}
			};
			reader.onerror = () => reject(new Error("Failed to read blob data"));
			reader.readAsDataURL(blob);
		});

	const isGeneratingVariants =
		generateImprovedImages.isPending || generateImprovedImages.isLoading;

	const handleGenerateAIVariants = async () => {
		if (isGeneratingVariants) return;
		if (!improvementPrompt.trim()) {
			toast.error("Add a prompt so Mystic AI knows what to remix.");
			return;
		}
		if (!previewRef.current) {
			toast.error("Preview canvas is not ready yet.");
			return;
		}

		try {
			setGeneratedImages([]);
			setVariantNotes([]);
			const rasterBlob = await downloadRaster("png", previewFrameSize, {
				returnBlob: true,
			});
			const imageBase64 = await blobToBase64(rasterBlob);
			await generateImprovedImages.mutateAsync({
				imageBase64,
				prompt: improvementPrompt.trim(),
				ast: designAst,
				variantCount: 3,
			});
		} catch (error) {
			console.error("Freepik generation failed:", error);
			toast.error(
				error?.message ||
					"Freepik Mystic couldn't finish the request. Please try again."
			);
		}
	};

	const handleAddVariantToCanvas = (imageSrc) => {
		if (!imageSrc) return;
		const img = new Image();
		img.onload = () => {
			const newImage = {
				id: Date.now() + Math.random(),
				src: imageSrc,
				x: 50,
				y: 50,
				width: Math.min(img.width, gradient.dimensions.width),
				height: Math.min(img.height, gradient.dimensions.height),
				styles: {
					objectFit: "cover",
					opacity: 1,
					shadow: "none",
					ringWidth: 0,
					ringColor: "#000000",
					borderRadius: 24,
					borderWidth: 0,
					borderColor: "#000000",
					borderStyle: "solid",
					zIndex: 3,
				},
			};

			setImages((prev) => [...prev, newImage]);
			setSelectedImage(newImage.id);
			toast.success("Variant added to the canvas.");
		};
		img.onerror = () => {
			toast.error("Unable to load the generated variant. Please try again.");
		};
		img.src = imageSrc;
	};

	// Sync modal with current frame size when opened or when frame size changes
	useEffect(() => {
		if (isModalOpen) {
			// Ensure modal reflects the current frame size
			const frame = previewFramePresets[previewFrameSize];
			if (frame) {
				setGradient((prev) => {
					// Only update if dimensions don't match
					if (
						prev.dimensions.width !== frame.width ||
						prev.dimensions.height !== frame.height
					) {
						return {
							...prev,
							dimensions: {
								width: frame.width,
								height: frame.height,
							},
						};
					}
					return prev;
				});
			}
		}
	}, [isModalOpen, previewFrameSize]);

	// Cookie utilities for history storage
	const saveHistoryToCookie = useCallback((historyData) => {
		try {
			const cookieValue = JSON.stringify(historyData);
			document.cookie = `gradientHistory=${encodeURIComponent(
				cookieValue
			)}; path=/; max-age=86400`; // 24 hours
		} catch (error) {
			console.error("Failed to save history to cookie:", error);
		}
	}, []);

	const loadHistoryFromCookie = useCallback(() => {
		try {
			const cookies = document.cookie.split(";");
			const historyCookie = cookies.find((cookie) =>
				cookie.trim().startsWith("gradientHistory=")
			);
			if (historyCookie) {
				const cookieValue = decodeURIComponent(historyCookie.split("=")[1]);
				return JSON.parse(cookieValue);
			}
		} catch (error) {
			console.error("Failed to load history from cookie:", error);
		}
		return [];
	}, []);

	// Track if we should save to history (skip during undo/redo)
	const isUndoRedoRef = useRef(false);

	// Function to get full application state
	const getFullState = useCallback(() => {
		return {
			gradient: JSON.parse(JSON.stringify(gradient)),
			images: JSON.parse(JSON.stringify(images)),
			videos: JSON.parse(JSON.stringify(videos)),
			texts: JSON.parse(JSON.stringify(texts)),
			icons: JSON.parse(JSON.stringify(icons)),
			shapes: JSON.parse(JSON.stringify(shapes)),
			backgroundImage: backgroundImage || null,
			backgroundShapeRects: JSON.parse(
				JSON.stringify(backgroundShapeRects || [])
			),
		};
	}, [
		gradient,
		images,
		videos,
		texts,
		icons,
		shapes,
		backgroundImage,
		backgroundShapeRects,
	]);

	const saveFrameState = useCallback(
		async (projectId, { createNew = false } = {}) => {
			if (!projectId || !isAuthenticated || !user?.uid) {
				return null;
			}

			try {
				const shouldUseLocalFrames =
					projectId === currentProjectId || projectId === projectIdFromUrl;
				const referenceFrames = shouldUseLocalFrames ? framesList : [];
				const hasActiveFrame = shouldUseLocalFrames && activeFrameId;

				const framePayload = {
					...getFullState(),
					updatedAt: new Date().toISOString(),
				};
				const framesRef = collection(
					db,
					"users",
					user.uid,
					"kixi-projects",
					projectId,
					"frames"
				);

				if (createNew || !hasActiveFrame) {
					const nextFrameNumber =
						referenceFrames.reduce(
							(max, frame) => Math.max(max, frame.frameNumber || 0),
							0
						) + 1;

					const newFrameDoc = await addDoc(framesRef, {
						...framePayload,
						name: `Frame ${nextFrameNumber}`,
						frameNumber: nextFrameNumber,
						createdAt: new Date().toISOString(),
					});
					setActiveFrameId(newFrameDoc.id);
					updateFrameQueryParam(newFrameDoc.id);
					await refetchFrames();
					return { frameId: newFrameDoc.id, frameNumber: nextFrameNumber };
				}

				const frameRef = doc(
					db,
					"users",
					user.uid,
					"kixi-projects",
					projectId,
					"frames",
					activeFrameId
				);
				await setDoc(frameRef, framePayload, { merge: true });
				await refetchFrames();
				return { frameId: activeFrameId };
			} catch (error) {
				console.error("Error saving frame:", error);
				throw error;
			}
		},
		[
			activeFrameId,
			framesList,
			getFullState,
			isAuthenticated,
			currentProjectId,
			projectIdFromUrl,
			refetchFrames,
			user?.uid,
			updateFrameQueryParam,
		]
	);

	const publishFramesHtml = useCallback(
		async (projectId, publishedDocId, options = {}) => {
			if (!projectId || !publishedDocId || !isAuthenticated || !user?.uid) {
				return;
			}

			const { frameId: frameIdToSync } = options;

			try {
				const projectFramesRef = collection(
					db,
					"users",
					user.uid,
					"kixi-projects",
					projectId,
					"frames"
				);
				const publishedFramesRef = collection(
					db,
					"published-projects",
					publishedDocId,
					"frames"
				);

				let framesToPublish = [];

				if (frameIdToSync) {
					const sourceFrameRef = doc(projectFramesRef, frameIdToSync);
					const sourceFrameDoc = await getDoc(sourceFrameRef);

					if (!sourceFrameDoc.exists()) {
						return;
					}

					framesToPublish = [
						{
							id: sourceFrameDoc.id,
							data: sourceFrameDoc.data(),
						},
					];
				} else {
					const [projectFramesSnapshot, publishedFramesSnapshot] =
						await Promise.all([
							getDocs(projectFramesRef),
							getDocs(publishedFramesRef),
						]);

					if (!publishedFramesSnapshot.empty) {
						await Promise.all(
							publishedFramesSnapshot.docs.map((frameDoc) =>
								deleteDoc(frameDoc.ref)
							)
						);
					}

					if (projectFramesSnapshot.empty) {
						return;
					}

					framesToPublish = projectFramesSnapshot.docs.map((frameDoc) => ({
						id: frameDoc.id,
						data: frameDoc.data(),
					}));
				}

				await Promise.all(
					framesToPublish.map(({ id, data }) => {
						const destinationRef = doc(publishedFramesRef, id);
						const htmlContent = generateFrameHTML(data);
						const payload = {
							htmlContent,
							name: data.name || id,
							frameNumber: data.frameNumber ?? null,
							updatedAt: new Date().toISOString(),
						};

						if (data.createdAt) {
							payload.createdAt = data.createdAt;
						}

						return setDoc(destinationRef, payload, { merge: true });
					})
				);
			} catch (error) {
				console.error("Error publishing frame HTML:", error);
				throw error;
			}
		},
		[generateFrameHTML, isAuthenticated, user?.uid]
	);

	const handleAddFrame = async () => {
		if (!isAuthenticated || !user?.uid) {
			toast.error("Please sign in to add frames");
			return;
		}

		const targetProjectId = currentProjectId || projectIdFromUrl;
		if (!targetProjectId) {
			toast.error("Save your project before adding frames");
			return;
		}

		try {
			setIsFrameActionLoading(true);
			const result = await saveFrameState(targetProjectId, { createNew: true });
			const frameLabel = result?.frameNumber
				? `Frame ${result.frameNumber}`
				: "Frame";
			toast.success(`${frameLabel} created`);
		} catch (error) {
			console.error("Error creating frame:", error);
			toast.error("Failed to create frame. Please try again.");
		} finally {
			setIsFrameActionLoading(false);
		}
	};

	const handleDeleteFrame = async (frameId = activeFrameId) => {
		if (!isAuthenticated || !user?.uid) {
			toast.error("Please sign in to delete frames");
			return;
		}

		const targetProjectId = currentProjectId || projectIdFromUrl;
		if (!targetProjectId || !frameId) {
			toast.error("Select a frame before deleting");
			return;
		}

		try {
			setIsFrameActionLoading(true);
			const wasActive = frameId === activeFrameId;
			const frameRef = doc(
				db,
				"users",
				user.uid,
				"kixi-projects",
				targetProjectId,
				"frames",
				frameId
			);
			await deleteDoc(frameRef);
			if (wasActive) {
				setActiveFrameId(null);
				updateFrameQueryParam(null);
			}
			await refetchFrames();
			toast.success("Frame deleted");
		} catch (error) {
			console.error("Error deleting frame:", error);
			toast.error("Failed to delete frame. Please try again.");
		} finally {
			setIsFrameActionLoading(false);
		}
	};

	// Save current frame to Firestore
	const handleSaveProject = async () => {
		if (!isAuthenticated || !user?.uid) {
			toast.error("Please sign in to save your project");
			return;
		}

		setIsSaving(true);
		try {
			const baseProjectData = {
				name: projectName,
				gradient,
				images,
				texts,
				videos,
				shapes,
				icons,
				updatedAt: new Date().toISOString(),
			};

			let savedProjectId = currentProjectId;

			if (currentProjectId) {
				// Update existing project - don't include createdAt
				const projectRef = doc(
					db,
					"users",
					user.uid,
					"kixi-projects",
					currentProjectId
				);
				await updateDoc(projectRef, baseProjectData);
			} else {
				// Create new project - include createdAt
				const projectData = {
					...baseProjectData,
					createdAt: new Date().toISOString(),
				};
				const projectsRef = collection(db, "users", user.uid, "kixi-projects");
				const docRef = await addDoc(projectsRef, projectData);
				savedProjectId = docRef.id;
				setCurrentProjectId(docRef.id);
				router.push(`/app?projectId=${docRef.id}`, undefined, {
					shallow: true,
				});
			}

			const targetProjectId =
				savedProjectId || currentProjectId || projectIdFromUrl;
			if (targetProjectId) {
				try {
					await saveFrameState(targetProjectId);
				} catch (frameError) {
					console.error("Error saving frame state:", frameError);
					toast.error("Project saved, but frame sync failed. Please retry.");
				}
			}

			// If project is already published, update the published version as well
			if (publicDocId && savedProjectId) {
				try {
					// Generate updated HTML content
					const htmlContent = generateHTML();

					// Update published project
					const publishedDocRef = doc(db, "published-projects", publicDocId);
					await updateDoc(publishedDocRef, {
						publicHtmlContent: htmlContent,
						projectName: projectName,
						updatedAt: new Date().toISOString(),
					});
					const frameIdForSync = frameIdFromUrl || activeFrameId || null;
					await publishFramesHtml(savedProjectId, publicDocId, {
						frameId: frameIdForSync,
					});
				} catch (publishError) {
					console.error("Error updating published project:", publishError);
					// Don't fail the save if publish update fails, just log it
				}
			}

			await queryClient.invalidateQueries(["projects", user?.uid]);

			// Reset unsaved changes tracking
			lastSavedStateRef.current = JSON.stringify({
				gradient,
				images,
				videos,
				texts,
				icons,
				shapes,
				backgroundImage,
				backgroundShapeRects,
			});
			setHasUnsavedChanges(false);

			// Clear auto-save timeout since we just saved
			if (autoSaveTimeoutRef.current) {
				clearTimeout(autoSaveTimeoutRef.current);
				autoSaveTimeoutRef.current = null;
			}

			setCopied("saved");
			setTimeout(() => setCopied(""), 2000);
		} catch (error) {
			console.error("Error saving project:", error);
			toast.error("Failed to save project. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	// Keep ref updated for auto-save
	handleSaveProjectRef.current = handleSaveProject;

	// Load history from cookies on mount
	useEffect(() => {
		const savedHistory = loadHistoryFromCookie();
		if (savedHistory.length > 0) {
			// Migrate old history format (only gradient) to new format (full state)
			const migratedHistory = savedHistory.map((state) => {
				if (state.images === undefined) {
					// Old format - only gradient
					return {
						gradient: state.gradient || state,
						images: state.images || [],
						videos: state.videos || [],
						texts: state.texts || [],
						icons: state.icons || [],
						shapes: state.shapes || [],
					};
				}
				return state;
			});
			setHistory(migratedHistory);
			setHistoryIndex(migratedHistory.length - 1);
		} else {
			// Initialize with current state - use a timeout to ensure all state is initialized
			setTimeout(() => {
				const initialState = getFullState();
				setHistory([initialState]);
				setHistoryIndex(0);
				saveHistoryToCookie([initialState]);
			}, 100);
		}
	}, []); // Only run on mount

	// Save state to history
	const saveToHistory = useCallback(
		(newState) => {
			if (isUndoRedoRef.current) {
				isUndoRedoRef.current = false;
				return;
			}

			setHistory((prevHistory) => {
				// Get current index
				const currentIndex = historyIndex;

				// Remove any future history if we're not at the end
				const trimmedHistory =
					currentIndex < prevHistory.length - 1
						? prevHistory.slice(0, currentIndex + 1)
						: prevHistory;

				// Add new state
				const newHistory = [...trimmedHistory, newState];

				// Keep only last MAX_HISTORY states
				const limitedHistory =
					newHistory.length > MAX_HISTORY
						? newHistory.slice(-MAX_HISTORY)
						: newHistory;

				// Save to cookie
				saveHistoryToCookie(limitedHistory);

				// Update index
				const newIndex = limitedHistory.length - 1;
				setHistoryIndex(newIndex);

				return limitedHistory;
			});
		},
		[historyIndex, saveHistoryToCookie]
	);

	// Undo function
	const undo = useCallback(() => {
		if (historyIndex > 0) {
			isUndoRedoRef.current = true;
			const newIndex = historyIndex - 1;
			const stateToRestore = history[newIndex];
			setHistoryIndex(newIndex);

			// Restore all states
			if (stateToRestore.gradient) {
				setGradient(JSON.parse(JSON.stringify(stateToRestore.gradient)));
			}
			if (stateToRestore.images !== undefined) {
				setImages(JSON.parse(JSON.stringify(stateToRestore.images)));
			}
			if (stateToRestore.videos !== undefined) {
				setVideos(JSON.parse(JSON.stringify(stateToRestore.videos)));
			}
			if (stateToRestore.texts !== undefined) {
				setTexts(JSON.parse(JSON.stringify(stateToRestore.texts)));
			}
			if (stateToRestore.icons !== undefined) {
				setIcons(JSON.parse(JSON.stringify(stateToRestore.icons)));
			}
			if (stateToRestore.shapes !== undefined) {
				setShapes(JSON.parse(JSON.stringify(stateToRestore.shapes)));
			}
			if (stateToRestore.backgroundImage !== undefined) {
				setBackgroundImage(stateToRestore.backgroundImage || null);
			}
			if (stateToRestore.backgroundShapeRects !== undefined) {
				setBackgroundShapeRects(
					JSON.parse(JSON.stringify(stateToRestore.backgroundShapeRects || []))
				);
			}
		}
	}, [history, historyIndex]);

	// Redo function
	const redo = useCallback(() => {
		if (historyIndex < history.length - 1) {
			isUndoRedoRef.current = true;
			const newIndex = historyIndex + 1;
			const stateToRestore = history[newIndex];
			setHistoryIndex(newIndex);

			// Restore all states
			if (stateToRestore.gradient) {
				setGradient(JSON.parse(JSON.stringify(stateToRestore.gradient)));
			}
			if (stateToRestore.images !== undefined) {
				setImages(JSON.parse(JSON.stringify(stateToRestore.images)));
			}
			if (stateToRestore.videos !== undefined) {
				setVideos(JSON.parse(JSON.stringify(stateToRestore.videos)));
			}
			if (stateToRestore.texts !== undefined) {
				setTexts(JSON.parse(JSON.stringify(stateToRestore.texts)));
			}
			if (stateToRestore.icons !== undefined) {
				setIcons(JSON.parse(JSON.stringify(stateToRestore.icons)));
			}
			if (stateToRestore.shapes !== undefined) {
				setShapes(JSON.parse(JSON.stringify(stateToRestore.shapes)));
			}
			if (stateToRestore.backgroundImage !== undefined) {
				setBackgroundImage(stateToRestore.backgroundImage || null);
			}
			if (stateToRestore.backgroundShapeRects !== undefined) {
				setBackgroundShapeRects(
					JSON.parse(JSON.stringify(stateToRestore.backgroundShapeRects || []))
				);
			}
		}
	}, [history, historyIndex]);

	// Keyboard shortcut handler for undo (CMD+Z or CTRL+Z)
	useEffect(() => {
		const handleKeyDown = (e) => {
			// Check for CMD+Z (Mac) or CTRL+Z (Windows/Linux)
			if (
				(e.metaKey || e.ctrlKey) &&
				e.key === "z" &&
				!e.shiftKey &&
				!e.altKey
			) {
				e.preventDefault();
				undo();
			}
			// Redo: CMD+SHIFT+Z or CTRL+SHIFT+Z
			if (
				(e.metaKey || e.ctrlKey) &&
				e.key === "z" &&
				e.shiftKey &&
				!e.altKey
			) {
				e.preventDefault();
				redo();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [undo, redo]);

	// Save full state to history when any part changes (debounced)
	const isInitialMount = useRef(true);
	const saveTimeoutRef = useRef(null);
	const previousStateRef = useRef(null);

	// Single useEffect to track all state changes
	useEffect(() => {
		// Skip saving on initial mount
		if (isInitialMount.current) {
			isInitialMount.current = false;
			previousStateRef.current = getFullState();
			return;
		}

		// Skip if this is an undo/redo operation
		if (isUndoRedoRef.current) {
			isUndoRedoRef.current = false;
			previousStateRef.current = getFullState();
			return;
		}

		// Clear existing timeout
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}

		// Debounce: save 500ms after last change
		saveTimeoutRef.current = setTimeout(() => {
			const currentFullState = getFullState();
			const currentStateString = JSON.stringify(currentFullState);
			const lastSavedState =
				history.length > 0 && historyIndex >= 0
					? JSON.stringify(history[historyIndex])
					: null;

			// Only save if state actually changed
			if (lastSavedState && currentStateString !== lastSavedState) {
				saveToHistory(currentFullState);
				previousStateRef.current = currentFullState;
			} else if (!lastSavedState) {
				// First save
				saveToHistory(currentFullState);
				previousStateRef.current = currentFullState;
			}
		}, 500);

		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, [
		gradient,
		images,
		videos,
		texts,
		icons,
		shapes,
		history,
		historyIndex,
		getFullState,
		saveToHistory,
	]);

	// Track unsaved changes and auto-save with debouncing
	const getCanvasState = useCallback(() => {
		return JSON.stringify({
			gradient,
			images,
			videos,
			texts,
			icons,
			shapes,
			backgroundImage,
			backgroundShapeRects,
		});
	}, [
		gradient,
		images,
		videos,
		texts,
		icons,
		shapes,
		backgroundImage,
		backgroundShapeRects,
	]);

	// Detect changes and mark as unsaved
	useEffect(() => {
		// Skip if not authenticated or no project
		if (!isAuthenticated || !currentProjectId) return;

		const currentState = getCanvasState();

		// Initialize last saved state if not set
		if (lastSavedStateRef.current === null) {
			lastSavedStateRef.current = currentState;
			return;
		}

		// Compare current state with last saved state
		if (currentState !== lastSavedStateRef.current) {
			setHasUnsavedChanges(true);

			// Clear existing auto-save timeout
			if (autoSaveTimeoutRef.current) {
				clearTimeout(autoSaveTimeoutRef.current);
			}

			// Set new auto-save timeout (45 seconds of inactivity)
			autoSaveTimeoutRef.current = setTimeout(() => {
				// Only auto-save if there are unsaved changes and user is authenticated
				if (handleSaveProjectRef.current) {
					handleSaveProjectRef.current();
				}
			}, 45000); // 45 seconds
		}

		return () => {
			if (autoSaveTimeoutRef.current) {
				clearTimeout(autoSaveTimeoutRef.current);
			}
		};
	}, [getCanvasState, isAuthenticated, currentProjectId]);

	// Reset unsaved changes when project changes (loading a different project)
	useEffect(() => {
		if (currentProjectId) {
			// Give a small delay for state to settle after loading
			const timer = setTimeout(() => {
				lastSavedStateRef.current = getCanvasState();
				setHasUnsavedChanges(false);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [currentProjectId]);

	// Warn user before leaving page with unsaved changes
	useEffect(() => {
		const handleBeforeUnload = (e) => {
			if (hasUnsavedChanges && isAuthenticated && currentProjectId) {
				e.preventDefault();
				e.returnValue =
					"You have unsaved changes. Are you sure you want to leave?";
				return e.returnValue;
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [hasUnsavedChanges, isAuthenticated, currentProjectId]);

	const { animation, backgroundAnimation } = useMemo(
		() => generateAnimationCSS(),
		[gradient]
	);
	const { containerStyle, overlayStyle } = useMemo(
		() => getModalStyles(),
		[gradient, isPlaying]
	);

	// Handle click outside download dropdown

	// Handle click outside generate code dropdown

	// Keyboard shortcuts for adding elements
	useEffect(() => {
		const handleKeyDown = (event) => {
			// Don't trigger shortcuts if user is typing in an input, textarea, or when AI chat is open
			const target = event.target;
			const isTyping =
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable ||
				isAIChatOpen;

			if (isTyping) {
				return;
			}

			// Check if modifier keys are pressed (we want pure key presses)
			if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
				return;
			}

			const key = event.key.toLowerCase();

			// Handle Delete and Backspace keys for removing selected elements
			if (key === "delete" || key === "backspace") {
				if (selectedImage) {
					event.preventDefault();
					removeImage(selectedImage);
				} else if (selectedVideo) {
					event.preventDefault();
					removeVideo(selectedVideo);
				} else if (selectedText) {
					event.preventDefault();
					removeText(selectedText);
				} else if (selectedBackgroundShapeRect) {
					event.preventDefault();
					removeBackgroundShapeRect(selectedBackgroundShapeRect);
				} else if (selectedShape) {
					event.preventDefault();
					removeShape(selectedShape);
				}
				return;
			}

			switch (key) {
				case "r":
					// Add rectangle
					event.preventDefault();
					addShape("rectangle");
					break;
				case "s":
					// Add square
					event.preventDefault();
					addShape("square");
					break;
				case "i":
					// Add image
					event.preventDefault();
					fileInputRef.current?.click();
					break;
				case "v":
					// Add video (only if not in scaling mode)
					if (!isScalingMode) {
						event.preventDefault();
						videoInputRef.current?.click();
					}
					break;
				case "l":
					// Add line
					event.preventDefault();
					addShape("line");
					break;
				case "a":
					// Add text
					event.preventDefault();
					addText();
					break;
				case "t":
					// Add text (changed from triangle)
					if (event.shiftKey) {
						// Shift+T for triangle
						event.preventDefault();
						addShape("triangle");
					} else {
						// T for text
						event.preventDefault();
						addText();
					}
					break;
				case "k":
					// Toggle scaling mode
					event.preventDefault();
					setIsScalingMode((prev) => !prev);
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		addShape,
		addText,
		isAIChatOpen,
		selectedImage,
		selectedVideo,
		selectedText,
		selectedShape,
		removeImage,
		removeVideo,
		removeText,
		removeShape,
		isScalingMode,
	]);

	// Scaling functionality with K key and V hover
	useEffect(() => {
		if (!isScalingMode) return;

		let lastScaleTime = 0;
		const scaleInterval = 50; // Scale every 50ms to prevent too aggressive scaling

		const handleMouseMove = (e) => {
			const now = Date.now();
			if (now - lastScaleTime < scaleInterval) return;
			lastScaleTime = now;

			// Check if hovering over V key area (bottom left area of screen)
			const screenHeight = window.innerHeight;
			const screenWidth = window.innerWidth;
			const vKeyArea = {
				// V key is typically in the bottom left area
				x: screenWidth * 0.05, // 5% from left
				y: screenHeight * 0.88, // 88% from top
				width: screenWidth * 0.12, // 12% width
				height: screenHeight * 0.08, // 8% height
			};

			const isHoveringV =
				e.clientX >= vKeyArea.x &&
				e.clientX <= vKeyArea.x + vKeyArea.width &&
				e.clientY >= vKeyArea.y &&
				e.clientY <= vKeyArea.y + vKeyArea.height;

			if (isHoveringV) {
				// Scale down selected elements
				const scaleFactor = 0.98; // Scale down by 2% each interval (less aggressive)
				const isEqual = !e.shiftKey; // Shift key for unequal scaling

				// Scale selected images
				selectedImages.forEach((id) => {
					const img = images.find((i) => i.id === id);
					if (img) {
						const newWidth = img.width * scaleFactor;
						const newHeight = isEqual
							? img.height * scaleFactor
							: img.height * (scaleFactor * 0.9); // Unequal scaling
						updateImage(id, {
							width: Math.max(20, newWidth),
							height: Math.max(20, newHeight),
						});
					}
				});

				// Scale selected videos
				selectedVideos.forEach((id) => {
					const vid = videos.find((v) => v.id === id);
					if (vid) {
						const newWidth = vid.width * scaleFactor;
						const newHeight = isEqual
							? vid.height * scaleFactor
							: vid.height * (scaleFactor * 0.9);
						updateVideo(id, {
							width: Math.max(20, newWidth),
							height: Math.max(20, newHeight),
						});
					}
				});

				// Scale selected texts
				selectedTexts.forEach((id) => {
					const txt = texts.find((t) => t.id === id);
					if (txt) {
						const newWidth = txt.width * scaleFactor;
						const newHeight = isEqual
							? txt.height * scaleFactor
							: txt.height * (scaleFactor * 0.9);
						updateText(id, {
							width: Math.max(50, newWidth),
							height: Math.max(20, newHeight),
						});
					}
				});

				// Scale selected icons
				selectedIcons.forEach((id) => {
					const icon = icons.find((i) => i.id === id);
					if (icon) {
						const newWidth = icon.width * scaleFactor;
						const newHeight = isEqual
							? icon.height * scaleFactor
							: icon.height * (scaleFactor * 0.9);
						updateIcon(id, {
							width: Math.max(20, newWidth),
							height: Math.max(20, newHeight),
						});
					}
				});

				// Also handle single selections
				if (selectedImage) {
					const img = images.find((i) => i.id === selectedImage);
					if (img) {
						const newWidth = img.width * scaleFactor;
						const newHeight = isEqual
							? img.height * scaleFactor
							: img.height * (scaleFactor * 0.9);
						updateImage(selectedImage, {
							width: Math.max(20, newWidth),
							height: Math.max(20, newHeight),
						});
					}
				}
				if (selectedVideo) {
					const vid = videos.find((v) => v.id === selectedVideo);
					if (vid) {
						const newWidth = vid.width * scaleFactor;
						const newHeight = isEqual
							? vid.height * scaleFactor
							: vid.height * (scaleFactor * 0.9);
						updateVideo(selectedVideo, {
							width: Math.max(20, newWidth),
							height: Math.max(20, newHeight),
						});
					}
				}
				if (selectedText) {
					const txt = texts.find((t) => t.id === selectedText);
					if (txt) {
						const newWidth = txt.width * scaleFactor;
						const newHeight = isEqual
							? txt.height * scaleFactor
							: txt.height * (scaleFactor * 0.9);
						updateText(selectedText, {
							width: Math.max(50, newWidth),
							height: Math.max(20, newHeight),
						});
					}
				}
				if (selectedIcon) {
					const icon = icons.find((i) => i.id === selectedIcon);
					if (icon) {
						const newWidth = icon.width * scaleFactor;
						const newHeight = isEqual
							? icon.height * scaleFactor
							: icon.height * (scaleFactor * 0.9);
						updateIcon(selectedIcon, {
							width: Math.max(20, newWidth),
							height: Math.max(20, newHeight),
						});
					}
				}
			}
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [
		isScalingMode,
		selectedImages,
		selectedVideos,
		selectedTexts,
		selectedIcons,
		selectedImage,
		selectedVideo,
		selectedText,
		selectedIcon,
		images,
		videos,
		texts,
		icons,
		updateImage,
		updateVideo,
		updateText,
		updateIcon,
	]);

	// Calculate modal preview dimensions based on frame size
	const modalDimensions = useMemo(() => {
		const { width: frameWidth, height: frameHeight } = gradient.dimensions;
		const aspectRatio = frameWidth / frameHeight;

		// Use CSS to size based on aspect ratio
		// For landscape/square: prioritize width constraint
		// For portrait: prioritize height constraint
		if (aspectRatio >= 1) {
			// Landscape or square - set width and let aspectRatio handle height
			return {
				width: "90vw",
				maxWidth: "90vw",
				maxHeight: "90vh",
			};
		} else {
			// Portrait - set height and let aspectRatio handle width
			return {
				height: "90vh",
				maxWidth: "90vw",
				maxHeight: "90vh",
			};
		}
	}, [gradient.dimensions, previewFrameSize]);

	// Right-click context menu handler
	const handleControlPanelContextMenu = (e) => {
		e.preventDefault();
		setContextMenu({
			isOpen: true,
			position: { x: e.clientX, y: e.clientY },
		});
	};

	return (
		<EditorProvider
			value={{
				isAuthenticated,
				currentProjectId,
				publicDocId,
				isSaving,
				hasUnsavedChanges,
				isPublishing,
			}}
		>
			<div className="min-h-screen bg-stone-50/50">
				{isSmallDeviceModalOpen && (
					<div className="fixed inset-0 z-[20000] flex items-center justify-center p-6 bg-white/95 backdrop-blur-lg">
						<div className="max-w-sm w-full bg-white border border-zinc-200 rounded-2xl shadow-2xl p-6 text-center space-y-4">
							<div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center">
								<AlertTriangle className="w-8 h-8 text-amber-500" />
							</div>
							<div className="space-y-2">
								<h2 className="text-xl font-semibold text-zinc-900">
									Designed for larger screens
								</h2>
								<p className="text-sm text-zinc-600">
									The full Kixi editor needs tablet or desktop resolution to run
									smoothly. Please switch to a bigger display—we’ll ship a
									mobile version soon.
								</p>
							</div>
						</div>
					</div>
				)}
				<div
					className="fixed top-0 left-0 right-0 h-full opacity-20 z-0"
					style={{
						backgroundImage:
							"radial-gradient(circle, #d1d5db 1.5px, transparent 1.5px)",
						backgroundSize: "20px 20px",
					}}
				/>

				<div className="flex">
					{/* Sidebar */}
					<Sidebar
						isSidebarDrawerOpen={isSidebarDrawerOpen}
						setIsProjectModalOpen={setIsProjectModalOpen}
						isAuthenticated={isAuthenticated}
						isLoadingProjects={isLoadingProjects}
						projects={projects}
						handleNewProject={handleNewProject}
						currentProjectId={currentProjectId}
						loadProject={loadProject}
						router={router}
						editingProjectId={editingProjectId}
						editingProjectName={editingProjectName}
						setEditingProjectName={setEditingProjectName}
						handleRenameProject={handleRenameProject}
						setEditingProjectId={setEditingProjectId}
						handleDeleteProject={handleDeleteProject}
						images={images}
						videos={videos}
						texts={texts}
						shapes={shapes}
						icons={icons}
						backgroundShapeRects={backgroundShapeRects}
						handleUpdateZIndex={handleUpdateZIndex}
						selectedImage={selectedImage}
						selectedVideo={selectedVideo}
						selectedText={selectedText}
						selectedShape={selectedShape}
						selectedIcon={selectedIcon}
						selectedBackgroundShapeRect={selectedBackgroundShapeRect}
						handleLayerSelect={handleLayerSelect}
						handleDeleteLayer={handleDeleteLayer}
						keyboardShortcutsRef={keyboardShortcutsRef}
						isKeyboardShortcutsOpen={isKeyboardShortcutsOpen}
						setIsKeyboardShortcutsOpen={setIsKeyboardShortcutsOpen}
						setIsOpenAboutModal={setIsOpenAboutModal}
						isReleasesModalOpen={isReleasesModalOpen}
						setIsReleasesModalOpen={setIsReleasesModalOpen}
					/>

					{/* Main Content */}
					<div className="flex-1 p-4">
						<style jsx>{`
							.slider::-webkit-slider-thumb {
								appearance: none;
								height: 16px;
								width: 16px;
								border-radius: 50%;
								background: #71717a;
								cursor: pointer;
								border: 2px solid #ffffff;
								box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
							}
							.slider::-moz-range-thumb {
								height: 16px;
								width: 16px;
								border-radius: 50%;
								background: #71717a;
								cursor: pointer;
								border: 2px solid #ffffff;
								box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
							}

							/* Simple animations for modal */
							@keyframes slideRight {
								0% {
									background-position: 0% 0%;
								}
								100% {
									background-position: 100% 0%;
								}
							}
							@keyframes slideLeft {
								0% {
									background-position: 100% 0%;
								}
								100% {
									background-position: 0% 0%;
								}
							}
							@keyframes slideUp {
								0% {
									background-position: 0% 100%;
								}
								100% {
									background-position: 0% 0%;
								}
							}
							@keyframes slideDown {
								0% {
									background-position: 0% 0%;
								}
								100% {
									background-position: 0% 100%;
								}
							}
							@keyframes wave {
								0% {
									background-position: 0% 0%;
								}
								25% {
									background-position: 100% 0%;
								}
								50% {
									background-position: 100% 100%;
								}
								75% {
									background-position: 0% 100%;
								}
								100% {
									background-position: 0% 0%;
								}
							}
						`}</style>
						<div className="max-w-7xl mx-auto relative">
							<div className="space-y-1 lg:pr-[100px] mt-16">
								{/* Frame Name Input */}
								{isAuthenticated && activeFrameId && (
									<div className="relative z-30 mb-2 flex justify-start items-center">
										{isEditingFrameName ? (
											<input
												type="text"
												value={editingFrameNameValue}
												onChange={(e) =>
													setEditingFrameNameValue(e.target.value)
												}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														handleRenameFrame(editingFrameNameValue);
													} else if (e.key === "Escape") {
														setIsEditingFrameName(false);
														setEditingFrameNameValue("");
													}
												}}
												autoFocus
												placeholder="Frame name..."
												className="px-3 py-1.5 text-xs bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 min-w-[160px]"
											/>
										) : (
											<button
												onClick={() => {
													setIsEditingFrameName(true);
													setEditingFrameNameValue(
														activeFrame?.name ||
															`Frame ${activeFrame?.frameNumber || 1}`
													);
												}}
												className="px-3 py-1.5 text-xs font-medium bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center gap-2"
												title="Click to rename frame"
											>
												<span className="text-zinc-700 truncate max-w-[200px]">
													{activeFrame?.name ||
														`Frame ${activeFrame?.frameNumber || 1}`}
												</span>
												<PenTool01Icon className="w-3.5 h-3.5 text-zinc-400" />
											</button>
										)}
									</div>
								)}
								<div className="bg-white rounded-xl relative">
									{/* Immediate parent container of previewRef with zoom transform */}
									<div
										className="flex justify-center items-center w-full overflow-hidden"
										style={{
											transform: `scale(${previewZoom})`,
											transformOrigin: "center center",
										}}
									>
										<div
											ref={previewRef}
											className="relative rounded-xl overflow-hidden cursor-crosshair border border-zinc-100"
											style={{
												...(gradient.dimensions.width <= 500 &&
												gradient.dimensions.height <= 500
													? {
															width: `${gradient.dimensions.width}px`,
															height: `${gradient.dimensions.height}px`,
														}
													: {
															aspectRatio: `${gradient.dimensions.width} / ${gradient.dimensions.height}`,
															width: "100%",
															maxWidth: "100%",
														}),
												// Calculate maxHeight based on aspect ratio: for portrait frames, allow more height
												maxHeight:
													gradient.dimensions.height > gradient.dimensions.width
														? "90vh" // Portrait frames get more vertical space
														: "600px", // Landscape frames limited to 600px
												// Always show gradient background (not image unless explicitly set)
												...(backgroundImage
													? {
															backgroundImage: `url(${backgroundImage})`,
															backgroundSize: "cover",
															backgroundPosition: "center",
															backgroundRepeat: "no-repeat",
														}
													: {
															background: generateGradientCSS(),
															...(isPlaying &&
																gradient.backgroundAnimation.enabled && {
																	backgroundSize: "200% 200%",
																}),
														}),
												...(isPlaying &&
													!backgroundImage &&
													backgroundAnimation && {
														animation: backgroundAnimation,
													}),
											}}
											onClick={(e) => {
												// Deselect images, texts, videos, shapes, icons, background shape rects, and gradient stops when clicking on canvas
												if (
													e.target === previewRef.current ||
													e.target.parentElement === previewRef.current
												) {
													setSelectedImage(null);
													setSelectedText(null);
													setSelectedVideo(null);
													setSelectedShape(null);
													setSelectedIcon(null);
													setSelectedBackgroundShapeRect(null);
													setSelectedStop(null);
													setAlignmentGuides({ horizontal: [], vertical: [] });
												}
											}}
										>
											{/* Element Animation Overlay */}
											<div
												className="absolute inset-0"
												style={{
													...(isPlaying && animation && { animation }),
												}}
											/>

											{/* Alignment Guides */}
											{(alignmentGuides.horizontal.length > 0 ||
												alignmentGuides.vertical.length > 0) && (
												<div
													className="absolute inset-0 pointer-events-none"
													style={{ zIndex: 9999 }}
												>
													{/* Horizontal Guides */}
													{alignmentGuides?.horizontal?.map((guide, index) => (
														<div
															key={`h-${index}`}
															className="absolute left-0 right-0"
															style={{
																top: `${guide.position}px`,
																height: "1px",
																backgroundColor: "#3b82f6",
																opacity: 1,
																boxShadow:
																	"0 0 4px rgba(59, 130, 246, 0.8), 0 0 8px rgba(59, 130, 246, 0.4)",
															}}
														/>
													))}
													{/* Vertical Guides */}
													{alignmentGuides?.vertical?.map((guide, index) => (
														<div
															key={`v-${index}`}
															className="absolute top-0 bottom-0"
															style={{
																left: `${guide.position}px`,
																width: "1px",
																backgroundColor: "#3b82f6",
																opacity: 1,
																boxShadow:
																	"0 0 4px rgba(59, 130, 246, 0.8), 0 0 8px rgba(59, 130, 246, 0.4)",
															}}
														/>
													))}
												</div>
											)}

											{/* Background Shape Rectangles Layer */}
											{backgroundShapeRects.map((rect) => (
												<div
													key={rect.id}
													className={`absolute cursor-move ${
														selectedBackgroundShapeRect === rect.id
															? "ring-2 ring-orange-500"
															: "ring-2 ring-transparent"
													}`}
													style={{
														left: `${rect.x}%`,
														top: `${rect.y}%`,
														width: `${rect.width}px`,
														height: `${rect.height}px`,
														transform: `translate(-50%, -50%) rotate(${
															rect.styles?.rotation || 0
														}deg) skew(${rect.styles?.skewX || 0}deg, ${
															rect.styles?.skewY || 0
														}deg)`,
														zIndex: rect.styles?.zIndex || 1,
														opacity: rect.styles?.opacity || 1,
													}}
													onMouseDown={(e) => {
														e.stopPropagation();
														handleBackgroundShapeRectMouseDown(e, rect.id);
													}}
													onClick={(e) => {
														e.stopPropagation();
														setSelectedBackgroundShapeRect(rect.id);
														setSelectedImage(null);
														setSelectedText(null);
														setSelectedVideo(null);
														setSelectedShape(null);
														setSelectedIcon(null);
														setSelectedStop(null);
													}}
												>
													{/* Background Shape */}
													<BackgroundShape
														shapeId={rect.shapeId}
														scale={rect.scale}
														color="#000000"
													/>

													{/* Delete Button */}
													<div className="absolute -top-2 -right-2 flex gap-1">
														<button
															onClick={(e) => {
																e.stopPropagation();
																removeBackgroundShapeRect(rect.id);
															}}
															className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
															title="Delete background shape"
														>
															<X className="w-3 h-3" />
														</button>
													</div>

													{/* Resize Handles */}
													{selectedBackgroundShapeRect === rect.id && (
														<>
															{/* Corner handles */}
															<div
																className="absolute top-0 left-0 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-nwse-resize"
																onMouseDown={(e) =>
																	handleBackgroundShapeRectResizeStart(
																		e,
																		rect.id,
																		"nw"
																	)
																}
															/>
															<div
																className="absolute top-0 right-0 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-nesw-resize"
																onMouseDown={(e) =>
																	handleBackgroundShapeRectResizeStart(
																		e,
																		rect.id,
																		"ne"
																	)
																}
															/>
															<div
																className="absolute bottom-0 left-0 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-nesw-resize"
																onMouseDown={(e) =>
																	handleBackgroundShapeRectResizeStart(
																		e,
																		rect.id,
																		"sw"
																	)
																}
															/>
															<div
																className="absolute bottom-0 right-0 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-nwse-resize"
																onMouseDown={(e) =>
																	handleBackgroundShapeRectResizeStart(
																		e,
																		rect.id,
																		"se"
																	)
																}
															/>
															{/* Edge handles */}
															<div
																className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-ns-resize"
																onMouseDown={(e) =>
																	handleBackgroundShapeRectResizeStart(
																		e,
																		rect.id,
																		"n"
																	)
																}
															/>
															<div
																className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-ns-resize"
																onMouseDown={(e) =>
																	handleBackgroundShapeRectResizeStart(
																		e,
																		rect.id,
																		"s"
																	)
																}
															/>
															<div
																className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-ew-resize"
																onMouseDown={(e) =>
																	handleBackgroundShapeRectResizeStart(
																		e,
																		rect.id,
																		"w"
																	)
																}
															/>
															<div
																className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-ew-resize"
																onMouseDown={(e) =>
																	handleBackgroundShapeRectResizeStart(
																		e,
																		rect.id,
																		"e"
																	)
																}
															/>
														</>
													)}
												</div>
											))}

											{/* Text Layer */}
											{texts.map((text) => (
												<div
													key={text.id}
													className={`absolute ${
														selectedText === text.id
															? "ring-2 ring-zinc-500"
															: "ring-2 ring-transparent"
													}`}
													style={{
														left: `${text.x}%`,
														top: `${text.y}%`,
														width: `${text.width}px`,
														minHeight: `${text.height}px`,
														transform: `translate(-50%, -50%) rotate(${
															text.styles?.rotation || 0
														}deg) skew(${text.styles?.skewX || 0}deg, ${
															text.styles?.skewY || 0
														}deg)`,
														zIndex: text.styles?.zIndex || 2,
													}}
													onMouseDown={(e) => handleTextMouseDown(e, text.id)}
												>
													{/* Text Content */}
													{textEditing === text.id ? (
														<textarea
															value={text.content}
															onChange={(e) =>
																updateText(text.id, { content: e.target.value })
															}
															onBlur={() => setTextEditing(null)}
															onKeyDown={(e) => {
																if (e.key === "Enter" && e.shiftKey === false) {
																	e.preventDefault();
																	setTextEditing(null);
																}
															}}
															className="w-full resize-none outline-none bg-transparent text-center"
															style={{
																fontSize: `${text.styles?.fontSize || 24}px`,
																fontWeight: text.styles?.fontWeight || "normal",
																fontStyle: text.styles?.fontStyle || "normal",
																color: text.styles?.color || "#000000",
																textAlign: text.styles?.textAlign || "left",
																fontFamily: text.styles?.fontFamily || "Arial",
																backgroundColor:
																	text.styles?.backgroundColor === "transparent"
																		? "rgba(255, 255, 255, 0.8)"
																		: text.styles?.backgroundColor ||
																			"transparent",
																padding: `${text.styles?.padding || 0}px`,
																borderRadius:
																	text.styles?.borderRadius === 100
																		? "50%"
																		: `${text.styles?.borderRadius || 0}px`,
																borderWidth: `${text.styles?.borderWidth || 0}px`,
																borderColor:
																	text.styles?.borderColor || "#000000",
																borderStyle:
																	text.styles?.borderStyle || "solid",
																opacity:
																	text.styles?.opacity !== undefined
																		? text.styles.opacity
																		: 1,
																boxShadow: formatShadowCSS(text.styles?.shadow),
															}}
															autoFocus
														/>
													) : (
														<div
															className="cursor-move select-none [&_ul]:m-0 [&_ul]:pl-6 [&_ol]:m-0 [&_ol]:pl-6 [&_li]:my-1 [&_p]:m-0 [&_a]:text-inherit [&_a]:no-underline"
															onDoubleClick={() => setTextEditing(text.id)}
															style={{
																fontSize: `${text.styles?.fontSize || 24}px`,
																fontWeight: text.styles?.fontWeight || "normal",
																fontStyle: text.styles?.fontStyle || "normal",
																color: text.styles?.color || "#000000",
																textAlign: text.styles?.textAlign || "left",
																fontFamily: text.styles?.fontFamily || "Arial",
																backgroundColor:
																	text.styles?.backgroundColor || "transparent",
																padding: `${text.styles?.padding || 0}px`,
																borderRadius:
																	text.styles?.borderRadius === 100
																		? "50%"
																		: `${text.styles?.borderRadius || 0}px`,
																borderWidth: `${text.styles?.borderWidth || 0}px`,
																borderColor:
																	text.styles?.borderColor || "#000000",
																borderStyle:
																	text.styles?.borderStyle || "solid",
																opacity:
																	text.styles?.opacity !== undefined
																		? text.styles.opacity
																		: 1,
																boxShadow: formatShadowCSS(text.styles?.shadow),
																whiteSpace:
																	text.styles?.listStyle !== "none"
																		? "normal"
																		: "pre-wrap",
																wordWrap: "break-word",
															}}
															dangerouslySetInnerHTML={{
																__html: formatTextContent(
																	text.content,
																	text.styles
																),
															}}
														/>
													)}

													{/* Text Controls */}
													{selectedText === text.id &&
														textEditing !== text.id && (
															<div className="absolute -top-2 -right-2 flex gap-1">
																{/* Delete Button */}
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		removeText(text.id);
																	}}
																	className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
																	title="Delete text"
																>
																	<X className="w-3 h-3" />
																</button>
															</div>
														)}

													{/* Resize Handles */}
													{selectedText === text.id &&
														textEditing !== text.id && (
															<>
																{/* Corner handles */}
																<div
																	className="absolute top-0 left-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nwse-resize"
																	onMouseDown={(e) =>
																		handleTextResizeStart(e, text.id, "nw")
																	}
																/>
																<div
																	className="absolute top-0 right-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nesw-resize"
																	onMouseDown={(e) =>
																		handleTextResizeStart(e, text.id, "ne")
																	}
																/>
																<div
																	className="absolute bottom-0 left-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nesw-resize"
																	onMouseDown={(e) =>
																		handleTextResizeStart(e, text.id, "sw")
																	}
																/>
																<div
																	className="absolute bottom-0 right-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nwse-resize"
																	onMouseDown={(e) =>
																		handleTextResizeStart(e, text.id, "se")
																	}
																/>
																{/* Edge handles */}
																<div
																	className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ns-resize"
																	onMouseDown={(e) =>
																		handleTextResizeStart(e, text.id, "n")
																	}
																/>
																<div
																	className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ns-resize"
																	onMouseDown={(e) =>
																		handleTextResizeStart(e, text.id, "s")
																	}
																/>
																<div
																	className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ew-resize"
																	onMouseDown={(e) =>
																		handleTextResizeStart(e, text.id, "w")
																	}
																/>
																<div
																	className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ew-resize"
																	onMouseDown={(e) =>
																		handleTextResizeStart(e, text.id, "e")
																	}
																/>
															</>
														)}
												</div>
											))}

											{/* Uploaded Images Layer */}
											{images.map((image) => (
												<div
													key={image.id}
													className={`absolute ${
														selectedImage === image.id
															? "ring-2 ring-zinc-500"
															: "ring-2 ring-transparent"
													}`}
													style={{
														left: `${image.x}%`,
														top: `${image.y}%`,
														width: `${image.width}px`,
														height: `${image.height}px`,
														transform: `translate(-50%, -50%) rotate(${
															image.styles?.rotation || 0
														}deg) skew(${image.styles?.skewX || 0}deg, ${
															image.styles?.skewY || 0
														}deg)`,
														zIndex: image.styles?.zIndex || 1,
													}}
												>
													{/* Image Wrapper with overflow-hidden for border radius */}
													<div
														className="w-full h-full cursor-move"
														style={{
															borderRadius:
																image.styles?.borderRadius === 100
																	? "50%"
																	: `${image.styles?.borderRadius || 0}px`,
															overflow: "hidden",
															borderWidth: image.styles?.borderWidth || 0,
															borderColor:
																image.styles?.borderColor || "#000000",
															borderStyle: image.styles?.borderStyle || "solid",
															opacity:
																image.styles?.opacity !== undefined
																	? image.styles.opacity
																	: 1,
															boxShadow: formatShadowCSS(image.styles?.shadow),
															...(image.styles?.ringWidth > 0 && {
																outline: `${image.styles.ringWidth}px solid ${image.styles.ringColor}`,
																outlineOffset: "2px",
															}),
														}}
													>
														<img
															src={image.src}
															alt="Uploaded"
															className="w-full h-full"
															style={{
																objectFit: image.styles?.objectFit || "contain",
																...(image.styles?.noise?.enabled && {
																	filter: `contrast(${
																		1 +
																		(image.styles.noise.intensity || 0.3) * 0.2
																	}) brightness(${
																		1 +
																		(image.styles.noise.intensity || 0.3) * 0.1
																	})`,
																}),
															}}
															onMouseDown={(e) =>
																handleImageMouseDown(e, image.id)
															}
															draggable={false}
														/>
													</div>
													{/* Noise texture overlay for image only */}
													{image.styles?.noise?.enabled && (
														<div
															className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
															style={{
																backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter-${image.id}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter-${image.id})'/%3E%3C/svg%3E")`,
																opacity: image.styles.noise.intensity || 0.3,
															}}
														/>
													)}
													{/* Image Controls */}
													{selectedImage === image.id && (
														<div className="absolute -top-2 -right-2 flex gap-1">
															{/* Reupload Image Button */}
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	if (!imageReuploadRefs.current[image.id]) {
																		imageReuploadRefs.current[image.id] =
																			document.createElement("input");
																		imageReuploadRefs.current[image.id].type =
																			"file";
																		imageReuploadRefs.current[image.id].accept =
																			"image/*";
																		imageReuploadRefs.current[
																			image.id
																		].style.display = "none";
																		imageReuploadRefs.current[
																			image.id
																		].addEventListener("change", (evt) =>
																			handleImageReupload(evt, image.id)
																		);
																		document.body.appendChild(
																			imageReuploadRefs.current[image.id]
																		);
																	}
																	imageReuploadRefs.current[image.id].click();
																}}
																className="w-6 h-6 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
																title="Replace image"
															>
																<Upload className="w-3 h-3" />
															</button>
															{/* Object Fit Toggle Button */}
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	toggleObjectFit(image.id);
																}}
																className="w-6 h-6 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
																title={`Object Fit: ${
																	image.styles?.objectFit || "contain"
																} (click to change)`}
															>
																<ImageIcon className="w-3 h-3" />
															</button>
															{/* Caption Button */}
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	toggleCaption(image.id);
																}}
																className="w-6 h-6 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
																title="Add caption"
															>
																<Type className="w-3 h-3" />
															</button>
															{/* Delete Button */}
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	removeImage(image.id);
																}}
																className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
																title="Delete image"
															>
																<X className="w-3 h-3" />
															</button>
														</div>
													)}
													{/* Resize Handles */}
													{selectedImage === image.id && (
														<>
															{/* Corner handles */}
															<div
																className="absolute top-0 left-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nwse-resize"
																onMouseDown={(e) =>
																	handleResizeStart(e, image.id, "nw")
																}
															/>
															<div
																className="absolute top-0 right-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nesw-resize"
																onMouseDown={(e) =>
																	handleResizeStart(e, image.id, "ne")
																}
															/>
															<div
																className="absolute bottom-0 left-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nesw-resize"
																onMouseDown={(e) =>
																	handleResizeStart(e, image.id, "sw")
																}
															/>
															<div
																className="absolute bottom-0 right-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nwse-resize"
																onMouseDown={(e) =>
																	handleResizeStart(e, image.id, "se")
																}
															/>
															{/* Edge handles */}
															<div
																className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ns-resize"
																onMouseDown={(e) =>
																	handleResizeStart(e, image.id, "n")
																}
															/>
															<div
																className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ns-resize"
																onMouseDown={(e) =>
																	handleResizeStart(e, image.id, "s")
																}
															/>
															<div
																className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ew-resize"
																onMouseDown={(e) =>
																	handleResizeStart(e, image.id, "w")
																}
															/>
															<div
																className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ew-resize"
																onMouseDown={(e) =>
																	handleResizeStart(e, image.id, "e")
																}
															/>
														</>
													)}
													{/* Caption Input */}
													{captionEditing === image.id && (
														<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-20">
															<input
																type="text"
																value={image.caption || ""}
																onChange={(e) =>
																	updateImage(image.id, {
																		caption: e.target.value,
																	})
																}
																onBlur={() => setCaptionEditing(null)}
																onKeyDown={(e) => {
																	if (e.key === "Enter") {
																		setCaptionEditing(null);
																	}
																}}
																className="px-2 py-1 text-xs bg-white border border-zinc-300 rounded shadow-lg min-w-[100px]"
																placeholder="Add caption..."
																autoFocus
															/>
														</div>
													)}
													{/* Caption Display */}
													{image.caption && captionEditing !== image.id && (
														<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black bg-opacity-75 px-2 py-1 rounded whitespace-nowrap">
															{image.caption}
														</div>
													)}
												</div>
											))}

											{/* Uploaded Videos Layer */}
											{videos.map((video) => (
												<div
													key={video.id}
													className={`absolute ${
														selectedVideo === video.id
															? "ring-2 ring-zinc-500"
															: "ring-2 ring-transparent"
													}`}
													style={{
														left: `${video.x}%`,
														top: `${video.y}%`,
														width: `${video.width}px`,
														height: `${video.height}px`,
														transform: "translate(-50%, -50%)",
														zIndex: video.styles?.zIndex || 1,
													}}
												>
													{/* Video Wrapper with overflow-hidden for border radius */}
													<div
														className="w-full h-full cursor-move"
														style={{
															borderRadius:
																video.styles?.borderRadius === 100
																	? "50%"
																	: `${video.styles?.borderRadius || 0}px`,
															overflow: "hidden",
															borderWidth: video.styles?.borderWidth || 0,
															borderColor:
																video.styles?.borderColor || "#000000",
															borderStyle: video.styles?.borderStyle || "solid",
															opacity:
																video.styles?.opacity !== undefined
																	? video.styles.opacity
																	: 1,
															boxShadow: formatShadowCSS(video.styles?.shadow),
															...(video.styles?.ringWidth > 0 && {
																outline: `${video.styles.ringWidth}px solid ${video.styles.ringColor}`,
																outlineOffset: "2px",
															}),
														}}
													>
														<video
															src={video.src}
															className="w-full h-full"
															style={{
																objectFit: video.styles?.objectFit || "contain",
															}}
															onMouseDown={(e) =>
																handleVideoMouseDown(e, video.id)
															}
															controls
															loop
															muted
															playsInline
														/>
													</div>
													{/* Video Controls */}
													{captionEditing === video.id && (
														<div className="absolute -top-2 -right-2 flex gap-1">
															{/* Reupload Video Button */}
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	if (!videoReuploadRefs.current[video.id]) {
																		videoReuploadRefs.current[video.id] =
																			document.createElement("input");
																		videoReuploadRefs.current[video.id].type =
																			"file";
																		videoReuploadRefs.current[video.id].accept =
																			"video/*";
																		videoReuploadRefs.current[
																			video.id
																		].style.display = "none";
																		videoReuploadRefs.current[
																			video.id
																		].addEventListener("change", (evt) =>
																			handleVideoReupload(evt, video.id)
																		);
																		document.body.appendChild(
																			videoReuploadRefs.current[video.id]
																		);
																	}
																	videoReuploadRefs.current[video.id].click();
																}}
																className="w-6 h-6 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
																title="Replace video"
															>
																<Upload className="w-3 h-3" />
															</button>
															{/* Object Fit Toggle Button */}
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	toggleVideoObjectFit(video.id);
																}}
																className="w-6 h-6 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
																title={`Object Fit: ${
																	video.styles?.objectFit || "contain"
																} (click to change)`}
															>
																<Video className="w-3 h-3" />
															</button>
															{/* Caption Button */}
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	toggleVideoCaption(video.id);
																}}
																className="w-6 h-6 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
																title="Add caption"
															>
																<Type className="w-3 h-3" />
															</button>
															{/* Delete Button */}
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	removeVideo(video.id);
																}}
																className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
																title="Delete video"
															>
																<X className="w-3 h-3" />
															</button>
														</div>
													)}
													{/* Resize Handles */}
													{selectedVideo === video.id && (
														<>
															{/* Corner handles */}
															<div
																className="absolute top-0 left-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nwse-resize"
																onMouseDown={(e) =>
																	handleVideoResizeStart(e, video.id, "nw")
																}
															/>
															<div
																className="absolute top-0 right-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nesw-resize"
																onMouseDown={(e) =>
																	handleVideoResizeStart(e, video.id, "ne")
																}
															/>
															<div
																className="absolute bottom-0 left-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nesw-resize"
																onMouseDown={(e) =>
																	handleVideoResizeStart(e, video.id, "sw")
																}
															/>
															<div
																className="absolute bottom-0 right-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nwse-resize"
																onMouseDown={(e) =>
																	handleVideoResizeStart(e, video.id, "se")
																}
															/>
															{/* Edge handles */}
															<div
																className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ns-resize"
																onMouseDown={(e) =>
																	handleVideoResizeStart(e, video.id, "n")
																}
															/>
															<div
																className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ns-resize"
																onMouseDown={(e) =>
																	handleVideoResizeStart(e, video.id, "s")
																}
															/>
															<div
																className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ew-resize"
																onMouseDown={(e) =>
																	handleVideoResizeStart(e, video.id, "w")
																}
															/>
															<div
																className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ew-resize"
																onMouseDown={(e) =>
																	handleVideoResizeStart(e, video.id, "e")
																}
															/>
														</>
													)}
													{/* Caption Input */}
													{captionEditing === video.id && (
														<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-20">
															<input
																type="text"
																value={video.caption || ""}
																onChange={(e) =>
																	updateVideo(video.id, {
																		caption: e.target.value,
																	})
																}
																onBlur={() => setCaptionEditing(null)}
																onKeyDown={(e) => {
																	if (e.key === "Enter") {
																		setCaptionEditing(null);
																	}
																}}
																className="px-2 py-1 text-xs bg-white border border-zinc-300 rounded shadow-lg min-w-[100px]"
																placeholder="Add caption..."
																autoFocus
															/>
														</div>
													)}
													{/* Caption Display */}
													{video.caption && captionEditing !== video.id && (
														<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black bg-opacity-75 px-2 py-1 rounded whitespace-nowrap">
															{video.caption}
														</div>
													)}
												</div>
											))}

											{/* Shapes Layer */}
											{shapes.map((shape) => {
												const ShapeIcon =
													shape.type === "rectangle"
														? RectangleHorizontal
														: shape.type === "square"
															? Square
															: shape.type === "triangle"
																? Triangle
																: shape.type === "circle"
																	? Circle
																	: shape.type === "svg"
																		? Shapes
																		: Minus;

												return (
													<div
														key={shape.id}
														className={`absolute ${
															selectedShape === shape.id
																? "ring-2 ring-orange-500"
																: "ring-2 ring-transparent"
														}`}
														style={{
															left: `${shape.x}%`,
															top: `${shape.y}%`,
															width: `${shape.width}px`,
															height: `${shape.height}px`,
															transform: `translate(-50%, -50%) rotate(${
																shape.styles?.rotation || 0
															}deg) skew(${shape.styles?.skewX || 0}deg, ${
																shape.styles?.skewY || 0
															}deg)`,
															zIndex: shape.styles?.zIndex || 1,
														}}
														onMouseDown={(e) =>
															handleShapeMouseDown(e, shape.id)
														}
													>
														{/* Shape SVG */}
														<svg
															width="100%"
															height="100%"
															viewBox={
																shape.type === "svg"
																	? "0 0 200 200"
																	: "0 0 100 100"
															}
															preserveAspectRatio={
																shape.type === "circle" || shape.type === "svg"
																	? "xMidYMid meet"
																	: "none"
															}
															className="cursor-move"
															style={{
																opacity: shape.styles?.opacity || 1,
																filter: formatDropShadowCSS(
																	shape.styles?.shadow
																),
															}}
														>
															{/* Gradient Definitions */}
															{shape.styles?.fillGradient && (
																<defs>
																	<linearGradient
																		id={`shape-gradient-${shape.id}`}
																		x1="0%"
																		y1="0%"
																		x2="100%"
																		y2="0%"
																		gradientTransform={`rotate(${
																			shape.styles.fillGradient.angle || 45
																		} 50 50)`}
																	>
																		{shape.styles.fillGradient.stops
																			?.sort(
																				(a, b) => a.position.x - b.position.x
																			)
																			.map((stop) => (
																				<stop
																					key={stop.id}
																					offset={`${stop.position.x}%`}
																					stopColor={stop.color}
																				/>
																			))}
																	</linearGradient>
																</defs>
															)}
															{shape.type === "rectangle" && (
																<rect
																	x="0"
																	y="0"
																	width="100"
																	height="100"
																	fill={
																		shape.styles?.fillGradient
																			? `url(#shape-gradient-${shape.id})`
																			: shape.styles?.fillColor || "#3b82f6"
																	}
																	stroke={
																		shape.styles?.strokeColor || "#1e40af"
																	}
																	strokeWidth={shape.styles?.strokeWidth || 2}
																	rx={shape.styles?.borderRadius || 0}
																	ry={shape.styles?.borderRadius || 0}
																/>
															)}
															{shape.type === "square" && (
																<rect
																	x="0"
																	y="0"
																	width="100"
																	height="100"
																	fill={
																		shape.styles?.fillGradient
																			? `url(#shape-gradient-${shape.id})`
																			: shape.styles?.fillColor || "#3b82f6"
																	}
																	stroke={
																		shape.styles?.strokeColor || "#1e40af"
																	}
																	strokeWidth={shape.styles?.strokeWidth || 2}
																	rx={shape.styles?.borderRadius || 0}
																	ry={shape.styles?.borderRadius || 0}
																/>
															)}
															{shape.type === "line" && (
																<line
																	x1="0"
																	y1="50"
																	x2="100"
																	y2="50"
																	stroke={
																		shape.styles?.strokeColor || "#1e40af"
																	}
																	strokeWidth={shape.styles?.strokeWidth || 2}
																/>
															)}
															{shape.type === "triangle" && (
																<polygon
																	points="50,0 0,100 100,100"
																	fill={
																		shape.styles?.fillGradient
																			? `url(#shape-gradient-${shape.id})`
																			: shape.styles?.fillColor || "#3b82f6"
																	}
																	stroke={
																		shape.styles?.strokeColor || "#1e40af"
																	}
																	strokeWidth={shape.styles?.strokeWidth || 2}
																/>
															)}
															{shape.type === "circle" && (
																<circle
																	cx="50"
																	cy="50"
																	r="50"
																	fill={
																		shape.styles?.fillGradient
																			? `url(#shape-gradient-${shape.id})`
																			: shape.styles?.fillColor || "#3b82f6"
																	}
																	stroke={
																		shape.styles?.strokeColor || "#1e40af"
																	}
																	strokeWidth={shape.styles?.strokeWidth || 2}
																/>
															)}
															{shape.type === "svg" && shape.svgString && (
																<g
																	dangerouslySetInnerHTML={{
																		__html: shape.svgString
																			.replace(/\$\{width\}/g, "200")
																			.replace(/\$\{height\}/g, "200")
																			.replace(
																				/\$\{color\}/g,
																				shape.styles?.fillColor || "#3b82f6"
																			)
																			.replace(/<svg[^>]*>/, "")
																			.replace(/<\/svg>/, ""),
																	}}
																/>
															)}
														</svg>

														{/* Shape Controls */}
														{selectedShape === shape.id && (
															<div className="absolute -top-2 -right-2 flex gap-1">
																{/* Delete Button */}
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		removeShape(shape.id);
																	}}
																	className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
																	title="Delete shape"
																>
																	<X className="w-3 h-3" />
																</button>
															</div>
														)}

														{/* Resize Handles */}
														{selectedShape === shape.id && (
															<>
																{/* Corner handles */}
																<div
																	className="absolute top-0 left-0 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-nwse-resize"
																	onMouseDown={(e) =>
																		handleShapeResizeStart(e, shape.id, "nw")
																	}
																/>
																<div
																	className="absolute top-0 right-0 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-nesw-resize"
																	onMouseDown={(e) =>
																		handleShapeResizeStart(e, shape.id, "ne")
																	}
																/>
																<div
																	className="absolute bottom-0 left-0 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-nesw-resize"
																	onMouseDown={(e) =>
																		handleShapeResizeStart(e, shape.id, "sw")
																	}
																/>
																<div
																	className="absolute bottom-0 right-0 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-nwse-resize"
																	onMouseDown={(e) =>
																		handleShapeResizeStart(e, shape.id, "se")
																	}
																/>
																{/* Edge handles */}
																<div
																	className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-ns-resize"
																	onMouseDown={(e) =>
																		handleShapeResizeStart(e, shape.id, "n")
																	}
																/>
																<div
																	className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-ns-resize"
																	onMouseDown={(e) =>
																		handleShapeResizeStart(e, shape.id, "s")
																	}
																/>
																<div
																	className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-ew-resize"
																	onMouseDown={(e) =>
																		handleShapeResizeStart(e, shape.id, "w")
																	}
																/>
																<div
																	className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 border border-white rounded-full cursor-ew-resize"
																	onMouseDown={(e) =>
																		handleShapeResizeStart(e, shape.id, "e")
																	}
																/>
															</>
														)}
													</div>
												);
											})}

											{/* Icons Layer */}
											{icons.map((icon) => {
												const IconComponent = AllIcons[icon.iconName];
												if (!IconComponent) return null;

												return (
													<div
														key={icon.id}
														className={`absolute ${
															selectedIcon === icon.id
																? "ring-2 ring-zinc-500"
																: "ring-2 ring-transparent"
														}`}
														style={{
															left: `${icon.x}%`,
															top: `${icon.y}%`,
															width: `${icon.width}px`,
															height: `${icon.height}px`,
															transform: `translate(-50%, -50%) rotate(${
																icon.styles?.rotation || 0
															}deg) skew(${icon.styles?.skewX || 0}deg, ${
																icon.styles?.skewY || 0
															}deg)`,
															zIndex: icon.styles?.zIndex || 1,
														}}
														onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
													>
														<IconComponent
															className="w-full h-full"
															style={{
																color: icon.styles?.color || "#000000",
																opacity: icon.styles?.opacity || 1,
																filter: formatDropShadowCSS(
																	icon.styles?.shadow
																),
															}}
															strokeWidth={icon.styles?.strokeWidth || 2}
														/>

														{/* Icon Controls */}
														{selectedIcon === icon.id && (
															<div className="absolute -top-2 -right-2 flex gap-1">
																{/* Delete Button */}
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		removeIcon(icon.id);
																	}}
																	className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors z-10"
																	title="Delete icon"
																>
																	<X className="w-3 h-3" />
																</button>
															</div>
														)}

														{/* Resize Handles */}
														{selectedIcon === icon.id && (
															<>
																{/* Corner handles */}
																<div
																	className="absolute top-0 left-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nwse-resize"
																	onMouseDown={(e) =>
																		handleIconResizeStart(e, icon.id, "nw")
																	}
																/>
																<div
																	className="absolute top-0 right-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nesw-resize"
																	onMouseDown={(e) =>
																		handleIconResizeStart(e, icon.id, "ne")
																	}
																/>
																<div
																	className="absolute bottom-0 left-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nesw-resize"
																	onMouseDown={(e) =>
																		handleIconResizeStart(e, icon.id, "sw")
																	}
																/>
																<div
																	className="absolute bottom-0 right-0 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-nwse-resize"
																	onMouseDown={(e) =>
																		handleIconResizeStart(e, icon.id, "se")
																	}
																/>
																{/* Edge handles */}
																<div
																	className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ns-resize"
																	onMouseDown={(e) =>
																		handleIconResizeStart(e, icon.id, "n")
																	}
																/>
																<div
																	className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ns-resize"
																	onMouseDown={(e) =>
																		handleIconResizeStart(e, icon.id, "s")
																	}
																/>
																<div
																	className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ew-resize"
																	onMouseDown={(e) =>
																		handleIconResizeStart(e, icon.id, "w")
																	}
																/>
																<div
																	className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-500 border border-white rounded-full cursor-ew-resize"
																	onMouseDown={(e) =>
																		handleIconResizeStart(e, icon.id, "e")
																	}
																/>
															</>
														)}
													</div>
												);
											})}

											{/* Color Stop Handles - Only show when no element is selected */}
											{selectedImage === null &&
												selectedVideo === null &&
												selectedText === null &&
												selectedShape === null &&
												selectedIcon === null &&
												gradient.stops.map((stop) => (
													<div
														key={stop.id}
														className={`absolute w-6 h-6 flex items-center justify-center cursor-pointer group transition-transform ${
															selectedStop === stop.id
																? "scale-125"
																: "hover:scale-110"
														}`}
														style={{
															left: `calc(${stop.position.x}% - 12px)`,
															top: `calc(${stop.position.y}% - 12px)`,
														}}
														onMouseDown={(e) => handleMouseDown(e, stop.id)}
														onKeyDown={(e) => handleKeyDown(e, stop.id)}
														tabIndex={0}
														role="button"
														aria-label={`Color stop at ${Math.round(
															stop.position.x
														)}%, ${Math.round(stop.position.y)}%`}
													>
														{/* Handle */}
														<div
															className="w-6 h-6 rounded-full border-2 border-white shadow-lg hover:shadow-xl transition-shadow"
															style={{ backgroundColor: stop.color }}
														/>
														{/* Position Indicator */}
														<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black bg-opacity-75 px-2 py-1 rounded whitespace-nowrap">
															{Math.round(stop.position.x)}%,{" "}
															{Math.round(stop.position.y)}%
														</div>
													</div>
												))}
										</div>
									</div>
								</div>
							</div>

							{/* Control Panel - Fixed on Right Side */}
							<ControlPanel
								copied={copied}
								setCopied={setCopied}
								handleSaveProject={handleSaveProject}
								handlePublishProject={handlePublishProject}
								previewFrameSize={previewFrameSize}
								setPreviewFrameSize={setPreviewFrameSize}
								previewFramePresets={previewFramePresets}
								setGradient={setGradient}
								setIsModalOpen={setIsModalOpen}
								gradient={gradient}
								handleImageUpload={handleImageUpload}
								handleVideoUpload={handleVideoUpload}
								fileInputRef={fileInputRef}
								videoInputRef={videoInputRef}
								generateReactCodeMutation={generateReactCodeMutation}
								generatedReactCode={generatedReactCode}
								codeCopied={codeCopied}
								handleCopyGeneratedCode={handleCopyGeneratedCode}
								addColorStop={addColorStop}
								updateColorStop={updateColorStop}
								removeColorStop={removeColorStop}
								addBackgroundShapeRect={addBackgroundShapeRect}
								setBackgroundImage={setBackgroundImage}
								addShape={addShape}
								addText={addText}
								addIcon={addIcon}
								downloadSVG={downloadSVG}
								downloadRaster={downloadRaster}
								downloadGIF={downloadGIF}
								downloadMP4={downloadMP4}
								controlPanelRef={controlPanelRef}
								handleControlPanelContextMenu={handleControlPanelContextMenu}
								selectedImage={selectedImage}
								selectedVideo={selectedVideo}
								selectedText={selectedText}
								selectedShape={selectedShape}
								selectedIcon={selectedIcon}
								selectedBackgroundShapeRect={selectedBackgroundShapeRect}
								images={images}
								updateImage={updateImage}
								videos={videos}
								updateVideo={updateVideo}
								texts={texts}
								updateText={updateText}
								shapes={shapes}
								updateShape={updateShape}
								icons={icons}
								updateIcon={updateIcon}
								backgroundShapeRects={backgroundShapeRects}
								updateBackgroundShapeRect={updateBackgroundShapeRect}
								backgroundImage={backgroundImage}
								handleBackgroundImageUpload={handleBackgroundImageUpload}
								handleUrlScreenshot={handleUrlScreenshot}
								handleAddScreenshotToCanvas={handleAddScreenshotToCanvas}
								isUrlScreenshotOpen={isUrlScreenshotOpen}
								setIsUrlScreenshotOpen={setIsUrlScreenshotOpen}
								urlInput={urlInput}
								setUrlInput={setUrlInput}
								screenshotImage={screenshotImage}
								isScreenshotLoading={isScreenshotLoading}
								isImageImprovementOpen={isImageImprovementOpen}
								isShapeDropdownOpen={isShapeDropdownOpen}
								setIsShapeDropdownOpen={setIsShapeDropdownOpen}
								shapeDropdownRef={shapeDropdownRef}
								isBackgroundImageDropdownOpen={isBackgroundImageDropdownOpen}
								setIsBackgroundImageDropdownOpen={
									setIsBackgroundImageDropdownOpen
								}
								backgroundImageDropdownRef={backgroundImageDropdownRef}
								backgroundImageInputRef={backgroundImageInputRef}
								isIconSelectorOpen={isIconSelectorOpen}
								setIsIconSelectorOpen={setIsIconSelectorOpen}
								iconSelectorDropdownRef={iconSelectorDropdownRef}
								iconSearchQuery={iconSearchQuery}
								setIconSearchQuery={setIconSearchQuery}
							/>
						</div>
						{/* Modal */}
						<AnimatePresence>
							{isModalOpen && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
									onClick={() => setIsModalOpen(false)}
								>
									<motion.div
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.8, opacity: 0 }}
										className="relative flex items-center justify-center w-full h-full"
										onClick={(e) => e.stopPropagation()}
									>
										{/* Close Button, Download, and Frame Size Selector */}
										<div className="absolute top-1 right-2 flex items-center gap-2 z-50">
											{/* Frame Size Selector */}
											<div className="flex items-center">
												<Dropdown
													value={previewFrameSize}
													onChange={(value) => {
														setPreviewFrameSize(value);
														const frame = previewFramePresets[value];
														if (frame) {
															setGradient((prev) => ({
																...prev,
																dimensions: {
																	width: frame.width,
																	height: frame.height,
																},
															}));
														}
													}}
													options={Object.entries(previewFramePresets).map(
														([key, preset]) => ({
															value: key,
															label: preset.label,
														})
													)}
													placeholder="Select frame size"
													className="min-w-[180px]"
												/>
											</div>
											{/* Download Button with Dropdown */}
											<div ref={downloadDropdownRef} className="relative">
												<button
													onClick={() =>
														setIsDownloadDropdownOpen(!isDownloadDropdownOpen)
													}
													className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-zinc-400 px-2 py-1 text-sm bg-white hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200 shadow-lg"
												>
													<Download className="w-4 h-4" />
													Download
												</button>
												<AnimatePresence>
													{isDownloadDropdownOpen && (
														<motion.div
															initial={{ opacity: 0, y: -10 }}
															animate={{ opacity: 1, y: 0 }}
															exit={{ opacity: 0, y: -10 }}
															transition={{ duration: 0.15 }}
															className="absolute right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50 min-w-[200px]"
														>
															<div className="flex flex-col">
																<button
																	type="button"
																	onClick={() => {
																		downloadSVG(previewFrameSize);
																		setIsDownloadDropdownOpen(false);
																	}}
																	className="w-full px-4 py-2 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2"
																>
																	<Download className="w-4 h-4" />
																	<span>Download SVG</span>
																</button>
																<button
																	type="button"
																	onClick={() => {
																		downloadRaster("png", previewFrameSize);
																		setIsDownloadDropdownOpen(false);
																	}}
																	className="w-full px-4 py-3 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
																>
																	<Download className="w-4 h-4" />
																	<span>Download PNG</span>
																</button>
																<button
																	type="button"
																	onClick={() => {
																		downloadRaster("jpeg", previewFrameSize);
																		setIsDownloadDropdownOpen(false);
																	}}
																	className="w-full px-4 py-3 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
																>
																	<Download className="w-4 h-4" />
																	<span>Download as JPEG</span>
																</button>
																{/* GIF Download - Only show if background animation is enabled */}
																{gradient.backgroundAnimation.enabled && (
																	<button
																		type="button"
																		onClick={() => {
																			downloadGIF(previewFrameSize);
																			setIsDownloadDropdownOpen(false);
																		}}
																		className="w-full px-4 py-3 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
																	>
																		<Download className="w-4 h-4" />
																		<span>Download as GIF</span>
																	</button>
																)}
																{/* MP4 Download */}
																<button
																	type="button"
																	onClick={() => {
																		downloadMP4(previewFrameSize);
																		setIsDownloadDropdownOpen(false);
																	}}
																	className="w-full px-4 py-3 text-sm text-left hover:bg-zinc-50 transition-colors flex items-center gap-2 border-t border-zinc-100"
																>
																	<Video className="w-4 h-4" />
																	<span>Download as MP4</span>
																</button>
															</div>
														</motion.div>
													)}
												</AnimatePresence>
											</div>
											{/* Close Button */}
											<button
												onClick={() => setIsModalOpen(false)}
												className="w-8 h-8 bg-white hover:bg-zinc-100 rounded-full flex items-center justify-center shadow-lg transition-colors border border-zinc-200"
											>
												<X className="w-4 h-4 text-zinc-900" />
											</button>
										</div>

										{/* Modal Preview Container */}
										<div
											ref={modalPreviewRef}
											className="relative rounded-xl overflow-hidden shadow-2xl"
											style={{
												aspectRatio: `${gradient.dimensions.width} / ${gradient.dimensions.height}`,
												...modalDimensions,
												...(backgroundImage
													? {
															backgroundImage: `url(${backgroundImage})`,
															backgroundSize: "cover",
															backgroundPosition: "center",
															backgroundRepeat: "no-repeat",
														}
													: {
															background: generateGradientCSS(),
															...(isPlaying &&
																gradient.backgroundAnimation.enabled && {
																	backgroundSize: "200% 200%",
																}),
														}),
												...(isPlaying &&
													!backgroundImage &&
													backgroundAnimation && {
														animation: backgroundAnimation,
													}),
											}}
										>
											{/* Element Animation Overlay */}
											<div
												className="absolute inset-0 pointer-events-none"
												style={{
													...(isPlaying && animation && { animation }),
												}}
											/>

											{/* Background Shape Rectangles - Modal */}
											{backgroundShapeRects.map((rect) => {
												// Calculate scaling based on actual rendered dimensions
												const modalActualHeight =
													modalPreviewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const modalActualWidth =
													modalPreviewRef.current?.offsetWidth ||
													gradient.dimensions.width;
												const previewActualHeight =
													previewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const previewActualWidth =
													previewRef.current?.offsetWidth ||
													gradient.dimensions.width;

												// Calculate scale factors
												const scaleX =
													previewActualWidth > 0
														? modalActualWidth / previewActualWidth
														: 1;
												const scaleY =
													previewActualHeight > 0
														? modalActualHeight / previewActualHeight
														: 1;

												return (
													<div
														key={rect.id}
														className="absolute"
														style={{
															left: `${rect.x}%`,
															top: `${rect.y}%`,
															width: `${rect.width * scaleX}px`,
															height: `${rect.height * scaleY}px`,
															transform: `translate(-50%, -50%) rotate(${
																rect.styles?.rotation || 0
															}deg) skew(${rect.styles?.skewX || 0}deg, ${
																rect.styles?.skewY || 0
															}deg)`,
															zIndex: rect.styles?.zIndex || 0,
															opacity: rect.styles?.opacity || 1,
														}}
													>
														<BackgroundShape
															shapeId={rect.shapeId}
															scale={rect.scale}
															color="#000000"
														/>
													</div>
												);
											})}

											{/* Text Elements - Modal */}
											{texts.map((text) => {
												// Calculate scaling based on actual rendered dimensions
												const modalActualHeight =
													modalPreviewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const modalActualWidth =
													modalPreviewRef.current?.offsetWidth ||
													gradient.dimensions.width;
												const previewActualHeight =
													previewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const previewActualWidth =
													previewRef.current?.offsetWidth ||
													gradient.dimensions.width;

												// Calculate scale factors
												const scaleX =
													previewActualWidth > 0
														? modalActualWidth / previewActualWidth
														: 1;
												const scaleY =
													previewActualHeight > 0
														? modalActualHeight / previewActualHeight
														: 1;

												const styles = text.styles || {};
												return (
													<div
														key={text.id}
														className="absolute [&_ul]:m-0 [&_ul]:pl-6 [&_ol]:m-0 [&_ol]:pl-6 [&_li]:my-1 [&_p]:m-0 [&_a]:text-inherit [&_a]:no-underline"
														style={{
															left: `${text.x}%`,
															top: `${text.y}%`,
															width: `${text.width * scaleX}px`,
															minHeight: `${text.height * scaleY}px`,
															transform: "translate(-50%, -50%)",
															fontSize: `${(styles.fontSize || 24) * scaleY}px`,
															fontWeight: styles.fontWeight || "normal",
															fontStyle: styles.fontStyle || "normal",
															color: styles.color || "#000000",
															textAlign: styles.textAlign || "left",
															fontFamily: styles.fontFamily || "Arial",
															backgroundColor:
																styles.backgroundColor || "transparent",
															padding: `${(styles.padding || 0) * scaleY}px`,
															borderRadius:
																styles.borderRadius === 100
																	? "50%"
																	: `${(styles.borderRadius || 0) * scaleY}px`,
															borderWidth: `${
																(styles.borderWidth || 0) * scaleY
															}px`,
															borderColor: styles.borderColor || "#000000",
															borderStyle: styles.borderStyle || "solid",
															opacity:
																styles.opacity !== undefined
																	? styles.opacity
																	: 1,
															boxShadow:
																styles.shadow !== "none" && styles.shadow
																	? styles.shadow === "sm"
																		? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
																		: styles.shadow === "md"
																			? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
																			: styles.shadow === "lg"
																				? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
																				: styles.shadow === "xl"
																					? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
																					: styles.shadow === "2xl"
																						? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
																						: "none"
																	: "none",
															zIndex: styles.zIndex || 2,
															whiteSpace:
																styles.listStyle !== "none"
																	? "normal"
																	: "pre-wrap",
															wordWrap: "break-word",
														}}
														dangerouslySetInnerHTML={{
															__html: formatTextContent(text.content, styles),
														}}
													/>
												);
											})}

											{/* Image Elements - Modal */}
											{images.map((image) => {
												// Calculate scaling based on actual rendered dimensions
												const modalActualHeight =
													modalPreviewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const modalActualWidth =
													modalPreviewRef.current?.offsetWidth ||
													gradient.dimensions.width;
												const previewActualHeight =
													previewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const previewActualWidth =
													previewRef.current?.offsetWidth ||
													gradient.dimensions.width;

												// Calculate scale factors
												const scaleX =
													previewActualWidth > 0
														? modalActualWidth / previewActualWidth
														: 1;
												const scaleY =
													previewActualHeight > 0
														? modalActualHeight / previewActualHeight
														: 1;

												return (
													<div
														key={image.id}
														className="absolute"
														style={{
															left: `${image.x}%`,
															top: `${image.y}%`,
															width: `${image.width * scaleX}px`,
															height: `${image.height * scaleY}px`,
															transform: "translate(-50%, -50%)",
															zIndex: image.styles?.zIndex || 1,
														}}
													>
														{/* Image Wrapper with all styles */}
														<div
															className="w-full h-full"
															style={{
																borderRadius:
																	image.styles?.borderRadius === 100
																		? "50%"
																		: `${
																				(image.styles?.borderRadius || 0) *
																				scaleY
																			}px`,
																overflow: "hidden",
																borderWidth: `${
																	(image.styles?.borderWidth || 0) * scaleY
																}px`,
																borderColor:
																	image.styles?.borderColor || "#000000",
																borderStyle:
																	image.styles?.borderStyle || "solid",
																opacity:
																	image.styles?.opacity !== undefined
																		? image.styles.opacity
																		: 1,
																boxShadow:
																	image.styles?.shadow === "none" ||
																	!image.styles?.shadow
																		? "none"
																		: image.styles.shadow === "sm"
																			? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
																			: image.styles.shadow === "md"
																				? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
																				: image.styles.shadow === "lg"
																					? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
																					: image.styles.shadow === "xl"
																						? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
																						: image.styles.shadow === "2xl"
																							? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
																							: "none",
																...(image.styles?.ringWidth > 0 && {
																	outline: `${
																		image.styles.ringWidth * scaleY
																	}px solid ${image.styles.ringColor}`,
																	outlineOffset: `${2 * scaleY}px`,
																}),
															}}
														>
															<img
																src={image.src}
																alt="Uploaded"
																className="w-full h-full"
																style={{
																	objectFit:
																		image.styles?.objectFit || "contain",
																	...(image.styles?.noise?.enabled && {
																		filter: `contrast(${
																			1 +
																			(image.styles.noise.intensity || 0.3) *
																				0.2
																		}) brightness(${
																			1 +
																			(image.styles.noise.intensity || 0.3) *
																				0.1
																		})`,
																	}),
																}}
																draggable={false}
															/>
														</div>
														{/* Noise texture overlay for image only */}
														{image.styles?.noise?.enabled && (
															<div
																className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
																style={{
																	backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter-modal-${image.id}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter-modal-${image.id})'/%3E%3C/svg%3E")`,
																	opacity: image.styles.noise.intensity || 0.3,
																	borderRadius:
																		image.styles?.borderRadius === 100
																			? "50%"
																			: `${
																					(image.styles?.borderRadius || 0) *
																					scaleY
																				}px`,
																}}
															/>
														)}
														{image.caption && (
															<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-white bg-black bg-opacity-75 px-2 py-1 rounded whitespace-nowrap z-10">
																{image.caption}
															</div>
														)}
													</div>
												);
											})}

											{/* Video Elements - Modal */}
											{videos.map((video) => {
												// Calculate scaling based on actual rendered dimensions
												const modalActualHeight =
													modalPreviewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const modalActualWidth =
													modalPreviewRef.current?.offsetWidth ||
													gradient.dimensions.width;
												const previewActualHeight =
													previewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const previewActualWidth =
													previewRef.current?.offsetWidth ||
													gradient.dimensions.width;

												// Calculate scale factors
												const scaleX =
													previewActualWidth > 0
														? modalActualWidth / previewActualWidth
														: 1;
												const scaleY =
													previewActualHeight > 0
														? modalActualHeight / previewActualHeight
														: 1;

												return (
													<div
														key={video.id}
														className="absolute"
														style={{
															left: `${video.x}%`,
															top: `${video.y}%`,
															width: `${video.width * scaleX}px`,
															height: `${video.height * scaleY}px`,
															transform: "translate(-50%, -50%)",
															zIndex: video.styles?.zIndex || 1,
														}}
													>
														{/* Video Wrapper with all styles */}
														<div
															className="w-full h-full"
															style={{
																borderRadius:
																	video.styles?.borderRadius === 100
																		? "50%"
																		: `${
																				(video.styles?.borderRadius || 0) *
																				scaleY
																			}px`,
																overflow: "hidden",
																borderWidth: `${
																	(video.styles?.borderWidth || 0) * scaleY
																}px`,
																borderColor:
																	video.styles?.borderColor || "#000000",
																borderStyle:
																	video.styles?.borderStyle || "solid",
																opacity:
																	video.styles?.opacity !== undefined
																		? video.styles.opacity
																		: 1,
																boxShadow:
																	video.styles?.shadow === "none" ||
																	!video.styles?.shadow
																		? "none"
																		: video.styles.shadow === "sm"
																			? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
																			: video.styles.shadow === "md"
																				? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
																				: video.styles.shadow === "lg"
																					? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
																					: video.styles.shadow === "xl"
																						? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
																						: video.styles.shadow === "2xl"
																							? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
																							: "none",
																...(video.styles?.ringWidth > 0 && {
																	outline: `${
																		video.styles.ringWidth * scaleY
																	}px solid ${video.styles.ringColor}`,
																	outlineOffset: `${2 * scaleY}px`,
																}),
															}}
														>
															<video
																src={video.src}
																alt="Uploaded"
																className="w-full h-full"
																style={{
																	objectFit:
																		video.styles?.objectFit || "contain",
																}}
																controls
																loop
																muted
																playsInline
																autoPlay
															/>
														</div>
														{video.caption && (
															<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-white bg-black bg-opacity-75 px-2 py-1 rounded whitespace-nowrap z-10">
																{video.caption}
															</div>
														)}
													</div>
												);
											})}

											{/* Icon Elements - Modal */}
											{icons.map((icon) => {
												const IconComponent = AllIcons[icon.iconName];
												if (!IconComponent) return null;

												// Calculate scaling based on actual rendered dimensions
												const modalActualHeight =
													modalPreviewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const modalActualWidth =
													modalPreviewRef.current?.offsetWidth ||
													gradient.dimensions.width;
												const previewActualHeight =
													previewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const previewActualWidth =
													previewRef.current?.offsetWidth ||
													gradient.dimensions.width;

												// Calculate scale factors
												const scaleX =
													previewActualWidth > 0
														? modalActualWidth / previewActualWidth
														: 1;
												const scaleY =
													previewActualHeight > 0
														? modalActualHeight / previewActualHeight
														: 1;

												return (
													<div
														key={icon.id}
														className="absolute"
														style={{
															left: `${icon.x}%`,
															top: `${icon.y}%`,
															width: `${icon.width * scaleX}px`,
															height: `${icon.height * scaleY}px`,
															transform: "translate(-50%, -50%)",
															zIndex: icon.styles?.zIndex || 1,
														}}
													>
														<IconComponent
															className="w-full h-full"
															style={{
																color: icon.styles?.color || "#000000",
																opacity: icon.styles?.opacity || 1,
																filter: formatDropShadowCSS(
																	icon.styles?.shadow
																),
															}}
															strokeWidth={icon.styles?.strokeWidth || 2}
														/>
													</div>
												);
											})}

											{/* Shape Elements - Modal */}
											{shapes.map((shape) => {
												// Calculate scaling based on actual rendered dimensions
												const modalActualHeight =
													modalPreviewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const modalActualWidth =
													modalPreviewRef.current?.offsetWidth ||
													gradient.dimensions.width;
												const previewActualHeight =
													previewRef.current?.offsetHeight ||
													gradient.dimensions.height;
												const previewActualWidth =
													previewRef.current?.offsetWidth ||
													gradient.dimensions.width;

												// Calculate scale factors
												const scaleX =
													previewActualWidth > 0
														? modalActualWidth / previewActualWidth
														: 1;
												const scaleY =
													previewActualHeight > 0
														? modalActualHeight / previewActualHeight
														: 1;

												return (
													<div
														key={shape.id}
														className="absolute"
														style={{
															left: `${shape.x}%`,
															top: `${shape.y}%`,
															width: `${shape.width * scaleX}px`,
															height: `${shape.height * scaleY}px`,
															transform: "translate(-50%, -50%)",
															zIndex: shape.styles?.zIndex || 1,
														}}
													>
														<svg
															width="100%"
															height="100%"
															viewBox="0 0 100 100"
															preserveAspectRatio={
																shape.type === "circle"
																	? "xMidYMid meet"
																	: "none"
															}
															style={{
																opacity: shape.styles?.opacity || 1,
																filter: formatDropShadowCSS(
																	shape.styles?.shadow
																),
															}}
														>
															{shape.type === "rectangle" && (
																<rect
																	x="0"
																	y="0"
																	width="100"
																	height="100"
																	fill={shape.styles?.fillColor || "#3b82f6"}
																	stroke={
																		shape.styles?.strokeColor || "#1e40af"
																	}
																	strokeWidth={shape.styles?.strokeWidth || 2}
																	rx={shape.styles?.borderRadius || 0}
																	ry={shape.styles?.borderRadius || 0}
																/>
															)}
															{shape.type === "square" && (
																<rect
																	x="0"
																	y="0"
																	width="100"
																	height="100"
																	fill={shape.styles?.fillColor || "#3b82f6"}
																	stroke={
																		shape.styles?.strokeColor || "#1e40af"
																	}
																	strokeWidth={shape.styles?.strokeWidth || 2}
																	rx={shape.styles?.borderRadius || 0}
																	ry={shape.styles?.borderRadius || 0}
																/>
															)}
															{shape.type === "line" && (
																<line
																	x1="0"
																	y1="50"
																	x2="100"
																	y2="50"
																	stroke={
																		shape.styles?.strokeColor || "#1e40af"
																	}
																	strokeWidth={shape.styles?.strokeWidth || 2}
																/>
															)}
															{shape.type === "triangle" && (
																<polygon
																	points="50,0 0,100 100,100"
																	fill={shape.styles?.fillColor || "#3b82f6"}
																	stroke={
																		shape.styles?.strokeColor || "#1e40af"
																	}
																	strokeWidth={shape.styles?.strokeWidth || 2}
																/>
															)}
															{shape.type === "circle" && (
																<circle
																	cx="50"
																	cy="50"
																	r="50"
																	fill={shape.styles?.fillColor || "#3b82f6"}
																	stroke={
																		shape.styles?.strokeColor || "#1e40af"
																	}
																	strokeWidth={shape.styles?.strokeWidth || 2}
																/>
															)}
														</svg>
													</div>
												);
											})}
										</div>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Scaling Mode Indicator */}
						{isScalingMode && (
							<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
								<Zap className="w-4 h-4" />
								<span className="text-sm font-semibold">
									Scaling Mode Active - Hover over V key area to scale down
								</span>
								<button
									onClick={() => setIsScalingMode(false)}
									className="ml-2 hover:bg-yellow-600 rounded px-2 py-1"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						)}
						<TopCenterToolbar
							addText={addText}
							projects={projects}
							backgroundImageDropdownRef={backgroundImageDropdownRef}
							backgroundImageInputRef={backgroundImageInputRef}
							handleBackgroundImageUpload={handleBackgroundImageUpload}
							isBackgroundImageDropdownOpen={isBackgroundImageDropdownOpen}
							setIsBackgroundImageDropdownOpen={
								setIsBackgroundImageDropdownOpen
							}
							backgroundImage={backgroundImage}
							setBackgroundImage={setBackgroundImage}
							fileInputRef={fileInputRef}
							macAssetImages={macAssetImages}
							images={images}
							setImages={setImages}
							setSelectedImage={setSelectedImage}
							setSelectedImages={setSelectedImages}
							videoInputRef={videoInputRef}
							iconSelectorDropdownRef={iconSelectorDropdownRef}
							isIconSelectorOpen={isIconSelectorOpen}
							setIsIconSelectorOpen={setIsIconSelectorOpen}
							setIconSearchQuery={setIconSearchQuery}
							addIcon={addIcon}
							shapeDropdownRef={shapeDropdownRef}
							isShapeDropdownOpen={isShapeDropdownOpen}
							setIsShapeDropdownOpen={setIsShapeDropdownOpen}
							addShape={addShape}
							urlScreenshotDropdownRef={urlScreenshotDropdownRef}
							isUrlScreenshotOpen={isUrlScreenshotOpen}
							setIsUrlScreenshotOpen={setIsUrlScreenshotOpen}
							urlInputRef={urlInputRef}
							urlInput={urlInput}
							setUrlInput={setUrlInput}
							handleUrlScreenshot={handleUrlScreenshot}
							isScreenshotLoading={isScreenshotLoading}
							screenshotImage={screenshotImage}
							setScreenshotImage={setScreenshotImage}
							handleAddScreenshotToCanvas={handleAddScreenshotToCanvas}
							framesList={framesList}
							activeFrameId={activeFrameId}
							handleFrameSelect={handleFrameSelect}
							isLoadingFrames={isLoadingFrames}
							handleAddFrame={handleAddFrame}
							handleDeleteFrame={handleDeleteFrame}
							isFrameActionLoading={isFrameActionLoading}
							isAuthenticated={isAuthenticated}
							setPreviewZoom={setPreviewZoom}
							undo={undo}
							historyIndex={historyIndex}
							historyLength={history.length}
							redo={redo}
							handleCopyHTML={handleCopyHTML}
							copied={copied}
						/>

						{/* MP4 Generation Loading Modal */}
						<AnimatePresence>
							{isGeneratingMP4 && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
								>
									<motion.div
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.8, opacity: 0 }}
										className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
									>
										<div className="text-center">
											<div className="mb-4">
												<div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-600"></div>
											</div>
											<h3 className="text-xl font-semibold mb-2">
												Generating MP4 Video
											</h3>
											<p className="text-zinc-600 mb-4">
												{mp4Progress < 20
													? "Initializing..."
													: mp4Progress < 70
														? "Recording frames..."
														: mp4Progress < 90
															? "Converting to MP4..."
															: "Finalizing..."}
											</p>
											<div className="w-full bg-zinc-200 rounded-full h-2.5 mb-2">
												<div
													className="bg-zinc-600 h-2.5 rounded-full transition-all duration-300"
													style={{ width: `${mp4Progress}%` }}
												></div>
											</div>
											<p className="text-sm text-zinc-500">
												{Math.round(mp4Progress)}%
											</p>
										</div>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>

						<AnimatePresence>
							{showSubscriptionModal && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center p-4"
								>
									<motion.div
										initial={{ scale: 0.9, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.9, opacity: 0 }}
										onClick={(e) => e.stopPropagation()}
										className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] hidescrollbar overflow-auto flex flex-col"
									>
										<div className="p-2 my-2 absolute right-4 top-4 z-50 hover:bg-zinc-50 cursor-pointer rounded-full">
											<Cancel01Icon
												className="w-3 h-3 text-zinc-900 "
												onClick={() => setShowSubscriptionModal(false)}
											/>
										</div>
										<SubscriptionModal
											onClose={() => setShowSubscriptionModal(false)}
											isOpen={showSubscriptionModal}
										/>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>

						<AnimatePresence>
							{isKeyboardShortcutsOpen && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center p-4"
									onMouseEnter={() => setIsKeyboardShortcutsOpen(true)}
									onMouseLeave={() => setIsKeyboardShortcutsOpen(false)}
								>
									<motion.div
										initial={{ scale: 0.9, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.9, opacity: 0 }}
										className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] hidescrollbar overflow-auto flex flex-col"
									>
										<div className="p-2 my-2 absolute right-4 top-4 z-50 hover:bg-zinc-50 cursor-pointer rounded-full">
											<Cancel01Icon
												className="w-3 h-3 text-zinc-900 "
												onClick={() => setIsKeyboardShortcutsOpen(false)}
											/>
										</div>
										<div className="p-4">
											<h3 className="text-lg font-semibold mb-3 text-zinc-900">
												Keyboard Shortcuts
											</h3>
											<div className="space-y-2 text-sm">
												<div className="flex items-center justify-between py-1">
													<span className="text-zinc-600">Add Elements:</span>
												</div>
												<div className="grid grid-cols-2 gap-2 mt-2">
													<div className="flex items-center justify-between p-2 bg-zinc-50 rounded">
														<span className="text-zinc-700">Square</span>
														<kbd className="px-2 py-1 bg-zinc-200 text-zinc-800 rounded text-xs font-mono">
															S
														</kbd>
													</div>
													<div className="flex items-center justify-between p-2 bg-zinc-50 rounded">
														<span className="text-zinc-700">Video</span>
														<kbd className="px-2 py-1 bg-zinc-200 text-zinc-800 rounded text-xs font-mono">
															V
														</kbd>
													</div>
													<div className="flex items-center justify-between p-2 bg-zinc-50 rounded">
														<span className="text-zinc-700">Line</span>
														<kbd className="px-2 py-1 bg-zinc-200 text-zinc-800 rounded text-xs font-mono">
															L
														</kbd>
													</div>
													<div className="flex items-center justify-between p-2 bg-zinc-50 rounded">
														<span className="text-zinc-700">Text</span>
														<kbd className="px-2 py-1 bg-zinc-200 text-zinc-800 rounded text-xs font-mono">
															T
														</kbd>
													</div>
													<div className="flex items-center justify-between p-2 bg-zinc-50 rounded">
														<span className="text-zinc-700">Triangle</span>
														<kbd className="px-2 py-1 bg-zinc-200 text-zinc-800 rounded text-xs font-mono">
															⇧T
														</kbd>
													</div>
												</div>
												<div className="mt-3 pt-3 border-t border-zinc-200">
													<div className="flex items-center justify-between p-2 bg-zinc-50 rounded">
														<span className="text-zinc-700">
															Delete Selected
														</span>
														<div className="flex gap-1">
															<kbd className="px-2 py-1 bg-zinc-200 text-zinc-800 rounded text-xs font-mono">
																Delete
															</kbd>
															<span className="text-zinc-500">/</span>
															<kbd className="px-2 py-1 bg-zinc-200 text-zinc-800 rounded text-xs font-mono">
																Backspace
															</kbd>
														</div>
													</div>
													<div className="flex items-center justify-between p-2 bg-zinc-50 rounded mt-2">
														<span className="text-zinc-700">
															Multiple Select
														</span>
														<kbd className="px-2 py-1 bg-zinc-200 text-zinc-800 rounded text-xs font-mono">
															⌘+Click
														</kbd>
													</div>
													<div className="flex items-center justify-between p-2 bg-zinc-50 rounded mt-2">
														<span className="text-zinc-700">Scaling Mode</span>
														<kbd className="px-2 py-1 bg-zinc-200 text-zinc-800 rounded text-xs font-mono">
															K
														</kbd>
													</div>
													<div className="flex items-center justify-between p-2 bg-zinc-50 rounded mt-2">
														<span className="text-zinc-700">
															Scale Down (in scaling mode)
														</span>
														<kbd className="px-2 py-1 bg-zinc-200 text-zinc-800 rounded text-xs font-mono">
															Hover V
														</kbd>
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
				<AnimatePresence>
					<FeaturesSectionModal
						isOpen={isOpenAboutModal}
						onClose={() => setIsOpenAboutModal(false)}
					/>
				</AnimatePresence>
				<ProjectsModal
					isOpen={isProjectModalOpen}
					onClose={() => setIsProjectModalOpen(false)}
					projects={projects}
					onSelectProject={(project) => {
						loadProject(project.id);
						router.push(`/app?projectId=${project.id}`, undefined, {
							shallow: true,
						});
					}}
					currentProjectId={currentProjectId}
					user={user}
					onProjectsChange={() =>
						queryClient.invalidateQueries(["projects", user?.uid])
					}
				/>
				<VariantSelectionModal
					isOpen={isVariantsModalOpen}
					onClose={() => setIsVariantsModalOpen(false)}
					variants={generatedVariants}
					onGenerateMore={handleGenerateVariants}
					isGeneratingMore={generateVariantsMutation.isPending}
				/>
				<ReleaseBox
					isOpen={isReleasesModalOpen}
					onClose={() => setIsReleasesModalOpen(false)}
				/>
			</div>
		</EditorProvider>
	);
};

export default AnimatedGradientGenerator;
