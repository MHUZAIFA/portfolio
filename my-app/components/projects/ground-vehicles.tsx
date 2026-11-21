"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";

/**
 * Airport ground vehicles seen from above, driving through the gaps between the project bays.
 *
 * - A follow-me car leads a baggage tug and its luggage carts around the outside of the bays
 *   (only when there is room beside the grid).
 * - A fuel tanker, catering truck, pushback tug and stairs truck each patrol their own gap between
 *   rows, turning around at the ends.
 *
 * Every route is exclusive, so vehicles never meet each other, and they keep to the lower half of
 * each gap (the trail runs along the middle and the marshallers stand in the upper half).
 */

/** A horizontal lane through a gap between rows (y of the gap's centre line, and its extent). */
export type VehicleLane = { y: number; left: number; right: number };

type Pt = { x: number; y: number };

/** Vehicles drive this far below a gap's centre line (the middle of the lower half). */
const ROAD_DROP = 16;
/** Distance of the outer loop from the edge of the grid. */
const OUTER_GAP = 32;
/** Room needed beside the grid for the outer loop. */
const OUTER_ROOM = 44;
/** Seconds to turn around at the end of a patrol. */
const TURN_TIME = 0.9;

/* ── Shared drawing bits (top view, facing right, centred on 0,0) ─────────────── */

function Headlights({ x, spread }: { x: number; spread: number }) {
  return (
    <g>
      {[-spread, spread].map((y) => (
        <path
          key={y}
          d={`M${x} ${y - 1} L${x + 22} ${y * 1.8 - 6} L${x + 22} ${y * 1.8 + 6} L${x} ${y + 1} Z`}
          fill="url(#gv-beam)"
        />
      ))}
      {[-spread, spread].map((y) => (
        <circle key={`l${y}`} cx={x - 0.3} cy={y} r="0.9" fill="#fef9c3" />
      ))}
    </g>
  );
}

function Taillights({ x, spread }: { x: number; spread: number }) {
  return (
    <g>
      {[-spread, spread].map((y) => (
        <rect key={y} x={x} y={y - 1} width="0.9" height="2" rx="0.4" fill="#ef4444" />
      ))}
    </g>
  );
}

/** Amber beacon on the roof, with its glow washing over the floor. */
function Beacon({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g>
      <circle className="vehicle__beacon-glow" cx={x} cy={y} r="16" fill="url(#gv-amber)" />
      <circle className="vehicle__beacon" cx={x} cy={y} r="1.4" />
    </g>
  );
}

/** Shared gradients and patterns (defined once for all vehicles). */
function VehicleDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <linearGradient id="gv-beam" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(254,249,195,0.5)" />
          <stop offset="1" stopColor="rgba(254,249,195,0)" />
        </linearGradient>
        <radialGradient id="gv-amber">
          <stop offset="0" stopColor="rgba(245,158,11,0.4)" />
          <stop offset="1" stopColor="rgba(245,158,11,0)" />
        </radialGradient>
        {/* Cylinder / roof shading: lit along the middle, darker at the sides */}
        <linearGradient id="gv-silver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#71717a" />
          <stop offset="0.45" stopColor="#fafafa" />
          <stop offset="1" stopColor="#52525b" />
        </linearGradient>
        <linearGradient id="gv-white" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a1a1aa" />
          <stop offset="0.4" stopColor="#ffffff" />
          <stop offset="1" stopColor="#a1a1aa" />
        </linearGradient>
        <linearGradient id="gv-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#991b1b" />
          <stop offset="0.45" stopColor="#f87171" />
          <stop offset="1" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="gv-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#18181b" />
          <stop offset="0.45" stopColor="#52525b" />
          <stop offset="1" stopColor="#09090b" />
        </linearGradient>
        <pattern id="gv-check" width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="#fafafa" />
          <rect width="1.5" height="1.5" fill="#ef4444" />
          <rect x="1.5" y="1.5" width="1.5" height="1.5" fill="#ef4444" />
        </pattern>
        <pattern id="gv-hazard" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="1.5" height="3" fill="#ef4444" />
          <rect x="1.5" width="1.5" height="3" fill="#fafafa" />
        </pattern>
      </defs>
    </svg>
  );
}

/* ── Vehicles ───────────────────────────────────────────── */

type Art = { length: number; width: number; art: ReactNode };

const FOLLOW_ME: Art = {
  length: 22,
  width: 11,
  art: (
    <>
      <Headlights x={11} spread={3.6} />
      <rect x="-11" y="-5.5" width="22" height="11" rx="3.5" fill="url(#gv-white)" />
      <path d="M3 -4.3 L6.5 -3.8 V3.8 L3 4.3 Z" fill="#27272a" />
      <path d="M-7 -4 L-5 -4.3 V4.3 L-7 4 Z" fill="#27272a" />
      {/* Checkered "FOLLOW ME" roof sign */}
      <rect x="-4.5" y="-4" width="7" height="8" rx="0.6" fill="url(#gv-check)" stroke="#18181b" strokeWidth="0.4" />
      <Beacon x={-1} y={0} />
      <Taillights x={-11} spread={3.6} />
    </>
  ),
};

const BAGGAGE_TUG: Art = {
  length: 15,
  width: 10,
  art: (
    <>
      <Headlights x={7.5} spread={3} />
      <rect x="-7.5" y="-5" width="15" height="10" rx="2.5" fill="url(#gv-red)" />
      {/* Open cab: roof frame and seat */}
      <rect x="-5" y="-4" width="7" height="8" rx="1" fill="none" stroke="#e4e4e7" strokeWidth="0.7" />
      <rect x="-3.5" y="-2" width="3" height="4" rx="0.8" fill="#18181b" />
      <Beacon x={-1.5} y={0} />
      <Taillights x={-7.5} spread={3} />
    </>
  ),
};

const LUGGAGE_CART: Art = {
  length: 17,
  width: 10,
  art: (
    <>
      {/* Tow bar to the vehicle in front */}
      <line x1="8.5" y1="0" x2="12" y2="0" stroke="#71717a" strokeWidth="0.9" />
      <rect x="-8.5" y="-5" width="17" height="10" rx="1.2" fill="#27272a" stroke="#71717a" strokeWidth="0.6" />
      <rect x="-7.3" y="-3.8" width="4.6" height="7.6" rx="0.6" fill="#e4e4e7" />
      <rect x="-2.2" y="-3.8" width="4.4" height="4" rx="0.6" fill="#ef4444" />
      <rect x="-2.2" y="0.6" width="4.4" height="3.2" rx="0.6" fill="#a1a1aa" />
      <rect x="2.8" y="-3.8" width="4.4" height="7.6" rx="0.6" fill="#52525b" />
    </>
  ),
};

/** These patrol their own gap between rows. */
const PATROLS: (Art & { name: string; speed: number; phase: number })[] = [
  {
    name: "Fuel tanker",
    length: 40,
    width: 13,
    speed: 34,
    phase: 0.2,
    art: (
      <>
        <Headlights x={20} spread={4.2} />
        {/* Tank: a long cylinder with hatches along the top and a red band */}
        <rect x="-20" y="-6.5" width="29" height="13" rx="4" fill="url(#gv-silver)" />
        <rect x="-20" y="-0.6" width="29" height="1.2" fill="#dc2626" opacity="0.85" />
        {[-14, -6, 2].map((x) => (
          <circle key={x} cx={x} cy="0" r="1.7" fill="#d4d4d8" stroke="#71717a" strokeWidth="0.5" />
        ))}
        {/* Cab */}
        <rect x="10" y="-6" width="10" height="12" rx="2.5" fill="url(#gv-dark)" />
        <path d="M16 -5 L19 -4.2 V4.2 L16 5 Z" fill="#7dd3fc" opacity="0.4" />
        <Beacon x={13} y={0} />
        <Taillights x={-20} spread={4.6} />
      </>
    ),
  },
  {
    name: "Catering truck",
    length: 36,
    width: 13,
    speed: 30,
    phase: 0.65,
    art: (
      <>
        <Headlights x={18} spread={4.2} />
        {/* Box body with roof panels and red stripes */}
        <rect x="-18" y="-6.5" width="25" height="13" rx="1.2" fill="url(#gv-white)" />
        {[-12, -6, 0].map((x) => (
          <line key={x} x1={x} y1="-6.5" x2={x} y2="6.5" stroke="#a1a1aa" strokeWidth="0.4" />
        ))}
        <rect x="-18" y="-6.5" width="25" height="1.4" fill="#dc2626" />
        <rect x="-18" y="5.1" width="25" height="1.4" fill="#dc2626" />
        {/* Cab */}
        <rect x="8" y="-6" width="10" height="12" rx="2.5" fill="url(#gv-red)" />
        <path d="M14 -5 L17 -4.2 V4.2 L14 5 Z" fill="#7dd3fc" opacity="0.4" />
        <Beacon x={10.5} y={0} />
        <Taillights x={-18} spread={4.6} />
      </>
    ),
  },
  {
    name: "Pushback tug",
    length: 24,
    width: 14,
    speed: 24,
    phase: 0.4,
    art: (
      <>
        <Headlights x={12} spread={5} />
        {/* Low, wide, heavy body with hazard-striped bumpers and an offset cab */}
        <rect x="-12" y="-7" width="24" height="14" rx="2.2" fill="url(#gv-dark)" />
        <rect x="9" y="-6.2" width="2.6" height="12.4" fill="url(#gv-hazard)" />
        <rect x="-11.6" y="-6.2" width="2.6" height="12.4" fill="url(#gv-hazard)" />
        <rect x="-3" y="-6" width="8" height="6" rx="1.2" fill="#3f3f46" />
        <path d="M2.5 -5.4 L4.4 -5 V-0.6 L2.5 -0.6 Z" fill="#7dd3fc" opacity="0.45" />
        <Beacon x={0} y={-3} />
        <Taillights x={-12} spread={5} />
      </>
    ),
  },
  {
    name: "Passenger stairs truck",
    length: 38,
    width: 12,
    speed: 28,
    phase: 0.85,
    art: (
      <>
        <Headlights x={19} spread={4} />
        {/* Stairs: treads along the bed, with red handrails either side */}
        <rect x="-19" y="-5" width="28" height="10" rx="1" fill="#3f3f46" />
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={-18 + i * 3} y="-4" width="2.2" height="8" fill="url(#gv-white)" opacity={0.55 + i * 0.05} />
        ))}
        <rect x="-19" y="-5.6" width="28" height="1" rx="0.5" fill="#ef4444" />
        <rect x="-19" y="4.6" width="28" height="1" rx="0.5" fill="#ef4444" />
        {/* Cab */}
        <rect x="9" y="-6" width="10" height="12" rx="2.5" fill="url(#gv-dark)" />
        <path d="M15 -5 L18 -4.2 V4.2 L15 5 Z" fill="#7dd3fc" opacity="0.4" />
        <Beacon x={12} y={0} />
        <Taillights x={-19} spread={4} />
      </>
    ),
  },
];

/** The convoy on the outer loop, front to back, with the distance from the one in front. */
const CONVOY: (Art & { name: string; gap: number })[] = [
  { name: "Follow-me car", gap: 0, ...FOLLOW_ME },
  { name: "Baggage tug", gap: 34, ...BAGGAGE_TUG },
  { name: "Luggage cart", gap: 19, ...LUGGAGE_CART },
  { name: "Luggage cart", gap: 20, ...LUGGAGE_CART },
];
const CONVOY_SPEED = 40;

/* ── Route geometry ────────────────────────────────────── */

type Loop = { pts: Pt[]; dist: number[]; length: number };

/** A closed loop with rounded corners, as a dense polyline with cumulative distances. */
function roundedLoop(corners: Pt[], radius: number): Loop {
  const pts: Pt[] = [];
  corners.forEach((c, i) => {
    const a = corners[(i - 1 + corners.length) % corners.length];
    const b = corners[(i + 1) % corners.length];
    const lenIn = Math.hypot(c.x - a.x, c.y - a.y);
    const lenOut = Math.hypot(b.x - c.x, b.y - c.y);
    const r = Math.min(radius, lenIn / 2, lenOut / 2);
    const from = { x: c.x + ((a.x - c.x) / lenIn) * r, y: c.y + ((a.y - c.y) / lenIn) * r };
    const to = { x: c.x + ((b.x - c.x) / lenOut) * r, y: c.y + ((b.y - c.y) / lenOut) * r };
    for (let k = 0; k <= 10; k++) {
      const t = k / 10;
      const u = 1 - t;
      pts.push({ x: u * u * from.x + 2 * u * t * c.x + t * t * to.x, y: u * u * from.y + 2 * u * t * c.y + t * t * to.y });
    }
  });
  pts.push(pts[0]);
  const dist = [0];
  for (let i = 1; i < pts.length; i++) dist.push(dist[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return { pts, dist, length: dist[dist.length - 1] };
}

/** Position and heading (degrees) at a distance along a loop. */
function along(loop: Loop, s: number) {
  const d = ((s % loop.length) + loop.length) % loop.length;
  let i = 1;
  while (i < loop.dist.length - 1 && loop.dist[i] < d) i++;
  const a = loop.pts[i - 1];
  const b = loop.pts[i];
  const t = (d - loop.dist[i - 1]) / Math.max(0.0001, loop.dist[i] - loop.dist[i - 1]);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
}

const ease = (t: number) => t * t * (3 - 2 * t);

/** Patrol: drive across, turn around, drive back, turn around. */
function patrol(min: number, max: number, speed: number, phase: number, elapsed: number) {
  const drive = Math.max(0.001, (max - min) / speed);
  const cycle = 2 * (drive + TURN_TIME);
  let t = (phase * cycle + elapsed) % cycle;
  if (t < drive) return { x: min + ease(t / drive) * (max - min), angle: 0 };
  t -= drive;
  if (t < TURN_TIME) return { x: max, angle: ease(t / TURN_TIME) * 180 };
  t -= TURN_TIME;
  if (t < drive) return { x: max - ease(t / drive) * (max - min), angle: 180 };
  t -= drive;
  return { x: min, angle: 180 + ease(t / TURN_TIME) * 180 };
}

/* ── Component ─────────────────────────────────────────── */

/** Room around a vehicle's body for its headlight beams and beacon glow. */
const GLOW_PAD = 26;

function Vehicle({ art, name, setRef }: { art: Art; name: string; setRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={setRef} title={name} className="vehicle absolute left-0 top-0 will-change-transform">
      <svg
        viewBox={`${-art.length / 2 - GLOW_PAD} ${-art.width / 2 - GLOW_PAD} ${art.length + 2 * GLOW_PAD} ${art.width + 2 * GLOW_PAD}`}
        width={art.length + 2 * GLOW_PAD}
        height={art.width + 2 * GLOW_PAD}
        style={{ marginLeft: -(art.length / 2 + GLOW_PAD), marginTop: -(art.width / 2 + GLOW_PAD) }}
      >
        {art.art}
      </svg>
    </div>
  );
}

export function GroundVehicles({ lanes, room }: { lanes: VehicleLane[]; room: { left: number; right: number } }) {
  const convoyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const patrolRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Outer loop round the whole grid, only when there's room either side of it
  const hasLoop = lanes.length >= 2 && room.left >= OUTER_ROOM && room.right >= OUTER_ROOM;
  // Patrols use the gaps between rows (not the lanes above the first / below the last row)
  const inner = useMemo(() => lanes.slice(1, -1), [lanes]);
  const patrols = useMemo(() => PATROLS.slice(0, inner.length), [inner]);

  useEffect(() => {
    if (lanes.length === 0) return;
    const first = lanes[0];
    const last = lanes[lanes.length - 1];
    const loop = hasLoop
      ? roundedLoop(
          [
            { x: first.left - OUTER_GAP, y: first.y + ROAD_DROP },
            { x: first.right + OUTER_GAP, y: first.y + ROAD_DROP },
            { x: last.right + OUTER_GAP, y: last.y + ROAD_DROP },
            { x: last.left - OUTER_GAP, y: last.y + ROAD_DROP },
          ],
          22,
        )
      : null;
    // Spread the patrols over the gaps, one per gap
    const lanesFor = patrols.map((_, i) => inner[Math.round((i * (inner.length - 1)) / Math.max(1, patrols.length - 1))]);

    const place = (elapsed: number) => {
      if (loop) {
        let behind = 0;
        CONVOY.forEach((v, i) => {
          behind += v.gap;
          const p = along(loop, elapsed * CONVOY_SPEED - behind + loop.length * 0.1);
          const el = convoyRefs.current[i];
          if (el) el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.angle}deg)`;
        });
      }
      patrols.forEach((v, i) => {
        const lane = lanesFor[i];
        const el = patrolRefs.current[i];
        if (!lane || !el) return;
        const reach = v.length / 2 + 6;
        const p = patrol(lane.left + reach, lane.right - reach, v.speed, v.phase, elapsed);
        el.style.transform = `translate(${p.x}px, ${lane.y + ROAD_DROP}px) rotate(${p.angle}deg)`;
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      place(0);
      return;
    }
    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      place((now - startedAt) / 1000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [lanes, hasLoop, inner, patrols]);

  if (lanes.length === 0) return null;

  return (
    <>
      <VehicleDefs />
      {hasLoop &&
        CONVOY.map((v, i) => (
          <Vehicle
            key={`convoy-${i}`}
            art={v}
            name={v.name}
            setRef={(el) => {
              convoyRefs.current[i] = el;
            }}
          />
        ))}
      {patrols.map((v, i) => (
        <Vehicle
          key={v.name}
          art={v}
          name={v.name}
          setRef={(el) => {
            patrolRefs.current[i] = el;
          }}
        />
      ))}
    </>
  );
}
