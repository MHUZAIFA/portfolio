"use client";

/**
 * Cinematic page transitions on top of the browser View Transitions API.
 *
 * `navigateWithTransition` snapshots the current page, pushes the new route, and waits until the
 * new route has rendered AND its hero image has decoded (signalled from <ViewTransitionResolver />)
 * before the browser animates between the two. Elements that share a `view-transition-name` on
 * both pages (the project image) morph from one position to the other.
 *
 * Browsers without the API, and users who prefer reduced motion, get a normal navigation.
 */

type Direction = "forward" | "back";

type RouterLike = {
  push: (href: string, options?: { scroll?: boolean }) => void;
  prefetch?: (href: string) => void;
};

let pending: { resolve: () => void; heroName?: string } | null = null;

export function navigateWithTransition(
  router: RouterLike,
  href: string,
  direction: Direction = "forward",
  /** view-transition-name of the image that morphs; the animation waits for it to be decoded */
  heroName?: string,
) {
  const doc = typeof document !== "undefined" ? document : null;
  const canAnimate =
    !!doc &&
    typeof doc.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Going back, the destination restores its own scroll position, so don't jump to the top
  const pushOptions = direction === "back" ? { scroll: false } : undefined;

  if (!canAnimate) {
    if (direction === "back") markReturning();
    router.push(href, pushOptions);
    return;
  }

  const root = doc.documentElement;
  root.dataset.vt = direction;
  // Lets the destination page name only the matching image while it renders (see `transitionHero`)
  root.dataset.vtHero = heroName ?? "";
  // Only the image that morphs should be its own layer; every other bay stays part of the page
  isolateHero(heroName);

  const transition = doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        pending = { resolve, heroName };
        router.push(href, pushOptions);
        // Safety net: never hold the page frozen if the route change is slow or doesn't happen
        setTimeout(resolvePendingTransition, 1200);
      }),
  );

  transition.finished.finally(() => {
    delete root.dataset.vt;
    delete root.dataset.vtHero;
  });
}

/**
 * Gives the transition name only to the hero being morphed. Every other project image on the page
 * drops its name, so it animates with the page instead of as a separate layer that could be drawn
 * over the travelling image.
 */
function isolateHero(heroName?: string) {
  document.querySelectorAll<HTMLElement>("[data-vt-name]").forEach((el) => {
    el.style.viewTransitionName = heroName && el.dataset.vtName === heroName ? heroName : "none";
  });
}

/** Releases a pending transition so the browser can start animating. */
export function resolvePendingTransition() {
  if (!pending) return;
  const { resolve } = pending;
  pending = null;
  resolve();
}

/**
 * Called once the new route has rendered: waits (briefly) for the morphing hero image to decode,
 * so the animation never starts on an empty frame, then releases the transition.
 */
export async function resolveWhenHeroReady() {
  if (!pending) return;
  const name = pending.heroName;
  if (name) {
    // The new route can commit a moment before its content renders: wait (up to ~150ms) for the hero.
    // Timers, not requestAnimationFrame: rendering (and rAF) is suspended while the transition waits.
    for (let i = 0; i < 10 && !document.querySelector(`[data-vt-name="${name}"]`); i++) {
      await new Promise((r) => setTimeout(r, 15));
    }
  }
  isolateHero(name);
  if (name) {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(`[data-vt-name="${name}"] img`));
    if (imgs.length > 0) {
      await Promise.race([
        Promise.all(imgs.map((img) => img.decode().catch(() => undefined))),
        new Promise((r) => setTimeout(r, 200)),
      ]);
    }
  }
  resolvePendingTransition();
}

/* ── Returning to the projects list where you left it ──────────────────── */

const LIST_STATE_KEY = "projects:list-state";
const RETURNING_KEY = "projects:returning";

export type ListState = { scrollY: number; searchQuery: string; activeCategory: string | null; sortBy: string };

/** Remember the list's scroll position and filters before opening a project. */
export function saveListState(state: ListState) {
  try {
    sessionStorage.setItem(LIST_STATE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: the list just opens at the top */
  }
}

/** Flag a "back" navigation (used when there's no view transition to carry the direction). */
function markReturning() {
  try {
    sessionStorage.setItem(RETURNING_KEY, "1");
  } catch {
    /* ignore */
  }
}

/**
 * The saved list state, but only when we're coming back from a project (not on a fresh visit).
 * Pure (safe to call during render); call `clearReturningFlag` after mount.
 */
export function readReturningListState(): ListState | null {
  if (typeof window === "undefined") return null;
  try {
    const returning = document.documentElement.dataset.vt === "back" || sessionStorage.getItem(RETURNING_KEY) === "1";
    if (!returning) return null;
    const raw = sessionStorage.getItem(LIST_STATE_KEY);
    return raw ? (JSON.parse(raw) as ListState) : null;
  } catch {
    return null;
  }
}

/** So a later, fresh visit to the list starts from the top. */
export function clearReturningFlag() {
  try {
    sessionStorage.removeItem(RETURNING_KEY);
  } catch {
    /* ignore */
  }
}

/** True while a page transition is in flight (pages use it to skip their own entry animations). */
export function isViewTransitionActive() {
  return typeof document !== "undefined" && !!document.documentElement.dataset.vt;
}

/** Unique view-transition name for a project's image, shared by the list bay and the details hero. */
export const projectHeroName = (id: string) => `project-hero-${id}`;

/** The view-transition name of the image currently being morphed, if a transition is running. */
export function transitionHero() {
  return typeof document !== "undefined" ? document.documentElement.dataset.vtHero || null : null;
}

/**
 * Props for an element whose image can morph between pages. With `named: false` the element only
 * carries the marker; it gets its name imperatively (from `isolateHero`) when it's the one opened.
 * Pages that render many candidates (the list) name only the one a transition is returning to, so
 * the others can never become separate layers drawn over the travelling image.
 */
export const heroTransitionProps = (id: string, named = true) => ({
  "data-vt-name": projectHeroName(id),
  style: {
    viewTransitionName: named ? projectHeroName(id) : "none",
    viewTransitionClass: "project-hero",
  } as React.CSSProperties,
});
