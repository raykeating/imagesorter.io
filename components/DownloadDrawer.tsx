import React, { useState } from "react";
import { AppContext } from "@/util/appContext";
import { useContext } from "react";
import Photo from "@/types/Photo";

export default function DownloadDrawer({
	selectedPhotos,
	handleDownloadPhotos,
}: {
	selectedPhotos: Photo[];
	handleDownloadPhotos: (options: {
		isUsingSubfolders: boolean;
		numberByGridOrder: boolean;
		onlyDownloadSelected: boolean;
	}) => void;
}) {
	const [isUsingSubfolders, setIsUsingSubfolders] = useState<boolean>(true);
	const [numberByGridOrder, setNumberByGridOrder] = useState<boolean>(true);
	const [appendTagToFilename, setAppendTagToFilename] = useState<boolean>(false);

	return (
		<div className="w-full flex justify-between items-center">
			<div className="flex flex-col gap-1 items-start">
				<label className="flex gap-1 items-start justify-center">
					<input
						type="checkbox"
						className="mt-1"
						checked={numberByGridOrder}
						onChange={(e) => setNumberByGridOrder(e.target.checked)}
					/>
					<div className="flex flex-col">
						<span>Number files by grid order</span>
					</div>
				</label>
				<label className="flex gap-1 items-start justify-center">
					<input
						type="checkbox"
						className="mt-1"
						checked={isUsingSubfolders}
						onChange={(e) => setIsUsingSubfolders(e.target.checked)}
					/>
					<div className="flex flex-col">
						<span>Organize into subfolders by tag</span>
					</div>
				</label>

				<label className="flex gap-1 items-start justify-center">
					<input
						type="checkbox"
						className="mt-1"
						checked={appendTagToFilename}
						onChange={(e) => setAppendTagToFilename(e.target.checked)}
					/>
					<div className="flex flex-col">
						<span>Append tag to original filename</span>
					</div>
				</label>
				<small>Example: {getFilenameExample()}</small>
			</div>
			<div className="flex gap-2">
				<button
					className="relative px-3 py-2 rounded border border-zinc-400 hover:border-zinc-300 transition-colors"
					onClick={() =>
						handleDownloadPhotos({
							isUsingSubfolders,
							numberByGridOrder,
							onlyDownloadSelected: false,
						})
					}
				>
					Download All <i className="fa-solid fa-download translate-y-[-1px] ml-1"></i>
				</button>
				{!!selectedPhotos.length && (
					<button
						className="relative px-3 py-2 rounded border border-zinc-400 hover:border-zinc-300 transition-colors"
						onClick={() =>
							handleDownloadPhotos({
								isUsingSubfolders,
								numberByGridOrder,
								onlyDownloadSelected: true,
							})
						}
					>
						Download {selectedPhotos.length} Selected <i className="fa-solid fa-download"></i>
					</button>
				)}
			</div>
		</div>
	);

	function getFilenameExample() {
		let example = "";
		if (isUsingSubfolders) {
			example += "tag/";
		}
		if (numberByGridOrder) {
			example += "1-";
		}
		if (appendTagToFilename) {
			example += "tag-filename";
		} else {
			example += "filename";
		}

		return example + ".jpg";
	}
}
