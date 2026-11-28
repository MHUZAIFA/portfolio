"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gameBus, INTRO_TIMELINE, onIntroStart, pushBlast } from "@/lib/game-bus";

/**
 * Hero canvas: a 3D starfield plus the hero name rebuilt from particles.
 * - Particles assemble into the name once the intro finishes.
 * - The cursor stirs them like fluid; clicking empty space fires a shockwave.
 * - While the space shooter runs, lasers slice through the letters, meteors shove
 *   them aside, and kills/crashes blow them apart. The stars jump to warp on launch.
 *
 * The real <h1> stays in the DOM (for layout, SEO and screen readers); its letters are
 * made transparent once `onReady` fires, so if anything fails the plain text remains.
 */

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  nameRef: RefObject<HTMLElement | null>;
  gameActive: boolean;
  onReady?: () => void;
};

const MAX_PARTICLES = 6000;
const SPRING = 0.055;
const DAMPING = 0.86;
/** Seconds each particle takes to travel from deep space into the letter. */
const INTRO = 1.5;
/** Max random head start between particles, for a staggered, organic arrival. */
const INTRO_STAGGER = INTRO_TIMELINE.nameLands - INTRO;
/** Landing shockwave: seconds to cross the name, and the band width (px) it pushes. */
const WAVE_DURATION = 0.75;
const WAVE_BAND = 46;
const INTRO_LEVELS = 6;
const MAX_STARS = 400;
const STAR_LEVELS = 6;

/** Time-based, so dropped frames never cause a jump; zero velocity at both ends for a seamless hand-off. */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Field = {
  count: number;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  hx: Float32Array;
  hy: Float32Array;
  delay: Float32Array;
  /** Starting perspective scale (1/depth) for the warp-in. */
  s0: Float32Array;
  /** 3D offset from home at the start of the warp-in; shrinks to 0 on arrival. */
  ox: Float32Array;
  oy: Float32Array;
  /** Intro progress 0..1 (eased). */
  prog: Float32Array;
  landed: Uint8Array;
  size: number;
};

type Stars = {
  count: number;
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
};

function createField(capacity: number): Field {
  return {
    count: 0,
    x: new Float32Array(capacity),
    y: new Float32Array(capacity),
    vx: new Float32Array(capacity),
    vy: new Float32Array(capacity),
    hx: new Float32Array(capacity),
    hy: new Float32Array(capacity),
    delay: new Float32Array(capacity),
    s0: new Float32Array(capacity),
    ox: new Float32Array(capacity),
    oy: new Float32Array(capacity),
    prog: new Float32Array(capacity),
    landed: new Uint8Array(capacity),
    size: 2,
  };
}

function createStars(count: number): Stars {
  const stars: Stars = {
    count,
    x: new Float32Array(count),
    y: new Float32Array(count),
    z: new Float32Array(count),
  };
  for (let i = 0; i < count; i++) {
    stars.x[i] = (Math.random() * 2 - 1) * 1.4;
    stars.y[i] = (Math.random() * 2 - 1) * 1.4;
    stars.z[i] = Math.random() * 0.98 + 0.02;
  }
  return stars;
}

/** Position of `el` inside `ancestor`, ignoring CSS transforms (so entrance/scroll animations don't skew sampling). */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return node === ancestor ? { x, y } : null;
}

/** Rasterise each [data-letter] span offscreen and return particle home positions. */
function sampleName(nameEl: HTMLElement, sectionEl: HTMLElement) {
  const letters = Array.from(nameEl.querySelectorAll<HTMLElement>("[data-letter]"));
  if (letters.length === 0) return null;

  const placed: { ch: string; x: number; y: number; w: number; h: number; font: string; size: number }[] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const letter of letters) {
    const pos = offsetWithin(letter, sectionEl);
    if (!pos || letter.offsetWidth === 0) continue;
    const cs = getComputedStyle(letter);
    const size = parseFloat(cs.fontSize);
    const w = letter.offsetWidth;
    const h = letter.offsetHeight;
    placed.push({
      ch: letter.textContent ?? "",
      x: pos.x,
      y: pos.y,
      w,
      h,
      size,
      font: `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
    });
    minX = Math.min(minX, pos.x);
    minY = Math.min(minY, pos.y);
    maxX = Math.max(maxX, pos.x + w);
    maxY = Math.max(maxY, pos.y + h);
  }
  if (placed.length === 0) return null;

  const pad = 8;
  const ox = Math.max(0, Math.floor(minX - pad));
  const oy = Math.max(0, Math.floor(minY - pad));
  const bw = Math.ceil(maxX - minX + pad * 2);
  const bh = Math.ceil(maxY - minY + pad * 2);

  const off = document.createElement("canvas");
  off.width = bw;
  off.height = bh;
  const octx = off.getContext("2d", { willReadFrequently: true });
  if (!octx) return null;
  octx.fillStyle = "#fff";
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  for (const p of placed) {
    octx.font = p.font;
    octx.fillText(p.ch, p.x - ox + p.w / 2, p.y - oy + p.h / 2 + p.size * 0.02);
  }

  const fontSize = placed[0].size;
  let gap = Math.max(2, fontSize / 30);
  const data = octx.getImageData(0, 0, bw, bh).data;

  const collect = (g: number) => {
    const pts: number[] = [];
    for (let y = 0; y < bh; y += g) {
      for (let x = 0; x < bw; x += g) {
        const i = ((y | 0) * bw + (x | 0)) * 4 + 3;
        if (data[i] > 140) pts.push(x + ox, y + oy);
      }
    }
    return pts;
  };

  let pts = collect(gap);
  while (pts.length / 2 > MAX_PARTICLES) {
    gap *= 1.15;
    pts = collect(gap);
  }
  return { points: pts, gap, fontSize, bounds: { minX, maxX, minY, maxY } };
}

export function HeroParticleField({ sectionRef, nameRef, gameActive, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameActiveRef = useRef(gameActive);
  const warpRef = useRef(0);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (gameActive && !gameActiveRef.current) warpRef.current = 1;
    gameActiveRef.current = gameActive;
  }, [gameActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let field = createField(MAX_PARTICLES);
    let stars = createStars(0);
    let interactRadius = 100;
    let started = false;
    let startTime = 0;
    let nameAlpha = 0;
    let bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    let raf: number | null = null;
    let visible = true;
    let last = performance.now();
    let readyFired = false;

    // Pointer state in viewport coords; converted to canvas-local each frame.
    const pointer = { cx: -1e5, cy: -1e5, active: false };
    let prevLocalX = -1e5;
    let prevLocalY = -1e5;
    let mvx = 0;
    let mvy = 0;
    let prevShipX = -1e5;
    let prevShipY = -1e5;
    let svx = 0;
    let svy = 0;
    let camX = 0;
    let camY = 0;

    const resample = () => {
      const nameEl = nameRef.current;
      if (!nameEl) return;
      width = section.clientWidth;
      height = section.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const starCount = Math.round(Math.min(320, (width * height) / 5500)); // <= MAX_STARS
      if (stars.count !== starCount) stars = createStars(starCount);

      const sampled = sampleName(nameEl, section);
      if (!sampled || sampled.points.length === 0) return;

      bounds = sampled.bounds;
      const spanX = Math.max(1, bounds.maxX - bounds.minX);
      const spread = Math.min(spanX, width * 0.9);
      const prev = field;
      const next = createField(MAX_PARTICLES);
      const n = sampled.points.length / 2;
      next.count = n;
      next.size = Math.max(1.3, sampled.gap * 0.6);
      interactRadius = Math.max(60, Math.min(130, sampled.fontSize * 1.15));

      for (let i = 0; i < n; i++) {
        next.hx[i] = sampled.points[i * 2];
        next.hy[i] = sampled.points[i * 2 + 1];
        if (i < prev.count) {
          // Keep existing particles where they are; they'll glide to their new home.
          next.x[i] = prev.x[i];
          next.y[i] = prev.y[i];
          next.vx[i] = prev.vx[i];
          next.vy[i] = prev.vy[i];
          next.delay[i] = prev.delay[i];
          next.s0[i] = prev.s0[i];
          next.ox[i] = prev.ox[i];
          next.oy[i] = prev.oy[i];
          next.prog[i] = prev.prog[i];
          next.landed[i] = prev.landed[i];
        } else {
          // Warp-in: each particle starts at its own depth (2.5x–9x farther away), floating
          // in a loose 3D cloud around the name, and flies forward onto its letter.
          next.x[i] = next.hx[i];
          next.y[i] = next.hy[i];
          next.s0[i] = 1 / (2.5 + Math.random() * 6.5);
          const ang = Math.random() * Math.PI * 2;
          const rad = Math.sqrt(Math.random()) * spread * 0.75;
          next.ox[i] = Math.cos(ang) * rad;
          next.oy[i] = Math.sin(ang) * rad * 0.55;
          next.delay[i] = Math.random() * INTRO_STAGGER;
        }
        if (reducedMotion) {
          next.x[i] = next.hx[i];
          next.y[i] = next.hy[i];
          next.prog[i] = 1;
          next.landed[i] = 1;
        }
      }
      field = next;

      if (!readyFired) {
        readyFired = true;
        onReadyRef.current?.();
      }
      if (reducedMotion) {
        started = true;
        nameAlpha = 1;
        draw(0, 0);
      }
    };

    const start = () => {
      if (started) return;
      started = true;
      startTime = performance.now();
      nameAlpha = 1;
      // Stars streak briefly as the name drops out of hyperspace.
      warpRef.current = Math.max(warpRef.current, 0.35);
    };

    // ---- simulation ------------------------------------------------------

    const toLocal = (vx: number, vy: number, rect: DOMRect) => {
      const sx = rect.width > 0 ? width / rect.width : 1;
      const sy = rect.height > 0 ? height / rect.height : 1;
      return { x: (vx - rect.left) * sx, y: (vy - rect.top) * sy };
    };

    const step = (dt: number, now: number) => {
      const f = dt * 60;
      const rect = canvas.getBoundingClientRect();
      const damp = Math.pow(DAMPING, f);
      const since = (now - startTime) / 1000;

      // Pointer (with smoothed velocity so a fast swipe drags particles along).
      let px = -1e5;
      let py = -1e5;
      if (pointer.active) {
        const l = toLocal(pointer.cx, pointer.cy, rect);
        px = l.x;
        py = l.y;
        if (prevLocalX > -1e4) {
          mvx = mvx * 0.6 + (px - prevLocalX) * 0.4;
          mvy = mvy * 0.6 + (py - prevLocalY) * 0.4;
        }
        prevLocalX = px;
        prevLocalY = py;
      } else {
        mvx *= 0.8;
        mvy *= 0.8;
        prevLocalX = prevLocalY = -1e5;
      }

      // Game objects, converted from viewport to canvas space.
      const lasers = gameBus.lasers.map((l) => toLocal(l.position.x, l.position.y, rect));
      const meteors = gameBus.meteors.map((m) => {
        const p = toLocal(m.position.x, m.position.y, rect);
        return { x: p.x, y: p.y, r: m.radius + 22 };
      });
      // Ship: a wide soft bow wave, plus a drag along its heading so it leaves a wake.
      let sx = -1e5;
      let sy = -1e5;
      let shipR = 0;
      if (gameBus.ship) {
        const l = toLocal(gameBus.ship.position.x, gameBus.ship.position.y, rect);
        sx = l.x;
        sy = l.y;
        shipR = gameBus.ship.radius + 26;
        if (prevShipX > -1e4) {
          svx = svx * 0.6 + (sx - prevShipX) * 0.4;
          svy = svy * 0.6 + (sy - prevShipY) * 0.4;
        }
        prevShipX = sx;
        prevShipY = sy;
      } else {
        svx = svy = 0;
        prevShipX = prevShipY = -1e5;
      }
      const shipR2 = shipR * shipR;
      const blasts = gameBus.blasts.splice(0).map((b) => {
        const p = toLocal(b.x, b.y, rect);
        return { x: p.x, y: p.y, r: 150 * b.power, s: 16 * b.power };
      });

      const R = interactRadius;
      const R2 = R * R;
      const laserR = 30;
      const laserR2 = laserR * laserR;
      const { x, y, vx, vy, hx, hy, delay, s0, ox, oy, prog, landed, count } = field;
      const icx = (bounds.minX + bounds.maxX) / 2;
      const icy = (bounds.minY + bounds.maxY) / 2;

      // Landing shockwave: a ring expands from the name's centre and lifts letters as it passes.
      const waveT = reducedMotion ? -1 : (since - INTRO_TIMELINE.nameLands) / WAVE_DURATION;
      const waveOn = waveT > 0 && waveT < 1;
      const waveMax = Math.hypot((bounds.maxX - bounds.minX) / 2, (bounds.maxY - bounds.minY) / 2) + WAVE_BAND;
      const waveR = waveT * waveMax;
      const waveFade = 1 - waveT * 0.6;

      for (let i = 0; i < count; i++) {
        if (!landed[i]) {
          const t = (since - delay[i]) / INTRO;
          if (t >= 1) {
            // Eased path ends exactly at home with ~zero velocity: hand over to physics seamlessly.
            x[i] = hx[i];
            y[i] = hy[i];
            vx[i] = vy[i] = 0;
            prog[i] = 1;
            landed[i] = 1;
          } else {
            const e = easeInOutCubic(t < 0 ? 0 : t);
            const sc = s0[i] + (1 - s0[i]) * e; // perspective scale: far (small) -> 1
            const k = 1 - e;
            x[i] = icx + (hx[i] + ox[i] * k - icx) * sc;
            y[i] = icy + (hy[i] + oy[i] * k - icy) * sc;
            prog[i] = e;
          }
          continue;
        }

        let ax = (hx[i] - x[i]) * SPRING;
        let ay = (hy[i] - y[i]) * SPRING;

        if (waveOn) {
          const wdx = hx[i] - icx;
          const wdy = hy[i] - icy;
          const wd = Math.sqrt(wdx * wdx + wdy * wdy) || 1;
          const band = Math.abs(wd - waveR);
          if (band < WAVE_BAND) {
            const k = (1 - band / WAVE_BAND) * waveFade;
            ay -= 1.5 * k;
            ax += (wdx / wd) * 0.45 * k;
            ay += (wdy / wd) * 0.45 * k;
          }
        }

        // Cursor: radial push + drag along with the swipe direction.
        let dx = x[i] - px;
        let dy = y[i] - py;
        let d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1;
          const s = 1 - d / R;
          const push = s * s * 5.5;
          ax += (dx / d) * push + mvx * s * 0.12;
          ay += (dy / d) * push + mvy * s * 0.12;
        }

        for (let j = 0; j < lasers.length; j++) {
          dx = x[i] - lasers[j].x;
          dy = y[i] - lasers[j].y;
          d2 = dx * dx + dy * dy;
          if (d2 < laserR2) {
            const d = Math.sqrt(d2) || 1;
            const s = 1 - d / laserR;
            ax += (dx / d) * s * 11;
            ay += (dy / d) * s * 11;
          }
        }

        if (shipR > 0) {
          dx = x[i] - sx;
          dy = y[i] - sy;
          d2 = dx * dx + dy * dy;
          if (d2 < shipR2) {
            const d = Math.sqrt(d2) || 1;
            const s = 1 - d / shipR;
            ax += (dx / d) * s * s * 7 + svx * s * 0.15;
            ay += (dy / d) * s * s * 7 + svy * s * 0.15;
          }
        }

        for (let j = 0; j < meteors.length; j++) {
          const m = meteors[j];
          dx = x[i] - m.x;
          dy = y[i] - m.y;
          d2 = dx * dx + dy * dy;
          if (d2 < m.r * m.r) {
            const d = Math.sqrt(d2) || 1;
            const s = 1 - d / m.r;
            ax += (dx / d) * s * 3.2;
            ay += (dy / d) * s * 3.2;
          }
        }

        for (let j = 0; j < blasts.length; j++) {
          const b = blasts[j];
          dx = x[i] - b.x;
          dy = y[i] - b.y;
          d2 = dx * dx + dy * dy;
          if (d2 < b.r * b.r) {
            const d = Math.sqrt(d2) || 1;
            const s = 1 - d / b.r;
            // One-off impulse (not scaled by frame time) with a little chaos.
            vx[i] += (dx / d) * s * b.s + (Math.random() - 0.5) * s * 4;
            vy[i] += (dy / d) * s * b.s + (Math.random() - 0.5) * s * 4;
          }
        }

        vx[i] = (vx[i] + ax * f) * damp;
        vy[i] = (vy[i] + ay * f) * damp;
        x[i] += vx[i] * f;
        y[i] += vy[i] * f;
      }

      // Camera parallax for the starfield follows the pointer gently.
      const targetCamX = pointer.active ? (px / Math.max(1, width) - 0.5) * 0.12 : 0;
      const targetCamY = pointer.active ? (py / Math.max(1, height) - 0.5) * 0.12 : 0;
      camX += (targetCamX - camX) * Math.min(1, 0.04 * f);
      camY += (targetCamY - camY) * Math.min(1, 0.04 * f);

      const targetAlpha = gameActiveRef.current ? 0.45 : 1;
      const alphaTarget = started ? targetAlpha : 0;
      nameAlpha += (alphaTarget - nameAlpha) * Math.min(1, 0.06 * f);
      warpRef.current *= Math.pow(0.965, f);
    };

    // ---- rendering -------------------------------------------------------

    const buckets = [new Int32Array(MAX_PARTICLES), new Int32Array(MAX_PARTICLES), new Int32Array(MAX_PARTICLES)];
    const bucketCounts = [0, 0, 0];
    const bucketStyles = ["255,255,255", "199,210,254", "165,180,252"];
    const introBuckets = Array.from({ length: INTRO_LEVELS }, () => new Int32Array(MAX_PARTICLES));
    const introCounts = new Int32Array(INTRO_LEVELS);

    const starSX = new Float32Array(MAX_STARS);
    const starSY = new Float32Array(MAX_STARS);
    const starTX = new Float32Array(MAX_STARS);
    const starTY = new Float32Array(MAX_STARS);
    const starBuckets = Array.from({ length: STAR_LEVELS }, () => new Int16Array(MAX_STARS));
    const starCounts = new Int32Array(STAR_LEVELS);

    const draw = (dt: number, now: number) => {
      ctx.clearRect(0, 0, width, height);

      // Starfield — positions first, then one draw call per brightness level.
      const warp = warpRef.current;
      const cruise = gameActiveRef.current ? 0.09 : 0.025;
      const speed = reducedMotion ? 0 : cruise + warp * 1.4;
      const focal = Math.max(width, height) * 0.55;
      const cx = width / 2;
      const cy = height / 2;
      const streak = Math.min(0.25, speed * 0.12 + warp * 0.08);
      const streaking = streak > 0.02;
      starCounts.fill(0);
      for (let i = 0; i < stars.count; i++) {
        let z = stars.z[i] - speed * dt;
        const sx = cx + ((stars.x[i] - camX) / z) * focal;
        const sy = cy + ((stars.y[i] - camY) / z) * focal;
        if (z <= 0.02 || sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) {
          stars.x[i] = (Math.random() * 2 - 1) * 1.4;
          stars.y[i] = (Math.random() * 2 - 1) * 1.4;
          z = 1;
          stars.z[i] = z;
          continue;
        }
        stars.z[i] = z;
        starSX[i] = sx;
        starSY[i] = sy;
        if (streaking) {
          const tz = Math.min(1, z + streak);
          starTX[i] = cx + ((stars.x[i] - camX) / tz) * focal;
          starTY[i] = cy + ((stars.y[i] - camY) / tz) * focal;
        }
        const lvl = Math.min(STAR_LEVELS - 1, ((1 - z) * STAR_LEVELS) | 0);
        starBuckets[lvl][starCounts[lvl]++] = i;
      }
      ctx.lineCap = "round";
      for (let l = 0; l < STAR_LEVELS; l++) {
        const n = starCounts[l];
        if (n === 0) continue;
        const depth = (l + 0.5) / STAR_LEVELS;
        const a = Math.min(0.85, depth * 0.9 + 0.08);
        const list = starBuckets[l];
        if (streaking) {
          ctx.strokeStyle = `rgba(255,255,255,${a})`;
          ctx.lineWidth = 0.6 + depth * 1.6;
          ctx.beginPath();
          for (let k = 0; k < n; k++) {
            const i = list[k];
            ctx.moveTo(starTX[i], starTY[i]);
            ctx.lineTo(starSX[i], starSY[i]);
          }
          ctx.stroke();
        } else {
          const s = 0.5 + depth * 1.8;
          const h = s / 2;
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          for (let k = 0; k < n; k++) {
            const i = list[k];
            ctx.fillRect(starSX[i] - h, starSY[i] - h, s, s);
          }
        }
      }

      // Name particles. Landed ones are bucketed by speed (hover tint); in-flight ones by depth.
      if (nameAlpha < 0.01) return;
      const { x, y, vx, vy, count, size, prog, landed } = field;
      const since = started ? (now - startTime) / 1000 : 0;
      const introFade = reducedMotion ? 1 : Math.min(1, since / 0.4);
      bucketCounts[0] = bucketCounts[1] = bucketCounts[2] = 0;
      introCounts.fill(0);
      for (let i = 0; i < count; i++) {
        if (!landed[i]) {
          const l = Math.min(INTRO_LEVELS - 1, (prog[i] * INTRO_LEVELS) | 0);
          introBuckets[l][introCounts[l]++] = i;
          continue;
        }
        const sp = vx[i] * vx[i] + vy[i] * vy[i];
        const b = sp > 16 ? 2 : sp > 1.5 ? 1 : 0;
        buckets[b][bucketCounts[b]++] = i;
      }
      for (let l = 0; l < INTRO_LEVELS; l++) {
        const n = introCounts[l];
        if (n === 0) continue;
        const p = (l + 0.5) / INTRO_LEVELS; // nearer = bigger and brighter
        const s = size * (0.55 + 0.45 * p);
        const half = s / 2;
        ctx.fillStyle = `rgba(255,255,255,${(0.2 + 0.75 * p) * introFade * nameAlpha})`;
        const list = introBuckets[l];
        for (let k = 0; k < n; k++) {
          const i = list[k];
          ctx.fillRect(x[i] - half, y[i] - half, s, s);
        }
      }
      for (let b = 0; b < 3; b++) {
        const n = bucketCounts[b];
        if (n === 0) continue;
        const s = b === 2 ? size * 1.25 : size;
        const half = s / 2;
        ctx.fillStyle = `rgba(${bucketStyles[b]},${(b === 0 ? 0.95 : 0.85) * nameAlpha})`;
        const list = buckets[b];
        for (let k = 0; k < n; k++) {
          const i = list[k];
          ctx.fillRect(x[i] - half, y[i] - half, s, s);
        }
      }
    };

    const loop = (now: number) => {
      raf = null;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (started) step(dt, now);
      draw(dt, now);
      if (visible) raf = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (reducedMotion || raf !== null || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    // ---- wiring ----------------------------------------------------------

    const onPointerMove = (e: PointerEvent) => {
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") pointer.active = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (reducedMotion) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("a,button,input,textarea,select,label,[role='button']")) return;
      const rect = section.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
      pushBlast(e.clientX, e.clientY, 1);
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resample, 120);
    });
    ro.observe(section);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(section);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    let cancelled = false;
    let stopIntro: (() => void) | null = null;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      resample();
      stopIntro = onIntroStart(start);
      kick();
    });

    return () => {
      cancelled = true;
      if (raf !== null) cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      stopIntro?.();
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [sectionRef, nameRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
