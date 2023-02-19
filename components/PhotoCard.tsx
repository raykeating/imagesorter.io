import React from "react";
import Image from "next/image";
import { Photo } from "../types";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotoCard({
  handleItemClick,
  handleDelete,
  handleFullscreen,
  photo,
}: {
  handleItemClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    photo: Photo
  ) => void;
  handleDelete: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    photo: Photo
  ) => void;
  handleFullscreen: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    photo: Photo
  ) => void;
  photo: Photo;
}) {
  const [isHovered, setIsHovered] = React.useState<boolean>(false);

  return (
    <div
      style={{ touchAction: "none" }}
      className={`relative select-none flex items-center justify-center text-3xl text-gray-900 font-bold w-full aspect-square
                    `}
      onClick={(e) => handleItemClick(e, photo)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute top-0 left-0 bg-opacity-50 z-50 text-white text-xs p-1 `}
        style={{ ...Photo.getColorFromType(photo.type) }}
      >
        {Photo.getTypeAsString(photo.type)}
      </div>
      <Image
        src={URL.createObjectURL(photo.file as Blob)}
        alt={photo.name}
        style={{ objectFit: "cover" }}
        className=""
        fill
      />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            transition={{ duration: 0.1 }}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          >
            <div
              onClick={(e) => handleFullscreen(e, photo)}
              className="absolute bottom-0 right-0 h-6 w-6 bg-white/80 hover:bg-white transition-all flex items-center justify-center"
            >
              <i className="fa-solid fa-expand text-[16px] text-black/80 hover:text-black"></i>
            </div>
            <div
              onClick={(e) => handleDelete(e, photo)}
              className="absolute bottom-0 right-6 h-6 w-6 bg-white/60 hover:bg-white transition-all flex items-center justify-center"
            >
              <i className="fa-solid fa-trash text-[12px] text-black/80 hover:text-black"></i>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
