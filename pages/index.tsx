import React, { useState, useEffect } from "react";
import { Photo } from "../types";
import FileInput from "@/components/FileInput";
import { v4 as uuid } from "uuid";
import GridSortingInterface from "@/components/GridSortingInterface";
import FullSizeImageOverlay from "@/components/FullSizeImageOverlay";

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [fullSizeImage, setFullSizeImage] = useState<Photo | null>(null);

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
            id: uuid(),
          })
        );
      }
      setPhotos(photos);
    }
  };

  // this useEffect sends the photos in the state to localhost:5000/api/photos and then sets the type of the photo to the response from the server
  useEffect(() => {
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
  }, [photos.length]);

  return (
    <>
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
