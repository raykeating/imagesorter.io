import { PressableKeys } from "@/types/PressableKeys";
import { useEffect } from "react";

export default function useKeypressListener(
	setKeysPressed: React.Dispatch<React.SetStateAction<PressableKeys>>
) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Control") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, control: true };
				});
			} else if (e.key === "Meta") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, meta: true };
				});
			} else if (e.key === "Shift") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, shift: true };
				});
			} else if (e.key === "z") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, lowerZ: true };
				});
			} else if (e.key === "Z") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, upperZ: true };
				});
			} else if (e.key === "c") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, c: true };
				});
			} else if (e.key === "x") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, x: true };
				});
			} else if (e.key === "v") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, v: true };
				});
			} else if (e.key === "Delete") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, delete: true };
				});
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === "Control") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, control: false };
				});
			} else if (e.key === "Meta") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, meta: false, lowerZ: false };
				});
			} else if (e.key === "Shift") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, shift: false };
				});
			} else if (e.key === "z") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, lowerZ: false };
				});
			} else if (e.key === "Z") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, upperZ: false };
				});
			} else if (e.key === "c") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, c: false };
				});
			} else if (e.key === "x") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, x: false };
				});
			} else if (e.key === "v") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, v: false };
				});
			} else if (e.key === "Delete") {
				setKeysPressed((kp: PressableKeys) => {
					return { ...kp, delete: false };
				});
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
}
