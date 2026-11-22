"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { InteractiveTerminal, type TerminalProject } from "@/components/projects/interactive-terminal";

/**
 * "Take the controls" as a glass-cockpit head-up display:
 * - a heading tape, comms status and a live UTC clock across the top
 * - a radar whose contacts are the projects (closer to the centre = more recent); the sweep lights
 *   each one as it passes, hovering shows its details, clicking runs `cat <project>`
 * - the terminal as the comms log, with a command bar of quick actions underneath
 */

type Quick = { label: string; cmd: string };

const QUICK: Quick[] = [
  { label: "Whoami", cmd: "whoami" },
  { label: "Stack", cmd: "stack" },
  { label: "Projects", cmd: "ls" },
  { label: "Contact", cmd: "contact" },
  { label: "Book a call", cmd: "book" },
];
const EXEC: Quick = { label: "Hire me", cmd: "sudo hireme" };

/** Seconds for one turn of the radar sweep. */
const SWEEP = 4;
const RADAR_R = 140;

/**
 * Round SVG coordinates: trig results can differ in the last digit between the server and the
 * browser, which would make hydration fail.
 */
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Small deterministic hash, so each project keeps its bearing between visits. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

type Contact = TerminalProject & { bearing: number; range: number; x: number; y: number };

function useContacts(projects: TerminalProject[]): Contact[] {
  return useMemo(() => {
    const byDate = [...projects].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const n = Math.max(1, byDate.length);
    return byDate.map((p, i) => {
      // Spread bearings evenly, nudged per project so it doesn't look like a clock face
      const bearing = (i * (360 / n) + hash(p.id) * (300 / n) + 17) % 360;
      const range = 0.28 + (i / Math.max(1, n - 1)) * 0.62; // newest closest
      const rad = ((bearing - 90) * Math.PI) / 180;
      return { ...p, bearing, range, x: r2(Math.cos(rad) * range * RADAR_R), y: r2(Math.sin(rad) * range * RADAR_R) };
    });
  }, [projects]);
}

function UtcClock() {
  const [now, setNow] = useState<string>("--:--:--");
  useEffect(() => {
    const tick = () => setNow(new Date().toISOString().slice(11, 19));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return <span className="tabular-nums">{now}Z</span>;
}

/** Scrolling heading tape with a fixed caret. */
function HeadingTape() {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <div className="relative h-7 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)]">
      <div className="hud-tape absolute left-0 top-0 flex h-full">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex h-full">
            {ticks.map((deg) => (
              <div key={deg} className="relative h-full w-3 shrink-0">
                <span
                  className={`absolute bottom-0 left-0 w-px bg-white/40 ${deg % 30 === 0 ? "h-2.5" : deg % 10 === 0 ? "h-1.5" : "h-1"}`}
                />
                {deg % 30 === 0 && (
                  <span className="absolute left-0 top-0 -translate-x-1/2 font-mono text-[9px] text-white/50">
                    {String(deg / 10).padStart(2, "0")}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <span aria-hidden="true" className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.9)]" />
    </div>
  );
}

function Radar({
  contacts,
  selected,
  onHover,
  onPick,
}: {
  contacts: Contact[];
  selected: string | null;
  onHover: (id: string | null) => void;
  onPick: (c: Contact) => void;
}) {
  const size = RADAR_R * 2 + 20;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px]">
      {/* Sweep */}
      {/* Clipped to the circle: the spinning square's corners would otherwise poke out and widen the page */}
      <div aria-hidden="true" className="absolute inset-[3.3%] overflow-hidden rounded-full">
        <div className="hud-sweep absolute inset-0" style={{ animationDuration: `${SWEEP}s` }} />
      </div>

      <svg viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} className="absolute inset-0 h-full w-full overflow-visible">
        {/* Range rings and crosshair */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <circle key={r} r={r * RADAR_R} fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray={r === 1 ? undefined : "2 4"} />
        ))}
        <line x1={-RADAR_R} x2={RADAR_R} y1="0" y2="0" stroke="rgba(255,255,255,0.08)" />
        <line y1={-RADAR_R} y2={RADAR_R} x1="0" x2="0" stroke="rgba(255,255,255,0.08)" />
        {/* Bearing ticks */}
        {Array.from({ length: 36 }, (_, i) => {
          const a = ((i * 10 - 90) * Math.PI) / 180;
          const outer = RADAR_R;
          const inner = RADAR_R - (i % 3 === 0 ? 7 : 4);
          return (
            <line
              key={i}
              x1={r2(Math.cos(a) * outer)}
              y1={r2(Math.sin(a) * outer)}
              x2={r2(Math.cos(a) * inner)}
              y2={r2(Math.sin(a) * inner)}
              stroke="rgba(255,255,255,0.3)"
            />
          );
        })}
        {[
          ["N", 0, -RADAR_R - 9],
          ["E", RADAR_R + 9, 0],
          ["S", 0, RADAR_R + 9],
          ["W", -RADAR_R - 9, 0],
        ].map(([l, x, y]) => (
          <text
            key={l as string}
            x={x as number}
            y={y as number}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white/45 font-mono text-[9px]"
          >
            {l}
          </text>
        ))}
        {/* Own aircraft */}
        <path d="M0 -6 L4 5 L0 3 L-4 5 Z" fill="#f87171" />

        {/* Contacts */}
        {contacts.map((c) => {
          const isSel = selected === c.id;
          return (
            <g
              key={c.id}
              transform={`translate(${c.x} ${c.y})`}
              className="cursor-pointer"
              onPointerEnter={() => onHover(c.id)}
              onPointerLeave={() => onHover(null)}
              onClick={() => onPick(c)}
              role="button"
              aria-label={`Inspect ${c.name}`}
            >
              <circle r="12" fill="transparent" />
              <circle
                r={c.featured ? 4 : 3}
                className="hud-blip"
                style={{ animationDuration: `${SWEEP}s`, animationDelay: `${r2((c.bearing / 360) * SWEEP - SWEEP)}s` }}
              />
              {isSel && (
                <g stroke="#fca5a5" strokeWidth="1" fill="none">
                  <path d="M-9 -5 V-9 H-5 M5 -9 H9 V-5 M9 5 V9 H5 M-5 9 H-9 V5" />
                </g>
              )}
              {isSel && (
                <text x="12" y="-8" className="fill-white font-mono text-[9px]">
                  {c.name.length > 18 ? `${c.name.slice(0, 17)}…` : c.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function HudConsole({ projects, onTriggerMatrix }: { projects: TerminalProject[]; onTriggerMatrix?: () => void }) {
  const runRef = useRef<((cmd: string) => void) | null>(null);
  const contacts = useContacts(projects);
  const [hovered, setHovered] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [last, setLast] = useState<string>("—");

  const focus = hovered ?? picked;
  const focused = contacts.find((c) => c.id === focus) ?? null;

  const run = (cmd: string) => runRef.current?.(cmd);

  return (
    // Flat: no panel, cards or borders, just HUD elements on the page separated by space
    <div className="relative">
      {/* Top bar: comms, heading tape, clock */}
      <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
        <span className="flex shrink-0 items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.9)]" />
          Comms <span className="text-white/80">online</span>
        </span>
        <div className="hidden flex-1 items-center gap-3 sm:flex">
          <HeadingTape />
        </div>
        <span className="ml-auto shrink-0 text-white/70 sm:ml-0">
          <UtcClock />
        </span>
      </div>

      <div className="grid gap-10 py-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
        {/* Radar + contact readout */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span>Radar</span>
            <span>
              {contacts.length} contacts · <span className="text-white/60">range = age</span>
            </span>
          </div>
          <Radar
            contacts={contacts}
            selected={focus}
            onHover={setHovered}
            onPick={(c) => {
              setPicked(c.id);
              run(`cat ${c.id}`);
            }}
          />
          <div className="min-h-[72px]">
            {focused ? (
              <>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-red-300/80">
                  Contact · {focused.category ?? "project"}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-white">{focused.name}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-white/50">{focused.description}</p>
              </>
            ) : (
              <>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">No contact selected</p>
                <p className="mt-1 text-xs text-white/50">Hover a blip on the radar to identify it. Click to open its file.</p>
              </>
            )}
          </div>
        </div>

        {/* Comms log (the terminal) */}
        <div className="hud-screen flex min-w-0 flex-col">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span>Comms log</span>
            <span className="truncate pl-3">
              cmds <span className="text-white/70">{count}</span> · last <span className="text-red-300">{last}</span>
            </span>
          </div>
          <InteractiveTerminal
            projects={projects}
            onTriggerMatrix={onTriggerMatrix}
            variant="hud"
            runRef={runRef}
            onRun={(cmd) => {
              setCount((n) => n + 1);
              setLast(cmd.split(" ")[0]);
            }}
          />
        </div>
      </div>

      {/* Command bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:inline">Quick</span>
        {QUICK.map((q) => (
          <button key={q.cmd} type="button" onClick={() => run(q.cmd)} className="hud-chip">
            {q.label}
          </button>
        ))}
        <button type="button" onClick={() => run(EXEC.cmd)} className="hud-chip hud-chip--exec ml-auto">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
          {EXEC.label}
        </button>
      </div>
    </div>
  );
}
