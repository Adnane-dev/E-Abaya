import { OfflineDict } from "../types";

export const offline: OfflineDict = {
  indicator: (count) => (count > 0 ? `Babu intanet — ayyuka ${count} na jira` : "Babu intanet"),
  offlinePage: {
    title: "Ba ki da intanet",
    message: "Ba za a iya lodin wannan shafi ba tare da intanet ba. Duba hadin intanet naki sannan a sake gwada.",
    retry: "Sake gwada",
  },
  checkoutQueued: "An ajiye odarki ba tare da intanet ba, za a tura ta atomatik da zarar intanet ta dawo.",
  wishlistQueuedAdd: "An ajiye kariki na so, za a daidaita da zarar intanet ta dawo.",
  wishlistQueuedRemove: "An ajiye cirewar so, za a daidaita da zarar intanet ta dawo.",
  syncSuccess: (count) => `Ayyuka ${count} sun yi nasarar daidaitawa.`,
};
