import React, { SyntheticEvent, useState } from "react";
import { Tag, tagColors } from "../types/Photo";
import Photo from "../types/Photo";
import { v4 as uuid } from "uuid";

type Props = { tags: Tag[]; setTags: (tags: Tag[]) => void, getPredictions() : void };

export default function TagSelector({tags, setTags, getPredictions}: Props) {

  const [tagInput, setTagInput] = useState<string>("");

  function handleTagInput(e: React.ChangeEvent<HTMLInputElement>) : void {
    setTagInput(e.target.value);
  };

  function handleAddTag(e: SyntheticEvent) : void {
    e.preventDefault();
    if (tagInput === "") return;
    setTags([...tags, { id: uuid(), name: tagInput, color: tagColors[tags.length % tagColors.length] } as Tag]);
    setTagInput("");
    // getPredictions();
  };

  function handleRemoveTag(tag: Tag) : void {
    setTags(tags.filter((t) => t.id !== tag.id));
  };

  return (
    <div></div>
  );
}