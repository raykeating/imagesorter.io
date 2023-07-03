import Photo from "@/types/Photo";
import supabase from "@/util/supabase";
import { Database } from "@/types/supabase";

export default async function uploadPhotos(
	newPhotos: Photo[]
): Promise<Photo[]> {
	const userId = (await supabase.auth.getUser()).data.user?.id as string;

	if (!userId) return [];

	// upload photos to storage
	for (const photo of newPhotos) {
		const { data, error } = await supabase.storage
			.from("Photos")
			.upload(`/${userId}/${photo.filename}`, photo.file as File);
	}

	const dbPhotos = newPhotos.map((photo) => {
		return {
			url: `/${userId}/${photo.filename}`,
			user_id: userId,
		};
	});

	const { data, error } = await supabase.from("Photos").insert(dbPhotos);

	// print error
	if (error) {
		console.error("error", error);
        return [];
	} else {
		// add remoteFileUrl to Photo objects
		return newPhotos.map((photo) => {
			return {
				...photo,
				remoteFileUrl: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${userId}/${photo.filename}`,
			};
		});
	}
}
