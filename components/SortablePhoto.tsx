import React, { useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Photo from "@/types/Photo";
import Image from "next/image";
import PhotoCard from "./PhotoCard";

export const SortablePhoto = ({
	id,
	index,
	photo,
	selected, // whether or not this photo is selected
    selectedItemsLength,
    active, // whether or not this photo is being dragged
	addingTag,
	setAddingTag,
	handleItemClick,
	handleDelete,
	handleFullscreen,
}: {
	id: string;
	index: number;
	photo: Photo;
	selected: boolean;
    selectedItemsLength: number;
    active: boolean; 
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
}) => {
	const sortable = useSortable({ id });
	const { attributes, listeners, setNodeRef, transform, isOver } = sortable;

	const style = {
		transform: CSS.Transform.toString(transform),
		border: selected ? "2px solid #fff" : "none",
		// transition,
	};

	return (
		<div className="relative">
			<PhotoCard
				photo={photo}
				addingTag={addingTag}
				setAddingTag={setAddingTag}
				handleItemClick={handleItemClick}
				handleDelete={handleDelete}
				handleFullscreen={handleFullscreen}
				sortableRef={setNodeRef}
				sortableStyle={style}
				{...attributes}
				{...listeners}
			/>
			{
				isOver && selectedItemsLength > 1 && (
					<div className="absolute inset-0 bg-white bg-opacity-30 z-40 flex items-center justify-center">
						<div className="bg-red-600 text-white rounded-full p-2 absolute -top-1 -left-1 w-7 h-7 flex items-center justify-center">
							{selectedItemsLength}
						</div>
					</div>
				)
			}
		</div>
	);
};

// default props
SortablePhoto.defaultProps = {
	selected: false,
	active: false,
};
