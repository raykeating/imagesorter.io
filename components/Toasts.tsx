import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { toasts: string[] };

export default function Toasts({ toasts }: Props) {
	return (
		<AnimatePresence>
			{toasts.map((toast, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 right-0 bg-white/80 text-black px-4 py-2 rounded-sm shadow-md"
                >
                    {toast}
                </motion.div>
            ))}
            
		</AnimatePresence>
	);
}
