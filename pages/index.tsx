import React, { useState, useEffect, createContext } from "react";
import { Tag } from "@/types/Photo";
import Photo from "@/types/Photo";
import { Clipboard } from "@/types/Clipboard";
import { v4 as uuid } from "uuid";
import GridSortingInterface from "@/components/GridSortingInterface";
import FullSizeImageOverlay from "@/components/FullSizeImageOverlay";
import useUndoableState from "@/util/hooks/useUndoableState";
import UndoButtons from "@/components/UndoButtons";
import UploadIndicator from "@/components/UploadIndicator";
import getActions from "@/util/actions";
import TopActionBar from "@/components/TopActionBar";
import Drawers from "@/components/Drawers";
import Toasts from "@/components/Toasts";
import { syncTags, syncPhotos } from "@/util/supabase/syncAppState";

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
	zoomLevel: number;
	setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
	setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
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
	zoomLevel: 5,
	setZoomLevel: () => {},
	setIsUploading: () => {},
});

export default function Home() {
	const [tags, setTags] = useState<Tag[]>([]);
	const [addingTagWithId, setAddingTagWithId] = useState<string | null>(null); // tag id

	// useUndoableState is a custom hook that returns an array with the state,
	// a function to set the state, a function to undo the state, and a function
	// to redo the state.  It also stores the state history in local storage.
	const [photos, setPhotos, undoPhotos, redoPhotos] = useUndoableState([]);

	// // store the state in local storage
	// useEffect(() => {
	// 	// if (photos.length > 0) {
	// 	syncPhotos(photos, setIsUploading);
	// 	// }
	// }, [photos]);

	// useEffect(() => {
	// 	// if (tags.length > 0) {
	// 	syncTags(tags, setIsUploading);
	// 	// }
	// }, [tags]);

	const [fullSizeImage, setFullSizeImage] = useState<Photo | null>(null);

	const [clipboard, setClipboard] = useState<Clipboard>({
		lastAction: null,
		photos: [],
	});

	const [selectedItems, setSelectedItems] = useState<Photo[]>([]);

	const [isTopBarTagSelectorOpen, setIsTopBarTagSelectorOpen] =
		useState<boolean>(false);

	const [actions, setActions] = useState(
		getActions(photos, setPhotos, selectedItems, setSelectedItems)
	);

	const [keysPressed, setKeysPressed] = useState<{
		control: boolean;
		meta: boolean;
		lowerZ: boolean;
		upperZ: boolean;
		shift: boolean;
		c: boolean;
		x: boolean;
		v: boolean;
	}>({
		control: false,
		meta: false,
		lowerZ: false,
		upperZ: false,
		shift: false,
		c: false,
		x: false,
		v: false,
	});

	const [zoomLevel, setZoomLevel] = useState<number>(5);

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
						localFileUrl: URL.createObjectURL(files[i]),
						remoteFileUrl: null,
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

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Control") {
				setKeysPressed((kp) => {
					return { ...kp, control: true };
				});
			} else if (e.key === "Meta") {
				setKeysPressed((kp) => {
					return { ...kp, meta: true };
				});
			} else if (e.key === "Shift") {
				setKeysPressed((kp) => {
					return { ...kp, shift: true };
				});
			} else if (e.key === "z") {
				setKeysPressed((kp) => {
					return { ...kp, lowerZ: true };
				});
			} else if (e.key === "Z") {
				setKeysPressed((kp) => {
					return { ...kp, upperZ: true };
				});
			} else if (e.key === "c") {
				setKeysPressed((kp) => {
					return { ...kp, c: true };
				});
			} else if (e.key === "x") {
				setKeysPressed((kp) => {
					return { ...kp, x: true };
				});
			} else if (e.key === "v") {
				setKeysPressed((kp) => {
					return { ...kp, v: true };
				});
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === "Control") {
				setKeysPressed((kp) => {
					return { ...kp, control: false };
				});
			} else if (e.key === "Meta") {
				setKeysPressed((kp) => {
					return { ...kp, meta: false, lowerZ: false };
				});
			} else if (e.key === "Shift") {
				setKeysPressed((kp) => {
					return { ...kp, shift: false };
				});
			} else if (e.key === "z") {
				setKeysPressed((kp) => {
					return { ...kp, lowerZ: false };
				});
			} else if (e.key === "Z") {
				setKeysPressed((kp) => {
					return { ...kp, upperZ: false };
				});
			} else if (e.key === "c") {
				setKeysPressed((kp) => {
					return { ...kp, c: false };
				});
			} else if (e.key === "x") {
				setKeysPressed((kp) => {
					return { ...kp, x: false };
				});
			} else if (e.key === "v") {
				setKeysPressed((kp) => {
					return { ...kp, v: false };
				});
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	// copy with ctrl+c
	useEffect(() => {
		if (keysPressed.control && keysPressed.c) {
			setClipboard({
				lastAction: "copy",
				photos: selectedItems,
			});
		}
	}, [keysPressed]);

	// cut with ctrl+x
	useEffect(() => {
		if (keysPressed.control && keysPressed.x) {
			setClipboard({
				lastAction: "cut",
				photos: selectedItems,
			});
		}
	}, [keysPressed]);

	// paste with ctrl+v
	useEffect(() => {
		if (keysPressed.control && keysPressed.v) {
			let oldPhotos: Photo[] = [...photos];

			if (clipboard.lastAction === "cut") {
				// remove cut items
				oldPhotos = oldPhotos.filter(
					(item) => !clipboard.photos.map((item) => item.id).includes(item.id)
				);
			}

			setClipboard({
				...clipboard,
				lastAction: "paste",
			});

			const duplicateItems = clipboard.photos.map(
				(item) =>
					// duplicate item with new id
					new Photo({
						...item,
						id: uuid(),
					})
			);
			if (selectedItems.length === 0) {
				setPhotos([...oldPhotos, ...duplicateItems]);
			} else {
				const selectedItemsIds = selectedItems.map((item) => item.id);
				const selectedItemsIndex = oldPhotos.findIndex((item) =>
					selectedItemsIds.includes(item.id)
				);
				const newPhotos = [
					...oldPhotos.slice(0, selectedItemsIndex + 1),
					...duplicateItems,
					...oldPhotos.slice(selectedItemsIndex + 1),
				];
				setPhotos(newPhotos);
			}
		}
	}, [keysPressed]);

	// currently, toasts are hidden behind the drawers, so they are not visible
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

	const [isUploading, setIsUploading] = useState<boolean>(false);

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
				zoomLevel,
				setZoomLevel,
				setIsUploading,
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
						clipboard={clipboard}
						addingTagWithId={addingTagWithId}
						setAddingTagWithId={setAddingTagWithId}
						handleDelete={handleDelete}
						handleFullscreen={handleFullscreen}
						handleItemClick={handleItemClick}
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
					selectedItems={selectedItems}
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
				<UploadIndicator isUploading={isUploading} />
			</div>
		</AppContext.Provider>
	);

	function handleItemClick(event: any, item: any) {
		// if the user is holding down the shift+control keys, add the item to the list
		if (event.ctrlKey) {
			setSelectedItems((items) => [...items, item]);
		} else if (event.shiftKey) {
			// if the user is holding down the shift key, add all the items between the last selected item and the current item to the list
			const lastSelectedItem = selectedItems[selectedItems.length - 1];
			const lastSelectedItemIndex = photos.indexOf(lastSelectedItem);
			const currentItemIndex = photos.indexOf(item);

			if (lastSelectedItemIndex < currentItemIndex) {
				setSelectedItems((items) => {
					const uniqueItems = new Set(items);
					const newItems = photos.slice(
						lastSelectedItemIndex + 1,
						currentItemIndex + 1
					);
					newItems.forEach((item: Photo) => uniqueItems.add(item));
					return Array.from(uniqueItems);
				});
			} else {
				setSelectedItems((items) => {
					const uniqueItems = new Set(items);
					const newItems = photos.slice(
						currentItemIndex,
						lastSelectedItemIndex
					);
					newItems.forEach((item: Photo) => uniqueItems.add(item));
					return Array.from(uniqueItems);
				});
			}
		} else if (selectedItems.length === 1 && selectedItems[0] === item) {
			// if the user clicks on the same item, deselect it
			setSelectedItems([]);
		} else {
			// otherwise, select the item
			setSelectedItems((items) => [item]);
		}

		event.stopPropagation();
	}

	function handleFullscreen(e: any, item: any) {
		e.stopPropagation();
		setFullSizeImage(item);
	}

	function handleDelete(e: any, item: any) {
		e.stopPropagation();
		setPhotos((photos: Photo[]) => photos.filter((p) => p.id !== item.id));
	}
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
