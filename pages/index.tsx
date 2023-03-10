import React, { useState, useEffect } from "react";
import { Photo } from "../types";
import FileInput from "@/components/FileInput";
import { v4 as uuid } from "uuid";
import GridSortingInterface from "@/components/GridSortingInterface";
import FullSizeImageOverlay from "@/components/FullSizeImageOverlay";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import useUndoableState from "@/util/hooks/useUndoableState";

export default function Home() {

  const mockPhotos: Photo[] = [];

  for (let i = 0; i < 10; i++) {
    mockPhotos.push(
      new Photo({
        type: undefined,
        name: "test",
        file: undefined,
        fileUrl: `https://picsum.photos/seed/${Math.random()}/800/800`,
        id: uuid(),
      })
    );
  }


  const [photos, setPhotos, undoPhotos, redoPhotos] = useUndoableState(mockPhotos);
  const [fullSizeImage, setFullSizeImage] = useState<Photo | null>(null);

  const [keysPressed, setKeysPressed] = useState<{
    control: boolean;
    lowerZ: boolean;
    upperZ: boolean;
    shift: boolean;
  }>({ control: false, lowerZ: false, upperZ: false, shift: false });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const photos: Photo[] = [];
      for (let i = 0; i < files.length; i++) {
        photos.push(
          new Photo({
            type: undefined,
            name: files[i].name,
            file: files[i],
            fileUrl: URL.createObjectURL(files[i]),
            id: uuid(),
          })
        );
      }
      setPhotos(photos);
      const uploadPhotos = async () => {
        const formData = new FormData();
        photos.forEach((photo) => {
          formData.append("image", photo.file as Blob);
        });
        const response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          body: formData,
        });
        const json = await response.json();
        const predictions = json.predictions;
        const photosWithTypes: Photo[] = [];
        photos.forEach((photo, index) => {
          photosWithTypes.push(
            new Photo({
              ...photo,
              type: predictions[index].prediction,
            })
          );
        });
        setPhotos(photosWithTypes);
      };

      if (photos.length > 0) {
        uploadPhotos();
      }
    } else {
      return;
    }
  };

  // listen for key presses on control, shift, z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setKeysPressed({ ...keysPressed, control: true });
      } else if (e.key === "Shift") {
        setKeysPressed({ ...keysPressed, shift: true });
      } else if (e.key === "z") {
        setKeysPressed({ ...keysPressed, lowerZ: true });
      } else if (e.key === "Z") {
        setKeysPressed({ ...keysPressed, upperZ: true });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setKeysPressed({ ...keysPressed, control: false });
      } else if (e.key === "Shift") {
        setKeysPressed({ ...keysPressed, shift: false });
      } else if (e.key === "z") {
        setKeysPressed({ ...keysPressed, lowerZ: false });
      } else if (e.key === "Z") {
        setKeysPressed({ ...keysPressed, upperZ: false });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keysPressed]);



  // undo/redo with ctrl+z, ctrl+shift+z
  useEffect(() => {
    if (keysPressed.control && keysPressed.lowerZ) {
      undoPhotos();
    } else if (keysPressed.control && keysPressed.shift && keysPressed.upperZ) {
      redoPhotos();
    }
  }, [keysPressed]);


  return (
    <>
    <div className="fixed bottom-4 left-4 flex gap-2">

      <div onClick={undoPhotos} className={`p-4 bg-black z-50 hover:opacity-100 cursor-pointer ${(keysPressed.control && keysPressed.lowerZ) ? "opacity-100" : "opacity-60"}`}>
        <i className="fa-solid fa-rotate-left"></i>
      </div>
      <div onClick={redoPhotos} className={`p-4 bg-black z-50 hover:opacity-100 cursor-pointer ${(keysPressed.control && keysPressed.shift && keysPressed.upperZ) ? "opacity-100" : "opacity-60"}`}>
        <i className="fa-solid fa-rotate-right"></i>
      </div>
    </div>

      <div className="mx-auto max-w-[800px] w-full pt-8 mb-2 flex flex-col items-end">
        <FileInput handleFileUpload={handleFileUpload} />
      </div>
      <GridSortingInterface
        items={photos}
        setItems={setPhotos}
        setFullSizeImage={(photo: Photo) => setFullSizeImage(photo)}
      />

      <FullSizeImageOverlay
        photo={fullSizeImage}
        setFullSizeImage={setFullSizeImage}
      />
    </>
  );

  
}
