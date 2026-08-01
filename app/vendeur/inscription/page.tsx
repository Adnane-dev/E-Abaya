"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";
import { slugify } from "@/lib/slug";

export default function VendorSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/auth/login");
      return;
    }

    const { error } = await supabase.from("shops").insert({
      owner_id: userData.user.id,
      name,
      slug: `${slugify(name)}-${userData.user.id.slice(0, 6)}`,
      description,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Erreur lors de la création de la boutique : " + error.message);
      return;
    }

    toast.success("Boutique créée ! Elle sera visible une fois validée par l'équipe.");
    router.push("/vendeur");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-sm p-6">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Créer votre boutique</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Votre boutique sera visible sur le site une fois validée par notre équipe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Nom de la boutique
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-60"
          >
            {isSubmitting ? "Création…" : "Créer ma boutique"}
          </button>
        </form>
      </div>
    </div>
  );
}
