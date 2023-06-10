import React from "react";

type Props = {
	isUploading: boolean;
};

export default function UploadIndicator({ isUploading }: Props) {
	return (
		<>
			{isUploading && (
				<div className="fixed top-3 left-3" style={{ zIndex: 999 }}>
					<div className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded">
						<i className="fas fa-upload"></i>
						<span>Uploading...</span>
					</div>
				</div>
			)}
		</>
	);
}
