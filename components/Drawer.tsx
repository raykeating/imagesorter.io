import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Drawer(
	{ children }: { children: React.ReactNode } = { children: null } as {
		children: React.ReactNode;
	}
) {
	return (
		<AnimatePresence>
			{children && (
				<motion.div
					className="z-40 flex justify-center bg-black text-white w-full p-6"
					initial={{ transform: "translateY(100%)" }}
					animate={{ transform: "translateY(0%)" }}
					exit={{ transform: "translateY(100%)" }}
					transition={{ duration: 0.2 }}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
