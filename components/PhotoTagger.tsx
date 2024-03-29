import { Tag } from "@/types/Photo";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/util/appContext";
import SearchableSelect from "./SearchableSelect";
import { motion, AnimatePresence } from "framer-motion";
import { Popover } from "react-tiny-popover";

type Props = {
	photoId: string;
	tag: Tag | null;
	addingTag: string | null;
	setAddingTag: React.Dispatch<React.SetStateAction<string | null>>;
	setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
	isHovered: boolean;
};

export default function PhotoTagger({
	photoId,
	tag,
	addingTag,
	setAddingTag,
	setSelectedItems,
	isHovered,
}: Props) {
	const { photos, setPhotos } = useContext(AppContext);

	const [searchValue, setSearchValue] = useState<string>(""); // this could be moved to SearchableSelect.tsx, but needed to clear the search value when the user clicks the clear button
	const [showingTooltip, setShowingTooltip] = useState<boolean>(false);
	const [tooltipTimer, setTooltipTimer] = useState<NodeJS.Timeout | null>(null);

	const startTooltipTimer = () => {
		setTooltipTimer(
			setTimeout(() => {
				setShowingTooltip(true);
			}, 1000)
		);
	};

	const clearTooltipTimer = () => {
		setShowingTooltip(false);
		if (tooltipTimer) {
			clearTimeout(tooltipTimer);
			setTooltipTimer(null);
		}
	};

	const handleAddTag = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		setAddingTag(photoId); // this will open the SearchableSelect
	};

	const handleRemoveTag = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation();

		const updatedPhotos = photos.map((photo) => {
			if (photo.id === photoId) {
				return { ...photo, tag: null };
			} else {
				return photo;
			}
		});

		setAddingTag(null);
		setPhotos(updatedPhotos);
	};

	const handleClearButtonClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation();
		if (searchValue) {
			setSearchValue("");
		} else {
			setAddingTag(null);
		}
	};

	if (tag) {
		return (
			<div
				className="z-20 text-[14px] text-white font-normal px-3 py-2 pr-6 leading-none self-end rounded flex gap-2 relative max-w-full"
				style={{ backgroundColor: tag.color }}
			>
				<span className="max-w-full truncate">{tag.text}</span>
				<button
					className="flex items-center absolute right-0 top-0 h-full px-2"
					onClick={handleRemoveTag}
				>
					<i className="fa-solid fa-x text-[10px]"></i>
				</button>
			</div>
		);
	} else {
		return (
			<div className="w-full flex justify-end text-sm z-20">
				<AnimatePresence>
					{addingTag === photoId && (
						<motion.div
							key={photoId}
							initial={{ opacity: 0, x: 25 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 25 }}
							transition={{ duration: 0.1 }}
							className="w-full"
						>
							<SearchableSelect
								photoId={photoId}
								setAddingTag={setAddingTag}
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								setSelectedItems={setSelectedItems}
							/>
						</motion.div>
					)}
				</AnimatePresence>
				<AnimatePresence>
					{isHovered && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.1 }}
							key={photoId}
						>
							<Popover
								isOpen={showingTooltip}
								positions={["right", "left", "top", "bottom"]}
								content={
									<div className="flex items-center ml-1">
										<div className="bg-black rotate-45 h-[10px] w-[10px] mr-[-5px]"></div>
										<span className="px-2 py-1 bg-black text-white z-40 rounded text-sm">
											Add tag
										</span>
									</div>
								}
							>
								<button
									onClick={
										addingTag === photoId
											? handleClearButtonClick
											: handleAddTag
									}
									className="bg-white/40 hover:bg-white/75  z-20  h-7 w-7 rounded-sm shadow shadow-black/25 hover:shadow-black/50 transition-all flex items-center justify-center aspect-square relative"
									onMouseEnter={startTooltipTimer}
									onMouseLeave={clearTooltipTimer}
								>
									{addingTag === photoId ? (
										searchValue ? (
											<i className="fa-regular fa-circle-xmark text-[12px]"></i>
										) : (
											<i className="fa-solid fa-angle-right text-[12px]"></i>
										)
									) : (
										<i className="fa-solid fa-tag w-3"></i>
									)}
								</button>
							</Popover>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	}
}
