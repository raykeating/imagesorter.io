import React from "react";
import { Photo } from "../types";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function FullSizeImageOverlay({
  photo,
  setFullSizeImage,
}: {
  photo: Photo | null;
  setFullSizeImage: React.Dispatch<React.SetStateAction<Photo | null>>;
}) {
  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          key={photo.id}
          className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setFullSizeImage(null)}
          transition={{ duration: 0.1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-[70vw] h-[100vh] flex items-center ">
            <div className="w-full h-[60vh] relative bg-[#040404] border-2 border-white">
              <Image
                src={URL.createObjectURL(photo.file)}
                alt={photo.name}
                style={{ objectFit: "contain" }}
                fill
              />
              <div className="absolute top-0 right-0 bg-white flex items-center justify-center p-3 h-8 w-8 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                <i className="fa-solid text-black fa-x"></i>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
