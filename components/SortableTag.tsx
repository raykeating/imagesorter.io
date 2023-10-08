import React, { useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Photo, { Tag as TagType } from "types/Photo";
import { AppContext } from "@/util/appContext";

export function SortableTag({ id, tag }: { id: string; tag: TagType }) {
	const {
		setTags,
		setPhotos,
		photos,
		setConfirmationDialog,
		setAddingTagWithId,
	} = useContext(AppContext);

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const handleRemoveTag = () => {
		// alert user if tag is in use with count of photos using it
		const photosWithTag = photos.filter((photo) => photo.tag?.id === tag.id);
		if (photosWithTag.length > 0) {
			setConfirmationDialog((cd) => {
				return {
					...cd,
					isOpen: true,
					title: "Remove Tag",
					text: `This tag is in use by ${photosWithTag.length} ${
						photosWithTag.length > 1 ? "photos" : "photo"
					}. Are you sure you want to remove it?`,
					onConfirm: () => {
						// Remove tag from global tags
						setTags((tags: TagType[]) => tags.filter((t) => t.id !== tag.id));
						// Remove tag from photos
						setPhotos(
							photos.map((photo: Photo) => {
								if (photo.tag?.id === tag.id) {
									return { ...photo, tag: null };
								} else {
									return photo;
								}
							})
						);
						setAddingTagWithId(null);
					},
				};
			});
		} else {
			setTags((tags) => tags.filter((t) => t.id !== tag.id));
		}
	};

	return (
		<li
			ref={setNodeRef}
			style={{
				...style,
			}}
			{...attributes}
			{...listeners}
			className="rounded p-1 pl-3 border border-zinc-600 hover:border-gray-300 hover:border-l-gray-300 flex justify-between items-center bg-zinc-900"
		>
			<div
				className="h-3 w-3 rounded-full mr-2"
				style={{ backgroundColor: tag.color }}
			></div>
			<span>{tag.text}</span>
			<button
				className=" py-1 px-2 opacity-90 hover:opacity-100"
				onClick={handleRemoveTag}
			>
				&times;
			</button>
		</li>
	);
}
