"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

interface WishlistButtonProps {
  productId: number;
  className?: string;
  size?: string;
}

export function WishlistButton({ productId, className, size = "h-4 w-4" }: WishlistButtonProps) {
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
      toast.error("Connectez-vous pour ajouter un article à vos favoris.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    if (isSaved) {
      await supabase.from("wishlists").delete().eq("user_id", userId).eq("product_id", productId);
      setIsSaved(false);
      toast.success("Retiré des favoris.");
    } else {
      await supabase.from("wishlists").insert({ user_id: userId, product_id: productId });
      setIsSaved(true);
      toast.success("Ajouté aux favoris.");
    }
    window.dispatchEvent(new Event("wishlist-updated"));
    setIsLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isLoading}
      aria-label={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={className ?? "p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-sm"}
    >
      <Heart className={`${size} ${isSaved ? "fill-accent text-accent" : "text-foreground"}`} />
    </button>
  );
}
