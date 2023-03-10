import { useState, useRef, useCallback } from 'react';

export default function useUndoableState(initialState: any) {
  const [state, setState] = useState(initialState);
  const historyRef = useRef([initialState]);
  const pointerRef = useRef(0);

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

  const setUndoableState = useCallback((newState: any) => {
    setState(newState);
    pointerRef.current++;
    historyRef.current = [
      ...historyRef.current.slice(0, pointerRef.current),
      newState,
    ];
  }, []);

  return [state, setUndoableState, undo, redo];
}