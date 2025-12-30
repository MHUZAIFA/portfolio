"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Vec2 = {
  x: number;
  y: number;
};

type MeteorSize = "small" | "medium" | "large";

type Meteor = {
  id: number;
  position: Vec2;
  velocity: Vec2;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  size: MeteorSize;
};

type Laser = {
  id: number;
  position: Vec2;
  velocity: Vec2;
  width: number;
  height: number;
};

type GameStatus = "idle" | "running" | "over";

const SCORE_STORAGE_KEY = "space-shooter-scores"; // array of numbers

function loadStoredScores(): number[] {
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

function saveScore(score: number) {
  if (typeof window === "undefined") return;
  const existing = loadStoredScores();
  existing.push(score);
  const deduped = existing
    .sort((a, b) => b - a)
    .slice(0, 3);
  window.localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(deduped));
}

type SpaceShooterGameProps = {
  onStatusChange?: (status: GameStatus) => void;
};

export function SpaceShooterGame({ onStatusChange }: SpaceShooterGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const gameStatusRef = useRef<GameStatus>("idle");
  const spaceshipRef = useRef<{
    position: Vec2;
    width: number;
    height: number;
    speed: number;
    rotation: number;
    rotationSpeed: number;
  }>({
    position: { x: 0, y: 0 },
    width: 36,
    height: 48,
    speed: 380,
    rotation: -Math.PI / 2, // Start facing up
    rotationSpeed: 4.5, // radians per second
  });

  const meteorsRef = useRef<Meteor[]>([]);
  const lasersRef = useRef<Laser[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});

  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [storedTopScores, setStoredTopScores] = useState<number[]>([]);

  const spawnTimerRef = useRef(0);
  const spawnIntervalRef = useRef(1200);
  const elapsedRef = useRef(0);
  const lastShotTimeRef = useRef(0);

  // Resize canvas to viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const navHeight = 80; // Account for nav height
      const width = window.innerWidth;
      const height = window.innerHeight - navHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      }

      // Center spaceship on resize if game not started yet
      const ship = spaceshipRef.current;
      ship.position.x = width / 2;
      ship.position.y = height * 0.75;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Load stored scores on mount
  useEffect(() => {
    setStoredTopScores(loadStoredScores());
  }, []);

  // Keyboard controls
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Space", "w", "a", "s", "d", "q", "e"].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current[e.key.toLowerCase()] = true;

      if (e.key === " " || e.code === "Space") {
        handleShoot();
      }

      if (gameStatusRef.current === "idle" && (e.key === "Enter" || e.code === "Space" || e.key.toLowerCase() === "w" || e.key.toLowerCase() === "a" || e.key.toLowerCase() === "s" || e.key.toLowerCase() === "d" || e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key.toLowerCase() === "q" || e.key.toLowerCase() === "e")) {
        startGame();
      }
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const resetGameState = () => {
    scoreRef.current = 0;
    setScore(0);
    meteorsRef.current = [];
    lasersRef.current = [];
    spawnTimerRef.current = 0;
    spawnIntervalRef.current = 1000;
    elapsedRef.current = 0;
    lastShotTimeRef.current = 0;
    lastTimeRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const navHeight = 80;
      const width = window.innerWidth;
      const height = window.innerHeight - navHeight;
      spaceshipRef.current.position = {
        x: width / 2,
        y: height * 0.75,
      };
      spaceshipRef.current.rotation = -Math.PI / 2; // Reset to facing up
    }
  };

  const startGame = () => {
    resetGameState();
    gameStatusRef.current = "running";
    setStatus("running");
    setFinalScore(null);
    onStatusChange?.("running");
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(loop);
  };

  const endGame = () => {
    gameStatusRef.current = "over";
    setStatus("over");
    onStatusChange?.("over");
    const final = scoreRef.current;
    setFinalScore(final);
    saveScore(final);
    setStoredTopScores(loadStoredScores());
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleShoot = () => {
    const now = performance.now();
    const cooldown = 260; // ms
    if (now - lastShotTimeRef.current < cooldown) return;
    lastShotTimeRef.current = now;

    if (gameStatusRef.current !== "running") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ship = spaceshipRef.current;

    const laserSpeed = 650;
    const laserWidth = 3;
    const laserHeight = 18;
    const offsetX = ship.width * 0.25;
    
    // Calculate laser positions and velocities relative to ship rotation
    const cos = Math.cos(ship.rotation);
    const sin = Math.sin(ship.rotation);
    
    // Offset positions relative to ship rotation
    const leftOffsetX = -offsetX * cos;
    const leftOffsetY = -offsetX * sin;
    const rightOffsetX = offsetX * cos;
    const rightOffsetY = offsetX * sin;
    
    // Forward direction from ship rotation
    const forwardX = sin;
    const forwardY = -cos;
    
    // Laser velocity in ship's facing direction
    const laserVelX = forwardX * laserSpeed;
    const laserVelY = forwardY * laserSpeed;

    const leftLaser: Laser = {
      id: performance.now() + Math.random(),
      position: { 
        x: ship.position.x + leftOffsetX, 
        y: ship.position.y + leftOffsetY 
      },
      velocity: { x: laserVelX, y: laserVelY },
      width: laserWidth,
      height: laserHeight,
    };

    const rightLaser: Laser = {
      id: performance.now() + Math.random() * 2,
      position: { 
        x: ship.position.x + rightOffsetX, 
        y: ship.position.y + rightOffsetY 
      },
      velocity: { x: laserVelX, y: laserVelY },
      width: laserWidth,
      height: laserHeight,
    };

    lasersRef.current = [...lasersRef.current, leftLaser, rightLaser].filter(
      (laser) =>
        laser.position.x >= -100 &&
        laser.position.x <= rect.width + 100 &&
        laser.position.y >= -100 &&
        laser.position.y <= rect.height + 100,
    );
  };

  const loop = (timestamp: number) => {
    if (gameStatusRef.current !== "running") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp;
    }
    const delta = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;
    elapsedRef.current += timestamp === 0 ? 0 : timestamp ? timestamp - (timestamp - delta * 1000) : 0;

    updateGame(delta, rect.width, rect.height);
    renderGame(ctx, rect.width, rect.height);

    animationRef.current = requestAnimationFrame(loop);
  };

  const updateGame = (delta: number, width: number, height: number) => {
    const ship = spaceshipRef.current;
    const keys = keysRef.current;

    // Rotation controls: Q/E or Left/Right arrows rotate the ship
    if (keys["q"] || keys["arrowleft"]) {
      ship.rotation -= ship.rotationSpeed * delta;
    }
    if (keys["e"] || keys["arrowright"]) {
      ship.rotation += ship.rotationSpeed * delta;
    }

    // Movement relative to ship rotation (360-degree movement)
    let forward = 0;
    let strafe = 0;
    
    // W/ArrowUp = forward, S/ArrowDown = backward
    if (keys["w"] || keys["arrowup"]) forward += 1;
    if (keys["s"] || keys["arrowdown"]) forward -= 1;
    
    // A/D = strafe left/right relative to ship rotation
    if (keys["a"]) strafe -= 1;
    if (keys["d"]) strafe += 1;

    // Calculate movement direction relative to ship rotation
    const cos = Math.cos(ship.rotation);
    const sin = Math.sin(ship.rotation);
    
    const moveX = (forward * sin + strafe * cos) * ship.speed * delta;
    const moveY = (-forward * cos + strafe * sin) * ship.speed * delta;

    ship.position.x += moveX;
    ship.position.y += moveY;

    ship.position.x = Math.max(ship.width / 2, Math.min(width - ship.width / 2, ship.position.x));
    ship.position.y = Math.max(ship.height / 2, Math.min(height - ship.height / 2, ship.position.y));

    // Difficulty scaling
    const baseSpawn = 1150;
    const minSpawn = 350;
    const scoreFactor = Math.min(scoreRef.current * 9, 550);
    spawnIntervalRef.current = Math.max(minSpawn, baseSpawn - scoreFactor);
    const meteorSpeedFactor = 1 + Math.min(scoreRef.current * 0.025, 2.0);

    // Spawn meteors
    spawnTimerRef.current += delta * 1000;
    if (spawnTimerRef.current >= spawnIntervalRef.current) {
      spawnTimerRef.current = 0;
      const toSpawn = 1 + Math.min(2, Math.floor(scoreRef.current / 10));
      for (let i = 0; i < toSpawn; i++) {
        meteorsRef.current.push(createMeteor(width, height, meteorSpeedFactor));
      }
    }

    // Update meteors
    meteorsRef.current = meteorsRef.current
      .map((meteor) => ({
        ...meteor,
        position: {
          x: meteor.position.x + meteor.velocity.x * delta,
          y: meteor.position.y + meteor.velocity.y * delta,
        },
        rotation: meteor.rotation + meteor.rotationSpeed * delta,
      }))
      .filter(
        (m) =>
          m.position.x + m.radius > -100 &&
          m.position.x - m.radius < width + 100 &&
          m.position.y + m.radius > -100 &&
          m.position.y - m.radius < height + 100,
      );

    // Update lasers
    lasersRef.current = lasersRef.current
      .map((laser) => ({
        ...laser,
        position: {
          x: laser.position.x + laser.velocity.x * delta,
          y: laser.position.y + laser.velocity.y * delta,
        },
      }))
      .filter((laser) => 
        laser.position.x >= -200 && laser.position.x <= width + 200 &&
        laser.position.y >= -200 && laser.position.y <= height + 200
      );

    // Collisions
    const newMeteors: Meteor[] = [];
    let destroyedThisFrame = 0;

    for (const meteor of meteorsRef.current) {
      let hit = false;
      lasersRef.current = lasersRef.current.filter((laser) => {
        if (hit) return true;
        const closestX = Math.max(
          laser.position.x - laser.width / 2,
          Math.min(meteor.position.x, laser.position.x + laser.width / 2),
        );
        const closestY = Math.max(
          laser.position.y - meteor.radius,
          Math.min(meteor.position.y, laser.position.y + laser.height),
        );
        const dx2 = meteor.position.x - closestX;
        const dy2 = meteor.position.y - closestY;
        const distSq = dx2 * dx2 + dy2 * dy2;
        if (distSq <= meteor.radius * meteor.radius) {
          hit = true;
          destroyedThisFrame += meteor.size === "small" ? 1 : meteor.size === "medium" ? 2 : 3;
          return false;
        }
        return true;
      });
      if (!hit) {
        newMeteors.push(meteor);
      }
    }

    meteorsRef.current = newMeteors;
    if (destroyedThisFrame > 0) {
      scoreRef.current += destroyedThisFrame;
      setScore(scoreRef.current);
    }

    // Ship vs meteor collision
    const shipHalfW = ship.width / 2.2;
    const shipHalfH = ship.height / 2.5;
    for (const meteor of meteorsRef.current) {
      const closestX = Math.max(
        ship.position.x - shipHalfW,
        Math.min(meteor.position.x, ship.position.x + shipHalfW),
      );
      const closestY = Math.max(
        ship.position.y - shipHalfH,
        Math.min(meteor.position.y, ship.position.y + shipHalfH),
      );
      const dx2 = meteor.position.x - closestX;
      const dy2 = meteor.position.y - closestY;
      const distSq = dx2 * dx2 + dy2 * dy2;
      if (distSq <= meteor.radius * meteor.radius) {
        endGame();
        break;
      }
    }
  };

  const renderGame = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(0, 0, width, height);

    // Subtle stars
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    for (let i = 0; i < 35; i++) {
      const x = (i * 97) % width;
      const y = ((i * 53 + performance.now() * 0.03) % height + height) % height;
      ctx.fillRect(x, y, 1.2, 1.2);
    }

    // Lasers
    for (const laser of lasersRef.current) {
      const gradient = ctx.createLinearGradient(
        laser.position.x,
        laser.position.y + laser.height,
        laser.position.x,
        laser.position.y - laser.height,
      );
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0.5)");
      gradient.addColorStop(1, "rgba(255,255,255,1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(
        laser.position.x - laser.width / 2,
        laser.position.y - laser.height,
        laser.width,
        laser.height * 2,
      );
    }

    // Meteors
    for (const meteor of meteorsRef.current) {
      ctx.save();
      ctx.translate(meteor.position.x, meteor.position.y);
      ctx.rotate(meteor.rotation);

      const gradient = ctx.createRadialGradient(0, 0, meteor.radius * 0.1, 0, 0, meteor.radius);
      gradient.addColorStop(0, "rgba(255,255,255,0.9)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0.75)");
      gradient.addColorStop(1, "rgba(255,255,255,0.2)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const radius = meteor.radius * (0.8 + Math.sin(i * 1.7) * 0.12);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
    }

    // Spaceship
    const ship = spaceshipRef.current;
    ctx.save();
    ctx.translate(ship.position.x, ship.position.y);
    ctx.rotate(ship.rotation);

    const keys = keysRef.current;
    const isMovingForward = keys["w"] || keys["arrowup"];
    const isMovingBackward = keys["s"] || keys["arrowdown"];
    const isMoving = isMovingForward || isMovingBackward || keys["a"] || keys["d"];

    // Thrust (behind ship when moving forward)
    if (isMovingForward) {
      const flameHeight = ship.height * 0.7;
      const flicker = Math.sin(performance.now() * 0.02) * 4;
      const gradient = ctx.createLinearGradient(0, ship.height / 2, 0, ship.height / 2 + flameHeight);
      gradient.addColorStop(0, "rgba(255,255,255,0.9)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0.6)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(-ship.width * 0.3, ship.height * 0.3);
      ctx.lineTo(0, ship.height * 0.5 + flameHeight + flicker);
      ctx.lineTo(ship.width * 0.3, ship.height * 0.3);
      ctx.closePath();
      ctx.fill();
    }

    // Body
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 1.5;
    ctx.fillStyle = "rgba(255,255,255,0.14)";

    ctx.beginPath();
    ctx.moveTo(0, -ship.height * 0.6);
    ctx.lineTo(-ship.width * 0.45, ship.height * 0.4);
    ctx.lineTo(0, ship.height * 0.15);
    ctx.lineTo(ship.width * 0.45, ship.height * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cockpit
    ctx.beginPath();
    ctx.ellipse(0, -ship.height * 0.2, ship.width * 0.2, ship.height * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();

    // Fins
    ctx.beginPath();
    ctx.moveTo(-ship.width * 0.55, ship.height * 0.25);
    ctx.lineTo(-ship.width * 0.9, ship.height * 0.65);
    ctx.lineTo(-ship.width * 0.3, ship.height * 0.4);
    ctx.closePath();
    ctx.moveTo(ship.width * 0.55, ship.height * 0.25);
    ctx.lineTo(ship.width * 0.9, ship.height * 0.65);
    ctx.lineTo(ship.width * 0.3, ship.height * 0.4);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();

    // Score
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "500 18px system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${scoreRef.current}`, width / 2, 30);
  };

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const createMeteor = (width: number, height: number, speedFactor: number): Meteor => {
    const sizeRoll = Math.random();
    let size: MeteorSize = "medium";
    if (sizeRoll < 0.5) size = "small";
    else if (sizeRoll > 0.8) size = "large";

    const radius =
      size === "small" ? 14 + Math.random() * 6 : size === "medium" ? 24 + Math.random() * 10 : 36 + Math.random() * 14;

    const edge = Math.floor(Math.random() * 4); // 0 top, 1 right, 2 bottom, 3 left
    let x = 0;
    let y = 0;
    const margin = 60;
    if (edge === 0) {
      x = Math.random() * width;
      y = -margin;
    } else if (edge === 1) {
      x = width + margin;
      y = Math.random() * height;
    } else if (edge === 2) {
      x = Math.random() * width;
      y = height + margin;
    } else {
      x = -margin;
      y = Math.random() * height;
    }

    const shipPos = spaceshipRef.current.position;
    let dirX = shipPos.x - x;
    let dirY = shipPos.y - y;
    const len = Math.hypot(dirX, dirY) || 1;
    dirX /= len;
    dirY /= len;

    const baseSpeed =
      size === "small" ? 210 + Math.random() * 80 : size === "medium" ? 160 + Math.random() * 60 : 120 + Math.random() * 40;
    const speed = baseSpeed * speedFactor;

    const rotationSpeed = (Math.random() * 2 - 1) * (size === "small" ? 3 : size === "medium" ? 2 : 1.4);

    return {
      id: performance.now() + Math.random(),
      position: { x, y },
      velocity: {
        x: dirX * speed,
        y: dirY * speed,
      },
      radius,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed,
      size,
    };
  };

  const canStart = status === "idle" || status === "over";

  return (
    <div className="fixed inset-0 z-20 pointer-events-none" style={{ top: '5rem' }}>
      <div className="relative h-full w-full">
        <canvas ref={canvasRef} className="h-full w-full pointer-events-auto" />

        {status !== "running" && (
          <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/60 via-black/30 to-black/60 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-4 px-4 text-center text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                {status === "idle" ? "Ready" : "Game Over"}
              </p>
              {finalScore != null && (
                <p className="text-sm text-white/80 sm:text-base">
                  Final score: <span className="font-semibold tabular-nums">{finalScore}</span>
                </p>
              )}
              <button
                type="button"
                onClick={startGame}
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-white transition hover:border-white/60 hover:bg-white/10 sm:px-6 sm:py-2.5"
              >
                {status === "idle" ? "Start Game" : "Restart"}
              </button>
              <p className="text-[10px] text-white/50 sm:text-xs">
                <span className="font-semibold">Q/E</span> or <span className="font-semibold">←/→</span> to rotate, <span className="font-semibold">W/A/S/D</span> or <span className="font-semibold">Arrow keys</span> to move, <span className="font-semibold">Space</span> to shoot
              </p>
              <Link
                href="/leaderboard"
                className="pointer-events-auto text-[11px] font-medium text-white/60 underline-offset-4 hover:text-white hover:underline"
              >
                View leaderboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


