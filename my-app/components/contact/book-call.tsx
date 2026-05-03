"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { CalendarCheck, Sparkles } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";

/* ─────────────────────────────────────────────────────────
   Calendly popup hook
   Loads the Calendly widget script on demand and exposes
   `openCalendly()` to trigger the popup with our URL.
   ───────────────────────────────────────────────────────── */

export const CALENDLY_URL = "https://calendly.com/huzaifafcrit/30min";

const WIDGET_JS = "https://assets.calendly.com/assets/external/widget.js";
const WIDGET_CSS = "https://assets.calendly.com/assets/external/widget.css";

type CalendlyWindow = Window & {
  Calendly?: {
    initPopupWidget: (opts: { url: string }) => void;
    closePopupWidget?: () => void;
  };
};

function ensureCalendlyLoaded(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("SSR"));
      return;
    }
    const w = window as CalendlyWindow;
    if (w.Calendly) {
      resolve();
      return;
    }

    // Inject CSS once
    if (!document.querySelector(`link[data-calendly="css"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = WIDGET_CSS;
      link.setAttribute("data-calendly", "css");
      document.head.appendChild(link);
    }

    // Inject JS once
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-calendly="js"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("load")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = WIDGET_JS;
    script.async = true;
    script.setAttribute("data-calendly", "js");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("load"));
    document.head.appendChild(script);
  });
}

/**
 * Imperatively open the Calendly popup from anywhere (no hook).
 * Loads the widget on demand; falls back to a new tab if blocked.
 */
export async function openCalendlyDirect(): Promise<void> {
  if (typeof window === "undefined") return;
  hapticManager.light();
  const w = window as CalendlyWindow;
  if (w.Calendly) {
    w.Calendly.initPopupWidget({ url: CALENDLY_URL });
    return;
  }
  try {
    await ensureCalendlyLoaded();
    (window as CalendlyWindow).Calendly?.initPopupWidget({
      url: CALENDLY_URL,
    });
  } catch {
    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  }
}

export function useCalendly() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as CalendlyWindow).Calendly
    ) {
      setReady(true);
    }
  }, []);

  const openCalendly = useCallback(async () => {
    hapticManager.light();
    if (typeof window === "undefined") return;
    const w = window as CalendlyWindow;
    if (w.Calendly) {
      w.Calendly.initPopupWidget({ url: CALENDLY_URL });
      return;
    }
    try {
      setLoading(true);
      await ensureCalendlyLoaded();
      setReady(true);
      (window as CalendlyWindow).Calendly?.initPopupWidget({
        url: CALENDLY_URL,
      });
    } catch {
      // Fallback: open in new tab
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  }, []);

  return { openCalendly, ready, loading };
}

/* ─────────────────────────────────────────────────────────
   BookCallButton — drop-in button that launches Calendly popup
   ───────────────────────────────────────────────────────── */

export function BookCallButton({
  children,
  className = "",
  variant = "solid",
  icon = true,
}: {
  children?: ReactNode;
  className?: string;
  variant?: "solid" | "ghost";
  icon?: boolean;
}) {
  const { openCalendly, loading } = useCalendly();

  const base =
    "inline-flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 disabled:opacity-60";
  const variants =
    variant === "solid"
      ? "border border-cyan-300/30 bg-cyan-500/10 text-cyan-100 shadow-[0_0_24px_-8px_rgba(34,211,238,0.6)] hover:border-cyan-300/50 hover:bg-cyan-500/15 hover:text-white"
      : "border border-white/10 bg-white/5 text-white/85 hover:border-cyan-300/40 hover:bg-cyan-500/10 hover:text-white";

  return (
    <button
      type="button"
      onClick={openCalendly}
      disabled={loading}
      aria-label="Book a call on Calendly"
      className={`${base} ${variants} ${className}`}
    >
      {icon && <CalendarCheck className="h-4 w-4" />}
      <span>{children ?? (loading ? "loading…" : "Book a call")}</span>
      {!loading && <Sparkles className="h-3 w-3 opacity-70" />}
    </button>
  );
}
