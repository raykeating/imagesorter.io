import { pipeline, Pipeline } from "@xenova/transformers";

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
	let classifier: Pipeline = await ImageClassifierPipeline.getInstance();

	const { data } = event;
	const {
		photos,
		tags,
	}: {
		photos: string[]; // array of urls
		tags: string[]; // array of tag labels
	} = data;

	console.log("trying to classify photos");

	const results = await classifier(photos, tags);

	console.log("results", results);

	self.postMessage({
		type: "classifier-results",
		data: results,
	});
});
