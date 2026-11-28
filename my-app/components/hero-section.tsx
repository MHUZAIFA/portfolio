"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useState, useRef } from "react";
import { Download } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { HeroParticleField } from "@/components/hero-particle-field";
import { RollText, WordReveal } from "@/components/hero-text-fx";
import { INTRO_TIMELINE as T, onIntroStart } from "@/lib/game-bus";

const roles = [
  "Cloud Solutions Architect",
  "Full Stack Developer", // Air Canada, Flexspring, CitiusTech, WTW
  "UI/UX Designer", // Homesfy
  "Graduate Student", // Concordia MACS
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** How long each role stays on screen. */
const ROLE_MS = 3500;

const DESCRIPTION =
  "I love building software end to end, from the first architecture sketch to the last pixel. Especially the kind that pushes limits and leaves the world a little better.";

type HeroSectionProps = {
  gameActive?: boolean;
};

export function HeroSection({ gameActive = false }: HeroSectionProps = {}) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [particlesReady, setParticlesReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const handleParticlesReady = useCallback(() => setParticlesReady(true), []);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  
  // Use scroll opacity, text opacity will be controlled by animate prop
  const opacity = scrollOpacity;

  // One clock for the whole hero: starts when the loading screen lifts (see INTRO_TIMELINE).
  const [introStarted, setIntroStarted] = useState(false);
  const [roleActive, setRoleActive] = useState(false);

  useEffect(() => onIntroStart(() => setIntroStarted(true)), []);

  useEffect(() => {
    if (!introStarted) return;
    const t = setTimeout(() => setRoleActive(true), T.role * 1000);
    return () => clearTimeout(t);
  }, [introStarted]);

  // Roles only start cycling once the first one has decoded in.
  useEffect(() => {
    if (!roleActive) return;
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, ROLE_MS);
    return () => clearInterval(interval);
  }, [roleActive]);

  const handleDownload = () => {
    hapticManager.medium();
    window.open("/mohammed_huzaifa_resume.pdf", "_blank");
  };

  const firstName = "MOHAMMED";
  const lastName = "HUZAIFA";

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity, scale, y }}
      className="relative flex h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden px-4 text-center"
    >
      {/* Animated Gradient Mesh Background - Optimized */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Reduced gradient blobs from 4 to 2 for better performance */}
        <motion.div
          className="absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full opacity-30"
          style={{
            // Pre-softened gradient instead of filter: blur() — blur re-rasterises every frame and drops FPS.
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.32) 0%, rgba(99, 102, 241, 0.14) 35%, rgba(99, 102, 241, 0.04) 55%, transparent 72%)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -80, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-[15%] top-[60%] h-[600px] w-[600px] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.32) 0%, rgba(168, 85, 247, 0.14) 35%, rgba(168, 85, 247, 0.04) 55%, transparent 72%)",
            willChange: "transform",
          }}
          animate={{
            x: [0, -120, 0],
            y: [0, 100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Static Grid Pattern - No animation for better performance */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <HeroParticleField
        sectionRef={sectionRef}
        nameRef={nameRef}
        gameActive={gameActive}
        onReady={handleParticlesReady}
      />

      {/* Main content - properly centered. Dims as one unit while the game runs. */}
      <div className="relative z-10 w-full max-w-7xl pt-12 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={{ opacity: gameActive ? 0.15 : 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center text-center mt-12 lg:mt-0"
        >
          {/* 0.0s — greeting pulls in from wide tracking and sharpens */}
          <motion.div
            initial={{ opacity: 0, letterSpacing: "1.1em", filter: "blur(8px)" }}
            animate={introStarted ? { opacity: 0.7, letterSpacing: "0.4em", filter: "blur(0px)" } : undefined}
            transition={{ duration: 1.5, ease: EASE_OUT }}
            className="mb-6 text-base font-light text-white md:text-lg lg:text-xl"
          >
            HELLO, I&apos;M
          </motion.div>

          {/* 0.0–1.8s — name warps in (HeroParticleField); DOM letters provide layout + accessible text */}
          <div className="relative">
            <h1
              ref={nameRef}
              aria-label="Mohammed Huzaifa"
              className={`mb-8 flex flex-col md:flex-row flex-wrap justify-center items-center gap-x-6 lg:gap-x-12 gap-y-1 text-4xl font-bold leading-[0.95] lg:text-8xl select-none transition-colors duration-500 ${
                particlesReady ? "text-transparent" : "text-white"
              }`}
            >
              {[firstName, lastName].map((word) => (
                <span key={word} aria-hidden="true" className="flex flex-wrap justify-center items-center gap-x-2">
                  {word.split("").map((letter, index) => (
                    <span key={`${word}-${index}`} data-letter className="inline-block">
                      {letter}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            {/* 1.8s — landing flash, in sync with the particle shockwave */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 left-1/2 h-px w-[min(90vw,1100px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-200 to-transparent"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={introStarted ? { opacity: [0, 1, 0], scaleX: [0, 1, 1] } : undefined}
              transition={{ duration: 1.2, delay: T.nameLands, times: [0, 0.3, 1], ease: "easeOut" }}
            />
          </div>

          {/* 2.0s / 2.3s — "I'm a" rises from a mask, then the role rolls in */}
          <div className="mt-6 mb-4 flex items-center justify-center lg:mt-10">
            <AnimatedRoles
              currentIndex={currentRoleIndex}
              roles={roles}
              introStarted={introStarted}
              roleActive={roleActive}
            />
          </div>

          {/* 2.7s — description, word by word */}
          <WordReveal
            text={DESCRIPTION}
            active={introStarted}
            delay={T.description}
            className="my-8 lg:mb-12 max-w-3xl mx-auto text-xs leading-relaxed text-white/75 md:text-lg lg:text-xl px-4"
          />

          {/* 3.2s — CTA rises in, then a glint sweeps across it */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={introStarted ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{ duration: 0.9, delay: T.cta, ease: EASE_OUT }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 md:px-10 md:py-5 md:text-lg"
            >
              {/* One-time intro glint */}
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                initial={{ x: "0%" }}
                animate={introStarted ? { x: "400%" } : undefined}
                transition={{ duration: 1.1, delay: T.cta + 0.45, ease: [0.65, 0, 0.35, 1] }}
              />

              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />

              {/* Content */}
              <span className="relative z-10 flex items-center gap-3">
                <motion.div animate={{ y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Download className="h-5 w-5 md:h-6 md:w-6" />
                </motion.div>
                <span>Download Resume</span>
              </span>

              {/* Bottom border accent */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-white"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function AnimatedRoles({
  currentIndex,
  roles,
  introStarted,
  roleActive,
}: {
  currentIndex: number;
  roles: string[];
  introStarted: boolean;
  roleActive: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 md:gap-3">
      <span className="block overflow-hidden">
        <motion.span
          className="block font-mono text-xs uppercase tracking-[0.4em] text-white/45 md:text-sm"
          initial={{ y: "110%" }}
          animate={introStarted ? { y: "0%" } : undefined}
          transition={{ duration: 0.9, delay: T.imA, ease: EASE_OUT }}
        >
          I&apos;m a
        </motion.span>
      </span>
      <RollText
        text={roles[currentIndex]}
        active={roleActive}
        className="text-[clamp(1.75rem,7vw,5.5rem)] font-light leading-[1.15] text-white"
      />
      {/* Which role is showing; the active tick fills over the time it's on screen. */}
      <motion.div
        aria-hidden="true"
        className="mt-2 flex gap-1.5"
        initial={{ opacity: 0 }}
        animate={roleActive ? { opacity: 1 } : undefined}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {roles.map((r, i) => (
          <span key={r} className="relative h-0.5 w-6 overflow-hidden rounded-full bg-white/15 md:w-8">
            {i === currentIndex && roleActive && (
              <motion.span
                key={currentIndex}
                className="absolute inset-0 origin-left rounded-full bg-indigo-200/80"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: ROLE_MS / 1000, ease: "linear" }}
              />
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
