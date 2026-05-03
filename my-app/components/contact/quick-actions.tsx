"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Calendar,
  MessageSquare,
  Globe2,
  type LucideIcon,
} from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerItem } from "@/components/providers/motion-provider";

const EMAIL = "mhuzaifa.career@outlook.com";
const SCHEDULE_URL = "https://calendly.com/mhuzaifa-career";

const subscribeNoop = () => () => {};
const getClientTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
};
const getServerTimezone = () => "";

type ActionCard = {
  id: string;
  icon: LucideIcon;
  title: string;
  detail: string;
  cta?: string;
  ariaLabel: string;
  accent: string;
  iconAccent: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
};

export function QuickActions() {
  const [copied, setCopied] = useState(false);
  const tz = useSyncExternalStore(
    subscribeNoop,
    getClientTimezone,
    getServerTimezone,
  );

  const copyEmail = async () => {
    hapticManager.light();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Clipboard write failed", err);
    }
  };

  const cards: ActionCard[] = [
    {
      id: "email",
      icon: copied ? Check : Copy,
      title: copied ? "Copied to clipboard" : "Copy my email",
      detail: EMAIL,
      cta: copied ? "Pasted in your buffer" : "Click to copy",
      ariaLabel: "Copy email address",
      accent: "from-sky-500/20 via-cyan-500/10 to-transparent",
      iconAccent: "text-sky-300 group-hover:text-sky-200",
      onClick: copyEmail,
    },
    {
      id: "schedule",
      icon: Calendar,
      title: "Book a 30-min call",
      detail: "Intro chat or project scoping",
      cta: "Pick a time →",
      ariaLabel: "Schedule a meeting",
      accent: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
      iconAccent: "text-violet-300 group-hover:text-violet-200",
      href: SCHEDULE_URL,
      external: true,
    },
    {
      id: "response",
      icon: MessageSquare,
      title: "Avg. response time",
      detail: "Within 24 hours",
      cta: "Mon – Fri · async-friendly",
      ariaLabel: "Average response time",
      accent: "from-emerald-500/20 via-teal-500/10 to-transparent",
      iconAccent: "text-emerald-300 group-hover:text-emerald-200",
    },
    {
      id: "timezone",
      icon: Globe2,
      title: "Working timezone",
      detail: "EST · Montréal, Canada",
      cta: tz ? `Your timezone: ${tz}` : "Open to global teams",
      ariaLabel: "Working timezone",
      accent: "from-amber-500/20 via-orange-500/10 to-transparent",
      iconAccent: "text-amber-300 group-hover:text-amber-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const inner = (
          <>
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${card.accent}`}
            />
            <div className="relative flex items-start justify-between gap-3">
              <div className="rounded-sm bg-white/5 p-2 ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-white/10">
                <Icon className={`h-4 w-4 transition-colors ${card.iconAccent}`} />
              </div>
              {card.external && (
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                  external
                </span>
              )}
            </div>
            <div className="relative mt-4">
              <p className="text-sm font-medium text-white">{card.title}</p>
              <p className="mt-1 truncate text-xs text-white/60">
                {card.detail}
              </p>
              {card.cta && (
                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/50">
                  {card.cta}
                </p>
              )}
            </div>
          </>
        );

        const baseClasses =
          "group relative block w-full overflow-hidden rounded-sm border border-white/10 bg-white/[0.03] p-5 text-left shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-black/30 focus-visible:-translate-y-0.5 focus-visible:border-white/30 focus-visible:outline-none";

        return (
          <motion.div
            key={card.id}
            variants={staggerItem}
            transition={{ delay: 0.05 * index }}
          >
            {card.href ? (
              <a
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                aria-label={card.ariaLabel}
                onClick={() => hapticManager.light()}
                className={baseClasses}
              >
                {inner}
              </a>
            ) : (
              <button
                type="button"
                onClick={card.onClick}
                aria-label={card.ariaLabel}
                className={baseClasses}
              >
                {inner}
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
