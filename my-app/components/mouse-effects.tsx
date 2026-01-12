"use client";

import { useEffect, useRef, useState } from "react";

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
  const [orbiters] = useState<Orbiter[]>(() => [
    { id: 1, angle: 0, radius: 30, speed: 0.03, size: 4 },
    { id: 2, angle: Math.PI / 2, radius: 40, speed: -0.04, size: 3 },
    { id: 3, angle: Math.PI, radius: 25, speed: 0.05, size: 5 },
  ]);

  const animationFrameRef = useRef<number | undefined>(undefined);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const orbiterContainerRef = useRef<HTMLDivElement>(null);
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const targetCursorPositionRef = useRef({ x: 0, y: 0 });
  const magneticTargetRef = useRef<{ x: number; y: number } | null>(null);
  const isHoveringRef = useRef(false);
  const rafTimeRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button") ||
        !!target.closest('[role="button"]') ||
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

    const animate = (currentTime: number) => {
      rafTimeRef.current = currentTime;

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

      animationFrameRef.current = requestAnimationFrame(animate);
    };


    // Hide default cursor on desktop
    if (window.matchMedia("(pointer: fine)").matches) {
      document.body.style.cursor = "none";
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.cursor = "";
    };
  }, [orbiters]);

  return (
    <>
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
