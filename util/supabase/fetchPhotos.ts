import supabase from "@/util/supabase";
import { Database } from "@/types/supabase";
import Photo, { Tag } from "@/types/Photo";
import getNextTagColor from "../getNextTagColor";

export default async function fetchPhotos(): Promise<Photo[]> {
	const userId = (await supabase.auth.getUser()).data.user?.id as string;

	const res = await supabase.from("Photos").select("*").eq("user_id", userId);

	const tagRes = await supabase.from("Tags").select("*").eq("user_id", userId);

	const dbTags = tagRes.data as Database["public"]["Tables"]["Tags"]["Row"][];
	const dbPhotos = res.data as Database["public"]["Tables"]["Photos"]["Row"][];

	const photos: Photo[] = [];

    // create Photo objects
    dbPhotos.forEach((dbPhoto) => {
        const photo = new Photo({
            id: dbPhoto.id.toString(),
            filename: dbPhoto.url?.split("/").pop() || null,
            remoteFileUrl: dbPhoto.url || null,
            tag: null,
            file: null,
            localFileUrl: null,
        });
        photos.push(photo);
    });

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

