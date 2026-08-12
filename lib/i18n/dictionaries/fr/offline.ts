import { OfflineDict } from "../types";

export const offline: OfflineDict = {
  indicator: (count) => (count > 0 ? `Hors ligne — ${count} action${count > 1 ? "s" : ""} en attente` : "Hors ligne"),
  offlinePage: {
    title: "Vous êtes hors ligne",
    message: "Impossible de charger cette page sans connexion. Vérifiez votre connexion internet et réessayez.",
    retry: "Réessayer",
  },
  checkoutQueued: "Commande enregistrée hors-ligne, elle sera envoyée automatiquement dès le retour de la connexion.",
  wishlistQueuedAdd: "Ajout aux favoris enregistré, sera synchronisé dès le retour de la connexion.",
  wishlistQueuedRemove: "Retrait des favoris enregistré, sera synchronisé dès le retour de la connexion.",
  syncSuccess: (count) => `${count} action${count > 1 ? "s" : ""} synchronisée${count > 1 ? "s" : ""} avec succès.`,
};
