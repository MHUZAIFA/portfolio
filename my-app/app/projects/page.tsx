"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowUpDown, Check, Star, ArrowUpRight, Warehouse, CalendarCheck, Rocket, Keyboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { InteractiveTerminal, type TerminalProject } from "@/components/projects/interactive-terminal";
import { MatrixRain } from "@/components/projects/matrix-rain";
import { openCalendlyDirect } from "@/components/contact/book-call";
import { ShortcutsOverlay, type Shortcut } from "@/components/projects/fun-elements";

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

function HangarBay({ project, bay }: { project: Project; bay: number }) {
  const wide = project.featured;

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
        href={`/projects/${project.id}`}
        onClick={() => hapticManager.light()}
        onMouseMove={onMove}
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
        >
          <Image
            src={project.thumbnail}
            alt=""
            fill
            sizes={wide ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"}
            className="object-cover brightness-[0.55] grayscale-[0.6] transition-[filter] duration-500 group-hover:brightness-100 group-hover:grayscale-0"
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
   Hangar shell: ceiling lamps, light cones, concrete floor, doors
   ───────────────────────────────────────────────────────── */

const LAMPS = 5;

function HangarCeiling() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full">
      {/* Roof beam */}
      <div className="absolute inset-x-0 top-0 h-3 border-b border-white/10 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0_2px,transparent_2px_28px)]" />
      <div className="absolute inset-x-0 top-3 flex justify-around">
        {Array.from({ length: LAMPS }, (_, i) => (
          <div key={i} className="relative flex flex-col items-center">
            <span className="h-1.5 w-10 rounded-b-full bg-white/80 shadow-[0_0_18px_4px_rgba(255,255,255,0.35)]" />
            {/* Light cone */}
            <span
              className="absolute top-1.5 h-152 w-88 bg-linear-to-b from-white/7 via-white/2.5 to-transparent blur-md"
              style={{ clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Sliding hangar doors that open once on load. */
function HangarDoors() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  const panel =
    "absolute inset-y-0 w-1/2 bg-[repeating-linear-gradient(90deg,#141414_0_46px,#0a0a0a_46px_48px)] shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]";
  const ease = [0.65, 0, 0.35, 1] as const;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <motion.div
        className={`${panel} left-0 border-r border-white/15`}
        initial={{ x: 0 }}
        animate={{ x: "-101%" }}
        transition={{ duration: 1.4, delay: 0.5, ease }}
      >
        <span className={`absolute inset-x-0 bottom-0 h-3 ${HAZARD}`} />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-5xl font-black tracking-tight text-white/8 md:text-7xl">
          HANG
        </span>
      </motion.div>
      <motion.div
        className={`${panel} right-0 border-l border-white/15`}
        initial={{ x: 0 }}
        animate={{ x: "101%" }}
        transition={{ duration: 1.4, delay: 0.5, ease }}
      >
        <span className={`absolute inset-x-0 bottom-0 h-3 ${HAZARD}`} />
        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-mono text-5xl font-black tracking-tight text-white/8 md:text-7xl">
          AR 01
        </span>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────── */

const SHORTCUTS: Shortcut[] = [
  { group: "Search", keys: ["/"], desc: "Focus grep search" },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [matrixOn, setMatrixOn] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;

      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        setSearchQuery("");
        searchInputRef.current?.blur();
      } else if (e.key === "?" && !typing) {
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
        initial="initial"
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

        {/* Command line: grep + sort */}
        <motion.div variants={staggerItem} className="mb-4 flex flex-col gap-2 sm:flex-row">
          <div
            className={`group relative flex flex-1 items-center gap-2 overflow-hidden rounded-lg border bg-black/40 px-3 py-2.5 backdrop-blur-sm transition-all duration-200 focus-within:bg-black/50 ${
              searchQuery && filtered.length === 0
                ? "border-rose-400/30 focus-within:border-rose-400/50 focus-within:shadow-[0_0_0_1px_rgba(251,113,133,0.25),0_0_24px_-6px_rgba(251,113,133,0.35)]"
                : "border-white/10 focus-within:border-cyan-300/40 focus-within:shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_0_24px_-6px_rgba(34,211,238,0.4)]"
            }`}
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent opacity-0 group-focus-within:opacity-100"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: searchQuery ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="shrink-0 select-none font-mono text-sm text-emerald-400/80">$</span>
            <Search className="h-3.5 w-3.5 shrink-0 text-white/40 transition-colors group-focus-within:text-cyan-300" />
            <span className="shrink-0 select-none font-mono text-xs text-cyan-300/70">grep</span>
            <span className="hidden shrink-0 select-none font-mono text-[11px] text-white/35 sm:inline">-i</span>
            <span className="shrink-0 select-none font-mono text-sm text-emerald-300/60">&quot;</span>
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="react, ai, python..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0 font-mono text-sm text-emerald-200 shadow-none placeholder:text-white/25 focus-visible:ring-0"
            />
            <span className="shrink-0 select-none font-mono text-sm text-emerald-300/60">&quot;</span>
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <AnimatePresence mode="popLayout">
                {searchQuery && (
                  <motion.span
                    key={`count-${filtered.length === 0 ? "none" : "ok"}`}
                    initial={{ opacity: 0, scale: 0.85, y: -2 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -2 }}
                    transition={{ duration: 0.15 }}
                    className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${
                      filtered.length === 0
                        ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
                        : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                    }`}
                  >
                    <span className="h-1 w-1 animate-pulse rounded-full bg-current" />
                    {filtered.length}
                  </motion.span>
                )}
              </AnimatePresence>
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                    hapticManager.light();
                  }}
                  className="rounded p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div ref={sortMenuRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setSortOpen((v) => !v);
                hapticManager.light();
              }}
              className="inline-flex h-full w-full items-center justify-between gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-xs text-white/80 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-black/40 sm:w-auto sm:min-w-[200px]"
            >
              <span className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-white/50" />
                <span className="text-white/40">--sort</span>
                <span>=</span>
                <span className="text-cyan-300">{sortOptions.find((s) => s.value === sortBy)?.label}</span>
              </span>
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
                      {sortBy === o.value && <Check className="h-3.5 w-3.5 text-cyan-300" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Category filter */}
        <motion.div
          variants={staggerItem}
          className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
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
        </motion.div>

        {/* Hangar floor */}
        <motion.section
          variants={staggerItem}
          aria-label="Projects"
          className="relative mb-24 overflow-hidden rounded-3xl border border-white/10 bg-[#060606] px-3 pb-6 pt-16 md:px-6 md:pb-8"
          style={{
            // Concrete floor: expansion joints + soft vignette
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px), radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.05), transparent 70%)",
            backgroundSize: "160px 160px, 160px 160px, 100% 100%",
          }}
        >
          <HangarCeiling />
          <HangarDoors />
          <div className="relative z-10">
          {filtered.length === 0 ? (
            <div className="relative px-6 py-16 text-center">
              <BayCorners tone="border-white/25" />
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">Hangar empty</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/55">Nothing matches that search.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs text-white transition-colors hover:border-red-400/50 hover:bg-red-500/10"
              >
                <X className="h-3.5 w-3.5" /> Show all projects
              </button>
            </div>
          ) : (
            <ol className="grid grid-flow-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <HangarBay key={p.id} project={p} bay={i + 1} />
                ))}
              </AnimatePresence>
            </ol>
          )}
          </div>
        </motion.section>

        {/* Cockpit: interactive terminal */}
        <motion.section variants={staggerItem} className="mb-24">
          <SectionLabel>Cockpit</SectionLabel>
          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">Take the controls</h2>
          <p className="mb-6 max-w-2xl text-sm text-white/60">
            A real-ish terminal. Try{" "}
            {["help", "whoami", "ls", "cat recyclevision", "sudo hireme"].map((cmd, i, arr) => (
              <span key={cmd}>
                <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-xs text-red-300">{cmd}</code>
                {i < arr.length - 2 ? ", " : i === arr.length - 2 ? " or " : "."}
              </span>
            ))}
          </p>
          <InteractiveTerminal projects={terminalProjects} onTriggerMatrix={() => setMatrixOn(true)} />
        </motion.section>

        {/* Contact */}
        <motion.section variants={staggerItem}>
          <SectionLabel>Next departure</SectionLabel>
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-white md:text-3xl">Build something together</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <CTACard
              icon={<CalendarCheck className="h-4 w-4" />}
              title="Book a 30-min call"
              desc="Grab a slot on my calendar to chat about ideas, roles, or just to say hi."
              cta="Open Calendly"
              onCta={() => void openCalendlyDirect()}
            />
            <CTACard
              icon={<Rocket className="h-4 w-4" />}
              title="Ship something together"
              desc="Hiring or collaborating? The sudo hireme command will get you there."
              cta="Run sudo hireme"
              onCta={() => window.dispatchEvent(new CustomEvent("terminal:run", { detail: "sudo hireme" }))}
            />
            <CTACard
              icon={<Keyboard className="h-4 w-4" />}
              title="Just curious?"
              desc="Press ? anywhere for shortcuts, m for the matrix, / to search."
              cta="Open shortcuts"
              onCta={() => setShortcutsOpen(true)}
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

function CTACard({
  icon,
  title,
  desc,
  cta,
  onCta,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className={`flex flex-col p-5 ${TICKET}`}>
      <Edge />
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-red-300 ring-1 ring-white/10">
        {icon}
      </span>
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-white/55">{desc}</p>
      <button
        type="button"
        onClick={() => {
          onCta();
          hapticManager.light();
        }}
        className="relative mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-red-400/50 hover:bg-red-500/10 hover:text-white"
      >
        {cta} <ArrowUpRight className="h-3 w-3" />
      </button>
    </div>
  );
}
