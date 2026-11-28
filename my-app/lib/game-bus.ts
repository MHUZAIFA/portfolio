// Tiny shared, mutable channel between the space shooter and the hero particle field.
// The game writes to it every frame; the field reads from it every frame.
// Deliberately not React state: both sides run in rAF loops and need zero re-renders.

export type BusPoint = { x: number; y: number };

export type BusBlast = BusPoint & { power: number };

type GameBus = {
  status: "idle" | "running" | "over";
  lasers: ReadonlyArray<{ position: BusPoint }>;
  meteors: ReadonlyArray<{ position: BusPoint; radius: number }>;
  /** Viewport-space impulses (meteor kills, crashes, clicks). Drained by the field each frame. */
  blasts: BusBlast[];
  /** Set once the intro loading screen has finished. */
  appLoaded: boolean;
};

export const gameBus: GameBus = {
  status: "idle",
  lasers: [],
  meteors: [],
  blasts: [],
  appLoaded: false,
};

export const APP_LOADED_EVENT = "app:loaded";

export function markAppLoaded() {
  if (typeof window === "undefined" || gameBus.appLoaded) return;
  gameBus.appLoaded = true;
  window.dispatchEvent(new Event(APP_LOADED_EVENT));
}

export function pushBlast(x: number, y: number, power: number) {
  gameBus.blasts.push({ x, y, power });
  if (gameBus.blasts.length > 32) gameBus.blasts.shift();
}

// ---- Hero intro timeline ---------------------------------------------------
// Everything in the hero choreographs off one moment: the loading screen lifting.
// Times below are seconds after that moment (plus INTRO_DELAY_MS).

export const INTRO_DELAY_MS = 250;

export const INTRO_TIMELINE = {
  /** Particle name has fully warped in; shockwave ripples through it. */
  nameLands: 1.8,
  imA: 2.0,
  role: 2.3,
  description: 2.7,
  cta: 3.2,
  ship: 3.4,
  gamePanel: 3.9,
} as const;

/** Calls `cb` once when the hero intro should begin. Returns an unsubscribe. */
export function onIntroStart(cb: () => void) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const fire = () => {
    timer = setTimeout(cb, INTRO_DELAY_MS);
  };
  if (gameBus.appLoaded) fire();
  else window.addEventListener(APP_LOADED_EVENT, fire, { once: true });
  return () => {
    window.removeEventListener(APP_LOADED_EVENT, fire);
    if (timer) clearTimeout(timer);
  };
}
