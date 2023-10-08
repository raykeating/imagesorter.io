// Libraries
import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/dist/client/image";

// Components
import GridSortingInterface from "@/components/GridSortingInterface";
import FullSizeImageOverlay from "@/components/FullSizeImageOverlay";
import ProgressIndicator from "@/components/ProgressIndicator";
import TopActionBar from "@/components/TopActionBar";
import Drawers from "@/components/Drawers";
import Alert from "@/components/Alert";
import ConfirmationDialogue from "@/components/ConfirmationDialogue";
import ZoomButtons from "@/components/ZoomButtons";
import AppInfoModal from "@/components/AppInfoModal";

// Custom Hooks and Utilities
import useClassifier from "@/util/hooks/useClassifier";
import useUndoableState from "@/util/hooks/useUndoableState";
import useKeyboardActions from "@/util/hooks/useKeyboardActions";
import useKeypressListener from "@/util/hooks/useKeypressListener";
import getActions from "@/util/actions";
import { AppContext } from "@/util/appContext";
import { getInitialPhotos, initialTags } from "@/util/initialData";

// Types
import { Tag } from "@/types/Photo";
import Photo from "@/types/Photo";
import { Clipboard } from "@/types/Clipboard";
import { PressableKeys } from "@/types/PressableKeys";
import { ClassifierOutput } from "@/types/Classifier";

export default function Home() {
	// **** App State ****

	// useUndoableState is a custom hook that returns an array with the state,
	// a function to set the state, a function to undo the state, and a function
	// to redo the state.  It also stores the state history in local storage.
	const [photos, setPhotos, undoPhotos, redoPhotos] = useUndoableState<Photo[]>(
		[]
	);

	// tags is an array of Tag objects that are currently in the app state.
	const [tags, setTags] = useState<Tag[]>(initialTags);

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
		delete: false,
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
		confirmButtonText?: string;
		cancelButtonText?: string;
	}>({
		isOpen: false,
		title: "",
		text: "",
		onConfirm: () => {},
		onCancel: () => {},
		confirmButtonText: "Confirm",
		cancelButtonText: "Cancel",
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

	const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

	// **** Effects ****

	// load initial photos
	useEffect(() => {
		getInitialPhotos().then((initialPhotos) => {
			setPhotos(initialPhotos);
		});
	}, []);

	// listen for changes to photos or selectedItems and update actions
	useEffect(() => {
		setActions(getActions(photos, setPhotos, selectedItems, setSelectedItems));
	}, [photos, selectedItems]);

	useKeypressListener(setKeysPressed);

	useKeyboardActions(
		keysPressed,
		photos,
		setPhotos,
		clipboard,
		setClipboard,
		selectedItems,
		setSelectedItems
	);

	// **** Classifier ****
	const classifier = useClassifier();
	const [isClassifying, setIsClassifying] = useState<boolean>(false);
	const [classifierProgress, setClassifierProgress] = useState<{
		current: number;
		total: number;
	}>({
		current: 0,
		total: 0,
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
				zoomLevel,
				setZoomLevel,
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

				<div className="fixed top-4 left-4 flex gap-1">
					<div className="px-2 py-1 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 opacity-80">
						<Image
							src="/ImageSorterLogo.png"
							alt="Image Sorter Logo"
							width={70}
							height={40}
							quality={100}
						/>
					</div>
					<button
						onClick={() => setShowInfoModal(true)}
						className="px-3 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-black transition-colors"
					>
						<i className="fa-solid fa-info-circle"></i>
					</button>
				</div>
				<ZoomButtons zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />

				<FullSizeImageOverlay
					photo={fullSizeImage}
					setFullSizeImage={setFullSizeImage}
				/>

				<Drawers
					undoPhotos={undoPhotos}
					redoPhotos={redoPhotos}
					selectedItems={selectedItems}
					handlePredict={handlePredict}
					handleDownloadPhotos={handleDownloadPhotos}
				/>

				<ConfirmationDialogue
					confirmationDialog={confirmationDialog}
					setConfirmationDialog={setConfirmationDialog}
				/>

				<Alert alert={alert} setAlert={setAlert} />

				<ProgressIndicator
					isVisible={isClassifying}
					progress={classifierProgress}
				/>

				<AppInfoModal isOpen={showInfoModal} setIsOpen={setShowInfoModal} />
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
		const newPhotos = photos.filter((p) => p.id !== item.id);
		setPhotos(newPhotos);
	}

	// handleFileUpload is called when the user uploads a file using the file input
	function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		let newPhotos: Photo[] = [];
		if (files) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const id = uuid();
				const localFileUrl = URL.createObjectURL(file);
				const newPhoto = new Photo({
					tag: null,
					filename: file.name,
					file: file,
					localFileUrl: localFileUrl,
					remoteFileUrl: null,
					id: id,
				});
				newPhotos.push(newPhoto);
			}
		}
		setPhotos([...photos, ...newPhotos]);
	}

	async function handlePredict() {
		let photosToClassify = photos;

		// if only selected photos should be classified, only use those
		if (selectedItems.length > 0) {
			photosToClassify = selectedItems;
		}

		if (classifier.current && photos.length > 0 && tags.length > 0) {

			// send photos and tags to classifier
			classifier.current.postMessage({
				photos: photosToClassify.map((photo: Photo) => {
					return {
						url: photo.localFileUrl,
						id: photo.id,
					};
				}),
				tags: tags.map((tag: Tag) => tag.text),
			});

			setIsClassifying(true);

			// set up a listener for messages from the classifier
			const onMessageReceived = (e: MessageEvent<any>) => {
				switch (e.data.type) {
					case "classifier-started":
						setClassifierProgress(e.data.progress);
						// set isClassifying to true to display the progress bar
						break;
					case "classifier-progress":
						setClassifierProgress(e.data.progress);
						const newPhotos = [...photos];

						// find the prediction with the highest score
						const prediction = e.data.prediction.probabilities.reduce(
							(prev: any, current: any) => {
								return prev.score > current.score ? prev : current;
							}
						);

						const photo = newPhotos.find(
							(photo) => photo.id === e.data.prediction.photoId
						);
						if (photo) {
							photo.tag =
								tags.find((tag) => tag.text === prediction.label) || null;
						}

						break;
					case "classifier-finished":
						// set isClassifying to false to hide the progress bar after 3s
						setIsClassifying(false);
						setClassifierProgress({
							current: 0,
							total: 0,
						});
						break;
				}
			};
			classifier.current?.addEventListener("message", onMessageReceived);

		} else if (!classifier.current) {
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
	}

	function handleDownloadPhotos(
		options: {
			isUsingSubfolders: boolean;
			numberByGridOrder: boolean;
			onlyDownloadSelected: boolean;
		},
		photosToDownload = photos
	) {
		// create a zip file with the photos organized into subfolders by tag
		const zip = new JSZip();
		const subfolders: { [key: string]: JSZip } = {};

		photosToDownload.forEach((photo: Photo, index: number) => {
			const tag = photo.tag;
			if (tags.length > 0 && options.isUsingSubfolders) {
				if (tag) {
					if (!subfolders[tag.text]) {
						// add isUsingSubfolders check here
						subfolders[tag.text] = zip.folder(tag.text) as JSZip;
					}
					if (options.numberByGridOrder) {
						subfolders[tag.text].file(
							`${index + 1}-${photo.filename}` as string,
							photo.file as Blob
						);
					} else {
						subfolders[tag.text].file(
							photo.filename as string,
							photo.file as Blob
						);
					}
				} else {
					subfolders["untagged"] = zip.folder("untagged") as JSZip;
					if (options.numberByGridOrder) {
						subfolders["untagged"].file(
							`${index + 1}-${photo.filename}` as string,
							photo.file as Blob
						);
					} else {
						subfolders["untagged"].file(
							photo.filename as string,
							photo.file as Blob
						);
					}
				}
			} else {
				if (options.numberByGridOrder) {
					zip.file(
						`${index + 1}-${photo.filename}` as string,
						photo.file as Blob
					);
				} else {
					zip.file(photo.filename as string, photo.file as Blob);
				}
			}
		});

		zip.generateAsync({ type: "blob" }).then((content) => {
			saveAs(content, "sortedimages.zip");
		});
	}
}
