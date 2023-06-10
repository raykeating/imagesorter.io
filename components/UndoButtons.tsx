import { PressableKeys } from "@/types/PressableKeys";
import React from "react";

type Props = {
  undoPhotos: () => void;
  redoPhotos: () => void;
  keysPressed: PressableKeys;
};

export default function UndoButtons({
  undoPhotos,
  redoPhotos,
  keysPressed,
}: Props) {

  const btnStyle =
		"bg-white/10 w-10 backdrop-blur h-10 hover:bg-black hover:text-white rounded-lg p-2 flex items-center justify-center text-zinc-400";
	const activeBtnStyle =
		"bg-black w-10 h-10 rounded-lg p-2 flex items-center justify-center text-white text-shadow";

  return (
    <div className="flex gap-1">
      <div
        onClick={undoPhotos}
        className={`${btnStyle} ${
          keysPressed.Control && keysPressed.z
            ? "opacity-100"
            : "opacity-60"
        }`}
      >
        <i className="text-white fa-solid fa-rotate-left"></i>
      </div>
      <div
        onClick={redoPhotos}
        className={`${btnStyle} ${
          keysPressed.Control && keysPressed.Shift && keysPressed.Z
            ? "opacity-100"
            : "opacity-60"
        }`}
      >
        <i className="text-white fa-solid fa-rotate-right"></i>
      </div>
    </div>
  );
}
