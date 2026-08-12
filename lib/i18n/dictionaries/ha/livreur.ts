import { LivreurDict } from "../types";

export const livreur: LivreurDict = {
  orderNumber: (id) => `Oda lamba ${id}`,
  delivered: "An kai",
  markPickedUp: "Alama an karɓa",
  markDelivered: "Alama an kai",
  toPickUp: "Za a karɓa",
  inTransit: "Ana kaiwa",
  deliveredHeading: "Tarihin kayan da aka kai",
  noOrdersToPickUp: "Babu oda da za a karɓa a yanzu.",
  noOrdersInTransit: "Babu oda da ake kaiwa a yanzu.",
  noDeliveriesYet: "Babu wanda aka kai tukuna.",
  totalDelivered: "Jumlar da aka kai:",
  statusUpdateError: (message) => `Kuskure: ${message}`,
  markedPickedUpToast: "An sanya odar a matsayin an karɓa.",
  markedDeliveredToast: "An sanya odar a matsayin an kai.",
};
