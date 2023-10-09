import Photo from "@/types/Photo";
import { Tag, tagColors } from "@/types/Photo";

const initialTagTexts = ["Dog", "House", "Insect", "Fish"];

const initialTags: Tag[] = initialTagTexts.map((text, index) => ({
    color: tagColors[index % tagColors.length],
    confidence: 1,
    id: index.toString(),
    text,
}));

async function getInitialPhotos() {
	const imgPaths = [
		"/examples/example-8wd9l.jpg",
		"/examples/example-23gse.jpg",
		"/examples/example-f0ef3.jpg",
		"/examples/example-jde98.jpg",
		"/examples/example-sd82k.jpg",
		"/examples/example-sd93l.jpg",
		"/examples/example-sdfw3.jpg",
		"/examples/example-sf9ew.jpg",
		"/examples/example-vr90w.jpg",
		"/examples/example-xcv34.jpg",
		"/examples/example-8wd9l.jpg",
		"/examples/example-23gse.jpg",
		"/examples/example-f0ef3.jpg",
		"/examples/example-jde98.jpg",
		"/examples/example-sd82k.jpg",
		"/examples/example-sd93l.jpg",
		"/examples/example-sdfw3.jpg",
		"/examples/example-sf9ew.jpg",
		"/examples/example-vr90w.jpg",
		"/examples/example-xcv34.jpg",
		"/examples/example-8wd9l.jpg",
		"/examples/example-23gse.jpg",
		"/examples/example-f0ef3.jpg",
		"/examples/example-jde98.jpg",
		"/examples/example-sd82k.jpg",
		"/examples/example-sd93l.jpg",
		"/examples/example-sdfw3.jpg",
		"/examples/example-sf9ew.jpg",
		"/examples/example-vr90w.jpg",
		"/examples/example-xcv34.jpg",
		"/examples/example-8wd9l.jpg",
		"/examples/example-23gse.jpg",
		"/examples/example-f0ef3.jpg",
		"/examples/example-jde98.jpg",
		"/examples/example-sd82k.jpg",
		"/examples/example-sd93l.jpg",
		"/examples/example-sdfw3.jpg",
		"/examples/example-sf9ew.jpg",
		"/examples/example-vr90w.jpg",
		"/examples/example-xcv34.jpg",
		"/examples/example-8wd9l.jpg",
		"/examples/example-23gse.jpg",
		"/examples/example-f0ef3.jpg",
		"/examples/example-jde98.jpg",
		"/examples/example-sd82k.jpg",
		"/examples/example-sd93l.jpg",
		"/examples/example-sdfw3.jpg",
		"/examples/example-sf9ew.jpg",
		"/examples/example-vr90w.jpg",
		"/examples/example-xcv34.jpg",
	];

	// initial photos for the app
	const initialPhotos: Promise<Photo>[] = imgPaths.map(async (path, index) => {
		return new Photo({
			id: index.toString(),
			file: await fetch(path).then((r) => r.blob()),
			filename: path.split("/").pop() as string,
			localFileUrl: path,
			remoteFileUrl: null,
			tag: null,
		});
	});

	return Promise.all(initialPhotos);
}

export { getInitialPhotos, initialTags };
