import React, { useState } from "react";
import { FC } from "react";
import Image from "next/image";
import { Photo } from "../types";

interface PhotoCardProps {
  photo: Photo;
  isSelected: boolean;
}

const PhotoCard = ({ photo, isSelected }: PhotoCardProps) => {

  return (
    <li
      className={`select-none flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800 ${
        isSelected && "ring-2 ring-blue-500"
      }}`}
    >
      <div className="relative w-32 h-32 mb-4">
        <Image
          src={URL.createObjectURL(photo.file)}
          alt={photo.name}
          className="rounded-lg"
          style={{ objectFit: "cover" }}
          fill
        />
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {photo.name}
      </p>
    </li>
  );
};

export default PhotoCard;
