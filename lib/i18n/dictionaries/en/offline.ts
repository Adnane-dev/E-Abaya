import { OfflineDict } from "../types";

export const offline: OfflineDict = {
  indicator: (count) => (count > 0 ? `Offline — ${count} pending action${count > 1 ? "s" : ""}` : "Offline"),
  offlinePage: {
    title: "You're offline",
    message: "This page can't load without a connection. Check your internet connection and try again.",
    retry: "Retry",
  },
  checkoutQueued: "Order saved offline, it will be sent automatically once you're back online.",
  wishlistQueuedAdd: "Wishlist addition saved, it will sync once you're back online.",
  wishlistQueuedRemove: "Wishlist removal saved, it will sync once you're back online.",
  syncSuccess: (count) => `${count} action${count > 1 ? "s" : ""} synced successfully.`,
};
