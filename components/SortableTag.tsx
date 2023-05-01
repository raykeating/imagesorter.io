import React, { useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tag as TagType } from "types/Photo";
import { AppContext } from "@/pages";

export function SortableTag({ id, tag }: { id: string; tag: TagType }) {
	const { setTags, setPhotos, photos, setConfirmationDialog } =
		useContext(AppContext);

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
						setTags((tags) => tags.filter((t) => t.id !== tag.id));
						// Remove tag from photos
						setPhotos((photos) =>
							photos.map((photo) => {
								if (photo.tag?.id === tag.id) {
									return { ...photo, tag: null };
								} else {
									return photo;
								}
							})
						);
					}
				};
			});
			
		} else {
			setTags((tags) => tags.filter((t) => t.id !== tag.id));
		}
	};

	React.useEffect(() => {
		console.log(photos);
	}, [photos]);

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<li className="rounded p-1 pl-3" style={{ backgroundColor: tag.color }}>
				<span>{tag.text}</span>
				<button
					className=" py-1 px-2 opacity-90 hover:opacity-100"
					onClick={handleRemoveTag}
				>
					&times;
				</button>
			</li>
		</div>
	);
}
