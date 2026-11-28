"use client";

import { Fragment, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%*+=/";
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Decodes `text` out of random glyphs, left-to-right with a little scatter.
 * Writes straight to the DOM in a rAF loop (no React re-renders per frame).
 * Re-runs whenever `text` changes, so it doubles as the transition between values.
 */
export function ScrambleText({
  text,
  active,
  duration = 0.85,
  className,
}: {
  text: string;
  active: boolean;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shownRef = useRef<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.textContent = " "; // hold the line height
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || shownRef.current === text) {
      el.textContent = text;
      shownRef.current = text;
      return;
    }

    const n = text.length;
    const revealAt = Array.from({ length: n }, (_, i) => (i / Math.max(1, n)) * 0.6 + Math.random() * 0.3);
    const glyphs: string[] = new Array(n);
    const t0 = performance.now();
    let lastRoll = 0;
    let raf = 0;

    const frame = (now: number) => {
      const p = (now - t0) / (duration * 1000);
      // Re-roll glyphs every ~50ms rather than every frame: reads as "decoding", not noise.
      const roll = now - lastRoll > 50;
      if (roll) lastRoll = now;
      let html = "";
      for (let i = 0; i < n; i++) {
        const ch = text[i];
        if (ch === " " || p >= revealAt[i]) {
          html += escapeHtml(ch);
        } else {
          if (roll || !glyphs[i]) glyphs[i] = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          html += `<span style="color:rgba(199,210,254,0.55)">${escapeHtml(glyphs[i])}</span>`;
        }
      }
      el.innerHTML = html;
      if (p < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        el.textContent = text;
        shownRef.current = text;
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [text, active, duration]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className={className}>
        {" "}
      </span>
    </>
  );
}

/** Paragraph whose words float up and sharpen out of a blur, one after another. */
export function WordReveal({
  text,
  active,
  delay = 0,
  stagger = 0.028,
  className,
}: {
  text: string;
  active: boolean;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={active ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
            transition={{ duration: 0.7, delay: delay + i * stagger, ease: EASE_OUT }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
