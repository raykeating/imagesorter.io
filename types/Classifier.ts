export type ClassifierOutput = { probabilities: any; photoId: string }[];

export type ClassifierInput = {
	photos: { url: string; id: string }[]; // array of urls
	tags: string[]; // array of tag labels
};
