import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Photo from "@/types/Photo";

import PhotoCard from "./PhotoCard";

export const SortablePhoto = ({
	id,
	photo,
	addingTag,
	setAddingTag,
	handleItemClick,
	handleDelete,
	handleFullscreen,
}: {
	id: string;
	photo: Photo;
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
	const { attributes, listeners, setNodeRef, transform, transition } = sortable;

	const style = {
		transform: CSS.Transform.toString(transform),
		// transition,
	};

	return (
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
	);
};
