"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { Navigation } from "@/components/navigation";
import { MotionProvider } from "@/components/providers/motion-provider";
import { AudioController } from "@/lib/audio-controller";

// Lazy load MouseEffects to reduce initial bundle size
const MouseEffects = lazy(() => import("@/components/mouse-effects").then(mod => ({ default: mod.MouseEffects })));

let audioController: AudioController | null = null;

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showMouseEffects, setShowMouseEffects] = useState(false);

  useEffect(() => {
    // Initialize audio controller (optional - add audio file path if needed)
    // audioController = new AudioController("/ambient-music.mp3");

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // audioController?.markInteraction();
        // audioController?.play();
      }
    };

    // Mark interaction on first user interaction
    const events = ["click", "touchstart", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    // Delay loading mouse effects until after initial load
    if (!isLoading) {
      const timer = setTimeout(() => setShowMouseEffects(true), 500);
      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, handleInteraction);
        });
        clearTimeout(timer);
        audioController?.cleanup();
      };
    }

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleInteraction);
      });
      audioController?.cleanup();
    };
  }, [hasInteracted, isLoading]);

  return (
    <MotionProvider>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      {showMouseEffects && typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches && (
        <Suspense fallback={null}>
          <div className="hidden md:block">
            <MouseEffects />
          </div>
        </Suspense>
      )}
      <div className="h-screen bg-black text-white">
        {!isLoading && <Navigation />}
        <main id="main-content">{children}</main>
      </div>
    </MotionProvider>
  );
}

