"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { hapticManager } from "@/lib/haptic-manager";

/**
 * Certificates as a pilot's licence: each certificate is a logged type rating (with a code like
 * AWS-03), grouped into rating classes by issuer. Filters pick a class; opening a rating shows the
 * original in an inspection view (arrow keys / swipe to move through, Esc to close).
 */

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
}

/** Rating classes, in display order, with the prefix used in rating codes. */
const CLASSES: { issuer: string; label: string; name: string; prefix: string }[] = [
  { issuer: "AWS", label: "AWS", name: "Amazon Web Services", prefix: "AWS" },
  { issuer: "Microsoft", label: "Microsoft", name: "Microsoft", prefix: "MSFT" },
  { issuer: "Angular", label: "Angular", name: "Angular", prefix: "NG" },
  { issuer: "Other", label: "Other", name: "General", prefix: "GEN" },
];

type Rating = Certificate & { code: string; classLabel: string };

function useRatings(certificates: Certificate[]) {
  return useMemo(() => {
    const known = new Set(CLASSES.map((c) => c.issuer));
    const ratings: Rating[] = [];
    CLASSES.forEach((cls) => {
      certificates
        .filter((c) => (known.has(c.issuer) ? c.issuer === cls.issuer : cls.issuer === "Other"))
        .forEach((c, i) => ratings.push({ ...c, code: `${cls.prefix}-${String(i + 1).padStart(2, "0")}`, classLabel: cls.label }));
    });
    return ratings;
  }, [certificates]);
}

function RatingTile({ rating, index, onOpen }: { rating: Rating; index: number; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
      onClick={onOpen}
      className="group flex flex-col text-left"
    >
      <span className="relative block aspect-[4/3] overflow-hidden rounded-md ring-1 ring-white/10 transition group-hover:ring-red-400/50">
        <Image
          src={rating.image}
          alt={rating.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          draggable={false}
        />
        {/* Rating code, like an endorsement number */}
        <span className="absolute left-2 top-2 rounded-sm bg-black/75 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[0.15em] text-white backdrop-blur-sm">
          {rating.code}
        </span>
        {/* Inspection stamp on hover */}
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 flex h-[68px] w-[68px] rotate-[-14deg] scale-75 items-center justify-center rounded-full border-2 border-red-500 font-mono text-[10px] font-black uppercase leading-tight tracking-widest text-red-400 opacity-0 shadow-[inset_0_0_0_3px_rgba(0,0,0,0.85),inset_0_0_0_4px_rgba(239,68,68,0.7)] transition duration-300 group-hover:scale-100 group-hover:opacity-100"
          style={{ background: "rgba(0,0,0,0.85)" }}
        >
          <span className="text-center">
            Rated
            <br />
            {rating.date}
          </span>
        </span>
      </span>
      <span className="mt-2.5 line-clamp-2 text-sm font-medium text-white/90 transition-colors group-hover:text-white">
        {rating.title}
      </span>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        {rating.issuer} · {rating.date}
      </span>
    </motion.button>
  );
}

export function CertificateGallery({ certificates }: { certificates: Certificate[] }) {
  const ratings = useRatings(certificates);
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const classes = CLASSES.map((c) => ({ ...c, count: ratings.filter((r) => r.classLabel === c.label).length })).filter(
    (c) => c.count > 0,
  );
  const visible = filter ? ratings.filter((r) => r.classLabel === filter) : ratings;
  const years = ratings.map((r) => Number(r.date)).filter(Boolean);

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpen((i) => {
        if (i === null) return i;
        const next = i + dir;
        if (next < 0 || next >= visible.length) return i;
        hapticManager.light();
        return next;
      });
    },
    [visible.length],
  );

  // Keyboard and scroll lock while inspecting
  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  const current = open !== null ? visible[open] : null;

  return (
    <>
      {/* Licence summary */}
      <dl className="mb-8 flex flex-wrap gap-x-10 gap-y-3 font-mono text-[10px] uppercase tracking-[0.2em]">
        {[
          ["Ratings held", String(ratings.length)],
          ["Issuers", String(classes.length)],
          ["Latest", years.length ? String(Math.max(...years)) : "—"],
          ["Status", "Current"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-white/35">{k}</dt>
            <dd className="mt-1 text-lg font-semibold tracking-normal text-white">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Rating class filter: one swipeable row on phones */}
      <div
        className="-mx-4 mb-12 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Filter by rating class"
      >
        {[{ label: null as string | null, count: ratings.length }, ...classes.map((c) => ({ label: c.label as string | null, count: c.count }))].map(
          ({ label, count }) => {
            const active = filter === label;
            return (
              <button
                key={label ?? "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  hapticManager.light();
                  setFilter(label);
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider transition-colors md:px-4 md:py-2 md:text-[11px] md:tracking-widest ${
                  active ? "border-white bg-white text-black" : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                }`}
              >
                {label ?? "All ratings"} <span className={active ? "text-black/50" : "text-white/40"}>{count}</span>
              </button>
            );
          },
        )}
      </div>

      {/* Ratings, grouped by class */}
      <div className="space-y-14">
        {(filter ? classes.filter((c) => c.label === filter) : classes).map((cls) => {
          const inClass = visible.filter((r) => r.classLabel === cls.label);
          return (
            <section key={cls.label} aria-labelledby={`class-${cls.prefix}`}>
              <div className="mb-5 flex items-baseline justify-between gap-4">
                <h2 id={`class-${cls.prefix}`} className="flex items-baseline gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-red-400">Class · {cls.prefix}</span>
                  <span className="text-xl font-semibold text-white md:text-2xl">{cls.name}</span>
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  {cls.count} {cls.count === 1 ? "rating" : "ratings"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                {inClass.map((r, i) => (
                  <RatingTile
                    key={r.id}
                    rating={r}
                    index={i}
                    onOpen={() => {
                      hapticManager.medium();
                      setOpen(visible.indexOf(r));
                    }}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Inspection view */}
      <AnimatePresence>
        {current && open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart === null) return;
              const d = touchStart - e.changedTouches[0].clientX;
              if (Math.abs(d) > 50) step(d > 0 ? 1 : -1);
              setTouchStart(null);
            }}
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
          >
            {/* Top bar */}
            <div
              className="flex items-start justify-between gap-4 px-4 py-4 md:px-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-400">
                  Rating {current.code} · Issued {current.date} · {open + 1}/{visible.length}
                </p>
                <p className="mt-1 truncate text-base font-semibold text-white md:text-lg">{current.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="shrink-0 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* The certificate */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-20">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="relative h-full w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 90vw"
                  className="object-contain"
                  draggable={false}
                  priority
                  unoptimized
                />
              </motion.div>

              {open > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 md:left-6"
                  aria-label="Previous rating"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              {open < visible.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 md:right-6"
                  aria-label="Next rating"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
