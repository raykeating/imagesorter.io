import { Tag, tagColors } from "@/types/Photo";

export default function getNextTagColor(tags: Tag[] | undefined | null) {
    if (!tags) return tagColors[0];
    const nextColor = tagColors[tags.length % tagColors.length];
    return nextColor;
}
