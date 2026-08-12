import { LivreurDict } from "../types";

export const livreur: LivreurDict = {
  orderNumber: (id) => `Commande n° ${id}`,
  delivered: "Livrée",
  markPickedUp: "Marquer comme récupérée",
  markDelivered: "Marquer comme livrée",
  toPickUp: "À récupérer",
  inTransit: "En cours de livraison",
  deliveredHeading: "Historique des livraisons",
  noOrdersToPickUp: "Aucune commande à récupérer pour le moment.",
  noOrdersInTransit: "Aucune commande en cours de livraison.",
  noDeliveriesYet: "Aucune livraison effectuée pour le moment.",
  totalDelivered: "Total livré :",
  statusUpdateError: (message) => `Erreur : ${message}`,
  markedPickedUpToast: "Commande marquée comme récupérée.",
  markedDeliveredToast: "Commande marquée comme livrée.",
};
