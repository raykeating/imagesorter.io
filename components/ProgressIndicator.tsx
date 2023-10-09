import React, { useState, useEffect } from "react";

type Props = {
	isVisible: boolean; // whether to show the progress indicator
	progress: {
		current: number; // the current index of the image being classified
		total: number; // the total number of images to classify
	};
};

export default function ProgressIndicator({ isVisible, progress }: Props) {
	const [isComplete, setIsComplete] = useState<boolean>(false);

	useEffect(() => {
		if (progress.current === progress.total && progress.total > 0) {
			setIsComplete(true);
			setTimeout(() => {
				setIsComplete(false);
			}, 3000);
		}
	}, [progress]);

	return (
		<>
			{isVisible &&
				(progress.total > 0 ? (
					<div className="fixed top-3 left-3" style={{ zIndex: 999 }}>
						<div className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded">
							<span>
								{isComplete ? (
									<>
										Complete <i className="fa-solid fa-circle-check"></i>
									</>
								) : (
									<>
										Classifying... {progress.current}/{progress.total}{" "}
										<i className="fas fa-circle-notch animate-spin"></i>
									</>
								)}
							</span>
						</div>
					</div>
				) : (
					<div className="fixed top-3 left-3" style={{ zIndex: 999 }}>
						<div className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded">
							Loading Classifier... <i className="fas fa-circle-notch animate-spin"></i>
						</div>
					</div>
				))}
		</>
	);
}
