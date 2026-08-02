const STORAGE_KEY = "order-status-seen";

type SeenMap = Record<number, string>;
type OrderStatusRow = { id: number; status: string };

function readSeenMap(): SeenMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function getUnseenOrderCount(orders: OrderStatusRow[]): number {
  const seen = readSeenMap();
  return orders.filter((order) => seen[order.id] !== order.status).length;
}

export function markOrdersSeen(orders: OrderStatusRow[]) {
  const seen = readSeenMap();
  for (const order of orders) seen[order.id] = order.status;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
}
