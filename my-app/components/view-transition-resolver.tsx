"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { resolveWhenHeroReady } from "@/lib/view-transition";

/** Tells a pending view transition that the new route has rendered, so the animation can start. */
export function ViewTransitionResolver() {
  const pathname = usePathname();

  useEffect(() => {
    // Wait one frame so the new page has painted, then wait for its hero image before animating
    const frame = requestAnimationFrame(() => void resolveWhenHeroReady());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
