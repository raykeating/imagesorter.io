import React, { useState, useRef } from "react";
import Photo from "@/types/Photo";

import {
	DndContext,
	closestCenter,
	MouseSensor,
	TouchSensor,
	DragOverlay,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	rectSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import { SortablePhoto } from "./SortablePhoto";
import PhotoCard from "./PhotoCard";
import Image from "next/image";

export default function NewGridSortingInterface({
	items,
	setItems,
	setFullSizeImage,
	selectedItems,
	setSelectedItems,
	handleFileUpload,
	addingTagWithId,
	setAddingTagWithId,
	handleDelete,
	handleFullscreen,
	handleItemClick,
}: {
	items: Photo[];
	setItems: React.Dispatch<React.SetStateAction<any[]>>;
	setFullSizeImage: React.Dispatch<React.SetStateAction<any>>;
	selectedItems: any[];
	setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
	handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	addingTagWithId: string | null;
	setAddingTagWithId: React.Dispatch<React.SetStateAction<string | null>>;
	handleDelete: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		photo: Photo
	) => void;
	handleFullscreen: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		photo: Photo
	) => void;
	handleItemClick: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		photo: Photo
	) => void;
}) {
	const [activeId, setActiveId] = useState(null);
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			onDragCancel={handleDragCancel}
			modifiers={[restrictToWindowEdges]}
		>
			<SortableContext items={items} strategy={rectSortingStrategy}>
				<div className="grid grid-cols-4 gap-2">
					{items.map((item, index) => (
						<SortablePhoto
							id={item.id}
                            index={index}
							photo={item}
							selected={selectedItems.includes(item)}
                            selectedItemsLength={selectedItems.length}
							active={activeId === item.id}
							addingTag={addingTagWithId}
							setAddingTag={setAddingTagWithId}
							handleDelete={(e: any) => handleDelete(e, item)}
							handleFullscreen={(e: any) => handleFullscreen(e, item)}
							handleItemClick={(e: any) => handleItemClick(e, item)}
						/>
					))}
				</div>
			</SortableContext>

			<DragOverlay adjustScale={true}>
				<div className="relative scale-75">
					{ selectedItems.length > 1 ? <span className="z-50 bg-red-600 text-white rounded-full absolute -left-1 -top-1 w-7 h-7 flex items-center justify-center">
						{selectedItems.length}
					</span> : null}
					{activeId && items.some((item) => item.id === activeId) ? (
						<div className="relative h-[200px] w-[200px]">
							{selectedItems.concat(
								// add the active item to the end of the array
								// so that it is rendered on top
								items.find((item) => item.id === activeId)
							).map((item) => {
								return (
									<Image
										src={item.fileUrl}
										alt={item.filename}
										width={100}
										height={100}
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											height: "100%",
											objectFit: "cover",
											borderRadius: "4px",
                                            boxShadow: "0 0 0 2px #fff",
											transform: (selectedItems.length > 1) ? `rotate(${Math.random() * 8 - 4}deg)` : "none",
										}}
									/>
								);
							})}
						</div>
					) : null}
				</div>
			</DragOverlay>
		</DndContext>
	);

	function handleDragEnd(event: any) {
		const { active, over } = event;
		if (!over || !active) return;

		if (active.id !== over.id && selectedItems.length <= 1) {
			const newItems = arrayMove(
				items,
				items.findIndex((p) => p.id === active.id),
				items.findIndex((p) => p.id === over.id)
			);
			setItems(newItems);
		} else if (!selectedItems.includes(over.id) && selectedItems.length > 1) {
			const newItems = [...items];
			const moveToIndex = newItems.findIndex((p) => p.id === over.id);
			const selectedItemsCopy = [...selectedItems];
			selectedItemsCopy.forEach((item) => {
				const itemIndex = newItems.findIndex((p) => p.id === item.id);
				newItems.splice(itemIndex, 1);
			});

			newItems.splice(moveToIndex, 0, ...selectedItemsCopy);

			setItems(newItems);
		}
		setActiveId(null);
	}
	function handleDragStart(event: any) {
		setActiveId(event.active.id);
	}

	function handleDragCancel() {
		setActiveId(null);
	}
}
