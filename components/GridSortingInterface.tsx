import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import PhotoCard from "./PhotoCard";

import { useDraggable } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function GridSortingInterface({
  items,
  setItems,
  setFullSizeImage,
}: {
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  setFullSizeImage: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [draggingItemID, setDraggingItemID] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

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

  function handleRearrange() {
    // randomize the order of the items
    const newItems = [...items];
    for (let i = newItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
    }
    setItems(newItems);
  }

  const [parent] = useAutoAnimate({
    duration: 75,
    easing: "ease-in-out",
  });

  return (
    <div className="w-screen h-screen" onClick={() => setSelectedItems([])}>
      <div className="max-w-[800px] mx-auto overflow-visible">
        <div className="flex gap-4 mb-2 w-full justify-end">
          <button className="bg-blue-400 px-4 py-2" onClick={handleRearrange}>Rearrange</button>
          <button className="bg-blue-400 px-4 py-2" onClick={() => handleSort(items)}>Sort</button>
        </div>
        {/* grid of cards */}
        <ul className="grid grid-cols-4 gap-4 overflow-visible" ref={parent}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            {items.map((item, index) => (
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
                    handleDelete={(e: any) => handleDelete(e, item)}
                    handleFullscreen={(e: any) => handleFullscreen(e, item)}
                    handleItemClick={(e: any) => handleItemClick(e, item)}
                  />
                </Droppable>
              </Draggable>

              // s
            ))}
          </DndContext>

          {/* button that adds another item to the list */}
          <button
            className="w-full aspect-square bg-white/25 cursor-pointer"
            onClick={() => {
              setItems((items) => [...items, items[0]]);
            }}
          >
            <div className="select-none flex items-center justify-center h-full text-2xl font-bold text-gray-300">
              +
            </div>
          </button>
        </ul>
      </div>
    </div>
  );

  function handleSort(photos: any[]) {
    console.log("sorting photos");
    // sort the photos by type
    const order = [
      "exterior",
      "living_room",
      "kitchen",
      "dining_room",
      "bathroom",
      "bedroom",
      "other",
    ];

    const sortedPhotos = photos.sort((a, b) => {
      return order.indexOf(a.type as string) - order.indexOf(b.type as string);
    });

    setItems(sortedPhotos);
  }

  function handleDelete(e: any, item: any) {
    e.stopPropagation();
    setItems((items) => items.filter((p) => p.id !== item.id));
  }

  function handleFullscreen(e: any, item: any) {
    e.stopPropagation();
    setFullSizeImage(item);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    console.log("drag end");

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
    setDraggingItemID(null);
  }
  function handleDragStart(event: any) {
    setDraggingItemID(event.active.id);
  }

  function handleItemClick(event: any, item: any) {
    // if the user is holding down the shift+control keys, add the item to the list
    if (event.shiftKey && event.ctrlKey) {
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
        className={`cursor-pointer border-2 border-white overflow-hidden hover:scale-[1.01] ${
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
          <div className="absolute top-[-4px] left-[-4px] bg-red-500 flex justify-center items-center p-1 rounded-full w-6 h-6 text-sm">
            <span className="relative bottom-[1px] right-[0.5px]">
              {selectedItems.length}
            </span>
          </div>
        )}
    </li>
  );
}
