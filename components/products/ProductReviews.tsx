"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface Review {
  id: number;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
}

interface ProductReviewsProps {
  productId: number;
}

function StarRating({
  value,
  onChange,
  size = "h-5 w-5",
}: {
  value: number;
  onChange?: (rating: number) => void;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`${size} ${star <= value ? "fill-accent text-accent" : "text-muted-foreground"}`}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  async function loadReviews() {
    setIsLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles(full_name)")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    const fetched = (data as unknown as Review[]) ?? [];
    setReviews(fetched);
    setIsLoading(false);
    return fetched;
  }

  useEffect(() => {
    async function init() {
      const [fetched, { data: userData }] = await Promise.all([loadReviews(), supabase.auth.getUser()]);
      setUserId(userData.user?.id ?? null);
      const own = fetched.find((r) => r.user_id === userData.user?.id);
      if (own) {
        setRating(own.rating);
        setComment(own.comment);
      }
    }
    init();
  }, [productId]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!userId) {
      toast.error("Connectez-vous pour laisser un avis.");
      return;
    }
    if (rating === 0) {
      toast.error("Merci de choisir une note.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from("reviews")
      .upsert({ product_id: productId, user_id: userId, rating, comment }, { onConflict: "product_id,user_id" });
    setIsSubmitting(false);

    if (error) {
      toast.error("Erreur : " + error.message);
      return;
    }

    toast.success("Merci pour votre avis !");
    loadReviews();
  }

  return (
    <div className="mt-16 border-t border-border pt-10">
      <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Avis clients</h2>

      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-8">
          <StarRating value={Math.round(averageRating)} />
          <span className="text-muted-foreground text-sm">
            {averageRating.toFixed(1)} / 5 ({reviews.length} avis)
          </span>
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <p className="text-muted-foreground mb-8">Aucun avis pour le moment. Soyez le premier à en laisser un.</p>
      )}

      <div className="space-y-6 mb-10">
        {reviews.map((review) => (
          <div key={review.id} className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-foreground">{review.profiles?.full_name || "Client"}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <StarRating value={review.rating} size="h-4 w-4" />
            {review.comment && <p className="mt-2 text-muted-foreground text-sm">{review.comment}</p>}
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-medium text-foreground mb-3">Laisser un avis</h3>
        {userId ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <StarRating value={rating} onChange={setRating} />
            <textarea
              placeholder="Votre commentaire (facultatif)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? "Envoi…" : "Publier mon avis"}
            </button>
          </form>
        ) : (
          <p className="text-muted-foreground text-sm">
            <a href="/auth/login" className="text-accent hover:text-accent/80 font-medium">
              Connectez-vous
            </a>{" "}
            pour laisser un avis.
          </p>
        )}
      </div>
    </div>
  );
}
