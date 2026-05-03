"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  X,
  GitBranch,
  GitCommit,
  Terminal,
  Folder,
  Sparkles,
  ArrowUpDown,
  Check,
  Star,
  Code2,
  Cpu,
  ChevronRight,
  Hash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { LivePreviews } from "@/components/projects/live-previews";
import { hapticManager } from "@/lib/haptic-manager";

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

const projects = [
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

type Project = (typeof projects)[number];

type SortOption = "newest" | "oldest" | "name" | "featured";

const sortOptions: { value: SortOption; label: string; flag: string }[] = [
  { value: "newest", label: "Newest", flag: "--sort=date.desc" },
  { value: "oldest", label: "Oldest", flag: "--sort=date.asc" },
  { value: "name", label: "A → Z", flag: "--sort=name" },
  { value: "featured", label: "Featured", flag: "--filter=star" },
];

const categoryMeta: Record<
  string,
  { ext: string; lang: string; color: string; icon: typeof Cpu }
> = {
  "Machine Learning & AI": { ext: ".py", lang: "Python", color: "#3572A5", icon: Cpu },
  "Mobile Application": { ext: ".tsx", lang: "TypeScript", color: "#3178c6", icon: Code2 },
  "Automation / Reporting": { ext: ".yaml", lang: "YAML", color: "#cb171e", icon: Terminal },
  "Productivity & Utilities": { ext: ".py", lang: "Python", color: "#3572A5", icon: Cpu },
  "Productivity & Tracking": { ext: ".ts", lang: "TypeScript", color: "#3178c6", icon: Code2 },
  "E-Commerce": { ext: ".tsx", lang: "TypeScript", color: "#3178c6", icon: Code2 },
  Support: { ext: ".html", lang: "HTML", color: "#e34c26", icon: Code2 },
};

function getCategoryMeta(category?: string) {
  if (!category) return { ext: ".tsx", lang: "TypeScript", color: "#3178c6", icon: Code2 };
  return categoryMeta[category] ?? { ext: ".tsx", lang: "TypeScript", color: "#3178c6", icon: Code2 };
}

// Deterministic 7-char hash from project id (for "commit" style hash)
function commitHash(id: string): string {
  let hash = 5381;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) + hash + id.charCodeAt(i)) | 0;
  return Math.abs(hash).toString(16).padStart(7, "0").slice(0, 7);
}

/* ─────────────────────────────────────────────────────────
   Hooks
   ───────────────────────────────────────────────────────── */

function useTypewriter(text: string, speed = 22, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    let frame: ReturnType<typeof setTimeout>;
    const startTimer = setTimeout(() => {
      const tick = () => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i < text.length) frame = setTimeout(tick, speed);
        else setDone(true);
      };
      tick();
    }, startDelay);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(frame!);
    };
  }, [text, speed, startDelay]);
  return { displayed, done };
}

function AnimatedNumber({ value, duration = 1.4 }: { value: number; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1000 / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{n}</>;
}

/* ─────────────────────────────────────────────────────────
   Background ambient layer
   ───────────────────────────────────────────────────────── */

const GLYPHS = [
  "{ }", ";", "=>", "</>", "( )", "[ ]", "&&", "||", "0", "1",
  "function", "const", "let", "// TODO", "*ptr", "git push",
  "useState", "async", "await", "return", "import", "yield",
  "===", "!==", "0xFF", "<div>", "0b101", "throw", "case",
];

function FloatingGlyphs() {
  const reducedMotion = useReducedMotion();
  const [glyphs, setGlyphs] = useState<
    {
      id: number;
      text: string;
      left: number;
      top: number;
      size: number;
      duration: number;
      delay: number;
      drift: number;
    }[]
  >([]);

  useEffect(() => {
    const items = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      text: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 11 + Math.random() * 22,
      duration: 14 + Math.random() * 16,
      delay: Math.random() * 6,
      drift: -30 + Math.random() * 60,
    }));
    setGlyphs(items);
  }, []);

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {glyphs.map((g) => (
        <motion.span
          key={g.id}
          className="absolute select-none font-mono text-white/[0.05] [text-shadow:0_0_20px_rgba(255,255,255,0.05)]"
          style={{ left: `${g.left}%`, top: `${g.top}%`, fontSize: g.size }}
          animate={{
            y: [0, -60, 0],
            x: [0, g.drift, 0],
            rotate: [0, 6, -6, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: g.duration,
            delay: g.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {g.text}
        </motion.span>
      ))}
    </div>
  );
}

function GridBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 opacity-[0.35]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
        backgroundSize: "32px 32px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%)",
      }}
    />
  );
}

function AmbientGlow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-40 -left-20 h-[40rem] w-[40rem] rounded-full bg-blue-500/[0.06] blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-20 h-[40rem] w-[40rem] rounded-full bg-purple-500/[0.06] blur-[120px]"
        animate={{ x: [0, -60, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Small primitives
   ───────────────────────────────────────────────────────── */

function Caret({ className = "" }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.05, repeat: Infinity, ease: "linear" }}
      className={`inline-block h-[1em] w-[2px] translate-y-[2px] bg-white/80 ${className}`}
    />
  );
}

function CodeLine({
  number,
  children,
  active,
}: {
  number: number;
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`group flex items-start gap-3 rounded-md px-2 py-0.5 transition-colors ${
        active ? "bg-white/[0.04]" : "hover:bg-white/[0.025]"
      }`}
    >
      <span className="select-none pt-0.5 text-right font-mono text-[11px] tabular-nums text-white/25 sm:w-7 sm:text-xs">
        {number.toString().padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1 font-mono text-xs leading-6 text-white/80 sm:text-sm">
        {children}
      </div>
    </div>
  );
}

/* Syntax-highlight tokens */
const Tok = {
  kw: ({ children }: { children: ReactNode }) => (
    <span className="text-purple-300">{children}</span>
  ),
  fn: ({ children }: { children: ReactNode }) => (
    <span className="text-cyan-300">{children}</span>
  ),
  str: ({ children }: { children: ReactNode }) => (
    <span className="text-emerald-300">&quot;{children}&quot;</span>
  ),
  num: ({ children }: { children: ReactNode }) => (
    <span className="text-amber-200">{children}</span>
  ),
  prop: ({ children }: { children: ReactNode }) => (
    <span className="text-sky-300">{children}</span>
  ),
  cm: ({ children }: { children: ReactNode }) => (
    <span className="text-white/35">{children}</span>
  ),
  pn: ({ children }: { children: ReactNode }) => (
    <span className="text-white/40">{children}</span>
  ),
};

/* ─────────────────────────────────────────────────────────
   IDE chrome
   ───────────────────────────────────────────────────────── */

function IDEWindow({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/70 shadow-2xl shadow-black/50 backdrop-blur-xl"
    >
      {/* Top chrome */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/80 ring-1 ring-inset ring-red-300/20 transition-transform hover:scale-110" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80 ring-1 ring-inset ring-yellow-300/20 transition-transform hover:scale-110" />
          <span className="h-3 w-3 rounded-full bg-green-500/80 ring-1 ring-inset ring-green-300/20 transition-transform hover:scale-110" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-white/40">
          <Folder className="h-3 w-3" />
          <span className="hidden sm:inline">huzaifa@portfolio</span>
          <span className="hidden sm:inline">:</span>
          <span>~/projects</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border border-white/15" />
          <span className="h-3 w-3 rounded-sm border border-white/15" />
          <span className="h-3 w-3 rounded-sm border border-white/15" />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-end gap-px border-b border-white/10 bg-white/[0.02] px-2 pt-2">
        <Tab active>projects.tsx</Tab>
        <Tab>README.md</Tab>
        <span className="ml-1 px-2 pb-2 text-xs text-white/30">+</span>
      </div>

      <div className="p-4 sm:p-6 md:p-8">{children}</div>
    </motion.div>
  );
}

function Tab({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <div
      className={`relative flex items-center gap-2 rounded-t-md border border-b-0 px-3 py-1.5 font-mono text-xs transition-colors ${
        active
          ? "border-white/15 bg-[#0a0a0c] text-white/90"
          : "border-transparent text-white/40 hover:text-white/70"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
      {children}
      {active && (
        <motion.div
          layoutId="active-tab"
          className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Tilt card wrapper
   ───────────────────────────────────────────────────────── */

function TiltCard({
  children,
  className = "",
  intensity = 6,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const rotateX = useTransform(y, [-1, 1], [intensity, -intensity]);
  const rotateY = useTransform(x, [-1, 1], [-intensity, intensity]);
  const sx = useSpring(rotateX, { stiffness: 220, damping: 22, mass: 0.4 });
  const sy = useSpring(rotateY, { stiffness: 220, damping: 22, mass: 0.4 });
  const glareX = useTransform(x, [-1, 1], ["0%", "100%"]);
  const glareY = useTransform(y, [-1, 1], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(220px circle at ${glareX} ${glareY}, rgba(255,255,255,0.12), transparent 60%)`;

  const handleMove = (e: ReactMouseEvent) => {
    if (reducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px * 2 - 1);
    y.set(py * 2 - 1);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: reducedMotion ? 0 : sx,
        rotateY: reducedMotion ? 0 : sy,
        transformStyle: "preserve-3d",
        transformPerspective: 1100,
      }}
      className={`relative ${className}`}
    >
      {children}
      {!reducedMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Project commit row (git-log aesthetic — no nested card)
   ───────────────────────────────────────────────────────── */

function ProjectCommitRow({
  project,
  index,
  isLast,
}: {
  project: Project;
  index: number;
  isLast: boolean;
}) {
  const meta = getCategoryMeta(project.category);
  const hash = commitHash(project.id);
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      {/* Vertical tree line connecting commits */}
      {!isLast && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-[11px] top-6 bottom-0 w-px bg-gradient-to-b from-white/15 via-white/10 to-white/5 sm:left-[13px]"
        />
      )}

      <Link
        href={`/projects/${project.id}`}
        onClick={() => hapticManager.light()}
        className="relative flex items-start gap-3 rounded-md px-1 py-3 transition-colors hover:bg-white/[0.025] sm:gap-4 sm:px-2"
      >
        {/* Commit node */}
        <div className="relative z-10 flex shrink-0 flex-col items-center pt-1.5">
          <span
            className="h-[10px] w-[10px] rounded-full ring-[3px] ring-[#0a0a0c] transition-all group-hover:scale-125 sm:h-3 sm:w-3"
            style={{
              backgroundColor: meta.color,
              boxShadow: `0 0 10px ${meta.color}, 0 0 2px ${meta.color}`,
            }}
          />
        </div>

        {/* Thumbnail (flat, no border) */}
        {project.thumbnail && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white/[0.03] sm:h-14 sm:w-14">
            <Image
              src={project.thumbnail}
              alt={project.name}
              fill
              className="object-cover opacity-90 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
              sizes="56px"
            />
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header: commit hash · filename · date */}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-mono text-[11px] text-white/45">
            <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-white/70 transition-colors group-hover:bg-white/[0.08] group-hover:text-white">
              {hash}
            </span>
            <span className="text-white/25">·</span>
            <span className="text-white/70">
              {project.id}
              <span className="text-white/35">{meta.ext}</span>
            </span>
            {project.featured && (
              <span className="inline-flex items-center gap-0.5 text-yellow-300/90">
                <Star className="h-2.5 w-2.5 fill-yellow-300 text-yellow-300" />
                <span className="text-[10px]">starred</span>
              </span>
            )}
            <span className="ml-auto shrink-0 text-[10px] text-white/35 sm:text-[11px]">
              {project.date}
            </span>
          </div>

          {/* Title + arrow */}
          <div className="mt-1 flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-white/95 transition-colors group-hover:text-white sm:text-lg">
              {project.name}
            </h3>
            <ChevronRight className="h-4 w-4 shrink-0 text-white/20 transition-all group-hover:translate-x-1 group-hover:text-cyan-300" />
          </div>

          {/* Description */}
          <p className="mt-1 line-clamp-2 font-mono text-[11px] leading-relaxed text-white/55 sm:text-xs">
            <span className="text-white/25">{"// "}</span>
            {project.description}
          </p>

          {/* Meta + tags inline */}
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] sm:text-[11px]">
            <span className="inline-flex items-center gap-1 text-white/45">
              <Icon className="h-3 w-3" />
              {project.category}
            </span>

            {project.technologies && project.technologies.length > 0 && (
              <>
                <span className="text-white/20">·</span>
                <div className="flex flex-wrap items-center gap-1">
                  {project.technologies.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-white/60 transition-colors group-hover:border-emerald-300/20 group-hover:bg-emerald-300/[0.06] group-hover:text-emerald-200/90"
                    >
                      {t}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-white/40">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────── */

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { scrollYProgress } = useScroll();
  const scrollX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  // Live clock for the status bar
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Keyboard shortcut "/" to focus search
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

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, []);

  const totalTech = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies?.forEach((t) => set.add(t)));
    return set.size;
  }, []);

  const yearRange = useMemo(() => {
    const ys = projects.map((p) => parseDate(p.sortDate).getFullYear());
    return { min: Math.min(...ys), max: Math.max(...ys) };
  }, []);

  const filtered = useMemo(() => {
    let r = [...projects];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.technologies?.some((t) => t.toLowerCase().includes(q))
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

  const hasActiveFilters = !!(searchQuery.trim() || activeCategory);
  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory(null);
    hapticManager.light();
  };

  // Typewriter for the doc-comment subtitle
  const intro = useTypewriter(
    "A living archive of things I've designed, built, and learned from.",
    18,
    400
  );

  // Build a deterministic "current branch" label from active filter state
  const branchLabel = activeCategory
    ? `feat/${activeCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
    : searchQuery.trim()
    ? "search/temp"
    : "main";

  return (
    <div className="relative">
      <GridBackdrop />
      <AmbientGlow />
      <FloatingGlyphs />

      {/* Scroll progress bar */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
        style={{ scaleX: scrollX }}
      />

      <div className="mx-auto max-w-6xl px-3 pt-24 pb-32 sm:px-4 md:px-6 md:pt-12 md:pb-24 mt-12">
        <IDEWindow>
          <div className="font-mono">
            {/* JSDoc style intro */}
            <CodeLine number={1}>
              <Tok.cm>{"/**"}</Tok.cm>
            </CodeLine>
            <CodeLine number={2}>
              <Tok.cm>{" * @author  "}</Tok.cm>
              <span className="text-white/80">Mohammed Huzaifa</span>
            </CodeLine>
            <CodeLine number={3}>
              <Tok.cm>{" * @file    "}</Tok.cm>
              <span className="text-white/80">projects.tsx</span>
            </CodeLine>
            <CodeLine number={4}>
              <Tok.cm>
                {" * @desc    "}
                {intro.displayed}
                {!intro.done && <Caret />}
              </Tok.cm>
            </CodeLine>
            <CodeLine number={5}>
              <Tok.cm>{" */"}</Tok.cm>
            </CodeLine>

            {/* Title - large, glitchy on hover */}
            <div className="my-5 sm:my-7">
              <GlitchTitle>My Projects</GlitchTitle>
            </div>

            {/* Stats as console output */}
            <CodeLine number={6}>
              <Tok.cm>{"// build metrics"}</Tok.cm>
            </CodeLine>
            <CodeLine number={7}>
              <Tok.kw>const</Tok.kw> <Tok.fn>stats</Tok.fn> <Tok.pn>=</Tok.pn>{" "}
              <span className="text-white/40">{"{"}</span>
            </CodeLine>
            <StatLine
              n={8}
              label="projects"
              valueNode={<AnimatedNumber value={projects.length} />}
              icon={<Folder className="h-3 w-3" />}
              tint="text-blue-300"
            />
            <StatLine
              n={9}
              label="technologies"
              valueNode={<AnimatedNumber value={totalTech} />}
              icon={<Code2 className="h-3 w-3" />}
              tint="text-purple-300"
            />
            <StatLine
              n={10}
              label="yearsActive"
              valueNode={<AnimatedNumber value={yearRange.max - yearRange.min + 1} />}
              icon={<Sparkles className="h-3 w-3" />}
              tint="text-amber-300"
              suffix={
                <span className="ml-1 text-white/30">
                  {" "}
                  <Tok.cm>{`// ${yearRange.min}–${yearRange.max}`}</Tok.cm>
                </span>
              }
            />
            <CodeLine number={11}>
              <span className="text-white/40">{"}"}</span>{" "}
              <Tok.cm>{"// hot-reloaded ✓"}</Tok.cm>
            </CodeLine>

            <Divider />

            {/* Terminal command bar */}
            <CodeLine number={12}>
              <Tok.cm>{"// query"}</Tok.cm>
            </CodeLine>
            <div className="my-2 flex flex-col gap-2 sm:flex-row">
              <div
                className={`group relative flex flex-1 items-center gap-2 overflow-hidden rounded-lg border bg-black/40 px-3 py-2.5 backdrop-blur-sm transition-all duration-200 focus-within:bg-black/50 ${
                  searchQuery && filtered.length === 0
                    ? "border-rose-400/30 focus-within:border-rose-400/50 focus-within:shadow-[0_0_0_1px_rgba(251,113,133,0.25),0_0_24px_-6px_rgba(251,113,133,0.35)]"
                    : "border-white/10 focus-within:border-cyan-300/40 focus-within:shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_0_24px_-6px_rgba(34,211,238,0.4)]"
                }`}
              >
                {/* Focus scan line */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent opacity-0 group-focus-within:opacity-100"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: searchQuery ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Prompt + command */}
                <span className="shrink-0 select-none font-mono text-sm text-emerald-400/80">
                  $
                </span>
                <Search className="h-3.5 w-3.5 shrink-0 text-white/40 transition-colors group-focus-within:text-cyan-300" />
                <span className="shrink-0 select-none font-mono text-xs text-cyan-300/70">
                  grep
                </span>
                <span className="hidden shrink-0 select-none font-mono text-[11px] text-white/35 sm:inline">
                  -i
                </span>

                {/* Quoted input */}
                <span className="shrink-0 select-none font-mono text-sm text-emerald-300/60">
                  &quot;
                </span>
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="react, ai, python..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0 font-mono text-sm text-emerald-200 shadow-none placeholder:text-white/25 focus-visible:ring-0"
                />
                <span
                  className={`shrink-0 select-none font-mono text-sm text-emerald-300/60 transition-opacity opacity-100`}
                >
                  &quot;
                </span>

                {/* Right: live match count + clear / shortcut */}
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

                  {searchQuery ? (
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
                  ) : (
                    <></>
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
                    <span className="text-cyan-300">
                      {sortOptions.find((s) => s.value === sortBy)?.label}
                    </span>
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
                            sortBy === o.value
                              ? "bg-white/10 text-white"
                              : "text-white/65 hover:bg-white/5 hover:text-white"
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
            </div>

            {/* Branch pills */}
            <CodeLine number={13}>
              <Tok.cm>{"// branches"}</Tok.cm>
            </CodeLine>
            <div className="-mx-1 my-2 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <BranchPill
                active={activeCategory === null}
                onClick={() => {
                  setActiveCategory(null);
                  hapticManager.light();
                }}
                label="main"
                count={projects.length}
                primary
              />
              {categories.map((cat) => {
                const count = projects.filter((p) => p.category === cat).length;
                const branch = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                return (
                  <BranchPill
                    key={cat}
                    active={activeCategory === cat}
                    onClick={() => {
                      setActiveCategory(activeCategory === cat ? null : cat);
                      hapticManager.light();
                    }}
                    label={branch}
                    count={count}
                  />
                );
              })}
            </div>

            <Divider />

            {/* Result line + clear */}
            <div className="my-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] sm:text-xs">
              <div className="text-white/55">
                <Tok.cm>{"// "}</Tok.cm>
                <Tok.fn>found</Tok.fn>
                <span className="text-white/40">(</span>
                <span className="text-amber-200">{filtered.length}</span>
                <span className="text-white/40">)</span>
                <span className="ml-2 text-white/35">
                  of <span className="text-white/55">{projects.length}</span>
                </span>
                {hasActiveFilters && <span className="ml-2 text-cyan-300/80">· filtered</span>}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3 w-3" />
                  reset()
                </button>
              )}
            </div>

            {/* Project list */}
            <CodeLine number={14}>
              <Tok.kw>const</Tok.kw> <Tok.fn>projects</Tok.fn> <Tok.pn>=</Tok.pn>{" "}
              <Tok.kw>await</Tok.kw> <Tok.fn>db</Tok.fn>
              <span className="text-white/40">.</span>
              <Tok.fn>query</Tok.fn>
              <span className="text-white/40">(</span>
              <span className="text-white/40">)</span>
              <Tok.pn>;</Tok.pn>
            </CodeLine>

            <div className="mt-4 sm:mt-5">
              <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                  <EmptyState onReset={clearFilters} />
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col"
                  >
                    {filtered.map((p, i) => (
                      <ProjectCommitRow
                        key={p.id}
                        project={p}
                        index={i}
                        isLast={i === filtered.length - 1}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Divider />

            {/* Live previews — animated mini-scenes of what each project type looks like */}
            <CodeLine number={15}>
              <Tok.cm>{"// labs · live previews"}</Tok.cm>
            </CodeLine>
            <CodeLine number={16}>
              <Tok.kw>const</Tok.kw> <Tok.fn>previews</Tok.fn> <Tok.pn>=</Tok.pn>{" "}
              <Tok.fn>render</Tok.fn>
              <span className="text-white/40">(</span>
              <span className="text-emerald-300">&quot;running&quot;</span>
              <span className="text-white/40">)</span>
              <Tok.pn>;</Tok.pn>
            </CodeLine>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 sm:mt-4"
            >
              <LivePreviews />
            </motion.div>

            {/* Trailing prompt */}
            <div className="mt-8 flex items-center gap-2 font-mono text-xs text-white/40">
              <span className="text-emerald-300/70">huzaifa@portfolio</span>
              <span className="text-white/30">:</span>
              <span className="text-cyan-300/70">~/projects</span>
              <span className="text-white/30">$</span>
              <span className="text-white/70">echo &quot;end of file&quot;</span>
              <Caret />
            </div>
          </div>

          {/* Status bar */}
          <div className="-mx-4 mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[0.02] px-4 py-2 font-mono text-[10px] text-white/45 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 md:text-[11px]">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="inline-flex items-center gap-1.5">
                <GitBranch className="h-3 w-3 text-cyan-300/70" />
                <span className="text-white/70">{branchLabel}</span>
              </span>
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <Hash className="h-3 w-3" />
                {filtered.length} matches
              </span>
              <span className="hidden items-center gap-1.5 md:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                live
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="hidden sm:inline">UTF-8</span>
              <span>TypeScript</span>
              <span className="tabular-nums">
                {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </IDEWindow>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Subcomponents
   ───────────────────────────────────────────────────────── */

function StatLine({
  n,
  label,
  valueNode,
  icon,
  tint,
  suffix,
}: {
  n: number;
  label: string;
  valueNode: ReactNode;
  icon: ReactNode;
  tint: string;
  suffix?: ReactNode;
}) {
  return (
    <CodeLine number={n}>
      <span className="ml-2 inline-flex items-center gap-2">
        <span className={`inline-flex h-4 w-4 items-center justify-center rounded ${tint}`}>
          {icon}
        </span>
        <Tok.prop>{label}</Tok.prop>
        <Tok.pn>:</Tok.pn>{" "}
        <span className="text-amber-200 tabular-nums">{valueNode}</span>
        <Tok.pn>,</Tok.pn>
        {suffix}
      </span>
    </CodeLine>
  );
}

function BranchPill({
  active,
  onClick,
  label,
  count,
  primary,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  primary?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`group relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[11px] transition-all sm:text-xs ${
        active
          ? primary
            ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100 shadow-[0_0_24px_-6px_rgba(34,211,238,0.6)]"
            : "border-emerald-300/40 bg-emerald-300/10 text-emerald-100 shadow-[0_0_24px_-6px_rgba(110,231,183,0.5)]"
          : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:bg-white/10 hover:text-white"
      }`}
    >
      <GitBranch className="h-3 w-3" />
      <span>{label}</span>
      <span
        className={`rounded-full px-1.5 text-[10px] ${
          active ? "bg-black/30 text-white/90" : "bg-white/10 text-white/55"
        }`}
      >
        {count}
      </span>
      {active && (
        <motion.span
          layoutId="active-branch-glow"
          className="pointer-events-none absolute -inset-px rounded-full ring-1 ring-white/20"
        />
      )}
    </motion.button>
  );
}

function Divider() {
  return (
    <div className="relative my-4 flex items-center font-mono text-[10px] text-white/20">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <span className="px-3">{"//"}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

function GlitchTitle({ children }: { children: string }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="group relative inline-block cursor-default font-mono text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
      data-text={children}
    >
      <span className="relative bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
        {children}
      </span>
      {/* Cyan offset layer */}
      <span
        aria-hidden
        className="absolute inset-0 select-none text-cyan-300/0 mix-blend-screen transition-all duration-200 group-hover:translate-x-[2px] group-hover:text-cyan-300/70"
      >
        {children}
      </span>
      {/* Pink offset layer */}
      <span
        aria-hidden
        className="absolute inset-0 select-none text-pink-400/0 mix-blend-screen transition-all duration-200 group-hover:-translate-x-[2px] group-hover:text-pink-400/60"
      >
        {children}
      </span>
      {/* Underline accent */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-1.5 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-70"
      />
    </motion.h1>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl border border-dashed border-white/10 bg-black/30 px-6 py-14 text-center"
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <Search className="h-5 w-5 text-white/40" />
      </div>
      <h3 className="mb-1 font-mono text-sm text-white">
        <span className="text-rose-300">throw</span>{" "}
        <span className="text-white/70">new NoMatchesError(</span>
        <span className="text-emerald-300">&quot;0 results&quot;</span>
        <span className="text-white/70">)</span>
      </h3>
      <p className="mx-auto mb-5 max-w-md font-mono text-xs text-white/45">
        <span className="text-white/30">{"// "}</span>
        Try a different keyword or reset the filters to see everything.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 py-2 font-mono text-xs font-medium text-white transition-all hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
      >
        <X className="h-3.5 w-3.5" />
        reset()
      </button>
    </motion.div>
  );
}
