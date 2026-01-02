"use client";

import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { SpaceShooterGame } from "@/components/space-shooter-game";

type GameStatus = "idle" | "running" | "over";

export default function Home() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");

  return (
    <div className="relative">
      <HeroSection gameActive={gameStatus === "running"} />
      <div className="hidden md:block">
        <SpaceShooterGame onStatusChange={setGameStatus} />
      </div>
    </div>
  );
}
