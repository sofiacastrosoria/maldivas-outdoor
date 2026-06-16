"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const LOGO_SRC = "/logo/maldivas-logo-transparent.png";
const SPLASH_KEY = "maldivas-splash-seen";
const DURATION_MS = 1800;

export function SplashScreen() {
  const [phase, setPhase] = useState<"hidden" | "visible" | "exiting">("hidden");

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) return;

    sessionStorage.setItem(SPLASH_KEY, "1");
    setPhase("visible");

    const exitTimer = setTimeout(() => setPhase("exiting"), DURATION_MS - 400);
    const hideTimer = setTimeout(() => setPhase("hidden"), DURATION_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "hidden" && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "exiting" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[#0a0a0a]"
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{
              opacity: phase === "exiting" ? 0 : 1,
              scale: phase === "exiting" ? 1.02 : 1,
              y: phase === "exiting" ? -8 : 0,
            }}
            transition={{
              duration: 0.9,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="flex flex-col items-center"
          >
            <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44">
              <Image
                src={LOGO_SRC}
                alt=""
                fill
                className="object-contain object-center"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
