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
import Toasts from "@/components/Toasts";

export const AppContext = createContext<{
	photos: Photo[];
	setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
	tags: Tag[];
	setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
	toasts: string[];
	setToasts: React.Dispatch<React.SetStateAction<string[]>>;
	confirmationDialog: {
		isOpen: boolean;
		title: string;
		text: string;
		onConfirm: () => void;
		onCancel: () => void;
	};
	setConfirmationDialog: React.Dispatch<
		React.SetStateAction<{
			isOpen: boolean;
			title: string;
			text: string;
			onConfirm: () => void;
			onCancel: () => void;
		}>
	>;
}>({
	photos: [],
	setPhotos: () => {},
	tags: [],
	setTags: () => {},
	toasts: [],
	setToasts: () => {},
	confirmationDialog: {
		isOpen: false,
		title: "",
		text: "",
		onConfirm: () => {},
		onCancel: () => {},
	},
	setConfirmationDialog: () => {},
});

export default function Home() {
	const [tags, setTags] = useState<Tag[]>([]);

	const [photos, setPhotos, undoPhotos, redoPhotos] = useUndoableState([]);
	const [fullSizeImage, setFullSizeImage] = useState<Photo | null>(null);

	const [selectedItems, setSelectedItems] = useState<Photo[]>([]);

	const [isTopBarTagSelectorOpen, setIsTopBarTagSelectorOpen] = useState<boolean>(false);

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

	const [toasts, setToasts] = useState<string[]>([]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (toasts.length > 0) {
				setToasts(toasts.slice(1));
			}
		}, 3000);
		return () => clearInterval(interval);
	}, [toasts]);

	const [confirmationDialog, setConfirmationDialog] = useState<{
		isOpen: boolean;
		title: string;
		text: string;
		onConfirm: () => void;
		onCancel: () => void;
	}>({
		isOpen: false,
		title: "",
		text: "",
		onConfirm: () => {},
		onCancel: () => {},
	});

	return (
		<AppContext.Provider
			value={{
				photos,
				setPhotos,
				tags,
				setTags,
				toasts,
				setToasts,
				confirmationDialog,
				setConfirmationDialog,
			}}
		>
			<div
				onClick={(e) => {
					e.stopPropagation();
					setSelectedItems([]);
					setIsTopBarTagSelectorOpen(false);
				}}
			>
				<div className="flex flex-col pt-8 max-w-[1000px] mx-auto gap-2 p-4">
					<TopActionBar
						uploadedPhotoCount={photos.length}
						selectedItems={selectedItems}
						actions={actions}
						handleFileUpload={handleFileUpload}
						isTagSelectorOpen={isTopBarTagSelectorOpen}
						setIsTagSelectorOpen={setIsTopBarTagSelectorOpen}
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

				<Drawers
					undoPhotos={undoPhotos}
					redoPhotos={redoPhotos}
					keysPressed={keysPressed}
				/>
				<Toasts toasts={toasts} />
				{confirmationDialog.isOpen && (
					<div className="fixed top-0 left-0 w-screen h-screen bg-black/80 flex items-center justify-center z-50">
						<div className="p-8 bg-white/75 backdrop-blur rounded items-center justify-center flex flex-col gap-3 max-w-[700px]">
							<h3 className="font-bold text-lg">{confirmationDialog.title}</h3>
							<p>{confirmationDialog.text}</p>
							<div className="flex gap-1 mt-1">
								<button
									className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
									onClick={() => {
										confirmationDialog.onConfirm();
										setConfirmationDialog({
											...confirmationDialog,
											isOpen: false,
										});
									}}
								>
									Confirm
								</button>
								<button
									className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
									onClick={() => {
										confirmationDialog.onCancel();
										setConfirmationDialog({
											...confirmationDialog,
											isOpen: false,
										});
									}}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</AppContext.Provider>
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
