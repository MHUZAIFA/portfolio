"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { Airport, Telemetry } from "./flight-scene";
import { distanceKm, type Cluster, type RouteStop } from "./route";

// Generic background traffic for atmosphere (real airports, not any airline's network).
const ap = (code: string, lat: number, lon: number): Airport => ({ code, city: code, lat, lon });
const TRAFFIC: [Airport, Airport][] = [
  [ap("YYZ", 43.68, -79.62), ap("LHR", 51.47, -0.45)],
  [ap("YVR", 49.2, -123.18), ap("NRT", 35.77, 140.39)],
  [ap("CDG", 49.01, 2.55), ap("DXB", 25.25, 55.37)],
  [ap("FRA", 50.04, 8.56), ap("DEL", 28.56, 77.1)],
  [ap("YYZ", 43.68, -79.62), ap("GRU", -23.44, -46.47)],
  [ap("LHR", 51.47, -0.45), ap("JFK", 40.64, -73.78)],
];

const ACCENT = 0xf87171; // red-400, matches the Experience page
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const PHASE: Record<Telemetry["phase"], string> = {
  boarding: "Boarding",
  climb: "Climbing",
  cruise: "Cruising",
  descent: "Descending",
  layover: "Landed",
  arrived: "Arrived",
};

const fmt = (n: number) => n.toLocaleString("en-US");

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, delay, ease: EASE_OUT },
});

/**
 * Route map (three.js): the plane flies between the places I've worked, built from the Experience
 * entries. Nearby stops (Mumbai → Thane → Navi Mumbai) get a zoomed-in view before the long haul.
 */
export function ExperienceRouteSection({ stops, clusters, children }: { stops: RouteStop[]; clusters: Cluster[]; children?: ReactNode }) {
  const globeRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const routeKey = stops.map((s) => `${s.lat},${s.lon}`).join(">");

  useEffect(() => {
    const container = globeRef.current;
    if (!container || stops.length === 0) return;
    let scene: { start(): void; stop(): void; dispose(): void } | null = null;
    let visible = false;
    let cancelled = false;
    let loading = false;

    const load = async () => {
      if (loading) return;
      loading = true;
      try {
        // three.js is code-split: it only downloads when the globe is about to be seen.
        const { createFlightScene } = await import("./flight-scene");
        if (cancelled) return;
        scene = createFlightScene(container, {
          stops,
          clusters,
          traffic: TRAFFIC,
          accent: ACCENT,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          onTelemetry: setTelemetry,
        });
        setReady(true);
        if (visible) scene.start();
      } catch {
        // WebGL unavailable: the page still works without the globe.
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (!scene) load();
          else scene.start();
        } else {
          scene?.stop();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(container);

    return () => {
      cancelled = true;
      io.disconnect();
      scene?.dispose();
    };
    // Rebuild only if the route itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  if (stops.length === 0) return null;
  const first = stops[0];
  const last = stops[stops.length - 1];
  const t = telemetry;
  const next = t ? t.nextStop : 0;
  const onGround = !t || t.phase === "boarding" || t.phase === "layover" || t.phase === "arrived";
  const here = t && (t.phase === "layover" || t.phase === "arrived") ? next : t?.phase === "boarding" ? next - 1 : -1;
  const legText = !t
    ? `${first.city} → ${stops[1]?.city ?? first.city}`
    : here >= 0
      ? stops[here].city
      : `${stops[Math.max(0, next - 1)].city} → ${stops[next].city}`;
  // Where each stop sits along the whole route, for the progress ticks.
  const cumulative = stops.map((_, i) => stops.slice(1, i + 1).reduce((km, s, j) => km + distanceKm(stops[j], s), 0));
  const totalKm = cumulative[cumulative.length - 1] || 1;

  return (
    <section aria-label="Route map" className="relative mb-12 lg:mb-16">
      {/*
        lg+: intro + instruments stacked on the left, a large globe on the right
        mobile: intro, globe, instruments (DOM order)
      */}
      <div className="grid items-center gap-10 lg:min-h-[calc(100svh_-_5rem)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:content-center lg:gap-x-12 lg:gap-y-6">
        {/* Intro */}
        <div className="min-w-0 text-left lg:col-start-1 lg:row-start-1 lg:self-end">
          {children ?? (
            <motion.h2 {...reveal(0)} className="text-4xl font-semibold leading-[1.05] text-white md:text-5xl">
              {first.city} to {last.city}.
            </motion.h2>
          )}
        </div>

        {/* Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
          className="relative mx-auto aspect-square w-full max-w-[620px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-[min(100%,780px,calc(100svh_-_7rem))] lg:max-w-none"
        >
          <div
            ref={globeRef}
            aria-hidden="true"
            // Round "porthole" edge: the canvas never shows a square, even when zoomed into a region.
            style={{ maskImage: "radial-gradient(closest-side, #000 86%, transparent 100%)", WebkitMaskImage: "radial-gradient(closest-side, #000 86%, transparent 100%)" }}
            className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
          />
          <p className="pointer-events-none absolute bottom-2 left-1/2 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 md:block">
            Drag to spin
          </p>
        </motion.div>

        {/* Instruments. Fixed sizes throughout so live data never reflows the layout. */}
        <div className="min-w-0 text-left lg:col-start-1 lg:row-start-2 lg:self-start">
          {/* Flight panel */}
          <motion.div
            {...reveal(0.2)}
            className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-[#111] to-[#050505] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            aria-label="Live flight"
          >
            <div className="flex h-12 items-center gap-3 border-b border-white/5 px-4">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                {!onGround && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${onGround ? "bg-white/40" : "bg-red-400"}`} />
              </span>
              <span className="w-24 shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-white">{t ? PHASE[t.phase] : "Standby"}</span>
              <span className="min-w-0 flex-1 truncate text-right font-mono text-xs text-white/55">{legText}</span>
            </div>
            <dl className="grid grid-cols-3 divide-x divide-white/5">
              <Readout label="Next stop" value={t ? `${fmt(t.distanceToNextKm)} km` : "—"} />
              <Readout label="Altitude" value={t ? `${fmt(t.altitudeFt)} ft` : "—"} />
              <Readout label="Speed" value={t ? `${t.groundSpeedKt} kt` : "—"} />
            </dl>
            {/* Route progress with a tick per stop */}
            <div className="relative h-1 bg-white/5" aria-hidden="true">
              <div className="absolute inset-y-0 left-0 bg-linear-to-r from-red-500/40 to-red-300" style={{ width: `${(t?.progress ?? 0) * 100}%` }} />
              {cumulative.slice(1, -1).map((km, i) => (
                <span key={i} className="absolute inset-y-0 w-px bg-black/80" style={{ left: `${(km / totalKm) * 100}%` }} />
              ))}
            </div>
          </motion.div>

          {/* Itinerary */}
          <motion.ol {...reveal(0.3)} className="mt-5" aria-label="Route stops">
            {stops.map((s, i) => {
              const isLast = i === stops.length - 1;
              const visited = t ? i < next || i === here : false;
              const active = t ? i === (here >= 0 ? here : next) : false;
              return (
                <li key={`${s.city}-${i}`} className="relative grid h-11 grid-cols-[1.25rem_1fr_auto] items-center gap-3 [@media(max-height:780px)]:h-8">
                  {/* rail */}
                  {i < stops.length - 1 && (
                    <span
                      className={`absolute left-[0.5625rem] top-1/2 h-11 w-px [@media(max-height:780px)]:h-8 ${visited && i < next ? "bg-red-400/60" : "bg-white/12"}`}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative flex h-5 items-center justify-center" aria-hidden="true">
                    <span
                      className={`h-2.5 w-2.5 rounded-full border transition-colors duration-300 ${
                        active
                          ? "border-red-300 bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.7)]"
                          : visited
                            ? "border-red-400/70 bg-red-400/70"
                            : "border-white/40 bg-black"
                      }`}
                    />
                  </span>
                  {/* Short screens: city and companies on one line so the column fits beside the globe */}
                  <span className="min-w-0 [@media(max-height:780px)]:truncate">
                    <span className={`block truncate text-sm font-medium [@media(max-height:780px)]:inline ${isLast ? "text-red-200" : active ? "text-white" : "text-white/80"}`}>
                      {s.city}
                    </span>
                    <span
                      className="block truncate text-xs text-white/45 [@media(max-height:780px)]:ml-2 [@media(max-height:780px)]:inline"
                      title={s.companies.map((c, j) => `${s.roles[j].join(" → ")} · ${c}`).join("\n")}
                    >
                      {s.companies.map((c, j) => (
                        <span key={c}>
                          {j > 0 && " · "}
                          <span className="text-white/65">{s.roles[j].join(" → ")}</span>
                          {" @ "}
                          {c}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className={`font-mono text-xs tabular-nums ${isLast ? "text-red-300/80" : "text-white/40"}`}>{s.years}</span>
                </li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="h-[4.5rem] min-w-0 px-4 py-3">
      <dt className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</dt>
      <dd className="mt-1.5 truncate font-mono text-sm tabular-nums text-white">{value}</dd>
    </div>
  );
}
