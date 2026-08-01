"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { GoogleButton } from "@/components/auth/GoogleButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const supabase = createClient();
    const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setIsSubmitting(false);
      toast.error("Connexion impossible : " + error.message);
      return;
    }

    toast.success("Connexion réussie !");

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", signInData.user.id)
      .maybeSingle();

    if (profile?.is_admin) {
      router.push("/admin");
      return;
    }

    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("owner_id", signInData.user.id)
      .maybeSingle();

    setIsSubmitting(false);
    router.push(shop ? "/vendeur" : "/");
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-accent transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>
        <h2 className="mt-6 text-center font-serif text-3xl font-bold text-foreground">
          Connexion
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10 border-border">
          <GoogleButton />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">ou avec votre e-mail</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Adresse e-mail
              </label>
              <div className="mt-1 relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
                <Mail className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
                <Lock className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Connexion…" : "Se connecter"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/auth/RegisterPage" className="text-accent hover:text-accent/80 font-medium">
              Créer un compte
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
