"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
  type KeyboardEvent,
  type FormEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Terminal as TerminalIcon, Copy, Check } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";

/* ─────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────── */

export type TerminalProject = {
  id: string;
  name: string;
  description: string;
  category?: string;
  technologies?: string[];
  date: string;
  featured?: boolean;
};

type LineKind = "prompt" | "output" | "error" | "info" | "success";
type Line = { id: number; kind: LineKind; content: ReactNode };

/* ─────────────────────────────────────────────────────────
   Tiny helpers
   ───────────────────────────────────────────────────────── */

// Clean ANSI-Shadow rendering of "HUZAIFA" — legible at any width
// (wrap the <pre> in overflow-x-auto so it scrolls on narrow screens).
const ASCII_LOGO = `
██╗  ██╗██╗   ██╗███████╗ █████╗ ██╗███████╗ █████╗ 
██║  ██║██║   ██║╚══███╔╝██╔══██╗██║██╔════╝██╔══██╗
███████║██║   ██║  ███╔╝ ███████║██║█████╗  ███████║
██╔══██║██║   ██║ ███╔╝  ██╔══██║██║██╔══╝  ██╔══██║
██║  ██║╚██████╔╝███████╗██║  ██║██║██║     ██║  ██║
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝╚═╝     ╚═╝  ╚═╝
        portfolio · projects · playground`;

// Ultra-compact fallback for very narrow viewports
const ASCII_LOGO_SMALL = `
 _                    _  __       
| |_  _  _ ______  _(_)/ _| __ _ 
| ' \\| || |_ / _\` || |  _/ _\` |
|_||_|\\_,_/___\\__,_||_|_| \\__,_|
     portfolio · projects · playground`;

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "There are 10 types of people: those who understand binary and those who don't.",
  "A SQL query walks into a bar, sees two tables, and asks: 'Can I JOIN you?'",
  "I would tell you a UDP joke, but you might not get it.",
  "How many programmers does it take to change a light bulb? None, it's a hardware problem.",
  "// TODO: think of a better joke",
  '"It works on my machine." — me, in production',
  "git push --force — famous last words.",
  "To understand recursion, you must first understand recursion.",
];

const QUOTES = [
  '"Simplicity is the ultimate sophistication." — da Vinci',
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke',
  '"The best way to predict the future is to invent it." — Alan Kay',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Make it work, make it right, make it fast." — Kent Beck',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* Tokenized output helpers */
const C = {
  key: (c: ReactNode) => <span className="text-cyan-300">{c}</span>,
  str: (c: ReactNode) => <span className="text-emerald-300">{c}</span>,
  num: (c: ReactNode) => <span className="text-amber-200">{c}</span>,
  dim: (c: ReactNode) => <span className="text-white/45">{c}</span>,
  warn: (c: ReactNode) => <span className="text-yellow-300">{c}</span>,
  err: (c: ReactNode) => <span className="text-rose-300">{c}</span>,
  ok: (c: ReactNode) => <span className="text-emerald-400">{c}</span>,
  mag: (c: ReactNode) => <span className="text-purple-300">{c}</span>,
};

/* ─────────────────────────────────────────────────────────
   Command metadata — drives autocomplete descriptions
   ───────────────────────────────────────────────────────── */

type CmdMeta = { name: string; desc: string; group: string };

const COMMANDS: CmdMeta[] = [
  // navigate
  { name: "help", desc: "list all commands", group: "nav" },
  { name: "ls", desc: "list all projects", group: "nav" },
  { name: "cat", desc: "show project details", group: "nav" },
  { name: "open", desc: "navigate to project page", group: "nav" },
  { name: "tree", desc: "projects by category", group: "nav" },
  { name: "pwd", desc: "print working directory", group: "nav" },
  { name: "history", desc: "command history", group: "nav" },

  // about
  { name: "whoami", desc: "a quick intro", group: "about" },
  { name: "about", desc: "alias of whoami", group: "about" },
  { name: "stack", desc: "my tech stack", group: "about" },
  { name: "skills", desc: "alias of stack", group: "about" },
  { name: "neofetch", desc: "system / build info", group: "about" },
  { name: "motd", desc: "message of the day", group: "about" },
  { name: "credits", desc: "how this was built", group: "about" },
  { name: "banner", desc: "ASCII logo", group: "about" },

  // contact
  { name: "contact", desc: "all ways to reach me", group: "contact" },
  { name: "github", desc: "open github profile", group: "contact" },
  { name: "linkedin", desc: "open linkedin profile", group: "contact" },
  { name: "email", desc: "compose email", group: "contact" },
  { name: "book", desc: "schedule a 30-min call · calendly", group: "contact" },
  { name: "calendly", desc: "alias of book", group: "contact" },
  { name: "schedule", desc: "alias of book", group: "contact" },
  { name: "meet", desc: "alias of book", group: "contact" },
  { name: "resume", desc: "résumé info", group: "contact" },

  // customize
  { name: "theme", desc: "set palette · coder|architect|ai|designer", group: "custom" },
  { name: "persona", desc: "alias of theme", group: "custom" },

  // utility
  { name: "echo", desc: "echo a message", group: "util" },
  { name: "calc", desc: "quick math · calc 2+2", group: "util" },
  { name: "roll", desc: "random 1..n · roll 20", group: "util" },
  { name: "random", desc: "alias of roll", group: "util" },
  { name: "ping", desc: "ping the portfolio", group: "util" },
  { name: "now", desc: "current date & time", group: "util" },
  { name: "date", desc: "alias of now", group: "util" },

  // system-fake
  { name: "top", desc: "running processes (fake)", group: "sys" },
  { name: "df", desc: "disk usage (fake)", group: "sys" },
  { name: "free", desc: "memory usage (fake)", group: "sys" },
  { name: "uptime", desc: "how long I've been up", group: "sys" },
  { name: "man", desc: "there is no manual", group: "sys" },

  // fun
  { name: "joke", desc: "random dev joke", group: "fun" },
  { name: "fortune", desc: "inspirational quote", group: "fun" },
  { name: "quote", desc: "alias of fortune", group: "fun" },
  { name: "matrix", desc: "enter the matrix", group: "fun" },
  { name: "cowsay", desc: "ASCII cow says <msg>", group: "fun" },
  { name: "sl", desc: "steam locomotive", group: "fun" },
  { name: "rainbow", desc: "rainbow text", group: "fun" },
  { name: "lolcat", desc: "alias of rainbow", group: "fun" },
  { name: "nyan", desc: "nyan cat", group: "fun" },
  { name: "coffee", desc: "ASCII coffee cup", group: "fun" },
  { name: "brew", desc: "alias of coffee", group: "fun" },
  { name: "hack", desc: "fake hacking sequence", group: "fun" },
  { name: "yes", desc: "classic yes <msg>", group: "fun" },
  { name: "make", desc: "make <target>", group: "fun" },
  { name: "sudo", desc: "try sudo hireme", group: "fun" },

  // shell
  { name: "clear", desc: "clear screen", group: "shell" },
  { name: "cls", desc: "alias of clear", group: "shell" },
  { name: "exit", desc: "you can't escape", group: "shell" },
];

const GROUP_LABELS: Record<string, string> = {
  nav: "navigate",
  about: "about",
  contact: "connect",
  custom: "customize",
  util: "utility",
  sys: "system",
  fun: "fun",
  shell: "shell",
};

const THEME_OPTIONS = ["coder", "architect", "ai", "designer"];
const MAKE_TARGETS = ["love", "money", "coffee"];

type Suggestion = {
  /** The full text that replaces the current input when accepted */
  replace: string;
  /** Display label */
  label: string;
  /** Short description shown inline */
  desc?: string;
  /** Grouping for display */
  group?: string;
};

function longestCommonPrefix(strs: string[]): string {
  if (!strs.length) return "";
  let p = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(p)) {
      p = p.slice(0, -1);
      if (!p) return "";
    }
  }
  return p;
}

/* ─────────────────────────────────────────────────────────
   Interactive terminal
   ───────────────────────────────────────────────────────── */

export function InteractiveTerminal({
  projects,
  onTriggerMatrix,
  onThemeChange,
  variant = "card",
}: {
  projects: TerminalProject[];
  onTriggerMatrix?: () => void;
  onThemeChange?: (theme: "coder" | "architect" | "ai" | "designer") => void;
  /** `"card"` = window chrome + status bar; `"bare"` = scroll area + input only (e.g. dedicated terminal tab) */
  variant?: "card" | "bare";
}) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>(() => [
    {
      id: 0,
      kind: "output",
      content: <BootSequence />,
    },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  /* Autocomplete state */
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const lineIdRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Mount the terminal in-view, to avoid autofocus scroll jank */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Auto-scroll on new output */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  const push = useCallback((kind: LineKind, content: ReactNode) => {
    setLines((prev) => [...prev, { id: lineIdRef.current++, kind, content }]);
  }, []);

  /* ── Commands ─────────────────────────────────────────── */

  const handleCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      push(
        "prompt",
        <span>
          <span className="text-emerald-400/90">❯</span>{" "}
          <span className="text-white/90">{trimmed}</span>
        </span>,
      );

      setCmdHistory((h) => [...h, trimmed]);
      setHistIdx(-1);

      const [cmd, ...args] = trimmed.split(/\s+/);
      const low = cmd.toLowerCase();

      switch (low) {
        case "help":
          push("output", <HelpOutput />);
          break;

        case "ls":
        case "ll":
        case "dir": {
          const subject = args[0]?.toLowerCase();
          if (subject === "-t" || subject === "tech" || subject === "stack") {
            push("output", <TechListOutput projects={projects} />);
          } else {
            push("output", <ProjectListOutput projects={projects} />);
          }
          break;
        }

        case "cat": {
          const id = args[0]?.toLowerCase();
          if (!id) {
            push(
              "error",
              <span>
                cat: missing file operand — try {C.str("cat <id>")}
              </span>,
            );
            break;
          }
          const p = projects.find((pr) => pr.id.toLowerCase() === id);
          if (!p) {
            push("error", <span>cat: {C.err(id)}: no such project</span>);
            break;
          }
          push("output", <ProjectDetail project={p} />);
          break;
        }

        case "open":
        case "goto": {
          const id = args[0]?.toLowerCase();
          if (!id) {
            push(
              "error",
              <span>
                open: expected id — try {C.str("open recyclevision")}
              </span>,
            );
            break;
          }
          const p = projects.find((pr) => pr.id.toLowerCase() === id);
          if (!p) {
            push("error", <span>open: {C.err(id)}: no such project</span>);
            break;
          }
          push(
            "success",
            <span>
              → navigating to {C.key("/projects/" + p.id)}…
            </span>,
          );
          setTimeout(() => router.push(`/projects/${p.id}`), 300);
          break;
        }

        case "whoami":
        case "about":
          push("output", <Whoami />);
          break;

        case "stack":
        case "skills":
          push("output", <StackOutput projects={projects} />);
          break;

        case "now":
        case "date":
          push(
            "output",
            <span>
              {C.dim(new Date().toString())}{" "}
              {C.ok("· " + new Date().toLocaleTimeString())}
            </span>,
          );
          break;

        case "joke":
          push("output", <span>{C.warn("☺ ")} {pick(JOKES)}</span>);
          break;

        case "fortune":
        case "quote":
          push("output", <span className="italic">{pick(QUOTES)}</span>);
          break;

        case "contact":
        case "connect":
          push("output", <ContactOutput />);
          break;

        case "clear":
        case "cls":
          setLines([]);
          break;

        case "sudo": {
          const sub = args.join(" ").toLowerCase();
          if (sub === "hireme" || sub === "hire me" || sub === "hire-me") {
            push("output", <HireMe />);
          } else if (sub.startsWith("rm")) {
            push("error", <span>sudo: nice try. denied. ☠</span>);
          } else {
            push(
              "info",
              <span>
                [sudo] password for {C.ok("huzaifa")}:{" "}
                <span className="text-white/30">********</span>{" "}
                {C.err("access denied.")} try{" "}
                {C.str("sudo hireme")}
              </span>,
            );
          }
          break;
        }

        case "matrix":
          if (onTriggerMatrix) {
            push(
              "success",
              <span>
                {C.ok("[engaged]")} follow the white rabbit… press{" "}
                {C.key("Esc")} to exit.
              </span>,
            );
            onTriggerMatrix();
          } else {
            push("error", <span>matrix: effect unavailable</span>);
          }
          break;

        case "cowsay": {
          const msg = args.join(" ") || "moo.";
          push("output", <CowSay text={msg} />);
          break;
        }

        case "neofetch":
        case "fastfetch":
          push("output", <Neofetch projects={projects} />);
          break;

        case "echo":
          push("output", <span>{args.join(" ")}</span>);
          break;

        case "tree":
          push("output", <TreeOutput projects={projects} />);
          break;

        case "ping":
          push(
            "output",
            <div className="flex flex-col gap-0.5">
              <span>PING huzaifa.dev (127.0.0.1) 56 bytes of data</span>
              <span>
                64 bytes from portfolio: seq=0 ttl=64 {C.ok("time=0.042 ms")}
              </span>
              <span>
                64 bytes from portfolio: seq=1 ttl=64 {C.ok("time=0.038 ms")}
              </span>
              <span>
                64 bytes from portfolio: seq=2 ttl=64 {C.ok("time=0.041 ms")}
              </span>
              <span className="mt-1">
                {C.ok("--- pong. ready to build.")}
              </span>
            </div>,
          );
          break;

        case "banner":
          push("output", <Banner />);
          break;

        case "exit":
        case "quit":
        case "q":
          push(
            "info",
            <span>
              you can&apos;t escape that easily. {C.dim("(just scroll ↑)")}
            </span>,
          );
          break;

        /* ─── Navigation / system info ─── */

        case "history": {
          if (cmdHistory.length === 0) {
            push("output", <span className="text-white/55">no history yet.</span>);
            break;
          }
          push(
            "output",
            <div className="flex flex-col gap-0.5">
              {cmdHistory.slice(-30).map((c, i, arr) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="w-8 text-right text-white/30 tabular-nums">
                    {arr.length - i}
                  </span>
                  <span className="text-white/75">{c}</span>
                </div>
              ))}
            </div>,
          );
          break;
        }

        case "pwd":
          push("output", <span>/Users/huzaifa/portfolio/projects</span>);
          break;

        case "uptime":
          push(
            "output",
            <span>
              {new Date().toTimeString().split(" ")[0]} up always, 1 user, load
              average: 0.42, 0.38, 0.41 {C.ok("· all systems green")}
            </span>,
          );
          break;

        case "motd":
          push("output", <Motd />);
          break;

        case "credits":
          push("output", <Credits />);
          break;

        /* ─── Contact / external ─── */

        case "github":
        case "gh":
          push(
            "success",
            <span>→ opening {C.key("github.com/mohammedhuzaifa")}…</span>,
          );
          if (typeof window !== "undefined") {
            window.open(
              "https://github.com/mohammedhuzaifa",
              "_blank",
              "noopener,noreferrer",
            );
          }
          break;

        case "linkedin":
        case "li":
          push(
            "success",
            <span>→ opening {C.key("linkedin.com/in/huzaifa-anjum")}…</span>,
          );
          if (typeof window !== "undefined") {
            window.open(
              "https://www.linkedin.com/in/huzaifa-anjum/",
              "_blank",
              "noopener,noreferrer",
            );
          }
          break;

        case "email":
        case "mail":
          push("success", <span>→ composing email…</span>);
          if (typeof window !== "undefined") {
            window.location.href = "mailto:mhuzaifa.career@outlook.com";
          }
          break;

        case "book":
        case "calendly":
        case "schedule":
        case "meet":
          push("output", <BookCallOutput />);
          push(
            "success",
            <span>→ launching {C.key("calendly popup")}…</span>,
          );
          // Open Calendly popup (loads widget on-demand, falls back to tab)
          (async () => {
            try {
              const mod = await import("@/components/contact/book-call");
              // Trigger via a hidden click path: we re-use the hook logic
              // by dispatching a synthetic call through `openCalendlyDirect`.
              await mod.openCalendlyDirect();
            } catch {
              if (typeof window !== "undefined") {
                window.open(
                  "https://calendly.com/huzaifafcrit/30min",
                  "_blank",
                  "noopener,noreferrer",
                );
              }
            }
          })();
          break;

        case "resume":
        case "cv":
          push(
            "output",
            <div className="flex flex-col gap-0.5">
              <span>
                resume: available on request. run{" "}
                {C.str("email")} or {C.str("linkedin")} to get it.
              </span>
            </div>,
          );
          break;

        /* ─── Customization ─── */

        case "theme":
        case "persona": {
          const p = args[0]?.toLowerCase();
          const allowed = ["coder", "architect", "ai", "designer"] as const;
          if (!p) {
            push(
              "output",
              <span>
                current theme applied by picker above. try{" "}
                {C.str(`theme ${allowed.join("|")}`)}
              </span>,
            );
            break;
          }
          if (!(allowed as readonly string[]).includes(p)) {
            push(
              "error",
              <span>
                theme: unknown &quot;{p}&quot;. options:{" "}
                {allowed.map((a, i) => (
                  <span key={a}>
                    {i > 0 && <span className="text-white/30">, </span>}
                    <span className="text-cyan-300">{a}</span>
                  </span>
                ))}
              </span>,
            );
            break;
          }
          onThemeChange?.(p as "coder" | "architect" | "ai" | "designer");
          push(
            "success",
            <span>
              ✓ theme set to {C.key(p)} — palette refreshed.
            </span>,
          );
          break;
        }

        /* ─── Utility ─── */

        case "calc":
        case "math": {
          const expr = args.join(" ");
          if (!expr) {
            push("error", <span>usage: calc 1 + 2 * 3</span>);
            break;
          }
          if (!/^[\d\s+\-*/().%]+$/.test(expr)) {
            push(
              "error",
              <span>
                calc: invalid expression — only {C.str("0-9 + - * / % ( )")}{" "}
                allowed.
              </span>,
            );
            break;
          }
          try {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            const result = new Function(`return (${expr})`)();
            if (typeof result === "number" && !Number.isFinite(result)) {
              push("error", <span>calc: division by zero? ∞</span>);
            } else {
              push(
                "output",
                <span>
                  {expr} <span className="text-white/30">=</span>{" "}
                  <span className="text-amber-200 tabular-nums">
                    {String(result)}
                  </span>
                </span>,
              );
            }
          } catch {
            push("error", <span>calc: could not evaluate</span>);
          }
          break;
        }

        case "roll":
        case "random": {
          const max = parseInt(args[0] ?? "100", 10);
          if (isNaN(max) || max < 1) {
            push("error", <span>usage: roll &lt;n&gt; — rolls 1..n</span>);
            break;
          }
          const n = Math.floor(Math.random() * max) + 1;
          push(
            "output",
            <span>
              🎲 rolled{" "}
              <span className="text-amber-200 tabular-nums">{n}</span>{" "}
              <span className="text-white/35">(1..{max})</span>
            </span>,
          );
          break;
        }

        /* ─── System fakes ─── */

        case "top":
          push("output", <TopOutput />);
          break;

        case "df":
          push("output", <DfOutput />);
          break;

        case "free":
          push("output", <FreeOutput />);
          break;

        case "man": {
          const subject = args[0]?.toLowerCase();
          if (!subject) {
            push(
              "error",
              <span>
                What manual page do you want? try {C.str("man help")}
              </span>,
            );
          } else {
            push(
              "output",
              <span>
                No manual entry for <span className="text-rose-300">{subject}</span>
                . run <span className="text-cyan-300">help</span> instead ;)
              </span>,
            );
          }
          break;
        }

        /* ─── Fun & easter eggs ─── */

        case "sl":
          push("output", <SteamLocomotive />);
          break;

        case "rainbow":
        case "lolcat": {
          const text = args.join(" ") || "hello, world!";
          push("output", <Rainbow text={text} />);
          break;
        }

        case "nyan":
          push("output", <NyanCat />);
          break;

        case "coffee":
        case "brew":
          push("output", <CoffeeCup />);
          break;

        case "vim":
        case "nvim":
        case "emacs":
        case "nano": {
          const other = low === "emacs" ? "vim" : "emacs";
          push(
            "output",
            <span>
              {C.warn("⚠")} can&apos;t spawn {C.key(low)} in a browser tab.{" "}
              heard good things about {C.mag(other)} too, btw. try{" "}
              {C.str("ls")} instead.
            </span>,
          );
          break;
        }

        case "make": {
          const target = args.join(" ").toLowerCase();
          if (target === "love") {
            push(
              "info",
              <span>
                make: *** No rule to make target &apos;love&apos;. Not war
                either. Stop.
              </span>,
            );
          } else if (target === "money") {
            push(
              "info",
              <span>
                make: *** That&apos;s what projects are for. Try{" "}
                <span className="text-cyan-300">sudo hireme</span>. Stop.
              </span>,
            );
          } else if (target === "coffee") {
            push("output", <CoffeeCup />);
          } else if (!target) {
            push(
              "output",
              <span>
                make: *** No targets specified and no makefile found. Stop.
              </span>,
            );
          } else {
            push(
              "output",
              <span>
                make: *** No rule to make target &apos;{target}&apos;. Stop.
              </span>,
            );
          }
          break;
        }

        case "yes": {
          const msg = args.join(" ") || "y";
          push(
            "output",
            <div className="flex flex-col text-white/75">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i}>{msg}</span>
              ))}
              <span className="mt-1 text-white/35">
                (output truncated — there&apos;d be a lot more)
              </span>
            </div>,
          );
          break;
        }

        case "hack":
          push("output", <HackSequence />);
          break;

        case "whoareyou":
          push(
            "output",
            <span>
              I&apos;m a zsh impersonator, 97% polite, 100% client-side.{" "}
              <br />
              run {C.str("whoami")} to learn about my human.
            </span>,
          );
          break;

        case "rm":
        case "mv":
        case "chmod":
          push("error", <span>{low}: permission denied — nice try.</span>);
          break;

        default:
          push(
            "error",
            <span>
              zsh: command not found: <span className="text-rose-300">{cmd}</span>
              . try <span className="text-cyan-300">help</span>
            </span>,
          );
      }
    },
    [projects, push, router, onTriggerMatrix, onThemeChange, cmdHistory],
  );

  /* ── Autocomplete engine ──────────────────────────────── */

  /**
   * Compute the suggestion list for the current input value.
   * Context-aware: completes command names for the first word,
   * project IDs for `cat`/`open`, persona names for `theme`, etc.
   */
  const suggestions: Suggestion[] = useMemo(() => {
    const raw = input;
    if (!raw) return [];

    const trailingSpace = /\s$/.test(raw);
    const parts = raw.split(/\s+/).filter(Boolean);
    const [first, ...rest] = parts;

    // First-word completion
    if (!trailingSpace && parts.length <= 1) {
      const q = (first ?? "").toLowerCase();
      return COMMANDS.filter((c) => c.name.startsWith(q)).map((c) => ({
        replace: c.name,
        label: c.name,
        desc: c.desc,
        group: GROUP_LABELS[c.group],
      }));
    }

    // Second-arg completion for known commands
    const cmd = first?.toLowerCase();
    const currentArg = trailingSpace ? "" : (rest[rest.length - 1] ?? "");
    const argPrefix = currentArg.toLowerCase();

    if (cmd === "cat" || cmd === "open" || cmd === "goto") {
      return projects
        .filter((p) => p.id.toLowerCase().startsWith(argPrefix))
        .map((p) => ({
          replace: `${cmd} ${p.id}`,
          label: p.id,
          desc: p.name,
          group: "project",
        }));
    }

    if (cmd === "theme" || cmd === "persona") {
      return THEME_OPTIONS.filter((t) => t.startsWith(argPrefix)).map((t) => ({
        replace: `${cmd} ${t}`,
        label: t,
        desc: "set palette",
        group: "persona",
      }));
    }

    if (cmd === "make") {
      return MAKE_TARGETS.filter((t) => t.startsWith(argPrefix)).map((t) => ({
        replace: `${cmd} ${t}`,
        label: t,
        desc: "target",
        group: "make",
      }));
    }

    if (cmd === "sudo") {
      return ["hireme"]
        .filter((t) => t.startsWith(argPrefix))
        .map((t) => ({
          replace: `sudo ${t}`,
          label: t,
          desc: "unlock the hire-me CTA",
          group: "sudo",
        }));
    }

    return [];
  }, [input, projects]);

  /** Ghost suggestion = the first suggestion's remaining text */
  const ghost = useMemo(() => {
    if (!suggestions.length) return "";
    const replace = suggestions[0].replace;
    if (!replace.startsWith(input)) return "";
    return replace.slice(input.length);
  }, [suggestions, input]);

  /* Reset selected suggestion when list changes */
  useEffect(() => {
    setSuggestionIdx(0);
  }, [suggestions.length, input]);

  /* Show/hide dropdown */
  useEffect(() => {
    setShowSuggestions(isFocused && suggestions.length > 0 && input.length > 0);
  }, [isFocused, suggestions.length, input]);

  /** Apply an autocomplete: replace current input with the suggestion's text */
  const applySuggestion = useCallback((s: Suggestion) => {
    setInput(s.replace);
    // Move cursor to end after React update
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(s.replace.length, s.replace.length);
    });
    hapticManager.light();
  }, []);

  /* ── Keyboard handling ────────────────────────────────── */

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const dropdownOpen = showSuggestions && suggestions.length > 0;

    if (e.key === "Tab") {
      e.preventDefault();
      if (!suggestions.length) return;
      // 1 match: complete fully
      if (suggestions.length === 1) {
        applySuggestion(suggestions[0]);
        return;
      }
      // If the longest common prefix is longer than input, expand to it first;
      // otherwise cycle through suggestions on repeated Tab.
      const lcp = longestCommonPrefix(suggestions.map((s) => s.replace));
      if (e.shiftKey) {
        // Shift+Tab cycles backwards
        const next =
          suggestionIdx <= 0 ? suggestions.length - 1 : suggestionIdx - 1;
        setSuggestionIdx(next);
        return;
      }
      if (lcp.length > input.length && lcp.startsWith(input)) {
        setInput(lcp);
        requestAnimationFrame(() => {
          inputRef.current?.setSelectionRange(lcp.length, lcp.length);
        });
        hapticManager.light();
        return;
      }
      // Cycle highlight — user can press Enter or Tab again to accept
      const next = (suggestionIdx + 1) % suggestions.length;
      setSuggestionIdx(next);
      return;
    }

    if (e.key === "ArrowUp") {
      if (dropdownOpen) {
        e.preventDefault();
        setSuggestionIdx((i) =>
          i <= 0 ? suggestions.length - 1 : i - 1,
        );
        return;
      }
      // History navigation
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next =
        histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(cmdHistory[next]);
      return;
    }

    if (e.key === "ArrowDown") {
      if (dropdownOpen) {
        e.preventDefault();
        setSuggestionIdx((i) => (i + 1) % suggestions.length);
        return;
      }
      e.preventDefault();
      if (histIdx === -1) return;
      const next = histIdx + 1;
      if (next >= cmdHistory.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(next);
        setInput(cmdHistory[next]);
      }
      return;
    }

    if (e.key === "Enter") {
      // If dropdown open AND user has moved selection past the first item,
      // pressing Enter accepts that suggestion (doesn't submit).
      if (dropdownOpen && suggestionIdx > 0) {
        e.preventDefault();
        applySuggestion(suggestions[suggestionIdx]);
        return;
      }
      // Otherwise fall through to form submit
      return;
    }

    if (e.key === "Escape") {
      if (dropdownOpen) {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }

    if (e.key === "ArrowRight") {
      if (
        ghost &&
        (e.currentTarget.selectionStart ?? 0) === input.length
      ) {
        e.preventDefault();
        setInput(input + ghost);
      }
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
      if (input) {
        e.preventDefault();
        push(
          "prompt",
          <span>
            <span className="text-emerald-400/90">❯</span>{" "}
            <span className="text-white/90">{input}</span>
            <span className="text-rose-300/70">^C</span>
          </span>,
        );
        setInput("");
      }
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
    setShowSuggestions(false);
    hapticManager.light();
  };

  const onChange = (v: string) => {
    setInput(v);
  };

  /* Global focus with 't' key when terminal visible */
  useEffect(() => {
    if (!visible) return;
    const h = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing =
        t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
      if (e.key === "t" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [visible]);

  /* External run-command bridge (for CTA buttons etc.) */
  useEffect(() => {
    const h = (e: Event) => {
      const ce = e as CustomEvent<string>;
      const cmd = ce.detail;
      if (typeof cmd !== "string" || !cmd.trim()) return;
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      inputRef.current?.focus();
      handleCommand(cmd);
    };
    window.addEventListener("terminal:run", h as EventListener);
    return () => window.removeEventListener("terminal:run", h as EventListener);
  }, [handleCommand]);

  const isBare = variant === "bare";

  return (
    <div
      ref={containerRef}
      className={
        isBare
          ? "group/term relative w-full min-w-0"
          : `group/term relative overflow-hidden rounded-xl border bg-[#0a0a0c]/85 shadow-2xl shadow-black/50 backdrop-blur-xl transition-all duration-300 ${
              isFocused
                ? "border-cyan-300/40 shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_20px_60px_-20px_rgba(34,211,238,0.35)]"
                : "border-white/10"
            }`
      }
    >
      {/* Window chrome — only in card layout */}
      {!isBare && (
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] text-white/45">
        <div className="flex items-center gap-1.5">
          <motion.span
            whileHover={{ scale: 1.2 }}
            className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-inset ring-red-300/20"
          />
          <motion.span
            whileHover={{ scale: 1.2 }}
            className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 ring-1 ring-inset ring-yellow-300/20"
          />
          <motion.span
            whileHover={{ scale: 1.2 }}
            className="h-2.5 w-2.5 rounded-full bg-green-500/80 ring-1 ring-inset ring-green-300/20"
          />
        </div>
        <div className="flex items-center gap-2 truncate">
          <TerminalIcon className="h-3 w-3 text-cyan-300/70" />
          <span className="truncate">zsh — huzaifa@portfolio: ~/projects</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] text-white/50">
            press{" "}
            <kbd className="rounded bg-white/10 px-1 text-[9px] text-cyan-300">
              t
            </kbd>
          </span>
        </div>
      </div>
      )}

      {/* Body */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className={`relative cursor-text overflow-y-auto scroll-smooth font-mono text-[12px] leading-relaxed text-white/75 sm:text-[13px] [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent] ${
          isBare
            ? `w-full min-w-0 max-h-[min(88vh,960px)] min-h-[min(520px,58vh)] bg-[#0a0a0c]/80 p-3 transition-shadow duration-300 sm:p-4 ${
                isFocused ? "shadow-[inset_0_0_0_1px_rgba(34,211,238,0.35)]" : ""
              }`
            : "max-h-[min(72vh,680px)] min-h-[400px] p-3 sm:p-4"
        }`}
      >
        {/* Scanlines overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
          }}
        />

        <AnimatePresence initial={false}>
          {lines.map((l) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={`whitespace-pre-wrap break-words ${
                l.kind === "error"
                  ? "text-rose-300"
                  : l.kind === "success"
                    ? "text-emerald-300"
                    : l.kind === "info"
                      ? "text-cyan-200"
                      : ""
              }`}
            >
              {l.content}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Input line */}
        <form onSubmit={onSubmit} className="relative mt-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400/90">❯</span>
            <div className="relative flex flex-1 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() =>
                  // Delay so suggestion click handlers can fire first
                  setTimeout(() => setIsFocused(false), 120)
                }
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                placeholder="type 'help' — or try: whoami · ls · stack · matrix"
                className="w-full bg-transparent font-mono text-[12px] text-white/95 caret-cyan-300 outline-none placeholder:text-white/25 sm:text-[13px]"
                aria-label="Terminal input"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
              />
              {/* Inline ghost suggestion — fills the rest of the first match */}
              {ghost && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center font-mono text-white/30"
                  style={{ whiteSpace: "pre" }}
                >
                  <span className="invisible">{input}</span>
                  {ghost}
                  <span className="ml-2 text-[10px] text-white/25">
                    <kbd className="rounded border border-white/15 bg-white/5 px-1 py-0 text-[9px]">
                      tab
                    </kbd>{" "}
                    to accept
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Autocomplete dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute left-5 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-white/10 bg-[#0a0a0c]/95 shadow-2xl shadow-black/60 backdrop-blur-md"
                role="listbox"
              >
                <div className="max-h-[220px] overflow-y-auto py-1 [scrollbar-width:thin]">
                  {suggestions.slice(0, 12).map((s, i) => {
                    const active = i === suggestionIdx;
                    return (
                      <button
                        key={`${s.replace}-${i}`}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onMouseEnter={() => setSuggestionIdx(i)}
                        onMouseDown={(e) => {
                          // prevent input blur before we apply
                          e.preventDefault();
                        }}
                        onClick={() => {
                          applySuggestion(s);
                          setShowSuggestions(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-1.5 text-left font-mono text-[12px] transition-colors ${
                          active
                            ? "bg-cyan-300/10 text-white"
                            : "text-white/70 hover:bg-white/5"
                        }`}
                      >
                        <span
                          className={`shrink-0 ${
                            active ? "text-cyan-300" : "text-white/40"
                          }`}
                        >
                          ›
                        </span>
                        <span
                          className={`shrink-0 tabular-nums ${
                            active ? "text-cyan-300" : "text-white/85"
                          }`}
                        >
                          {s.label}
                        </span>
                        {s.desc && (
                          <span
                            className={`truncate text-[11px] ${
                              active ? "text-white/70" : "text-white/40"
                            }`}
                          >
                            — {s.desc}
                          </span>
                        )}
                        {s.group && (
                          <span className="ml-auto shrink-0 rounded border border-white/10 bg-white/5 px-1 py-0 text-[9px] text-white/50">
                            {s.group}
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {suggestions.length > 12 && (
                    <div className="px-3 pt-1 text-[10px] text-white/35">
                      +{suggestions.length - 12} more — keep typing to narrow
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[9px] text-white/40">
                  <span className="flex items-center gap-2">
                    <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0">
                      tab
                    </kbd>
                    complete
                    <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0">
                      ↑↓
                    </kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0">
                      ↵
                    </kbd>
                    pick
                    <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0">
                      esc
                    </kbd>
                    close
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Status bar — only in card layout */}
      {!isBare && (
      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-[9px] text-white/40 sm:text-[10px]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            online
          </span>
          <span className="hidden sm:inline">
            {lines.filter((l) => l.kind === "prompt").length} commands ran
          </span>
        </div>
        <div className="flex items-center gap-2 text-white/35">
          <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0 text-[9px]">
            ↑↓
          </kbd>
          <span className="hidden sm:inline">history</span>
          <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0 text-[9px]">
            tab
          </kbd>
          <span className="hidden sm:inline">complete</span>
          <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0 text-[9px]">
            ⌃L
          </kbd>
          <span className="hidden sm:inline">clear</span>
        </div>
      </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Outputs
   ───────────────────────────────────────────────────────── */

function BootSequence() {
  return (
    <div className="flex flex-col gap-0.5">
      <Banner />
      <span className="mt-1 text-white/60">
        Welcome to <span className="text-cyan-300">huzaifa-shell</span> v1.0 —
        a tiny REPL for curious humans.
      </span>
      <span className="text-white/45">
        Type <span className="text-cyan-300">help</span> to see what&apos;s
        possible. Try <span className="text-cyan-300">whoami</span>,{" "}
        <span className="text-cyan-300">ls</span>,{" "}
        <span className="text-cyan-300">matrix</span>,{" "}
        <span className="text-cyan-300">sudo hireme</span>.
      </span>
    </div>
  );
}

/**
 * Banner picks the compact or full ASCII art based on available width
 * and is wrapped in a horizontally-scrollable container so it never clips.
 */
function Banner() {
  const ref = useRef<HTMLDivElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      // The full ANSI Shadow art is ~52 monospace chars ≈ 320px at the
      // smallest font we use. Fall back to the compact figlet below that.
      setIsNarrow(w < 340);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="-mx-2 overflow-x-auto px-2 [scrollbar-width:thin]"
    >
      <pre
        aria-label="huzaifa portfolio"
        className="font-mono leading-[1.15] text-cyan-300"
        style={{
          fontSize: isNarrow ? 10 : 11,
          whiteSpace: "pre",
        }}
      >
        {isNarrow ? ASCII_LOGO_SMALL : ASCII_LOGO}
      </pre>
    </div>
  );
}

function HelpOutput() {
  const groups: { title: string; items: [string, string][] }[] = [
    {
      title: "navigate",
      items: [
        ["ls", "list all projects"],
        ["ls tech", "list technologies used"],
        ["tree", "projects by category"],
        ["cat <id>", "show project details"],
        ["open <id>", "jump to project page"],
        ["pwd", "print working directory"],
        ["history", "previous commands"],
      ],
    },
    {
      title: "about",
      items: [
        ["whoami", "a quick intro"],
        ["stack", "my tech stack"],
        ["neofetch", "system / build info"],
        ["motd", "message of the day"],
        ["credits", "how this was made"],
      ],
    },
    {
      title: "connect",
      items: [
        ["contact", "all ways to reach me"],
        ["book / calendly", "schedule a 30-min call"],
        ["github / gh", "open github"],
        ["linkedin / li", "open linkedin"],
        ["email", "compose email"],
        ["resume", "about my résumé"],
      ],
    },
    {
      title: "customize",
      items: [
        ["theme <name>", "coder · architect · ai · designer"],
        ["persona <name>", "same as theme"],
      ],
    },
    {
      title: "utility",
      items: [
        ["calc <expr>", "quick math: calc 2+2"],
        ["roll <n>", "random 1..n"],
        ["ping", "ping the portfolio"],
        ["echo <msg>", "echo back"],
        ["now / date", "current time"],
      ],
    },
    {
      title: "system (fake)",
      items: [
        ["top", "running processes"],
        ["df", "disk usage"],
        ["free", "memory usage"],
        ["uptime", "how long I've been up"],
      ],
    },
    {
      title: "for fun",
      items: [
        ["joke", "random dev joke"],
        ["fortune", "inspirational quote"],
        ["cowsay <msg>", "ASCII cow says things"],
        ["rainbow <msg>", "rainbow text"],
        ["nyan", "nyan cat"],
        ["coffee", "a warm cup"],
        ["sl", "steam locomotive"],
        ["hack", "fake hacking"],
        ["matrix", "enter the matrix"],
        ["sudo hireme", "unlock the CTA"],
        ["banner", "ASCII logo"],
      ],
    },
    {
      title: "shell",
      items: [
        ["clear / ⌃L", "clear screen"],
        ["man <cmd>", "there is no manual"],
        ["↑ / ↓", "command history"],
        ["tab", "autocomplete"],
        ["exit", "can't"],
      ],
    },
  ];
  return (
    <div className="mt-1 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <div key={g.title}>
          <div className="mb-1 text-[10px] uppercase tracking-wide text-white/35">
            {g.title}
          </div>
          <ul className="space-y-0.5">
            {g.items.map(([cmd, desc]) => (
              <li key={cmd} className="flex items-baseline gap-2">
                <span className="w-24 shrink-0 text-cyan-300">{cmd}</span>
                <span className="text-white/55">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Motd() {
  return (
    <div className="mt-1 flex flex-col gap-1 rounded border border-white/10 bg-white/[0.02] p-3">
      <span className="text-white/40 text-[10px] uppercase tracking-wide">
        · message of the day ·
      </span>
      <span className="italic text-white/75">
        &ldquo;The best code is the code you don&apos;t have to write.&rdquo;
        <span className="not-italic text-white/45"> — probably me.</span>
      </span>
      <div className="mt-1 flex flex-col gap-0.5 text-white/60">
        <span>
          <span className="text-emerald-400">✓</span> ship small things well
        </span>
        <span>
          <span className="text-emerald-400">✓</span> say hi via{" "}
          <span className="text-cyan-300">contact</span>
        </span>
        <span>
          <span className="text-emerald-400">✓</span> find wonder in 8-bit
          patterns
        </span>
      </div>
    </div>
  );
}

function Credits() {
  const built: [string, string][] = [
    ["framework", "next.js 15 · app router"],
    ["ui", "react 19 · tailwind css"],
    ["motion", "framer-motion"],
    ["icons", "lucide"],
    ["type system", "typescript"],
    ["deploy", "vercel"],
    ["fueled by", "tea · lofi · curiosity"],
  ];
  return (
    <div className="mt-1 flex flex-col gap-2">
      <span className="text-white/55">built with —</span>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
        {built.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-cyan-300">{k}:</dt>
            <dd className="text-white/75">{v}</dd>
          </div>
        ))}
      </dl>
      <span className="mt-1 text-[10px] text-white/35">
        source available on request.
      </span>
    </div>
  );
}

function TopOutput() {
  const rows: [string, string, string, string, string][] = [
    ["1337", "huzaifa", "48.2%", "22.0%", "next dev --port 3000"],
    ["420", "curiosity", "12.1%", "8.4%", "coffee --espresso"],
    ["777", "framer", "09.8%", "6.1%", "motion/render"],
    ["42", "react", "07.3%", "18.2%", "reconciler"],
    ["101", "tailwind", "02.0%", "3.5%", "postcss --watch"],
    ["5150", "ambition", "99.9%", "∞", "shipping"],
  ];
  return (
    <div className="mt-1 font-mono text-[11px]">
      <div className="text-white/40">
        Tasks: 6 total, 3 running · load avg: 0.42 0.38 0.41
      </div>
      <div className="mt-1 grid grid-cols-[auto_auto_auto_auto_1fr] gap-x-3 text-white/50">
        <span>PID</span>
        <span>USER</span>
        <span>CPU%</span>
        <span>MEM%</span>
        <span>COMMAND</span>
      </div>
      <div className="mt-0.5 h-px bg-white/10" />
      {rows.map((r) => (
        <div
          key={r[0]}
          className="grid grid-cols-[auto_auto_auto_auto_1fr] gap-x-3 tabular-nums text-white/75"
        >
          <span className="text-amber-200">{r[0]}</span>
          <span className="text-cyan-300">{r[1]}</span>
          <span>{r[2]}</span>
          <span>{r[3]}</span>
          <span className="text-white/60">{r[4]}</span>
        </div>
      ))}
    </div>
  );
}

function DfOutput() {
  const rows: { fs: string; size: string; used: string; avail: string; pct: number; mount: string }[] = [
    { fs: "/dev/disk1s1", size: "500Gi", used: "372Gi", avail: "124Gi", pct: 75, mount: "/" },
    { fs: "/dev/projects", size: "23Gi", used: "23Gi", avail: "0Gi", pct: 100, mount: "/projects" },
    { fs: "/dev/ideas", size: "∞", used: "∞", avail: "∞", pct: 99, mount: "/brain" },
  ];
  return (
    <div className="mt-1 font-mono text-[11px]">
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto_1fr] gap-x-3 text-white/50">
        <span>Filesystem</span>
        <span>Size</span>
        <span>Used</span>
        <span>Avail</span>
        <span>Use%</span>
        <span>Mounted on</span>
      </div>
      <div className="mt-0.5 h-px bg-white/10" />
      {rows.map((r) => (
        <div
          key={r.fs}
          className="grid grid-cols-[1fr_auto_auto_auto_auto_1fr] gap-x-3 tabular-nums text-white/75"
        >
          <span className="text-cyan-300">{r.fs}</span>
          <span>{r.size}</span>
          <span>{r.used}</span>
          <span>{r.avail}</span>
          <span className={r.pct >= 90 ? "text-rose-300" : r.pct >= 75 ? "text-amber-200" : "text-emerald-300"}>
            {r.pct}%
          </span>
          <span className="text-white/60">{r.mount}</span>
        </div>
      ))}
    </div>
  );
}

function FreeOutput() {
  return (
    <pre className="mt-1 whitespace-pre font-mono text-[11px] leading-[1.4] text-white/75 sm:text-[12px]">
{`              total        used        free      shared     available
Mem:          16.0G       8.1G        6.4G      0.2G       7.2G
Swap:          2.0G       128M        1.9G      —          —
Caffeine:         ∞          ∞           ∞      ∞          ∞`}
    </pre>
  );
}

function SteamLocomotive() {
  return (
    <pre className="mt-1 whitespace-pre font-mono text-[9px] leading-[1.15] text-cyan-300/80 sm:text-[11px]">
{`      ====        ________                ___________ 
  _D _|  |_______/        \\__I_I_____===__|___________|
   |(_)---  |   H\\________/ |   |        =|___ ___|     
   /     |  |   H  |  |     |   |         ||_| |_||     
  |      |  |   H  |__------| [___] |
  | ________|___H__/__|_____/[][]~\\_______|       |
  |/ |:---:|-----------I_____I [][] []  D   |=======|__
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__
 |/-=|___|=    ||    ||    ||    |_____/~\\___/        
  \\_/      \\O=====O=====O=====O_/      \\_/            `}
    </pre>
  );
}

function NyanCat() {
  return (
    <pre className="mt-1 whitespace-pre font-mono text-[11px] leading-[1.15] text-pink-300/90 sm:text-[12px]">
{`  ≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋
  ≋≋≋≋≋  _,,,_       ≋≋
  ≋≋  .-'     '-.     ≋
  ≋  |  o     o  |    ≋ ✦  ✧  ✦
  ≋  |    ^      |    ≋
  ≋   '.  \\_/  .'     ≋ * nya nya nya *
  ≋     '----'        ≋
  ≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋`}
    </pre>
  );
}

function CoffeeCup() {
  return (
    <pre className="mt-1 whitespace-pre font-mono text-[11px] leading-[1.15] text-amber-200/90 sm:text-[12px]">
{`       )  )  )
      (  (  (
       )  )  )
      .______.    __
      |~~~~~~|__//
      |      |  /
      |  ☕  | /
      '------' 
   "another coffee?"`}
    </pre>
  );
}

function Rainbow({ text }: { text: string }) {
  const colors = [
    "#ff6b6b",
    "#ffa94d",
    "#ffd43b",
    "#69db7c",
    "#4dabf7",
    "#845ef7",
    "#f06595",
  ];
  return (
    <span className="font-mono">
      {[...text].map((ch, i) => (
        <span key={i} style={{ color: colors[i % colors.length] }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

function HackSequence() {
  const lines: { text: string; tint?: string }[] = [
    { text: "[*] initiating h4x.exe…", tint: "text-white/70" },
    { text: "[*] bypassing firewall…", tint: "text-white/70" },
    { text: "[*] injecting payload 0x7FFE4A2B…", tint: "text-white/70" },
    { text: "[*] spawning reverse shell…", tint: "text-white/70" },
    { text: "[*] scanning ports 1..65535…", tint: "text-white/70" },
    { text: "[+] found open socket :22", tint: "text-amber-200" },
    { text: "[+] elevating privileges…", tint: "text-amber-200" },
    { text: "[*] decoding base64 nonsense…", tint: "text-white/70" },
    { text: "[+] ACCESS GRANTED.", tint: "text-emerald-300" },
    {
      text: "(it was all in your head — this is a portfolio ;)",
      tint: "text-white/40",
    },
  ];
  return (
    <div className="mt-1 flex flex-col gap-0.5 font-mono">
      {lines.map((l, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.18, delay: i * 0.12 }}
          className={l.tint}
        >
          {l.text}
        </motion.span>
      ))}
    </div>
  );
}

function ProjectListOutput({ projects }: { projects: TerminalProject[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-white/45">
        total {C.num(projects.length)} · use {C.str("cat <id>")} for details ·{" "}
        {C.str("open <id>")} to visit
      </div>
      <div className="mt-1 grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2">
        {projects.map((p) => (
          <div key={p.id} className="flex items-baseline gap-2">
            <span className="w-4 text-white/30">
              {p.featured ? "★" : "·"}
            </span>
            <span className="w-32 shrink-0 truncate text-cyan-300">{p.id}</span>
            <span className="truncate text-white/60">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechListOutput({ projects }: { projects: TerminalProject[] }) {
  const counts = new Map<string, number>();
  projects.forEach((p) =>
    p.technologies?.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)),
  );
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-white/45">
        {C.num(sorted.length)} unique technologies across{" "}
        {C.num(projects.length)} projects
      </span>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {sorted.map(([t, n]) => (
          <span
            key={t}
            className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[11px] text-white/70"
          >
            {t}
            <span className="ml-1 text-white/35">×{n}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectDetail({ project }: { project: TerminalProject }) {
  return (
    <div className="mt-1 rounded border border-white/10 bg-white/[0.02] p-3 text-[12px]">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-white/40">name:</span>
        <span className="text-cyan-300">{project.name}</span>
        {project.featured && (
          <span className="text-yellow-300">★ starred</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white/40">id:</span>
        <span className="text-white/80">{project.id}</span>
      </div>
      {project.category && (
        <div className="flex items-center gap-2">
          <span className="text-white/40">category:</span>
          <span className="text-purple-300">{project.category}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-white/40">date:</span>
        <span className="text-amber-200">{project.date}</span>
      </div>
      <div className="mt-1 text-white/70">
        <span className="text-white/40">desc:</span> {project.description}
      </div>
      {project.technologies && (
        <div className="mt-1 flex flex-wrap items-center gap-1 text-white/60">
          <span className="text-white/40">tech:</span>
          {project.technologies.map((t) => (
            <span
              key={t}
              className="rounded border border-white/10 bg-white/5 px-1 text-[10px]"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="mt-2 text-[10px] text-white/35">
        run {C.str(`open ${project.id}`)} to visit the project page.
      </div>
    </div>
  );
}

function Whoami() {
  return (
    <div className="flex flex-col gap-0.5">
      <span>
        {C.mag("Mohammed Huzaifa")} — software engineer, tinkerer, architect
        of small universes.
      </span>
      <span className="text-white/55">
        I build thoughtful products at the intersection of{" "}
        {C.key("code")}, {C.key("AI")}, {C.key("design")}, and{" "}
        {C.key("human")} things.
      </span>
      <span className="text-white/45">
        Find more with {C.str("stack")}, {C.str("contact")}, or just{" "}
        {C.str("ls")}.
      </span>
    </div>
  );
}

function StackOutput({ projects }: { projects: TerminalProject[] }) {
  const buckets: Record<string, string[]> = {
    Languages: ["TypeScript", "Python", "JavaScript", "SQL", "HTML", "CSS"],
    "Frameworks & Libraries": [
      "React",
      "Next.js",
      "Angular",
      "Tailwind CSS",
      "Framer Motion",
      "PyTorch",
      "TensorFlow",
    ],
    "AI / ML": [
      "Machine Learning",
      "Deep Learning",
      "CNN",
      "SVM",
      "Hugging Face API",
      "Image Recognition",
    ],
    Infra: ["Firebase", "REST APIs", "Cloud-Based", "n8n", "PWA"],
  };
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(buckets).map(([title, items]) => (
        <div key={title}>
          <div className="text-[10px] uppercase tracking-wide text-white/35">
            {title}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-1">
            {items.map((i) => (
              <span
                key={i}
                className="rounded border border-emerald-300/15 bg-emerald-300/[0.05] px-1.5 py-0.5 text-[11px] text-emerald-200/90"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-1 text-[10px] text-white/35">
        source: {projects.length} projects ·{" "}
        <span className="text-emerald-300">live</span>
      </div>
    </div>
  );
}

function BookCallOutput() {
  return (
    <div className="mt-1 flex flex-col gap-1 rounded border border-cyan-300/20 bg-cyan-500/[0.05] p-3">
      <pre className="whitespace-pre font-mono text-[10px] leading-[1.2] text-cyan-300/90 sm:text-[11px]">
{` ┌───────────────────────┐
 │  M  T  W  T  F  S  S  │
 │  ─  ─  ─  ─  ─  ─  ─  │
 │  1  2  3  4  5  6  7  │
 │  8  9 10 11 12 13 14  │
 │ 15 16 17 18 ●  20 21  │
 │ 22 23 24 25 26 27 28  │
 └───────────────────────┘`}
      </pre>
      <span className="text-white/70">
        {C.key("calendly")} · 30-minute chat · let&apos;s talk about{" "}
        {C.str("ideas")}, {C.str("roles")}, or {C.str("just to say hi")}.
      </span>
      <span className="text-[10px] text-white/45">
        link:{" "}
        <a
          href="https://calendly.com/huzaifafcrit/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-300 underline decoration-cyan-300/30 underline-offset-2 hover:decoration-cyan-300"
        >
          calendly.com/huzaifafcrit/30min
        </a>
      </span>
    </div>
  );
}

function ContactOutput() {
  const links: { label: string; value: string; href: string }[] = [
    { label: "email", value: "mhuzaifa.career@outlook.com", href: "mailto:mhuzaifa.career@outlook.com" },
    { label: "book", value: "calendly.com/huzaifafcrit/30min", href: "https://calendly.com/huzaifafcrit/30min" },
    { label: "github", value: "@mhuzaifa", href: "https://github.com/mhuzaifa" },
    {
      label: "linkedin",
      value: "/in/huzaifa-anjum",
      href: "https://www.linkedin.com/in/huzaifa-anjum/",
    },
    { label: "x", value: "@_huzaifaanjum_", href: "https://x.com/_huzaifaanjum_" },
    { label: "site", value: "huzaifa.dev", href: "/" },
  ];
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-white/55">Say hi — I read everything.</span>
      {links.map((l) => (
        <div key={l.label} className="flex items-baseline gap-2">
          <span className="w-16 shrink-0 text-white/40">{l.label}:</span>
          <a
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-300 underline decoration-cyan-300/30 underline-offset-2 hover:decoration-cyan-300"
          >
            {l.value}
          </a>
        </div>
      ))}
    </div>
  );
}

function HireMe() {
  return (
    <div className="mt-1 flex flex-col gap-1 rounded border border-emerald-300/20 bg-emerald-300/[0.04] p-3">
      <span className="text-emerald-300">
        ✓ access granted. permissions escalated.
      </span>
      <span className="text-white/70">
        You&apos;ve unlocked the hire-me protocol. Things I&apos;m great at:
      </span>
      <ul className="ml-4 list-disc text-white/60">
        <li>Shipping delightful, performant product experiences end-to-end</li>
        <li>AI / ML features that feel natural, not bolted on</li>
        <li>Design systems + motion that scale across teams</li>
        <li>Turning vague ideas into working prototypes — fast</li>
      </ul>
      <span className="text-white/55">
        {">"} run <span className="text-cyan-300">contact</span> to start the
        conversation.
      </span>
    </div>
  );
}

function Neofetch({ projects }: { projects: TerminalProject[] }) {
  const info: [string, ReactNode][] = [
    ["OS", "Humane macOS (custom build)"],
    ["Host", "huzaifa@portfolio"],
    ["Kernel", "react-19.0-next-15"],
    ["Uptime", "always-on"],
    ["Shell", "huzaifa-shell v1.0"],
    ["Editor", "cursor · vim keys"],
    [
      "Projects",
      <span key="p">
        {projects.length}{" "}
        <span className="text-white/35">
          ({projects.filter((p) => p.featured).length} starred)
        </span>
      </span>,
    ],
    ["Languages", "TypeScript · Python · SQL"],
    ["Vibe", "curious · kind · caffeinated"],
  ];
  return (
    <div className="mt-1 grid gap-3 sm:grid-cols-[auto_1fr]">
      <pre className="hidden font-mono text-[10px] leading-[1.1] text-cyan-300/80 sm:block">
        {`     .--.     
    |o_o |    
    |:_/ |    
   //   \\ \\   
  (|     | )  
 /'\\_   _/'\\  
 \\___)=(___/  `}
      </pre>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[12px]">
        {info.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-cyan-300">{k}:</dt>
            <dd className="text-white/75">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CowSay({ text }: { text: string }) {
  const safe = text.slice(0, 60);
  const border = "─".repeat(safe.length + 2);
  return (
    <pre className="mt-1 whitespace-pre font-mono text-[11px] leading-[1.2] text-white/75 sm:text-[12px]">
      {` ╭${border}╮
 │ ${safe} │
 ╰${border}╯
       \\   ^__^
        \\  (oo)\\_______
           (__)\\       )\\/\\
               ||----w |
               ||     ||`}
    </pre>
  );
}

function TreeOutput({ projects }: { projects: TerminalProject[] }) {
  const byCat = new Map<string, TerminalProject[]>();
  projects.forEach((p) => {
    const cat = p.category ?? "uncategorized";
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat)!.push(p);
  });
  const cats = [...byCat.entries()];
  return (
    <div className="font-mono text-[12px]">
      <div className="text-purple-300">./projects</div>
      {cats.map(([cat, ps], i) => {
        const lastCat = i === cats.length - 1;
        return (
          <div key={cat}>
            <div>
              <span className="text-white/30">{lastCat ? "└── " : "├── "}</span>
              <span className="text-cyan-300">{cat}/</span>
            </div>
            {ps.map((p, j) => {
              const lastItem = j === ps.length - 1;
              const prefix = lastCat ? "    " : "│   ";
              return (
                <div key={p.id}>
                  <span className="text-white/30">
                    {prefix}
                    {lastItem ? "└── " : "├── "}
                  </span>
                  <span className="text-white/75">{p.id}</span>
                  {p.featured && <span className="ml-1 text-yellow-300">★</span>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* Decorative copy-command util used elsewhere */
export function CopyChip({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        hapticManager.light();
        setTimeout(() => setCopied(false), 1200);
      }}
      className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/60 transition hover:border-white/25 hover:text-white"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-300" /> copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" /> {text}
        </>
      )}
    </button>
  );
}
