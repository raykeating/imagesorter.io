import React, { createContext } from "react";
import Photo, { Tag } from "@/types/Photo";

export const AppContext = createContext<{
	photos: Photo[];
	setPhotos: (photos: Photo[]) => void;
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
	setAddingTagWithId: React.Dispatch<React.SetStateAction<string | null>>;
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
	setAddingTagWithId: () => {},
});
