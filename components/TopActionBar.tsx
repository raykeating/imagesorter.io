import React, { useState, useEffect } from "react";
import FileInput from "./FileInput";

export default function TopActionBar({
	handleFileUpload,
	uploadedPhotoCount,
	selectedItems,
	actions,
}: {
	handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	uploadedPhotoCount: number;
	selectedItems: any[];
	actions: any[];
}) {
	const [isFixed, setIsFixed] = useState<boolean>(false);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleScroll = () => {
		if (window.scrollY > 32) {
			setIsFixed(true);
		} else {
			setIsFixed(false);
		}
	};

	return (
		<div
			className={`elf-start sticky w-full top-1 flex justify-between items-center bg-zinc-800 px-4 py-2 rounded z-40 border-t-4 border-zinc-400 shadow-md transition-transform ${
				isFixed ? "scale-[1.03]" : "scale-100"
			}`}
		>
			{uploadedPhotoCount > 0 && (
				<div className={`flex gap-4 `}>
					<span className="text-zinc-400 py-1 px-2 bg-zinc-700 rounded cursor-default select-none">
						{selectedItems.length} Selected
					</span>

					{actions.map((action) => {
						return (
							<button
								className="text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer"
								onClick={action.action}
								key={action.text}
							>
								{action.text}
							</button>
						);
					})}
				</div>
			)}

			<div>
				<FileInput handleFileUpload={handleFileUpload} />
			</div>
		</div>
	);
}