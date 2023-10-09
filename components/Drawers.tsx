// This file is messy.  Should be refactored soon.
import React, { useState } from "react";
import Drawer from "@/components/Drawer";
import DownloadDrawer from "@/components/DownloadDrawer";
import SettingsDrawer from "@/components/SettingsDrawer";
import TagsDrawer from "@/components/TagsDrawer";
import UndoButtons from "@/components/UndoButtons";
import Photo from "@/types/Photo";
import Image from "next/image";

type DrawerType = "tags" | "settings" | "download"; // settings is not currently used

export default function Drawers({
	undoPhotos,
	redoPhotos,
	selectedItems,
	handlePredict,
	handleDownloadPhotos,
	confidenceThreshold,
	setConfidenceThreshold,
}: {
	undoPhotos: () => void;
	redoPhotos: () => void;
	selectedItems: Photo[];
	handlePredict: () => void;
	handleDownloadPhotos: (options: {
		isUsingSubfolders: boolean;
		numberByGridOrder: boolean;
		appendTagToFilename: boolean;
		onlyDownloadSelected: boolean;
	}) => void;
	confidenceThreshold: number;
	setConfidenceThreshold: React.Dispatch<React.SetStateAction<number>>;
}) {
	const [openDrawer, setOpenDrawer] = useState<DrawerType | null>("tags");

	// download options
	const [isUsingSubfolders, setIsUsingSubfolders] = useState<boolean>(true);
	const [numberByGridOrder, setNumberByGridOrder] = useState<boolean>(true);
	const [appendTagToFilename, setAppendTagToFilename] =
		useState<boolean>(false);

	return (
		<div
			className="flex flex-col fixed right-0 bottom-0 w-full"
			style={{ zIndex: 999 }}
			onClick={(e) => e.stopPropagation()}
		>
			<div className="flex justify-between items-center px-4 py-2">
				<UndoButtons undoPhotos={undoPhotos} redoPhotos={redoPhotos} />
				<div className="flex gap-1">
					<DrawerButton
						setOpenDrawer={setOpenDrawer}
						type="tags"
						active={openDrawer === "tags"}
					/>
					<DrawerButton
						setOpenDrawer={setOpenDrawer}
						type="download"
						active={openDrawer === "download"}
					/>
				</div>
			</div>
			<Drawer>
				{getDrawer(
					openDrawer,
					selectedItems,
					handlePredict,
					handleDownloadPhotos,
					confidenceThreshold,
					setConfidenceThreshold,
					{
						isUsingSubfolders,
						setIsUsingSubfolders,
						numberByGridOrder,
						setNumberByGridOrder,
						appendTagToFilename,
						setAppendTagToFilename,
					}
				)}
			</Drawer>
		</div>
	);
}

function DrawerButton({
	type,
	active,
	setOpenDrawer,
}: {
	type: DrawerType;
	active?: boolean;
	setOpenDrawer: (type: DrawerType | null) => void;
}) {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [hasBeenHovered, setHasBeenHovered] = useState<boolean>(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		setHasBeenHovered(true);
	};

	const handleClick = () => {
		if (active) {
			setOpenDrawer(null);
			return;
		}
		setOpenDrawer(type);
		setHasBeenHovered(false);
	};

	const btnStyle =
		"bg-white/60 lg:bg-white/10 lg:text-zinc-400 text-black backdrop-blur w-10 h-10 hover:bg-black hover:text-white rounded-lg p-2 flex items-center justify-center text-zinc-400";
	const activeBtnStyle =
		"bg-black w-10 h-10 rounded-lg p-2 flex items-center justify-center text-white text-shadow";

	const glow = "drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]";

	const icons = {
		tags: "fa-solid fa-tags",
		settings: "fa-solid fa-cog",
		download: "fa-solid fa-download",
	};

	return (
		<button
			className={active ? activeBtnStyle : btnStyle}
			onClick={handleClick}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<i
				className={`text-lg ${
					isHovered && active && hasBeenHovered
						? "fa-solid fa-angle-down"
						: icons[type]
				} ${active && glow}`}
			></i>
		</button>
	);
}

function getDrawer(
	type: DrawerType | null,
	selectedItems: Photo[],
	handlePredict: () => void,
	handleDownloadPhotos: (options: {
		isUsingSubfolders: boolean;
		numberByGridOrder: boolean;
		appendTagToFilename: boolean;
		onlyDownloadSelected: boolean;
	}) => void,
	confidenceThreshold: number,
	setConfidenceThreshold: React.Dispatch<React.SetStateAction<number>>,
	downloadState: {
		isUsingSubfolders: boolean;
		setIsUsingSubfolders: React.Dispatch<React.SetStateAction<boolean>>;
		numberByGridOrder: boolean;
		setNumberByGridOrder: React.Dispatch<React.SetStateAction<boolean>>;
		appendTagToFilename: boolean;
		setAppendTagToFilename: React.Dispatch<React.SetStateAction<boolean>>;
	}
) {
	switch (type) {
		case "tags":
			return (
				<TagsDrawer
					handlePredict={handlePredict}
					selectedPhotos={selectedItems}
					confidenceThreshold={confidenceThreshold}
					setConfidenceThreshold={setConfidenceThreshold}
				/>
			);
		case "settings":
			return <SettingsDrawer />;
		case "download":
			return (
				<DownloadDrawer
					selectedPhotos={selectedItems}
					handleDownloadPhotos={handleDownloadPhotos}
					isUsingSubfolders={downloadState.isUsingSubfolders}
					setIsUsingSubfolders={downloadState.setIsUsingSubfolders}
					numberByGridOrder={downloadState.numberByGridOrder}
					setNumberByGridOrder={downloadState.setNumberByGridOrder}
					appendTagToFilename={downloadState.appendTagToFilename}
					setAppendTagToFilename={downloadState.setAppendTagToFilename}
				/>
			);
		default:
			return null;
	}
}
