import React from "react";

type Props = {
  undoPhotos: () => void;
  redoPhotos: () => void;
  keysPressed: {
    control: boolean;
    shift: boolean;
    lowerZ: boolean;
    upperZ: boolean;
  };
};

export default function UndoButtons({
  undoPhotos,
  redoPhotos,
  keysPressed,
}: Props) {
  return (
    <div className="flex">
      <div
        onClick={undoPhotos}
        className={`z-20 hover:opacity-100 cursor-pointer px-2 ${
          keysPressed.control && keysPressed.lowerZ
            ? "opacity-100"
            : "opacity-60"
        }`}
      >
        <i className="text-white fa-solid fa-rotate-left"></i>
      </div>
      <div
        onClick={redoPhotos}
        className={`z-20 hover:opacity-100 cursor-pointer px-2 ${
          keysPressed.control && keysPressed.shift && keysPressed.upperZ
            ? "opacity-100"
            : "opacity-60"
        }`}
      >
        <i className="text-white fa-solid fa-rotate-right"></i>
      </div>
    </div>
  );
}
