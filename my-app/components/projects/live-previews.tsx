"use client";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import {
  FileCode,
  Workflow,
  Smartphone,
  ListTodo,
  ShoppingBag,
  Server,
  Database,
  Globe,
  Zap,
  Bot,
  Cpu,
  GitBranch,
  Terminal as TerminalIcon,
  CheckCircle2,
  ScanLine,
  MessageSquare,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Reusable token highlighter for tiny code views
   ───────────────────────────────────────────────────────── */

type Token = { text: string; cls?: string };
type Line = Token[];
type Snippet = Line[];

function joinLine(line: Line): string {
  return line.map((t) => t.text).join("");
}

function renderPartial(line: Line, charsToRender: number) {
  let remaining = charsToRender;
  return line.map((tok, i) => {
    if (remaining <= 0) return null;
    if (remaining >= tok.text.length) {
      remaining -= tok.text.length;
      return (
        <span key={i} className={tok.cls}>
          {tok.text}
        </span>
      );
    }
    const slice = tok.text.slice(0, remaining);
    remaining = 0;
    return (
      <span key={i} className={tok.cls}>
        {slice}
      </span>
    );
  });
}

function MiniCaret() {
  return (
    <motion.span
      aria-hidden
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      className="ml-px inline-block h-[10px] w-[1.5px] translate-y-[1.5px] bg-cyan-300/90"
    />
  );
}

/* ─────────────────────────────────────────────────────────
   Preview chrome (file/window header per card)
   ───────────────────────────────────────────────────────── */

function PreviewFrame({
  title,
  icon,
  accent,
  children,
}: {
  title: string;
  icon: ReactNode;
  accent: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="group relative h-[200px] overflow-hidden rounded-xl border border-white/10 bg-black/50 backdrop-blur-md transition-colors hover:border-white/25"
    >
      {/* Animated accent gradient halo on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at 50% 0%, ${accent}, transparent 60%)`,
        }}
      />

      {/* Title bar */}
      <div className="relative flex items-center gap-1.5 border-b border-white/5 bg-white/[0.02] px-2.5 py-1.5">
        <span className="flex gap-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-green-500/70" />
        </span>
        <span className="ml-1 flex h-3.5 w-3.5 items-center justify-center text-white/55 [&>svg]:h-3 [&>svg]:w-3">
          {icon}
        </span>
        <span className="font-mono text-[10px] text-white/55">{title}</span>
        <span className="ml-auto flex items-center gap-1 font-mono text-[8px] text-white/35">
          <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
          live
        </span>
      </div>

      {/* Body */}
      <div className="relative h-[calc(200px-26px)] p-3">{children}</div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   1. Code being written (mini IDE)
   ───────────────────────────────────────────────────────── */

const CODE_SNIPPETS: Snippet[] = [
  [
    [
      { text: "export ", cls: "text-purple-300" },
      { text: "function ", cls: "text-purple-300" },
      { text: "App", cls: "text-cyan-300" },
      { text: "() {" },
    ],
    [
      { text: "  const ", cls: "text-purple-300" },
      { text: "[count, set] = " },
      { text: "useState", cls: "text-cyan-300" },
      { text: "(", cls: "text-white/60" },
      { text: "0", cls: "text-amber-200" },
      { text: ")", cls: "text-white/60" },
    ],
    [
      { text: "  return ", cls: "text-purple-300" },
      { text: "<Counter />", cls: "text-pink-300" },
    ],
    [{ text: "}" }],
  ],
  [
    [
      { text: "const ", cls: "text-purple-300" },
      { text: "data", cls: "text-cyan-300" },
      { text: " = ", cls: "text-white/60" },
      { text: "await ", cls: "text-purple-300" },
      { text: "fetch", cls: "text-cyan-300" },
      { text: "(", cls: "text-white/60" },
    ],
    [
      { text: "  ", cls: "" },
      { text: "'/api/projects'", cls: "text-emerald-300" },
    ],
    [
      { text: ").", cls: "text-white/60" },
      { text: "then", cls: "text-cyan-300" },
      { text: "(", cls: "text-white/60" },
      { text: "r ", cls: "" },
      { text: "=> ", cls: "text-purple-300" },
      { text: "r.", cls: "" },
      { text: "json", cls: "text-cyan-300" },
      { text: "());", cls: "text-white/60" },
    ],
  ],
  [
    [
      { text: "// train ML model", cls: "text-white/35" },
    ],
    [
      { text: "model", cls: "text-cyan-300" },
      { text: ".", cls: "text-white/60" },
      { text: "fit", cls: "text-cyan-300" },
      { text: "(X, y, ", cls: "text-white/60" },
      { text: "epochs", cls: "text-pink-300" },
      { text: "=", cls: "text-white/60" },
      { text: "100", cls: "text-amber-200" },
      { text: ")", cls: "text-white/60" },
    ],
    [
      { text: "acc", cls: "text-cyan-300" },
      { text: " = ", cls: "text-white/60" },
      { text: "model.evaluate(X)" },
    ],
  ],
];

function CodeWritingPreview() {
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const snippet = CODE_SNIPPETS[snippetIdx];
    if (lineIdx >= snippet.length) {
      const timer = setTimeout(() => {
        setSnippetIdx((s) => (s + 1) % CODE_SNIPPETS.length);
        setLineIdx(0);
        setCharIdx(0);
      }, 1800);
      return () => clearTimeout(timer);
    }
    const lineText = joinLine(snippet[lineIdx]);
    if (charIdx < lineText.length) {
      const timer = setTimeout(() => setCharIdx((c) => c + 1), 30 + Math.random() * 30);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setLineIdx((l) => l + 1);
      setCharIdx(0);
    }, 200);
    return () => clearTimeout(timer);
  }, [snippetIdx, lineIdx, charIdx, reduced]);

  const snippet = CODE_SNIPPETS[snippetIdx];

  return (
    <div className="flex h-full flex-col font-mono text-[10px] leading-[1.55] text-white/85">
      {snippet.slice(0, lineIdx).map((line, i) => (
        <div key={`done-${snippetIdx}-${i}`} className="flex gap-2">
          <span className="w-3 shrink-0 select-none text-right text-white/15">
            {i + 1}
          </span>
          <span className="truncate">
            {line.map((t, j) => (
              <span key={j} className={t.cls}>
                {t.text}
              </span>
            ))}
          </span>
        </div>
      ))}
      {lineIdx < snippet.length && (
        <div className="flex gap-2">
          <span className="w-3 shrink-0 select-none text-right text-white/15">
            {lineIdx + 1}
          </span>
          <span className="truncate">
            {renderPartial(snippet[lineIdx], charIdx)}
            <MiniCaret />
          </span>
        </div>
      )}

      {/* Autocomplete bubble */}
      <AnimatePresence>
        {charIdx > 6 && lineIdx === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 inline-flex w-fit gap-2 rounded border border-white/10 bg-black/70 px-2 py-1 text-[8px] text-white/60 shadow-lg"
          >
            <span className="text-cyan-300">useState</span>
            <span className="text-white/30">function</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   2. n8n-style workflow with traveling data dot
   ───────────────────────────────────────────────────────── */

function WorkflowPreview() {
  const reduced = useReducedMotion();
  const nodes = [
    { id: "trigger", label: "Trigger", icon: Zap, color: "#3b82f6" },
    { id: "filter", label: "Filter", icon: Cpu, color: "#a855f7" },
    { id: "ai", label: "AI", icon: Bot, color: "#10b981" },
    { id: "out", label: "Output", icon: GitBranch, color: "#f59e0b" },
  ];
  const cycle = 4.4;

  return (
    <div className="relative flex h-full flex-col justify-center gap-2">
      {/* Connector + traveling dot */}
      <div className="relative mx-3 mt-2 h-px bg-white/10">
        <motion.div
          className="absolute -top-[3px] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.4)]"
          animate={
            reduced
              ? { left: "50%" }
              : { left: ["-2%", "100%"] }
          }
          transition={
            reduced
              ? { duration: 0 }
              : { duration: cycle, repeat: Infinity, ease: "linear" }
          }
        />
        {/* Pulsing energy along the line */}
        <motion.div
          className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent"
          animate={reduced ? {} : { x: ["-30%", "100%"] }}
          transition={{ duration: cycle, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Nodes */}
      <div className="-mt-6 flex justify-between px-1">
        {nodes.map((n, i) => {
          const Icon = n.icon;
          const delay = (cycle / nodes.length) * i;
          return (
            <div key={n.id} className="flex flex-col items-center gap-1.5">
              <motion.div
                className="relative flex h-7 w-7 items-center justify-center rounded-lg border bg-black/60 backdrop-blur-sm"
                style={{ borderColor: `${n.color}55` }}
                animate={
                  reduced
                    ? {}
                    : {
                        boxShadow: [
                          `0 0 0px ${n.color}00`,
                          `0 0 14px ${n.color}88`,
                          `0 0 0px ${n.color}00`,
                        ],
                        scale: [1, 1.12, 1],
                      }
                }
                transition={{
                  duration: 0.6,
                  delay,
                  repeat: Infinity,
                  repeatDelay: cycle - 0.6,
                  ease: "easeInOut",
                }}
              >
                <Icon className="h-3 w-3" style={{ color: n.color }} />
              </motion.div>
              <span className="font-mono text-[8px] text-white/55">{n.label}</span>
            </div>
          );
        })}
      </div>

      {/* Tiny status footer */}
      <div className="mt-1 flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-2 py-1 font-mono text-[8px] text-white/45">
        <span className="flex items-center gap-1">
          <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
          executing
        </span>
        <span className="text-white/30">~/workflow.json</span>
        <span className="text-emerald-300/70">200 OK</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   3. Mobile scanner (RecycleVision style)
   ───────────────────────────────────────────────────────── */

const SCAN_ITEMS = [
  { name: "Plastic Bottle", confidence: 94, hue: "#60a5fa" },
  { name: "Paper", confidence: 89, hue: "#34d399" },
  { name: "Aluminum Can", confidence: 96, hue: "#fbbf24" },
  { name: "Glass", confidence: 91, hue: "#c084fc" },
];

function MobileScanPreview() {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SCAN_ITEMS.length), 2400);
    return () => clearInterval(t);
  }, [reduced]);

  const item = SCAN_ITEMS[idx];

  return (
    <div className="relative flex h-full items-center justify-center gap-3">
      {/* Phone */}
      <div className="relative h-[148px] w-[80px] rounded-[14px] border border-white/15 bg-black p-[3px] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]">
        <div className="mx-auto mb-0.5 h-1 w-7 rounded-full bg-white/10" />
        <div
          className="relative h-[124px] w-full overflow-hidden rounded-[8px]"
          style={{
            background: `linear-gradient(180deg, ${item.hue}15 0%, #0f172a 100%)`,
            transition: "background 0.6s ease",
          }}
        >
          {/* AI bounding box */}
          <motion.div
            key={idx}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-2 right-2 top-3 h-[70px] rounded border-2 border-dashed"
            style={{ borderColor: item.hue }}
          >
            <span
              className="absolute -left-[1px] -top-[1px] h-2 w-2 border-l-2 border-t-2"
              style={{ borderColor: item.hue }}
            />
            <span
              className="absolute -right-[1px] -top-[1px] h-2 w-2 border-r-2 border-t-2"
              style={{ borderColor: item.hue }}
            />
            <span
              className="absolute -bottom-[1px] -left-[1px] h-2 w-2 border-b-2 border-l-2"
              style={{ borderColor: item.hue }}
            />
            <span
              className="absolute -bottom-[1px] -right-[1px] h-2 w-2 border-b-2 border-r-2"
              style={{ borderColor: item.hue }}
            />
            {/* Subject blob */}
            <motion.div
              key={`blob-${idx}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.65 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-2 rounded-md"
              style={{
                background: `radial-gradient(circle, ${item.hue}80, transparent 70%)`,
              }}
            />
          </motion.div>

          {/* Scan line */}
          {!reduced && (
            <motion.div
              className="absolute inset-x-1 h-[2px] rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${item.hue}, transparent)`,
                boxShadow: `0 0 12px 2px ${item.hue}`,
              }}
              animate={{ top: ["6%", "62%", "6%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Result label */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`label-${idx}`}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-x-1.5 bottom-1.5 rounded-md border bg-black/60 px-1.5 py-1 backdrop-blur-md"
              style={{ borderColor: `${item.hue}40` }}
            >
              <p className="flex items-center gap-1 font-mono text-[8px] font-medium text-white">
                <CheckCircle2 className="h-2 w-2" style={{ color: item.hue }} />
                {item.name}
              </p>
              <p className="font-mono text-[7px] text-white/55">
                conf:{" "}
                <span style={{ color: item.hue }}>{item.confidence}%</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Side analysis stream */}
      <div className="hidden flex-1 flex-col gap-1 sm:flex">
        <div className="flex items-center gap-1 font-mono text-[8px] text-white/50">
          <ScanLine className="h-2.5 w-2.5" />
          <span>analyzing...</span>
        </div>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1 rounded-full bg-white/10"
            animate={
              reduced
                ? {}
                : {
                    backgroundPosition: ["0% 0%", "100% 0%"],
                  }
            }
            style={{
              backgroundImage: `linear-gradient(90deg, ${item.hue}80, transparent)`,
              backgroundSize: "60% 100%",
              backgroundRepeat: "no-repeat",
            }}
            transition={{
              duration: 1.4,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   4. Todo list checking off
   ───────────────────────────────────────────────────────── */

const TODO_SETS: string[][] = [
  ["Build feature", "Run unit tests", "Deploy to prod", "Update changelog", "Sync w/ team"],
  ["Setup repo", "Init CI/CD", "Add linting", "Write docs", "Tag v1.0"],
  ["Design schema", "Migrate DB", "Seed data", "Backup snapshot", "Verify"],
];

function TodoListPreview() {
  const reduced = useReducedMotion();
  const [setIdx, setSetIdx] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    if (reduced) {
      setCompleted([0, 1, 2]);
      return;
    }
    const todos = TODO_SETS[setIdx];
    const t = setInterval(() => {
      setCompleted((prev) => {
        if (prev.length >= todos.length) {
          setTimeout(() => {
            setSetIdx((s) => (s + 1) % TODO_SETS.length);
            setCompleted([]);
          }, 1100);
          return prev;
        }
        return [...prev, prev.length];
      });
    }, 700);
    return () => clearInterval(t);
  }, [setIdx, reduced]);

  const todos = TODO_SETS[setIdx];

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between font-mono text-[9px] text-white/45">
        <span className="flex items-center gap-1">
          <ListTodo className="h-2.5 w-2.5" />
          TODAY
        </span>
        <span className="tabular-nums">
          <span className="text-emerald-300">{completed.length}</span>
          <span className="text-white/30">/{todos.length}</span>
        </span>
      </div>
      <div className="flex-1 space-y-1.5">
        {todos.map((todo, i) => {
          const done = completed.includes(i);
          return (
            <motion.div
              key={`${setIdx}-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 text-[10px]"
            >
              <motion.div
                className={`relative flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                  done
                    ? "border-emerald-400/70 bg-emerald-400/15"
                    : "border-white/25 bg-black/30"
                }`}
                animate={done ? { scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 0.35 }}
              >
                {done && (
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgb(110 231 183)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path d="M5 12.5 L10 17.5 L19 7" />
                  </motion.svg>
                )}
              </motion.div>
              <motion.span
                animate={{ opacity: done ? 0.4 : 0.95 }}
                className={`relative font-mono text-white/85 ${
                  done ? "line-through decoration-white/30" : ""
                }`}
              >
                {todo}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   5. E-commerce — products with cart counter
   ───────────────────────────────────────────────────────── */

const PRODUCTS = [
  { id: 1, name: "Air Pulse 270", price: 99, hue: "from-blue-500/40", emoji: "👟" },
  { id: 2, name: "Tech Tee", price: 29, hue: "from-emerald-500/40", emoji: "👕" },
  { id: 3, name: "Bomber Jacket", price: 149, hue: "from-purple-500/40", emoji: "🧥" },
];

function EcommercePreview() {
  const reduced = useReducedMotion();
  const [cart, setCart] = useState(0);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [flying, setFlying] = useState<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const t = setInterval(() => {
      const p = PRODUCTS[i % PRODUCTS.length];
      setActiveId(p.id);
      setFlying(p.id);
      setTimeout(() => setFlying(null), 700);
      setTimeout(() => setActiveId(null), 1000);
      setCart((c) => {
        if (c >= 5) return 1;
        return c + 1;
      });
      i++;
    }, 1500);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[9px] text-white/45">SHOP</span>
        <div className="relative">
          <motion.div
            animate={flying !== null ? { rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <ShoppingBag className="h-4 w-4 text-white/80" />
          </motion.div>
          <AnimatePresence>
            {cart > 0 && (
              <motion.span
                key={cart}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-400 font-mono text-[8px] font-bold text-black"
              >
                {cart}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 space-y-1.5">
        {PRODUCTS.map((p) => {
          const active = activeId === p.id;
          return (
            <motion.div
              key={p.id}
              animate={active ? { x: [0, -2, 0], scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={`relative flex items-center gap-2 rounded-md border px-1.5 py-1 transition-colors ${
                active
                  ? "border-cyan-300/40 bg-cyan-300/[0.05]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded bg-gradient-to-br ${p.hue} to-transparent text-sm`}
              >
                <span>{p.emoji}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-[9px] text-white/85">
                  {p.name}
                </div>
                <div className="font-mono text-[8px] text-emerald-300/80">
                  ${p.price}
                </div>
              </div>
              <motion.div
                className="flex h-5 w-5 items-center justify-center rounded-md border border-white/15 font-mono text-[10px]"
                animate={
                  active
                    ? { backgroundColor: "rgba(34,211,238,0.2)", color: "#67e8f9" }
                    : { backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)" }
                }
              >
                {active ? "✓" : "+"}
              </motion.div>

              {/* Flying confirmation */}
              <AnimatePresence>
                {flying === p.id && (
                  <motion.span
                    initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    animate={{ opacity: 0, x: 80, y: -40, scale: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[8px] text-cyan-300"
                  >
                    +1
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   6. Architecture — client → api → db with data flow
   ───────────────────────────────────────────────────────── */

function ArchitecturePreview() {
  const reduced = useReducedMotion();
  const layers = [
    { id: "client", label: "Client", icon: Globe, color: "#60a5fa", method: "GET" },
    { id: "api", label: "API", icon: Server, color: "#c084fc", method: "→" },
    { id: "cache", label: "Cache", icon: Cpu, color: "#fbbf24", method: "HIT" },
    { id: "db", label: "Postgres", icon: Database, color: "#34d399", method: "200" },
  ];

  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {layers.map((l, i) => {
        const Icon = l.icon;
        return (
          <div key={l.id} className="flex items-center gap-2">
            <div
              className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-black/40"
              style={{ borderColor: `${l.color}55` }}
            >
              <Icon className="h-3 w-3" style={{ color: l.color }} />
              <motion.span
                className="absolute inset-0 rounded-md"
                style={{ boxShadow: `0 0 0 0 ${l.color}` }}
                animate={
                  reduced
                    ? {}
                    : { boxShadow: [`0 0 0 0 ${l.color}80`, `0 0 8px 2px ${l.color}00`] }
                }
                transition={{
                  duration: 1.6,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </div>

            <span className="w-14 shrink-0 font-mono text-[9px] text-white/65">
              {l.label}
            </span>

            <div className="relative h-px flex-1 overflow-hidden bg-white/10">
              {!reduced && (
                <motion.div
                  className="absolute inset-y-0 w-6"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${l.color}, transparent)`,
                  }}
                  animate={{ x: ["-30%", "120%"] }}
                  transition={{
                    duration: 1.6,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </div>

            <span
              className="w-9 shrink-0 text-right font-mono text-[8px]"
              style={{ color: `${l.color}cc` }}
            >
              {l.method}
            </span>
          </div>
        );
      })}
      <div className="mt-1 flex items-center justify-between rounded-md border border-emerald-300/15 bg-emerald-300/[0.03] px-2 py-1 font-mono text-[8px] text-emerald-300/80">
        <span>↻ p99: 42ms</span>
        <span>uptime: 99.99%</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   7. Terminal — shell commands + output
   ───────────────────────────────────────────────────────── */

type TermLine = { kind: "cmd" | "out" | "ok" | "warn" | "info"; text: string };

const TERM_SCRIPTS: TermLine[][] = [
  [
    { kind: "cmd", text: "npm run build" },
    { kind: "out", text: "▸ Compiling..." },
    { kind: "out", text: "▸ Optimizing assets" },
    { kind: "ok", text: "✓ Built in 2.31s" },
    { kind: "cmd", text: "git push origin main" },
    { kind: "ok", text: "✓ Deployed to prod" },
  ],
  [
    { kind: "cmd", text: "docker compose up" },
    { kind: "info", text: "↑ Starting api ..." },
    { kind: "info", text: "↑ Starting db ..." },
    { kind: "ok", text: "✓ All services healthy" },
  ],
  [
    { kind: "cmd", text: "pytest -v" },
    { kind: "out", text: "▸ Running 24 tests" },
    { kind: "ok", text: "✓ 24 passed in 0.84s" },
    { kind: "warn", text: "! 0 warnings" },
  ],
];

const KIND_CLS: Record<TermLine["kind"], string> = {
  cmd: "text-white/85",
  out: "text-white/55",
  ok: "text-emerald-300",
  warn: "text-amber-300",
  info: "text-cyan-300",
};

function TerminalPreview() {
  const reduced = useReducedMotion();
  const [scriptIdx, setScriptIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [shown, setShown] = useState<TermLine[]>([]);

  useEffect(() => {
    if (reduced) {
      setShown(TERM_SCRIPTS[0]);
      return;
    }
    const script = TERM_SCRIPTS[scriptIdx];
    if (lineIdx >= script.length) {
      const t = setTimeout(() => {
        setScriptIdx((s) => (s + 1) % TERM_SCRIPTS.length);
        setLineIdx(0);
        setCharIdx(0);
        setShown([]);
      }, 1800);
      return () => clearTimeout(t);
    }
    const line = script[lineIdx];
    const isCmd = line.kind === "cmd";
    const speed = isCmd ? 38 : 6;
    if (charIdx < line.text.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => {
        setShown((prev) => [...prev, line]);
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      },
      isCmd ? 280 : 140
    );
    return () => clearTimeout(t);
  }, [scriptIdx, lineIdx, charIdx, reduced]);

  const script = TERM_SCRIPTS[scriptIdx];
  const cur = script[lineIdx];

  return (
    <div className="flex h-full flex-col font-mono text-[9.5px] leading-relaxed">
      {shown.map((line, i) => (
        <div key={`s-${scriptIdx}-${i}`} className={`flex gap-1.5 ${KIND_CLS[line.kind]}`}>
          {line.kind === "cmd" ? (
            <span className="text-emerald-300/80">$</span>
          ) : (
            <span className="w-1.5" />
          )}
          <span className="truncate">{line.text}</span>
        </div>
      ))}
      {cur && (
        <div className={`flex gap-1.5 ${KIND_CLS[cur.kind]}`}>
          {cur.kind === "cmd" ? (
            <span className="text-emerald-300/80">$</span>
          ) : (
            <span className="w-1.5" />
          )}
          <span className="truncate">
            {cur.text.slice(0, charIdx)}
            <MiniCaret />
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   8. AI Chat — bubbles with typing indicator
   ───────────────────────────────────────────────────────── */

type Msg = { role: "user" | "bot"; text: string };
const CHAT_SCRIPTS: Msg[][] = [
  [
    { role: "user", text: "Find me last quarter's reports" },
    { role: "bot", text: "Found 3 reports. Generating summary..." },
    { role: "bot", text: "✓ Saved to /reports/q4.pdf" },
  ],
  [
    { role: "user", text: "Optimize the homepage" },
    { role: "bot", text: "Reduced bundle by 42%" },
    { role: "bot", text: "✓ LCP: 1.2s → 0.6s" },
  ],
  [
    { role: "user", text: "Classify this image" },
    { role: "bot", text: "Analyzing..." },
    { role: "bot", text: "✓ Cat (98.2% confidence)" },
  ],
];

function AIChatPreview() {
  const reduced = useReducedMotion();
  const [scriptIdx, setScriptIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const script = CHAT_SCRIPTS[scriptIdx];
    if (step >= script.length) {
      const t = setTimeout(() => {
        setScriptIdx((s) => (s + 1) % CHAT_SCRIPTS.length);
        setStep(0);
      }, 1500);
      return () => clearTimeout(t);
    }
    const next = script[step];
    if (next.role === "bot") {
      setTyping(true);
      const t = setTimeout(() => {
        setTyping(false);
        setStep((s) => s + 1);
      }, 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 600);
    return () => clearTimeout(t);
  }, [scriptIdx, step, reduced]);

  const script = CHAT_SCRIPTS[scriptIdx];
  const visible = script.slice(0, step);

  return (
    <div className="flex h-full flex-col-reverse gap-1.5 overflow-hidden">
      {typing && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="self-start rounded-lg rounded-bl-none border border-white/10 bg-white/[0.04] px-2 py-1.5"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1 w-1 rounded-full bg-white/60"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
      {visible
        .slice()
        .reverse()
        .map((m, i) => (
          <motion.div
            key={`${scriptIdx}-${visible.length - 1 - i}`}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className={`max-w-[88%] rounded-lg px-2 py-1 font-mono text-[9.5px] leading-snug ${
              m.role === "user"
                ? "self-end rounded-br-none bg-cyan-400/15 text-cyan-100 border border-cyan-300/20"
                : "self-start rounded-bl-none border border-white/10 bg-white/[0.04] text-white/85"
            }`}
          >
            {m.text}
          </motion.div>
        ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Public component
   ───────────────────────────────────────────────────────── */

export function LivePreviews() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <PreviewFrame
        title="App.tsx"
        icon={<FileCode />}
        accent="rgba(34,211,238,0.18)"
      >
        <CodeWritingPreview />
      </PreviewFrame>

      <PreviewFrame
        title="workflow.json"
        icon={<Workflow />}
        accent="rgba(168,85,247,0.18)"
      >
        <WorkflowPreview />
      </PreviewFrame>

      <PreviewFrame
        title="scan.app"
        icon={<Smartphone />}
        accent="rgba(52,211,153,0.18)"
      >
        <MobileScanPreview />
      </PreviewFrame>

      <PreviewFrame
        title="todos.ts"
        icon={<ListTodo />}
        accent="rgba(110,231,183,0.18)"
      >
        <TodoListPreview />
      </PreviewFrame>

      <PreviewFrame
        title="store.tsx"
        icon={<ShoppingBag />}
        accent="rgba(96,165,250,0.18)"
      >
        <EcommercePreview />
      </PreviewFrame>

      <PreviewFrame
        title="system.arch"
        icon={<Server />}
        accent="rgba(192,132,252,0.18)"
      >
        <ArchitecturePreview />
      </PreviewFrame>

      <PreviewFrame
        title="~/term.zsh"
        icon={<TerminalIcon />}
        accent="rgba(250,204,21,0.18)"
      >
        <TerminalPreview />
      </PreviewFrame>

      <PreviewFrame
        title="agent.chat"
        icon={<MessageSquare />}
        accent="rgba(244,114,182,0.18)"
      >
        <AIChatPreview />
      </PreviewFrame>
    </div>
  );
}
