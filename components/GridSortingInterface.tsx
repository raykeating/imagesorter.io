import React, { useState, useRef } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	closestCorners,
} from "@dnd-kit/core";
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Photo from "@/types/Photo";

import PhotoCard from "./PhotoCard";

import { useDraggable } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Clipboard } from "@/types/Clipboard";

export default function GridSortingInterface({
	items,
	setItems,
	setFullSizeImage,
	selectedItems,
	setSelectedItems,
	handleFileUpload,
	clipboard,
}: {
	items: any[];
	setItems: React.Dispatch<React.SetStateAction<any[]>>;
	setFullSizeImage: React.Dispatch<React.SetStateAction<any>>;
	selectedItems: any[];
	setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
	handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	clipboard: Clipboard;
}) {
	const [draggingItemID, setDraggingItemID] = useState<string | null>(null);

	const [addingTagWithId, setAddingTagWithId] = useState<string | null>(null); // tag id

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleNewImageClick = () => {
		// Trigger the file input element
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

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

	// const [parent] = useAutoAnimate({
	// 	duration: 75,
	// 	easing: "ease-in-out",
	// });

	return (
		<div
			className="min-h-screen w-full mb-[150px]"
			onClick={() => setSelectedItems([])}
		>
			<div className="mx-auto overflow-visible">
				{/* grid of cards */}
				<ul className="grid grid-cols-4 gap-4 overflow-visible" >
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
						onDragStart={handleDragStart}
						modifiers={[restrictToWindowEdges, snapCenterToCursor]}
					>
						{items.map((item) => (
							<Draggable
								id={item.id}
								key={item.id}
								selectedItems={selectedItems}
								draggingItemID={draggingItemID}
								item={item}
							>
								<Droppable id={item.id} key={item.id}>
									<PhotoCard
										photo={item}
										addingTag={addingTagWithId}
										setAddingTag={setAddingTagWithId}
										handleDelete={(e: any) => handleDelete(e, item)}
										handleFullscreen={(e: any) => handleFullscreen(e, item)}
										handleItemClick={(e: any) => handleItemClick(e, item)}
										inClipboard={clipboard.lastAction === "cut" && clipboard.photos.some((p) => p.id === item.id)}
									/>
								</Droppable>
							</Draggable>

							// s
						))}
					</DndContext>

					{/* button to upload new photos */}
					<input
						type="file"
						style={{ display: "none" }}
						ref={fileInputRef}
						onChange={handleFileUpload}
						multiple
					/>
					<button
						className="w-full rounded aspect-square bg-white/25 cursor-pointer hover:bg-white/40 transition-colors"
						onClick={handleNewImageClick}
					>
						<div className="select-none flex items-center justify-center h-full text-2xl font-bold text-gray-300">
							+
						</div>
					</button>
				</ul>
				
			</div>
		</div>
	);

	function handleDelete(e: any, item: any) {
		e.stopPropagation();
		setItems((items) => items.filter((p) => p.id !== item.id));
	}

	function handleFullscreen(e: any, item: any) {
		e.stopPropagation();
		setFullSizeImage(item);
	}

	function handleDragStart(event: any) {
		setDraggingItemID(event.active.id);
	}

	function handleDragEnd(event: any) {
		setDraggingItemID(null);
		// const { over } = event;
		// // when the user drags over another photo, reorganize the list of photos
		// if (over && over.id !== draggingItemID) {
		// 	const newItems = [...items];
		// 	const moveToIndex = newItems.findIndex((p) => p.id === over.id);
		// 	const draggingItemIndex = newItems.findIndex(
		// 		(p) => p.id === draggingItemID
		// 	);
		// 	newItems.splice(moveToIndex, 0, newItems.splice(draggingItemIndex, 1)[0]);
		// 	setItems(newItems);
		// }
	}

	function handleItemClick(event: any, item: any) {
		// if the user is holding down the shift+control keys, add the item to the list
		if (event.ctrlKey) {
			setSelectedItems((items) => [...items, item]);
		} else if (event.shiftKey) {
			// if the user is holding down the shift key, add all the items between the last selected item and the current item to the list
			const lastSelectedItem = selectedItems[selectedItems.length - 1];
			const lastSelectedItemIndex = items.indexOf(lastSelectedItem);
			const currentItemIndex = items.indexOf(item);

			if (lastSelectedItemIndex > currentItemIndex) {
				setSelectedItems(
					items.slice(currentItemIndex, lastSelectedItemIndex + 1)
				);
			} else {
				setSelectedItems(
					items.slice(lastSelectedItemIndex, currentItemIndex + 1)
				);
			}
		} else if (selectedItems.length === 1 && selectedItems[0] === item) {
			// if the user clicks on the same item, deselect it
			setSelectedItems([]);
		} else {
			// otherwise, select the item
			setSelectedItems([item]);
		}

		event.stopPropagation();
	}
}

function Droppable({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) {
	const { setNodeRef } = useDroppable({
		id,
	});

	return (
		<div ref={setNodeRef} className="relative">
			{children}
		</div>
	);
}

function Draggable({
	id,
	children,
	selectedItems,
	draggingItemID, // this is the item that is currently being dragged
	item, // this is the item of the current draggable
}: {
	id: string;
	children: React.ReactNode;
	draggingItemID: string | null;
	selectedItems: any[];
	item: any;
}) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
	});
	const style = {
		transform: CSS.Translate.toString(transform),
		zIndex: draggingItemID === item.id ? 100 : 0,
	};

	return (
		<li
			ref={setNodeRef}
			style={{ touchAction: "none", ...style }}
			className={`relative 
      ${
				draggingItemID &&
				draggingItemID !== item.id &&
				selectedItems.includes(item) &&
				"opacity-50"
			}
      `}
			{...listeners}
			{...attributes}
		>
			<div
				className={`cursor-pointer border-2 border-white rounded ${
					!selectedItems.includes(item) && "border-opacity-0"
				} ${
					draggingItemID && draggingItemID === item.id && "border-opacity-100"
				}`}
			>
				{children}
			</div>
			{selectedItems.length > 1 &&
				draggingItemID &&
				draggingItemID === item.id && (
					<div className="absolute top-[-4px] left-[-4px] bg-red-500 text-white font-bold flex justify-center items-center p-1 rounded-full w-6 h-6 text-sm">
						<span className="relative bottom-[1px] right-[0.5px]">
							{selectedItems.length}
						</span>
					</div>
				)}
		</li>
	);
}
