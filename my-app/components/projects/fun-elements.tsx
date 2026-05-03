"use client";

import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Sparkles } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";

/* ─────────────────────────────────────────────────────────
   Language Distribution Bar (GitHub-style)
   ───────────────────────────────────────────────────────── */

export type LangSlice = { lang: string; count: number; color: string };

export function LanguageBar({
  data,
  total,
  onFilter,
}: {
  data: LangSlice[];
  total: number;
  onFilter?: (lang: string) => void;
}) {
  const [hover, setHover] = useState<LangSlice | null>(null);

  const sorted = useMemo(
    () => [...data].sort((a, b) => b.count - a.count),
    [data],
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Tooltip bar */}
      <div className="flex min-h-[18px] items-center justify-between font-mono text-[10px] text-white/50 sm:text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-white/25">{"//"}</span>
          <span>language distribution</span>
          <span className="hidden text-white/30 sm:inline">
            · across {total} projects
          </span>
        </div>
        <AnimatePresence mode="wait">
          {hover && (
            <motion.span
              key={hover.lang}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.12 }}
              className="flex items-center gap-1.5 tabular-nums text-white/80"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: hover.color }}
              />
              <span>{hover.lang}</span>
              <span className="text-white/35">
                {hover.count} · {((hover.count / total) * 100).toFixed(0)}%
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* The segmented bar */}
      <div className="relative flex h-2.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
        {sorted.map((d, i) => {
          const pct = (d.count / total) * 100;
          return (
            <motion.button
              key={d.lang}
              type="button"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{
                duration: 0.9,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseEnter={() => setHover(d)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(d)}
              onBlur={() => setHover(null)}
              onClick={() => {
                onFilter?.(d.lang);
                hapticManager.light();
              }}
              aria-label={`${d.lang}: ${d.count} projects`}
              className="group relative h-full cursor-pointer outline-none transition-[filter] hover:brightness-125 focus-visible:brightness-150"
              style={{ backgroundColor: d.color }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-px bg-[#0a0a0c]/70"
              />
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="-mx-1 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 font-mono text-[10px] text-white/55 sm:text-[11px]">
        {sorted.map((d) => (
          <motion.button
            key={d.lang}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              onFilter?.(d.lang);
              hapticManager.light();
            }}
            onMouseEnter={() => setHover(d)}
            onMouseLeave={() => setHover(null)}
            className="inline-flex items-center gap-1.5 rounded px-1 py-0.5 transition-colors hover:text-white"
          >
            <span
              className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
              style={{
                backgroundColor: d.color,
                boxShadow: `0 0 6px ${d.color}`,
              }}
            />
            <span>{d.lang}</span>
            <span className="tabular-nums text-white/35">
              {((d.count / total) * 100).toFixed(0)}%
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Keyboard Shortcuts Overlay (? to toggle)
   ───────────────────────────────────────────────────────── */

export type Shortcut = { keys: string[]; desc: string; group?: string };

export function ShortcutsOverlay({
  open,
  onClose,
  shortcuts,
}: {
  open: boolean;
  onClose: () => void;
  shortcuts: Shortcut[];
}) {
  const grouped = useMemo(() => {
    const m = new Map<string, Shortcut[]>();
    shortcuts.forEach((s) => {
      const g = s.group ?? "General";
      if (!m.has(g)) m.set(g, []);
      m.get(g)!.push(s);
    });
    return m;
  }, [shortcuts]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0c]/95 shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-sm text-white/80">
                <Keyboard className="h-4 w-4 text-cyan-300" />
                <span>Keyboard shortcuts</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-md p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              <div className="grid gap-5">
                {[...grouped.entries()].map(([group, items]) => (
                  <div key={group}>
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {group}
                    </div>
                    <ul className="space-y-1.5">
                      {items.map((s, i) => (
                        <li
                          key={`${group}-${i}`}
                          className="flex items-center justify-between gap-4 font-mono text-xs text-white/70"
                        >
                          <span>{s.desc}</span>
                          <div className="flex shrink-0 items-center gap-1">
                            {s.keys.map((k, ki) => (
                              <span key={ki} className="flex items-center gap-1">
                                <kbd className="min-w-[24px] rounded-md border border-white/15 bg-white/10 px-1.5 py-0.5 text-center text-[11px] font-medium text-white/85 shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]">
                                  {k}
                                </kbd>
                                {ki < s.keys.length - 1 && (
                                  <span className="text-white/30">+</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-4 py-2 font-mono text-[10px] text-white/40">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-300" />
                tip: the portfolio is keyboard-first
              </span>
              <span>
                press{" "}
                <kbd className="rounded border border-white/15 bg-white/10 px-1 py-0.5 text-[10px]">
                  ?
                </kbd>{" "}
                anytime
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   Persona Picker — accent theme for audience
   ───────────────────────────────────────────────────────── */

export type PersonaId = "coder" | "architect" | "ai" | "designer";

export const PERSONAS: {
  id: PersonaId;
  label: string;
  emoji: string;
  accent: string;
  accentRgb: string;
  tag: string;
}[] = [
  {
    id: "coder",
    label: "Coder",
    emoji: "</>",
    accent: "#22d3ee",
    accentRgb: "34,211,238",
    tag: "ship. repeat.",
  },
  {
    id: "architect",
    label: "Architect",
    emoji: "◇",
    accent: "#a78bfa",
    accentRgb: "167,139,250",
    tag: "systems thinker",
  },
  {
    id: "ai",
    label: "AI / ML",
    emoji: "✺",
    accent: "#34d399",
    accentRgb: "52,211,153",
    tag: "models & magic",
  },
  {
    id: "designer",
    label: "Designer",
    emoji: "✶",
    accent: "#f472b6",
    accentRgb: "244,114,182",
    tag: "pixels that feel",
  },
];

export function PersonaPicker({
  value,
  onChange,
}: {
  value: PersonaId;
  onChange: (v: PersonaId) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 font-mono text-[10px] text-white/50 sm:text-[11px]">
        <span className="text-white/25">{"//"}</span>
        <span>who&apos;s reading?</span>
        <span className="hidden text-white/30 sm:inline">
          — pick a vibe, the palette follows
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PERSONAS.map((p) => {
          const active = value === p.id;
          return (
            <motion.button
              key={p.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onChange(p.id);
                hapticManager.light();
              }}
              className={`group relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-all sm:text-xs ${
                active
                  ? "text-white"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              }`}
              style={
                active
                  ? {
                      borderColor: `rgba(${p.accentRgb},0.45)`,
                      backgroundColor: `rgba(${p.accentRgb},0.1)`,
                      boxShadow: `0 0 24px -6px rgba(${p.accentRgb},0.55)`,
                    }
                  : undefined
              }
              aria-pressed={active}
            >
              <span
                className="font-mono text-sm"
                style={{ color: active ? p.accent : undefined }}
              >
                {p.emoji}
              </span>
              <span>{p.label}</span>
              <span className="hidden text-[9px] text-white/40 sm:inline">
                · {p.tag}
              </span>
              {active && (
                <motion.span
                  layoutId="persona-ring"
                  className="pointer-events-none absolute -inset-px rounded-full"
                  style={{
                    boxShadow: `inset 0 0 0 1px rgba(${p.accentRgb},0.3)`,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Small: Section header with terminal flavor
   ───────────────────────────────────────────────────────── */

export function SectionHeader({
  num,
  label,
  note,
  icon,
}: {
  num: string;
  label: string;
  note?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-2 font-mono">
      <div className="flex items-baseline gap-2.5">
        <span className="text-[10px] text-white/25">{num}</span>
        {icon && <span className="text-cyan-300/80">{icon}</span>}
        <h2 className="text-sm font-semibold tracking-tight text-white/90 sm:text-base">
          {label}
        </h2>
      </div>
      {note && <span className="text-[10px] text-white/40">{note}</span>}
    </div>
  );
}
