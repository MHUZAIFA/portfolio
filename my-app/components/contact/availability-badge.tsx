"use client";

import { motion } from "framer-motion";

type AvailabilityBadgeProps = {
  status?: "available" | "limited" | "unavailable";
  label?: string;
};

const presets = {
  available: {
    label: "Available for new projects",
    dot: "bg-emerald-400",
    ring: "ring-emerald-400/40",
    text: "text-emerald-200",
    border: "border-emerald-400/30",
    bg: "bg-emerald-500/10",
  },
  limited: {
    label: "Limited availability",
    dot: "bg-amber-400",
    ring: "ring-amber-400/40",
    text: "text-amber-200",
    border: "border-amber-400/30",
    bg: "bg-amber-500/10",
  },
  unavailable: {
    label: "Currently booked",
    dot: "bg-rose-400",
    ring: "ring-rose-400/40",
    text: "text-rose-200",
    border: "border-rose-400/30",
    bg: "bg-rose-500/10",
  },
} as const;

export function AvailabilityBadge({
  status = "available",
  label,
}: AvailabilityBadgeProps) {
  const preset = presets[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.05 }}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm ${preset.border} ${preset.bg} ${preset.text}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${preset.dot}`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ring-2 ${preset.dot} ${preset.ring}`}
        />
      </span>
      <span className="tracking-wide">{label ?? preset.label}</span>
    </motion.div>
  );
}
