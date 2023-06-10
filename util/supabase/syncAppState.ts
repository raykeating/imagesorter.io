import Photo, { Tag, DBTag } from "@/types/Photo";
import supabase from ".";

export async function syncPhotos(
	photos: Photo[],
	setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
) {
	setIsUploading(true);

	const userId = (await supabase.auth.getUser()).data.user?.id as string;

	// get existing photos from the database
	const { data: existingPhotos } = await supabase
		.from("Photos")
		.select("*")
		.eq("user_id", userId);

	// upload new photos to storage
	const photosToUpload = photos.filter((photo) => photo.remoteFileUrl === null);
	if (photosToUpload) {
		await Promise.all(
			photosToUpload.map(async (photo) => {
				const { data: file, error } = await supabase.storage
					.from("Photos")
					.upload(`${userId}/${photo.filename}`, photo.file as Blob);
				if (error) {
					console.error(error);
					return;
				} else {
					photo.remoteFileUrl = `${userId}/${photo.filename}`
				}
			})
		);
	}



	// add new photos to the database
	await supabase.from("Photos").insert(
		photosToUpload.map((photo) => ({
			url: `/${userId}/${photo.filename}`,
			user_id: userId,
			tag_id: photo.tag?.id || null,
		}))
	);

	setIsUploading(false);
}

export async function syncTags(
	tags: Tag[],
	setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
) {
	setIsUploading(true);

	const userId = (await supabase.auth.getUser()).data.user?.id as string;
	// get existing tags from the database
	const { data: existingTags } = await supabase
		.from("Tags")
		.select("*")
		.eq("user_id", userId);

	// add new tags to the database
	const existingTagTexts = existingTags?.map((tag) => tag.tag_text) as string[];
	const tagsToUpload = tags.filter(
		(tag) => !existingTagTexts.includes(tag.text)
	);
	if (tagsToUpload) {
		await supabase.from("Tags").insert(
			tagsToUpload.map((tag) => ({
				tag_text: tag.text,
				tag_confidence: tag.confidence,
				user_id: userId,
			}))
		);
	}

	// delete tags that are no longer used
	const tagsToDelete = existingTags?.filter(
		(tag) => !tags.map((tag) => tag.text).includes(tag.tag_text)
	);
	if (tagsToDelete) {
		await supabase
			.from("Tags")
			.delete()
			.in("id", tagsToDelete?.map((tag) => tag.id) as number[]);
	}

	setIsUploading(false);
}
