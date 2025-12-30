"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SCORE_STORAGE_KEY = "space-shooter-scores";

function loadScores(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SCORE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as number[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((n) => typeof n === "number" && Number.isFinite(n) && n >= 0)
      .sort((a, b) => b - a)
      .slice(0, 3);
  } catch {
    return [];
  }
}

export default function LeaderboardPage() {
  const [scores, setScores] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    setScores(loadScores());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/60">
              Space Survival
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Leaderboard
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Top scores from this browser. Keep playing on the home page to climb higher.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-white transition hover:border-white/50 hover:bg-white/10"
          >
            Back Home
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950/80 via-slate-950 to-black shadow-[0_0_40px_rgba(15,23,42,0.8)]">
          <div className="border-b border-white/5 px-6 py-4 text-xs font-medium uppercase tracking-[0.25em] text-white/60">
            Top 3 Scores
          </div>

          {scores.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-white/60">
              No scores yet. Play a round on the{" "}
              <Link href="/" className="font-medium text-white underline-offset-4 hover:underline">
                home page
              </Link>{" "}
              to claim a spot on the leaderboard.
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {scores.map((score, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-6 py-5 text-sm text-white"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                        index === 0
                          ? "bg-white text-slate-950"
                          : index === 1
                          ? "border border-white/70 text-white/90"
                          : "border border-white/40 text-white/80"
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <span className="text-white/80">Pilot</span>
                  </div>
                  <span className="tabular-nums text-base font-semibold text-white">
                    {score}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-4 text-xs text-white/40">
          Scores are stored locally in this browser only and are cleared if you reset site data.
        </p>
      </div>
    </main>
  );
}


