import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "@/util/appContext";
import Photo, { Tag } from "@/types/Photo";
import { v4 as uuid } from "uuid";
import { tagColors } from "@/types/Photo";
import { SyntheticEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SortableTag } from "./SortableTag";
import {
	SortableContext,
	useSortable,
	horizontalListSortingStrategy,
	rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useDraggable } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CSS } from "@dnd-kit/utilities";
import getNextTagColor from "@/util/getNextTagColor";

export default function TagsDrawer({
	handlePredict,
	selectedPhotos,
}: {
	handlePredict: () => void;
	selectedPhotos: Photo[];
}) {
	const { tags, setTags, photos, setPhotos, setConfirmationDialog } = useContext(AppContext);
	const [tagInput, setTagInput] = useState<string>("");
	const [draggingTagID, setDraggingTagID] = useState<string | null>(null);
	const [isLoadingPredictions, setIsLoadingPredictions] =
		useState<boolean>(true);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	function handleTagInput(e: React.ChangeEvent<HTMLInputElement>): void {
		setTagInput(e.target.value);
	}

	function handleAddTag(e: SyntheticEvent): void {
		e.preventDefault();
		if (tagInput === "") return;

		const newTag = {
			id: uuid(),
			text: tagInput,
			color: getNextTagColor(tags),
			confidence: null,
		};
		setTags([...tags, newTag]);
		setTagInput("");
		// getPredictions();
	}

	function handleSortImagesByTag(): void {
		// sort images to match the order of the tags
		const sortedPhotos = [...photos].sort((a, b) => {
			const aTag = tags.find((tag) => tag.id === a.tag?.id);
			const bTag = tags.find((tag) => tag.id === b.tag?.id);
			if (!aTag || !bTag) return 0;
			return tags.indexOf(aTag) - tags.indexOf(bTag);
		});
		setPhotos(sortedPhotos);
	}

	return (
		<div className="flex flex-col gap-2 items-end w-full relative">
			<div className="flex justify-end gap-2 w-full">
				<button
					className="relative px-3 py-2 border-zinc-600 rounded border hover:border-zinc-300 transition-all active:border-zinc-300"
					onClick={() => handlePredict()}
				>
					Predict {!!selectedPhotos.length && `Selected (${selectedPhotos.length})`}
					<i className="fa-solid fa-bolt ml-1"></i>
					{/* {isLoadingPredictions ? (
							<>
								Predicting - 1 of {photos.length}
								<i className="ml-2 fa-solid fa-circle-notch animate-spin"></i>
							</>
						) : (
							<>
								Predict from tags <i className="fa-solid fa-bolt"></i>
							</>
						)} */}
						<span className="absolute -top-2 -right-2 text-xs bg-purple-900/40 backdrop-blur-sm px-1 py-[1px] rounded-sm text-purple-100">BETA</span>
				</button>
				<button
					className="relative px-3 py-2 border-zinc-600 rounded border hover:border-zinc-300 transition-all active:border-zinc-300"
					onClick={handleSortImagesByTag}
				>
					Sort by tag order{" "}
					<i className="fa-solid fa-sort text-zinc-300 text-sm ml-1"></i>
				</button>

				<form onSubmit={handleAddTag} className="relative flex items-center">
					<input
						type="text"
						className="bg-black px-3 py-2 rounded border focus:border-zinc-300  border-zinc-600 hover:border-zinc-400 text-white transition-colors placeholder:text-zinc-400 w-[300px]"
						style={{ outline: "none" }}
						placeholder="Add tag"
						value={tagInput}
						onChange={handleTagInput}
					/>
					<button className="absolute right-0 p-2 pr-3 pl-3 h-full flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors">
						<i className="fa-solid fa-plus"></i>
					</button>
				</form>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				onDragStart={(event) => {
					setDraggingTagID(event.active.id as string);
				}}
			>
				<SortableContext
					items={tags.map((t) => t.id)}
					strategy={rectSortingStrategy}
				>
					<ul className="flex gap-2 flex-wrap justify-end w-[95%]">
						<AnimatePresence>
							{tags.map((tag) => (
								<motion.div
									key={tag.id}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 10 }}
									transition={{ duration: 0.1 }}
								>
									<SortableTag key={tag.id} id={tag.id} tag={tag} />
								</motion.div>
							))}
						</AnimatePresence>
					</ul>
				</SortableContext>
			</DndContext>
		</div>
	);

	function handleDragEnd(event: any) {
		const { active, over } = event;
		if (!active || !over) return;

		if (active.id !== over.id) {
			const oldIndex = tags.findIndex((t) => t.id === active.id);
			const newIndex = tags.findIndex((t) => t.id === over.id);
			const newTagOrder = arrayMove(tags, oldIndex, newIndex);
			setTags(newTagOrder);
		}
		setDraggingTagID(null);
	}
}
