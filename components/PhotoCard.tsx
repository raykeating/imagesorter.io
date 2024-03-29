import React, { useEffect, useState } from "react";
import Image from "next/image";
import Photo from "../types/Photo";
import { motion, AnimatePresence } from "framer-motion";
import PhotoTagger from "./PhotoTagger";
import { forwardRef } from "react";

export default React.memo(function PhotoCard({
	sortableRef,
	sortableStyle,
	addingTag,
	setAddingTag,
	handleItemClick,
	handleDelete,
	handleFullscreen,
	setSelectedItems,
	photo,
	inClipboard,
	...props
}: {
	sortableRef: any;
	sortableStyle: any;
	addingTag: string | null;
	setAddingTag: React.Dispatch<React.SetStateAction<string | null>>;
	handleItemClick: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		photo: Photo
	) => void;
	handleDelete: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		photo: Photo
	) => void;
	handleFullscreen: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		photo: Photo
	) => void;
	setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
	photo: Photo;
	inClipboard: boolean;
}) {
	const [isHovered, setIsHovered] = useState<boolean>(false);

	const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		handleItemClick(e, photo);
		setAddingTag(null);
	};

	return (
		<div
			style={{ touchAction: "none", ...sortableStyle }}
			className={`rounded overflow-hidden relative select-none  p-1 text-3xl text-gray-900 font-bold aspect-square shadow w-full`}
			onClick={handleCardClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			ref={sortableRef}
			{...props}
		>
			<Image
				src={photo.localFileUrl || ""}
				alt={photo.filename || ""}
				style={{ objectFit: "cover" }}
				className={`${inClipboard ? "opacity-50" : ""}`}
				fill
			/>
			<div className="z-20 flex flex-col justify-between w-full h-full">
				<PhotoTagger
					photoId={photo.id}
					tag={photo.tag}
					addingTag={addingTag}
					setAddingTag={setAddingTag}
					isHovered={isHovered}
					setSelectedItems={setSelectedItems}
				/>

				<AnimatePresence>
					{isHovered && (
						<motion.div
							transition={{ duration: 0.1 }}
							animate={{ opacity: 1 }}
							initial={{ opacity: 0 }}
							exit={{ opacity: 0 }}
							className="flex gap-1 z-20"
						>
							<div
								onClick={(e) => handleFullscreen(e, photo)}
								className="shadow shadow-black/25 rounded-sm h-6 w-6 bg-white/40  hover:bg-white/75 transition-all flex items-center justify-center"
							>
								<i className="fa-solid fa-expand text-[16px] text-black/80 hover:text-black"></i>
							</div>
							<div
								onClick={(e) => handleDelete(e, photo)}
								className="shadow shadow-black/25 hover:shadow-black/40 rounded-sm h-6 w-6 bg-white/40 hover:bg-white/75  transition-all flex items-center justify-center"
							>
								<i className="fa-solid fa-trash text-[12px] text-black/80 hover:text-black"></i>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
});
