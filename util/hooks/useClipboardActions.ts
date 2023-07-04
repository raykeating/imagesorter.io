import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import Photo from "@/types/Photo";
import { Clipboard } from "@/types/Clipboard";
import { PressableKeys } from "@/types/PressableKeys";

export default function useClipboardActions(
	keysPressed: PressableKeys,
	photos: Photo[],
	setPhotos: (photos: Photo[]) => void,
	clipboard: Clipboard,
	setClipboard: (clipboard: Clipboard) => void,
	selectedItems: Photo[]
) {
	useEffect(() => {
		// copy with ctrl+c
		if (keysPressed.control && keysPressed.c) {
			setClipboard({
				lastAction: "copy",
				photos: selectedItems,
			});
		}
		// cut with ctrl+x
		if (keysPressed.control && keysPressed.x) {
			setClipboard({
				lastAction: "cut",
				photos: selectedItems,
			});
		}
		// paste with ctrl+v

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
}
