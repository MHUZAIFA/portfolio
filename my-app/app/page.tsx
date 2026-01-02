"use client";

import { useState, lazy, Suspense } from "react";
import { HeroSection } from "@/components/hero-section";

// Lazy load the game component to reduce initial bundle size
const SpaceShooterGame = lazy(() => import("@/components/space-shooter-game").then(mod => ({ default: mod.SpaceShooterGame })));

type GameStatus = "idle" | "running" | "over";

export default function Home() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");

  return (
    <div className="relative">
      <HeroSection gameActive={gameStatus === "running"} />
      <div className="hidden md:block">
        <Suspense fallback={null}>
          <SpaceShooterGame onStatusChange={setGameStatus} />
        </Suspense>
      </div>
    </div>
  );
}
