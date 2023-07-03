import { pipeline } from "@xenova/transformers";

import React, { useEffect, useState } from "react";

export default function Test() {
	const labels = ["city", "farm"];
	const imagesToClassify = [
		// bird
		"blob:http://localhost:3000/2d347944-a157-44af-a161-7ced1e116df9",
		// // cat
		// "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1143&q=80",
		// // dog
		// "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
	];

	const [images, setImages] = useState<string[] | ArrayBuffer[] | null>([]);

	const handleFileUpload = (e) => {
        const files = e.target.files;
        const images: any[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onloadend = () => {
                images.push(reader.result);
                setImages(images);
            };
            reader.readAsDataURL(file);
        }
	};

	useEffect(() => {
		const fetchModel = async () => {
			const classifier = await pipeline(
				"zero-shot-image-classification",
				"Xenova/clip-vit-base-patch32"
			);

			const results = await classifier(images, labels);

			console.log(results);
		};
		fetchModel();
	}, [images]);

	return (
		<div className="w-full flex flex-col items-center pt-8 text-white gap-3">
			<h1>Transformer Testing</h1>

			<input
				type="file"
				accept="image/*"
                multiple={true}
				onChange={(e) => handleFileUpload(e)}
			/>
		</div>
	);
}
