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
