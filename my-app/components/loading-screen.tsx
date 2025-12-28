"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const loadingWords = [
  "Think.",
  "Solve.",
  "Design.",
  "Engineer.",
  "Create.",
  "Build.",
  "Innovate.",
  "Develop.",
  "Code.",
  "Craft.",
  "Transform.",
  "Optimize.",
  "Refine.",
  "Execute.",
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    // Prevent body scrolling when loading screen is active
    document.body.style.overflow = "hidden";

    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => {
        const next = (prev + 1) % loadingWords.length;
        // If we've cycled through all words and progress is still low, restart cycle
        if (next === 0 && progressRef.current < 90) {
          return 0; // Restart from beginning
        }
        return next;
      });
    }, 1200); // Slower word transitions - shows each word for 1.2 seconds

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 0.8, 100);
        progressRef.current = newProgress;
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          clearInterval(wordInterval);
          setIsComplete(true);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        // Slower progress: increment by 0.8% every 40ms = ~5 seconds total
        return newProgress;
      });
    }, 40);

    return () => {
      clearInterval(wordInterval);
      clearInterval(progressInterval);
      // Restore body scrolling when loading screen unmounts
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentWordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-center text-4xl font-light tracking-wider text-white md:text-8xl"
              >
                {loadingWords[currentWordIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>

          <motion.div
            className="absolute bottom-6 right-6 text-2xl font-light text-white/80 md:text-7xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {Math.round(progress)}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

