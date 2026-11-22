"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Next departure": a runway in perspective at night. Edge lights line it, centreline lights chase
 * toward the horizon, and the actions are airfield signs in front of it. Pressing one clears an
 * airliner for takeoff: it rolls down the runway, lifts off into the distance, and the action runs.
 */

export type Departure = {
  /** Runway / sign code shown in the sign's first box */
  code: string;
  label: string;
  /** "mandatory" = red airfield sign (primary), "info" = black sign */
  tone: "mandatory" | "info";
  /** Plays the takeoff before running */
  takeoff: boolean;
  run: () => void;
};

/** Seconds from brakes release to the action running (the plane is airborne by then). */
const TAKEOFF_ACTION_AT = 1.5;
/** Seconds until the next aircraft lines up. */
const TAKEOFF_RESET_AT = 2.8;

const EDGE_LIGHTS = 22;
const CENTRE_LIGHTS = 26;

function Airliner() {
  // Top view, nose up
  return (
    <svg viewBox="0 0 80 84" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="tr-body" x1="0" x2="1">
          <stop offset="0" stopColor="#a1a1aa" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#a1a1aa" />
        </linearGradient>
        <linearGradient id="tr-wing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e4e4e7" />
          <stop offset="1" stopColor="#71717a" />
        </linearGradient>
      </defs>
      {/* Wings */}
      <path d="M40 30 L4 50 L4 55 L40 44 L76 55 L76 50 Z" fill="url(#tr-wing)" />
      {/* Engines */}
      <rect x="18" y="40" width="5" height="10" rx="2" fill="#52525b" />
      <rect x="57" y="40" width="5" height="10" rx="2" fill="#52525b" />
      {/* Tailplane */}
      <path d="M40 70 L26 79 L26 82 L40 78 L54 82 L54 79 Z" fill="url(#tr-wing)" />
      {/* Fuselage */}
      <rect x="35.5" y="4" width="9" height="78" rx="4.5" fill="url(#tr-body)" />
      {/* Cockpit windows and a red tail */}
      <path d="M37.5 9 Q40 6.5 42.5 9 L42 11 H38 Z" fill="#18181b" />
      <rect x="38.5" y="70" width="3" height="11" rx="1.5" fill="#ef4444" />
      {/* Nav lights: red left, green right, white strobes */}
      <circle className="tr-nav" cx="4.5" cy="52.5" r="1.6" fill="#ef4444" />
      <circle className="tr-nav" cx="75.5" cy="52.5" r="1.6" fill="#22c55e" />
      <circle className="tr-strobe" cx="40" cy="83" r="1.3" fill="#fff" />
    </svg>
  );
}

export function TakeoffRunway({ departures }: { departures: Departure[] }) {
  const [rolling, setRolling] = useState(false);
  // The runway in use: whichever sign is hovered (or departing), else the first
  const [hovered, setHovered] = useState<string | null>(null);
  const [departing, setDeparting] = useState<string | null>(null);
  const runway = departing ?? hovered ?? departures.find((d) => d.takeoff)?.code ?? "27L";
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const depart = (d: Departure) => {
    if (!d.takeoff) {
      d.run();
      return;
    }
    if (rolling) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      d.run();
      return;
    }
    setRolling(true);
    setDeparting(d.code);
    timers.current.push(setTimeout(d.run, TAKEOFF_ACTION_AT * 1000));
    timers.current.push(
      setTimeout(() => {
        setRolling(false);
        setDeparting(null);
      }, TAKEOFF_RESET_AT * 1000),
    );
  };

  return (
    <div className="pt-8">
      {/* The runway */}
      <div className="tr-scene relative h-[260px] overflow-hidden sm:h-[320px]">
        {/* Horizon glow */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-2/3"
          style={{ background: "radial-gradient(55% 90% at 50% 0%, rgba(239,68,68,0.16), transparent 70%)" }}
        />
        <div aria-hidden="true" className="tr-runway absolute bottom-0 left-1/2">
          {/* Threshold "piano keys" and the runway number */}
          <div className="absolute inset-x-[10%] bottom-[3%] flex h-[7%] justify-between">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="h-full w-[7%] bg-white/70" />
            ))}
          </div>
          {/* Repainted (with a quick flip) whenever another runway is picked */}
          <span
            key={runway}
            className="tr-number absolute bottom-[11%] left-1/2 -translate-x-1/2 font-mono text-[64px] font-black leading-none text-white/60"
          >
            {runway}
          </span>
          {/* Touchdown zone bars */}
          {[0.32, 0.42].map((y) => (
            <div key={y} className="absolute inset-x-[22%] flex justify-between" style={{ bottom: `${y * 100}%` }}>
              <span className="h-10 w-[18%] bg-white/45" />
              <span className="h-10 w-[18%] bg-white/45" />
            </div>
          ))}
          {/* Centreline: painted dashes and inset lights chasing toward the horizon */}
          <div className="absolute inset-y-[22%] left-1/2 w-[3px] -translate-x-1/2 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.55)_0_28px,transparent_28px_52px)]" />
          {Array.from({ length: CENTRE_LIGHTS }, (_, i) => (
            <span
              key={`c${i}`}
              className="tr-centre absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
              style={{ bottom: `${20 + (i / CENTRE_LIGHTS) * 79}%`, animationDelay: `${(i / CENTRE_LIGHTS) * 1.6}s` }}
            />
          ))}
          {/* Edge lights */}
          {Array.from({ length: EDGE_LIGHTS }, (_, i) =>
            (["left-[2%]", "right-[2%]"] as const).map((side) => (
              <span
                key={`${side}${i}`}
                className={`tr-edge absolute h-2.5 w-2.5 rounded-full ${side} ${i < 2 ? "tr-edge--threshold" : ""}`}
                style={{ bottom: `${2 + (i / EDGE_LIGHTS) * 97}%` }}
              />
            )),
          )}

          {/* The aircraft (and its shadow), lined up on the centreline */}
          <div className={`tr-shadow absolute bottom-[16%] left-1/2 h-[92px] w-[88px] ${rolling ? "is-rolling" : ""}`} />
          <div className={`tr-plane absolute bottom-[16%] left-1/2 h-[92px] w-[88px] ${rolling ? "is-rolling" : ""}`}>
            <Airliner />
          </div>
        </div>
        {/* Fade the far end into the night */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black to-transparent" />
      </div>

      {/* Airfield signs */}
      <div className="relative -mt-6 flex flex-wrap items-end justify-center gap-x-6 gap-y-5 sm:-mt-8">
        {departures.map((d) => (
          <button
            key={d.label}
            type="button"
            onClick={() => depart(d)}
            onPointerEnter={() => d.takeoff && setHovered(d.code)}
            onPointerLeave={() => setHovered(null)}
            onFocus={() => d.takeoff && setHovered(d.code)}
            onBlur={() => setHovered(null)}
            disabled={d.takeoff && rolling}
            className="group flex flex-col items-center"
          >
            <span className={`tr-sign ${d.tone === "mandatory" ? "tr-sign--mandatory" : "tr-sign--info"}`}>
              <span className="tr-sign__code">{d.code}</span>
              <span className="tr-sign__label">{d.label}</span>
            </span>
            {/* Sign legs */}
            <span aria-hidden="true" className="flex w-3/5 justify-between">
              <span className="h-3 w-1 bg-zinc-600" />
              <span className="h-3 w-1 bg-zinc-600" />
            </span>
          </button>
        ))}
      </div>

      {/* Tower status line */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
          TWR <span className="text-white/70">118.70</span>
        </span>
        <span>
          RWY <span className="text-white/70">{runway}</span>
        </span>
        <span>
          Wind <span className="text-white/70">270/08</span>
        </span>
        <span className={rolling ? "text-red-300" : "text-white/60"}>
          {rolling ? "Cleared for takeoff" : "Holding short · ready when you are"}
        </span>
      </div>
    </div>
  );
}
