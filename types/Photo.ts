import { v4 as uuid } from "uuid";

interface Tag {
	readonly id: string;
	text: string;
	color: string;
	confidence?: number;
}

class Photo {
	tag: Tag | null;
	filename: string;
	file: Blob | File | null;
	fileUrl: string;
	id: string;

	constructor({
		tag,
		filename,
		file,
		fileUrl,
		id,
	}: {
		tag: Tag | null;
		filename: string;
		file: Blob | File | null;
		fileUrl: string;
		readonly id: string;
	}) {
		this.tag = tag;
		this.filename = filename;
		(this.file = file), (this.fileUrl = fileUrl);
		this.id = id;
		this.fileUrl = fileUrl;
	}

	duplicateWithNewId(): Photo {
		return new Photo({
			tag: this.tag,
			filename: this.filename,
			file: this.file,
			fileUrl: this.fileUrl,
			id: uuid(),
		});
	}
}

export default Photo;

export type { Tag };

export const tagColors = [
	"#F56565",
	"#ED8936",
	"#ECC94B",
	"#48BB78",
	"#38B2AC",
	"#4299E1",
	"#667EEA",
	"#9F7AEA",
	"#ED64A6",
	"#CBD5E0",
	"#A0AEC0",
	"#718096",
	"#4A5568",
	"#2D3748",
	"#1A202C",
];
