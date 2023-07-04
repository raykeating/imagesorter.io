import { pipeline } from "@xenova/transformers";

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

		return this.instance;
	}
}

self.addEventListener("message", async (event) => {
	let classifier = await ImageClassifierPipeline.getInstance(
		(progress: any) => {
			console.log(progress);
			self.postMessage(progress);
		}
	);
});
