import React, { useState } from "react";
import { AppContext } from "@/util/appContext";
import { useContext } from "react";
import Photo from "@/types/Photo";

export default function DownloadDrawer({
	selectedPhotos,
}: {
	selectedPhotos: Photo[];
}) {
	const { photos } = useContext(AppContext);

	const [isUsingSubfolders, setIsUsingSubfolders] = useState<boolean>(true);

	return (
		<div className="w-full flex justify-between items-center">
			<div className="flex gap-2">
			<label className="flex gap-1 items-center justify-center">
				<input
					type="checkbox"
					checked={isUsingSubfolders}
					onChange={(e) => setIsUsingSubfolders(e.target.checked)}
				/>
				<span>Organize into subfolders by tag</span>
			</label>
			</div>
			<div className="flex gap-2">
				<button className="relative px-3 py-2 border-zinc-300 rounded border">
					Download All
				</button>
				{!!selectedPhotos.length && (
					<button className="relative px-3 py-2 border-zinc-300 rounded border">
						Download {selectedPhotos.length} Selected
					</button>
				)}
			</div>
		</div>
	);
}
