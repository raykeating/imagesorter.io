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
	const sensors = useSensors(useSensor(MouseSensor, {
        activationConstraint: {
            distance: 5,
        }
    }), useSensor(TouchSensor, {
        activationConstraint: {
            distance: 5,
        }
    }));

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            modifiers={[restrictToWindowEdges]}
		>
			<SortableContext items={items} strategy={rectSortingStrategy}>
				<div className="grid grid-cols-4">
					{items.map((item) => (
						<SortablePhoto
                            id={item.id}
                            photo={item}
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
				{(activeId && items.some(item => item.id === activeId)) ? (
					<SortablePhoto
                        id={activeId}
                        photo={items.find((item) => item.id === activeId) as Photo}
                        addingTag={addingTagWithId}
                        setAddingTag={setAddingTagWithId}
                        handleDelete={(e: any) => handleDelete(e, items.find((item) => item.id === activeId) as Photo)}
                        handleFullscreen={(e: any) => handleFullscreen(e, items.find((item) => item.id === activeId) as Photo)}
                        handleItemClick={(e: any) => handleItemClick(e, items.find((item) => item.id === activeId) as Photo)}
                    />
				) : null}
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
