import supabase from "@/util/supabase";
import { Database } from "@/types/supabase";
import Photo, { Tag } from "@/types/Photo";
import getNextTagColor from "../getNextTagColor";

export default async function fetchPhotos(): Promise<Photo[]> {
	const userId = (await supabase.auth.getUser()).data.user?.id as string;

	if (!userId) return [];

	const res = await supabase.from("Photos").select("*").eq("user_id", userId);

	// const tagRes = await supabase.from("Tags").select("*").eq("user_id", userId);

	// const dbTags = tagRes.data as Database["public"]["Tables"]["Tags"]["Row"][];
	const dbPhotos = res.data as Database["public"]["Tables"]["Photos"]["Row"][];

	const photos: Photo[] = [];

	// create Photo objects (sequentially get signed URLs)
	// for (const dbPhoto of dbPhotos) {
	// 	const signedURL = await getSignedURL(dbPhoto.url) || null
	// 	const photo = new Photo({
	// 		id: dbPhoto.id.toString(),
	// 		filename: dbPhoto.url?.split("/").pop() || null,
	// 		localFileUrl: signedURL,
	// 		remoteFileUrl: signedURL,
	// 		tag: null,
	// 		file: null,
	// 	});
	// 	photos.push(photo);
	// }

	// create photo objects (all signed URLs at once)

	const signedURLs = await getSignedURLs(dbPhotos.map((photo) => photo.url?.slice(1) as string));

	console.log(signedURLs);

	for (const dbPhoto of dbPhotos) {
		const photo = new Photo({
			id: dbPhoto.id.toString(),
			filename: dbPhoto.url?.split("/").pop() || null,
			remoteFileUrl: signedURLs?.shift() || null,
			localFileUrl: null,
			tag: null,
			file: null,
		});
		photos.push(photo);
	}

	// async function getSignedURL(photoPath: string | null) {
	// 	const { data, error } = await supabase.storage
	// 		.from("Photos")
	// 		.createSignedUrl(photoPath as string, 60 * 60, {
	// 			transform: {
	// 				width: 400,
	// 				height: 400,
	// 			}
	// 		}); // 1 hour expiry
	// 	if (error) {
	// 		console.error("error", error);
	// 		return;
	// 	} else {
	// 		return data.signedUrl;
	// 	}
	// }

	async function getSignedURLs(photoPaths: string[] | null) {
		const { data, error } = await supabase.storage
			.from("Photos")
			.createSignedUrls(photoPaths as string[], 60 * 60); // 1 hour expiry
		if (error) {
			console.error("error", error);
			return;
		} else {
			console.log(data);
			return data.map((d) => `${d.signedUrl}${"&q=10"}`);
		}
	}

	// add tags to Photo objects
	// photos.forEach((photo) => {
	//     const dbTag = dbTags.find((dbTag) => dbTag.id === );
	// 	if (!dbTag) return null;
	// 	const tag: Tag = {
	// 		id: dbTag.id.toString(),
	// 		text: dbTag.tag_text || "null",
	// 		confidence: dbTag.tag_confidence || null,
	// 		color: getNextTagColor(photos),
	// 	};
	// 	return tag;
	// }

	return photos;
}
