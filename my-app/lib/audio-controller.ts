"use client";

export class AudioController {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private hasInteracted = false;
  private volume = 0.3;

  constructor(src?: string) {
    if (typeof window !== "undefined" && src) {
      this.audio = new Audio(src);
      this.audio.loop = true;
      this.audio.volume = this.volume;
      this.audio.preload = "auto";
    }
  }

  setSource(src: string) {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
    }
    if (typeof window !== "undefined") {
      this.audio = new Audio(src);
      this.audio.loop = true;
      this.audio.volume = this.volume;
      this.audio.preload = "auto";
    }
  }

  play() {
    if (this.audio && !this.isPlaying && this.hasInteracted) {
      this.audio.play().catch((error) => {
        console.warn("Audio play failed:", error);
      });
      this.isPlaying = true;
    }
  }

  pause() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  markInteraction() {
    this.hasInteracted = true;
  }

  cleanup() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    this.isPlaying = false;
  }
}

