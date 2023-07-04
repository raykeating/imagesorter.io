import React from "react";
import { AppContext } from "@/util/appContext";
import { useContext } from "react";

export default function SettingsDrawer() {
	const { zoomLevel, setZoomLevel } = useContext(AppContext);

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

	return (
		<div className="w-full flex justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-sm">Zoom</span>
        <div className="flex gap-2">
        <button onClick={decreaseZoom} className="hover:scale-105 transition-transform px-3 py-2 border-zinc-300 rounded border"><i className="fa-solid fa-magnifying-glass-minus"></i></button>
				<button onClick={increaseZoom} className="hover:scale-105 transition-transform px-3 py-2 border-zinc-300 rounded border"><i className="fa-solid fa-magnifying-glass-plus"></i></button>
        </div>
			</div>
		</div>
	);
}
