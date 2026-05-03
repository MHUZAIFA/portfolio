"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Public URL — avoids Turbopack HMR bugs with static `import` of files under `public/`. */
const PROFILE_SRC = "/imgs/huzaifa.jpg";
/** Must match huzaifa.jpg dimensions for stable layout (update if you replace the file). */
const PROFILE_WIDTH = 724;
const PROFILE_HEIGHT = 1268;

const unoptimizedInDev = process.env.NODE_ENV === "development";

/** Radius of the color “hole” in the grayscale overlay (px). */
const SPOTLIGHT_RADIUS = 100;

type ProfilePhotoSpotlightProps = {
  alt: string;
  className?: string;
};

export function ProfilePhotoSpotlight({ alt, className }: ProfilePhotoSpotlightProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, active: false });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSpot({
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      active: true,
    });
  }, []);

  const onLeave = useCallback(() => {
    setSpot((s) => ({ ...s, active: false }));
  }, []);

  const mask = spot.active
    ? `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${spot.x}px ${spot.y}px, transparent 0%, transparent 55%, rgba(0,0,0,0.35) 70%, black 100%)`
    : undefined;

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative w-[240px] max-w-full select-none overflow-hidden rounded-2xl border border-white/10 shadow-lg",
        className
      )}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Image
        src={PROFILE_SRC}
        alt={alt}
        width={PROFILE_WIDTH}
        height={PROFILE_HEIGHT}
        sizes="(max-width: 768px) 100vw, 240px"
        className="relative z-0 block h-auto w-full"
        priority
        unoptimized={unoptimizedInDev}
      />
      <Image
        src={PROFILE_SRC}
        alt=""
        width={PROFILE_WIDTH}
        height={PROFILE_HEIGHT}
        sizes="(max-width: 768px) 100vw, 240px"
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full object-contain object-center grayscale"
        unoptimized={unoptimizedInDev}
        style={
          mask
            ? {
                WebkitMaskImage: mask,
                maskImage: mask,
              }
            : undefined
        }
        aria-hidden
      />
    </div>
  );
}
