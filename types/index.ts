interface Photo {
  type:
    | "bathroom"
    | "bedroom"
    | "dining_room"
    | "exterior"
    | "kitchen"
    | "living_room"
    | "other"
    | undefined;
  name: string;
  file: Blob | File;
  id: string;
}

export type { Photo }