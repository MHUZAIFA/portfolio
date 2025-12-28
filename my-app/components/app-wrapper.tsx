"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { Navigation } from "@/components/navigation";
import { MotionProvider } from "@/components/providers/motion-provider";
import { AudioController } from "@/lib/audio-controller";

let audioController: AudioController | null = null;

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

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
      document.addEventListener(event, handleInteraction, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleInteraction);
      });
      audioController?.cleanup();
    };
  }, [hasInteracted]);

  return (
    <MotionProvider>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className="h-screen bg-black text-white">
        <Navigation />
        <main className="pt-20">{children}</main>
      </div>
    </MotionProvider>
  );
}

