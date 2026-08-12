import { LivreurDict } from "../types";

export const livreur: LivreurDict = {
  orderNumber: (id) => `Order #${id}`,
  delivered: "Delivered",
  markPickedUp: "Mark as picked up",
  markDelivered: "Mark as delivered",
  toPickUp: "To pick up",
  inTransit: "In transit",
  deliveredHeading: "Delivery history",
  noOrdersToPickUp: "No orders to pick up right now.",
  noOrdersInTransit: "No orders in transit right now.",
  noDeliveriesYet: "No deliveries completed yet.",
  totalDelivered: "Total delivered:",
  statusUpdateError: (message) => `Error: ${message}`,
  markedPickedUpToast: "Order marked as picked up.",
  markedDeliveredToast: "Order marked as delivered.",
};
