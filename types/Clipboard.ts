import Photo from "./Photo";

export type Clipboard = {
    lastAction: "copy" | "cut" | "paste" | null;
    photos: Photo[];
}