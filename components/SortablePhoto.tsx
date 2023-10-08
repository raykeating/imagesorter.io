import React, { Profiler, useEffect } from "react";
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
	setSelectedItems,
	inClipboard,
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
	setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
	inClipboard: boolean;
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
				setSelectedItems={setSelectedItems}
				sortableRef={setNodeRef}
				sortableStyle={style}
				inClipboard={inClipboard}
				{...attributes}
				{...listeners}
			/>
			{isOver && selectedItemsLength > 1 && (
				<div className="absolute inset-0 bg-black bg-opacity-30 z-40 flex gap-2 items-center justify-center text-xl text-white font-bold">
					<p>{selectedItemsLength}</p>
					<i className="fa-solid fa-circle-down"></i>
				</div>
			)}
		</div>
	);
};

// default props
SortablePhoto.defaultProps = {
	selected: false,
	active: false,
};
