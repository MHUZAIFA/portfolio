"use client";

import { useSyncExternalStore } from "react";
import { Clock } from "lucide-react";

type LocalTimeClockProps = {
  timezone?: string;
  label?: string;
  className?: string;
  iconClassName?: string;
};

const subscribeToSecondTick = (callback: () => void) => {
  const id = window.setInterval(callback, 1000);
  return () => window.clearInterval(id);
};

const getClientNow = () => Date.now();
const getServerNow = () => 0;

export function LocalTimeClock({
  timezone = "America/Toronto",
  label = "Montréal",
  className,
  iconClassName,
}: LocalTimeClockProps) {
  const nowMs = useSyncExternalStore(
    subscribeToSecondTick,
    getClientNow,
    getServerNow,
  );

  const now = nowMs ? new Date(nowMs) : null;

  const time =
    now?.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) ?? "—:—";

  const offset =
    now
      ?.toLocaleTimeString("en-US", {
        timeZone: timezone,
        timeZoneName: "shortOffset",
      })
      .split(" ")
      .pop() ?? "";

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Clock className={iconClassName ?? "h-4 w-4 text-white/60"} />
        <span className="font-mono text-sm tabular-nums text-white">
          {time}
        </span>
        <span className="text-xs text-white/50">{offset}</span>
      </div>
      <p className="mt-0.5 text-xs text-white/50">Local time in {label}</p>
    </div>
  );
}
