import { LivreurDict } from "../types";

export const livreur: LivreurDict = {
  orderNumber: (id) => `الطلب رقم ${id}`,
  delivered: "تم التوصيل",
  markPickedUp: "تحديد كمستلَم",
  markDelivered: "تحديد كمُوصَّل",
  toPickUp: "للاستلام",
  inTransit: "قيد التوصيل",
  deliveredHeading: "سجل التوصيلات",
  noOrdersToPickUp: "لا توجد طلبات لاستلامها الآن.",
  noOrdersInTransit: "لا توجد طلبات قيد التوصيل الآن.",
  noDeliveriesYet: "لم يتم إتمام أي توصيل حتى الآن.",
  totalDelivered: "إجمالي ما تم توصيله:",
  statusUpdateError: (message) => `خطأ: ${message}`,
  markedPickedUpToast: "تم تحديد الطلب كمستلَم.",
  markedDeliveredToast: "تم تحديد الطلب كمُوصَّل.",
};
