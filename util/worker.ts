import { pipeline, Pipeline } from "@xenova/transformers";
import { ClassifierInput } from "@/types/Classifier";

class ImageClassifierPipeline {
	static task: string = "zero-shot-image-classification";
	static model: string = "Xenova/clip-vit-base-patch32";
	static instance: ImageClassifierPipeline | null = null;

	static async getInstance(
		progress_callback: Function | undefined = undefined
	) {
		if (this.instance === null) {
			this.instance = pipeline(this.task, this.model, { progress_callback });
		}

		return this.instance as Pipeline;
	}
}

self.addEventListener("message", async (event) => {

	console.log("worker event", event);

	let classifier: Pipeline = await ImageClassifierPipeline.getInstance();

	// get data from main thread
	const { photos, tags }: ClassifierInput = event.data;

	console.log("photos", photos);

	let predictions: { probabilities: any; photoId: string }[] = [];

	// send message to main thread that the classifier has started
	// and how many photos it will classify
	self.postMessage({
		type: "classifier-started",
		progress: { current: 0, total: photos.length },
	});

	// classify each photo
	await Promise.all(photos.map((photo) => classify(photo, tags)));

	async function classify(photo: { url: string; id: string }, tags: string[]) {
		const probabilities = await classifier(photo.url, tags);

		// send message to main thread that the classifier has made progress
		predictions.push({ probabilities, photoId: photo.id });
		self.postMessage({
			type: "classifier-progress",
			progress: { current: predictions.length, total: photos.length },
			prediction: { probabilities, photoId: photo.id },
		});
	}

	// send message to main thread that the classifier has finished
	self.postMessage({
		type: "classifier-finished",
		predictions: predictions,
	});
});
