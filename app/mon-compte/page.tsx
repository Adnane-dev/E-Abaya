"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase";

export default function MyAccountPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      setEmail(userData.user.email ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("id", userData.user.id)
        .maybeSingle();

      setFullName(data?.full_name ?? "");
      setPhone(data?.phone ?? "");
      setAddress(data?.address ?? "");
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, address })
      .eq("id", userData.user.id);

    setIsSaving(false);

    if (error) {
      toast.error("Erreur lors de l'enregistrement : " + error.message);
      return;
    }
    toast.success("Profil mis à jour.");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Mon compte</h1>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement…</p>
        ) : !isLoggedIn ? (
          <p className="text-muted-foreground">
            <Link href="/auth/login" className="text-accent hover:text-accent/80 font-medium">
              Connectez-vous
            </Link>{" "}
            pour accéder à votre compte.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-lg p-6">
            <div>
              <label className="block text-sm font-medium text-foreground">Adresse e-mail</label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground"
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                Nom complet
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-foreground">
                Adresse de livraison habituelle
              </label>
              <textarea
                id="address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-60"
            >
              {isSaving ? "Enregistrement…" : "Enregistrer"}
            </button>

            <div className="pt-4 border-t border-border">
              <Link href="/mes-commandes" className="text-accent hover:text-accent/80 font-medium text-sm">
                Voir mes commandes →
              </Link>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}
