"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  navigateWithTransition,
  isViewTransitionActive,
  projectHeroName,
  heroTransitionProps,
  saveListState,
  readReturningListState,
  clearReturningFlag,
  transitionHero,
} from "@/lib/view-transition";
import { X, ArrowUpDown, Check, Star, ArrowUpRight, Warehouse } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { type TerminalProject } from "@/components/projects/interactive-terminal";
import { HudConsole } from "@/components/projects/hud-console";
import { TakeoffRunway } from "@/components/projects/takeoff-runway";
import { MatrixRain } from "@/components/projects/matrix-rain";
import { openCalendlyDirect } from "@/components/contact/book-call";
import { ShortcutsOverlay, type Shortcut } from "@/components/projects/fun-elements";
import { GroundVehicles, type VehicleLane } from "@/components/projects/ground-vehicles";

/* ─────────────────────────────────────────────────────────
   Data
   ───────────────────────────────────────────────────────── */

function parseDate(dateString: string): Date {
  const date = dateString.split(" - ")[0];
  const monthNames: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  const m = date.match(/(\w+)\s+(\d+),\s+(\d+)/i);
  if (m) return new Date(parseInt(m[3]), monthNames[m[1].toLowerCase()], parseInt(m[2]));
  const my = date.match(/(\w+)\s+(\d+)/i);
  if (my) return new Date(parseInt(my[2]), monthNames[my[1].toLowerCase()], 1);
  return new Date();
}

type ProjectEntry = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  sortDate: string;
  date: string;
  category: string;
  featured?: boolean;
  /** Hidden from the portfolio (kept here so it can be brought back) */
  hidden?: boolean;
};

const ALL_PROJECTS: ProjectEntry[] = [
  {
    id: "flight-deck-theme",
    name: "Air Canada Flight Deck",
    description:
      "A fan-made VS Code extension with three livery colour themes, aviation file icons, a flying focus timer, per-workspace task list and meeting reminders that arrive by plane.",
    thumbnail: "/imgs/projects/flightdeck-hero.png",
    technologies: ["VS Code Extension", "TypeScript", "Webviews", "Theming"],
    sortDate: "Nov 15, 2026 - Nov 20, 2026",
    date: "November 2026",
    category: "Developer Tools",
    featured: true,
  },
  {
    id: "git101-hackdecouverte",
    name: "Git 101 · HackDécouverte 2026",
    description:
      "A bilingual (EN/FR) 20-slide workshop deck taking beginners from installing VS Code to their first merged pull request.",
    thumbnail: "/imgs/projects/git101-og.jpg",
    technologies: ["HTML", "CSS", "JavaScript", "Git", "Workshop"],
    sortDate: "Nov 14, 2026",
    date: "November 2026",
    category: "Education & Workshops",
  },
  {
    id: "nlmeans-denoising",
    name: "Non-Local Means Denoising",
    description:
      "Python implementation of the NL-means image denoising algorithm (Buades et al., CVPR 2005), benchmarked against Gaussian, anisotropic, TV and neighborhood filters.",
    thumbnail: "/imgs/projects/nlmeans-high-noise.jpg",
    technologies: ["Python", "NumPy", "Image Processing", "Computer Vision"],
    sortDate: "Apr 11, 2026 - Apr 13, 2026",
    date: "April 2026",
    category: "Image Processing",
  },
  {
    id: "pure-black-theme",
    name: "Pure Black Theme",
    description:
      "A borderless, pure black VS Code colour theme published on the Visual Studio Marketplace.",
    thumbnail: "/imgs/projects/pureblack.png",
    technologies: ["VS Code Extension", "Theming", "JSON"],
    sortDate: "Apr 8, 2026",
    date: "April 2026",
    category: "Developer Tools",
  },
  {
    id: "bpmn-studio",
    name: "BPMN Studio",
    description:
      "AI-powered tool that turns natural language prompts into BPMN 2.0 diagrams, with git-like branching, version diffs, RBAC and one-click Flowable deployment.",
    thumbnail: "/imgs/projects/bpmn-studio.jpg",
    technologies: ["Next.js", "TypeScript", "MongoDB", "Groq / LLaMA", "bpmn-js", "Flowable"],
    sortDate: "Mar 2, 2026",
    date: "March 2026",
    category: "AI & Automation",
    featured: true,
  },
  {
    id: "doable",
    hidden: true,
    name: "Doable",
    description:
      "AI-powered app that builds personalized activity itineraries from your location, weather, schedule, budget and transport mode.",
    thumbnail: "/imgs/projects/doable-banner.jpg",
    technologies: ["Next.js", "TypeScript", "AI", "Tailwind CSS", "Radix UI"],
    sortDate: "Apr 26, 2025 - Apr 29, 2025",
    date: "April 2025",
    category: "Lifestyle & Discovery",
  },
  {
    id: "ai-bots",
    name: "AI_Bots",
    description:
      "Applied AI project featuring comparative analysis of ML models and CNN-based image classification.",
    thumbnail: "/imgs/projects/ai.png",
    technologies: ["Machine Learning", "Deep Learning", "Python", "CNN", "SVM"],
    sortDate: "May 29, 2025 - Jun 22, 2025",
    date: "May 29, 2025 - Jun 22, 2025",
    category: "Machine Learning & AI",
    featured: true,
  },
  {
    id: "recyclevision",
    name: "RecycleVision",
    description:
      "A mobile application that simplifies waste sorting using ML/AI-powered object detection and classification via Hugging Face API.",
    thumbnail: "/imgs/projects/RecycleVision.png",
    technologies: ["Mobile", "ML/AI", "Hugging Face API", "Image Recognition", "HCI", "Gamification"],
    sortDate: "Feb 18, 2024 - May 1, 2024",
    date: "Feb 18, 2024 - May 1, 2024",
    category: "Mobile Application",
    featured: true,
  },
  {
    id: "ai-report-workflow",
    name: "AI-Driven Report Generation",
    description:
      "An automated reporting system built using n8n that generates reports using natural language prompts.",
    thumbnail: "/imgs/projects/n8nlogo.png",
    technologies: ["n8n", "Automation", "AI", "REST APIs", "Workflow"],
    sortDate: "Dec 2025",
    date: "December 2024",
    category: "Automation / Reporting",
  },
  {
    id: "metricstics",
    name: "Metricstics",
    description:
      "Discover the Power of Metrics and Statistics - A Python tool for calculating essential statistical values.",
    thumbnail: "/imgs/projects/metricstics.png",
    technologies: ["Python", "Statistics", "Data Analysis"],
    sortDate: "November 2023",
    date: "November 2023",
    category: "Productivity & Utilities",
  },
  {
    id: "mytasks",
    name: "MyTasks",
    description:
      "A user-friendly cross-platform to-do application for efficiently managing and tracking day-to-day activities.",
    thumbnail: "/imgs/projects/todobg.png",
    technologies: ["Angular", "PWA", "Cross Platform", "Cloud-Based", "Firebase"],
    sortDate: "December 2022",
    date: "December 2022",
    category: "Productivity & Tracking",
  },
  {
    id: "snkrs",
    name: "SNKRS",
    description:
      "An online e-commerce web application for browsing and buying sneakers.",
    thumbnail: "/imgs/projects/snkrsbg.png",
    technologies: ["E-Commerce", "PWA", "Cross Platform"],
    sortDate: "May 2022",
    date: "May 2022",
    category: "E-Commerce",
  },
  {
    id: "helpdesk",
    hidden: true,
    name: "Helpdesk",
    description:
      "A web application for requesting for an asset or raising an issue.",
    thumbnail: "/imgs/projects/crm.png",
    technologies: ["PWA", "Support", "Cloud-Based"],
    sortDate: "Feb 2022",
    date: "Feb 2022",
    category: "Support",
  },
];

/** Projects shown on the site (hidden ones are left out everywhere, including the terminal). */
const projects = ALL_PROJECTS.filter((p) => !p.hidden);

type Project = (typeof projects)[number];

type SortOption = "newest" | "oldest" | "name" | "featured";

const sortOptions: { value: SortOption; label: string; flag: string }[] = [
  { value: "newest", label: "Newest", flag: "--sort=date.desc" },
  { value: "oldest", label: "Oldest", flag: "--sort=date.asc" },
  { value: "name", label: "A → Z", flag: "--sort=name" },
  { value: "featured", label: "Featured", flag: "--filter=star" },
];

const CATEGORIES: string[] = Array.from(new Set(projects.map((p) => p.category)));

/** Shared ticket surface: near-black gradient, soft shadow (matches the experience page). */
const TICKET =
  "group relative overflow-hidden rounded-2xl bg-linear-to-br from-[#121212] to-[#050505] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_48px_-24px_rgba(0,0,0,0.9),0_12px_40px_-16px_rgba(255,255,255,0.06)]";

/* ─────────────────────────────────────────────────────────
   Small primitives
   ───────────────────────────────────────────────────────── */

function Edge() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-white/10 transition-colors duration-300 group-hover:border-white/20"
    />
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-red-400">{children}</p>;
}

/* ─────────────────────────────────────────────────────────
   Hangar bay: a project parked inside painted floor markings
   ───────────────────────────────────────────────────────── */

/** Painted L-shaped floor marks at the four corners of a bay. */
function BayCorners({ tone }: { tone: string }) {
  const base = `pointer-events-none absolute h-6 w-6 ${tone}`;
  return (
    <>
      <span aria-hidden="true" className={`${base} left-0 top-0 rounded-tl-xl border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} right-0 top-0 rounded-tr-xl border-r-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} bottom-0 left-0 rounded-bl-xl border-b-2 border-l-2`} />
      <span aria-hidden="true" className={`${base} bottom-0 right-0 rounded-br-xl border-b-2 border-r-2`} />
    </>
  );
}

const HAZARD = "bg-[repeating-linear-gradient(-45deg,rgba(239,68,68,0.75)_0_6px,transparent_6px_12px)]";

function HangarBay({
  project,
  bay,
  onBeforeOpen,
  named,
}: {
  project: Project;
  bay: number;
  onBeforeOpen: () => void;
  /** Carries the transition name now (only the bay an image is returning to) */
  named: boolean;
}) {
  const wide = project.featured;
  const router = useRouter();
  const href = `/projects/${project.id}`;

  // Cinematic hand-off to the details page (plain clicks only; cmd/ctrl/middle-click open a new tab as usual)
  const onOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    hapticManager.light();
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onBeforeOpen();
    navigateWithTransition(router, href, "forward", projectHeroName(project.id));
  };

  // Spotlight follows the cursor across the card
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative p-3 pt-14 ${wide ? "lg:col-span-2" : ""}`}
    >
      <BayCorners tone={wide ? "border-red-400/60" : "border-white/25"} />

      {/* Stencilled bay number */}
      <span className="pointer-events-none absolute left-4 top-3 flex items-baseline gap-2 font-mono uppercase">
        <span className="text-[10px] font-bold tracking-[0.3em] text-white/30">Bay</span>
        <span className="text-3xl font-black leading-none tracking-tight text-white/15">
          {String(bay).padStart(2, "0")}
        </span>
      </span>
      {wide && (
        <span className="pointer-events-none absolute right-4 top-4 flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-400/90">
            <Star className="mr-1 inline h-2.5 w-2.5 fill-current align-[-1px]" />
            Featured
          </span>
          <span aria-hidden="true" className={`h-2.5 w-16 rounded-sm ${HAZARD}`} />
        </span>
      )}

      <Link
        href={href}
        onClick={onOpen}
        onMouseMove={onMove}
        // Load the project page ahead of the click so the transition starts instantly
        onPointerEnter={() => router.prefetch(href)}
        className={`flex h-full flex-col ${TICKET} ${wide ? "md:flex-row" : ""}`}
      >
        <Edge />
        {/* Cursor spotlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(360px circle at var(--x, 50%) var(--y, 0%), rgba(255,255,255,0.09), transparent 60%)",
          }}
        />
        <div
          className={`relative aspect-video w-full shrink-0 overflow-hidden bg-white/[0.03] ${
            wide ? "md:aspect-auto md:w-1/2" : ""
          }`}
          // Morphs into the full-screen image on the details page
          {...heroTransitionProps(project.id, named)}
        >
          <Image
            src={project.thumbnail}
            alt=""
            fill
            // The bay an image is flying back into loads right away, so the collapse never waits on it
            loading={named ? "eager" : undefined}
            sizes={wide ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"}
            className="object-cover"
          />
          {/* Floor shadow under the "aircraft" */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/70 to-transparent"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            {project.category} · {project.date.split(" - ")[0]}
          </p>
          <h3 className="mt-2 flex items-start justify-between gap-3 text-lg font-semibold text-white">
            {project.name}
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-red-300" />
          </h3>
          <p className={`mt-2 text-sm leading-relaxed text-white/55 ${wide ? "line-clamp-4" : "line-clamp-3"}`}>
            {project.description}
          </p>
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {project.technologies.slice(0, wide ? 5 : 3).map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-white/60"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </motion.li>
  );
}

/* ─────────────────────────────────────────────────────────
   Hangar shell: a red dotted taxi trail that winds from bay to bay
   ───────────────────────────────────────────────────────── */

/** Distance between trail lights, in px. */
const TRAIL_SPACING = 16;
/** How far the trail runs out from a bay before turning (half the 64px gap between bays). */
const TRAIL_OFFSET = 32;
/** Speed of the red streak travelling along the trail, in px per second. */
const TRAIL_SPEED = 420;
/** Length of the streak's fading tail, in px. */
const TRAIL_TAIL = 560;

type Box = { left: number; top: number; right: number; bottom: number };
/** Distinct values (within a few px), sorted. */
function clusters(values: number[]) {
  const out: number[] = [];
  [...values].sort((a, b) => a - b).forEach((v) => {
    if (!out.length || Math.abs(out[out.length - 1] - v) > 4) out.push(v);
  });
  return out;
}

/** A bay: its outer box (brackets, label) and the card inside it the trail actually touches. */
type Bay = Box & { card: Box };
type Side = "top" | "bottom" | "left" | "right";
type TrailStep = [from: number, fromSide: Side, to: number, toSide: Side];
type Point = { x: number; y: number };
type TrailLight = Point & { d: number };

/**
 * The hand-drawn route for the full hangar on desktop (bay numbers, 1-based). Cards only connect
 * through their top and bottom edges: 01 over the top to 02, straight down the right-hand column
 * (02, 06, 09, 10, 11), under to 08, back up the left (08, 07, 05), then 05 to 04 and over to 03.
 */
const SIGNATURE_ROUTE: TrailStep[] = [
  [1, "top", 2, "top"],
  [2, "bottom", 6, "top"],
  [6, "bottom", 9, "top"],
  [9, "bottom", 10, "top"],
  [10, "bottom", 11, "top"],
  [11, "bottom", 8, "bottom"],
  [8, "top", 7, "bottom"],
  [7, "top", 5, "bottom"],
  [5, "top", 4, "bottom"],
  [4, "top", 3, "top"],
];

const OUTWARD: Record<Side, Point> = { top: { x: 0, y: -1 }, bottom: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };

function anchor(b: Box, side: Side): Point {
  const cx = (b.left + b.right) / 2;
  const cy = (b.top + b.bottom) / 2;
  if (side === "top") return { x: cx, y: b.top };
  if (side === "bottom") return { x: cx, y: b.bottom };
  if (side === "left") return { x: b.left, y: cy };
  return { x: b.right, y: cy };
}

/** Where the trail turns: out past the bay's edge into the middle of the gap, in line with the card. */
function lane(bay: Bay, side: Side, from: Point): Point {
  const edge = anchor(bay, side);
  return side === "top" || side === "bottom"
    ? { x: from.x, y: edge.y + OUTWARD[side].y * TRAIL_OFFSET }
    : { x: edge.x + OUTWARD[side].x * TRAIL_OFFSET, y: from.y };
}

/** Orthogonal path from one card's side to another's, running down the gap between them. */
function connector(a: Bay, aSide: Side, b: Bay, bSide: Side): Point[] {
  const start = anchor(a.card, aSide);
  const end = anchor(b.card, bSide);
  const p1 = lane(a, aSide, start);
  const p2 = lane(b, bSide, end);
  const vertical = aSide === "top" || aSide === "bottom";
  const middle: Point[] =
    Math.abs(vertical ? p1.y - p2.y : p1.x - p2.x) < 1
      ? []
      : vertical
        ? [{ x: p2.x, y: p1.y }]
        : [{ x: p1.x, y: p2.y }];
  // Lights start a little off the card edge so they never sit on its border
  const inset = 8;
  return [
    { x: start.x + OUTWARD[aSide].x * inset, y: start.y + OUTWARD[aSide].y * inset },
    p1,
    ...middle,
    p2,
    { x: end.x + OUTWARD[bSide].x * inset, y: end.y + OUTWARD[bSide].y * inset },
  ];
}

/** Any other layout (filtered, sorted, tablet, phone): snake row by row, alternating direction. */
function snakeRoute(boxes: Box[]): TrailStep[] {
  const rows: number[][] = [];
  boxes
    .map((b, i) => i)
    .sort((i, j) => boxes[i].top - boxes[j].top || boxes[i].left - boxes[j].left)
    .forEach((i) => {
      const row = rows.find((r) => Math.abs(boxes[r[0]].top - boxes[i].top) < 4);
      if (row) row.push(i);
      else rows.push([i]);
    });
  const order = rows.flatMap((row, r) => (r % 2 === 0 ? row : [...row].reverse()));
  const steps: TrailStep[] = [];
  for (let k = 1; k < order.length; k++) {
    const a = boxes[order[k - 1]];
    const b = boxes[order[k]];
    const sameRow = Math.abs(a.top - b.top) < 4;
    // Only top and bottom edges: along a row the trail loops over the top, between rows it drops down
    const [aSide, bSide]: [Side, Side] = sameRow ? ["top", "top"] : ["bottom", "top"];
    steps.push([order[k - 1] + 1, aSide, order[k] + 1, bSide]);
  }
  return steps;
}

/** Corner radius where the trail turns, in px (shrinks on short legs). */
const TRAIL_RADIUS = 28;

/** The path as a dense line of points, with each turn swapped for a smooth rounded corner. */
function roundCorners(path: Point[]): Point[] {
  const out: Point[] = [path[0]];
  for (let i = 1; i < path.length - 1; i++) {
    const [a, c, b] = [path[i - 1], path[i], path[i + 1]];
    const lenIn = Math.hypot(c.x - a.x, c.y - a.y);
    const lenOut = Math.hypot(b.x - c.x, b.y - c.y);
    // The short stubs out of a card can be used up entirely by the curve; shared legs are split in half
    const r = Math.min(TRAIL_RADIUS, i === 1 ? lenIn : lenIn / 2, i === path.length - 2 ? lenOut : lenOut / 2);
    if (r < 1) {
      out.push(c);
      continue;
    }
    const from = { x: c.x + ((a.x - c.x) / lenIn) * r, y: c.y + ((a.y - c.y) / lenIn) * r };
    const to = { x: c.x + ((b.x - c.x) / lenOut) * r, y: c.y + ((b.y - c.y) / lenOut) * r };
    // Quadratic curve with the corner as its control point: a smooth quarter turn
    for (let k = 0; k <= 12; k++) {
      const t = k / 12;
      const u = 1 - t;
      out.push({ x: u * u * from.x + 2 * u * t * c.x + t * t * to.x, y: u * u * from.y + 2 * u * t * c.y + t * t * to.y });
    }
  }
  out.push(path[path.length - 1]);
  return out;
}

/** Evenly spaced lights along each leg, each tagged with its distance along the whole trail. */
function sampleTrail(paths: Point[][]): { lights: TrailLight[]; length: number } {
  const lights: TrailLight[] = [];
  let travelled = 0;
  paths.forEach((raw) => {
    const path = roundCorners(raw);
    const lengths = path.slice(1).map((p, i) => Math.hypot(p.x - path[i].x, p.y - path[i].y));
    const total = lengths.reduce((sum, l) => sum + l, 0);
    const n = Math.max(1, Math.round(total / TRAIL_SPACING));
    let seg = 0;
    let segStart = 0;
    for (let k = 0; k <= n; k++) {
      const d = (k / n) * total;
      while (seg < lengths.length - 1 && segStart + lengths[seg] < d) segStart += lengths[seg++];
      const t = lengths[seg] ? (d - segStart) / lengths[seg] : 0;
      const a = path[seg];
      const b = path[seg + 1];
      lights.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, d: travelled + d });
    }
    travelled += total + TRAIL_SPACING * 4; // a beat between bays, as the pulse "passes through" a card
  });
  return { lights, length: travelled };
}

/* Ground marshallers: little crew members with light wands, waving the trail along */

type Direction = "up" | "down" | "left" | "right";
/**
 * A marshaller: where it stands, which way its body faces (degrees, clockwise from right), and
 * each arm's swing (degrees relative to the body; 0 = straight ahead).
 */
type Marshal = Point & {
  d: number;
  facing: number;
  leftArm: [number, number];
  rightArm: [number, number];
};

/** A marshaller every this many px along long straight runs. */
const MARSHAL_SPACING = 240;
/**
 * How far marshallers stand from the trail. They always stand in the upper half of each gap; the
 * lower half is the vehicles' road, so the two never meet.
 */
const MARSHAL_LIFT = 24;
/** Marshallers on straight stretches stand a little further back. */
const MARSHAL_RUN_LIFT = 32;
/** Airport ground vehicles driving through the gaps. Flip to `true` to bring them back. */
const SHOW_GROUND_VEHICLES = false;

/** Marshallers start signalling this many seconds before the streak reaches them... */
const MARSHAL_LEAD = 0.5;
/** ...and keep going this many seconds after it has fully passed (tail included). */
const MARSHAL_LINGER = 0.5;
/** Keep straight-run marshallers this far from the turns (which get their own). */
const MARSHAL_TURN_CLEARANCE = 70;

const ANGLE: Record<Direction, number> = { right: 0, down: 90, left: 180, up: -90 };
const UNIT: Record<Direction, Point> = { right: { x: 1, y: 0 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, up: { x: 0, y: -1 } };

/** Wrap an angle into (-180, 180]. */
const wrap = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

/**
 * A marshaller at `at`, facing `toward` (the trail), signalling `go`: the arm on that side points
 * the way (holding steady), the other sweeps from straight ahead toward it.
 */
function signal(at: Point, toward: Point, go: Direction): Omit<Marshal, "d"> {
  const facing = (Math.atan2(toward.y - at.y, toward.x - at.x) * 180) / Math.PI;
  const point = wrap(ANGLE[go] - facing); // where to point, relative to the body
  const steady: [number, number] = [point - 4, point + 4];
  const sweep: [number, number] = [point * -0.15, point * 0.95];
  // Negative = the marshaller's left (when facing right, left is up the screen)
  return point < 0
    ? { ...at, facing, leftArm: steady, rightArm: sweep }
    : { ...at, facing, leftArm: sweep, rightArm: steady };
}

/**
 * A marshaller beside a straight stretch, facing the trail. The arm on the side the light comes
 * from waves it in; the other arm points, perfectly still, the way the light will go.
 */
function signalAlong(at: Point, toward: Point, go: Direction): Omit<Marshal, "d"> {
  const facing = (Math.atan2(toward.y - at.y, toward.x - at.x) * 180) / Math.PI;
  const point = wrap(ANGLE[go] - facing); // downstream, relative to the body
  const from = wrap(point + 180); // upstream: where the light comes from
  const side = Math.sign(from) || 1;
  const steady: [number, number] = [point, point];
  const beckon: [number, number] = [from + side * 25, from * 0.45];
  // Negative = the marshaller's left
  return point < 0
    ? { ...at, facing, leftArm: steady, rightArm: beckon }
    : { ...at, facing, leftArm: beckon, rightArm: steady };
}

function directionOf(a: Point, b: Point): Direction {
  if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y)) return b.x > a.x ? "right" : "left";
  return b.y > a.y ? "down" : "up";
}

/**
 * Where the marshallers stand, each signalling the way the trail goes from there:
 * - at every turn, on the 45° diagonal off the bend (outside it, or inside when outside would be
 *   in the vehicles' half), facing the bend and pointing where the trail turns to
 * - along long straight runs, facing the trail: one arm waves the light in from where it comes,
 *   the other points still the way it goes
 * Always on the upper side of the trail: vehicles drive along the lower side.
 */
function placeMarshals(paths: Point[][], lights: TrailLight[]): Marshal[] {
  const out: Marshal[] = [];
  const distanceAt = (p: Point) =>
    lights.reduce((best, l) => (Math.hypot(l.x - p.x, l.y - p.y) < Math.hypot(best.x - p.x, best.y - p.y) ? l : best)).d;
  const add = (m: Omit<Marshal, "d">) => out.push({ ...m, d: distanceAt(m) });

  paths.forEach((raw) => {
    // Short straight drops between rows (no turns) get no marshaller
    if (Math.abs(raw[0].x - raw[raw.length - 1].x) < 1) return;
    // Drop repeated points (a leg with no middle bend has its two lane points on top of each other)
    const path = raw.filter((p, i) => i === 0 || Math.hypot(p.x - raw[i - 1].x, p.y - raw[i - 1].y) > 0.5);

    // Turns: stand on the 45° diagonal off the corner, facing the bend
    for (let i = 1; i < path.length - 1; i++) {
      const [a, c, b] = [path[i - 1], path[i], path[i + 1]];
      const inDir = directionOf(a, c);
      const outDir = directionOf(c, b);
      if (inDir === outDir) continue;
      // Outside of the bend is (in − out); if that's below the trail (the vehicles' road), use the inside
      let dx = UNIT[inDir].x - UNIT[outDir].x;
      let dy = UNIT[inDir].y - UNIT[outDir].y;
      if (dy > 0) [dx, dy] = [-dx, -dy];
      add(signal({ x: c.x + dx * MARSHAL_LIFT, y: c.y + dy * MARSHAL_LIFT }, c, outDir));
    }

    for (let i = 1; i < path.length; i++) {
      const [a, b] = [path[i - 1], path[i]];
      const dir = directionOf(a, b);
      if (dir === "left" || dir === "right") {
        // Long straight runs: evenly spaced, clear of the turns at either end
        const len = Math.abs(b.x - a.x) - 2 * MARSHAL_TURN_CLEARANCE;
        const count = Math.floor(len / MARSHAL_SPACING);
        for (let k = 0; k < count; k++) {
          const t = (k + 0.5) / count;
          const x = Math.min(a.x, b.x) + MARSHAL_TURN_CLEARANCE + t * len;
          add(signalAlong({ x, y: a.y - MARSHAL_RUN_LIFT }, { x, y: a.y }, dir));
        }
      }
    }
  });
  return out;
}

/**
 * A marshaller seen from above: hard hat, shoulders in a vest with reflective tape, facing the
 * trail. One red light wand points the way to go; the other sweeps toward it. The wands throw red light on the floor
 * and glow brighter as the red streak passes.
 */
function Marshaller({ marshal }: { marshal: Marshal }) {
  const arm = (shoulderY: string, [from, to]: [number, number]) =>
    ({ transformOrigin: `12px ${shoulderY}`, "--arm-from": `${from}deg`, "--arm-to": `${to}deg` }) as React.CSSProperties;
  return (
    <div
      className="marshal absolute"
      data-d={marshal.d.toFixed(1)}
      style={
        {
          left: marshal.x,
          top: marshal.y,
          "--d": marshal.d.toFixed(1),
          transform: `translate(-50%, -50%) rotate(${marshal.facing}deg)`,
        } as React.CSSProperties
      }
    >
      {/* Drawn facing right, centred on (12, 12) */}
      <svg viewBox="0 0 24 24" width="32" height="32" overflow="visible">
        {/* Red light from the wands on the floor */}
        <circle className="marshal__pool" cx="21" cy="12" r="8" fill="url(#marshal-pool)" />

        {/* Shadow */}
        <ellipse cx="13" cy="13.6" rx="3.2" ry="5.2" fill="rgba(0,0,0,0.55)" />

        {/* Arms holding wands, sweeping toward the way to go */}
        <g className="marshal__arm" style={arm("7.8px", marshal.leftArm)}>
          <rect x="12" y="7" width="5" height="1.6" rx="0.8" fill="#3f3f46" />
          <rect className="marshal__wand" x="16.5" y="7.05" width="6.5" height="1.5" rx="0.75" />
        </g>
        <g className="marshal__arm" style={arm("16.2px", marshal.rightArm)}>
          <rect x="12" y="15.4" width="5" height="1.6" rx="0.8" fill="#3f3f46" />
          <rect className="marshal__wand" x="16.5" y="15.45" width="6.5" height="1.5" rx="0.75" />
        </g>

        {/* Shoulders in a vest with reflective tape */}
        <ellipse cx="12" cy="12" rx="2.9" ry="4.8" fill="url(#marshal-vest)" />
        <rect x="10.4" y="7.6" width="0.8" height="8.8" fill="rgba(255,255,255,0.8)" />
        <rect x="12.9" y="7.6" width="0.8" height="8.8" fill="rgba(255,255,255,0.8)" />

        {/* Hard hat */}
        <circle cx="12.3" cy="12" r="2.6" fill="url(#marshal-hat)" stroke="#a1a1aa" strokeWidth="0.4" />
        <path d="M12.3 9.6 V14.4" stroke="#d4d4d8" strokeWidth="0.45" />
      </svg>
    </div>
  );
}

/** Shared gradients for the marshallers (defined once). */
function MarshalDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <radialGradient id="marshal-pool">
          <stop offset="0" stopColor="rgba(239,68,68,0.45)" />
          <stop offset="1" stopColor="rgba(239,68,68,0)" />
        </radialGradient>
        <linearGradient id="marshal-vest" x1="0" x2="1">
          <stop offset="0" stopColor="#52525b" />
          <stop offset="0.5" stopColor="#27272a" />
          <stop offset="1" stopColor="#09090b" />
        </linearGradient>
        <radialGradient id="marshal-hat" cx="0.35" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#a1a1aa" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/**
 * Taxi trail: a line of lights that winds through the gaps from bay to bay. Lights rest dim white;
 * a single red streak travels the whole route.
 */
function RunwayLights({
  floorRef,
  listRef,
  signature,
}: {
  floorRef: React.RefObject<HTMLElement | null>;
  listRef: React.RefObject<HTMLElement | null>;
  /** Full, unsorted, unfiltered list: use the hand-drawn route when the layout fits it */
  signature: boolean;
}) {
  const [lights, setLights] = useState<TrailLight[]>([]);
  const [trailLength, setTrailLength] = useState(0);
  const [marshals, setMarshals] = useState<Marshal[]>([]);
  const [lanes, setLanes] = useState<VehicleLane[]>([]);
  const [room, setRoom] = useState({ left: 0, right: 0 });
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const floor = floorRef.current;
    const list = listRef.current;
    if (!floor || !list) return;

    const measure = () => {
      const f = floor.getBoundingClientRect();
      const rel = (r: DOMRect): Box => ({ left: r.left - f.left, top: r.top - f.top, right: r.right - f.left, bottom: r.bottom - f.top });
      const boxes: Bay[] = Array.from(list.children).map((child) => {
        const card = child.querySelector("a") ?? child;
        return { ...rel(child.getBoundingClientRect()), card: rel(card.getBoundingClientRect()) };
      });
      const columns = new Set(boxes.map((b) => Math.round(b.right))).size;
      const useSignature =
        signature && columns === 3 && boxes.length >= Math.max(...SIGNATURE_ROUTE.flatMap(([a, , b]) => [a, b]));
      const steps = useSignature ? SIGNATURE_ROUTE : snakeRoute(boxes);
      const paths = steps.map(([a, aSide, b, bSide]) => connector(boxes[a - 1], aSide, boxes[b - 1], bSide));
      const trail = sampleTrail(paths);
      setLights(trail.lights);
      setMarshals(trail.lights.length ? placeMarshals(paths, trail.lights) : []);

      // Vehicle lanes: above the first row, through every gap between rows, and below the last row
      const rows = clusters(boxes.map((b) => b.top)).map((top) => {
        const inRow = boxes.filter((b) => Math.abs(b.top - top) < 4);
        return { top, bottom: Math.max(...inRow.map((b) => b.bottom)) };
      });
      const left = Math.min(...boxes.map((b) => b.left));
      const right = Math.max(...boxes.map((b) => b.right));
      const nextLanes: VehicleLane[] = rows.length
        ? [
            rows[0].top - TRAIL_OFFSET,
            ...rows.slice(1).map((row, i) => (rows[i].bottom + row.top) / 2),
            rows[rows.length - 1].bottom + TRAIL_OFFSET,
          ].map((y) => ({ y: Math.round(y), left: Math.round(left), right: Math.round(right) }))
        : [];
      setLanes((prev) => (JSON.stringify(prev) === JSON.stringify(nextLanes) ? prev : nextLanes));
      // Free space beside the grid (in the viewport) for the vehicles' outer loop
      const l = list.getBoundingClientRect();
      const nextRoom = { left: Math.round(l.left), right: Math.round(document.documentElement.clientWidth - l.right) };
      setRoom((prev) => (prev.left === nextRoom.left && prev.right === nextRoom.right ? prev : nextRoom));
      setTrailLength(trail.length);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [floorRef, listRef, signature]);

  // One red streak travels the whole route: move its head along the trail every frame
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || trailLength <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const startedAt = performance.now();
    const crew = Array.from(layer.querySelectorAll<HTMLElement>(".marshal")).map((el) => ({
      el,
      d: Number(el.dataset.d),
      active: false,
    }));
    const tick = (now: number) => {
      // Run past the end by a tail length so the streak fully leaves before starting again at bay 01
      const head = (((now - startedAt) / 1000) * TRAIL_SPEED) % (trailLength + TRAIL_TAIL);
      layer.style.setProperty("--trail-head", head.toFixed(1));
      // Marshallers spring into action as the streak approaches, and rest once it has passed
      crew.forEach((m) => {
        const active =
          head > m.d - MARSHAL_LEAD * TRAIL_SPEED && head < m.d + TRAIL_TAIL + MARSHAL_LINGER * TRAIL_SPEED;
        if (active !== m.active) {
          m.active = active;
          m.el.classList.toggle("is-signalling", active);
        }
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [trailLength, marshals]);


  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{ "--trail-tail": TRAIL_TAIL } as React.CSSProperties}
    >
      {lights.map((light, i) => {
        return (
          <span
            key={i}
            className="taxi-light absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: light.x, top: light.y, "--d": light.d.toFixed(1) } as React.CSSProperties}
          >
            <span className="taxi-light__glow" />
          </span>
        );
      })}
      {SHOW_GROUND_VEHICLES && <GroundVehicles lanes={lanes} room={room} />}
      <MarshalDefs />
      {marshals.map((m) => (
        <Marshaller key={`${Math.round(m.x)}-${Math.round(m.y)}`} marshal={m} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────── */

const SHORTCUTS: Shortcut[] = [
  { group: "Search", keys: ["Esc"], desc: "Clear / blur search" },
  { group: "Navigation", keys: ["?"], desc: "Toggle this panel" },
  { group: "Terminal", keys: ["↑"], desc: "Previous command" },
  { group: "Terminal", keys: ["↓"], desc: "Next command" },
  { group: "Terminal", keys: ["Tab"], desc: "Autocomplete" },
  { group: "Terminal", keys: ["Ctrl", "L"], desc: "Clear terminal" },
  { group: "Terminal", keys: ["Ctrl", "C"], desc: "Cancel input" },
  { group: "Fun", keys: ["M"], desc: "Enter the matrix" },
];

export default function ProjectsPage() {
  // Coming back from a project: pick up the filters and scroll position we left with
  const [returning] = useState(readReturningListState);
  // The bay an image is flying back into (only that one is named, so no other bay can cover it)
  const [returningHero] = useState(transitionHero);
  const [searchQuery, setSearchQuery] = useState(returning?.searchQuery ?? "");
  const [activeCategory, setActiveCategory] = useState<string | null>(returning?.activeCategory ?? null);
  const [sortBy, setSortBy] = useState<SortOption>((returning?.sortBy as SortOption) ?? "newest");

  // Restore the scroll position before paint, so the transition's image lands on its own bay
  useLayoutEffect(() => {
    if (returning) window.scrollTo({ top: returning.scrollY, behavior: "instant" });
    clearReturningFlag();
  }, [returning]);

  const rememberListState = () =>
    saveListState({ scrollY: window.scrollY, searchQuery, activeCategory, sortBy });
  const [sortOpen, setSortOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [matrixOn, setMatrixOn] = useState(false);
  // When we arrive mid-transition (back from a project), skip entry animations so the image has a solid target
  const [arrivedViaTransition] = useState(isViewTransitionActive);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;

      if (e.key === "?" && !typing) {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      } else if (e.key.toLowerCase() === "m" && !typing && !e.metaKey && !e.ctrlKey) {
        setMatrixOn(true);
      } else if (e.key === "Escape") {
        setShortcutsOpen(false);
        setMatrixOn(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Click outside sort menu
  useEffect(() => {
    const onClick = (e: globalThis.MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    if (sortOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [sortOpen]);

  const terminalProjects: TerminalProject[] = useMemo(
    () =>
      projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        technologies: p.technologies,
        date: p.date,
        featured: p.featured,
      })),
    [],
  );

  const filtered = useMemo(() => {
    let r = [...projects];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (activeCategory) r = r.filter((p) => p.category === activeCategory);
    switch (sortBy) {
      case "newest":
        r.sort((a, b) => parseDate(b.sortDate).getTime() - parseDate(a.sortDate).getTime());
        break;
      case "oldest":
        r.sort((a, b) => parseDate(a.sortDate).getTime() - parseDate(b.sortDate).getTime());
        break;
      case "name":
        r.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
        r.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return parseDate(b.sortDate).getTime() - parseDate(a.sortDate).getTime();
        });
        break;
    }
    return r;
  }, [searchQuery, activeCategory, sortBy]);


  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory(null);
    hapticManager.light();
  };

  return (
    <div className="relative bg-black">
      <AnimatePresence>{matrixOn && <MatrixRain onClose={() => setMatrixOn(false)} />}</AnimatePresence>
      <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} shortcuts={SHORTCUTS} />

      <motion.div
        initial={arrivedViaTransition ? false : "initial"}
        animate="animate"
        variants={staggerContainer}
        className="relative mx-auto mt-12 max-w-7xl px-4 py-24 md:px-8"
      >
        {/* Header */}
        <motion.p
          variants={staggerItem}
          className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-red-400"
        >
          <Warehouse className="h-3.5 w-3.5" /> HANGAR · YUL
        </motion.p>
        <motion.h1 variants={staggerItem} className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          Projects
        </motion.h1>
        <motion.p variants={staggerItem} className="mb-10 max-w-2xl text-sm text-white/75 md:text-base">
          Everything I&apos;ve designed, built and shipped, parked in one hangar. Step into a bay to see how it was made.
        </motion.p>

        {/* Cockpit: interactive terminal */}
        <motion.section variants={staggerItem} className="mb-16">
          <SectionLabel>Cockpit</SectionLabel>
          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">Take the controls</h2>
          <p className="mb-6 max-w-2xl text-sm text-white/60">
            Every project is a contact on the radar: hover to identify it, click to open its file. Or talk to the
            comms log directly; it&apos;s a real-ish terminal.
          </p>
          <HudConsole projects={terminalProjects} onTriggerMatrix={() => setMatrixOn(true)} />
        </motion.section>

        {/* Category filter + sort, sitting right above the hangar */}
        <motion.div variants={staggerItem} className="flex items-center gap-3">
          <div
            className="-ml-4 flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 pl-4 [scrollbar-width:none] md:ml-0 md:flex-wrap md:pl-0 [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter by category"
          >
            {[null, ...CATEGORIES].map((cat) => {
              const active = activeCategory === cat;
              const count = cat ? projects.filter((p) => p.category === cat).length : projects.length;
              return (
                <button
                  key={cat ?? "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setActiveCategory(active || cat === null ? null : cat);
                    hapticManager.light();
                  }}
                  className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    active
                      ? "border-red-400/50 bg-red-500/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {cat ?? "All"}
                  <span className="font-mono text-[10px] text-white/35">{count}</span>
                </button>
              );
            })}
          </div>
            <div ref={sortMenuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSortOpen((v) => !v);
                  hapticManager.light();
                }}
                className="inline-flex w-full items-center gap-2 rounded-md px-2 py-2.5 font-mono text-sm text-white/80 transition-colors hover:bg-white/5 sm:w-auto"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-white/40" />
                <span className="text-white/45">--sort</span>
                <span className="-mx-1 text-white/30">=</span>
                <span className="text-red-300">{sortOptions.find((s) => s.value === sortBy)?.label}</span>
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-30 mt-2 w-full min-w-[220px] overflow-hidden rounded-lg border border-white/15 bg-black/85 p-1 shadow-2xl shadow-black/50 backdrop-blur-xl sm:w-auto"
                  >
                    {sortOptions.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => {
                          setSortBy(o.value);
                          setSortOpen(false);
                          hapticManager.light();
                        }}
                        className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left font-mono text-xs transition-colors ${
                          sortBy === o.value ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="flex flex-col">
                          <span>{o.label}</span>
                          <span className="text-[10px] text-white/35">{o.flag}</span>
                        </span>
                        {sortBy === o.value && <Check className="h-3.5 w-3.5 text-red-300" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </motion.div>

        {/* Hangar floor */}
        <motion.section
          ref={floorRef}
          variants={staggerItem}
          aria-label="Projects"
          // No container: the bays use the full width; top padding leaves room for the trail over bay 01
          className="relative mb-24 pt-20"
        >
          <RunwayLights floorRef={floorRef} listRef={listRef} signature={filtered.length === projects.length && sortBy === "newest"} />
          <div className="relative z-10">
          {filtered.length === 0 ? (
            <div className="relative px-6 py-16 text-center">
              <BayCorners tone="border-white/25" />
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">Hangar empty</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/55">Nothing matches that filter.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs text-white transition-colors hover:border-red-400/50 hover:bg-red-500/10"
              >
                <X className="h-3.5 w-3.5" /> Show all projects
              </button>
            </div>
          ) : (
            <ol ref={listRef} className="grid grid-flow-dense grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={!arrivedViaTransition}>
                {filtered.map((p, i) => (
                  <HangarBay key={p.id} project={p} bay={i + 1} onBeforeOpen={rememberListState}
                    named={returningHero === projectHeroName(p.id)}
                  />
                ))}
              </AnimatePresence>
            </ol>
          )}
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section variants={staggerItem} className="mt-48 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left: the pitch */}
          <div>
            <SectionLabel>Next departure</SectionLabel>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white md:text-4xl">Build something together</h2>
            <p className="max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
              Got a product to ship, a team that could use another pair of hands, or an idea you want to talk
              through? Whether it&apos;s a role, a collaboration or an ambitious side project, I&apos;d love to hear
              about it.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/50">
              Pick a runway on the right: book a 30-minute call straight onto my calendar, or run{" "}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-xs text-red-300">sudo hireme</code>{" "}
              in the terminal for the full brief.
            </p>
            {/* How working together goes, as a flight plan */}
            <ol className="mt-8 max-w-xl space-y-2.5">
              {[
                ["Pre-flight", "a quick call about what you're building"],
                ["Flight plan", "agree on scope and milestones"],
                ["Takeoff", "ship in small, visible steps"],
              ].map(([phase, desc], i) => (
                <li key={phase} className="flex items-baseline gap-3 text-sm">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-red-300/80">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">{phase}</span>
                  <span className="text-white/45">{desc}</span>
                </li>
              ))}
            </ol>

            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 font-mono text-[10px] uppercase tracking-[0.2em]">
              {[
                ["Based", "Montréal"],
                ["Timezone", "EST · UTC−5"],
                ["Status", "Open to chat"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-white/35">{k}</dt>
                  <dd className="mt-1 text-xs normal-case tracking-normal text-white/80">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: the runway, centred vertically against the text */}
          <div className="lg:self-center">
          <TakeoffRunway
            departures={[
              { code: "27L", label: "Book a 30-min call", tone: "mandatory", takeoff: true, run: () => void openCalendlyDirect() },
              {
                code: "09R",
                label: "sudo hireme",
                tone: "info",
                takeoff: true,
                run: () => window.dispatchEvent(new CustomEvent("terminal:run", { detail: "sudo hireme" })),
              },
            ]}
          />
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Subcomponents
   ───────────────────────────────────────────────────────── */

