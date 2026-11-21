"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { useEffect, useState } from "react";
import { 
  MessageCircle,
  Users,
  Lightbulb,
  Clock,
  Crown,
  RefreshCw,
  Brain,
  Eye,
  BarChart3,
  Tag,
  Sparkles,
  Play,
  Database,
  Cloud,
  Plug,
  Plane,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { 
  SiReact,
  SiAngular,
  SiNextdotjs,
  SiHtml5,
  SiBootstrap,
  SiCss3,
  SiJavascript,
  SiSass,
  SiExpress,
  SiDotnet,
  SiPhp,
  SiApachecassandra,
  SiMongodb,
  SiFirebase,
  SiRedis,
  SiTypescript,
  SiSharp,
  SiPython,
  SiC,
  SiCplusplus,
  SiN8N,
  SiJenkins,
  SiVercel,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiOverleaf,
  SiOpenai,
  SiGooglegemini,
  SiGooglecloud,
  SiSpringboot,
  SiQuarkus,
  SiTailwindcss,
  SiShadcnui,
  SiMaterialdesign,
  SiMui,
  SiAnthropic,
  SiLangchain,
  SiHuggingface,
  SiOllama,
  SiPerplexity,
  SiPytorch,
  SiClaude,
} from "react-icons/si";
import {
  FaJava,
  FaMicrosoft,
  FaFilePowerpoint,
  FaFileWord,
  FaFileExcel,
  FaAws
} from "react-icons/fa";
import type { IconType } from "react-icons";
import Link from "next/link";
import { ProfilePhoto } from "@/components/profile-photo";
import { hapticManager } from "@/lib/haptic-manager";

// Category definitions
type CategoryName = "Frontend" | "Middleware" | "Database" | "Tools" | "Coding Languages" | "DevOps" | "Cloud" | "ML/AI";

const categories: Array<{
  name: CategoryName;
  color: string;
  skillNames: string[];
}> = [
  {
    name: "Frontend",
    color: "#3b82f6", // blue
    skillNames: ["Next JS", "React JS", "Angular", "HTML 5", "Bootstrap 4", "Tailwind CSS", "CSS 3", "JavaScript", "Sass", "shadcn/ui", "Angular Material", "Material-UI", "Google Analytics", "Tag Manager"],
  },
  {
    name: "Middleware",
    color: "#10b981", // green
    skillNames: ["Express.js", ".NET Core", "PHP", "Java Spring Boot", "Quarkus", "Java Play Framework"],
  },
  {
    name: "Database",
    color: "#f59e0b", // amber
    skillNames: ["Apache Cassandra", "Azure Cosmos DB", "SQL Server", "MongoDB", "Redis"],
  },
  {
    name: "Tools",
    color: "#8b5cf6", // violet
    skillNames: ["Dynamics 365", "PowerPoint", "Microsoft Word", "Excel", "Overleaf - LaTeX"],
  },
  {
    name: "Coding Languages",
    color: "#ef4444", // red
    skillNames: ["Java", "TypeScript", "C Sharp", "Python 3", "C++", "C"],
  },
  {
    name: "DevOps",
    color: "#06b6d4", // cyan
    skillNames: ["Azure DevOps", "Firebase", "Vercel", "Jenkins", "Docker", "Kubernetes", "Git", "GitHub", "GitLab", "Bitbucket"],
  },
  {
    name: "Cloud",
    color: "#14b8a6", // teal
    skillNames: ["AWS", "Azure", "GCP"],
  },
  {
    name: "ML/AI",
    color: "#ec4899", // pink
    skillNames: [
      "Crewdle AI",
      "n8n",
      "ChatGPT",
      "Gemini",
      "Anthropic",
      "Claude",
      "LangChain",
      "Hugging Face",
      "Ollama",
      "MCP",
      "Perplexity",
      "PyTorch",
    ],
  },
];

const technicalSkillsData: Array<{ name: string; icon: IconType | LucideIcon; url?: string }> = [
  // Frontend
  { name: "Next JS", icon: SiNextdotjs, url: "https://nextjs.org" },
  { name: "React JS", icon: SiReact, url: "https://react.dev" },
  { name: "Angular", icon: SiAngular, url: "https://angular.io" },
  { name: "HTML 5", icon: SiHtml5, url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { name: "Bootstrap 4", icon: SiBootstrap, url: "https://getbootstrap.com/docs/4.6" },
  { name: "Tailwind CSS", icon: SiTailwindcss, url: "https://tailwindcss.com" },
  { name: "CSS 3", icon: SiCss3, url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "JavaScript", icon: SiJavascript, url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "Sass", icon: SiSass, url: "https://sass-lang.com" },
  { name: "shadcn/ui", icon: SiShadcnui, url: "https://ui.shadcn.com" },
  { name: "Angular Material", icon: SiMaterialdesign, url: "https://material.angular.io" },
  { name: "Material-UI", icon: SiMui, url: "https://mui.com" },
  { name: "Google Analytics", icon: BarChart3 },
  { name: "Tag Manager", icon: Tag, url: "https://tagmanager.google.com" },
  // Middleware
  { name: "Express.js", icon: SiExpress, url: "https://expressjs.com" },
  { name: ".NET Core", icon: SiDotnet, url: "https://dotnet.microsoft.com" },
  { name: "PHP", icon: SiPhp, url: "https://www.php.net" },
  { name: "Java Spring Boot", icon: SiSpringboot, url: "https://spring.io/projects/spring-boot" },
  { name: "Quarkus", icon: SiQuarkus, url: "https://quarkus.io" },
  { name: "Java Play Framework", icon: Play, url: "https://www.playframework.com" },
  // Database
  { name: "Apache Cassandra", icon: SiApachecassandra, url: "https://cassandra.apache.org" },
  { name: "Azure Cosmos DB", icon: Database, url: "https://azure.microsoft.com/products/cosmos-db" },
  { name: "SQL Server", icon: Database, url: "https://www.microsoft.com/sql-server" },
  { name: "MongoDB", icon: SiMongodb, url: "https://www.mongodb.com" },
  { name: "Redis", icon: SiRedis, url: "https://redis.io" },
  // Tools
  { name: "Dynamics 365", icon: FaMicrosoft, url: "https://dynamics.microsoft.com" },
  { name: "PowerPoint", icon: FaFilePowerpoint, url: "https://www.microsoft.com/microsoft-365/powerpoint" },
  { name: "Microsoft Word", icon: FaFileWord, url: "https://www.microsoft.com/microsoft-365/word" },
  { name: "Excel", icon: FaFileExcel, url: "https://www.microsoft.com/microsoft-365/excel" },
  { name: "Overleaf - LaTeX", icon: SiOverleaf, url: "https://www.overleaf.com" },
  // Coding Languages
  { name: "Java", icon: FaJava, url: "https://www.java.com" },
  { name: "TypeScript", icon: SiTypescript, url: "https://www.typescriptlang.org" },
  { name: "C Sharp", icon: SiSharp, url: "https://dotnet.microsoft.com/languages/csharp" },
  { name: "Python 3", icon: SiPython, url: "https://www.python.org" },
  { name: "C++", icon: SiCplusplus, url: "https://isocpp.org" },
  { name: "C", icon: SiC, url: "https://en.wikipedia.org/wiki/C_(programming_language)" },
  // DevOps
  { name: "Azure DevOps", icon: Cloud, url: "https://azure.microsoft.com/products/devops" },
  { name: "Firebase", icon: SiFirebase, url: "https://firebase.google.com" },
  { name: "Vercel", icon: SiVercel, url: "https://vercel.com" },
  { name: "Jenkins", icon: SiJenkins, url: "https://www.jenkins.io" },
  { name: "Docker", icon: SiDocker, url: "https://www.docker.com" },
  { name: "Kubernetes", icon: SiKubernetes, url: "https://kubernetes.io" },
  { name: "Git", icon: SiGit, url: "https://git-scm.com" },
  { name: "GitHub", icon: SiGithub, url: "https://github.com" },
  { name: "GitLab", icon: SiGitlab, url: "https://gitlab.com" },
  { name: "Bitbucket", icon: SiBitbucket, url: "https://bitbucket.org" },
  // Cloud
  { name: "Azure", icon: Cloud, url: "https://azure.microsoft.com" },
  { name: "AWS", icon: FaAws, url: "https://aws.amazon.com" },
  { name: "GCP", icon: SiGooglecloud, url: "https://cloud.google.com" },
  // ML/AI
  { name: "Crewdle AI", icon: Sparkles, url: "https://www.crewdle.com" },
  { name: "n8n", icon: SiN8N, url: "https://n8n.io" },
  { name: "ChatGPT", icon: SiOpenai, url: "https://chat.openai.com" },
  { name: "Gemini", icon: SiGooglegemini, url: "https://gemini.google.com" },
  { name: "Anthropic", icon: SiAnthropic, url: "https://www.anthropic.com" },
  { name: "Claude", icon: SiClaude, url: "https://claude.ai/code" },
  { name: "LangChain", icon: SiLangchain, url: "https://www.langchain.com" },
  { name: "Hugging Face", icon: SiHuggingface, url: "https://huggingface.co" },
  { name: "Ollama", icon: SiOllama, url: "https://ollama.com" },
  { name: "MCP", icon: Plug, url: "https://modelcontextprotocol.io" },
  { name: "Perplexity", icon: SiPerplexity, url: "https://www.perplexity.ai" },
  { name: "PyTorch", icon: SiPytorch, url: "https://pytorch.org" },
];

/** Soft skills as crew badges; `proof` is a one-line receipt for the claim. */
const softSkillsData: Array<{ name: string; icon: LucideIcon; code: string; proof: string }> = [
  { name: "Communication", icon: MessageCircle, code: "COM", proof: "Spec and acceptance criteria agreed before code." },
  { name: "Teamwork", icon: Users, code: "TMW", proof: "Direct talk, shared ownership, honest trade-offs." },
  { name: "Problem Solving", icon: Lightbulb, code: "PRB", proof: "Messy requirements into dependable software." },
  { name: "Time Management", icon: Clock, code: "TIM", proof: "Owns features from idea through deploy." },
  { name: "Leadership", icon: Crown, code: "LDR", proof: "Led tech as VP and Director for ConUHacks." },
  { name: "Adaptability", icon: RefreshCw, code: "ADP", proof: "Angular, .NET, React, and agentic AI stacks." },
  { name: "Critical Thinking", icon: Brain, code: "CRT", proof: "AI speeds me up; I still review what ships." },
  { name: "Attention to Detail", icon: Eye, code: "DTL", proof: "Interfaces that feel fast and intentional." },
];

// Donut Chart Component
function DonutChart({
  data,
  hoveredCategory,
  onCategoryHover,
  onCategoryLeave,
}: {
  data: Array<{ name: string; value: number; color: string }>;
  hoveredCategory: string | null;
  onCategoryHover: (name: string) => void;
  onCategoryLeave: () => void;
}) {
  const size = 300;
  const radius = size / 2;
  const innerRadius = radius * 0.6;
  const centerX = radius;
  const centerY = radius;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const createArc = (
    startAngle: number,
    endAngle: number,
    innerRadius: number,
    outerRadius: number
  ) => {
    const start = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const end = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      innerEnd.x,
      innerEnd.y,
      "A",
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      1,
      innerStart.x,
      innerStart.y,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Calculate cumulative angles using reduce
  const paths = data.reduce((acc, item) => {
    const previousEndAngle = acc.length > 0 ? acc[acc.length - 1].endAngle : -90;
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = previousEndAngle;
    const endAngle = previousEndAngle + angle;

    const isHovered = hoveredCategory === item.name;
    const opacity = hoveredCategory === null || isHovered ? 1 : 0.3;

    acc.push({
      ...item,
      path: createArc(startAngle, endAngle, innerRadius, radius),
      startAngle,
      endAngle,
      isHovered,
      opacity,
    });

    return acc;
  }, [] as Array<{
    name: string;
    value: number;
    color: string;
    path: string;
    startAngle: number;
    endAngle: number;
    isHovered: boolean;
    opacity: number;
  }>);

  return (
    <div className="relative flex justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full max-w-[280px] -rotate-90">
        {paths.map((segment) => (
          <path
            key={segment.name}
            d={segment.path}
            fill={segment.color}
            opacity={segment.opacity}
            className="transition-opacity duration-200 cursor-pointer"
            onMouseEnter={() => onCategoryHover(segment.name)}
            onMouseLeave={onCategoryLeave}
            style={{
              filter: segment.isHovered ? "brightness(1.2) drop-shadow(0 0 8px currentColor)" : "none",
            }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <Plane className="mx-auto mb-1 h-4 w-4 -rotate-45 text-amber-300" aria-hidden />
          <div className="font-mono text-3xl font-bold text-white">{total}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">Skills</div>
        </div>
      </div>
    </div>
  );
}


/** Ticket edge drawn as an overlay so the notches can cut through it (same as the experience/recognitions tickets). */
function Edge({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className} rounded-2xl border-2 border-white/10 transition-colors duration-300 group-hover:border-white/20`}
    />
  );
}

function Perforation() {
  return (
    <div className="relative z-40 h-0" aria-hidden="true">
      <span className="absolute inset-x-5 -top-px h-0.5 bg-[radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1.5px)] bg-size-[8px_2px]" />
      <span className="absolute left-0 -top-3 h-6 w-3 rounded-tr-full rounded-br-full border-2 border-l-0 border-white/10 bg-black transition-colors duration-300 group-hover:border-white/20" />
      <span className="absolute right-0 -top-3 h-6 w-3 rounded-tl-full rounded-bl-full border-2 border-r-0 border-white/10 bg-black transition-colors duration-300 group-hover:border-white/20" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="mt-0.5 truncate text-sm font-medium text-white">{children}</p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-red-400">{children}</p>;
}

/** Diameter of the skills pie chart on wide screens (px). */
const CHART_SIZE = 260;
/** Radius of the invisible circle the wing bars curve around (badge radius + gap to the wings). */
const OUTER_RING = CHART_SIZE / 2 + 28;
/** Extra length at the outer tip of a bar (and its mirrored partner), keyed by the bar's last skill (px). */
const OUTER_TIP_PADDING: Record<string, number> = { "Microsoft Word": 25, "C Sharp": 50 };

/** How far each wing bar reaches inside the outer circle before being cut (px). */
const BAR_OVERLAP = 30;

/** Work history as stops on a route (oldest → current). */
const ROUTE = [
  { code: "BOM", year: "18", name: "Reliance" },
  { code: "BOM", year: "19", name: "WTW" },
  { code: "BOM", year: "21", name: "CitiusTech" },
  { code: "YUL", year: "24", name: "Flexspring" },
  { code: "YUL", year: "26", name: "Air Canada" },
];

const TICKET =
  "group relative overflow-hidden rounded-2xl bg-linear-to-br from-[#121212] to-[#050505] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_48px_-24px_rgba(0,0,0,0.9),0_12px_40px_-16px_rgba(255,255,255,0.06)]";

export default function AboutPage() {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryName | null>(null);
  const chartData = categories.map((cat) => ({ name: cat.name, value: cat.skillNames.length, color: cat.color }));
  const getCategoryForSkill = (skillName: string): CategoryName | null =>
    categories.find((c) => c.skillNames.includes(skillName))?.name ?? null;

  // Pilot-pin symmetry: each wing bar is stretched to match its partner on the other side,
  // so both wings reach the same distance from the badge.
  useEffect(() => {
    const bars = () => Array.from(document.querySelectorAll<HTMLElement>("[data-wing-bar]"));
    const sync = () => {
      const all = bars();
      all.forEach((b) => {
        b.style.minWidth = "";
        b.style.maskImage = "";
        b.style.webkitMaskImage = "";
      });
      if (window.innerWidth < 1280) return; // wings stack on smaller screens
      const byKey = new Map(all.map((b) => [b.dataset.wingBar!, b]));
      for (let k = 0; byKey.has(`L${k}`) || byKey.has(`R${k}`); k++) {
        const l = byKey.get(`L${k}`);
        const r = byKey.get(`R${k}`);
        if (!l || !r) continue;
        // match partners, then add any hand-tuned tip length to both so the pin stays symmetric
        const extra = Math.max(Number(l.dataset.tipExtra) || 0, Number(r.dataset.tipExtra) || 0);
        const w = Math.max(l.offsetWidth, r.offsetWidth) + extra;
        l.style.minWidth = `${w}px`;
        r.style.minWidth = `${w}px`;
      }
      // Cut the inner end of every bar along the outer circle centred on the badge
      const badge = document.querySelector<HTMLElement>("[data-pin-badge]");
      if (!badge) return;
      const br = badge.getBoundingClientRect();
      const cx = br.left + br.width / 2;
      const cy = br.top + br.height / 2;
      for (const b of bars()) {
        const r = b.getBoundingClientRect();
        const k = b.offsetWidth / r.width; // undo the wing's CSS scale
        const x = (cx - r.left) * k;
        const y = (cy - r.top) * k;
        // Hide everything inside the circle so the inner end curves around the badge
        const mask = `radial-gradient(circle at ${x}px ${y}px, transparent ${OUTER_RING - 1.5}px, #000 ${OUTER_RING - 0.5}px)`;
        b.style.maskImage = mask;
        b.style.webkitMaskImage = mask;

      }
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);


  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background: faint grid + red horizon glow (matches the other pages) */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.35) 0%, transparent 70%)", filter: "blur(90px)" }}
        />
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="about-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-grid)" />
          </svg>
        </div>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="relative mx-auto mt-12 max-w-7xl px-4 py-24 md:px-8"
      >
        {/* Header */}
        <motion.p variants={staggerItem} className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-red-400">
          <Plane className="h-3.5 w-3.5" /> CREW PROFILE
        </motion.p>
        <motion.h1 variants={staggerItem} className="mb-10 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          About Me
        </motion.h1>

        {/* Crew card + bio */}
        <motion.section variants={staggerItem} className="mb-20 grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-12">
          <article className={`mx-auto flex w-full max-w-sm flex-col lg:max-w-none ${TICKET}`}>
            {/* Outline above the photo (z-30) but below the notches (z-40), so it curves round them */}
            <Edge className="z-30" />
            {/* Full-bleed photo with the name over a fade; on desktop it grows to match the text column */}
            <div className="relative lg:min-h-0 lg:flex-1">
              <ProfilePhoto
                alt="Mohammed Huzaifa"
                className="w-full lg:absolute lg:inset-0 lg:h-full"
                imageClassName="lg:h-full lg:object-cover lg:object-top"
                sizes="(max-width: 1024px) 384px, 352px"
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
                <span className="rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm">
                  Crew ID
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest text-red-300 backdrop-blur-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
                  </span>
                  ON DUTY
                </span>
              </div>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-4 pt-36"
                style={{
                  // Eased multi-stop fade (same RGB throughout) so there's no visible edge on the white photo background
                  background:
                    "linear-gradient(to top, rgb(17 17 17) 0%, rgb(17 17 17 / 0.92) 18%, rgb(17 17 17 / 0.72) 36%, rgb(17 17 17 / 0.45) 54%, rgb(17 17 17 / 0.22) 72%, rgb(17 17 17 / 0.07) 88%, rgb(17 17 17 / 0) 100%)",
                }}
              >
                <h2 className="text-xl font-semibold text-white">Mohammed Huzaifa</h2>
                <p className="text-sm text-white/70">Full Stack Developer</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5">
              <Field label="Carrier">Air Canada</Field>
              <Field label="Base">YUL · Montréal</Field>
              <Field label="Advisor at">HackConcordia</Field>
              <Field label="Education">MACS · Concordia</Field>
            </div>
            <Perforation />
            <div className="grid grid-cols-2 gap-2 p-4">
              <Link
                href="/experience"
                onClick={() => hapticManager.light()}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/15 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-white/80 transition-colors hover:border-white/40 hover:text-white"
              >
                Flight log <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact"
                onClick={() => hapticManager.light()}
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-white px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/85"
              >
                Contact <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>

          <div className="flex flex-col gap-8">
            <div className="space-y-5 text-justify hyphens-auto text-sm leading-relaxed text-white/75 md:text-base">
              <p className="text-lg text-white md:text-xl">
                I&apos;m a Full Stack Developer at <span className="text-red-300">Air Canada</span> in Montréal. I like turning
                messy requirements into software that is dependable, observable, and pleasant to use.
              </p>
              <p>
                Whether it is an internal tool or a customer-facing experience, I aim for interfaces that feel fast and
                intentional, with architecture that teammates can extend without guesswork.
              </p>
              <p>
                Before Air Canada I spent two years at Flexspring, growing from intern to full-time and working on the
                company&apos;s AI initiatives, including multi-turn agentic infrastructure. Earlier I built enterprise
                healthcare software at CitiusTech and Microsoft Dynamics 365 solutions at Willis Towers Watson, working across
                React and Next.js, Angular and .NET, and data on SQL, Cosmos DB, and Azure.
              </p>
              <p>
                I work spec-driven: agree on the spec and acceptance criteria first, then build. Claude Code and similar tools
                help me move faster, but I still review what ships. I wire automations in n8n, and I have built MCP servers so
                assistants and editors can use real tools in a controlled way. I care about security and privacy, and I like
                owning a feature from idea through deploy and follow-up.
              </p>
              <p>
                Outside work I&apos;m an Advisor at HackConcordia, where I previously led technology as VP and Director for
                ConUHacks, Quebec&apos;s largest hackathon. I work best in teams that value direct communication, shared
                ownership, and honest trade-offs.
              </p>
            </div>

            {/* Career as a flight path; sits at the bottom so it lines up with the card */}
            <Link
              href="/experience"
              onClick={() => hapticManager.light()}
              className="group mt-auto block pt-2"
              aria-label="Route so far: view full flight log"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Route so far · {ROUTE.length} stops
                </p>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 transition-colors group-hover:text-white">
                  Flight log <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              {/* Half-width end columns put the first/last stops on the edges with even spacing between all stops */}
              <ol
                className="relative grid"
                style={{ gridTemplateColumns: `minmax(0,1fr) repeat(${ROUTE.length - 2}, minmax(0,2fr)) minmax(0,1fr)` }}
              >
                {/* Track: dashed for the journey, solid red into the current stop */}
                <span
                  className="absolute inset-x-0 top-[5px] border-t-2 border-dashed border-white/15"
                  aria-hidden="true"
                />
                <span
                  className="absolute right-0 top-[5px] h-0.5 bg-linear-to-r from-red-500/0 to-red-400"
                  style={{ width: `${100 / (ROUTE.length - 1)}%` }}
                  aria-hidden="true"
                />
                {ROUTE.map((stop, i) => {
                  const current = i === ROUTE.length - 1;
                  const align =
                    i === 0 ? "items-start text-left" : current ? "items-end text-right" : "items-center text-center";
                  return (
                    <li key={stop.name} className={`relative flex flex-col ${align}`}>
                      {current ? (
                        <span className="relative z-10 flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                        </span>
                      ) : (
                        <span className="relative z-10 h-3 w-3 rounded-full border-2 border-white/60 bg-black" />
                      )}
                      <span className={`mt-3 font-mono text-xs font-semibold ${current ? "text-red-300" : "text-white"}`}>
                        {stop.code} &apos;{stop.year}
                      </span>
                      <span className={`mt-0.5 text-[11px] leading-tight md:text-xs ${current ? "text-white" : "text-white/55"}`}>
                        {stop.name}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </Link>
          </div>
        </motion.section>

        {/* Technical skills: pie chart in the centre, chips around it (hover a category to filter) */}
        <motion.section variants={staggerItem} className="mb-24">
          <SectionLabel>Toolkit</SectionLabel>
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-white md:text-3xl">Technical skills</h2>


          {(() => {
            const chip = ({ name, icon: Icon, url }: (typeof technicalSkillsData)[number], gold = false) => {
              const skillCategory = getCategoryForSkill(name);
              const isHighlighted = hoveredCategory === null || hoveredCategory === skillCategory;
              const color = skillCategory ? categories.find((c) => c.name === skillCategory)?.color : undefined;
              const active = hoveredCategory !== null && hoveredCategory === skillCategory;
              const body = (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border font-medium transition-[opacity,border-color,box-shadow] duration-200 ${
                    gold ? "px-2 py-1 text-xs" : "gap-2 px-3 py-2 text-xs lg:text-sm"
                  } ${
                    gold
                      ? "whitespace-nowrap text-white/90"
                      : "bg-linear-to-br from-white/5 to-white/[0.02] text-white/90"
                  } ${
                    isHighlighted
                      ? gold
                        ? "border-white/15 hover:border-white/40 hover:text-white"
                        : "border-white/10 hover:border-white/25 hover:bg-white/10"
                      : "border-white/5 opacity-25"
                  }`}
                  style={active && color ? { borderColor: color, boxShadow: `0 0 12px ${color}40` } : undefined}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4" />
                  {name}
                </span>
              );
              return url ? (
                <Link key={name} href={url} target="_blank" rel="noopener noreferrer">
                  {body}
                </Link>
              ) : (
                <span key={name}>{body}</span>
              );
            };
            // Every skill sits on a wing bar, grouped by category. The split is chosen so both
            // wings carry about the same total chip width, keeping the pin visually centred.
            const byCategory = (names: CategoryName[]) =>
              categories
                .filter((c) => names.includes(c.name))
                .flatMap((c) => c.skillNames)
                .map((n) => technicalSkillsData.find((t) => t.name === n))
                .filter((t): t is (typeof technicalSkillsData)[number] => Boolean(t));
            const left = byCategory(["Frontend", "Database", "DevOps"]);
            const right = byCategory(["Middleware", "Coding Languages", "Cloud", "ML/AI", "Tools"]);
            type Skill = (typeof left)[number];

            // Wing bars (like a pilot's pin): straight gold bars stacked on each side, the top
            // bar longest and each lower bar shorter. Inner ends meet the badge's circle.
            const ROW_H = 36; // bar height (32) + gap (4)
            const R = OUTER_RING; // inner ends of the bars sit on this circle
            const toBars = (items: Skill[]) => {
              // Split by estimated width (not count) so each bar is shorter than the one above.
              const est = (n: string) => 34 + n.length * 6.6; // icon + padding + text at text-xs
              const widths = items.map((it) => est(it.name) + 6);
              const total = widths.reduce((a, b) => a + b, 0);
              const taper = [1, 0.92, 0.84, 0.76, 0.66, 0.56, 0.46, 0.36];
              const tsum = taper.reduce((a, b) => a + b, 0);
              const bars: Skill[][] = taper.map(() => []);
              let k = 0;
              let filled = 0;
              let target = (taper[0] / tsum) * total;
              items.forEach((it, idx) => {
                // move to the next bar once this one would overshoot its share
                if (k < taper.length - 1 && bars[k].length > 0 && filled + widths[idx] / 2 > target) {
                  k++;
                  target += (taper[k] / tsum) * total;
                }
                bars[k].push(it);
                filled += widths[idx];
              });
              return bars.filter((b) => b.length > 0);
            };
            const tuck = (row: number, rows: number) => {
              const y = (row - (rows - 1) / 2) * ROW_H;
              return Math.min(R * 0.6, R - Math.sqrt(Math.max(R * R - y * y, 0)));
            };
            const side = (items: Skill[], dir: 1 | -1) => {
              const bars = toBars(items);
              return (
                <div className={`flex flex-col gap-1 ${dir === 1 ? "xl:items-end" : "xl:items-start"} items-center`}>
                  {bars.map((row, k) => (
                    <div
                      key={k}
                      data-wing-bar={`${dir === 1 ? "L" : "R"}${k}`}
                      className={`relative flex flex-wrap justify-center gap-1.5 overflow-hidden xl:justify-start p-1 xl:flex-nowrap xl:[transform:translateX(var(--tuck))] ${
                        dir === 1
                          ? "rounded-l-full pl-3 xl:flex-row-reverse xl:rounded-r-none xl:pr-[38px]"
                          : "rounded-r-full pr-3 xl:rounded-l-none xl:pl-[38px]"
                      }`}
                      // Reach BAR_OVERLAP px past the circle; the mask then cuts that end into an arc
                      // hand-tuned extra length at the outer tip of some bars (applied by the effect)
                      data-tip-extra={OUTER_TIP_PADDING[row[row.length - 1]?.name] ?? 0}
                      style={{ ["--tuck" as string]: `${dir * (tuck(k, bars.length) + BAR_OVERLAP)}px` }}
                    >
                      {row.map((it) => chip(it, true))}
                    </div>
                  ))}
                </div>
              );
            };

            return (
              <div className="grid origin-top gap-x-7 gap-y-6 xl:mt-4 xl:mb-8 xl:scale-[0.88] xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:items-center min-[1400px]:scale-100">
                {side(left, 1)}
                <div data-pin-badge className="relative z-10 order-first mx-auto w-full max-w-[240px] xl:order-none xl:max-w-none">
                  <div
                    className="mx-auto rounded-full bg-black p-2 ring-2 ring-amber-300/60 shadow-[0_0_48px_-12px_rgba(252,211,77,0.55),inset_0_0_24px_-12px_rgba(252,211,77,0.5)]"
                    style={{ width: "100%", maxWidth: CHART_SIZE }}
                  >
                    <DonutChart
                      data={chartData}
                      hoveredCategory={hoveredCategory}
                      onCategoryHover={(name) => setHoveredCategory(name as CategoryName)}
                      onCategoryLeave={() => setHoveredCategory(null)}
                    />
                  </div>
                </div>
                {side(right, -1)}
              </div>
            );
          })()}

          {/* Legend: also a filter */}
          <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 xl:mt-0">
            {categories.map((category) => {
              const isHovered = hoveredCategory === category.name;
              return (
                <li key={category.name}>
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredCategory(category.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onFocus={() => setHoveredCategory(category.name)}
                    onBlur={() => setHoveredCategory(null)}
                    className="flex items-center gap-2 py-0.5 text-sm transition-opacity duration-200"
                    style={{ opacity: hoveredCategory === null || isHovered ? 1 : 0.35 }}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className={isHovered ? "text-white" : "text-white/75"}>{category.name}</span>
                    <span className="font-mono text-xs text-white/40">{category.skillNames.length}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.section>

        {/* Soft skills */}
        <motion.section variants={staggerItem}>
          <SectionLabel>On the crew</SectionLabel>
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-white md:text-3xl">Soft skills</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {softSkillsData.map(({ name, icon: Icon, code, proof }, i) => (
              <motion.li
                key={name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06, ease: "easeOut" }}
                className={`flex flex-col transition-transform duration-300 hover:-translate-y-1 ${TICKET}`}
              >
                <Edge className="group-hover:border-red-500/30!" />
                {/* Scan sweep on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-red-500/10 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100"
                />
                <div className="relative flex items-start justify-between gap-3 p-5 pb-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                      Crew · {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-white">{name}</h3>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-all duration-300 group-hover:rotate-6 group-hover:bg-red-500/15 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.35)] group-hover:ring-red-500/40">
                    <Icon className="h-4.5 w-4.5 text-red-300" />
                  </span>
                </div>
                <p className="relative px-5 pb-5 text-sm leading-snug text-white/60 transition-colors group-hover:text-white/80">
                  {proof}
                </p>
                <Perforation />
                <div className="relative mt-auto flex items-center justify-between px-5 py-3">
                  <span className="font-mono text-sm font-semibold tracking-[0.2em] text-red-300">{code}</span>
                  {/* Faux barcode */}
                  <span
                    aria-hidden="true"
                    className="h-5 w-20 opacity-30 transition-opacity group-hover:opacity-60"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 3px, #fff 3px 5px, transparent 5px 6px, #fff 6px 7px, transparent 7px 10px)",
                    }}
                  />
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </motion.div>
    </div>
  );
}
