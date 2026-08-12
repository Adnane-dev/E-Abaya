import { CartItem } from "./cart";

export interface CheckoutOrderPayload {
  user_id: string;
  items: CartItem[];
  total: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: "cod" | "mobile_money";
  payment_reference: string | null;
}

export interface WishlistTogglePayload {
  user_id: string;
  product_id: number;
  action: "add" | "remove";
}

export type QueuedAction =
  | { id: string; type: "checkout_order"; payload: CheckoutOrderPayload; createdAt: string }
  | { id: string; type: "wishlist_toggle"; payload: WishlistTogglePayload; createdAt: string };

const QUEUE_EVENT = "offline-queue-updated";
const STORAGE_KEY = "offline-queue";

export function getQueue(): QueuedAction[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedAction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  window.dispatchEvent(new Event(QUEUE_EVENT));
}

export function enqueue(action: Omit<QueuedAction, "id" | "createdAt">) {
  const queue = getQueue();
  queue.push({
    ...action,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  } as QueuedAction);
  saveQueue(queue);
}

export function dequeue(id: string) {
  saveQueue(getQueue().filter((action) => action.id !== id));
}

export function onQueueUpdate(callback: () => void) {
  window.addEventListener(QUEUE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(QUEUE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
