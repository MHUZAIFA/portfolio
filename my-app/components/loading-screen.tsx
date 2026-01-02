"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const loadingWords = [
  "Think.",
  "Design.",
  "Engineer.",
  "Build.",
  "Create.",
  "Optimize.",
];


interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const progressRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Prevent body scrolling when loading screen is active
    document.body.style.overflow = "hidden";

    const startTime = performance.now();
    startTimeRef.current = startTime;
    const wordDisplayDuration = 1000; // Time each word displays (ms)
    const blackScreenDelay = 500; // Delay after last word (ms)
    const duration = loadingWords.length * wordDisplayDuration + blackScreenDelay; // Total duration including black screen delay

    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => {
        const next = prev + 1;
        // Don't loop - just advance to next word, stop at last word
        if (next >= loadingWords.length) {
          clearInterval(wordInterval); // Stop interval when reaching last word
          // After showing last word, wait for wordDisplayDuration, then show black screen
          setTimeout(() => {
            setShowBlackScreen(true);
          }, wordDisplayDuration);
          return loadingWords.length - 1; // Stay on last word
        }
        return next;
      });
    }, wordDisplayDuration); // Each word displays for 1000ms

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
              {!showBlackScreen && (
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
              )}
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

