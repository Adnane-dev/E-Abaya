"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Truck, Clock, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase";

type State = "loading" | "guest" | "approved" | "pending" | "form";

export default function BecomeCourierPage() {
  const [state, setState] = useState<State>("loading");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setState("guest");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("is_courier, courier_requested, phone")
        .eq("id", userData.user.id)
        .maybeSingle();

      setPhone(data?.phone ?? "");

      if (data?.is_courier) setState("approved");
      else if (data?.courier_requested) setState("pending");
      else setState("form");
    }
    loadStatus();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ phone, courier_requested: true })
      .eq("id", userData.user.id);

    setIsSubmitting(false);

    if (error) {
      toast.error("Erreur : " + error.message);
      return;
    }

    toast.success("Candidature envoyée !");
    setState("pending");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="flex items-center gap-2 mb-6">
          <Truck className="h-6 w-6 text-accent" />
          <h1 className="font-serif text-2xl font-bold text-foreground">Devenir livreur</h1>
        </div>

        {state === "loading" && <p className="text-muted-foreground">Chargement…</p>}

        {state === "guest" && (
          <p className="text-muted-foreground">
            <Link href="/auth/login" className="text-accent hover:text-accent/80 font-medium">
              Connectez-vous ou créez un compte
            </Link>{" "}
            pour postuler comme livreur.
          </p>
        )}

        {state === "approved" && (
          <div className="flex items-start gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5 text-primary">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Vous êtes déjà livreur.</p>
              <Link href="/livreur" className="text-sm underline">
                Accéder à mon espace livreur →
              </Link>
            </div>
          </div>
        )}

        {state === "pending" && (
          <div className="flex items-start gap-3 p-4 rounded-lg border border-accent/30 bg-accent/5 text-accent">
            <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>
              Votre candidature est en cours d&apos;examen. Nous vous contacterons dès qu&apos;elle sera validée.
            </p>
          </div>
        )}

        {state === "form" && (
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              Livrez les commandes de nos clients et gagnez un revenu complémentaire. Votre
              candidature sera examinée par notre équipe avant activation.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                  Numéro de téléphone
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-60"
              >
                {isSubmitting ? "Envoi…" : "Envoyer ma candidature"}
              </button>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
