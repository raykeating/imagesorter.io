

import { useEffect, useRef } from "react";

function useClassifier() {
    const worker = useRef<Worker | null>(null);

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL("@/util/worker", import.meta.url), {
                type: "module",
            });
        }    }, []);


    return worker;
}

export default useClassifier;