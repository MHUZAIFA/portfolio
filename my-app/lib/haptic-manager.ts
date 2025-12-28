"use client";

export class HapticManager {
  private isSupported = false;

  constructor() {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      this.isSupported = true;
    }
  }

  vibrate(pattern: number | number[] = 10) {
    if (this.isSupported && typeof window !== "undefined") {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn("Vibration failed:", error);
      }
    }
  }

  light() {
    this.vibrate(5);
  }

  medium() {
    this.vibrate(10);
  }

  heavy() {
    this.vibrate(20);
  }

  pattern(pattern: number[]) {
    this.vibrate(pattern);
  }
}

export const hapticManager = new HapticManager();

