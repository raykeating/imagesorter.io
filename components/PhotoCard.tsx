import React, { useState } from "react";
import Image from "next/image";
import Photo from "../types/Photo";
import { motion, AnimatePresence } from "framer-motion";
import PhotoTagger from "./PhotoTagger";

export default function PhotoCard({
	handleItemClick,
	handleDelete,
	handleFullscreen,
	photo,
}: {
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
	photo: Photo;
}) {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [addingTag, setAddingTag] = useState<boolean>(false);

	const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		handleItemClick(e, photo);
		setAddingTag(false);
	};

	return (
		<div
			style={{ touchAction: "none" }}
			className={`relative select-none  p-1 text-3xl text-gray-900 font-bold aspect-square shadow w-full`}
			onClick={handleCardClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Image
				src={photo.fileUrl}
				alt={photo.filename}
				style={{ objectFit: "cover" }}
				className=""
				fill
			/>
			<div className="z-20 flex flex-col justify-between w-full h-full">
				<PhotoTagger
					photoId={photo.id}
					tag={photo.tag}
					addingTag={addingTag}
					setAddingTag={setAddingTag}
				/>

				<AnimatePresence>
					{isHovered && (
						<motion.div
							transition={{ duration: 0.15 }}
							animate={{ opacity: 1 }}
							initial={{ opacity: 0 }}
							exit={{ opacity: 0 }}
							className="flex gap-1 z-20"
						>
							<div
								onClick={(e) => handleFullscreen(e, photo)}
								className="rounded-sm h-6 w-6 bg-white/80 hover:bg-white transition-all flex items-center justify-center"
							>
								<i className="fa-solid fa-expand text-[16px] text-black/80 hover:text-black"></i>
							</div>
							<div
								onClick={(e) => handleDelete(e, photo)}
								className="rounded-sm h-6 w-6 bg-white/60 hover:bg-white transition-all flex items-center justify-center"
							>
								<i className="fa-solid fa-trash text-[12px] text-black/80 hover:text-black"></i>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
