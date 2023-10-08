import React, { useState, useRef, useCallback, SetStateAction } from "react";

export default function useUndoableState<T>(
	initialState: T
): [T, (newState: T) => void, () => void, () => void] {
	const [state, setState] = useState<T>(initialState);
	const historyRef = useRef<T[]>([initialState]);
	const pointerRef = useRef<number>(0);

	const undo = useCallback(() => {
		if (pointerRef.current > 0) {
			pointerRef.current--;
			setState(historyRef.current[pointerRef.current]);
		}
	}, []);

	const redo = useCallback(() => {
		if (pointerRef.current < historyRef.current.length - 1) {
			pointerRef.current++;
			setState(historyRef.current[pointerRef.current]);
		}
	}, []);

	const setUndoableState = useCallback((newState: T) => {
		setState(newState);
		pointerRef.current++;
		historyRef.current = [
			...historyRef.current.slice(0, pointerRef.current),
			newState,
		];
	}, []);

	return [state, setUndoableState, undo, redo];
}
