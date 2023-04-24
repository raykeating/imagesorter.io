import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tag as TagType } from "types/Photo"

export function SortableTag(props: { id: string, tag: TagType, setTags: React.Dispatch<React.SetStateAction<TagType[]>> }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Tag tag={props.tag} setTags={props.setTags} />
        </div>
    );
};

function Tag({ tag, setTags }: { tag: TagType, setTags: React.Dispatch<React.SetStateAction<Tag[]>> }) {
	function handleRemoveTag() {
		setTags(tags => tags.filter((t) => t.id !== tag.id));
	}

	return (
		<li className="rounded p-1 pl-3" style={{ backgroundColor: tag.color }}>
			<span>{tag.text}</span>
			<button
				className=" py-1 px-2 opacity-90 hover:opacity-100"
				onClick={handleRemoveTag}
			>
				&times;
			</button>
		</li>
	);
}