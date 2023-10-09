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
		"bg-white/10 w-10 text-white/60 h-10 hover:bg-black hover:text-white rounded-lg p-2 flex items-center justify-center text-zinc-400";

  const [undoHighlight, setUndoHighlight] = React.useState<boolean>(false);
  const [redoHighlight, setRedoHighlight] = React.useState<boolean>(false);

  // call undo or redo when control+z or command+z is pressed
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				(e.key === "z" && (e.metaKey || e.ctrlKey)) ||
				(e.key === "Z" && (e.metaKey || e.ctrlKey))
			) {
				if (e.shiftKey) {
          redoPhotos();
          setRedoHighlight(true);
          setTimeout(() => {
            setRedoHighlight(false);
          }, 100);
				} else {
					undoPhotos();
          setUndoHighlight(true);
          setTimeout(() => {
            setUndoHighlight(false);
          }, 100);
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
        className={`${btnStyle} ${
          undoHighlight
            ? "opacity-100"
            : "opacity-60"
        }`}
      >
        <i className="text-white fa-solid fa-rotate-left"></i>
      </button>
      <button
        onClick={redoPhotos}
        className={`${btnStyle} ${
          redoHighlight
            ? "opacity-100"
            : "opacity-60"
        }`}
      >
        <i className="text-white fa-solid fa-rotate-right"></i>
      </button>
    </div>
  );
}
