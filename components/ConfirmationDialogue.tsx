import React from "react";

type Props = {
	confirmationDialog: {
		isOpen: boolean;
		title: string;
		text: string;
		onConfirm: () => void;
		onCancel: () => void;
	};
	setConfirmationDialog: React.Dispatch<
		React.SetStateAction<{
			isOpen: boolean;
			title: string;
			text: string;
			onConfirm: () => void;
			onCancel: () => void;
		}>
	>;
};

export default function ConfirmationDialogue({
	confirmationDialog,
	setConfirmationDialog,
}: Props) {
	return (
		<>
			{confirmationDialog.isOpen && (
				<div className="fixed top-0 left-0 w-screen h-screen bg-black/80 flex items-center justify-center z-50">
					<div className="p-8 bg-white/75  rounded items-center justify-center flex flex-col gap-3 max-w-[700px]">
						<h3 className="font-bold text-lg">{confirmationDialog.title}</h3>
						<p>{confirmationDialog.text}</p>
						<div className="flex gap-1 mt-1">
							<button
								className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
								onClick={() => {
									confirmationDialog.onConfirm();
									setConfirmationDialog({
										...confirmationDialog,
										isOpen: false,
									});
								}}
							>
								Confirm
							</button>
							<button
								className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
								onClick={() => {
									confirmationDialog.onCancel();
									setConfirmationDialog({
										...confirmationDialog,
										isOpen: false,
									});
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
