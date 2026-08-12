import { HomeDict } from "../types";

export const home: HomeDict = {
  hero: {
    ariaLabel: "Islamic Style-Girls shop introduction",
    kicker: "Modest fashion, Africa & the Arab world",
    title: "Veiled elegance, reinvented",
    subtitle:
      "Abayas, hijabs, kaftans and dresses carefully curated, blending African heritage with Arab refinement.",
    ctaPrimary: "Shop new arrivals",
    ctaSecondary: "Our story",
  },
  featured: {
    heading: "Our favorites",
    empty: "The catalog is coming very soon — check back shortly!",
    viewDetails: (name) => `View details for ${name}`,
    soldBy: (name) => `Sold by ${name}`,
  },
  categoriesShowcase: {
    heading: "Our collections",
    discover: (name) => `Discover ${name}`,
  },
  newsletter: {
    heading: "Stay in the loop",
    subtitle:
      "Sign up to be the first to discover our new collections and exclusive offers.",
    emailLabel: "Email address",
    emailPlaceholder: "Your email address",
    submit: "Subscribe",
    submitting: "Sending…",
    alreadySubscribed: "You're already subscribed to our newsletter.",
    error: (message) => `Subscription error: ${message}`,
    success: "Thank you! You're now subscribed to our newsletter.",
    privacyNotice: "We respect your privacy. Read our",
    privacyLink: "privacy policy",
  },
};
