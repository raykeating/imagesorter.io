import React, { useEffect } from "react";

type Props = {
    zoomLevel: number;
    setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
};

export default function ZoomButtons({ zoomLevel, setZoomLevel }: Props) {

    // min and max represent number of columns
  const maxZoomLevel = 3;
  const minZoomLevel = 8;

    const increaseZoom = () => {
        if (zoomLevel > maxZoomLevel) {
        setZoomLevel(zoomLevel - 1);
        }
    }

    const decreaseZoom = () => {
        if (zoomLevel < minZoomLevel) {
        setZoomLevel(zoomLevel + 1);
        }
    }

	const btnStyle =
		"bg-white/10 w-10 text-white/60 h-10 hover:bg-black hover:text-white rounded-lg p-2 flex items-center justify-center text-zinc-400 transition-colors";

	return (
		<div className="flex gap-1 absolute top-4 right-4 z-[999]">
			<button onClick={decreaseZoom} className={btnStyle}>
				<i className=" fa-solid fa-magnifying-glass-minus"></i>
			</button>
			<button onClick={increaseZoom} className={btnStyle}>
				<i className=" fa-solid fa-magnifying-glass-plus"></i>
			</button>
		</div>
	);
}
