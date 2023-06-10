import supabase from "@/util/supabase";

interface Tag {
	readonly id: string;
	text: string;
	color: string;
	confidence: number | null;
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

	getURL() {
		if (this.remoteFileUrl) {
			async () => {
				const { data, error } = await supabase.storage
					.from("Photos")
					.createSignedUrl(this.remoteFileUrl as string, 15);
				if (error) {
					console.error(error);
					return;
				} else {
					return data.signedUrl;
				}
			};
		} else {
			return this.localFileUrl;
		}
	}
}

export default Photo;

export type { Tag, DBTag };

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
