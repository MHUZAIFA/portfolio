"use client";

import { useEffect, useRef, useState } from "react";

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

interface Orbiter {
  id: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
}

export function MouseEffects() {
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [magneticTarget, setMagneticTarget] = useState<{ x: number; y: number } | null>(null);
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const [orbiters] = useState<Orbiter[]>(() => [
    { id: 1, angle: 0, radius: 30, speed: 0.03, size: 4 },
    { id: 2, angle: Math.PI / 2, radius: 40, speed: -0.04, size: 3 },
    { id: 3, angle: Math.PI, radius: 25, speed: 0.05, size: 5 },
  ]);
  
  const animationFrameRef = useRef<number>();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const orbiterContainerRef = useRef<HTMLDivElement>(null);
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const targetCursorPositionRef = useRef({ x: 0, y: 0 });
  const magneticTargetRef = useRef<{ x: number; y: number } | null>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const trailPointsRef = useRef<TrailPoint[]>([]);
  const isHoveringRef = useRef(false);
  const hueOffsetRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHoveringInteractive(isInteractive);
      isHoveringRef.current = isInteractive;

      // Magnetic effect - pull cursor toward interactive elements
      if (isInteractive && target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        magneticTargetRef.current = { x: centerX, y: centerY };
        setMagneticTarget({ x: centerX, y: centerY });
      } else {
        magneticTargetRef.current = null;
        setMagneticTarget(null);
      }

      // Update trail points for smooth gradient trail
      const newPoint = { x: currentX, y: currentY, time: Date.now() };
      trailPointsRef.current = [
        ...trailPointsRef.current,
        newPoint,
      ].filter((point) => Date.now() - point.time < 800).slice(-30);
      
      setTrailPoints(trailPointsRef.current);

      // Update target position (with magnetic pull if near interactive element)
      if (magneticTargetRef.current) {
        const dx = magneticTargetRef.current.x - currentX;
        const dy = magneticTargetRef.current.y - currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100; // Magnetic range
        
        if (distance < maxDistance) {
          const strength = (1 - distance / maxDistance) * 0.3; // 30% max pull
          targetCursorPositionRef.current = {
            x: currentX + dx * strength,
            y: currentY + dy * strength,
          };
        } else {
          targetCursorPositionRef.current = { x: currentX, y: currentY };
        }
      } else {
        targetCursorPositionRef.current = { x: currentX, y: currentY };
      }
    };

    const animate = () => {
      // Smooth cursor follower animation with magnetic effect
      if (cursorRef.current) {
        const target = targetCursorPositionRef.current;
        const current = cursorPositionRef.current;
        
        // Smooth interpolation
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        
        cursorPositionRef.current = {
          x: current.x + dx * 0.2,
          y: current.y + dy * 0.2,
        };
        
        cursorRef.current.style.transform = `translate(${cursorPositionRef.current.x}px, ${cursorPositionRef.current.y}px)`;
      }

      // Update orbiter positions
      if (orbiterContainerRef.current) {
        orbiters.forEach((orbiter, index) => {
          orbiter.angle += orbiter.speed;
          
          const orbiterElement = orbiterContainerRef.current?.children[index] as HTMLElement;
          if (orbiterElement) {
            const radius = isHoveringRef.current ? orbiter.radius * 1.5 : orbiter.radius;
            const x = Math.cos(orbiter.angle) * radius;
            const y = Math.sin(orbiter.angle) * radius;
            
            orbiterElement.style.transform = `translate(${x}px, ${y}px)`;
            orbiterElement.style.opacity = isHoveringRef.current ? "1" : "0.6";
            orbiterElement.style.width = isHoveringRef.current ? `${orbiter.size * 1.5}px` : `${orbiter.size}px`;
            orbiterElement.style.height = isHoveringRef.current ? `${orbiter.size * 1.5}px` : `${orbiter.size}px`;
          }
        });
      }

      // Draw shooting star trail on canvas
      const canvas = trailCanvasRef.current;
      const currentTrailPoints = trailPointsRef.current;
      if (canvas && currentTrailPoints.length > 1) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Animate hue for color shifting
          hueOffsetRef.current = (hueOffsetRef.current + 0.5) % 360;
          
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          
          // Draw shooting star trail - bright head fading to tail
          const totalPoints = currentTrailPoints.length;
          
          for (let i = 0; i < totalPoints - 1; i++) {
            const current = currentTrailPoints[i];
            const next = currentTrailPoints[i + 1];
            const age = Date.now() - current.time;
            
            // Progress from head (0) to tail (1)
            const progress = i / (totalPoints - 1);
            const reverseProgress = 1 - progress; // 1 at head, 0 at tail
            
            // Opacity fades dramatically based on position - steeper curve for faster tail fade
            const ageOpacity = Math.max(0, 1 - age / 800);
            // Use cubic curve for much more dramatic fade (progress^3 means tail fades very quickly)
            const positionOpacity = Math.pow(reverseProgress, 3);
            const opacity = ageOpacity * positionOpacity;
            
            // Skip drawing if opacity is too low
            if (opacity < 0.05) continue;
            
            // Width: much larger at head, very thin at tail - dramatic taper
            const baseWidth = isHoveringRef.current ? 14 : 8;
            // Use squared curve for more dramatic width taper
            const widthMultiplier = Math.pow(reverseProgress, 2);
            const width = baseWidth * (0.1 + 0.9 * widthMultiplier) * opacity;
            
            // Color: much brighter/whiter at head, fades to transparent at tail
            const hue = (Math.floor(hueOffsetRef.current) + progress * 40) % 360;
            const saturation = 40 + progress * 30; // Less saturated at head
            const lightness = 95 - progress * 25; // Much brighter at head
            
            // Create gradient for each segment
            const gradient = ctx.createLinearGradient(
              current.x, current.y,
              next.x, next.y
            );
            
            // Head color (very bright, almost white)
            const headColor = `hsla(${hue}, ${saturation * 0.3}%, ${lightness}%, ${opacity})`;
            // Tail color (very transparent, fades quickly)
            const tailColor = `hsla(${hue}, ${saturation}%, ${lightness - 15}%, ${opacity * 0.1})`;
            
            gradient.addColorStop(0, headColor);
            gradient.addColorStop(1, tailColor);
            
            ctx.globalAlpha = 1;
            ctx.lineWidth = width;
            ctx.strokeStyle = gradient;
            
            // Glow effect - much stronger at head, fades quickly
            const glowIntensity = Math.pow(reverseProgress, 2) * opacity;
            ctx.shadowBlur = width * 12 * glowIntensity;
            ctx.shadowColor = `hsla(${hue}, ${saturation * 0.5}%, ${lightness}%, ${opacity * 0.8})`;
            
            ctx.beginPath();
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
          }
          
          // Draw bright head/core at the most recent point - much more prominent
          if (totalPoints > 0) {
            const headPoint = currentTrailPoints[totalPoints - 1];
            const headAge = Date.now() - headPoint.time;
            const headOpacity = Math.max(0, 1 - headAge / 800);
            
            const headHue = Math.floor(hueOffsetRef.current) % 360;
            const headSize = isHoveringRef.current ? 20 : 14;
            
            // Very bright core with multiple layers for shooting star effect
            const coreGradient = ctx.createRadialGradient(
              headPoint.x, headPoint.y, 0,
              headPoint.x, headPoint.y, headSize * 1.5
            );
            coreGradient.addColorStop(0, `hsla(${headHue}, 20%, 98%, ${headOpacity})`);
            coreGradient.addColorStop(0.3, `hsla(${headHue}, 30%, 95%, ${headOpacity * 0.9})`);
            coreGradient.addColorStop(0.6, `hsla(${headHue}, 40%, 90%, ${headOpacity * 0.6})`);
            coreGradient.addColorStop(1, `hsla(${headHue}, 50%, 85%, 0)`);
            
            ctx.globalAlpha = 1;
            ctx.fillStyle = coreGradient;
            ctx.shadowBlur = 30 * headOpacity;
            ctx.shadowColor = `hsla(${headHue}, 30%, 95%, ${headOpacity})`;
            ctx.beginPath();
            ctx.arc(headPoint.x, headPoint.y, headSize * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner bright core
            const innerCoreGradient = ctx.createRadialGradient(
              headPoint.x, headPoint.y, 0,
              headPoint.x, headPoint.y, headSize * 0.6
            );
            innerCoreGradient.addColorStop(0, `hsla(${headHue}, 10%, 100%, ${headOpacity})`);
            innerCoreGradient.addColorStop(1, `hsla(${headHue}, 20%, 98%, 0)`);
            
            ctx.fillStyle = innerCoreGradient;
            ctx.shadowBlur = 15 * headOpacity;
            ctx.beginPath();
            ctx.arc(headPoint.x, headPoint.y, headSize * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Reset shadow
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Set canvas size
    const resizeCanvas = () => {
      if (trailCanvasRef.current) {
        trailCanvasRef.current.width = window.innerWidth;
        trailCanvasRef.current.height = window.innerHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Hide default cursor on desktop
    if (window.matchMedia("(pointer: fine)").matches) {
      document.body.style.cursor = "none";
    }

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.cursor = "";
    };
  }, [orbiters]);

  return (
    <>
      {/* Gradient Trail Canvas */}
      <canvas
        ref={trailCanvasRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Custom Cursor with Orbiters */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          willChange: "transform",
        }}
      >
        {/* Main cursor dot */}
        <div
          ref={cursorInnerRef}
          className={`rounded-full transition-all duration-300 ${
            isHoveringInteractive
              ? "w-12 h-12 bg-white/20 backdrop-blur-sm border-2 border-white/60"
              : "w-6 h-6 bg-white/80 mix-blend-difference"
          }`}
          style={{
            transform: "translate(-50%, -50%)",
            boxShadow: isHoveringInteractive
              ? "0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)"
              : "0 0 15px rgba(255, 255, 255, 0.8)",
          }}
        />

        {/* Orbiting dots */}
        <div
          ref={orbiterContainerRef}
          className="absolute top-0 left-0"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          {orbiters.map((orbiter) => (
            <div
              key={orbiter.id}
              className="absolute top-0 left-0 rounded-full bg-white transition-all duration-300"
              style={{
                width: `${orbiter.size}px`,
                height: `${orbiter.size}px`,
                opacity: 0.6,
                boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Magnetic pull indicator */}
      {isHoveringInteractive && magneticTarget && (
        <div
          className="fixed pointer-events-none z-[9996] rounded-full border border-white/30 transition-all duration-300"
          style={{
            left: `${magneticTarget.x}px`,
            top: `${magneticTarget.y}px`,
            width: "100px",
            height: "100px",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 40px rgba(255, 255, 255, 0.2)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      )}
    </>
  );
}
