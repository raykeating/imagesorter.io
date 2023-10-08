import React from "react";

type Props = {
	alert: {
		isOpen: boolean;
		title: string;
		text: string;
	};
	setAlert: React.Dispatch<
		React.SetStateAction<{
			isOpen: boolean;
			title: string;
			text: string;
		}>
	>;
};

export default function Alert({ alert, setAlert }: Props) {
	return (
		<>
			{alert.isOpen && (
				<div
					className="fixed top-0 left-0 w-screen h-screen bg-black/80 flex items-center justify-center z-50"
					onClick={() =>
						setAlert({
							isOpen: false,
							title: "",
							text: "",
						})
					}
				>
					<div className="p-8 bg-white/75  rounded items-center justify-center flex flex-col gap-3 max-w-[700px] relative">
						<h3 className="font-bold text-lg">{alert.title}</h3>
						<p>{alert.text}</p>
						<div className="flex gap-1 mt-1">
							<button
								className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
								onClick={() => {
									setAlert({
										...alert,
										isOpen: false,
										text: "",
										title: "",
									});
								}}
							>
								OK
							</button>
						</div>
						{/* Close button */}
						<div
							className="absolute top-2 right-2 flex items-center justify-center p-3 h-8 w-8 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
							onClick={() => {
								setAlert({
									...alert,
									isOpen: false,
									text: "",
									title: "",
								});
							}}
						>
							<i className="fa-solid text-black fa-x"></i>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
