import React, { useState, useContext } from "react";
import { AppContext } from "@/util/appContext";
import { Tag } from "@/types/Photo";
import Photo from "@/types/Photo";
import { v4 as uuid } from "uuid";
import getNextTagColor from "@/util/getNextTagColor";

type Props = {
	photoId: string;
	searchValue: string;
	setSearchValue: React.Dispatch<React.SetStateAction<string>>;
	setAddingTag: React.Dispatch<React.SetStateAction<string | null>>;
	setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function SearchableSelect({
	photoId,
	searchValue,
	setSearchValue,
	setAddingTag,
	setSelectedItems,
}: Props) {
	const { tags, setTags, photos, setPhotos } = useContext(AppContext);

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [filteredOptions, setFilteredOptions] = useState<Tag[]>(tags);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		setSearchValue(e.target.value);
		setFilteredOptions(tags.filter((tag) => tag.text.includes(e.target.value)));
		setIsOpen(true);
	};

	const handleSearchFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		e.stopPropagation();
		setIsOpen(true);
	};

	const handleSearchClick = (
		e: React.MouseEvent<HTMLInputElement, MouseEvent>
	) => {
		e.stopPropagation();
		setIsOpen(true);
	};

	const selectOption = (option: Tag) => {
		const prevPhotos = [...photos];

		const updatedPhotos = prevPhotos.map((photo) => {
			if (photo.id === photoId) {
				return { ...photo, tag: option };
			} else {
				return photo;
			}
		});

		setPhotos(updatedPhotos);
		setSelectedItems([]);
	};

	const handleSelectOption = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		option: Tag
	) => {
		e.stopPropagation();
		selectOption(option);
	};

	const handleAddNewTag = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
	) => {
		e.stopPropagation();
		e.preventDefault();
		const newTagId = uuid();
		// add new tag to global tags
		setTags((prevTags: Tag[]) => {
			const newTag: Tag = {
				text: searchValue,
				id: newTagId,
				color: getNextTagColor(tags),
				confidence: null,
			};
			return [...prevTags, newTag];
		});
		setSearchValue("");
		setAddingTag(null);
		// add new tag to photo
		selectOption({
			text: searchValue,
			id: newTagId,
			color: getNextTagColor(tags),
			confidence: null,
		});
	};

	// automatically select the input when the component is rendered
	const inputRef = React.useRef<HTMLInputElement>(null);
	React.useEffect(() => {
		inputRef.current?.focus();
	}, []);

	return (
		<div className="relative flex flex-col gap-[2px]">
			<div className="relative">
				<form onSubmit={handleAddNewTag}>
					<input
						type="text"
						className="w-full py-1 px-3 rounded shadow bg-white/75  text-end font-normal text-xs"
						value={searchValue}
						onChange={handleSearchChange}
						onKeyDown={(e) => e.stopPropagation()}
						onFocus={handleSearchFocus}
						onClick={handleSearchClick}
						ref={inputRef}
						placeholder="Select or create tag"
					/>
				</form>
			</div>
			{isOpen && (
				<div className="bg-white/75  shadow-sm rounded overflow-y-scroll max-h-[115px] minimal-scrollbar">
					{filteredOptions.map((option) => (
						<button
							key={option.id}
							className="px-2 py-1 hover:bg-white/50 text-end flex justify-end items-center gap-2 w-full"
							onClick={(e) => handleSelectOption(e, option)}
						>
							{option.text}
							<div
								className="w-[6px] h-[6px] rounded-full"
								style={{ backgroundColor: option.color }}
							></div>
						</button>
					))}
					{/* create new */}
					{searchValue && (
						<div
							className="px-2 py-1 hover:bg-white/50 text-end flex justify-end items-center gap-2"
							onClick={handleAddNewTag}
						>
							Create &quot;{searchValue}&quot;
							<div className="w-[6px] h-[6px] rounded-full bg-gray-400"></div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
