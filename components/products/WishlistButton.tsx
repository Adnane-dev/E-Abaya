"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";
import { enqueue } from "@/lib/offlineQueue";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface WishlistButtonProps {
  productId: number;
  className?: string;
  size?: string;
}

export function WishlistButton({ productId, className, size = "h-4 w-4" }: WishlistButtonProps) {
  const { t } = useTranslation();
  const [isSaved, setIsSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      setUserId(userData.user.id);

      const { data } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", userData.user.id)
        .eq("product_id", productId)
        .maybeSingle();
      setIsSaved(!!data);
    }
    check();
  }, [productId]);

  async function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!userId) {
      toast.error(t.account.wishlist.loginToSave);
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const wasOffline = !navigator.onLine;
    const nextSaved = !isSaved;

    const { error } = nextSaved
      ? await supabase.from("wishlists").insert({ user_id: userId, product_id: productId })
      : await supabase.from("wishlists").delete().eq("user_id", userId).eq("product_id", productId);

    const looksLikeNetworkError = wasOffline || (error && /fetch|network/i.test(error.message));

    if (error && looksLikeNetworkError) {
      enqueue({
        type: "wishlist_toggle",
        payload: { user_id: userId, product_id: productId, action: nextSaved ? "add" : "remove" },
      });
      setIsSaved(nextSaved);
      toast.success(nextSaved ? t.offline.wishlistQueuedAdd : t.offline.wishlistQueuedRemove);
    } else if (error) {
      toast.error(error.message);
    } else {
      setIsSaved(nextSaved);
      toast.success(nextSaved ? t.account.wishlist.added : t.account.wishlist.removed);
    }

    window.dispatchEvent(new Event("wishlist-updated"));
    setIsLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isLoading}
      aria-label={isSaved ? t.account.wishlist.removeAria : t.account.wishlist.addAria}
      className={className ?? "p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-sm"}
    >
      <Heart className={`${size} ${isSaved ? "fill-accent text-accent" : "text-foreground"}`} />
    </button>
  );
}
