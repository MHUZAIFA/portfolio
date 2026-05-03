"use client";

import {
  motion,
  AnimatePresence,
  useSpring,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Search,
  X,
  GitBranch,
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
  Keyboard,
  Play,
  Rocket,
  CircleDot,
  CalendarCheck,
  FileText,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProjectPreview } from "@/components/projects/live-previews";
import { hapticManager } from "@/lib/haptic-manager";
import {
  InteractiveTerminal,
  type TerminalProject,
} from "@/components/projects/interactive-terminal";
import { MatrixRain } from "@/components/projects/matrix-rain";
import { openCalendlyDirect } from "@/components/contact/book-call";
import {
  LanguageBar,
  type LangSlice,
  ShortcutsOverlay,
  type Shortcut,
  PersonaPicker,
  PERSONAS,
  type PersonaId,
  SectionHeader,
} from "@/components/projects/fun-elements";

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

function AmbientGlow({ accent }: { accent?: string }) {
  // accent is an rgb triplet string like "34,211,238"
  const accentRgb = accent ?? "34,211,238";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-40 -left-20 h-[40rem] w-[40rem] rounded-full blur-[120px]"
        style={{ backgroundColor: `rgba(${accentRgb}, 0.07)` }}
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

type TabId = "projects" | "readme" | "terminal";

const TAB_LIST: { id: TabId; label: string; dot: string }[] = [
  { id: "projects", label: "projects.tsx", dot: "#3178c6" },
  { id: "readme", label: "README.md", dot: "#60a5fa" },
  { id: "terminal", label: "terminal.sh", dot: "#34d399" },
];

function IDEWindow({
  children,
  accent,
  activeTab,
  onTabChange,
}: {
  children: ReactNode;
  accent?: string;
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}) {
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
        {TAB_LIST.map((t) => (
          <Tab
            key={t.id}
            active={activeTab === t.id}
            accent={accent}
            dot={t.dot}
            onClick={() => {
              if (activeTab !== t.id) {
                onTabChange(t.id);
                hapticManager.light();
              }
            }}
          >
            {t.label}
          </Tab>
        ))}
        <span className="ml-1 px-2 pb-2 text-xs text-white/30">+</span>
      </div>

      <div
        className={
          activeTab === "terminal"
            ? "p-0"
            : "p-4 sm:p-6 md:p-8"
        }
      >
        {children}
      </div>
    </motion.div>
  );
}

function Tab({
  children,
  active,
  accent,
  dot,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  accent?: string;
  dot?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex cursor-pointer items-center gap-2 rounded-t-md border border-b-0 px-3 py-1.5 font-mono text-xs transition-colors ${
        active
          ? "border-white/15 bg-[#0a0a0c] text-white/90"
          : "border-transparent text-white/40 hover:bg-white/[0.03] hover:text-white/75"
      }`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: dot ?? accent ?? "rgba(34,211,238,0.8)" }}
      />
      {children}
      {active && (
        <motion.div
          layoutId="active-tab"
          className="absolute inset-x-0 -bottom-px h-px"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, ${
              accent ?? "rgba(34,211,238,0.7)"
            }, transparent)`,
          }}
        />
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   Project commit row (git-log aesthetic — no nested card)
   ───────────────────────────────────────────────────────── */

function ProjectCommitRow({
  project,
  index,
}: {
  project: Project;
  index: number;
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
      {/* Vertical tree line connecting commits — always rendered so the trail stays continuous */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[11px] top-6 bottom-0 w-px bg-gradient-to-b from-white/15 via-white/10 to-white/8 sm:left-[13px]"
      />

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

        {/* Main row: text + live preview */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:gap-5">
          {/* Left: text content */}
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

          {/* Right: live animated preview matched to project type */}
          <div className="w-full shrink-0 md:w-[280px] lg:w-[320px]">
            <ProjectPreview projectId={project.id} category={project.category} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Timeline tail — sits below the last commit so the tree
   doesn't end on a hard cut. Continues the line and ends
   with an open "root" terminator node.
   ───────────────────────────────────────────────────────── */

function TimelineTail() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
    >
      {/* Continuing line that fades into the void */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[11px] top-0 h-10 w-px bg-gradient-to-b from-white/8 via-white/5 to-transparent sm:left-[13px]"
      />

      {/* Terminator row */}
      <div className="relative flex items-center gap-3 px-1 pt-10 pb-2 sm:gap-4 sm:px-2">
        <div className="relative z-10 flex shrink-0 flex-col items-center">
          <motion.span
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="h-[10px] w-[10px] rounded-full border border-white/30 bg-[#0a0a0c] ring-[3px] ring-[#0a0a0c] sm:h-3 sm:w-3"
          />
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-mono text-[11px] text-white/40">
          <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-white/55">
            0000000
          </span>
          <span className="text-white/25">·</span>
          <span className="text-white/50">root commit</span>
          <span className="text-white/25">·</span>
          <span className="text-white/35">end of log</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────── */

const SHORTCUTS: Shortcut[] = [
  { group: "Search", keys: ["/"], desc: "Focus grep search" },
  { group: "Search", keys: ["Esc"], desc: "Clear / blur search" },
  { group: "Navigation", keys: ["?"], desc: "Toggle this panel" },
  { group: "Navigation", keys: ["t"], desc: "Focus interactive terminal" },
  { group: "Navigation", keys: ["g", "h"], desc: "Go home" },
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
  const [now, setNow] = useState(() => new Date());
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [matrixOn, setMatrixOn] = useState(false);
  const [persona, setPersona] = useState<PersonaId>("coder");
  const [activeTab, setActiveTab] = useState<TabId>("projects");
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { scrollYProgress } = useScroll();
  const scrollX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  const activePersona = useMemo(
    () => PERSONAS.find((p) => p.id === persona) ?? PERSONAS[0],
    [persona],
  );

  // Live clock for the status bar
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing =
        t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;

      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === "Escape" &&
        document.activeElement === searchInputRef.current
      ) {
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

  // Language distribution for the bar
  const languageDistribution = useMemo<LangSlice[]>(() => {
    const bucket = new Map<string, { count: number; color: string }>();
    projects.forEach((p) => {
      const meta = getCategoryMeta(p.category);
      const cur = bucket.get(meta.lang);
      if (cur) cur.count += 1;
      else bucket.set(meta.lang, { count: 1, color: meta.color });
    });
    return [...bucket.entries()].map(([lang, { count, color }]) => ({
      lang,
      count,
      color,
    }));
  }, []);

  // Map language click → category filter
  const onFilterByLang = (lang: string) => {
    const cat = Object.entries(categoryMeta).find(
      ([, m]) => m.lang === lang,
    )?.[0];
    if (cat) setActiveCategory((prev) => (prev === cat ? null : cat));
  };

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
    <div className="relative bg-black">
      {/* pure-black base so the page is truly #000 regardless of scroll/theme */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-30 bg-black"
      />
      <GridBackdrop />
      <AmbientGlow accent={activePersona.accentRgb} />
      <FloatingGlyphs />

      {/* Matrix rain overlay */}
      <AnimatePresence>
        {matrixOn && <MatrixRain onClose={() => setMatrixOn(false)} />}
      </AnimatePresence>

      {/* Shortcuts overlay */}
      <ShortcutsOverlay
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        shortcuts={SHORTCUTS}
      />

      {/* Scroll progress bar — themed by persona */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 h-px origin-left"
        style={{
          scaleX: scrollX,
          backgroundImage: `linear-gradient(90deg, ${activePersona.accent}, #a78bfa, #f472b6)`,
        }}
      />

      <div className="mx-auto max-w-6xl px-3 py-24 pb-32 sm:px-4 md:px-6 mt-12">
        <IDEWindow
          accent={activePersona.accent}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          <AnimatePresence mode="wait">
            {activeTab === "readme" && (
              <motion.div
                key="readme"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <ReadmeView
                  projectCount={projects.length}
                  totalTech={totalTech}
                  yearRange={yearRange}
                  allProjects={projects}
                  onJumpToProjects={() => setActiveTab("projects")}
                  onJumpToTerminal={() => setActiveTab("terminal")}
                />
              </motion.div>
            )}

            {activeTab === "terminal" && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="w-full min-w-0"
              >
                <TerminalView
                  projects={terminalProjects}
                  onTriggerMatrix={() => setMatrixOn(true)}
                  onThemeChange={(t) => setPersona(t)}
                />
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
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
              <GlitchTitle accent={activePersona.accent}>My Projects</GlitchTitle>
              <p className="mt-3 max-w-xl font-mono text-[11px] text-white/45 sm:text-xs">
                <span className="text-white/25">{"// "}</span>
                for coders, architects, AI builders & designers — poke around,
                run commands, break things.
              </p>
            </div>

            {/* Persona picker */}
            <div className="my-4 rounded-lg border border-white/5 bg-white/[0.015] p-3 sm:p-4">
              <PersonaPicker value={persona} onChange={setPersona} />
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

            {/* Language distribution bar */}
            <div className="my-4 rounded-lg border border-white/5 bg-white/[0.015] p-3 sm:p-4">
              <LanguageBar
                data={languageDistribution}
                total={projects.length}
                onFilter={onFilterByLang}
              />
            </div>

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
                      />
                    ))}
                    <TimelineTail />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Divider />

            {/* Interactive terminal — REPL for visitors */}
            <div className="my-4">
              <SectionHeader
                num="15"
                label="Interactive Shell"
                note="type · explore · break · have fun"
                icon={<Terminal className="h-4 w-4" />}
              />
              <p className="mt-2 max-w-2xl font-mono text-[11px] leading-relaxed text-white/50 sm:text-xs">
                <span className="text-white/25">{"// "}</span>
                A real-ish terminal. Try{" "}
                <span className="rounded bg-white/[0.05] px-1 py-0.5 text-cyan-300">
                  help
                </span>
                ,{" "}
                <span className="rounded bg-white/[0.05] px-1 py-0.5 text-cyan-300">
                  whoami
                </span>
                ,{" "}
                <span className="rounded bg-white/[0.05] px-1 py-0.5 text-cyan-300">
                  ls
                </span>
                ,{" "}
                <span className="rounded bg-white/[0.05] px-1 py-0.5 text-cyan-300">
                  cat recyclevision
                </span>
                , or{" "}
                <span className="rounded bg-white/[0.05] px-1 py-0.5 text-cyan-300">
                  sudo hireme
                </span>
                .
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 sm:mt-4"
            >
              <InteractiveTerminal
                projects={terminalProjects}
                onTriggerMatrix={() => setMatrixOn(true)}
                onThemeChange={(t) => setPersona(t)}
              />
            </motion.div>

            <Divider />

            {/* Collaboration CTA */}
            <div className="my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <CTACard
                accent={activePersona.accent}
                accentRgb={activePersona.accentRgb}
                icon={<CalendarCheck className="h-4 w-4" />}
                title="book a 30-min call"
                desc="Grab a slot on my calendar — chat about ideas, roles, or just to say hi."
                cta="open calendly"
                onCta={() => {
                  void openCalendlyDirect();
                }}
              />
              <CTACard
                accent={activePersona.accent}
                accentRgb={activePersona.accentRgb}
                icon={<Rocket className="h-4 w-4" />}
                title="ship something together"
                desc="If you're hiring or collaborating, the `sudo hireme` command will get you there."
                cta="run sudo hireme"
                onCta={() => {
                  window.dispatchEvent(
                    new CustomEvent("terminal:run", { detail: "sudo hireme" }),
                  );
                }}
              />
              <CTACard
                accent={activePersona.accent}
                accentRgb={activePersona.accentRgb}
                icon={<Play className="h-4 w-4" />}
                title="just curious?"
                desc="Press `?` anywhere for shortcuts, `m` for the matrix, `/` to search."
                cta="open shortcuts"
                onCta={() => setShortcutsOpen(true)}
              />
            </div>

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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status bar — adapts to the active tab */}
          <div
            className={`flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[0.02] py-2 font-mono text-[10px] text-white/45 md:text-[11px] ${
              activeTab === "terminal"
                ? "mt-0 px-4 sm:px-6 md:px-8"
                : "mt-6 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8"
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <span
                className="inline-flex items-center gap-1.5"
                style={{ color: activePersona.accent }}
              >
                <GitBranch className="h-3 w-3" />
                <span>
                  {activeTab === "projects"
                    ? branchLabel
                    : activeTab === "readme"
                    ? "docs/main"
                    : "zsh/interactive"}
                </span>
              </span>
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <Hash className="h-3 w-3" />
                {activeTab === "projects"
                  ? `${filtered.length} matches`
                  : activeTab === "readme"
                  ? `${projects.length} entries`
                  : "live shell"}
              </span>
              <span className="hidden items-center gap-1.5 md:inline-flex">
                <span
                  className="h-1.5 w-1.5 animate-pulse rounded-full"
                  style={{ backgroundColor: activePersona.accent }}
                />
                live · {activePersona.label.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setShortcutsOpen(true)}
                className="hidden items-center gap-1 text-white/55 transition hover:text-white sm:inline-flex"
              >
                <Keyboard className="h-3 w-3" />
                <kbd className="rounded border border-white/15 bg-white/5 px-1 py-0 text-[9px] text-white/70">
                  ?
                </kbd>
              </button>
              <span className="hidden sm:inline">UTF-8</span>
              <span>
                {activeTab === "projects"
                  ? "TypeScript"
                  : activeTab === "readme"
                  ? "Markdown"
                  : "Shell"}
              </span>
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

function GlitchTitle({
  children,
  accent,
}: {
  children: string;
  accent?: string;
}) {
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
      {/* Accent offset layer */}
      <span
        aria-hidden
        className="absolute inset-0 select-none opacity-0 mix-blend-screen transition-all duration-200 group-hover:translate-x-[2px] group-hover:opacity-70"
        style={{ color: accent ?? "rgb(34,211,238)" }}
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
        className="absolute -bottom-1.5 left-0 h-[3px] w-full origin-left rounded-full opacity-70"
        style={{
          backgroundImage: `linear-gradient(90deg, ${
            accent ?? "#22d3ee"
          }, #a78bfa, #f472b6)`,
        }}
      />
    </motion.h1>
  );
}

function CTACard({
  icon,
  title,
  desc,
  cta,
  onCta,
  accent,
  accentRgb,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  cta: string;
  onCta: () => void;
  accent: string;
  accentRgb: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.015] p-4 transition-all hover:border-white/25"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(${accentRgb},0.12), transparent 60%)`,
        }}
      />
      <div className="flex items-start gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border"
          style={{
            color: accent,
            borderColor: `rgba(${accentRgb},0.35)`,
            backgroundColor: `rgba(${accentRgb},0.08)`,
          }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-mono text-sm font-semibold text-white/95">
            {title}
          </h4>
          <p className="mt-1 font-mono text-[11px] leading-relaxed text-white/55">
            {desc}
          </p>
          <button
            type="button"
            onClick={() => {
              onCta();
              hapticManager.light();
            }}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-white/85 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
            style={{
              boxShadow: `0 0 0 0 rgba(${accentRgb},0.0)`,
            }}
          >
            <CircleDot className="h-3 w-3" style={{ color: accent }} />
            {cta}
          </button>
        </div>
      </div>
    </motion.div>
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

/* ─────────────────────────────────────────────────────────
   README.md view — simplified, markdown-styled text
   ───────────────────────────────────────────────────────── */

function MdHeading({
  level,
  children,
}: {
  level: 1 | 2 | 3;
  children: ReactNode;
}) {
  if (level === 1) {
    return (
      <h1 className="font-mono text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
        <span className="mr-2 text-white/30">#</span>
        {children}
      </h1>
    );
  }
  if (level === 2) {
    return (
      <h2 className="mt-8 mb-3 border-b border-white/10 pb-2 font-mono text-base font-semibold text-white/90 sm:text-lg">
        <span className="mr-2 text-white/30">##</span>
        {children}
      </h2>
    );
  }
  return (
    <h3 className="mt-5 mb-2 font-mono text-sm font-semibold text-white/85">
      <span className="mr-2 text-white/30">###</span>
      {children}
    </h3>
  );
}

function MdBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2 text-[13px] leading-relaxed text-white/75">
      <span className="select-none text-white/30">−</span>
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  );
}

function ReadmeView({
  projectCount,
  totalTech,
  yearRange,
  allProjects,
  onJumpToProjects,
  onJumpToTerminal,
}: {
  projectCount: number;
  totalTech: number;
  yearRange: { min: number; max: number };
  allProjects: Project[];
  onJumpToProjects: () => void;
  onJumpToTerminal: () => void;
}) {
  const techStack = [
    "TypeScript",
    "Python",
    "React",
    "Next.js",
    "Angular",
    "TailwindCSS",
    "Firebase",
    "n8n",
    "Hugging Face",
    "PWA",
  ];

  return (
    <div className="font-mono">
      {/* File header */}
      <div className="mb-6 flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-[11px] text-white/45">
        <FileText className="h-3.5 w-3.5 text-blue-300" />
        <span className="text-white/65">README.md</span>
        <span className="text-white/25">·</span>
        <span>markdown</span>
        <span className="ml-auto text-white/35">{projectCount} entries</span>
      </div>

      <MdHeading level={1}>Mohammed Huzaifa — Projects</MdHeading>
      <p className="mt-4 border-l-2 border-cyan-300/40 bg-white/[0.02] px-3 py-2 font-mono text-[13px] italic text-white/70">
        &gt; A living archive of things I&apos;ve designed, built, and learned
        from. Each entry is a story — what it does, why it exists, and what I
        took away.
      </p>

      <MdHeading level={2}>What you&apos;ll find</MdHeading>
      <ul className="space-y-1.5">
        <MdBullet>
          <span className="text-amber-200">{projectCount}</span> hand-picked
          projects spanning ML/AI, mobile, web, and automation.
        </MdBullet>
        <MdBullet>
          <span className="text-amber-200">{totalTech}</span> technologies
          across <span className="text-amber-200">{yearRange.max - yearRange.min + 1}</span>{" "}
          years (<span className="text-white/55">{yearRange.min}–{yearRange.max}</span>).
        </MdBullet>
        <MdBullet>
          Animated mini-previews showing what each project type{" "}
          <em className="not-italic text-white/90">looks like</em> in motion.
        </MdBullet>
        <MdBullet>
          A real-ish interactive terminal — try{" "}
          <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-cyan-300">
            help
          </code>
          ,{" "}
          <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-cyan-300">
            ls
          </code>
          , or{" "}
          <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-cyan-300">
            sudo hireme
          </code>
          .
        </MdBullet>
      </ul>

      <MdHeading level={2}>Tech stack</MdHeading>
      <div className="flex flex-wrap gap-1.5">
        {techStack.map((t) => (
          <span
            key={t}
            className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-white/70"
          >
            {t}
          </span>
        ))}
      </div>

      {allProjects.length > 0 && (
        <>
          <MdHeading level={2}>Projects</MdHeading>
          <ol className="space-y-2.5">
            {allProjects.map((p, i) => (
              <li
                key={p.id}
                className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2.5"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-mono text-[11px] tabular-nums text-white/35">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <Link
                    href={`/projects/${p.id}`}
                    className="font-mono text-sm font-semibold text-white/95 underline-offset-4 hover:text-cyan-200 hover:underline"
                  >
                    {p.name}
                  </Link>
                  {p.featured && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-yellow-300/10 px-1 py-0.5 font-mono text-[9px] text-yellow-200">
                      <Star className="h-2.5 w-2.5 fill-yellow-300 text-yellow-300" />
                      starred
                    </span>
                  )}
                  <span className="text-white/25">·</span>
                  <span className="font-mono text-[11px] text-white/45">
                    {p.category}
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-white/35">
                    {p.date}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/65">
                  {p.description}
                </p>
                {p.technologies && p.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.technologies.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-white/55"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </>
      )}

      <MdHeading level={2}>Get in touch</MdHeading>
      <ul className="space-y-1.5">
        <MdBullet>
          <button
            type="button"
            onClick={() => {
              void openCalendlyDirect();
              hapticManager.light();
            }}
            className="inline-flex items-center gap-1.5 font-mono text-[13px] text-cyan-200 underline-offset-4 hover:underline"
          >
            <CalendarCheck className="h-3.5 w-3.5" />
            Book a 30-min call
          </button>{" "}
          <span className="text-white/40">— grab a slot on my calendar.</span>
        </MdBullet>
        <MdBullet>
          <button
            type="button"
            onClick={() => {
              onJumpToTerminal();
              window.dispatchEvent(
                new CustomEvent("terminal:run", { detail: "sudo hireme" }),
              );
            }}
            className="inline-flex items-center gap-1.5 font-mono text-[13px] text-emerald-200 underline-offset-4 hover:underline"
          >
            <Terminal className="h-3.5 w-3.5" />
            Run `sudo hireme`
          </button>{" "}
          <span className="text-white/40">— jump to the shell tab.</span>
        </MdBullet>
        <MdBullet>
          <a
            href="mailto:mhuzaifa.career@outlook.com"
            className="inline-flex items-center gap-1.5 font-mono text-[13px] text-pink-200 underline-offset-4 hover:underline"
          >
            <Mail className="h-3.5 w-3.5" />
            mhuzaifa.career@outlook.com
          </a>
        </MdBullet>
      </ul>

      <MdHeading level={2}>License</MdHeading>
      <p className="font-mono text-[12px] leading-relaxed text-white/55">
        <span className="text-white/30">©</span> {new Date().getFullYear()}{" "}
        Mohammed Huzaifa. Built with curiosity, caffeine, and the occasional{" "}
        <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[11px] text-cyan-300">
          rm -rf node_modules
        </code>
        .
      </p>

      {/* Bottom navigation back to other tabs */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onJumpToProjects}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-white/75 transition-all hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100"
        >
          <Folder className="h-3 w-3" />
          open projects.tsx
          <ChevronRight className="h-3 w-3" />
        </button>
        <span className="font-mono text-[10px] text-white/30">— EOF —</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   terminal.sh view — focused, full-bleed interactive shell
   ───────────────────────────────────────────────────────── */

function TerminalView({
  projects: terminalProjects,
  onTriggerMatrix,
  onThemeChange,
}: {
  projects: TerminalProject[];
  onTriggerMatrix: () => void;
  onThemeChange: (id: PersonaId) => void;
}) {
  return (
    <div className="w-full min-w-0">
      <InteractiveTerminal
        projects={terminalProjects}
        onTriggerMatrix={onTriggerMatrix}
        onThemeChange={onThemeChange}
        variant="bare"
      />
    </div>
  );
}
