"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LOAD_MS = 1800; // counter 000 → 100
const WIPE_MS = 800; // two panels slide away
const EASE = [0.77, 0, 0.18, 1] as const; // hard in, hard out

const INK = "#ededed";

/** Small factual captions that tick over beside the counter. */
const NOTES = ["Montréal, QC", "Full stack", "Cloud solutions", "Since 2019"];

// Slow start, quick middle, settles into 100.
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

type Phase = "loading" | "wipe";

interface LoadingScreenProps {
  onComplete: () => void;
}

/**
 * Editorial loader: black page, one typeface, an odometer counter whose digits physically roll,
 * then a black panel and an off-white panel wipe up in sequence to reveal the site.
 * Digits are moved straight in the DOM, so React only re-renders once (to start the wipe).
 */
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const noteRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  // The parent passes a fresh callback on every render; keep the latest without restarting.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduced ? 400 : LOAD_MS;
    const t0 = performance.now();
    let raf = 0;
    let lastNote = -1;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Odometer: each column is a strip 0–9 plus a trailing 0; a column only moves while the one
    // to its right rolls from 9 over to 0, exactly like a mechanical counter.
    const setColumn = (i: number, value: number) => {
      const el = digitRefs.current[i];
      if (el) el.style.transform = `translateY(${(-value * 100) / 11}%)`;
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / total);
      const v = easeInOutCubic(t) * 100;
      const ones = v % 10;
      const carry1 = Math.max(0, ones - 9); // 0 → 1 during the last tenth of each ones turn
      const tensRaw = Math.floor(v / 10) % 10;
      const tens = tensRaw + carry1;
      const carry2 = tensRaw === 9 ? carry1 : 0;
      const hundreds = Math.floor(v / 100) + carry2;
      setColumn(0, t >= 1 ? 1 : hundreds);
      setColumn(1, t >= 1 ? 0 : tens);
      setColumn(2, t >= 1 ? 0 : ones);
      if (ruleRef.current) ruleRef.current.style.transform = `scaleX(${v / 100})`;
      const n = Math.min(NOTES.length - 1, Math.floor((v / 100) * NOTES.length));
      if (n !== lastNote && noteRef.current) {
        lastNote = n;
        noteRef.current.textContent = NOTES[n];
      }

      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      // A beat on 100, then wipe.
      timers.push(setTimeout(() => setPhase("wipe"), reduced ? 0 : 250));
      timers.push(setTimeout(() => onCompleteRef.current(), (reduced ? 0 : 250) + WIPE_MS + 120));
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  const wiping = phase === "wipe";

  return (
    <div role="status" aria-label="Loading" className="fixed inset-0 z-50">
      {/* Off-white panel trails the black one, so the wipe has two layers. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: INK }}
        initial={{ y: "0%" }}
        animate={wiping ? { y: "-100%" } : undefined}
        transition={{ duration: WIPE_MS / 1000, delay: 0.12, ease: EASE }}
      />
      <motion.div
        className="absolute inset-0 bg-black"
        style={{ color: INK }}
        initial={{ y: "0%" }}
        animate={wiping ? { y: "-100%" } : undefined}
        transition={{ duration: WIPE_MS / 1000, ease: EASE }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          animate={{ opacity: wiping ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        >
          {/* Top row */}
          <div className="absolute inset-x-6 top-6 flex justify-between text-xs uppercase tracking-[0.18em] md:inset-x-10 md:top-8 md:text-sm">
            <span>Mohammed Huzaifa</span>
            <span className="opacity-50">Portfolio ©{new Date().getFullYear()}</span>
          </div>

          {/* Bottom: caption + odometer */}
          <div className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-8">
            <div className="flex items-end justify-between gap-6">
              <span className="block overflow-hidden pb-2 text-xs uppercase tracking-[0.18em] md:pb-4 md:text-sm">
                <motion.span
                  ref={noteRef}
                  className="block"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {NOTES[0]}
                </motion.span>
              </span>
              <div className="flex text-[28vw] font-medium leading-none tracking-[-0.06em] tabular-nums md:text-[16vw]">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="relative block h-[1em] overflow-hidden">
                    <span
                      ref={(el) => {
                        digitRefs.current[i] = el;
                      }}
                      className="flex flex-col will-change-transform"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, k) => (
                        <span key={k} className="block h-[1em] leading-none">
                          {d}
                        </span>
                      ))}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 h-px w-full bg-white/15 md:mt-6">
              <div ref={ruleRef} className="h-full origin-left" style={{ background: INK, transform: "scaleX(0)" }} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
