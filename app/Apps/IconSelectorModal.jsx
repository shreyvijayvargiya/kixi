import React, { useState, useMemo } from "react";

import { motion, AnimatePresence } from "framer-motion";

import Fuse from "fuse.js";

import {
	Folder,
	FolderOpen,
	FileText,
	File,
	FileImage,
	FileCode,
	FileVideo,
	FileAudio,
	FileSpreadsheet,
	FileArchive,
	FileCheck,
	FileX,
	FilePlus,
	FileMinus,
	FileEdit,
	FileSearch,
	FileHeart,
	FileClock,
	FileWarning,
	FileQuestion,
	FileSliders,
	FileBarChart,
	FileLineChart,
	Database,
	Activity,
	Server,
	Cloud,
	Upload,
	Share2,
	Unlock,
	Shield,
	Settings,
	Cog,
	Wrench,
	Hammer,
	PenTool,
	Zap,
	CloudLightning,
	Star,
	Bookmark,
	Tag,
	Text,
	Award,
	Crown,
	Gem,
	Diamond,
	Circle,
	Square,
	Triangle,
	Hexagon,
	Octagon,
	EllipsisVertical,
	RectangleEllipsis,
	Package,
	ShoppingBasket,
	Briefcase,
	Badge,
	Key,
	Lock,
	Box,
	FolderPlus,
	FolderEdit,
	FolderHeart,
	FolderClock,
	FolderMinus,
	FolderSearch,
	Info,
	Settings2,
	Image as ImageIcon,
	Camera,
	Video,
	Mic,
	Volume2,
	VolumeX,
	Music2,
	Play,
	Pause,
	StopCircle,
	Clipboard,
	ClipboardCheck,
	Grid,
	Layout,
	Columns,
	Rows,
	Palette,
	Brush,
	PenSquare,
	PenLine,
	Layers,
	Move,
	MousePointer2,
	Monitor,
	Tablet,
	Smartphone,
	Sparkles,
	GalleryHorizontal,
	GalleryVertical,
	Shapes,
	Globe,
} from "lucide-react";

// SVG Shapes Map - geometric shapes with template variables
export const svgShapesMap = {
	"star-burst":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><path fill="${color}" d="m100 0 24.1 58.258L186.603 50 148.2 100l38.403 50-62.503-8.258L100 200l-24.1-58.258L13.397 150 51.8 100 13.398 50 75.9 58.258z"/></svg>',
	cross:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M120 0H80v51.716L43.432 15.147 15.147 43.431 51.716 80H0v40h51.716l-36.569 36.568 28.285 28.285L80 148.284V200h40v-51.716l36.569 36.569 28.284-28.284L148.284 120H200V80h-51.716l36.569-36.569-28.284-28.284L120 51.716z" clip-rule="evenodd"/></g></svg>',
	wave: '<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M120 0H80v110c0 11.046-8.954 20-20 20s-20-8.954-20-20V0H0v100c0 55.228 44.772 100 100 100s100-44.772 100-100V0h-40v110c0 11.046-8.954 20-20 20s-20-8.954-20-20z" clip-rule="evenodd"/></g></svg>',
	pinwheel:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M90 32V0H0v90h32V54.627L63.132 85.76 77.372 100l-14.24 14.241L32 145.373V110H0v90h90v-32H54.627l31.132-31.132L100 122.627l14.241 14.241L145.373 168H110v32h90v-90h-32v35.373l-31.132-31.132L122.627 100l14.241-14.24L168 54.626V90h32V0h-90v32h35.373l-31.132 31.132L100 77.372l-14.24-14.24L54.626 32z" clip-rule="evenodd"/></g></svg>',
	"arrow-fold":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M50 0h150v150l-50 50V50H0zM0 165.067V100h65.067zM100 200H35.778L100 135.778z" clip-rule="evenodd"/></g></svg>',
	chain:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><path fill="${color}" fill-rule="evenodd" d="M64 0h135v135h-8.804V67.5c0-32.417-26.279-58.696-58.696-58.696S72.804 35.084 72.804 67.5V135H64zm72 65v135H1V65h8.804v67.5c0 32.417 26.28 58.696 58.696 58.696 32.417 0 58.696-26.279 58.696-58.696V65z" clip-rule="evenodd"/></svg>',
	columns:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M44 0H0v150c0 27.614 22.386 50 50 50h44V50C94 22.386 71.614 0 44 0m112 0c-27.614 0-50 22.386-50 50v150h44c27.614 0 50-22.386 50-50V0z" clip-rule="evenodd"/></g></svg>',
	"quarter-circles":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M50 0H0v100h50c-27.614 0-50 22.386-50 50v50h100v-50c0 27.614 22.386 50 50 50h50V100h-50c27.614 0 50-22.386 50-50V0H100v50c0-27.614-22.386-50-50-50m50 100H50c27.614 0 50 22.386 50 50zm0 0V50c0 27.614 22.386 50 50 50z" clip-rule="evenodd"/></g></svg>',
	petals:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M100 100H0V0c55.229 0 100 44.772 100 100m100 0V0c-55.228 0-100 44.772-100 100zM100 200H0V100c55.229 0 100 44.772 100 100m0 0h100V100c-55.228 0-100 44.772-100 100" clip-rule="evenodd"/></g></svg>',
	"arch-split":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M0 100V0h200v100c-55.22 0-99.987-44.758-100-99.976C99.987 55.242 55.22 100 0 100m100 100c0-55.229 44.772-100 100-100v100zm0 0c0-55.229-44.771-100-100-100v100z" clip-rule="evenodd"/></g></svg>',
	"leaf-quarters":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M0 100V0h100c0 55.229-44.771 100-100 100m200 0C200 44.772 155.228 0 100 0v100H0c0 55.228 44.772 100 100 100h100zm-.039 0H100v100c0-55.215 44.75-99.979 99.961-100" clip-rule="evenodd"/></g></svg>',
	"corner-circles":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M200 50V0H100v49.98C99.99 22.375 77.608 0 50 0H0v100h50c-27.614 0-50 22.386-50 50v50h100v-50c0 27.614 22.386 50 50 50h50V100h-49.98C177.625 99.99 200 77.608 200 50" clip-rule="evenodd"/></g></svg>',
	puzzle:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" d="M100 200q-12.5 0-20.833-8.073-8.334-8.073-8.334-19.531 0-6.51 2.605-11.719t9.114-11.458q6.771-6.25 10.677-11.719 4.167-5.729 4.167-9.896v-9.375q-5.73-1.302-10.156-5.208-4.167-4.167-5.47-9.896h-9.374q-4.428 0-10.417 4.167-5.99 4.166-11.458 10.156-5.469 5.99-10.938 8.854-5.208 2.865-11.979 2.865-11.719 0-19.791-8.334Q0 112.5 0 100t7.813-20.833q8.072-8.334 19.791-8.334 10.938 0 18.75 7.813 7.813 7.812 14.063 13.281t11.979 5.469h9.375q1.301-5.99 5.469-9.896 4.426-4.167 10.156-5.208v-9.375q0-6.77-10.417-17.188L81.51 50.26Q70.833 39.583 70.833 27.604q0-11.718 8.334-19.531Q87.76 0 100 0q12.5 0 20.833 8.073 8.334 8.073 8.334 19.531 0 13.282-13.021 25-13.021 11.979-13.021 20.313v9.375q5.99 1.041 9.896 5.208 4.167 3.906 5.208 9.896h9.375q8.854 0 20.313-13.281 11.718-13.282 24.479-13.282 11.719 0 19.531 8.594Q200 87.76 200 100q0 12.5-8.073 20.833-8.073 8.334-19.531 8.334-10.938 0-18.49-7.552t-14.062-13.021-12.24-5.469h-9.375q-2.083 12.5-15.104 15.104v9.375q0 7.813 13.021 20.052 13.02 12.24 13.021 24.74 0 11.719-8.594 19.531Q112.24 200 100 200"/></g></svg>',
	target:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M100 0c55.228 0 100 44.772 100 100s-44.772 100-100 100S0 155.228 0 100 44.772 0 100 0m0 0c38.108 0 69 30.892 69 69s-30.892 69-69 69-69-30.892-69-69S61.892 0 100 0m32 69c0-17.673-14.327-32-32-32S68 51.327 68 69s14.327 32 32 32 32-14.327 32-32" clip-rule="evenodd"/></g></svg>',
	"grid-plus":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M43.256 174.653V200h13.488v-25.347c0-9.891 8.019-17.909 17.91-17.909h50.693c9.89 0 17.909 8.018 17.909 17.909V200h13.488v-25.347c0-9.891 8.019-17.909 17.91-17.909H200v-13.488h-25.346c-9.891 0-17.91-8.018-17.91-17.909V74.653c0-9.89 8.019-17.909 17.91-17.909H200V43.256h-25.346c-9.891 0-17.91-8.019-17.91-17.91V0h-13.488v25.347c0 9.89-8.019 17.909-17.909 17.909H74.653c-9.89 0-17.909-8.018-17.909-17.91V0H43.256v25.347c0 9.89-8.019 17.909-17.91 17.909H0v13.488h25.346c9.891 0 17.91 8.018 17.91 17.91v50.693c0 9.891-8.019 17.909-17.91 17.909H0v13.488h25.346c9.891 0 17.91 8.018 17.91 17.909m100-74.653V74.653c0-9.89-8.019-17.909-17.909-17.909H74.653c-9.89 0-17.909 8.018-17.909 17.91v50.693c0 9.891 8.019 17.909 17.91 17.909h50.693c9.89 0 17.909-8.018 17.909-17.909z" clip-rule="evenodd"/></g></svg>',
	"diamond-dots":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M0 200V0h200v200H0m100-50.027c.015-27.602 22.395-49.973 50-49.973-27.614 0-50-22.386-50-50 0 27.614-22.386 50-50 50 27.605 0 49.985 22.371 50 49.973M50 126c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24m24-76c0 13.255-10.745 24-24 24S26 63.255 26 50s10.745-24 24-24 24 10.745 24 24m52 100c0-13.255 10.745-24 24-24s24 10.745 24 24-10.745 24-24 24-24-10.745-24-24m0-100c0 13.255 10.745 24 24 24s24-10.745 24-24-10.745-24-24-24-24 10.745-24 24" clip-rule="evenodd"/></g></svg>',
	blob: '<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M200 0v200h-60v-69.967C139.982 168.678 108.649 200 70 200c-38.66 0-70-31.34-70-70s31.34-70 70-70c38.649 0 69.982 31.322 70 69.967V60H0V0h200" clip-rule="evenodd"/></g></svg>',
	flower:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M100 0C72.386 0 50 22.386 50 50 22.386 50 0 72.386 0 100s22.386 50 50 50c0 27.614 22.386 50 50 50s50-22.386 50-50c27.614 0 50-22.386 50-50s-22.386-50-50-50c0-27.614-22.386-50-50-50m40.306 59.694c0-22.26-18.046-40.306-40.306-40.306S59.694 37.433 59.694 59.694c-22.26 0-40.306 18.046-40.306 40.306s18.045 40.306 40.306 40.306c0 22.261 18.046 40.306 40.306 40.306s40.306-18.045 40.306-40.306c22.261 0 40.306-18.046 40.306-40.306s-18.045-40.306-40.306-40.306m-70.918 9.694c0-16.907 13.705-30.613 30.612-30.613s30.612 13.706 30.612 30.613c16.907 0 30.612 13.705 30.612 30.612s-13.705 30.612-30.612 30.612c0 16.907-13.705 30.612-30.612 30.612s-30.612-13.705-30.612-30.612c-16.907 0-30.613-13.705-30.613-30.612s13.706-30.612 30.613-30.612" clip-rule="evenodd"/></g></svg>',
	"four-petals":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M0 0c27.614 0 50 22.386 50 50C22.386 50 0 27.614 0 0m100 0C72.386 0 50 22.386 50 50 22.386 50 0 72.386 0 100s22.386 50 50 50c-27.614 0-50 22.386-50 50 27.614 0 50-22.386 50-50 0 27.614 22.386 50 50 50s50-22.386 50-50c0 27.614 22.386 50 50 50 0-27.614-22.386-50-50-50 27.614 0 50-22.386 50-50s-22.386-50-50-50c27.614 0 50-22.386 50-50-27.614 0-50 22.386-50 50 0-27.614-22.386-50-50-50m50 150c0-27.614-22.386-50-50-50 0 27.614 22.386 50 50 50m-50-50c27.614 0 50-22.386 50-50 0 27.614 22.386 50 50 50-27.614 0-50 22.386-50 50-27.614 0-50 22.386-50 50 0-27.614-22.386-50-50-50 27.614 0 50-22.386 50-50m0 0c-27.614 0-50 22.386-50 50 0-27.614-22.386-50-50-50 27.614 0 50-22.386 50-50 0 27.614 22.386 50 50 50m0 0c0-27.614 22.386-50 50-50-27.614 0-50-22.386-50-50 0 27.614-22.386 50-50 50 27.614 0 50 22.386 50 50" clip-rule="evenodd"/></g></svg>',
	bone: '<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M.002 200 0 199.5c0-25.389 18.737-46.403 43.137-49.967C18.77 146.188 0 125.286 0 100c0-27.614 22.386-50 50-50h.5C22.777 50 .27 27.66.002 0h199.996c-.269 27.66-22.774 50-50.498 50h.5c27.614 0 50 22.386 50 50 0 25.286-18.77 46.188-43.137 49.533C181.263 153.097 200 174.111 200 199.5l-.002.5z" clip-rule="evenodd"/></g></svg>',
	pill: '<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M99.998 0H38C17.013 0 0 17.013 0 38v124c0 20.987 17.013 38 38 38h61.998l.002-.5.002.5H162c20.987 0 38-17.013 38-38V38c0-20.987-17.013-38-38-38h-61.998c.269 27.66 22.774 50 50.498 50h-.5c-27.614 0-50 22.386-50 50 0-27.614-22.386-50-50-50h-.5c27.724 0 50.23-22.34 50.498-50M100 100c0 25.286-18.77 46.188-43.137 49.533C81.263 153.097 100 174.111 100 199.5c0-25.389 18.737-46.403 43.137-49.967C118.77 146.188 100 125.286 100 100" clip-rule="evenodd"/></g></svg>',
	clover:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M100 50c0-27.614-22.386-50-50-50 0 27.61 22.38 49.994 49.988 50C72.379 50.007 50 72.39 50 100c0-27.614-22.386-50-50-50 0 27.614 22.386 50 50 50-27.614 0-50 22.386-50 50 27.61 0 49.993-22.378 50-49.986C50.008 127.622 72.39 150 100 150c-27.614 0-50 22.386-50 50 27.614 0 50-22.386 50-50 27.614 0 50-22.386 50-50 0 27.614 22.386 50 50 50 0-27.614-22.386-50-50-50 0-27.614-22.386-50-50-50m50-50c-27.614 0-50 22.386-50 50 27.614 0 50-22.386 50-50m0 200c-27.614 0-50-22.386-50-50 27.614 0 50 22.386 50 50m50-150c0 27.614-22.386 50-50 50 0-27.614 22.386-50 50-50" clip-rule="evenodd"/></g></svg>',
	"key-shape":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="m75.55 178.786-.001.001-12.635-12.635Q63 167.315 63 168.5c0 17.397-14.103 31.5-31.5 31.5S0 185.897 0 168.5 14.103 137 31.5 137q1.185 0 2.348.086l-12.985-12.985.002-.003C7.958 110.931 0 92.895 0 73 0 32.683 32.683 0 73 0c19.895 0 37.931 7.958 51.098 20.865l.002-.002.391.39.256.256 12.339 12.34A32 32 0 0 1 137 31.5C137 14.103 151.103 0 168.5 0S200 14.103 200 31.5 185.897 63 168.5 63q-1.185-.001-2.349-.086l12.341 12.34.253.254.041.041C191.898 88.746 200 106.927 200 127c0 40.317-32.683 73-73 73-20.073 0-38.254-8.102-51.45-21.214" clip-rule="evenodd"/></g></svg>',
	"clover-alt":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" d="M100 200q-9.896 0-18.23-4.948-8.071-4.687-13.02-12.76-4.687-8.334-4.687-18.23 0-12.5 5.729-20.833 5.73-8.333 17.708-19.531 8.854-8.073 8.854-15.365v-4.687h-4.687q-8.073 0-22.136 16.146-13.802 16.145-33.594 16.145-9.895 0-18.229-4.687-8.073-4.948-13.02-13.021Q0 109.896 0 100t4.688-17.969q4.947-8.333 13.02-13.02 8.334-4.949 18.23-4.948 19.53 0 33.333 15.885t22.396 15.885h4.687v-4.166q0-7.293-8.854-15.365l-5.99-5.469Q75 64.843 69.531 56.51q-5.469-8.593-5.469-20.572 0-9.896 4.688-17.97 4.948-8.332 13.02-13.02Q90.105 0 100 0t17.969 4.948q8.333 4.948 13.021 13.02 4.947 8.074 4.947 17.97 0 19.53-15.885 33.333t-15.885 22.396v4.166h4.166q8.854 0 22.396-15.885 13.28-15.885 33.334-15.885 9.895 0 17.968 4.947 8.334 4.688 13.021 12.76Q200 89.846 200 100q0 9.896-4.948 18.229-4.687 8.073-13.021 13.021-8.073 4.687-17.968 4.687-12.24 0-21.094-5.989-8.594-5.99-19.271-17.448-8.073-8.854-15.365-8.854h-4.166v4.687q0 9.636 15.885 22.396t15.885 33.333q0 9.897-4.947 18.23-4.688 8.073-12.761 12.76Q110.156 200 100 200"/></g></svg>',
	"chevron-drop":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M50 0H0v100c0 55.228 44.772 100 100 100s100-44.772 100-100V0h-50c-27.614 0-50 22.386-50 50 0-27.614-22.386-50-50-50" clip-rule="evenodd"/></g></svg>',
	zigzag:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M100 0H0l100 100H0l100 100h100L100 100h100z" clip-rule="evenodd"/></g></svg>',
	"arrow-tri":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M0 0v50l100 50L0 150v50l100-50v50l100-50V50L100 0v50zm100 50v100l100-50z" clip-rule="evenodd"/></g></svg>',
	propeller:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M146.371 34.589a24.8 24.8 0 0 0 1.894-9.567 24.993 24.993 0 0 0-42.621-17.728l-5.64 5.253-5.602-5.235a25 25 0 1 0-35.334 35.377l38.48 39.048a3.45 3.45 0 0 0 4.912 0l38.48-39.048a24.8 24.8 0 0 0 5.431-8.1M53.629 165.41a24.8 24.8 0 0 0-1.894 9.567 24.994 24.994 0 0 0 29.82 24.533 25 25 0 0 0 12.8-6.805l5.641-5.253 5.602 5.235a24.999 24.999 0 0 0 42.667-17.703 25 25 0 0 0-7.333-17.674l-38.48-39.048a3.436 3.436 0 0 0-3.787-.761 3.4 3.4 0 0 0-1.125.761l-38.48 39.048a24.8 24.8 0 0 0-5.431 8.1m121.349-17.145a24.85 24.85 0 0 1-17.667-7.326l-39.048-38.479a3.445 3.445 0 0 1 0-4.913l39.048-38.48a25.001 25.001 0 0 1 35.377 35.335l-5.235 5.601 5.253 5.641a24.995 24.995 0 0 1-3.851 38.422 25 25 0 0 1-13.877 4.199M34.588 53.628a24.8 24.8 0 0 0-9.566-1.894A24.993 24.993 0 0 0 7.294 94.355l5.253 5.64-5.235 5.602a25.002 25.002 0 0 0 17.704 42.668 25 25 0 0 0 17.673-7.334l39.048-38.479a3.446 3.446 0 0 0 0-4.913L42.69 59.06a24.8 24.8 0 0 0-8.1-5.431" clip-rule="evenodd"/></g></svg>',
	gear: '<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M120 14.286C120 6.396 113.604 0 105.714 0H94.286C86.396 0 80 6.396 80 14.286v2.94c0 12.728-15.388 19.102-24.387 10.102l-2.08-2.08c-5.579-5.578-14.624-5.578-20.203 0l-8.081 8.082c-5.58 5.579-5.58 14.624 0 20.203l2.08 2.08C36.328 64.613 29.954 80 17.226 80h-2.941C6.396 80 0 86.396 0 94.286v11.428C0 113.604 6.396 120 14.286 120h2.94c12.728 0 19.102 15.388 10.103 24.387l-2.08 2.08c-5.58 5.579-5.58 14.624 0 20.203l8.08 8.081c5.58 5.579 14.625 5.579 20.204 0l2.08-2.08c9-8.999 24.387-2.625 24.387 10.102v2.941C80 193.604 86.396 200 94.286 200h11.428c7.89 0 14.286-6.396 14.286-14.286v-2.941c0-12.727 15.388-19.101 24.387-10.102l2.08 2.08c5.579 5.579 14.624 5.579 20.203 0l8.081-8.081c5.579-5.579 5.579-14.624 0-20.203l-2.079-2.08c-9-8.999-2.626-24.387 10.101-24.387h2.941c7.89 0 14.286-6.396 14.286-14.286V94.286C200 86.396 193.604 80 185.714 80h-2.941c-12.727 0-19.101-15.388-10.102-24.387l2.08-2.08c5.579-5.579 5.579-14.624 0-20.203l-8.081-8.081c-5.579-5.58-14.624-5.58-20.203 0l-2.08 2.08C135.388 36.327 120 29.953 120 17.226z" clip-rule="evenodd"/></g></svg>',
	"gear-hex":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><path fill="${color}" fill-rule="evenodd" d="M128.603 16.335c-12.778-21.78-44.267-21.78-57.045 0l-.464.79A33.07 33.07 0 0 1 42.803 33.46l-.917.006C16.635 33.643.89 60.912 13.363 82.869l.453.797a33.07 33.07 0 0 1 0 32.668l-.453.797c-12.472 21.957 3.272 49.226 28.523 49.403l.917.006a33.07 33.07 0 0 1 28.29 16.334l.465.791c12.778 21.78 44.267 21.78 57.045 0l.464-.791a33.07 33.07 0 0 1 28.291-16.334l.918-.006c25.251-.177 40.995-27.446 28.522-49.403l-.453-.797a33.07 33.07 0 0 1 0-32.668l.453-.797c12.473-21.957-3.271-49.226-28.522-49.403l-.918-.006a33.07 33.07 0 0 1-28.291-16.334zm-28.522 133.269c27.395 0 49.604-22.208 49.604-49.604s-22.209-49.604-49.604-49.604c-27.396 0-49.605 22.208-49.605 49.604s22.209 49.604 49.605 49.604" clip-rule="evenodd"/></svg>',
	cog: '<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M110 0c5.523 0 10 4.477 10 10v17.574c0 8.909 10.771 13.37 17.071 7.07l12.426-12.426c3.906-3.905 10.237-3.905 14.143 0l14.142 14.142c3.905 3.906 3.905 10.237 0 14.142L165.355 62.93c-6.299 6.3-1.838 17.071 7.071 17.071H190c5.523 0 10 4.477 10 10v20c0 5.523-4.477 10-10 10h-17.574c-8.909 0-13.37 10.771-7.071 17.071l12.427 12.426c3.905 3.906 3.905 10.237 0 14.143l-14.142 14.142c-3.906 3.905-10.237 3.905-14.143 0l-12.426-12.427c-6.3-6.299-17.071-1.838-17.071 7.071V190c0 5.523-4.477 10-10 10H90c-5.523 0-10-4.477-10-10v-17.574c0-8.909-10.771-13.37-17.071-7.071l-12.427 12.427c-3.905 3.905-10.236 3.905-14.142 0L22.218 163.64c-3.905-3.906-3.905-10.237 0-14.143l12.427-12.426c6.3-6.3 1.838-17.071-7.071-17.071H10c-5.523 0-10-4.477-10-10V90c0-5.523 4.477-10 10-10h17.574c8.909 0 13.37-10.771 7.07-17.071L22.219 50.502c-3.905-3.905-3.905-10.236 0-14.142L36.36 22.218c3.906-3.905 10.237-3.905 14.142 0L62.93 34.645c6.3 6.3 17.071 1.838 17.071-7.071V10c0-5.523 4.477-10 10-10zm-10 150c27.614 0 50-22.386 50-50s-22.386-50-50-50-50 22.386-50 50 22.386 50 50 50" clip-rule="evenodd"/></g></svg>',
	"sun-rays":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M101.604.86c-.777-1.295-2.654-1.295-3.43 0L79.31 32.308a2 2 0 0 1-2.498.812L43.068 18.764c-1.39-.59-2.908.512-2.775 2.017l3.225 36.529a2 2 0 0 1-1.544 2.125l-35.738 8.22c-1.471.34-2.051 2.124-1.06 3.263l24.081 27.657a2 2 0 0 1 0 2.627l-24.08 27.657c-.992 1.139-.412 2.924 1.06 3.262l35.738 8.221a2 2 0 0 1 1.543 2.125l-3.225 36.529c-.133 1.505 1.386 2.608 2.775 2.017l33.745-14.356a2 2 0 0 1 2.498.812l18.862 31.448c.777 1.296 2.654 1.295 3.431 0l18.862-31.448a2 2 0 0 1 2.498-.812l33.745 14.356c1.389.591 2.908-.512 2.775-2.017l-3.225-36.529a2 2 0 0 1 1.544-2.125l35.738-8.221c1.471-.338 2.051-2.123 1.06-3.262l-24.081-27.657a2 2 0 0 1 0-2.627l24.081-27.657c.991-1.139.411-2.924-1.06-3.262l-35.738-8.221a2 2 0 0 1-1.544-2.125l3.225-36.53c.133-1.504-1.386-2.607-2.775-2.016L122.964 33.12a2 2 0 0 1-2.498-.812zM100 150c27.614 0 50-22.386 50-50s-22.386-50-50-50-50 22.386-50 50 22.386 50 50 50" clip-rule="evenodd"/></g></svg>',
	semicircle:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><path fill="${color}" fill-rule="evenodd" d="M200 150c0-55.228-44.772-100-100-100S0 94.772 0 150z" clip-rule="evenodd"/></svg>',
	"arc-double":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><path fill="${color}" fill-rule="evenodd" d="M199.06 140.014c.545 5.496-3.985 9.986-9.508 9.986h-36.25c-5.523 0-9.882-4.537-11.129-9.917-4.492-19.385-21.869-33.833-42.62-33.833-20.752 0-38.13 14.448-42.622 33.833-1.247 5.38-5.606 9.917-11.129 9.917H9.552C4.03 150-.5 145.51.045 140.014 5.055 89.474 47.694 50 99.552 50s94.497 39.474 99.508 90.014" clip-rule="evenodd"/></svg>',
	donut:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M100 200c55.228 0 100-44.772 100-100S155.228 0 100 0 0 44.772 0 100s44.772 100 100 100m0-56.25c24.162 0 43.75-19.588 43.75-43.75S124.162 56.25 100 56.25 56.25 75.838 56.25 100s19.588 43.75 43.75 43.75" clip-rule="evenodd"/></g></svg>',
	"circles-corners":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M50 100c27.614 0 50-22.386 50-50 0 27.614 22.386 50 50 50-27.614 0-50 22.386-50 50 0-27.614-22.386-50-50-50m0 0c-27.614 0-50 22.386-50 50s22.386 50 50 50 50-22.386 50-50c0 27.614 22.386 50 50 50s50-22.386 50-50-22.386-50-50-50c27.614 0 50-22.386 50-50S177.614 0 150 0s-50 22.386-50 50c0-27.614-22.386-50-50-50S0 22.386 0 50s22.386 50 50 50" clip-rule="evenodd"/></g></svg>',
	"ellipse-cross":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M112.548 87.452c9.161-3.92 22.545-6.391 37.452-6.391 27.614 0 50 8.48 50 18.939 0 10.46-22.386 18.939-50 18.939-14.907 0-28.291-2.471-37.452-6.391 3.92 9.161 6.391 22.545 6.391 37.452 0 27.614-8.479 50-18.939 50s-18.94-22.386-18.94-50c0-14.907 2.472-28.291 6.392-37.452-9.16 3.92-22.544 6.391-37.452 6.391-27.614 0-50-8.479-50-18.939s22.386-18.94 50-18.94c14.907 0 28.291 2.472 37.452 6.392-3.92-9.16-6.391-22.544-6.391-37.452 0-27.614 8.48-50 18.939-50 10.46 0 18.939 22.386 18.939 50 0 14.907-2.471 28.291-6.391 37.452" clip-rule="evenodd"/></g></svg>',
	drop: '<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><path fill="${color}" d="M170 129.496C170 168.434 138.66 200 100 200s-70-31.566-70-70.504c0-36.857 35.84-81.29 65.113-122.542 2.4-3.381 7.425-3.415 9.861-.06C135.351 48.737 170 92.591 170 129.496"/></svg>',
	eye: '<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" d="M200 99.588s-44.772 50.588-100 50.588S0 99.588 0 99.588 44.772 49 100 49s100 50.588 100 50.588"/></g></svg>',
	"eye-ring":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><path fill="${color}" fill-rule="evenodd" d="M100 153.877c41.147 0 76.851-26.337 94.627-42.204 7.162-6.393 7.162-17.076 0-23.469C176.851 72.337 141.147 46 99.999 46 58.852 46 23.148 72.337 5.372 88.204c-7.163 6.393-7.163 17.076 0 23.469 17.776 15.867 53.48 42.204 94.627 42.204m0-16.307c20.783 0 37.631-16.848 37.631-37.632s-16.848-37.631-37.632-37.631-37.631 16.848-37.631 37.631 16.848 37.632 37.631 37.632" clip-rule="evenodd"/></svg>',
	"diamond-eye":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M58.658 147.786a13.22 13.22 0 0 0-6.44-6.441C30.116 131.123 12.633 116.382 3.3 107.542c-4.401-4.17-4.401-10.91 0-15.08 9.333-8.841 26.816-23.582 48.916-33.804a13.22 13.22 0 0 0 6.441-6.44C68.88 30.116 83.621 12.633 92.461 3.3c4.17-4.401 10.911-4.401 15.081 0 8.84 9.333 23.581 26.816 33.803 48.916a13.22 13.22 0 0 0 6.441 6.441c22.101 10.222 39.584 24.963 48.916 33.803 4.402 4.17 4.402 10.911 0 15.081-9.332 8.84-26.815 23.581-48.916 33.803a13.23 13.23 0 0 0-6.441 6.441c-10.222 22.101-24.963 39.584-33.803 48.916-4.17 4.402-10.91 4.402-15.08 0-8.841-9.332-23.582-26.815-33.804-48.916m41.344-11.025c20.301 0 36.759-16.458 36.759-36.759s-16.458-36.76-36.759-36.76-36.76 16.458-36.76 36.76c0 20.301 16.458 36.759 36.76 36.759" clip-rule="evenodd"/></g></svg>',
	lightning:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M200 100.671 100 0 0 100.671h98.667L0 200h200l-98.667-99.329z" clip-rule="evenodd"/></g></svg>',
	"arrow-cross":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M100 24.859 66.667 0v66.667H0L24.859 100 0 133.333h66.667V66.667h66.666V0zM175.141 100 200 66.667h-66.667v66.666H66.667V200L100 175.141 133.333 200v-66.667H200z" clip-rule="evenodd"/></g></svg>',
	"hexagon-arrows":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M162.963 37.037 100 0 37.037 37.037 0 100l37.037 62.963V37.037zM37.037 162.963 100 200l62.963-37.037L200 100l-37.037-62.963v125.926z" clip-rule="evenodd"/></g></svg>',
	ribbon:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M100 22c0-12.15-9.85-22-22-22H22C9.85 0 0 9.85 0 22v56.72c0 12.15 9.85 21.999 22 21.999h56c12.15 0 22 9.85 22 22V178c0 12.15 9.85 22 22 22h56c12.15 0 22-9.85 22-22v-56.72c0-12.15-9.85-22-22-22h-56c-12.15 0-22-9.85-22-22z" clip-rule="evenodd"/></g></svg>',
	squares:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M18.405 100.422C8.318 102.425.715 111.325.715 122v56c0 12.15 9.849 22 22 22h56c10.925 0 19.99-7.965 21.707-18.405 2.003 10.087 10.903 17.691 21.578 17.691h56c12.15 0 22-9.85 22-22v-56c0-10.926-7.965-19.992-18.404-21.708 10.086-2.003 17.69-10.903 17.69-21.578V22c0-12.15-9.85-22-22-22h-56c-10.926 0-19.992 7.965-21.708 18.405C97.575 8.318 88.675.715 78 .715H22c-12.15 0-22 9.849-22 22v56c0 10.925 7.965 19.99 18.405 21.707" clip-rule="evenodd"/></g></svg>',
	sparkle:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" d="M100 200c-2.895-94.738-5.262-97.09-100-100 94.738-2.895 97.09-5.262 100-100 2.895 94.738 5.262 97.09 100 100-94.738 2.91-97.09 5.233-100 100"/></g></svg>',
	hex: '<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" d="M71.558 16.335c12.778-21.78 44.267-21.78 57.045 0l.464.79a33.07 33.07 0 0 0 28.291 16.335l.918.006c25.251.177 40.995 27.446 28.522 49.403l-.453.797a33.07 33.07 0 0 0 0 32.668l.453.797c12.473 21.957-3.271 49.226-28.522 49.403l-.918.006a33.07 33.07 0 0 0-28.291 16.334l-.464.791c-12.778 21.78-44.267 21.78-57.045 0l-.464-.791a33.07 33.07 0 0 0-28.291-16.334l-.917-.006c-25.251-.177-40.995-27.446-28.523-49.403l.453-.797a33.07 33.07 0 0 0 0-32.668l-.453-.797C.89 60.912 16.635 33.643 41.886 33.466l.917-.006a33.07 33.07 0 0 0 28.29-16.334z"/></g></svg>',
	diamond:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" d="M100 0c3.395 53.76 46.24 96.605 100 100-53.76 3.395-96.605 46.24-100 100-3.395-53.76-46.24-96.605-100-100C53.76 96.605 96.605 53.76 100 0"/></g></svg>',
	"star-4pt":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" d="m100 0 1.384 87.067c.056 3.502 4.267 5.246 6.783 2.81l62.544-60.588-60.587 62.545c-2.437 2.515-.693 6.726 2.809 6.782L200 100l-87.067 1.384c-3.502.056-5.246 4.267-2.809 6.783l60.587 62.544-62.544-60.587c-2.516-2.437-6.727-.693-6.783 2.809L100 200l-1.384-87.067c-.056-3.502-4.267-5.246-6.782-2.809l-62.545 60.587 60.587-62.544c2.437-2.516.693-6.727-2.81-6.783L0 100l87.067-1.384c3.502-.056 5.246-4.267 2.81-6.782L29.288 29.289l62.545 60.587c2.515 2.437 6.726.693 6.782-2.81z"/></g></svg>',
	"star-8pt":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" d="m100 0 3.215 92.24 67.496-62.95-62.95 67.496L200 100l-92.239 3.215 62.95 67.496-67.496-62.95L100 200l-3.215-92.239-67.496 62.95 62.95-67.496L0 100l92.24-3.215L29.29 29.29l67.496 62.95z"/></g></svg>',
	hourglass:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><path fill="${color}" fill-rule="evenodd" d="M122.363 90.35a15 15 0 0 0 0 19.3l38.404 45.699c8.201 9.759 1.264 24.651-11.483 24.651H51.029c-12.747 0-19.684-14.892-11.484-24.651L77.95 109.65a15 15 0 0 0 0-19.3l-38.405-45.7C31.345 34.892 38.282 20 51.03 20h98.255c12.746 0 19.684 14.892 11.483 24.65z" clip-rule="evenodd"/></svg>',
	"cloud-flower":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M29.29 29.29C19.265 39.312 15.645 53.314 18.43 66.211 7.34 73.364 0 85.825 0 100s7.341 26.636 18.43 33.788c-2.784 12.897.836 26.899 10.86 36.923 10.023 10.023 24.025 13.643 36.922 10.86C73.364 192.659 85.825 200 100 200s26.636-7.341 33.788-18.429c12.897 2.783 26.899-.837 36.923-10.86 10.023-10.024 13.643-24.026 10.86-36.923C192.659 126.636 200 114.175 200 100s-7.341-26.636-18.429-33.788c2.783-12.897-.837-26.9-10.86-36.923s-24.026-13.643-36.923-10.86C126.636 7.341 114.175 0 100 0S73.364 7.341 66.212 18.43c-12.897-2.784-26.9.836-36.923 10.86" clip-rule="evenodd"/></g></svg>',
	paw: '<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><path fill="${color}" fill-rule="evenodd" d="M169.909 139.373c-8.173-9.433-9.501-24.163-4.077-35.403C170.425 94.452 173 83.777 173 72.5 173 32.46 140.541 0 100.5 0S28 32.46 28 72.5c0 11.022 2.46 21.47 6.86 30.824 5.312 11.293 3.84 26.01-4.425 35.362-10.252 11.602-17.641 25.792-21.063 41.465C7.016 190.942 16.194 200 27.24 200h145.263c11.046 0 20.225-9.057 17.869-19.849-3.355-15.365-10.523-29.306-20.463-40.778" clip-rule="evenodd"/></svg>',
	squircle:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" d="M0 0h100c55.228 0 100 44.772 100 100v100H100C44.772 200 0 155.228 0 100z"/></g></svg>',
	"circle-ring":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M188 100c0 48.601-39.399 88-88 88s-88-39.399-88-88 39.399-88 88-88 88 39.399 88 88m12 0c0 55.228-44.772 100-100 100S0 155.228 0 100 44.772 0 100 0s100 44.772 100 100m-100 11c6.075 0 11-4.925 11-11s-4.925-11-11-11-11 4.925-11 11 4.925 11 11 11" clip-rule="evenodd"/></g></svg>',
	crescent:
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><path fill="${color}" fill-rule="evenodd" d="M32 100.641c0-32.25 22.165-59.29 52-66.53V1.28C36.377 8.99 0 50.54 0 100.641S36.377 192.293 84 200v-32.829c-29.835-7.241-52-34.281-52-66.53m168 0c0 50.101-36.377 91.652-84 99.359v-32.829c29.835-7.241 52-34.281 52-66.53s-22.165-59.29-52-66.53V1.28c47.623 7.708 84 49.258 84 99.36" clip-rule="evenodd"/></svg>',
	"spiral-circles":
		'<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="${color}"><g clip-path="url(#a)"><path fill="${color}" fill-rule="evenodd" d="M100 33.645c-7.226 0-13.084 5.858-13.084 13.084H53.27C53.271 20.921 74.192 0 100 0s46.729 20.921 46.729 46.729S125.808 93.458 100 93.458V59.813c7.226 0 13.084-5.858 13.084-13.084S107.226 33.645 100 33.645M166.355 100c0-7.226-5.858-13.084-13.084-13.084V53.27C179.079 53.271 200 74.192 200 100s-20.921 46.729-46.729 46.729-46.729-20.921-46.729-46.729h33.645c0 7.226 5.858 13.084 13.084 13.084s13.084-5.858 13.084-13.084M46.729 113.084c-7.226 0-13.084-5.858-13.084-13.084s5.858-13.084 13.084-13.084S59.813 92.774 59.813 100h33.645c0-25.808-20.921-46.729-46.729-46.729S0 74.192 0 100s20.921 46.729 46.729 46.729zM100 166.355c7.226 0 13.084-5.858 13.084-13.084h33.645C146.729 179.079 125.808 200 100 200s-46.729-20.921-46.729-46.729S74.192 106.542 100 106.542v33.645c-7.226 0-13.084 5.858-13.084 13.084s5.858 13.084 13.084 13.084" clip-rule="evenodd"/></g></svg>',
};

// Convert svgShapesMap to array for rendering
export const svgShapesArray = Object.entries(svgShapesMap).map(
	([key, svg]) => ({
		id: key,
		name: key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
		svg: svg,
	})
);

// Create SVG Shape Components from svgShapesMap
const createSvgShapeComponent = (svgString, displayName) => {
	const Component = ({
		size = 24,
		color = "currentColor",
		className = "",
		...props
	}) => {
		const processedSvg = svgString
			.replace(/\$\{width\}/g, String(size))
			.replace(/\$\{height\}/g, String(size))
			.replace(/\$\{color\}/g, color);

		return (
			<span
				className={className}
				style={{ display: "inline-flex", width: size, height: size }}
				dangerouslySetInnerHTML={{ __html: processedSvg }}
				{...props}
			/>
		);
	};
	Component.displayName = displayName;
	return Component;
};

// SVG Shape Components
export const StarBurstShape = createSvgShapeComponent(
	svgShapesMap["star-burst"],
	"StarBurstShape"
);
export const CrossShape = createSvgShapeComponent(
	svgShapesMap["cross"],
	"CrossShape"
);
export const WaveShape = createSvgShapeComponent(
	svgShapesMap["wave"],
	"WaveShape"
);
export const PinwheelShape = createSvgShapeComponent(
	svgShapesMap["pinwheel"],
	"PinwheelShape"
);
export const ArrowFoldShape = createSvgShapeComponent(
	svgShapesMap["arrow-fold"],
	"ArrowFoldShape"
);
export const ChainShape = createSvgShapeComponent(
	svgShapesMap["chain"],
	"ChainShape"
);
export const ColumnsShape = createSvgShapeComponent(
	svgShapesMap["columns"],
	"ColumnsShape"
);
export const QuarterCirclesShape = createSvgShapeComponent(
	svgShapesMap["quarter-circles"],
	"QuarterCirclesShape"
);
export const PetalsShape = createSvgShapeComponent(
	svgShapesMap["petals"],
	"PetalsShape"
);
export const ArchSplitShape = createSvgShapeComponent(
	svgShapesMap["arch-split"],
	"ArchSplitShape"
);
export const LeafQuartersShape = createSvgShapeComponent(
	svgShapesMap["leaf-quarters"],
	"LeafQuartersShape"
);
export const CornerCirclesShape = createSvgShapeComponent(
	svgShapesMap["corner-circles"],
	"CornerCirclesShape"
);
export const PuzzleShape = createSvgShapeComponent(
	svgShapesMap["puzzle"],
	"PuzzleShape"
);
export const TargetShape = createSvgShapeComponent(
	svgShapesMap["target"],
	"TargetShape"
);
export const GridPlusShape = createSvgShapeComponent(
	svgShapesMap["grid-plus"],
	"GridPlusShape"
);
export const DiamondDotsShape = createSvgShapeComponent(
	svgShapesMap["diamond-dots"],
	"DiamondDotsShape"
);
export const BlobShape = createSvgShapeComponent(
	svgShapesMap["blob"],
	"BlobShape"
);
export const FlowerShape = createSvgShapeComponent(
	svgShapesMap["flower"],
	"FlowerShape"
);
export const FourPetalsShape = createSvgShapeComponent(
	svgShapesMap["four-petals"],
	"FourPetalsShape"
);
export const BoneShape = createSvgShapeComponent(
	svgShapesMap["bone"],
	"BoneShape"
);
export const PillShape = createSvgShapeComponent(
	svgShapesMap["pill"],
	"PillShape"
);
export const CloverShape = createSvgShapeComponent(
	svgShapesMap["clover"],
	"CloverShape"
);
export const KeyShapeIcon = createSvgShapeComponent(
	svgShapesMap["key-shape"],
	"KeyShapeIcon"
);
export const CloverAltShape = createSvgShapeComponent(
	svgShapesMap["clover-alt"],
	"CloverAltShape"
);
export const ChevronDropShape = createSvgShapeComponent(
	svgShapesMap["chevron-drop"],
	"ChevronDropShape"
);
export const ZigzagShape = createSvgShapeComponent(
	svgShapesMap["zigzag"],
	"ZigzagShape"
);
export const ArrowTriShape = createSvgShapeComponent(
	svgShapesMap["arrow-tri"],
	"ArrowTriShape"
);
export const PropellerShape = createSvgShapeComponent(
	svgShapesMap["propeller"],
	"PropellerShape"
);
export const GearShape = createSvgShapeComponent(
	svgShapesMap["gear"],
	"GearShape"
);
export const GearHexShape = createSvgShapeComponent(
	svgShapesMap["gear-hex"],
	"GearHexShape"
);
export const CogShape = createSvgShapeComponent(
	svgShapesMap["cog"],
	"CogShape"
);
export const SunRaysShape = createSvgShapeComponent(
	svgShapesMap["sun-rays"],
	"SunRaysShape"
);
export const SemicircleShape = createSvgShapeComponent(
	svgShapesMap["semicircle"],
	"SemicircleShape"
);
export const ArcDoubleShape = createSvgShapeComponent(
	svgShapesMap["arc-double"],
	"ArcDoubleShape"
);
export const DonutShape = createSvgShapeComponent(
	svgShapesMap["donut"],
	"DonutShape"
);
export const CirclesCornersShape = createSvgShapeComponent(
	svgShapesMap["circles-corners"],
	"CirclesCornersShape"
);
export const EllipseCrossShape = createSvgShapeComponent(
	svgShapesMap["ellipse-cross"],
	"EllipseCrossShape"
);
export const DropShape = createSvgShapeComponent(
	svgShapesMap["drop"],
	"DropShape"
);
export const EyeShape = createSvgShapeComponent(
	svgShapesMap["eye"],
	"EyeShape"
);
export const EyeRingShape = createSvgShapeComponent(
	svgShapesMap["eye-ring"],
	"EyeRingShape"
);
export const DiamondEyeShape = createSvgShapeComponent(
	svgShapesMap["diamond-eye"],
	"DiamondEyeShape"
);
export const LightningShape = createSvgShapeComponent(
	svgShapesMap["lightning"],
	"LightningShape"
);
export const ArrowCrossShape = createSvgShapeComponent(
	svgShapesMap["arrow-cross"],
	"ArrowCrossShape"
);
export const HexagonArrowsShape = createSvgShapeComponent(
	svgShapesMap["hexagon-arrows"],
	"HexagonArrowsShape"
);
export const RibbonShape = createSvgShapeComponent(
	svgShapesMap["ribbon"],
	"RibbonShape"
);
export const SquaresShape = createSvgShapeComponent(
	svgShapesMap["squares"],
	"SquaresShape"
);
export const SparkleShape = createSvgShapeComponent(
	svgShapesMap["sparkle"],
	"SparkleShape"
);
export const HexShape = createSvgShapeComponent(
	svgShapesMap["hex"],
	"HexShape"
);
export const DiamondShape = createSvgShapeComponent(
	svgShapesMap["diamond"],
	"DiamondShape"
);
export const Star4ptShape = createSvgShapeComponent(
	svgShapesMap["star-4pt"],
	"Star4ptShape"
);
export const Star8ptShape = createSvgShapeComponent(
	svgShapesMap["star-8pt"],
	"Star8ptShape"
);
export const HourglassShape = createSvgShapeComponent(
	svgShapesMap["hourglass"],
	"HourglassShape"
);
export const CloudFlowerShape = createSvgShapeComponent(
	svgShapesMap["cloud-flower"],
	"CloudFlowerShape"
);
export const PawShape = createSvgShapeComponent(
	svgShapesMap["paw"],
	"PawShape"
);
export const SquircleShape = createSvgShapeComponent(
	svgShapesMap["squircle"],
	"SquircleShape"
);
export const CircleRingShape = createSvgShapeComponent(
	svgShapesMap["circle-ring"],
	"CircleRingShape"
);
export const CrescentShape = createSvgShapeComponent(
	svgShapesMap["crescent"],
	"CrescentShape"
);
export const SpiralCirclesShape = createSvgShapeComponent(
	svgShapesMap["spiral-circles"],
	"SpiralCirclesShape"
);

// Create Flag Component helper
const createFlagComponent = (emoji, displayName) => {
	const Component = ({ size = 24, className = "", ...props }) => (
		<span
			className={className}
			style={{
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: size,
				height: size,
				fontSize: size * 0.8,
				lineHeight: 1,
			}}
			role="img"
			aria-label={displayName}
			{...props}
		>
			{emoji}
		</span>
	);
	Component.displayName = displayName;
	return Component;
};

// Country Flag Components
export const FlagAfghanistan = createFlagComponent("🇦🇫", "FlagAfghanistan");
export const FlagAlbania = createFlagComponent("🇦🇱", "FlagAlbania");
export const FlagAlgeria = createFlagComponent("🇩🇿", "FlagAlgeria");
export const FlagAndorra = createFlagComponent("🇦🇩", "FlagAndorra");
export const FlagAngola = createFlagComponent("🇦🇴", "FlagAngola");
export const FlagArgentina = createFlagComponent("🇦🇷", "FlagArgentina");
export const FlagArmenia = createFlagComponent("🇦🇲", "FlagArmenia");
export const FlagAustralia = createFlagComponent("🇦🇺", "FlagAustralia");
export const FlagAustria = createFlagComponent("🇦🇹", "FlagAustria");
export const FlagAzerbaijan = createFlagComponent("🇦🇿", "FlagAzerbaijan");
export const FlagBahamas = createFlagComponent("🇧🇸", "FlagBahamas");
export const FlagBahrain = createFlagComponent("🇧🇭", "FlagBahrain");
export const FlagBangladesh = createFlagComponent("🇧🇩", "FlagBangladesh");
export const FlagBarbados = createFlagComponent("🇧🇧", "FlagBarbados");
export const FlagBelarus = createFlagComponent("🇧🇾", "FlagBelarus");
export const FlagBelgium = createFlagComponent("🇧🇪", "FlagBelgium");
export const FlagBelize = createFlagComponent("🇧🇿", "FlagBelize");
export const FlagBenin = createFlagComponent("🇧🇯", "FlagBenin");
export const FlagBhutan = createFlagComponent("🇧🇹", "FlagBhutan");
export const FlagBolivia = createFlagComponent("🇧🇴", "FlagBolivia");
export const FlagBosniaHerzegovina = createFlagComponent(
	"🇧🇦",
	"FlagBosniaHerzegovina"
);
export const FlagBotswana = createFlagComponent("🇧🇼", "FlagBotswana");
export const FlagBrazil = createFlagComponent("🇧🇷", "FlagBrazil");
export const FlagBrunei = createFlagComponent("🇧🇳", "FlagBrunei");
export const FlagBulgaria = createFlagComponent("🇧🇬", "FlagBulgaria");
export const FlagBurkinaFaso = createFlagComponent("🇧🇫", "FlagBurkinaFaso");
export const FlagBurundi = createFlagComponent("🇧🇮", "FlagBurundi");
export const FlagCambodia = createFlagComponent("🇰🇭", "FlagCambodia");
export const FlagCameroon = createFlagComponent("🇨🇲", "FlagCameroon");
export const FlagCanada = createFlagComponent("🇨🇦", "FlagCanada");
export const FlagCapeVerde = createFlagComponent("🇨🇻", "FlagCapeVerde");
export const FlagCentralAfricanRepublic = createFlagComponent(
	"🇨🇫",
	"FlagCentralAfricanRepublic"
);
export const FlagChad = createFlagComponent("🇹🇩", "FlagChad");
export const FlagChile = createFlagComponent("🇨🇱", "FlagChile");
export const FlagChina = createFlagComponent("🇨🇳", "FlagChina");
export const FlagColombia = createFlagComponent("🇨🇴", "FlagColombia");
export const FlagComoros = createFlagComponent("🇰🇲", "FlagComoros");
export const FlagCongo = createFlagComponent("🇨🇬", "FlagCongo");
export const FlagCostaRica = createFlagComponent("🇨🇷", "FlagCostaRica");
export const FlagCroatia = createFlagComponent("🇭🇷", "FlagCroatia");
export const FlagCuba = createFlagComponent("🇨🇺", "FlagCuba");
export const FlagCyprus = createFlagComponent("🇨🇾", "FlagCyprus");
export const FlagCzechia = createFlagComponent("🇨🇿", "FlagCzechia");
export const FlagDenmark = createFlagComponent("🇩🇰", "FlagDenmark");
export const FlagDjibouti = createFlagComponent("🇩🇯", "FlagDjibouti");
export const FlagDominica = createFlagComponent("🇩🇲", "FlagDominica");
export const FlagDominicanRepublic = createFlagComponent(
	"🇩🇴",
	"FlagDominicanRepublic"
);
export const FlagEcuador = createFlagComponent("🇪🇨", "FlagEcuador");
export const FlagEgypt = createFlagComponent("🇪🇬", "FlagEgypt");
export const FlagElSalvador = createFlagComponent("🇸🇻", "FlagElSalvador");
export const FlagEquatorialGuinea = createFlagComponent(
	"🇬🇶",
	"FlagEquatorialGuinea"
);
export const FlagEritrea = createFlagComponent("🇪🇷", "FlagEritrea");
export const FlagEstonia = createFlagComponent("🇪🇪", "FlagEstonia");
export const FlagEswatini = createFlagComponent("🇸🇿", "FlagEswatini");
export const FlagEthiopia = createFlagComponent("🇪🇹", "FlagEthiopia");
export const FlagFiji = createFlagComponent("🇫🇯", "FlagFiji");
export const FlagFinland = createFlagComponent("🇫🇮", "FlagFinland");
export const FlagFrance = createFlagComponent("🇫🇷", "FlagFrance");
export const FlagGabon = createFlagComponent("🇬🇦", "FlagGabon");
export const FlagGambia = createFlagComponent("🇬🇲", "FlagGambia");
export const FlagGeorgia = createFlagComponent("🇬🇪", "FlagGeorgia");
export const FlagGermany = createFlagComponent("🇩🇪", "FlagGermany");
export const FlagGhana = createFlagComponent("🇬🇭", "FlagGhana");
export const FlagGreece = createFlagComponent("🇬🇷", "FlagGreece");
export const FlagGrenada = createFlagComponent("🇬🇩", "FlagGrenada");
export const FlagGuatemala = createFlagComponent("🇬🇹", "FlagGuatemala");
export const FlagGuinea = createFlagComponent("🇬🇳", "FlagGuinea");
export const FlagGuineaBissau = createFlagComponent("🇬🇼", "FlagGuineaBissau");
export const FlagGuyana = createFlagComponent("🇬🇾", "FlagGuyana");
export const FlagHaiti = createFlagComponent("🇭🇹", "FlagHaiti");
export const FlagHonduras = createFlagComponent("🇭🇳", "FlagHonduras");
export const FlagHungary = createFlagComponent("🇭🇺", "FlagHungary");
export const FlagIceland = createFlagComponent("🇮🇸", "FlagIceland");
export const FlagIndia = createFlagComponent("🇮🇳", "FlagIndia");
export const FlagIndonesia = createFlagComponent("🇮🇩", "FlagIndonesia");
export const FlagIran = createFlagComponent("🇮🇷", "FlagIran");
export const FlagIraq = createFlagComponent("🇮🇶", "FlagIraq");
export const FlagIreland = createFlagComponent("🇮🇪", "FlagIreland");
export const FlagIsrael = createFlagComponent("🇮🇱", "FlagIsrael");
export const FlagItaly = createFlagComponent("🇮🇹", "FlagItaly");
export const FlagIvoryCoast = createFlagComponent("🇨🇮", "FlagIvoryCoast");
export const FlagJamaica = createFlagComponent("🇯🇲", "FlagJamaica");
export const FlagJapan = createFlagComponent("🇯🇵", "FlagJapan");
export const FlagJordan = createFlagComponent("🇯🇴", "FlagJordan");
export const FlagKazakhstan = createFlagComponent("🇰🇿", "FlagKazakhstan");
export const FlagKenya = createFlagComponent("🇰🇪", "FlagKenya");
export const FlagKiribati = createFlagComponent("🇰🇮", "FlagKiribati");
export const FlagKuwait = createFlagComponent("🇰🇼", "FlagKuwait");
export const FlagKyrgyzstan = createFlagComponent("🇰🇬", "FlagKyrgyzstan");
export const FlagLaos = createFlagComponent("🇱🇦", "FlagLaos");
export const FlagLatvia = createFlagComponent("🇱🇻", "FlagLatvia");
export const FlagLebanon = createFlagComponent("🇱🇧", "FlagLebanon");
export const FlagLesotho = createFlagComponent("🇱🇸", "FlagLesotho");
export const FlagLiberia = createFlagComponent("🇱🇷", "FlagLiberia");
export const FlagLibya = createFlagComponent("🇱🇾", "FlagLibya");
export const FlagLiechtenstein = createFlagComponent("🇱🇮", "FlagLiechtenstein");
export const FlagLithuania = createFlagComponent("🇱🇹", "FlagLithuania");
export const FlagLuxembourg = createFlagComponent("🇱🇺", "FlagLuxembourg");
export const FlagMadagascar = createFlagComponent("🇲🇬", "FlagMadagascar");
export const FlagMalawi = createFlagComponent("🇲🇼", "FlagMalawi");
export const FlagMalaysia = createFlagComponent("🇲🇾", "FlagMalaysia");
export const FlagMaldives = createFlagComponent("🇲🇻", "FlagMaldives");
export const FlagMali = createFlagComponent("🇲🇱", "FlagMali");
export const FlagMalta = createFlagComponent("🇲🇹", "FlagMalta");
export const FlagMarshallIslands = createFlagComponent(
	"🇲🇭",
	"FlagMarshallIslands"
);
export const FlagMauritania = createFlagComponent("🇲🇷", "FlagMauritania");
export const FlagMauritius = createFlagComponent("🇲🇺", "FlagMauritius");
export const FlagMexico = createFlagComponent("🇲🇽", "FlagMexico");
export const FlagMicronesia = createFlagComponent("🇫🇲", "FlagMicronesia");
export const FlagMoldova = createFlagComponent("🇲🇩", "FlagMoldova");
export const FlagMonaco = createFlagComponent("🇲🇨", "FlagMonaco");
export const FlagMongolia = createFlagComponent("🇲🇳", "FlagMongolia");
export const FlagMontenegro = createFlagComponent("🇲🇪", "FlagMontenegro");
export const FlagMorocco = createFlagComponent("🇲🇦", "FlagMorocco");
export const FlagMozambique = createFlagComponent("🇲🇿", "FlagMozambique");
export const FlagMyanmar = createFlagComponent("🇲🇲", "FlagMyanmar");
export const FlagNamibia = createFlagComponent("🇳🇦", "FlagNamibia");
export const FlagNauru = createFlagComponent("🇳🇷", "FlagNauru");
export const FlagNepal = createFlagComponent("🇳🇵", "FlagNepal");
export const FlagNetherlands = createFlagComponent("🇳🇱", "FlagNetherlands");
export const FlagNewZealand = createFlagComponent("🇳🇿", "FlagNewZealand");
export const FlagNicaragua = createFlagComponent("🇳🇮", "FlagNicaragua");
export const FlagNiger = createFlagComponent("🇳🇪", "FlagNiger");
export const FlagNigeria = createFlagComponent("🇳🇬", "FlagNigeria");
export const FlagNorthKorea = createFlagComponent("🇰🇵", "FlagNorthKorea");
export const FlagNorthMacedonia = createFlagComponent(
	"🇲🇰",
	"FlagNorthMacedonia"
);
export const FlagNorway = createFlagComponent("🇳🇴", "FlagNorway");
export const FlagOman = createFlagComponent("🇴🇲", "FlagOman");
export const FlagPakistan = createFlagComponent("🇵🇰", "FlagPakistan");
export const FlagPalau = createFlagComponent("🇵🇼", "FlagPalau");
export const FlagPalestine = createFlagComponent("🇵🇸", "FlagPalestine");
export const FlagPanama = createFlagComponent("🇵🇦", "FlagPanama");
export const FlagPapuaNewGuinea = createFlagComponent(
	"🇵🇬",
	"FlagPapuaNewGuinea"
);
export const FlagParaguay = createFlagComponent("🇵🇾", "FlagParaguay");
export const FlagPeru = createFlagComponent("🇵🇪", "FlagPeru");
export const FlagPhilippines = createFlagComponent("🇵🇭", "FlagPhilippines");
export const FlagPoland = createFlagComponent("🇵🇱", "FlagPoland");
export const FlagPortugal = createFlagComponent("🇵🇹", "FlagPortugal");
export const FlagQatar = createFlagComponent("🇶🇦", "FlagQatar");
export const FlagRomania = createFlagComponent("🇷🇴", "FlagRomania");
export const FlagRussia = createFlagComponent("🇷🇺", "FlagRussia");
export const FlagRwanda = createFlagComponent("🇷🇼", "FlagRwanda");
export const FlagSaintKittsNevis = createFlagComponent(
	"🇰🇳",
	"FlagSaintKittsNevis"
);
export const FlagSaintLucia = createFlagComponent("🇱🇨", "FlagSaintLucia");
export const FlagSaintVincent = createFlagComponent("🇻🇨", "FlagSaintVincent");
export const FlagSamoa = createFlagComponent("🇼🇸", "FlagSamoa");
export const FlagSanMarino = createFlagComponent("🇸🇲", "FlagSanMarino");
export const FlagSaoTomePrincipe = createFlagComponent(
	"🇸🇹",
	"FlagSaoTomePrincipe"
);
export const FlagSaudiArabia = createFlagComponent("🇸🇦", "FlagSaudiArabia");
export const FlagSenegal = createFlagComponent("🇸🇳", "FlagSenegal");
export const FlagSerbia = createFlagComponent("🇷🇸", "FlagSerbia");
export const FlagSeychelles = createFlagComponent("🇸🇨", "FlagSeychelles");
export const FlagSierraLeone = createFlagComponent("🇸🇱", "FlagSierraLeone");
export const FlagSingapore = createFlagComponent("🇸🇬", "FlagSingapore");
export const FlagSlovakia = createFlagComponent("🇸🇰", "FlagSlovakia");
export const FlagSlovenia = createFlagComponent("🇸🇮", "FlagSlovenia");
export const FlagSolomonIslands = createFlagComponent(
	"🇸🇧",
	"FlagSolomonIslands"
);
export const FlagSomalia = createFlagComponent("🇸🇴", "FlagSomalia");
export const FlagSouthAfrica = createFlagComponent("🇿🇦", "FlagSouthAfrica");
export const FlagSouthKorea = createFlagComponent("🇰🇷", "FlagSouthKorea");
export const FlagSouthSudan = createFlagComponent("🇸🇸", "FlagSouthSudan");
export const FlagSpain = createFlagComponent("🇪🇸", "FlagSpain");
export const FlagSriLanka = createFlagComponent("🇱🇰", "FlagSriLanka");
export const FlagSudan = createFlagComponent("🇸🇩", "FlagSudan");
export const FlagSuriname = createFlagComponent("🇸🇷", "FlagSuriname");
export const FlagSweden = createFlagComponent("🇸🇪", "FlagSweden");
export const FlagSwitzerland = createFlagComponent("🇨🇭", "FlagSwitzerland");
export const FlagSyria = createFlagComponent("🇸🇾", "FlagSyria");
export const FlagTaiwan = createFlagComponent("🇹🇼", "FlagTaiwan");
export const FlagTajikistan = createFlagComponent("🇹🇯", "FlagTajikistan");
export const FlagTanzania = createFlagComponent("🇹🇿", "FlagTanzania");
export const FlagThailand = createFlagComponent("🇹🇭", "FlagThailand");
export const FlagTimorLeste = createFlagComponent("🇹🇱", "FlagTimorLeste");
export const FlagTogo = createFlagComponent("🇹🇬", "FlagTogo");
export const FlagTonga = createFlagComponent("🇹🇴", "FlagTonga");
export const FlagTrinidadTobago = createFlagComponent(
	"🇹🇹",
	"FlagTrinidadTobago"
);
export const FlagTunisia = createFlagComponent("🇹🇳", "FlagTunisia");
export const FlagTurkey = createFlagComponent("🇹🇷", "FlagTurkey");
export const FlagTurkmenistan = createFlagComponent("🇹🇲", "FlagTurkmenistan");
export const FlagTuvalu = createFlagComponent("🇹🇻", "FlagTuvalu");
export const FlagUganda = createFlagComponent("🇺🇬", "FlagUganda");
export const FlagUkraine = createFlagComponent("🇺🇦", "FlagUkraine");
export const FlagUnitedArabEmirates = createFlagComponent(
	"🇦🇪",
	"FlagUnitedArabEmirates"
);
export const FlagUnitedKingdom = createFlagComponent("🇬🇧", "FlagUnitedKingdom");
export const FlagUnitedStates = createFlagComponent("🇺🇸", "FlagUnitedStates");
export const FlagUruguay = createFlagComponent("🇺🇾", "FlagUruguay");
export const FlagUzbekistan = createFlagComponent("🇺🇿", "FlagUzbekistan");
export const FlagVanuatu = createFlagComponent("🇻🇺", "FlagVanuatu");
export const FlagVaticanCity = createFlagComponent("🇻🇦", "FlagVaticanCity");
export const FlagVenezuela = createFlagComponent("🇻🇪", "FlagVenezuela");
export const FlagVietnam = createFlagComponent("🇻🇳", "FlagVietnam");
export const FlagYemen = createFlagComponent("🇾🇪", "FlagYemen");
export const FlagZambia = createFlagComponent("🇿🇲", "FlagZambia");
export const FlagZimbabwe = createFlagComponent("🇿🇼", "FlagZimbabwe");

// Hugeicons React imports
import {
	Home01Icon,
	Home02Icon,
	Home03Icon,
	Home04Icon,
	Home05Icon,
	Store01Icon,
	Store02Icon,
	Store03Icon,
	Store04Icon,
	Building01Icon,
	Building02Icon,
	Building03Icon,
	Building04Icon,
	Building05Icon,
	City01Icon,
	City02Icon,
	City03Icon,
	House01Icon,
	House02Icon,
	House03Icon,
	House04Icon,
	UserCircleIcon,
	UserCircle02Icon,
	UserAdd01Icon,
	UserAdd02Icon,
	UserRemove01Icon,
	UserRemove02Icon,
	UserCheck01Icon,
	UserCheck02Icon,
	UserBlock01Icon,
	UserBlock02Icon,
	UserEdit01Icon,
	UserSearch01Icon,
	UserQuestion01Icon,
	UserSettings01Icon,
	UserStar01Icon,
	Mail01Icon,
	Mail02Icon,
	MailAdd01Icon,
	MailAdd02Icon,
	MailRemove01Icon,
	MailRemove02Icon,
	MailCheck01Icon,
	MailOpen01Icon,
	MailOpen02Icon,
	MailEdit01Icon,
	Mailbox01Icon,
	Message01Icon,
	Message02Icon,
	MessageAdd01Icon,
	MessageAdd02Icon,
	MessageDone01Icon,
	MessageDone02Icon,
	MessageEdit01Icon,
	MessageSearch01Icon,
	MessageQuestion01Icon,
	Comment01Icon,
	Comment02Icon,
	CommentAdd01Icon,
	CommentAdd02Icon,
	CommentRemove01Icon,
	CommentRemove02Icon,
	CommentDone01Icon,
	CommentBlock01Icon,
	Chat01Icon,
	Chat02Icon,
	BubbleChat01Icon,
	BubbleChat02Icon,
	BubbleChatAdd01Icon,
	BubbleChatDone01Icon,
	Notification01Icon,
	Notification02Icon,
	Notification03Icon,
	NotificationOff01Icon,
	NotificationOff02Icon,
	Bell01Icon,
	Bell02Icon,
	BellOff01Icon,
	BellOff02Icon,
	Calendar01Icon,
	Calendar02Icon,
	Calendar03Icon,
	Calendar04Icon,
	CalendarAdd01Icon,
	CalendarAdd02Icon,
	CalendarRemove01Icon,
	CalendarRemove02Icon,
	CalendarCheckIn01Icon,
	CalendarCheckOut01Icon,
	Clock01Icon,
	Clock02Icon,
	Clock03Icon,
	Clock04Icon,
	Clock05Icon,
	Time01Icon,
	Time02Icon,
	Time03Icon,
	Time04Icon,
	Timer01Icon,
	Timer02Icon,
	Search01Icon,
	Search02Icon,
	FavouriteIcon,
	FavouriteCircleIcon,
	StarIcon,
	StarCircleIcon,
	StarHalfIcon,
	ThumbsUpIcon,
	ThumbsDownIcon,
	Share01Icon,
	Share02Icon,
	Share03Icon,
	Share04Icon,
	Share05Icon,
	ShareLocation01Icon,
	ShareLocation02Icon,
	Download01Icon,
	Download02Icon,
	Download03Icon,
	Download04Icon,
	Download05Icon,
	Upload01Icon,
	Upload02Icon,
	Upload03Icon,
	Upload04Icon,
	Upload05Icon,
	SendToMobileIcon,
	Link01Icon,
	Link02Icon,
	Link03Icon,
	Link04Icon,
	Link05Icon,
	Link06Icon,
	Attachment02Icon,
	AttachmentCircleIcon,
	AttachmentSquare01Icon,
	Location01Icon,
	Navigation01Icon,
	Navigation02Icon,
	Navigation03Icon,
	Compass01Icon,
	Compass02Icon,
	Route01Icon,
	Route02Icon,
	Route03Icon,
	DirectionLeft01Icon,
	DirectionRight01Icon,
	ArrowUp01Icon,
	ArrowUp02Icon,
	ArrowUp03Icon,
	ArrowUp04Icon,
	ArrowUp05Icon,
	ArrowDown01Icon,
	ArrowDown02Icon,
	ArrowDown03Icon,
	ArrowDown04Icon,
	ArrowDown05Icon,
	ArrowLeft01Icon,
	ArrowLeft02Icon,
	ArrowLeft03Icon,
	ArrowLeft04Icon,
	ArrowLeft05Icon,
	ArrowRight01Icon,
	ArrowRight02Icon,
	ArrowRight03Icon,
	ArrowRight04Icon,
	ArrowRight05Icon,
	Settings01Icon,
	Settings02Icon,
	Settings03Icon,
	Settings04Icon,
	Settings05Icon,
	SettingsError01Icon,
	SettingsDone01Icon,
	Preference01Icon,
	PreferenceHorizontalIcon,
	PreferenceVerticalIcon,
	Configuration01Icon,
	Configuration02Icon,
	Menu01Icon,
	Menu02Icon,
	Menu03Icon,
	Menu04Icon,
	Menu05Icon,
	Menu06Icon,
	Menu07Icon,
	Menu08Icon,
	Menu09Icon,
	Menu10Icon,
	Menu11Icon,
	HamburgerIcon,
	MoreHorizontalIcon,
	MoreVerticalIcon,
	MoreHorizontalCircle01Icon,
	MoreHorizontalCircle02Icon,
	MoreVerticalCircle01Icon,
	MoreVerticalCircle02Icon,
	MoreVerticalSquare01Icon,
	MoreVerticalSquare02Icon,
	GridIcon,
	Grid01Icon,
	DashboardSquare01Icon,
	DashboardSquare02Icon,
	DashboardCircleIcon,
	DashboardBrowsingIcon,
	Folder01Icon,
	Folder02Icon,
	Folder03Icon,
	FolderAdd01Icon,
	FolderAdd02Icon,
	FolderRemove01Icon,
	FolderRemove02Icon,
	FolderCheck01Icon,
	FolderCheck02Icon,
	FolderDownload01Icon,
	FolderDownload02Icon,
	FolderUpload01Icon,
	FolderUpload02Icon,
	FolderEdit01Icon,
	FolderSearch01Icon,
	FolderSync01Icon,
	FolderOpen01Icon,
	FolderShared01Icon,
	FolderLinks01Icon,
	FolderLibrary01Icon,
	FolderMusic01Icon,
	FolderVideo01Icon,
	FolderZip01Icon,
	FolderAttachmentIcon,
	FolderFavourite01Icon,
	FolderLocked01Icon,
	FolderUnlocked01Icon,
	FolderSecurityIcon,
	File01Icon,
	File02Icon,
	FileAdd01Icon,
	FileAdd02Icon,
	FileRemove01Icon,
	FileRemove02Icon,
	FileCheck01Icon,
	FileCheck02Icon,
	FileDownload01Icon,
	FileDownload02Icon,
	FileUpload01Icon,
	FileUpload02Icon,
	FileEdit01Icon,
	FileEdit02Icon,
	FileSearch01Icon,
	FileSearch02Icon,
	FileSync01Icon,
	FileSync02Icon,
	FileAttachment01Icon,
	FileAttachment02Icon,
	FilePin01Icon,
	FilePin02Icon,
	FileMusic01Icon,
	FileMusic02Icon,
	FileVideo01Icon,
	FileVideo02Icon,
	FileImage01Icon,
	FileImage02Icon,
	FileCode01Icon,
	FileCode02Icon,
	FileScript01Icon,
	FileScript02Icon,
	FileDoc01Icon,
	FileDoc02Icon,
	FilePdf01Icon,
	FilePdf02Icon,
	FileXls01Icon,
	FileXls02Icon,
	FilePpt01Icon,
	FilePpt02Icon,
	FileZip01Icon,
	FileZip02Icon,
	FileHtml01Icon,
	FileHtml02Icon,
	FileCss01Icon,
	FileCss02Icon,
	FileJs01Icon,
	FileJs02Icon,
	FileJson01Icon,
	FileJson02Icon,
	FileRuby01Icon,
	FileSql01Icon,
	FilePhp01Icon,
	FileSwift01Icon,
	FileKotlin01Icon,
	FilePython01Icon,
	FileRust01Icon,
	FileGo01Icon,
	FileJava01Icon,
	FileTypescript01Icon,
	FileFigma01Icon,
	FileSketch01Icon,
	FileAi01Icon,
	Image01Icon,
	Image02Icon,
	ImageAdd01Icon,
	ImageAdd02Icon,
	ImageRemove01Icon,
	ImageRemove02Icon,
	ImageCheck01Icon,
	ImageCheck02Icon,
	ImageDownload01Icon,
	ImageDownload02Icon,
	ImageUpload01Icon,
	ImageUpload02Icon,
	ImageCropIcon,
	ImageFlipHorizontalIcon,
	ImageFlipVerticalIcon,
	ImageRotateIcon,
	Gallery01Icon,
	Gallery02Icon,
	GalleryAdd01Icon,
	GalleryAdd02Icon,
	GalleryRemove01Icon,
	GalleryRemove02Icon,
	GalleryCheck01Icon,
	GalleryCheck02Icon,
	GalleryDownload01Icon,
	GalleryDownload02Icon,
	GalleryUpload01Icon,
	GalleryUpload02Icon,
	GalleryEdit01Icon,
	Camera01Icon,
	Camera02Icon,
	CameraAdd01Icon,
	CameraAdd02Icon,
	CameraOff01Icon,
	CameraOff02Icon,
	CameraVideo01Icon,
	CameraVideo02Icon,
	Video01Icon,
	Video02Icon,
	VideoAdd01Icon,
	VideoAdd02Icon,
	VideoRemove01Icon,
	VideoRemove02Icon,
	VideoOff01Icon,
	VideoOff02Icon,
	VideoConsoleIcon,
	VideoReplayIcon,
	Mic01Icon,
	Mic02Icon,
	MicOff01Icon,
	MicOff02Icon,
	Headphone01Icon,
	Headphone02Icon,
	Headset01Icon,
	Headset02Icon,
	HeadsetOff01Icon,
	VoiceIcon,
	Voice01Icon,
	SpeakingIcon,
	CallIcon,
	Call01Icon,
	Call02Icon,
	CallAdd01Icon,
	CallAdd02Icon,
	CallRemove01Icon,
	CallRemove02Icon,
	CallDone01Icon,
	CallDone02Icon,
	CallBlocked01Icon,
	CallBlocked02Icon,
	CallMissed01Icon,
	CallMissed02Icon,
	CallIncoming01Icon,
	CallIncoming02Icon,
	CallOutgoing01Icon,
	CallOutgoing02Icon,
	CallRinging01Icon,
	CallRinging02Icon,
	CallEnd01Icon,
	CallEnd02Icon,
	Phone01Icon,
	Phone02Icon,
	PhoneOff01Icon,
	PhoneOff02Icon,
	Smartphone01Icon,
	Smartphone02Icon,
	Mobile01Icon,
	Mobile02Icon,
	Laptop01Icon,
	Laptop02Icon,
	LaptopAdd01Icon,
	LaptopRemove01Icon,
	Computer01Icon,
	Computer02Icon,
	ComputerAdd01Icon,
	ComputerRemove01Icon,
	Monitor01Icon,
	Monitor02Icon,
	Display01Icon,
	Display02Icon,
	Tv01Icon,
	Tv02Icon,
	SmartTv01Icon,
	SmartTv02Icon,
	Watch01Icon,
	Watch02Icon,
	SmartWatch01Icon,
	SmartWatch02Icon,
	Printer01Icon,
	Printer02Icon,
	ScannerIcon,
	Scanner01Icon,
	Keyboard01Icon,
	Keyboard02Icon,
	Mouse01Icon,
	Mouse02Icon,
	Joystick01Icon,
	Joystick02Icon,
	Gamepad01Icon,
	Gamepad02Icon,
	Cpu01Icon,
	Cpu02Icon,
	GpuIcon,
	Gpu01Icon,
	RamIcon,
	Ram01Icon,
	HardDrive01Icon,
	HardDrive02Icon,
	SsdIcon,
	Ssd01Icon,
	UsbIcon,
	Usb01Icon,
	UsbCable01Icon,
	WifiIcon,
	Wifi01Icon,
	WifiOffIcon,
	WifiOff01Icon,
	WifiConnected01Icon,
	WifiConnected02Icon,
	WifiError01Icon,
	WifiLock01Icon,
	WifiUnlock01Icon,
	Bluetooth01Icon,
	Bluetooth02Icon,
	BluetoothNotFoundIcon,
	BluetoothSearch01Icon,
	BluetoothConnectedIcon,
	BluetoothDisabledIcon,
	Airpod01Icon,
	Airpod02Icon,
	Airpod03Icon,
	Airplay01Icon,
	Airplay02Icon,
	AirdropIcon,
	Airdrop01Icon,
	MusicNote01Icon,
	MusicNote02Icon,
	MusicNote03Icon,
	MusicNote04Icon,
	MusicNoteAdd01Icon,
	MusicNoteRemove01Icon,
	MusicNoteSquare01Icon,
	MusicNoteSquare02Icon,
	Playlist01Icon,
	Playlist02Icon,
	Playlist03Icon,
	PlaylistAdd01Icon,
	PlaylistRemove01Icon,
	Song01Icon,
	Song02Icon,
	Song03Icon,
	AlbumIcon,
	Album01Icon,
	Album02Icon,
	ArtistIcon,
	Artist01Icon,
	RecordIcon,
	Record01Icon,
	Radio01Icon,
	Radio02Icon,
	Speaker01Icon,
	Speaker02Icon,
	SpeakersIcon,
	Speakers01Icon,
	SoundIcon,
	Sound01Icon,
	VolumeMute01Icon,
	VolumeMute02Icon,
	VolumeLow01Icon,
	VolumeLow02Icon,
	VolumeMedium01Icon,
	VolumeMedium02Icon,
	VolumeHigh01Icon,
	VolumeHigh02Icon,
	VolumeOff01Icon,
	VolumeOff02Icon,
	VolumeUp01Icon,
	VolumeUp02Icon,
	VolumeDown01Icon,
	VolumeDown02Icon,
	Play01Icon,
	Play02Icon,
	PlayCircleIcon,
	PlayCircle01Icon,
	PlaySquareIcon,
	Pause01Icon,
	Pause02Icon,
	PauseCircleIcon,
	Stop01Icon,
	Stop02Icon,
	StopCircleIcon,
	Forward01Icon,
	Forward02Icon,
	Backward01Icon,
	Backward02Icon,
	Next01Icon,
	Next02Icon,
	Previous01Icon,
	Previous02Icon,
	Repeat01Icon,
	Repeat02Icon,
	RepeatOne01Icon,
	RepeatOne02Icon,
	RepeatOff01Icon,
	Shuffle01Icon,
	Shuffle02Icon,
	ShuffleSquare01Icon,
	ShoppingCart01Icon,
	ShoppingCart02Icon,
	ShoppingCartAdd01Icon,
	ShoppingCartAdd02Icon,
	ShoppingCartRemove01Icon,
	ShoppingCartRemove02Icon,
	ShoppingCartCheck01Icon,
	ShoppingCartCheck02Icon,
	ShoppingCartFavourite01Icon,
	ShoppingCartFavourite02Icon,
	ShoppingBag01Icon,
	ShoppingBag02Icon,
	ShoppingBag03Icon,
	ShoppingBagAdd01Icon,
	ShoppingBagAdd02Icon,
	ShoppingBagRemove01Icon,
	ShoppingBagRemove02Icon,
	ShoppingBagCheck01Icon,
	ShoppingBagCheck02Icon,
	ShoppingBagFavourite01Icon,
	ShoppingBasket01Icon,
	ShoppingBasket02Icon,
	ShoppingBasket03Icon,
	ShoppingBasketAdd01Icon,
	ShoppingBasketAdd02Icon,
	ShoppingBasketRemove01Icon,
	ShoppingBasketRemove02Icon,
	ShoppingBasketCheck01Icon,
	ShoppingBasketCheck02Icon,
	ShoppingBasketFavourite01Icon,
	Tag01Icon,
	Tag02Icon,
	TagAdd01Icon,
	TagAdd02Icon,
	TagRemove01Icon,
	TagRemove02Icon,
	Coupon01Icon,
	Coupon02Icon,
	Coupon03Icon,
	CouponPercent01Icon,
	CouponPercent02Icon,
	DiscountIcon,
	Discount01Icon,
	DiscountTag01Icon,
	DiscountTag02Icon,
	Sale01Icon,
	Sale02Icon,
	Sale03Icon,
	Sale04Icon,
	PercentIcon,
	PercentCircleIcon,
	PercentSquareIcon,
	CreditCardIcon,
	CreditCard01Icon,
	CreditCard02Icon,
	CreditCardAddIcon,
	CreditCardAdd01Icon,
	CreditCardRemoveIcon,
	CreditCardRemove01Icon,
	CreditCardAcceptIcon,
	CreditCardAccept01Icon,
	CreditCardDeclineIcon,
	CreditCardDecline01Icon,
	CreditCardPos01Icon,
	CreditCardPos02Icon,
	CreditCardValidationIcon,
	PaymentSuccess01Icon,
	PaymentSuccess02Icon,
	PaymentFailed01Icon,
	PaymentFailed02Icon,
	Wallet01Icon,
	Wallet02Icon,
	Wallet03Icon,
	WalletAdd01Icon,
	WalletAdd02Icon,
	WalletRemove01Icon,
	WalletRemove02Icon,
	WalletDone01Icon,
	WalletDone02Icon,
	Money01Icon,
	Money02Icon,
	Money03Icon,
	Money04Icon,
	MoneyBag01Icon,
	MoneyBag02Icon,
	MoneySafe01Icon,
	MoneySafe02Icon,
	MoneyExchange01Icon,
	MoneyExchange02Icon,
	MoneyReceive01Icon,
	MoneyReceive02Icon,
	MoneySend01Icon,
	MoneySend02Icon,
	Invoice01Icon,
	Invoice02Icon,
	Invoice03Icon,
	Invoice04Icon,
	InvoiceAdd01Icon,
	InvoiceRemove01Icon,
	Bill01Icon,
	Bill02Icon,
	Receipt01Icon,
	Receipt02Icon,
	Bank01Icon,
	Bank02Icon,
	Coins01Icon,
	Coins02Icon,
	CoinsSwap01Icon,
	CoinsSwap02Icon,
	Bitcoin01Icon,
	Bitcoin02Icon,
	Bitcoin03Icon,
	Bitcoin04Icon,
	BitcoinCircleIcon,
	BitcoinEllipseIcon,
	BitcoinBagIcon,
	BitcoinCloud01Icon,
	BitcoinDatabase01Icon,
	Ethereum01Icon,
	Ethereum02Icon,
	EthereumEllipseIcon,
	Blockchain01Icon,
	Blockchain02Icon,
	Blockchain03Icon,
	Blockchain04Icon,
	Blockchain05Icon,
	Blockchain06Icon,
	Blockchain07Icon,
	Lock01Icon,
	Lock02Icon,
	LockKey01Icon,
	Unlock01Icon,
	Unlock02Icon,
	UnlockKey01Icon,
	PasswordValidationIcon,
	PasswordValidation01Icon,
	Key01Icon,
	Key02Icon,
	KeyAdd01Icon,
	KeyRemove01Icon,
	Security01Icon,
	SecurityBlockIcon,
	SecurityCheck01Icon,
	Shield01Icon,
	Shield02Icon,
	ShieldAdd01Icon,
	ShieldRemove01Icon,
	ShieldCheck01Icon,
	ShieldEnergy01Icon,
	ShieldUser01Icon,
	ShieldKey01Icon,
	FingerPrint01Icon,
	FingerPrintCircleIcon,
	FingerPrintScan01Icon,
	FingerPrintCheck01Icon,
	FingerPrintRemove01Icon,
	FingerPrintAdd01Icon,
	FingerPrintAccess01Icon,
	FaceId01Icon,
	FaceId02Icon,
	FaceIdValidation01Icon,
	EyeIcon,
	Eye01Icon,
	ViewIcon,
	View01Icon,
	ViewOffIcon,
	ViewOff01Icon,
	ViewOffSlashIcon,
	EyeCloseIcon,
	EyeClose01Icon,
	SunIcon,
	Sun01Icon,
	Sun02Icon,
	Sun03Icon,
	SunCloud01Icon,
	SunCloud02Icon,
	SunCloudAngleRain01Icon,
	MoonIcon,
	Moon01Icon,
	Moon02Icon,
	MoonCloud01Icon,
	MoonCloud02Icon,
	Cloud01Icon,
	Cloud02Icon,
	CloudBig01Icon,
	CloudBig02Icon,
	CloudLoading01Icon,
	CloudLoading02Icon,
	CloudSavingDone01Icon,
	CloudSavingDone02Icon,
	CloudSync01Icon,
	CloudSync02Icon,
	CloudSlowWind01Icon,
	CloudSlowWind02Icon,
	CloudAngledZap01Icon,
	CloudAngledZap02Icon,
	CloudAngledRain01Icon,
	CloudAngledRain02Icon,
	CloudAngledRainZap01Icon,
	CloudAngledRainZap02Icon,
	Rain01Icon,
	Rain02Icon,
	Rain03Icon,
	Umbrella01Icon,
	Umbrella02Icon,
	Snow01Icon,
	Snow02Icon,
	Snowflake01Icon,
	SnowflakeIcon,
	Temperature01Icon,
	Temperature02Icon,
	Celsius01Icon,
	Celsius02Icon,
	Fahrenheit01Icon,
	Fahrenheit02Icon,
	Wind01Icon,
	Wind02Icon,
	Wind03Icon,
	Humidity01Icon,
	Humidity02Icon,
	Sunrise01Icon,
	Sunrise02Icon,
	Sunset01Icon,
	Sunset02Icon,
	Atom01Icon,
	Atom02Icon,
	Dna01Icon,
	Dna02Icon,
	FlaskIcon,
	Flask01Icon,
	Microscope01Icon,
	Microscope02Icon,
	Telescope01Icon,
	Telescope02Icon,
	Planet01Icon,
	Planet02Icon,
	Earth01Icon,
	Earth02Icon,
	Globe01Icon,
	Globe02Icon,
	GlobalIcon,
	Global01Icon,
	GlobalSearch01Icon,
	GlobalEdit01Icon,
	GlobalRefresh01Icon,
	SparklesIcon,
	Sparkles01Icon,
	Sparkles02Icon,
	Sparkles03Icon,
	AiBeautifyIcon,
	AiBrain01Icon,
	AiBrain02Icon,
	AiBrain03Icon,
	AiBrain04Icon,
	AiBrain05Icon,
	AiChat01Icon,
	AiChat02Icon,
	AiCloud01Icon,
	AiCloud02Icon,
	AiDna01Icon,
	AiDna02Icon,
	AiFolder01Icon,
	AiFolder02Icon,
	AiIdea01Icon,
	AiIdea02Icon,
	AiImage01Icon,
	AiImage02Icon,
	AiInnovation01Icon,
	AiInnovation02Icon,
	AiInnovation03Icon,
	AiLaptop01Icon,
	AiLaptop02Icon,
	AiLock01Icon,
	AiLock02Icon,
	AiMagicIcon,
	AiMail01Icon,
	AiMail02Icon,
	AiNetwork01Icon,
	AiNetwork02Icon,
	AiPhone01Icon,
	AiPhone02Icon,
	AiProgramming01Icon,
	AiProgramming02Icon,
	AiSearch01Icon,
	AiSearch02Icon,
	AiSecurity01Icon,
	AiSecurity02Icon,
	AiSmartWatch01Icon,
	AiSmartWatch02Icon,
	AiVideo01Icon,
	AiVideo02Icon,
	AiView01Icon,
	AiView02Icon,
	TextIcon,
	Text01Icon,
	Text02Icon,
	TextBoldIcon,
	TextBold01Icon,
	TextItalicIcon,
	TextItalic01Icon,
	TextUnderlineIcon,
	TextUnderline01Icon,
	TextStrikethroughIcon,
	TextStrikethrough01Icon,
	TextAlignCenterIcon,
	TextAlignCenter01Icon,
	TextAlignLeftIcon,
	TextAlignLeft01Icon,
	TextAlignRightIcon,
	TextAlignRight01Icon,
	TextAlignJustifyCenterIcon,
	TextAlignJustifyCenter01Icon,
	TextColorIcon,
	TextColor01Icon,
	TextFont01Icon,
	TextFont02Icon,
	TextFontSize01Icon,
	TextFontSize02Icon,
	ParagraphIcon,
	Paragraph01Icon,
	ParagraphBulletsPoint01Icon,
	ParagraphBulletsPoint02Icon,
	QuoteIcon,
	Quote01Icon,
	QuoteDownIcon,
	QuoteDown01Icon,
	Heading01Icon,
	Heading02Icon,
	Heading03Icon,
	Heading04Icon,
	Heading05Icon,
	Heading06Icon,
	ListIcon,
	List01Icon,
	List02Icon,
	CheckList01Icon,
	CheckList02Icon,
	CheckMark01Icon,
	CheckMark02Icon,
	Tick01Icon,
	Tick02Icon,
	TickDouble01Icon,
	TickDouble02Icon,
	TickDouble03Icon,
	TickDouble04Icon,
	Cancel01Icon,
	Cancel02Icon,
	Add01Icon,
	Add02Icon,
	AddCircleIcon,
	AddSquareIcon,
	Minus01Icon,
	Minus02Icon,
	MinusSignIcon,
	MinusSign01Icon,
	MinusSignCircle01Icon,
	MinusSignCircle02Icon,
	MinusSignSquare01Icon,
	MinusSignSquare02Icon,
	Remove01Icon,
	Remove02Icon,
	RemoveCircleIcon,
	RemoveSquareIcon,
	Delete01Icon,
	Delete02Icon,
	Delete03Icon,
	Delete04Icon,
	CloseIcon,
	Close01Icon,
	MultiplicationSignIcon,
	MultiplicationSign01Icon,
	MultiplicationSignCircle01Icon,
	MultiplicationSignSquare01Icon,
	InformationCircleIcon,
	InformationCircle01Icon,
	InformationDiamondIcon,
	InformationDiamond01Icon,
	InformationSquareIcon,
	InformationSquare01Icon,
	QuestionIcon,
	Question01Icon,
	HelpCircleIcon,
	HelpCircle01Icon,
	HelpSquareIcon,
	HelpSquare01Icon,
	Alert01Icon,
	Alert02Icon,
	AlertCircleIcon,
	AlertDiamondIcon,
	AlertSquareIcon,
	WarningIcon,
	Warning01Icon,
	DangerIcon,
	Danger01Icon,
	ErrorValidation01Icon,
	ErrorValidation02Icon,
	Pen01Icon,
	Pen02Icon,
	Pen03Icon,
	Pen04Icon,
	PenAdd01Icon,
	PenAdd02Icon,
	PenRemove01Icon,
	PenRemove02Icon,
	PenNib01Icon,
	PenNib02Icon,
	Quill01Icon,
	Quill02Icon,
	Quill03Icon,
	PaintBoard01Icon,
	PaintBoard02Icon,
	PaintBrush01Icon,
	PaintBrush02Icon,
	PaintBrush03Icon,
	PaintBrush04Icon,
	PaintBucket01Icon,
	PaintBucket02Icon,
	Eraser01Icon,
	Eraser02Icon,
	EraserAuto01Icon,
	EraserAuto02Icon,
	PathIcon,
	Path01Icon,
	Bezier01Icon,
	Bezier02Icon,
	Cursor01Icon,
	Cursor02Icon,
	CursorMove01Icon,
	CursorMove02Icon,
	CursorInfo01Icon,
	CursorInfo02Icon,
	CursorLoading01Icon,
	CursorLoading02Icon,
	CursorProgress01Icon,
	CursorProgress02Icon,
	CursorPointer01Icon,
	CursorPointer02Icon,
	CursorInWindow01Icon,
	CursorInWindow02Icon,
	ColorPickerIcon,
	ColorPicker01Icon,
	Colors01Icon,
	Colors02Icon,
	PaintBoardIcon,
	PaintBoard03Icon,
	Layers01Icon,
	Layers02Icon,
	LayersAdd01Icon,
	LayersAdd02Icon,
	LayersRemove01Icon,
	LayersRemove02Icon,
	Copy01Icon,
	Copy02Icon,
	CopyLink01Icon,
	CopyLink02Icon,
	Paste01Icon,
	Paste02Icon,
	Cut01Icon,
	Cut02Icon,
	ScissorIcon,
	Scissor01Icon,
	Ruler01Icon,
	Ruler02Icon,
	Rulers01Icon,
	Rulers02Icon,
	Table01Icon,
	Table02Icon,
	Table03Icon,
	TableAdd01Icon,
	TableRemove01Icon,
	TableInsertColumn01Icon,
	TableInsertRow01Icon,
	TableDeleteColumn01Icon,
	TableDeleteRow01Icon,
	TableMerge01Icon,
	TableMerge02Icon,
	ChartIcon,
	Chart01Icon,
	ChartAverage01Icon,
	ChartBreakoutCircle01Icon,
	ChartBreakoutSquare01Icon,
	ChartCircle01Icon,
	ChartCircle02Icon,
	ChartColumn01Icon,
	ChartColumn02Icon,
	ChartDecrease01Icon,
	ChartDecrease02Icon,
	ChartHistogram01Icon,
	ChartHistogram02Icon,
	ChartHighLow01Icon,
	ChartHighLow02Icon,
	ChartIncrease01Icon,
	ChartIncrease02Icon,
	ChartLine01Icon,
	ChartLine02Icon,
	ChartLineData01Icon,
	ChartLineData02Icon,
	ChartMedium01Icon,
	ChartMedium02Icon,
	ChartMinimum01Icon,
	ChartMinimum02Icon,
	ChartPie01Icon,
	ChartPie02Icon,
	ChartRadar01Icon,
	ChartRadar02Icon,
	ChartRing01Icon,
	ChartRing02Icon,
	ChartRose01Icon,
	ChartRose02Icon,
	ChartScatter01Icon,
	ChartScatter02Icon,
	AnalyticsIcon,
	Analytics01Icon,
	Analytics02Icon,
	AnalyticsDown01Icon,
	AnalyticsDown02Icon,
	AnalyticsUp01Icon,
	AnalyticsUp02Icon,
	TrendDown01Icon,
	TrendDown02Icon,
	TrendUp01Icon,
	TrendUp02Icon,
	Task01Icon,
	Task02Icon,
	TaskAdd01Icon,
	TaskAdd02Icon,
	TaskRemove01Icon,
	TaskRemove02Icon,
	TaskDone01Icon,
	TaskDone02Icon,
	TaskEdit01Icon,
	TaskEdit02Icon,
	Todo01Icon,
	Todo02Icon,
	CheckSquare01Icon,
	CheckSquare02Icon,
	CheckboxCheck01Icon,
	CheckboxCheck02Icon,
	CheckboxCircle01Icon,
	CheckboxCircle02Icon,
	SuccessIcon,
	Success01Icon,
	DoneAll01Icon,
	DoneAll02Icon,
	Circle01Icon,
	Circle02Icon,
	Square01Icon,
	Square02Icon,
	Triangle01Icon,
	Triangle02Icon,
	Triangle03Icon,
	Hexagon01Icon,
	Hexagon02Icon,
	Pentagon01Icon,
	Pentagon02Icon,
	Octagon01Icon,
	Octagon02Icon,
	Rectangle01Icon,
	Rectangle02Icon,
	Oval01Icon,
	Oval02Icon,
	Diamond01Icon,
	Diamond02Icon,
	StarFill01Icon,
	Rocket01Icon,
	Rocket02Icon,
	UfoIcon,
	Ufo01Icon,
	SaturnIcon,
	Saturn01Icon,
	Star02Icon,
	StarHalf01Icon,
	FlashIcon,
	Flash01Icon,
	FlashOff01Icon,
	FlashOff02Icon,
	FlashLight01Icon,
	FlashLight02Icon,
	Bulb01Icon,
	Bulb02Icon,
	BulbChargingIcon,
	IdeaIcon,
	Idea01Icon,
	LightBulb01Icon,
	LightBulb02Icon,
	LightBulb03Icon,
	LightBulb04Icon,
	LightBulb05Icon,
	Crown01Icon,
	Crown02Icon,
	Trophy01Icon,
	Trophy02Icon,
	Medal01Icon,
	Medal02Icon,
	Award01Icon,
	Award02Icon,
	Award03Icon,
	Award04Icon,
	Award05Icon,
	Certificate01Icon,
	Certificate02Icon,
	Gift01Icon,
	Gift02Icon,
	GiftCard01Icon,
	GiftCard02Icon,
	Flower01Icon,
	Flower02Icon,
	Flower03Icon,
	Flower04Icon,
	Flower05Icon,
	Tree01Icon,
	Tree02Icon,
	Tree03Icon,
	Tree04Icon,
	Tree05Icon,
	Tree06Icon,
	Plant01Icon,
	Plant02Icon,
	Plant03Icon,
	Plant04Icon,
	Leaf01Icon,
	Leaf02Icon,
	Leaf03Icon,
	Leaf04Icon,
	Recycle01Icon,
	Recycle02Icon,
	Recycle03Icon,
	EcoEnergy01Icon,
	EcoEnergy02Icon,
	EcoPower01Icon,
	EcoPower02Icon,
	WindPower01Icon,
	WindPower02Icon,
	SolarEnergy01Icon,
	SolarEnergy02Icon,
	SolarPower01Icon,
	SolarPower02Icon,
	GreenEnergy01Icon,
	GreenEnergy02Icon,
	BatteryCharging01Icon,
	BatteryCharging02Icon,
	BatteryEcoCharging01Icon,
	BatteryEcoCharging02Icon,
	BatteryEmpty01Icon,
	BatteryEmpty02Icon,
	BatteryFull01Icon,
	BatteryFull02Icon,
	BatteryLow01Icon,
	BatteryLow02Icon,
	BatteryMedium01Icon,
	BatteryMedium02Icon,
	EnergyIcon,
	Energy01Icon,
	ElectricHome01Icon,
	ElectricHome02Icon,
	ElectricPlug01Icon,
	ElectricPlug02Icon,
	Electric01Icon,
	Electric02Icon,
	ElectricityIcon,
	Electricity01Icon,
	Code01Icon,
	Code02Icon,
	CodeCircleIcon,
	CodeSquareIcon,
	CodeFolderIcon,
	CodeFolder01Icon,
	CommandIcon,
	Command01Icon,
	CommandLine01Icon,
	CommandLine02Icon,
	Terminal01Icon,
	Terminal02Icon,
	TerminalSquareIcon,
	TerminalCircleIcon,
	Database01Icon,
	Database02Icon,
	DatabaseAdd01Icon,
	DatabaseAdd02Icon,
	DatabaseRemove01Icon,
	DatabaseRemove02Icon,
	DatabaseSync01Icon,
	DatabaseSync02Icon,
	DatabaseSetting01Icon,
	DatabaseSetting02Icon,
	DatabaseExport01Icon,
	DatabaseImport01Icon,
	DatabaseRestore01Icon,
	DatabaseLocked01Icon,
	Server01Icon,
	Server02Icon,
	Server03Icon,
	ServerStack01Icon,
	ServerStack02Icon,
	Cloud03Icon,
	Cloud04Icon,
	CloudAdd01Icon,
	CloudAdd02Icon,
	CloudRemove01Icon,
	CloudRemove02Icon,
	CloudCheck01Icon,
	CloudCheck02Icon,
	CloudDone01Icon,
	CloudDone02Icon,
	CloudFavourite01Icon,
	CloudFavourite02Icon,
	CloudLocked01Icon,
	CloudLocked02Icon,
	CloudServer01Icon,
	CloudServer02Icon,
	CloudConnected01Icon,
	Api01Icon,
	Api02Icon,
	BugIcon,
	Bug01Icon,
	Bug02Icon,
	Git01Icon,
	Git02Icon,
	GitBranch01Icon,
	GitBranch02Icon,
	GitCommit01Icon,
	GitCommit02Icon,
	GitCompare01Icon,
	GitCompare02Icon,
	GitFork01Icon,
	GitFork02Icon,
	GitMerge01Icon,
	GitMerge02Icon,
	GitPullRequest01Icon,
	GitPullRequest02Icon,
	GitPullRequestClosed01Icon,
	GitPullRequestDraft01Icon,
	Github01Icon,
	Github02Icon,
	GithubOctopusIcon,
	Gitlab01Icon,
	CubeIcon,
	Cube01Icon,
	Cube02Icon,
	Cube03Icon,
	Cube04Icon,
	Package01Icon,
	Package02Icon,
	PackageAdd01Icon,
	PackageAdd02Icon,
	PackageRemove01Icon,
	PackageRemove02Icon,
	PackageOpen01Icon,
	PackageOpen02Icon,
	PackageReceive01Icon,
	PackageReceive02Icon,
	PackageSent01Icon,
	PackageSent02Icon,
	PackageMoving01Icon,
	PackageMoving02Icon,
	PackageDelivered01Icon,
	PackageDelivered02Icon,
	Box01Icon,
	Box02Icon,
	Box03Icon,
	BoxAdd01Icon,
	BoxAdd02Icon,
	BoxRemove01Icon,
	BoxRemove02Icon,
	Archive01Icon,
	Archive02Icon,
	ArchiveAdd01Icon,
	ArchiveAdd02Icon,
	ArchiveRemove01Icon,
	ArchiveRemove02Icon,
	ArchiveRestore01Icon,
	ArchiveRestore02Icon,
	Clipboard01Icon,
	Clipboard02Icon,
	ClipboardAdd01Icon,
	ClipboardAdd02Icon,
	ClipboardRemove01Icon,
	ClipboardRemove02Icon,
	ClipboardCheck01Icon,
	ClipboardCheck02Icon,
	ClipboardAttachment01Icon,
	ClipboardAttachment02Icon,
	Note01Icon,
	Note02Icon,
	NoteAdd01Icon,
	NoteAdd02Icon,
	NoteRemove01Icon,
	NoteRemove02Icon,
	NoteEdit01Icon,
	NoteEdit02Icon,
	NoteDone01Icon,
	NoteDone02Icon,
	StickyNote01Icon,
	StickyNote02Icon,
	Book01Icon,
	Book02Icon,
	Book03Icon,
	Book04Icon,
	BookAdd01Icon,
	BookAdd02Icon,
	BookRemove01Icon,
	BookRemove02Icon,
	BookEdit01Icon,
	BookEdit02Icon,
	BookOpen01Icon,
	BookOpen02Icon,
	BookMark01Icon,
	BookMark02Icon,
	BookMark03Icon,
	Bookmark01Icon,
	Bookmark02Icon,
	Bookmark03Icon,
	BookmarkAdd01Icon,
	BookmarkAdd02Icon,
	BookmarkRemove01Icon,
	BookmarkRemove02Icon,
	BookmarkCheck01Icon,
	BookmarkCheck02Icon,
	BookmarkBlock01Icon,
	BookmarkBlock02Icon,
	BookmarkMinus01Icon,
	BookmarkMinus02Icon,
	Diary01Icon,
	Diary02Icon,
	JournalIcon,
	Journal01Icon,
	Notebook01Icon,
	Notebook02Icon,
	NotebookIcon,
	GraduateHat01Icon,
	GraduateHat02Icon,
	University01Icon,
	University02Icon,
	School01Icon,
	School02Icon,
	SchoolBag01Icon,
	SchoolBag02Icon,
	TeacherIcon,
	Teacher01Icon,
	StudentIcon,
	Student01Icon,
	SchoolBell01Icon,
	SchoolBell02Icon,
	SchoolBoard01Icon,
	SchoolBoard02Icon,
	BlackboardIcon,
	Blackboard01Icon,
	LibraryIcon,
	Library01Icon,
	AbacusIcon,
	Abacus01Icon,
	Calculator01Icon,
	Calculator02Icon,
	CourseIcon,
	Course01Icon,
	Lesson01Icon,
	Lesson02Icon,
	OnlineLearning01Icon,
	OnlineLearning02Icon,
	OnlineLearning03Icon,
	OnlineLearning04Icon,
	QuizIcon,
	Quiz01Icon,
	Quiz02Icon,
	Quiz03Icon,
	Quiz04Icon,
	Quiz05Icon,
	Test01Icon,
	TestTube01Icon,
	TestTube02Icon,
	FlaskRoundIcon,
	MentoringIcon,
	Mentoring01Icon,
	BooksIcon,
	Books01Icon,
	ArtboardToolIcon,
	ArtboardTool01Icon,
	Frame01Icon,
	Frame02Icon,
	GridOnIcon,
	GridOffIcon,
	GridViewIcon,
	ListViewIcon,
	SquareArrowUpRight01Icon,
	SquareArrowUpRight02Icon,
	SquareArrowDownRight01Icon,
	SquareArrowDownRight02Icon,
	SquareArrowUpLeft01Icon,
	SquareArrowUpLeft02Icon,
	SquareArrowDownLeft01Icon,
	SquareArrowDownLeft02Icon,
	ExpandIcon,
	Expand01Icon,
	Expand02Icon,
	Expand03Icon,
	Expand04Icon,
	Expand05Icon,
	ContractIcon,
	Contract01Icon,
	Contract02Icon,
	MinimizeIcon,
	Minimize01Icon,
	Minimize02Icon,
	Minimize03Icon,
	Minimize04Icon,
	Maximize01Icon,
	Maximize02Icon,
	Maximize03Icon,
	Maximize04Icon,
	MaximizeScreen01Icon,
	MaximizeScreen02Icon,
	MinimizeScreen01Icon,
	MinimizeScreen02Icon,
	Fullscreen01Icon,
	Fullscreen02Icon,
	FullscreenExit01Icon,
	FullscreenExit02Icon,
	FullscreenSquare01Icon,
	FullscreenSquare02Icon,
	PictureInPictureOn01Icon,
	PictureInPictureOn02Icon,
	PictureInPictureOff01Icon,
	PictureInPictureOff02Icon,
	PictureInPictureExit01Icon,
	PictureInPictureExit02Icon,
	RotateLeft01Icon,
	RotateLeft02Icon,
	RotateLeft03Icon,
	RotateLeft04Icon,
	RotateLeft05Icon,
	RotateLeft06Icon,
	RotateRight01Icon,
	RotateRight02Icon,
	RotateRight03Icon,
	RotateRight04Icon,
	RotateRight05Icon,
	RotateRight06Icon,
	RotateClockwise01Icon,
	RotateClockwise02Icon,
	RotateCounterClockwise01Icon,
	RotateCounterClockwise02Icon,
	Crop01Icon,
	Crop02Icon,
	MirrorIcon,
	Mirror01Icon,
	FlipHorizontalIcon,
	FlipHorizontal01Icon,
	FlipVerticalIcon,
	FlipVertical01Icon,
	AnnotationIcon,
	Annotation01Icon,
	AnnotationAdd01Icon,
	AnnotationDots01Icon,
	AnnotationInformation01Icon,
	AnnotationCheck01Icon,
	AnnotationAlert01Icon,
	AnnotationQuestion01Icon,
	EditUser01Icon,
	EditUser02Icon,
	Edit01Icon,
	Edit02Icon,
	Edit03Icon,
	Edit04Icon,
	EditTableIcon,
	EditTable01Icon,
	EditCircle01Icon,
	EditSquare01Icon,
	EditRoad01Icon,
	EditRoad02Icon,
	WriteIcon,
	Write01Icon,
	SignatureIcon,
	Signature01Icon,
	Save01Icon,
	Save02Icon,
	Save03Icon,
	Save04Icon,
	SaveMoney01Icon,
	SaveMoney02Icon,
	SaveEnergy01Icon,
	SaveEnergy02Icon,
	Undo01Icon,
	Undo02Icon,
	Redo01Icon,
	Redo02Icon,
	ArrowTurnBackwardIcon,
	ArrowTurnBackward01Icon,
	ArrowTurnForwardIcon,
	ArrowTurnForward01Icon,
	Restore01Icon,
	Restore02Icon,
	Reload01Icon,
	Reload02Icon,
	RefreshIcon,
	Refresh01Icon,
	Update01Icon,
	Update02Icon,
	SyncIcon,
	Sync01Icon,
	SyncingIcon,
	Syncing01Icon,
	Loop01Icon,
	Loop02Icon,
	Loop03Icon,
	RepeatIcon,
	Repeat03Icon,
	Exchange01Icon,
	Exchange02Icon,
	SwapHorizontal01Icon,
	SwapHorizontal02Icon,
	SwapVertical01Icon,
	SwapVertical02Icon,
	TransformIcon,
	Transform01Icon,
	Transition01Icon,
	Transition02Icon,
	AlignBottom01Icon,
	AlignBottom02Icon,
	AlignTop01Icon,
	AlignTop02Icon,
	AlignLeft01Icon,
	AlignLeft02Icon,
	AlignRight01Icon,
	AlignRight02Icon,
	AlignHorizontalCenter01Icon,
	AlignHorizontalCenter02Icon,
	AlignVerticalCenter01Icon,
	AlignVerticalCenter02Icon,
	DistributeHorizontalCenter01Icon,
	DistributeHorizontalCenter02Icon,
	DistributeVerticalCenter01Icon,
	DistributeVerticalCenter02Icon,
	MoveUp01Icon,
	MoveUp02Icon,
	MoveDown01Icon,
	MoveDown02Icon,
	MoveLeft01Icon,
	MoveLeft02Icon,
	MoveRight01Icon,
	MoveRight02Icon,
	Move01Icon,
	Move02Icon,
	DragIcon,
	Drag01Icon,
	DragDropIcon,
	DragDrop01Icon,
	DragDropHorizontalIcon,
	DragDropVerticalIcon,
	Hand01Icon,
	Hand02Icon,
	HandPointing01Icon,
	HandPointing02Icon,
	HandPointingLeft01Icon,
	HandPointingLeft02Icon,
	HandPointingRight01Icon,
	HandPointingRight02Icon,
	HandPointingUp01Icon,
	HandPointingUp02Icon,
	HandPointingDown01Icon,
	HandPointingDown02Icon,
	TouchIcon,
	Touch01Icon,
	Touch02Icon,
	Touch03Icon,
	Touch04Icon,
	Touch05Icon,
	Touch06Icon,
	Touch07Icon,
	Touch08Icon,
	Touch09Icon,
	Touch10Icon,
	Touch11Icon,
	TouchLocked01Icon,
	TouchLocked02Icon,
	TouchLocked03Icon,
	TouchLocked04Icon,
	GestureUp01Icon,
	GestureUp02Icon,
	GestureDown01Icon,
	GestureDown02Icon,
	GestureLeft01Icon,
	GestureLeft02Icon,
	GestureRight01Icon,
	GestureRight02Icon,
	Gesture01Icon,
	Gesture02Icon,
	SwipeUp01Icon,
	SwipeUp02Icon,
	SwipeUp03Icon,
	SwipeUp04Icon,
	SwipeDown01Icon,
	SwipeDown02Icon,
	SwipeDown03Icon,
	SwipeDown04Icon,
	SwipeLeft01Icon,
	SwipeLeft02Icon,
	SwipeLeft03Icon,
	SwipeLeft04Icon,
	SwipeRight01Icon,
	SwipeRight02Icon,
	SwipeRight03Icon,
	SwipeRight04Icon,
	Tap01Icon,
	Tap02Icon,
	Tap03Icon,
	Tap04Icon,
	Tap05Icon,
	Tap06Icon,
	Tap07Icon,
	Tap08Icon,
	TapeMeasureIcon,
	TapeMeasure01Icon,
	DoubleTap01Icon,
	DoubleTap02Icon,
	TripleTap01Icon,
	TripleTap02Icon,
	LongPress01Icon,
	LongPress02Icon,
	PinchIcon,
	Pinch01Icon,
	Pinch02Icon,
	Pinch03Icon,
	Rotate3dIcon,
	Rotate3d01Icon,
	Rotate3dCenter01Icon,
	PerspectiveIcon,
	Perspective01Icon,
	ThreeDView01Icon,
	ThreeDView02Icon,
	ArIcon,
	Ar01Icon,
	Vr01Icon,
	Vr02Icon,
	CrownCircleIcon,
	CrownCircle01Icon,
	AnalysisIcon,
	Analysis01Icon,
	Sticker01Icon,
	Sticker02Icon,
	EmojiIcon,
	EmojiLook01Icon,
	EmojiLook02Icon,
	SentMail01Icon,
	SentMail02Icon,
	ChartRelationship01Icon,
	ChartRelationship02Icon,
	StrategyIcon,
	Strategy01Icon,
	Strategy02Icon,
	Strategy03Icon,
	AiPhone02Icon as AiPhoneIcon,
	FireIcon,
	SnailIcon,
	Snail01Icon,
	CatIcon,
	Cat01Icon,
	DogIcon,
	Dog01Icon,
	PigIcon,
	Pig01Icon,
	CowIcon,
	Cow01Icon,
	SheepIcon,
	Sheep01Icon,
	RabbitIcon,
	Rabbit01Icon,
	FishIcon,
	Fish01Icon,
	BirdIcon,
	Bird01Icon,
	ButterflyIcon,
	Butterfly01Icon,
	BeeIcon,
	Bee01Icon,
	SnakeIcon,
	Snake01Icon,
	WhaleIcon,
	Whale01Icon,
	CrocodileIcon,
	Crocodile01Icon,
	PenguinIcon,
	Penguin01Icon,
	ElephantIcon,
	Elephant01Icon,
	TigerIcon,
	Tiger01Icon,
	LionIcon,
	Lion01Icon,
	BearIcon,
	Bear01Icon,
	HorseIcon,
	Horse01Icon,
	MonkeyIcon,
	Monkey01Icon,
	PandaIcon,
	Panda01Icon,
	KangarooIcon,
	Kangaroo01Icon,
	FlamingoIcon,
	Flamingo01Icon,
	DeerIcon,
	Deer01Icon,
	BitcoinMoney01Icon,
} from "hugeicons-react";

const IconSelector = ({
	isOpen,

	onClose,

	onSelectIcon,

	onSelectShape,

	colors = {
		card: "bg-white",

		border: "border-zinc-200",

		text: "text-zinc-900",

		textMuted: "text-zinc-500",

		textPlaceholder: "placeholder-zinc-400",

		input: "bg-zinc-50",

		buttonSecondary: "bg-transparent",

		hover: "bg-zinc-100",
	},

	position = { x: 0, y: 0 },
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
	const [activeTab, setActiveTab] = useState("icons"); // "icons" or "shapes"

	const icons = [
		{ name: "Folder", component: Folder },

		{ name: "FolderOpen", component: FolderOpen },

		{ name: "FolderPlus", component: FolderPlus },

		{ name: "FolderMinus", component: FolderMinus },

		{ name: "FolderEdit", component: FolderEdit },

		{ name: "FolderSearch", component: FolderSearch },

		{ name: "FolderHeart", component: FolderHeart },

		{ name: "FolderClock", component: FolderClock },

		{ name: "Globe", component: Globe },

		{ name: "FileWarning", component: FileWarning },

		{ name: "FileQuestion", component: FileQuestion },

		{ name: "Info", component: Info },

		{ name: "Settings2", component: Settings2 },

		{ name: "Layers", component: Layers },

		{ name: "Move", component: Move },

		{ name: "Cursor", component: MousePointer2 },

		{ name: "Monitor", component: Monitor },

		{ name: "Tablet", component: Tablet },

		{ name: "Smartphone", component: Smartphone },

		{ name: "CloudLightning", component: CloudLightning },

		{ name: "FileText", component: FileText },

		{ name: "File", component: File },

		{ name: "FileImage", component: FileImage },

		{ name: "Image", component: ImageIcon },

		{ name: "FileCode", component: FileCode },

		{ name: "FileVideo", component: FileVideo },

		{ name: "FileAudio", component: FileAudio },

		{ name: "FileSpreadsheet", component: FileSpreadsheet },

		{ name: "FileArchive", component: FileArchive },

		{ name: "FileCheck", component: FileCheck },

		{ name: "FileX", component: FileX },

		{ name: "FilePlus", component: FilePlus },

		{ name: "FileMinus", component: FileMinus },

		{ name: "FileEdit", component: FileEdit },

		{ name: "FileSearch", component: FileSearch },

		{ name: "FileHeart", component: FileHeart },

		{ name: "FileClock", component: FileClock },

		{ name: "FileSliders", component: FileSliders },

		{ name: "FileBarChart", component: FileBarChart },

		{ name: "FileLineChart", component: FileLineChart },

		{ name: "Activity", component: Activity },

		{ name: "Database", component: Database },

		{ name: "Server", component: Server },

		{ name: "Cloud", component: Cloud },

		{ name: "Camera", component: Camera },

		{ name: "VideoCamera", component: Video },

		{ name: "Download", component: Upload },

		{ name: "Share", component: Share2 },

		{ name: "Clipboard", component: Clipboard },

		{ name: "ClipboardCheck", component: ClipboardCheck },

		{ name: "Lock", component: Lock },

		{ name: "Unlock", component: Unlock },

		{ name: "Shield", component: Shield },

		{ name: "Key", component: Key },

		{ name: "Settings", component: Settings },

		{ name: "Cog", component: Cog },

		{ name: "Wrench", component: Wrench },

		{ name: "Hammer", component: Hammer },

		{ name: "Tool", component: PenTool },

		{ name: "Zap", component: Zap },

		{ name: "Lightning", component: CloudLightning },

		{ name: "Sparkles", component: Sparkles },

		{ name: "GalleryHorizontal", component: GalleryHorizontal },

		{ name: "GalleryVertical", component: GalleryVertical },

		{ name: "Star", component: Star },

		{ name: "Bookmark", component: Bookmark },

		{ name: "Tag", component: Tag },

		{ name: "Label", component: Text },

		{ name: "Palette", component: Palette },

		{ name: "Brush", component: Brush },

		{ name: "PenSquare", component: PenSquare },

		{ name: "PenLine", component: PenLine },

		{ name: "Badge", component: Badge },

		{ name: "Award", component: Award },

		{ name: "Trophy", component: Crown },

		{ name: "Gem", component: Gem },

		{ name: "Diamond", component: Diamond },

		{ name: "Circle", component: Circle },

		{ name: "Square", component: Square },

		{ name: "Triangle", component: Triangle },

		{ name: "Hexagon", component: Hexagon },

		{ name: "Octagon", component: Octagon },

		{ name: "Ellipse", component: EllipsisVertical },

		{ name: "Rectangle", component: RectangleEllipsis },

		{ name: "Shapes", component: Shapes },

		{ name: "Grid", component: Grid },

		{ name: "Layout", component: Layout },

		{ name: "Columns", component: Columns },

		{ name: "Rows", component: Rows },

		{ name: "Box", component: Box },

		{ name: "Package", component: Package },

		{ name: "Basket", component: ShoppingBasket },

		{ name: "Briefcase", component: Briefcase },

		{ name: "Mic", component: Mic },

		{ name: "VolumeUp", component: Volume2 },

		{ name: "VolumeMute", component: VolumeX },

		{ name: "Music", component: Music2 },

		{ name: "Play", component: Play },
		{ name: "Pause", component: Pause },
		{ name: "Stop", component: StopCircle },
		// Hugeicons - Home & Buildings
		{ name: "Home01Icon", component: Home01Icon },
		{ name: "Home02Icon", component: Home02Icon },
		{ name: "Home03Icon", component: Home03Icon },
		{ name: "Home04Icon", component: Home04Icon },
		{ name: "Home05Icon", component: Home05Icon },
		{ name: "Store01Icon", component: Store01Icon },
		{ name: "Store02Icon", component: Store02Icon },
		{ name: "Store03Icon", component: Store03Icon },
		{ name: "Store04Icon", component: Store04Icon },
		{ name: "Building01Icon", component: Building01Icon },
		{ name: "Building02Icon", component: Building02Icon },
		{ name: "Building03Icon", component: Building03Icon },
		{ name: "Building04Icon", component: Building04Icon },
		{ name: "Building05Icon", component: Building05Icon },
		{ name: "City01Icon", component: City01Icon },
		{ name: "City02Icon", component: City02Icon },
		{ name: "City03Icon", component: City03Icon },
		{ name: "House01Icon", component: House01Icon },
		{ name: "House02Icon", component: House02Icon },
		{ name: "House03Icon", component: House03Icon },
		{ name: "House04Icon", component: House04Icon },
		// Hugeicons - Users
		{ name: "UserCircleIcon", component: UserCircleIcon },
		{ name: "UserCircle02Icon", component: UserCircle02Icon },
		{ name: "UserAdd01Icon", component: UserAdd01Icon },
		{ name: "UserAdd02Icon", component: UserAdd02Icon },
		{ name: "UserRemove01Icon", component: UserRemove01Icon },
		{ name: "UserRemove02Icon", component: UserRemove02Icon },
		{ name: "UserCheck01Icon", component: UserCheck01Icon },
		{ name: "UserCheck02Icon", component: UserCheck02Icon },
		{ name: "UserBlock01Icon", component: UserBlock01Icon },
		{ name: "UserBlock02Icon", component: UserBlock02Icon },
		{ name: "UserEdit01Icon", component: UserEdit01Icon },
		{ name: "UserSearch01Icon", component: UserSearch01Icon },
		{ name: "UserQuestion01Icon", component: UserQuestion01Icon },
		{ name: "UserSettings01Icon", component: UserSettings01Icon },
		{ name: "UserStar01Icon", component: UserStar01Icon },
		// Hugeicons - Mail & Messages
		{ name: "Mail01Icon", component: Mail01Icon },
		{ name: "Mail02Icon", component: Mail02Icon },
		{ name: "MailAdd01Icon", component: MailAdd01Icon },
		{ name: "MailAdd02Icon", component: MailAdd02Icon },
		{ name: "MailRemove01Icon", component: MailRemove01Icon },
		{ name: "MailRemove02Icon", component: MailRemove02Icon },
		{ name: "MailOpen01Icon", component: MailOpen01Icon },
		{ name: "MailOpen02Icon", component: MailOpen02Icon },
		{ name: "MailEdit01Icon", component: MailEdit01Icon },
		{ name: "Mailbox01Icon", component: Mailbox01Icon },
		{ name: "Message01Icon", component: Message01Icon },
		{ name: "Message02Icon", component: Message02Icon },
		{ name: "MessageAdd01Icon", component: MessageAdd01Icon },
		{ name: "MessageAdd02Icon", component: MessageAdd02Icon },
		{ name: "MessageDone01Icon", component: MessageDone01Icon },
		{ name: "MessageDone02Icon", component: MessageDone02Icon },
		{ name: "MessageEdit01Icon", component: MessageEdit01Icon },
		{ name: "MessageSearch01Icon", component: MessageSearch01Icon },
		{ name: "Comment01Icon", component: Comment01Icon },
		{ name: "Comment02Icon", component: Comment02Icon },
		{ name: "CommentAdd01Icon", component: CommentAdd01Icon },
		{ name: "CommentAdd02Icon", component: CommentAdd02Icon },
		{ name: "CommentRemove01Icon", component: CommentRemove01Icon },
		{ name: "CommentRemove02Icon", component: CommentRemove02Icon },
		{ name: "CommentBlock01Icon", component: CommentBlock01Icon },
		// Hugeicons - Notifications
		{ name: "Notification01Icon", component: Notification01Icon },
		{ name: "Notification02Icon", component: Notification02Icon },
		{ name: "Notification03Icon", component: Notification03Icon },
		{ name: "NotificationOff01Icon", component: NotificationOff01Icon },
		{ name: "NotificationOff02Icon", component: NotificationOff02Icon },
		// Hugeicons - Calendar & Time
		{ name: "Calendar01Icon", component: Calendar01Icon },
		{ name: "Calendar02Icon", component: Calendar02Icon },
		{ name: "Calendar03Icon", component: Calendar03Icon },
		{ name: "Calendar04Icon", component: Calendar04Icon },
		{ name: "CalendarAdd01Icon", component: CalendarAdd01Icon },
		{ name: "CalendarAdd02Icon", component: CalendarAdd02Icon },
		{ name: "CalendarRemove01Icon", component: CalendarRemove01Icon },
		{ name: "CalendarRemove02Icon", component: CalendarRemove02Icon },
		{ name: "CalendarCheckIn01Icon", component: CalendarCheckIn01Icon },
		{ name: "CalendarCheckOut01Icon", component: CalendarCheckOut01Icon },
		{ name: "Clock01Icon", component: Clock01Icon },
		{ name: "Clock02Icon", component: Clock02Icon },
		{ name: "Clock03Icon", component: Clock03Icon },
		{ name: "Clock04Icon", component: Clock04Icon },
		{ name: "Clock05Icon", component: Clock05Icon },
		{ name: "Time01Icon", component: Time01Icon },
		{ name: "Time02Icon", component: Time02Icon },
		{ name: "Time03Icon", component: Time03Icon },
		{ name: "Time04Icon", component: Time04Icon },
		{ name: "Timer01Icon", component: Timer01Icon },
		{ name: "Timer02Icon", component: Timer02Icon },
		// Hugeicons - Search & Filter
		{ name: "Search01Icon", component: Search01Icon },
		{ name: "Search02Icon", component: Search02Icon },
		// Hugeicons - Social
		{ name: "FavouriteIcon", component: FavouriteIcon },
		{ name: "FavouriteCircleIcon", component: FavouriteCircleIcon },
		{ name: "StarIcon", component: StarIcon },
		{ name: "StarCircleIcon", component: StarCircleIcon },
		{ name: "StarHalfIcon", component: StarHalfIcon },
		{ name: "ThumbsUpIcon", component: ThumbsUpIcon },
		{ name: "ThumbsDownIcon", component: ThumbsDownIcon },
		{ name: "Share01Icon", component: Share01Icon },
		{ name: "Share02Icon", component: Share02Icon },
		{ name: "Share03Icon", component: Share03Icon },
		{ name: "Share04Icon", component: Share04Icon },
		{ name: "Share05Icon", component: Share05Icon },
		{ name: "ShareLocation01Icon", component: ShareLocation01Icon },
		{ name: "ShareLocation02Icon", component: ShareLocation02Icon },
		// Hugeicons - Download & Upload
		{ name: "Download01Icon", component: Download01Icon },
		{ name: "Download02Icon", component: Download02Icon },
		{ name: "Download03Icon", component: Download03Icon },
		{ name: "Download04Icon", component: Download04Icon },
		{ name: "Download05Icon", component: Download05Icon },
		{ name: "Upload01Icon", component: Upload01Icon },
		{ name: "Upload02Icon", component: Upload02Icon },
		{ name: "Upload03Icon", component: Upload03Icon },
		{ name: "Upload04Icon", component: Upload04Icon },
		{ name: "Upload05Icon", component: Upload05Icon },
		{ name: "SendToMobileIcon", component: SendToMobileIcon },
		// Hugeicons - Links
		{ name: "Link01Icon", component: Link01Icon },
		{ name: "Link02Icon", component: Link02Icon },
		{ name: "Link03Icon", component: Link03Icon },
		{ name: "Link04Icon", component: Link04Icon },
		{ name: "Link05Icon", component: Link05Icon },
		{ name: "Link06Icon", component: Link06Icon },
		{ name: "Attachment02Icon", component: Attachment02Icon },
		{ name: "AttachmentCircleIcon", component: AttachmentCircleIcon },
		// Hugeicons - Navigation
		{ name: "Navigation01Icon", component: Navigation01Icon },
		{ name: "Navigation02Icon", component: Navigation02Icon },
		{ name: "Navigation03Icon", component: Navigation03Icon },
		{ name: "Compass01Icon", component: Compass01Icon },
		{ name: "Route01Icon", component: Route01Icon },
		{ name: "Route02Icon", component: Route02Icon },
		{ name: "Route03Icon", component: Route03Icon },
		{ name: "DirectionLeft01Icon", component: DirectionLeft01Icon },
		{ name: "DirectionRight01Icon", component: DirectionRight01Icon },
		// Hugeicons - Arrows
		{ name: "ArrowUp01Icon", component: ArrowUp01Icon },
		{ name: "ArrowUp02Icon", component: ArrowUp02Icon },
		{ name: "ArrowUp03Icon", component: ArrowUp03Icon },
		{ name: "ArrowUp04Icon", component: ArrowUp04Icon },
		{ name: "ArrowUp05Icon", component: ArrowUp05Icon },
		{ name: "ArrowDown01Icon", component: ArrowDown01Icon },
		{ name: "ArrowDown02Icon", component: ArrowDown02Icon },
		{ name: "ArrowDown03Icon", component: ArrowDown03Icon },
		{ name: "ArrowDown04Icon", component: ArrowDown04Icon },
		{ name: "ArrowDown05Icon", component: ArrowDown05Icon },
		{ name: "ArrowLeft01Icon", component: ArrowLeft01Icon },
		{ name: "ArrowLeft02Icon", component: ArrowLeft02Icon },
		{ name: "ArrowLeft03Icon", component: ArrowLeft03Icon },
		{ name: "ArrowLeft04Icon", component: ArrowLeft04Icon },
		{ name: "ArrowLeft05Icon", component: ArrowLeft05Icon },
		{ name: "ArrowRight01Icon", component: ArrowRight01Icon },
		{ name: "ArrowRight02Icon", component: ArrowRight02Icon },
		{ name: "ArrowRight03Icon", component: ArrowRight03Icon },
		{ name: "ArrowRight04Icon", component: ArrowRight04Icon },
		{ name: "ArrowRight05Icon", component: ArrowRight05Icon },
		// Hugeicons - Settings & Menu
		{ name: "Settings01Icon", component: Settings01Icon },
		{ name: "Settings02Icon", component: Settings02Icon },
		{ name: "Settings03Icon", component: Settings03Icon },
		{ name: "Settings04Icon", component: Settings04Icon },
		{ name: "Settings05Icon", component: Settings05Icon },
		{ name: "SettingsError01Icon", component: SettingsError01Icon },
		{ name: "PreferenceHorizontalIcon", component: PreferenceHorizontalIcon },
		{ name: "PreferenceVerticalIcon", component: PreferenceVerticalIcon },
		{ name: "Configuration01Icon", component: Configuration01Icon },
		{ name: "Configuration02Icon", component: Configuration02Icon },
		{ name: "Menu01Icon", component: Menu01Icon },
		{ name: "Menu02Icon", component: Menu02Icon },
		{ name: "Menu03Icon", component: Menu03Icon },
		{ name: "Menu04Icon", component: Menu04Icon },
		{ name: "Menu05Icon", component: Menu05Icon },
		{ name: "Menu06Icon", component: Menu06Icon },
		{ name: "Menu07Icon", component: Menu07Icon },
		{ name: "Menu08Icon", component: Menu08Icon },
		{ name: "Menu09Icon", component: Menu09Icon },
		{ name: "Menu10Icon", component: Menu10Icon },
		{ name: "Menu11Icon", component: Menu11Icon },
		{ name: "MoreHorizontalIcon", component: MoreHorizontalIcon },
		{ name: "MoreVerticalIcon", component: MoreVerticalIcon },
		{
			name: "MoreHorizontalCircle01Icon",
			component: MoreHorizontalCircle01Icon,
		},
		{
			name: "MoreHorizontalCircle02Icon",
			component: MoreHorizontalCircle02Icon,
		},
		{ name: "MoreVerticalCircle01Icon", component: MoreVerticalCircle01Icon },
		{ name: "MoreVerticalCircle02Icon", component: MoreVerticalCircle02Icon },
		{ name: "MoreVerticalSquare01Icon", component: MoreVerticalSquare01Icon },
		{ name: "MoreVerticalSquare02Icon", component: MoreVerticalSquare02Icon },
		{ name: "GridIcon", component: GridIcon },
		{ name: "DashboardSquare01Icon", component: DashboardSquare01Icon },
		{ name: "DashboardSquare02Icon", component: DashboardSquare02Icon },
		{ name: "DashboardCircleIcon", component: DashboardCircleIcon },
		{ name: "DashboardBrowsingIcon", component: DashboardBrowsingIcon },
		// Hugeicons - Folders
		{ name: "Folder01Icon", component: Folder01Icon },
		{ name: "Folder02Icon", component: Folder02Icon },
		{ name: "Folder03Icon", component: Folder03Icon },
		{ name: "FolderShared01Icon", component: FolderShared01Icon },
		{ name: "FolderAttachmentIcon", component: FolderAttachmentIcon },
		{ name: "FolderSecurityIcon", component: FolderSecurityIcon },
		// Hugeicons - Files
		{ name: "File01Icon", component: File01Icon },
		{ name: "File02Icon", component: File02Icon },
		// Hugeicons - Images
		{ name: "Image01Icon", component: Image01Icon },
		{ name: "Image02Icon", component: Image02Icon },
		{ name: "ImageAdd01Icon", component: ImageAdd01Icon },
		{ name: "ImageAdd02Icon", component: ImageAdd02Icon },
		{ name: "ImageRemove01Icon", component: ImageRemove01Icon },
		{ name: "ImageRemove02Icon", component: ImageRemove02Icon },
		{ name: "ImageDownload02Icon", component: ImageDownload02Icon },
		{ name: "ImageUpload01Icon", component: ImageUpload01Icon },
		{ name: "ImageCropIcon", component: ImageCropIcon },
		// Hugeicons - Crypto & Finance
		{ name: "Bitcoin04Icon", component: Bitcoin04Icon },
		{ name: "BitcoinCircleIcon", component: BitcoinCircleIcon },
		{ name: "BitcoinEllipseIcon", component: BitcoinEllipseIcon },
		{ name: "BitcoinBagIcon", component: BitcoinBagIcon },
		{ name: "EthereumEllipseIcon", component: EthereumEllipseIcon },
		{ name: "Blockchain01Icon", component: Blockchain01Icon },
		{ name: "Blockchain02Icon", component: Blockchain02Icon },
		{ name: "Blockchain03Icon", component: Blockchain03Icon },
		{ name: "Blockchain04Icon", component: Blockchain04Icon },
		{ name: "Blockchain05Icon", component: Blockchain05Icon },
		{ name: "Blockchain06Icon", component: Blockchain06Icon },
		{ name: "Blockchain07Icon", component: Blockchain07Icon },
		// Hugeicons - Security
		{ name: "PasswordValidationIcon", component: PasswordValidationIcon },
		{ name: "Key01Icon", component: Key01Icon },
		{ name: "Key02Icon", component: Key02Icon },
		{ name: "SecurityBlockIcon", component: SecurityBlockIcon },
		{ name: "Shield01Icon", component: Shield01Icon },
		{ name: "Shield02Icon", component: Shield02Icon },
		// Hugeicons - View
		{ name: "EyeIcon", component: EyeIcon },
		{ name: "ViewOffIcon", component: ViewOffIcon },
		{ name: "ViewOffSlashIcon", component: ViewOffSlashIcon },
		// Hugeicons - Weather
		{ name: "Sun01Icon", component: Sun01Icon },
		{ name: "Sun02Icon", component: Sun02Icon },
		{ name: "Sun03Icon", component: Sun03Icon },
		{ name: "SunCloud01Icon", component: SunCloud01Icon },
		{ name: "SunCloud02Icon", component: SunCloud02Icon },
		{ name: "MoonIcon", component: MoonIcon },
		{ name: "Moon01Icon", component: Moon01Icon },
		{ name: "Moon02Icon", component: Moon02Icon },
		{ name: "CloudSavingDone01Icon", component: CloudSavingDone01Icon },
		{ name: "CloudSavingDone02Icon", component: CloudSavingDone02Icon },
		// SVG Shapes as Icons
		{ name: "StarBurstShape", component: StarBurstShape },
		{ name: "CrossShape", component: CrossShape },
		{ name: "WaveShape", component: WaveShape },
		{ name: "PinwheelShape", component: PinwheelShape },
		{ name: "ArrowFoldShape", component: ArrowFoldShape },
		{ name: "ChainShape", component: ChainShape },
		{ name: "ColumnsShape", component: ColumnsShape },
		{ name: "QuarterCirclesShape", component: QuarterCirclesShape },
		{ name: "PetalsShape", component: PetalsShape },
		{ name: "ArchSplitShape", component: ArchSplitShape },
		{ name: "LeafQuartersShape", component: LeafQuartersShape },
		{ name: "CornerCirclesShape", component: CornerCirclesShape },
		{ name: "PuzzleShape", component: PuzzleShape },
		{ name: "TargetShape", component: TargetShape },
		{ name: "GridPlusShape", component: GridPlusShape },
		{ name: "DiamondDotsShape", component: DiamondDotsShape },
		{ name: "BlobShape", component: BlobShape },
		{ name: "FlowerShape", component: FlowerShape },
		{ name: "FourPetalsShape", component: FourPetalsShape },
		{ name: "BoneShape", component: BoneShape },
		{ name: "PillShape", component: PillShape },
		{ name: "CloverShape", component: CloverShape },
		{ name: "KeyShapeIcon", component: KeyShapeIcon },
		{ name: "CloverAltShape", component: CloverAltShape },
		{ name: "ChevronDropShape", component: ChevronDropShape },
		{ name: "ZigzagShape", component: ZigzagShape },
		{ name: "ArrowTriShape", component: ArrowTriShape },
		{ name: "PropellerShape", component: PropellerShape },
		{ name: "GearShape", component: GearShape },
		{ name: "GearHexShape", component: GearHexShape },
		{ name: "CogShape", component: CogShape },
		{ name: "SunRaysShape", component: SunRaysShape },
		{ name: "SemicircleShape", component: SemicircleShape },
		{ name: "ArcDoubleShape", component: ArcDoubleShape },
		{ name: "DonutShape", component: DonutShape },
		{ name: "CirclesCornersShape", component: CirclesCornersShape },
		{ name: "EllipseCrossShape", component: EllipseCrossShape },
		{ name: "DropShape", component: DropShape },
		{ name: "EyeShape", component: EyeShape },
		{ name: "EyeRingShape", component: EyeRingShape },
		{ name: "DiamondEyeShape", component: DiamondEyeShape },
		{ name: "LightningShape", component: LightningShape },
		{ name: "ArrowCrossShape", component: ArrowCrossShape },
		{ name: "HexagonArrowsShape", component: HexagonArrowsShape },
		{ name: "RibbonShape", component: RibbonShape },
		{ name: "SquaresShape", component: SquaresShape },
		{ name: "SparkleShape", component: SparkleShape },
		{ name: "HexShape", component: HexShape },
		{ name: "DiamondShape", component: DiamondShape },
		{ name: "Star4ptShape", component: Star4ptShape },
		{ name: "Star8ptShape", component: Star8ptShape },
		{ name: "HourglassShape", component: HourglassShape },
		{ name: "CloudFlowerShape", component: CloudFlowerShape },
		{ name: "PawShape", component: PawShape },
		{ name: "SquircleShape", component: SquircleShape },
		{ name: "CircleRingShape", component: CircleRingShape },
		{ name: "CrescentShape", component: CrescentShape },
		{ name: "SpiralCirclesShape", component: SpiralCirclesShape },
		// Country Flags
		{ name: "FlagAfghanistan", component: FlagAfghanistan },
		{ name: "FlagAlbania", component: FlagAlbania },
		{ name: "FlagAlgeria", component: FlagAlgeria },
		{ name: "FlagAndorra", component: FlagAndorra },
		{ name: "FlagAngola", component: FlagAngola },
		{ name: "FlagArgentina", component: FlagArgentina },
		{ name: "FlagArmenia", component: FlagArmenia },
		{ name: "FlagAustralia", component: FlagAustralia },
		{ name: "FlagAustria", component: FlagAustria },
		{ name: "FlagAzerbaijan", component: FlagAzerbaijan },
		{ name: "FlagBahamas", component: FlagBahamas },
		{ name: "FlagBahrain", component: FlagBahrain },
		{ name: "FlagBangladesh", component: FlagBangladesh },
		{ name: "FlagBarbados", component: FlagBarbados },
		{ name: "FlagBelarus", component: FlagBelarus },
		{ name: "FlagBelgium", component: FlagBelgium },
		{ name: "FlagBelize", component: FlagBelize },
		{ name: "FlagBenin", component: FlagBenin },
		{ name: "FlagBhutan", component: FlagBhutan },
		{ name: "FlagBolivia", component: FlagBolivia },
		{ name: "FlagBosniaHerzegovina", component: FlagBosniaHerzegovina },
		{ name: "FlagBotswana", component: FlagBotswana },
		{ name: "FlagBrazil", component: FlagBrazil },
		{ name: "FlagBrunei", component: FlagBrunei },
		{ name: "FlagBulgaria", component: FlagBulgaria },
		{ name: "FlagBurkinaFaso", component: FlagBurkinaFaso },
		{ name: "FlagBurundi", component: FlagBurundi },
		{ name: "FlagCambodia", component: FlagCambodia },
		{ name: "FlagCameroon", component: FlagCameroon },
		{ name: "FlagCanada", component: FlagCanada },
		{ name: "FlagCapeVerde", component: FlagCapeVerde },
		{
			name: "FlagCentralAfricanRepublic",
			component: FlagCentralAfricanRepublic,
		},
		{ name: "FlagChad", component: FlagChad },
		{ name: "FlagChile", component: FlagChile },
		{ name: "FlagChina", component: FlagChina },
		{ name: "FlagColombia", component: FlagColombia },
		{ name: "FlagComoros", component: FlagComoros },
		{ name: "FlagCongo", component: FlagCongo },
		{ name: "FlagCostaRica", component: FlagCostaRica },
		{ name: "FlagCroatia", component: FlagCroatia },
		{ name: "FlagCuba", component: FlagCuba },
		{ name: "FlagCyprus", component: FlagCyprus },
		{ name: "FlagCzechia", component: FlagCzechia },
		{ name: "FlagDenmark", component: FlagDenmark },
		{ name: "FlagDjibouti", component: FlagDjibouti },
		{ name: "FlagDominica", component: FlagDominica },
		{ name: "FlagDominicanRepublic", component: FlagDominicanRepublic },
		{ name: "FlagEcuador", component: FlagEcuador },
		{ name: "FlagEgypt", component: FlagEgypt },
		{ name: "FlagElSalvador", component: FlagElSalvador },
		{ name: "FlagEquatorialGuinea", component: FlagEquatorialGuinea },
		{ name: "FlagEritrea", component: FlagEritrea },
		{ name: "FlagEstonia", component: FlagEstonia },
		{ name: "FlagEswatini", component: FlagEswatini },
		{ name: "FlagEthiopia", component: FlagEthiopia },
		{ name: "FlagFiji", component: FlagFiji },
		{ name: "FlagFinland", component: FlagFinland },
		{ name: "FlagFrance", component: FlagFrance },
		{ name: "FlagGabon", component: FlagGabon },
		{ name: "FlagGambia", component: FlagGambia },
		{ name: "FlagGeorgia", component: FlagGeorgia },
		{ name: "FlagGermany", component: FlagGermany },
		{ name: "FlagGhana", component: FlagGhana },
		{ name: "FlagGreece", component: FlagGreece },
		{ name: "FlagGrenada", component: FlagGrenada },
		{ name: "FlagGuatemala", component: FlagGuatemala },
		{ name: "FlagGuinea", component: FlagGuinea },
		{ name: "FlagGuineaBissau", component: FlagGuineaBissau },
		{ name: "FlagGuyana", component: FlagGuyana },
		{ name: "FlagHaiti", component: FlagHaiti },
		{ name: "FlagHonduras", component: FlagHonduras },
		{ name: "FlagHungary", component: FlagHungary },
		{ name: "FlagIceland", component: FlagIceland },
		{ name: "FlagIndia", component: FlagIndia },
		{ name: "FlagIndonesia", component: FlagIndonesia },
		{ name: "FlagIran", component: FlagIran },
		{ name: "FlagIraq", component: FlagIraq },
		{ name: "FlagIreland", component: FlagIreland },
		{ name: "FlagIsrael", component: FlagIsrael },
		{ name: "FlagItaly", component: FlagItaly },
		{ name: "FlagIvoryCoast", component: FlagIvoryCoast },
		{ name: "FlagJamaica", component: FlagJamaica },
		{ name: "FlagJapan", component: FlagJapan },
		{ name: "FlagJordan", component: FlagJordan },
		{ name: "FlagKazakhstan", component: FlagKazakhstan },
		{ name: "FlagKenya", component: FlagKenya },
		{ name: "FlagKiribati", component: FlagKiribati },
		{ name: "FlagKuwait", component: FlagKuwait },
		{ name: "FlagKyrgyzstan", component: FlagKyrgyzstan },
		{ name: "FlagLaos", component: FlagLaos },
		{ name: "FlagLatvia", component: FlagLatvia },
		{ name: "FlagLebanon", component: FlagLebanon },
		{ name: "FlagLesotho", component: FlagLesotho },
		{ name: "FlagLiberia", component: FlagLiberia },
		{ name: "FlagLibya", component: FlagLibya },
		{ name: "FlagLiechtenstein", component: FlagLiechtenstein },
		{ name: "FlagLithuania", component: FlagLithuania },
		{ name: "FlagLuxembourg", component: FlagLuxembourg },
		{ name: "FlagMadagascar", component: FlagMadagascar },
		{ name: "FlagMalawi", component: FlagMalawi },
		{ name: "FlagMalaysia", component: FlagMalaysia },
		{ name: "FlagMaldives", component: FlagMaldives },
		{ name: "FlagMali", component: FlagMali },
		{ name: "FlagMalta", component: FlagMalta },
		{ name: "FlagMarshallIslands", component: FlagMarshallIslands },
		{ name: "FlagMauritania", component: FlagMauritania },
		{ name: "FlagMauritius", component: FlagMauritius },
		{ name: "FlagMexico", component: FlagMexico },
		{ name: "FlagMicronesia", component: FlagMicronesia },
		{ name: "FlagMoldova", component: FlagMoldova },
		{ name: "FlagMonaco", component: FlagMonaco },
		{ name: "FlagMongolia", component: FlagMongolia },
		{ name: "FlagMontenegro", component: FlagMontenegro },
		{ name: "FlagMorocco", component: FlagMorocco },
		{ name: "FlagMozambique", component: FlagMozambique },
		{ name: "FlagMyanmar", component: FlagMyanmar },
		{ name: "FlagNamibia", component: FlagNamibia },
		{ name: "FlagNauru", component: FlagNauru },
		{ name: "FlagNepal", component: FlagNepal },
		{ name: "FlagNetherlands", component: FlagNetherlands },
		{ name: "FlagNewZealand", component: FlagNewZealand },
		{ name: "FlagNicaragua", component: FlagNicaragua },
		{ name: "FlagNiger", component: FlagNiger },
		{ name: "FlagNigeria", component: FlagNigeria },
		{ name: "FlagNorthKorea", component: FlagNorthKorea },
		{ name: "FlagNorthMacedonia", component: FlagNorthMacedonia },
		{ name: "FlagNorway", component: FlagNorway },
		{ name: "FlagOman", component: FlagOman },
		{ name: "FlagPakistan", component: FlagPakistan },
		{ name: "FlagPalau", component: FlagPalau },
		{ name: "FlagPalestine", component: FlagPalestine },
		{ name: "FlagPanama", component: FlagPanama },
		{ name: "FlagPapuaNewGuinea", component: FlagPapuaNewGuinea },
		{ name: "FlagParaguay", component: FlagParaguay },
		{ name: "FlagPeru", component: FlagPeru },
		{ name: "FlagPhilippines", component: FlagPhilippines },
		{ name: "FlagPoland", component: FlagPoland },
		{ name: "FlagPortugal", component: FlagPortugal },
		{ name: "FlagQatar", component: FlagQatar },
		{ name: "FlagRomania", component: FlagRomania },
		{ name: "FlagRussia", component: FlagRussia },
		{ name: "FlagRwanda", component: FlagRwanda },
		{ name: "FlagSaintKittsNevis", component: FlagSaintKittsNevis },
		{ name: "FlagSaintLucia", component: FlagSaintLucia },
		{ name: "FlagSaintVincent", component: FlagSaintVincent },
		{ name: "FlagSamoa", component: FlagSamoa },
		{ name: "FlagSanMarino", component: FlagSanMarino },
		{ name: "FlagSaoTomePrincipe", component: FlagSaoTomePrincipe },
		{ name: "FlagSaudiArabia", component: FlagSaudiArabia },
		{ name: "FlagSenegal", component: FlagSenegal },
		{ name: "FlagSerbia", component: FlagSerbia },
		{ name: "FlagSeychelles", component: FlagSeychelles },
		{ name: "FlagSierraLeone", component: FlagSierraLeone },
		{ name: "FlagSingapore", component: FlagSingapore },
		{ name: "FlagSlovakia", component: FlagSlovakia },
		{ name: "FlagSlovenia", component: FlagSlovenia },
		{ name: "FlagSolomonIslands", component: FlagSolomonIslands },
		{ name: "FlagSomalia", component: FlagSomalia },
		{ name: "FlagSouthAfrica", component: FlagSouthAfrica },
		{ name: "FlagSouthKorea", component: FlagSouthKorea },
		{ name: "FlagSouthSudan", component: FlagSouthSudan },
		{ name: "FlagSpain", component: FlagSpain },
		{ name: "FlagSriLanka", component: FlagSriLanka },
		{ name: "FlagSudan", component: FlagSudan },
		{ name: "FlagSuriname", component: FlagSuriname },
		{ name: "FlagSweden", component: FlagSweden },
		{ name: "FlagSwitzerland", component: FlagSwitzerland },
		{ name: "FlagSyria", component: FlagSyria },
		{ name: "FlagTaiwan", component: FlagTaiwan },
		{ name: "FlagTajikistan", component: FlagTajikistan },
		{ name: "FlagTanzania", component: FlagTanzania },
		{ name: "FlagThailand", component: FlagThailand },
		{ name: "FlagTimorLeste", component: FlagTimorLeste },
		{ name: "FlagTogo", component: FlagTogo },
		{ name: "FlagTonga", component: FlagTonga },
		{ name: "FlagTrinidadTobago", component: FlagTrinidadTobago },
		{ name: "FlagTunisia", component: FlagTunisia },
		{ name: "FlagTurkey", component: FlagTurkey },
		{ name: "FlagTurkmenistan", component: FlagTurkmenistan },
		{ name: "FlagTuvalu", component: FlagTuvalu },
		{ name: "FlagUganda", component: FlagUganda },
		{ name: "FlagUkraine", component: FlagUkraine },
		{ name: "FlagUnitedArabEmirates", component: FlagUnitedArabEmirates },
		{ name: "FlagUnitedKingdom", component: FlagUnitedKingdom },
		{ name: "FlagUnitedStates", component: FlagUnitedStates },
		{ name: "FlagUruguay", component: FlagUruguay },
		{ name: "FlagUzbekistan", component: FlagUzbekistan },
		{ name: "FlagVanuatu", component: FlagVanuatu },
		{ name: "FlagVaticanCity", component: FlagVaticanCity },
		{ name: "FlagVenezuela", component: FlagVenezuela },
		{ name: "FlagVietnam", component: FlagVietnam },
		{ name: "FlagYemen", component: FlagYemen },
		{ name: "FlagZambia", component: FlagZambia },
		{ name: "FlagZimbabwe", component: FlagZimbabwe },
	];

	// Configure Fuse.js for fuzzy search

	const fuse = useMemo(() => {
		return new Fuse(icons, {
			keys: ["name"],

			threshold: 0.3,

			includeScore: true,
		});
	}, []);

	// Filter icons based on search query

	const filteredIcons = useMemo(() => {
		if (!searchQuery.trim()) {
			return icons;
		}

		const results = fuse.search(searchQuery);

		return results.map((result) => result.item);
	}, [searchQuery, fuse]);

	// Filter shapes based on search query
	const filteredShapes = useMemo(() => {
		if (!searchQuery.trim()) {
			return svgShapesArray;
		}
		const query = searchQuery.toLowerCase();
		return svgShapesArray.filter((shape) =>
			shape.name.toLowerCase().includes(query)
		);
	}, [searchQuery]);

	const handleIconClick = (iconName, IconComponent) => {
		onSelectIcon(iconName, IconComponent);
	};

	const handleShapeClick = (shape) => {
		if (onSelectShape) {
			onSelectShape(shape.id, shape.svg, shape.name);
		}
	};

	// Render SVG preview with fixed size and color
	const renderSvgPreview = (svgString) => {
		const processedSvg = svgString
			.replace(/\$\{width\}/g, "24")
			.replace(/\$\{height\}/g, "24")
			.replace(/\$\{color\}/g, "currentColor");
		return { __html: processedSvg };
	};

	const handleClose = () => {
		setSearchQuery("");
		setActiveTab("icons");
		setDragPosition({ x: 0, y: 0 }); // Reset position on close
		onClose();
	};

	return (
		<motion.div
			initial={{ scale: 0.8, opacity: 0, x: 0, y: 0 }}
			animate={{
				scale: 1,
				opacity: 1,
				x: dragPosition.x,
				y: dragPosition.y,
			}}
			exit={{ scale: 0.8, opacity: 0, x: dragPosition.x, y: dragPosition.y }}
			drag
			dragMomentum={false}
			dragElastic={0}
			onDrag={(event, info) => {
				setDragPosition({ x: info.offset.x, y: info.offset.y });
			}}
			className={`fixed z-50 ${colors.card} rounded-xl shadow-xl border ${colors.border} overflow-hidden cursor-move`}
			style={{
				left: "50%",
				top: "50%",
				width: "400px",
				height: "420px",
				maxWidth: "90vw",
				maxHeight: "80vh",
				transform: "translate(-50%, -50%)",
			}}
			onClick={(e) => e.stopPropagation()}
		>
			{/* Header - Draggable area */}
			<div
				className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 cursor-move select-none"
				onMouseDown={(e) => {
					// Prevent text selection while dragging
					if (e.target === e.currentTarget || e.target.closest("h3")) {
						e.preventDefault();
					}
				}}
			>
				{/* Tabs */}
				<div className="flex items-center gap-1">
					<button
						onClick={() => setActiveTab("icons")}
						onMouseDown={(e) => e.stopPropagation()}
						className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
							activeTab === "icons"
								? "bg-zinc-900 text-white"
								: `${colors.textMuted} hover:bg-zinc-100`
						}`}
					>
						Icons
					</button>
					<button
						onClick={() => setActiveTab("shapes")}
						onMouseDown={(e) => e.stopPropagation()}
						className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
							activeTab === "shapes"
								? "bg-zinc-900 text-white"
								: `${colors.textMuted} hover:bg-zinc-100`
						}`}
					>
						Shapes
					</button>
				</div>

				<button
					onClick={handleClose}
					onMouseDown={(e) => {
						e.stopPropagation();
						e.preventDefault();
					}}
					className={`p-1 ${colors.buttonSecondary} rounded-xl transition-colors hover:${colors.hover} cursor-pointer`}
				>
					<svg
						className={`w-3 h-3 ${colors.textMuted}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			{/* Search Input */}

			<div className="px-4 py-2 border-b border-zinc-200">
				<div
					className={`flex gap-1 items-center justify-start ${colors.input} ${colors.text} rounded-xl hover:bg-zinc-50 px-2`}
				>
					<svg
						className={`w-3 h-3 ${colors.textMuted}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>

					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search icons..."
						className={`w-full py-1 ${colors.input} rounded-xl border-none  ${colors.textPlaceholder} focus:outline-none transition-colors`}
						autoFocus
					/>

					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${colors.textMuted} hover:${colors.text} transition-colors`}
						>
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</div>
			</div>

			{/* Icons/Shapes Grid */}
			<div
				className="p-4 overflow-y-auto"
				style={{ height: "calc(100% - 40px)" }}
			>
				<div className="flex flex-wrap gap-2 items-center">
					{activeTab === "icons" ? (
						// Icons Tab
						filteredIcons.length > 0 ? (
							filteredIcons.map((icon, index) => {
								const IconComponent = icon.component;
								return (
									<motion.button
										key={index}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => handleIconClick(icon.name, IconComponent)}
										className={`w-fit p-2 rounded-xl transition-colors hover:${colors.hover} flex items-center justify-center group`}
										title={icon.name}
									>
										<IconComponent
											className={`w-5 h-5 group-hover:${colors.text} transition-colors`}
										/>
									</motion.button>
								);
							})
						) : (
							<div className={`w-full text-center py-8 ${colors.textMuted}`}>
								<svg
									className="w-8 h-8 mx-auto mb-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709"
									/>
								</svg>
								<p className="text-sm">No icons found</p>
								<p className="text-xs mt-1">Try a different search term</p>
							</div>
						)
					) : // Shapes Tab
					filteredShapes.length > 0 ? (
						filteredShapes.map((shape) => (
							<motion.button
								key={shape.id}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => handleShapeClick(shape)}
								className={`w-fit p-2 rounded-xl transition-colors hover:${colors.hover} flex items-center justify-center group`}
								title={shape.name}
							>
								<div
									className={`w-6 h-6 ${colors.text} group-hover:text-zinc-900 transition-colors`}
									dangerouslySetInnerHTML={renderSvgPreview(shape.svg)}
								/>
							</motion.button>
						))
					) : (
						<div className={`w-full text-center py-8 ${colors.textMuted}`}>
							<svg
								className="w-8 h-8 mx-auto mb-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
								/>
							</svg>
							<p className="text-sm">No shapes found</p>
							<p className="text-xs mt-1">Try a different search term</p>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default IconSelector;
export { IconSelector };
