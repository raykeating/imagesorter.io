import React, { useState } from "react";
import { AppContext } from "@/util/appContext";
import { useContext } from "react";
import Photo from "@/types/Photo";
import Link from "next/link";

export default function DownloadDrawer({
	selectedPhotos,
	handleDownloadPhotos,
	isUsingSubfolders,
	setIsUsingSubfolders,
	numberByGridOrder,
	setNumberByGridOrder,
	appendTagToFilename,
	setAppendTagToFilename,
}: {
	selectedPhotos: Photo[];
	handleDownloadPhotos: (options: {
		isUsingSubfolders: boolean;
		numberByGridOrder: boolean;
		appendTagToFilename: boolean;
		onlyDownloadSelected: boolean;
	}) => void;
	isUsingSubfolders: boolean;
	setIsUsingSubfolders: React.Dispatch<React.SetStateAction<boolean>>;
	numberByGridOrder: boolean;
	setNumberByGridOrder: React.Dispatch<React.SetStateAction<boolean>>;
	appendTagToFilename: boolean;
	setAppendTagToFilename: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [showingSettings, setShowingSettings] = useState<boolean>(false);
	const [downloaded, setDownloaded] = useState<boolean>(false);

	return (
		<div className="w-full flex justify-between items-center">
			<div>
				<div className="relative">
					<div className="flex gap-2">
						<button
							className="h-10 px-3 flex items-center border-zinc-500 hover:border-zinc-300 border rounded"
							onClick={() => setShowingSettings(true)}
						>
							<i className="fa-solid fa-gear text-sm"></i>
						</button>
					</div>
					{showingSettings && (
						<div className="p-3 rounded border-zinc-500 transition-colors border absolute bg-black bottom-0 left-0 w-[300px]">
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
								<button
									onClick={() => setShowingSettings(false)}
									className="px-3 py-2 absolute top-0 right-0 text-zinc-400 hover:text-zinc-100"
								>
									<i className="fa-solid fa-x text-xs  transition-colors"></i>
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="flex gap-2">
				<button
					className="relative px-3 py-2 rounded border border-zinc-400 hover:border-zinc-300 transition-colors"
					onClick={() => {
						setDownloaded(true);
						handleDownloadPhotos({
							isUsingSubfolders,
							numberByGridOrder,
							appendTagToFilename,
							onlyDownloadSelected: false,
						});
					}}
				>
					Download All{" "}
					<i className="fa-solid fa-download translate-y-[-1px] ml-1"></i>
				</button>
				{!!selectedPhotos.length && (
					<button
						className="relative px-3 py-2 rounded border border-zinc-400 hover:border-zinc-300 transition-colors"
						onClick={() => {
							setDownloaded(true);
							handleDownloadPhotos({
								isUsingSubfolders,
								numberByGridOrder,
								appendTagToFilename,
								onlyDownloadSelected: true,
							});
						}}
					>
						Download {selectedPhotos.length} Selected{" "}
						<i className="fa-solid fa-download"></i>
					</button>
				)}
				{downloaded && (
					<Link
						className="relative px-3 py-2 rounded border border-zinc-400 hover:border-zinc-300 transition-colors"
						href="https://www.buymeacoffee.com/raykeating"
						target="_blank"
					>
						Buy me a coffee <i className="fa-solid fa-mug-hot text-sm"></i>
					</Link>
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
