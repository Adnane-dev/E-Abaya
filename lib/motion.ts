import { Variants } from "framer-motion";

export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeUpTransition = {
  duration: 0.6,
  ease: EASE_PREMIUM,
};

export function staggerDelay(index: number, step = 0.08) {
  return { delay: index * step };
}

export const scrollReveal = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-80px" },
  variants: fadeUp,
  transition: fadeUpTransition,
};

// Whole-page crossfade on route change. Kept short and to opacity/transform
// only (both GPU-composited, cheap even on low-end Android) since Navbar/
// Footer are rendered per-page rather than in the root layout — they fade
// along with the content, so a longer or bouncier transition would make
// every navigation feel sluggish instead of premium.
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const pageTransitionSettings = {
  duration: 0.22,
  ease: EASE_PREMIUM,
};
