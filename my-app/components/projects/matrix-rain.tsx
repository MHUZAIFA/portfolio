"use client";

import { useEffect, useRef } from "react";

const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>{}[]/=+-*&|!?$#@%".split(
    "",
  );

/**
 * Full-screen matrix-rain canvas overlay. Click or press Esc to close.
 */
export function MatrixRain({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    const FONT = 14;
    const cols = Math.floor(canvas.width / FONT);
    const drops: number[] = Array.from({ length: cols }, () =>
      Math.floor((Math.random() * canvas.height) / FONT),
    );

    const onResize = () => setSize();
    window.addEventListener("resize", onResize);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 12, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT}px ui-monospace, SFMono-Regular, Menlo, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * FONT;
        const y = drops[i] * FONT;

        // head (bright)
        ctx.fillStyle = "rgba(190, 255, 230, 0.95)";
        ctx.fillText(ch, x, y);

        // trail fade
        ctx.fillStyle = "rgba(52, 211, 153, 0.75)";
        ctx.fillText(ch, x, y - FONT);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 1;
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] cursor-pointer"
      onClick={onClose}
      role="button"
      aria-label="Close matrix effect"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ background: "#05060a" }}
      />
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-emerald-300/30 bg-black/60 px-4 py-1.5 font-mono text-[11px] text-emerald-200 backdrop-blur-md">
        press{" "}
        <kbd className="mx-1 rounded border border-emerald-300/30 bg-black/40 px-1.5 py-0.5 text-[10px]">
          Esc
        </kbd>{" "}
        or click to exit
      </div>
    </div>
  );
}
