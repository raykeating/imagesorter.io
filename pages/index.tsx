import Head from "next/head";
import Image from "next/image";
import React, { FC, useState } from "react";
import PhotoCard from "../components/PhotoCard";
import { Photo } from "../types";
import FileInput from "@/components/FileInput";
import { v4 as uuid } from "uuid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "@/components/SortableItem";

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotoID, setSelectedPhotoID] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const photos: Photo[] = [];
      for (let i = 0; i < files.length; i++) {
        photos.push({
          type: undefined,
          name: files[i].name,
          file: files[i],
          id: uuid(),
        });
      }
      setPhotos(photos);
    }
  };

  return (
    <>
      <div className="max-w-[800px] mx-auto pt-8">
        <h1 className="text-3xl font-bold mb-8">PhotoSorter</h1>
        <FileInput handleFileUpload={handleFileUpload} />
        {/* grid of cards */}
        <ul className="grid grid-cols-3 gap-4 my-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext items={photos.map(p => p.id)}>
              {photos.map((photo) => (
                <SortableItem key={photo.id} id={photo.id}>
                  <PhotoCard
                    photo={photo}
                    isSelected={photo.id === selectedPhotoID}
                  />
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </ul>
      </div>
    </>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex(p => p.id === active.id);
        const newIndex = items.findIndex(p => p.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setSelectedPhotoID(null);
  }
  function handleDragStart(event: any) {
    const { active } = event;
    setSelectedPhotoID(active.id);
  }
}
