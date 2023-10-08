import React, { useState, useEffect, useContext } from "react";
import FileInput from "./FileInput";
import ActionBarTagSelector from "./ActionBarTagSelector";
import { AppContext } from "@/util/appContext";
import Photo from "@/types/Photo";

export default function TopActionBar({
	handleFileUpload,
	uploadedPhotoCount,
	selectedItems,
	actions,
	isTagSelectorOpen,
	setIsTagSelectorOpen,
}: {
	handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	uploadedPhotoCount: number;
	selectedItems: any[];
	actions: any[];
	isTagSelectorOpen: boolean;
	setIsTagSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { setPhotos } = useContext(AppContext);

	const [isFixed, setIsFixed] = useState<boolean>(false);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleScroll = () => {
		if (window.scrollY > 32) {
			setIsFixed(true);
		} else {
			setIsFixed(false);
		}
	};

	// any time selectedItems changes, set isTagSelectorOpen to false
	useEffect(() => {
		setIsTagSelectorOpen(false);
	}, [selectedItems]);

	const handleTagSelectedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setIsTagSelectorOpen(!isTagSelectorOpen);
	};

	const handleRemoveTagsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setPhotos((prevPhotos: Photo[]) => {
			const updatedPhotos = prevPhotos.map((photo) => {
				if (selectedItems.includes(photo)) {
					return { ...photo, tag: null };
				} else {
					return photo;
				}
			});
			return updatedPhotos;
		});
	};

	return (
		<div
			className={`sticky w-full top-1 flex justify-between items-center bg-zinc-800 px-4 py-2 rounded z-40 border-t-4 border-zinc-400 shadow-md transition-transform ${
				isFixed ? "scale-[1.03]" : "scale-100"
			}`}
		>
			{uploadedPhotoCount > 0 && (
				<div className="flex gap-4 items-center">
					<span className="text-zinc-400 py-1 px-2 bg-zinc-700 rounded cursor-default select-none">
						{selectedItems.length} Selected
					</span>

					{actions.map((action) => {
						return (
							<button
								className="text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer"
								onClick={action.action}
								key={action.text}
							>
								{action.text}
							</button>
						);
					})}
					{selectedItems.length > 1 && (
						<>
							<span className="text-zinc-600 select-none">|</span>
							<button
								className="text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer"
								onClick={handleTagSelectedClick}
							>
								{!isTagSelectorOpen
									? `Tag ${selectedItems.length} ${
											selectedItems.length > 1 ? "items" : "item"
									  }`
									: "Cancel"}
							</button>
							{/* only show remove tag button if a select photo has a tag (not null) */}
							{selectedItems.some((item) => item.tag) && (
								<button
									className="text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer"
									onClick={handleRemoveTagsClick}
								>
									Remove tags
								</button>
							)}
							{isTagSelectorOpen && (
								<ActionBarTagSelector
									selectedPhotos={selectedItems}
									setAddingTag={setIsTagSelectorOpen}
								/>
							)}
						</>
					)}
				</div>
			)}

			<div>
				<FileInput handleFileUpload={handleFileUpload} />
			</div>
		</div>
	);
}
