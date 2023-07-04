import React, { useState, useEffect, useRef } from "react";
import { Tag } from "@/types/Photo";
import Photo from "@/types/Photo";
import { Clipboard } from "@/types/Clipboard";
import { v4 as uuid } from "uuid";
import GridSortingInterface from "@/components/GridSortingInterface";
import FullSizeImageOverlay from "@/components/FullSizeImageOverlay";
import useUndoableState from "@/util/hooks/useUndoableState";
import UploadIndicator from "@/components/UploadIndicator";
import getActions from "@/util/actions";
import TopActionBar from "@/components/TopActionBar";
import Drawers from "@/components/Drawers";
import useClipboardActions from "@/util/hooks/useClipboardActions";
import { PressableKeys } from "@/types/PressableKeys";
import useKeypressListener from "@/util/hooks/useKeypressListener";
import ConfirmationDialogue from "@/components/ConfirmationDialogue";
import { AppContext } from "@/util/appContext";
import { pipeline, Pipeline } from "@xenova/transformers";
import Alert from "@/components/Alert";
import getNextTagColor from "@/util/getNextTagColor";

export default function Home() {
	// **** Worker ****

	// Create a reference to the worker object.
	const worker = useRef<Worker | null>(null);

	// We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
	// https://huggingface.co/docs/transformers.js/tutorials/react
	useEffect(() => {
		if (!worker.current) {
			// Create the worker if it does not yet exist.
			worker.current = new Worker(new URL("./worker.ts", import.meta.url), {
				type: "module",
			});
		}

		// Create a callback function for messages from the worker thread.
		const onMessageReceived = (e: MessageEvent<Photo[]>) => {
			// TODO: Will fill in later
		};

		// Attach the callback function as an event listener.
		worker.current.addEventListener("message", onMessageReceived);

		// Define a cleanup function for when the component is unmounted.
		return () => {
			worker.current?.removeEventListener("message", onMessageReceived);
		};
	});

	// **** App State ****

	// useUndoableState is a custom hook that returns an array with the state,
	// a function to set the state, a function to undo the state, and a function
	// to redo the state.  It also stores the state history in local storage.
	const [photos, setPhotos, undoPhotos, redoPhotos] = useUndoableState<Photo[]>(
		[]
	);

	// tags is an array of Tag objects that are currently in the app state.
	const [tags, setTags] = useState<Tag[]>([]);

	// function rotateHue(increment: number, count: number) {
	// 	const colors = Array.from({ length: count }, (_, index) => {
	// 		const hue = (index * increment) % 300 + 200;
	// 		return `hsl(${hue}, 70%, 40%)`;
	// 	});

	// 	console.log(colors);

	// 	return colors;
	// }

	// addingTagWithId is a string that is the id of the photo that is currently
	// being tagged.  It is used to display the tag selector in the photo card
	const [addingTagWithId, setAddingTagWithId] = useState<string | null>(null); // tag id

	// fullSizeImage stores the photo that is currently being displayed in the
	// full size image overlay.  When it is null, the overlay is not displayed.
	const [fullSizeImage, setFullSizeImage] = useState<Photo | null>(null);

	// clipboard stores the photos that have been copied or cut.  It is used to
	// paste photos after they have been copied or cut.
	const [clipboard, setClipboard] = useState<Clipboard>({
		lastAction: null,
		photos: [],
	});

	// selectedItems is an array of Photo objects that are currently selected.
	const [selectedItems, setSelectedItems] = useState<Photo[]>([]);

	// isTopBarTagSelectorOpen is a boolean that is true when the tag selector
	// in the top action bar is open.  It is used to tag photos in bulk.
	const [isTopBarTagSelectorOpen, setIsTopBarTagSelectorOpen] =
		useState<boolean>(false);

	// isUploading is a boolean that is true when things are being uploaded to the
	// server.  It is used to display a loading indicator.
	const [isUploading, setIsUploading] = useState<boolean>(false);

	// currently, toasts are hidden behind the drawers, so they are not visible
	const [toasts, setToasts] = useState<string[]>([]);

	const [actions, setActions] = useState(
		getActions(photos, setPhotos, selectedItems, setSelectedItems)
	);

	// zoomLevel is a number that represents the zoom level of the grid (# of columns)
	const [zoomLevel, setZoomLevel] = useState<number>(5);

	// keysPressed is an object that keeps track of which keys are currently pressed
	const [keysPressed, setKeysPressed] = useState<PressableKeys>({
		control: false,
		meta: false,
		lowerZ: false,
		upperZ: false,
		shift: false,
		c: false,
		x: false,
		v: false,
	});

	// confirmationDialog is used to display a confirmation dialog.
	// use onConfirm and onCancel to set the functions that are called when the
	// user confirms or cancels the dialog.
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

	const [alert, setAlert] = useState<{
		isOpen: boolean;
		title: string;
		text: string;
	}>({
		isOpen: false,
		title: "",
		text: "",
	});

	// classifier is a function that takes an array of image urls and an array of
	// tags and returns a promise that resolves to an array of arrays of tags.
	// Each array of tags corresponds to the tags that the classifier thinks are
	// relevant to the corresponding image.
	// const [classifier, setClassifier] = useState<{
	// 	classifier: Pipeline | null;
	// }>({
	// 	classifier: null,
	// });

	// **** Effects ****

	// listen for changes to photos or selectedItems and update actions
	useEffect(() => {
		setActions(getActions(photos, setPhotos, selectedItems, setSelectedItems));
	}, [photos, selectedItems]);

	useKeypressListener(setKeysPressed);

	useClipboardActions(
		keysPressed,
		photos,
		setPhotos,
		clipboard,
		setClipboard,
		selectedItems
	);

	useEffect(() => {}, []);

	// useEffect(() => {
	// 	handlePredict();
	// }, [photos, tags]);

	const handlePredict = () => {
		// const results = await classifier(
		// 	photos.map((photo: Photo) => photo.localFileUrl),
		// 	tags.map((tag: Tag) => tag.text)
		// );

		const callHandlePredict = async () => {
			if (worker.current && photos.length > 0 && tags.length > 0) {
				const results = worker.current.postMessage({
					photos: photos.map((photo: Photo) => photo.localFileUrl),
					tags: tags.map((tag: Tag) => tag.text),
				});

				console.log(results);

				// const newPhotos = photos.map((photo: Photo, index: number) => {
				// 	const prediction = results[index].reduce(
				// 		(prev: any, current: any) => {
				// 			return prev.score > current.score ? prev : current;
				// 		}
				// 	);

				// 	return {
				// 		...photo,
				// 		tag: tags.find((tag: Tag) => tag.text === prediction.label) || null,
				// 	};
				// });

				// setPhotos(newPhotos);
			} else if (!worker.current) {
				setAlert({
					isOpen: true,
					title: "Classifier not loaded",
					text: "Try again in a moment, the classifier is still loading.",
				});
			} else if (photos.length === 0) {
				setAlert({
					isOpen: true,
					title: "No photos",
					text: "Upload some photos to start applying tags to them.",
				});
			} else if (tags.length === 0) {
				setAlert({
					isOpen: true,
					title: "No tags",
					text: "Upload some tags to start applying them to photos.",
				});
			}
		};

		callHandlePredict();
	};

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
				setAddingTagWithId,
			}}
		>
			<div
				onClick={(e) => {
					e.stopPropagation();
					setSelectedItems([]);
					setIsTopBarTagSelectorOpen(false);
				}}
			>
				{/********************************
				 **** Main Grid and Action Bar ****
				 ********************************/}

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

				{/**************************************
				 **** Absolute elements and overlays ****
				 **************************************/}

				<FullSizeImageOverlay
					photo={fullSizeImage}
					setFullSizeImage={setFullSizeImage}
				/>

				<Drawers
					undoPhotos={undoPhotos}
					redoPhotos={redoPhotos}
					selectedItems={selectedItems}
					handlePredict={handlePredict}
				/>

				<ConfirmationDialogue
					confirmationDialog={confirmationDialog}
					setConfirmationDialog={setConfirmationDialog}
				/>

				<Alert alert={alert} setAlert={setAlert} />

				<UploadIndicator isUploading={isUploading} />
			</div>
		</AppContext.Provider>
	);

	// ********************
	// ** Event Handlers **
	// ********************

	// handleItemClick is called when the user clicks on an item in the grid
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

	// handleFullscreen is called when the user clicks on the fullscreen icon on an item in the grid
	function handleFullscreen(e: any, item: any) {
		e.stopPropagation();
		setFullSizeImage(item);
	}

	// handleDelete is called when the user clicks on the delete icon on an item in the grid
	function handleDelete(e: any, item: any) {
		e.stopPropagation();
		setPhotos((photos: Photo[]) => photos.filter((p) => p.id !== item.id));
	}

	// handleFileUpload is called when the user uploads a file using the file input
	function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
		}
	}
}
