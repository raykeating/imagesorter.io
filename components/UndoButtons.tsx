import React, { useEffect } from "react";

type Props = {
  undoPhotos: () => void;
  redoPhotos: () => void;
};

export default function UndoButtons({
  undoPhotos,
  redoPhotos,
}: Props) {

  const [undoHighlight, setUndoHighlight] = React.useState<boolean>(false);
  const [redoHighlight, setRedoHighlight] = React.useState<boolean>(false);

  // call undo or redo when control+z or command+z is pressed
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				(e.key === "z" && (e.metaKey || e.ctrlKey)) ||
				(e.key === "Z" && e.metaKey)
			) {
				if (e.shiftKey) {
          redoPhotos();
          setRedoHighlight(true);
          setTimeout(() => {
            setRedoHighlight(false);
          }, 600);
				} else {
					undoPhotos();
          setUndoHighlight(true);
          setTimeout(() => {
            setUndoHighlight(false);
          }, 600);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

  return (
    <div className="flex">
      <div
        onClick={undoPhotos}
        className={`z-20 hover:opacity-100 cursor-pointer px-2 ${
          undoHighlight
            ? "opacity-100"
            : "opacity-60"
        }`}
      >
        <i className="text-white fa-solid fa-rotate-left"></i>
      </div>
      <div
        onClick={redoPhotos}
        className={`z-20 hover:opacity-100 cursor-pointer px-2 ${
          redoHighlight
            ? "opacity-100"
            : "opacity-60"
        }`}
      >
        <i className="text-white fa-solid fa-rotate-right"></i>
      </div>
    </div>
  );
}
