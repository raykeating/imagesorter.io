import Photo from "@/types/Photo";

export default function getActions(
	photos: Photo[],
	setPhotos: (photos: Photo[]) => void,
	selected: Photo[],
	setSelected: (selected: Photo[]) => void
) {
	const actions = [
		{
			text: "Deselect",
			action: () => {
				setSelected([]);
			},
		},
		{
			text: "Delete",
			action: () => {
				const newPhotos = photos.filter((photo) => !selected.includes(photo));
				setPhotos(newPhotos);
				setSelected([]);
			},
		},
		{
			text: "Select All",
			action: (e: Event) => {
				e.stopPropagation();
				setSelected(photos);
			},
		}
	];

	const filteredActions = actions.filter((action) => {
		if (action.text === "Deselect" && selected.length === 0) {
			return false;
		}
		if (action.text === "Delete" && selected.length === 0) {
			return false;
		}
		if (action.text === "Select All" && selected.length === photos.length) {
			return false;
		}
		return true;
	});

	return filteredActions;
}
