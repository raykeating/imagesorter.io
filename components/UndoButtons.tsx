import React, { useEffect } from "react";

type Props = {
  undoPhotos: () => void;
  redoPhotos: () => void;
};

export default function UndoButtons({
  undoPhotos,
  redoPhotos,
}: Props) {

  const btnStyle =
		"bg-white/60 lg:bg-white/10 lg:text-zinc-400 text-black backdrop-blur w-10 h-10 hover:bg-black hover:text-white rounded-lg p-2 flex items-center justify-center";

  // call undo or redo when control+z or command+z is pressed
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				(e.key === "z" && (e.metaKey || e.ctrlKey)) ||
				(e.key === "Z" && (e.metaKey || e.ctrlKey))
			) {
				if (e.shiftKey) {
          redoPhotos();
				} else {
					undoPhotos();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [redoPhotos, undoPhotos]);

  return (
    <div className="flex gap-1">
      <button
        onClick={undoPhotos}
        className={`${btnStyle}`}
      >
        <i className="fa-solid fa-rotate-left"></i>
      </button>
      <button
        onClick={redoPhotos}
        className={`${btnStyle}`}
      >
        <i className="fa-solid fa-rotate-right"></i>
      </button>
    </div>
  );
}
