import React from "react";
import Image from "next/image";

type Props = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AppInfoModal({ isOpen, setIsOpen }: Props) {
	return (
		<>
			{isOpen && (
				<div onClick={() => setIsOpen(false)}>
					<div className="fixed top-0 left-0 w-screen h-screen bg-black/80 flex items-center justify-center z-[9999] p-4">
						<button
							onClick={() => setIsOpen(false)}
							className="absolute top-10 right-10 p-4 rounded-lg bg-white/20 h-12 w-12 flex items-center justify-center backdrop-blur hover:bg-white/40 transition-colors"
						>
							<i className="fa-solid fa-close text-white mt-[2px] text-2xl"></i>
						</button>
						<div className="p-8 bg-white/75 backdrop-blur  rounded flex flex-col gap-3 max-w-[700px] max-h-[80vh] overflow-y-scroll minimal-scrollbar">
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
												Need to order your images in a specific way? Use the
												drag and drop grid to arrange your images in the desired
												order.
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
												Want to group images by theme, event, or category? Our
												tagging feature allows you to easily assign labels to
												your images.
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
												Once you have your images sorted, you can download them
												as a zip file. The images will be numbered to match the
												order you set in the grid, and they will be organized
												into folders based on the tags you assigned.
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
												Don&apos;t want to tag your images manually? Just enter your
												tags and click{" "}
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
						</div>
					</div>
				</div>
			)}
		</>
	);
}
