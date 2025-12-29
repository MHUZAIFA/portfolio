"use client";

import { motion, MotionConfig } from "framer-motion";
import { ReactNode } from "react";

const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export function MotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = prefersReducedMotion();

  return (
    <MotionConfig
      reducedMotion={reducedMotion ? "always" : "user"}
      transition={{
        type: "tween",
        ease: [0.4, 0, 0.2, 1],
        duration: 0.3,
      }}
    >
      {children}
    </MotionConfig>
  );
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
  },
};

