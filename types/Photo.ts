import { v4 as uuid } from "uuid";
import supabase from "@/util/supabase";

interface Tag {
	readonly id: string;
	text: string;
	color: string;
	confidence?: number | null; // global tags don't have confidence
}

interface DBTag {
	created_at: string | null;
	id: number;
	tag_confidence: number | null;
	tag_text: string | null;
}

class Photo {
	tag: Tag | null;
	filename: string | null;
	file: Blob | File | null;
	localFileUrl: string | null;
	remoteFileUrl: string | null;
	id: string;

	constructor({
		tag,
		filename,
		file,
		localFileUrl,
		remoteFileUrl,
		id,
	}: {
		tag: Tag | null;
		filename: string | null;
		file: Blob | File | null;
		localFileUrl: string | null;
		remoteFileUrl: string | null;
		readonly id: string;
	}) {
		this.tag = tag;
		this.filename = filename;
		this.file = file;
		this.localFileUrl = localFileUrl;
		this.remoteFileUrl = remoteFileUrl;
		this.id = id;
	}

	// methods not in use

	// static getURL(photo: Photo) {
	// 	if (photo.remoteFileUrl) {
	// 		async () => {
	// 			const { data, error } = await supabase.storage
	// 				.from("Photos")
	// 				.createSignedUrl(photo.remoteFileUrl as string, 15);
	// 			if (error) {
	// 				console.error(error);
	// 				return;
	// 			} else {
	// 				return data.signedUrl;
	// 			}
	// 		};
	// 	} else {
	// 		return photo.localFileUrl;
	// 	}
	// }

	// static duplicateWithNewId(photo: Photo): Photo {
	// 	return new Photo({
	// 		tag: photo.tag,
	// 		filename: photo.filename,
	// 		file: photo.file,
	// 		localFileUrl: photo.localFileUrl,
	// 		remoteFileUrl: photo.remoteFileUrl,
	// 		id: uuid(),
	// 	});
	// }
}

export default Photo;

export type { Tag, DBTag };

export const tagColors = [
	"#008080",
	"#8b008b",
	"#191970",
	"#556b2f",
	"#6495ed",
	"#8b4513",

	"#3cb371",

	"#9acd32",

	"#ff4500",
	"#ffa500",
	"#ffff00",
	"#0000cd",
	"#00ff00",
	"#00ff7f",
	"#dc143c",
	"#00ffff",
	"#b0c4de",
	"#ff00ff",
	"#db7093",
	"#eee8aa",

	"#ff1493",
	"#7b68ee",
	"#ffa07a",
	"#ee82ee",
];
