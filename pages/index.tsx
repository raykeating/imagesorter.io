import React, { useState, useEffect, createContext } from "react";
import { Tag } from "@/types/Photo";
import Photo from "@/types/Photo";
import { v4 as uuid } from "uuid";
import GridSortingInterface from "@/components/GridSortingInterface";
import FullSizeImageOverlay from "@/components/FullSizeImageOverlay";
import useUndoableState from "@/util/hooks/useUndoableState";
import UndoButtons from "@/components/UndoButtons";
import TagSelector from "@/components/TagSelector";
import getActions from "@/util/actions";
import TopActionBar from "@/components/TopActionBar";
import Drawers from "@/components/Drawers";

export const AppContext = createContext<{
	tags: Tag[];
	setTags: (tags: Tag[]) => void;
}>({
	tags: [],
	setTags: () => {},
});

export default function Home() {
	const [tags, setTags] = useState<Tag[]>([]);

	const [photos, setPhotos, undoPhotos, redoPhotos] = useUndoableState([]);
	const [fullSizeImage, setFullSizeImage] = useState<Photo | null>(null);

	const [selectedItems, setSelectedItems] = useState<Photo[]>([]);

	const [actions, setActions] = useState(
		getActions(photos, setPhotos, selectedItems, setSelectedItems)
	);

	const [keysPressed, setKeysPressed] = useState<{
		control: boolean;
		lowerZ: boolean;
		upperZ: boolean;
		shift: boolean;
	}>({ control: false, lowerZ: false, upperZ: false, shift: false });

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		let newPhotos: Photo[] = [];
		if (files) {
			for (let i = 0; i < files.length; i++) {
				newPhotos.push(
					new Photo({
						tag: null,
						filename: files[i].name,
						file: files[i],
						fileUrl: URL.createObjectURL(files[i]),
						id: uuid(),
					})
				);
			}
			setPhotos([...photos, ...newPhotos]);

			// if (tags.length > 0) {
			// 	getPredictionsFromTags(photos, setPhotos, tags);
			// }
		}
	};

	// listen for changes to photos or selectedItems and update actions
	useEffect(() => {
		setActions(getActions(photos, setPhotos, selectedItems, setSelectedItems));
	}, [photos, selectedItems]);

	// listen for key presses on control, shift, z
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Control") {
				setKeysPressed({ ...keysPressed, control: true });
			} else if (e.key === "Shift") {
				setKeysPressed({ ...keysPressed, shift: true });
			} else if (e.key === "z") {
				setKeysPressed({ ...keysPressed, lowerZ: true });
			} else if (e.key === "Z") {
				setKeysPressed({ ...keysPressed, upperZ: true });
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === "Control") {
				setKeysPressed({ ...keysPressed, control: false });
			} else if (e.key === "Shift") {
				setKeysPressed({ ...keysPressed, shift: false });
			} else if (e.key === "z") {
				setKeysPressed({ ...keysPressed, lowerZ: false });
			} else if (e.key === "Z") {
				setKeysPressed({ ...keysPressed, upperZ: false });
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [keysPressed]);

	// undo/redo with ctrl+z, ctrl+shift+z
	useEffect(() => {
		if (keysPressed.control && keysPressed.lowerZ) {
			undoPhotos();
		} else if (keysPressed.control && keysPressed.shift && keysPressed.upperZ) {
			redoPhotos();
		}
	}, [keysPressed]);

	return (
		<div
			onClick={(e) => {
				e.stopPropagation();
				setSelectedItems([]);
			}}
		>
			<div className="flex flex-col pt-8 max-w-[1000px] mx-auto gap-2 p-4">
				<TopActionBar
					uploadedPhotoCount={photos.length}
					selectedItems={selectedItems}
					actions={actions}
					handleFileUpload={handleFileUpload}
				/>
				<GridSortingInterface
					items={photos}
					setItems={setPhotos}
					setFullSizeImage={(photo: Photo) => setFullSizeImage(photo)}
					selectedItems={selectedItems}
					setSelectedItems={setSelectedItems}
					handleFileUpload={handleFileUpload}
				/>
			</div>

			{/* Absolute elements and overlays */}
			
			<FullSizeImageOverlay
				photo={fullSizeImage}
				setFullSizeImage={setFullSizeImage}
			/>
			<AppContext.Provider
				value={{
					tags,
					setTags,
				}}
			>
				<Drawers
					undoPhotos={undoPhotos}
					redoPhotos={redoPhotos}
					keysPressed={keysPressed}
				/>
			</AppContext.Provider>
		</div>
	);
}

function handleRearrange(
	items: Photo[],
	setItems: (items: Photo[]) => void
): void {
	// randomize the order of the items
	const newItems = [...items];
	for (let i = newItems.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newItems[i], newItems[j]] = [newItems[j], newItems[i]];
	}
	setItems(newItems);
}

// const getPredictionsFromTags = async (
// 	photos: Photo[],
// 	setPhotos: (photos: Photo[]) => void,
// 	tags: Tag[]
// ) => {
// 	const formData = new FormData();
// 	photos.forEach((photo) => {
// 		formData.append("images", photo.file as Blob);
// 	});
// 	formData.append("classes", JSON.stringify(tags.map((tag) => tag.name)));
// 	const response = await fetch(
// 		`${process.env.NEXT_PUBLIC_BACKEND_URL}/predict`,
// 		{
// 			method: "POST",
// 			body: formData,
// 		}
// 	);
// 	const data = await response.json();
// 	const predictions = data.predictions;
// 	const newPhotos = photos.map((photo, index) => {
// 		if (predictions[index].label === "*UNDEFINED*") {
// 			return photo;
// 		}
// 		photo.tag = {
// 			text: predictions[index].prediction,
// 			confidence: predictions[index].confidence,
// 			tag: tags.find((tag) => tag.name === predictions[index].prediction),
// 		};
// 		return photo;
// 	});
// 	setPhotos(newPhotos);
// };
