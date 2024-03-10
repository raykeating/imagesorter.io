import React, { useEffect } from "react";
import Image from "next/image";

type Props = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AppInfoModal({ isOpen, setIsOpen }: Props) {
	type WindowSize = {
		width: number | null;
		height: number | null;
	};

	// get window size
	const [windowSize, setWindowSize] = React.useState({
		width: null,
		height: null,
	} as WindowSize);

	useEffect(() => {
		// Handler to call on window resize
		function handleResize() {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		// Add event listener
		window.addEventListener("resize", handleResize);

		// Call handler right away so state gets updated with initial window size
		handleResize();

		// Remove event listener on cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []); // Empty array ensures that effect is only run on mount

	const infoContent = (
		<div>
			<header className="mb-6">
				<div className="bg-black rounded p-3 text-white">
					<Image
						src="/ImageSorterLogo.png"
						alt="Image Sorter Logo"
						width={120}
						height={60}
						quality={100}
					/>
					<h1 className="inline ml-1 text-xl p-1 font-bold drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]">
						A free tool for sorting and organizing your images
					</h1>
				</div>
			</header>

			<h3 className="text-xl font-bold">Features</h3>

			<ol className="flex flex-col gap-5">
				<li className="flex gap-3">
					<div className="flex flex-col justify-center gap-1 w-1/2">
						<strong>Drag &amp; Drop Sorting</strong>
						<p>
							Need to order your images in a specific way? Use the drag and drop
							grid to arrange your images in the desired order.
						</p>
					</div>

					<Image
						src="/product-screenshots/drag-and-drop.png"
						alt="Drag and Drop"
						className="rounded shadow"
						width={500}
						height={400}
						style={{
							objectFit: "cover",
							height: "150px",
							width: "50%",
						}}
					/>
				</li>
				<li className="flex gap-3">
					<div className="flex flex-col justify-center gap-1 w-1/2">
						<strong>Image Tagging</strong>
						<p>
							Want to group images by theme, event, or category? Our tagging
							feature allows you to easily assign labels to your images.
						</p>
					</div>

					<Image
						src="/product-screenshots/image-tagging.png"
						alt="Drag and Drop"
						className="rounded shadow"
						width={500}
						height={400}
						style={{
							objectFit: "cover",
							height: "150px",
							width: "50%",
						}}
					/>
				</li>
				<li className="flex gap-3">
					<div className="flex flex-col justify-center gap-1 w-1/2">
						<strong>Export your Images</strong>
						<p>
							Once you have your images sorted, you can download them as a zip
							file. The images will be numbered to match the order you set in
							the grid, and they will be organized into folders based on the
							tags you assigned.
						</p>
					</div>

					<Image
						src="/product-screenshots/image-export.png"
						alt="Drag and Drop"
						className="rounded shadow"
						width={500}
						height={400}
						style={{
							objectFit: "cover",
							height: "150px",
							width: "50%",
						}}
					/>
				</li>
				<li className="flex gap-3">
					<div className="flex flex-col justify-center gap-1 w-1/2">
						<strong>AI-Powered Tagging (Beta)</strong>
						<p>
							Don&apos;t want to tag your images manually? Just enter your tags
							and click{" "}
							<span className="px-2 py-1 bg-zinc-800 text-white font-bold rounded text-sm">
								Predict <i className="fa-solid fa-bolt text-xs"></i>
							</span>
						</p>
					</div>

					<Image
						src="/product-screenshots/ai-classification.png"
						alt="Drag and Drop"
						className="rounded shadow"
						width={500}
						height={400}
						style={{
							objectFit: "cover",
							height: "150px",
							width: "50%",
						}}
					/>
				</li>
			</ol>
		</div>
	);

	return (
		<>
			{isOpen && (
				<div onClick={() => setIsOpen(false)}>
					<div className="fixed top-0 left-0 w-screen h-screen bg-black/80 flex items-center justify-center z-[9999] p-4">
						<button
							onClick={() => setIsOpen(false)}
							className="absolute top-10 z-50 right-10 p-4 rounded-lg bg-white/20 h-12 w-12 flex items-center justify-center backdrop-blur hover:bg-white/40 transition-colors"
						>
							<i className="fa-solid fa-close text-white mt-[2px] text-2xl"></i>
						</button>
						<div className="p-8 bg-white/75 backdrop-blur  rounded flex flex-col gap-3 max-w-[700px] max-h-[80vh] overflow-y-scroll minimal-scrollbar">
							{infoContent}
							<hr className=" border-zinc-500 my-4 mt-8" />
							<div className="flex flex-col gap-2 text-xs">
								<p><span className="font-bold mr-1 text-base">Privacy Policy:</span></p>

								<p>At imagesorter.io, we prioritize the privacy and security of our users. Please read our privacy policy to understand how we handle your information:</p>

								<h2 className="font-bold">No Storage or Retention of Photos:</h2>
								<p>We do not store or retain any of the photos uploaded to our tool. All image classification processes occur within the user's browser, ensuring that photos remain solely on the user's device and are not transmitted or stored on our servers.</p>

								<h2 className="font-bold">No Third-Party Image Classification Services:</h2>
								<p>Our website does not utilize any third-party services for image classification. All image classification tasks are performed within the user's browser environment without involving external services or servers.</p>

								<h2 className="font-bold">Tracking of Tag Information:</h2>
								<p>We track information on tags for the purpose of enhancing user experience and improving our product. When users assign tags to images, the tag names are sent to a database and associated with the user's session. This data is used in an aggregated and anonymized manner to gain insights into user behavior and preferences.</p>

								<h2 className="font-bold">Use of Tag Data:</h2>
								<p>The tag data collected is utilized solely for internal purposes, including but not limited to analyzing user patterns, understanding user needs, and refining our product features. We do not share individual user tag data with any third parties.</p>

								<h2 className="font-bold">Data Security:</h2>
								<p>We employ industry-standard security measures to safeguard user data, including tag information. However, it's important to note that no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security of data.</p>

								<h2 className="font-bold">Changes to Privacy Policy:</h2>
								<p>We reserve the right to update or modify this privacy policy at any time. Any changes made will be reflected on this page, and users will be notified of significant updates via email or prominent notices on our website.</p>

								<p>By using imagesorter.io, you agree to the terms outlined in this privacy policy. If you have any questions or concerns regarding our privacy practices, you can contact Ray at <a href="raykeating.com">raykeating.com</a>.</p>

								<p>Last Updated: March 10th, 2024</p>
							</div>
						
						</div>
						
					</div>
				</div>
			)}
		</>
	);
}
