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
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Prevent body scrolling when loading screen is active
    document.body.style.overflow = "hidden";

    const startTime = performance.now();
    startTimeRef.current = startTime;
    const duration = 4000; // Total duration in ms - allows time to read words

    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => {
        const next = (prev + 1) % loadingWords.length;
        // If we've cycled through all words and progress is still low, restart cycle
        if (next === 0 && progressRef.current < 90) {
          return 0; // Restart from beginning
        }
        return next;
      });
    }, 600); // Slower word transitions so text is readable (~600ms per word)

    // Use requestAnimationFrame for smoother progress updates
    const updateProgress = (currentTime: number) => {
      if (!startTimeRef.current) return;
      
      const elapsed = currentTime - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      progressRef.current = newProgress;
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(wordInterval);
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 300);
      } else {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      clearInterval(wordInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-center text-4xl font-light tracking-wider text-white md:text-8xl"
              >
                {loadingWords[currentWordIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
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

