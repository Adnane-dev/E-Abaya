import { toast } from "sonner";
import { createClient } from "./supabase";
import { getQueue, dequeue, QueuedAction } from "./offlineQueue";
import { Dictionary } from "./i18n/dictionary";

async function replayAction(action: QueuedAction): Promise<boolean> {
  const supabase = createClient();

  if (action.type === "checkout_order") {
    const { error } = await supabase.from("orders").insert(action.payload);
    return !error;
  }

  const { user_id, product_id, action: toggleAction } = action.payload;
  if (toggleAction === "add") {
    const { error } = await supabase.from("wishlists").insert({ user_id, product_id });
    return !error;
  }
  const { error } = await supabase.from("wishlists").delete().eq("user_id", user_id).eq("product_id", product_id);
  return !error;
}

export async function replayQueue(t: Dictionary) {
  const queue = getQueue();
  if (queue.length === 0) return;

  let successCount = 0;
  for (const action of queue) {
    if (await replayAction(action)) {
      dequeue(action.id);
      successCount++;
    }
  }

  if (successCount > 0) {
    toast.success(t.offline.syncSuccess(successCount));
  }
}

// Not using the Background Sync API on purpose: support is inconsistent
// to nonexistent on iOS Safari, which matters for this mobile-first,
// Niger-based audience. The `online` event + a replay attempt on load
// (in case the tab opened already-online with a stale queue from a
// previous offline session) is universally supported and sufficient for
// actions — order placement, wishlist toggles — that aren't latency-critical.
export function registerOnlineSync(t: Dictionary) {
  const handler = () => replayQueue(t);
  window.addEventListener("online", handler);
  if (navigator.onLine) handler();
  return () => window.removeEventListener("online", handler);
}
