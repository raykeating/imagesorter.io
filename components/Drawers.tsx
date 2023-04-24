import React, { useState } from "react";
import Drawer from "./Drawer";
import DownloadDrawer from "./DownloadDrawer";
import SettingsDrawer from "./SettingsDrawer";
import TagsDrawer from "./TagsDrawer";
import UndoButtons from "./UndoButtons";

type DrawerType = "tags" | "settings" | "download";

export default function Drawers({undoPhotos, redoPhotos, keysPressed}: {undoPhotos: () => void, redoPhotos: () => void, keysPressed: {control: boolean, shift: boolean, lowerZ: boolean, upperZ: boolean}}) {
	const [openDrawer, setOpenDrawer] = useState<DrawerType | null>("tags");

	return (
		<div className="flex flex-col fixed right-0 bottom-0 w-full">
            <div className="flex justify-between items-center px-6 py-2">
                <UndoButtons
                    undoPhotos={undoPhotos}
                    redoPhotos={redoPhotos}
                    keysPressed={keysPressed}
                />
                <div className="flex gap-1">
                    <DrawerButton setOpenDrawer={setOpenDrawer} type="tags" active={openDrawer === "tags"} />
                    <DrawerButton setOpenDrawer={setOpenDrawer} type="settings" active={openDrawer === "settings"} />
                    <DrawerButton setOpenDrawer={setOpenDrawer} type="download" active={openDrawer === "download"} />
                </div>
            </div>
            <Drawer>
                {getDrawer(openDrawer)}
            </Drawer>
		</div>
	);
}

function DrawerButton({ type, active, setOpenDrawer }: { type: DrawerType; active?: boolean, setOpenDrawer: (type: DrawerType | null) => void }) {

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [hasBeenHovered, setHasBeenHovered] = useState<boolean>(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    }

    const handleMouseLeave = () => {
        setIsHovered(false);
        setHasBeenHovered(true);
    }

    const handleClick = () => {
        if (active) {
            setOpenDrawer(null);
            return;
        }
        setOpenDrawer(type)
        setHasBeenHovered(false);
    }

	const btnStyle =
		"bg-transparent w-10 h-10 hover:bg-black hover:text-white rounded-lg p-2 flex items-center justify-center text-zinc-400";
	const activeBtnStyle =
		"bg-black w-10 h-10 rounded-lg p-2 flex items-center justify-center text-white text-shadow";

	const glow = "drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]";

	const icons = {
		tags: "fa-solid fa-tags",
		settings: "fa-solid fa-cog",
		download: "fa-solid fa-download",
	};

	return (
		<button className={active ? activeBtnStyle : btnStyle} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<i className={`text-lg ${(isHovered && active && hasBeenHovered) ? "fa-solid fa-angle-down" : icons[type]} ${active && glow}`}></i>
		</button>
	);
}

function getDrawer(type: DrawerType | null) {
    switch (type) {
        case "tags":
            return <TagsDrawer />;
        case "settings":
            return <SettingsDrawer />;
        case "download":
            return <DownloadDrawer />;
        default:
            return null;
    }
}
