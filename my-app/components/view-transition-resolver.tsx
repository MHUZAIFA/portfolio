"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { resolveWhenHeroReady } from "@/lib/view-transition";

/** Tells a pending view transition that the new route has rendered, so the animation can start. */
export function ViewTransitionResolver() {
  const pathname = usePathname();

  useEffect(() => {
    // A timer, not requestAnimationFrame: while a view transition waits for its update, the browser
    // suspends rendering, so rAF wouldn't fire until the safety timeout (a ~1s freeze).
    const t = setTimeout(() => void resolveWhenHeroReady(), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
