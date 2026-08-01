"use client";

import { useState } from "react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    toast.success("Merci ! Vous êtes inscrit(e) à notre newsletter.");
    setEmail("");
  }

  return (
    <div className="bg-secondary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Restez informée
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Inscrivez-vous pour découvrir nos nouvelles collections et offres
            exclusives en avant-première.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 w-full max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label htmlFor="newsletter-email" className="sr-only">
              Adresse e-mail
            </label>
            <input
              type="email"
              id="newsletter-email"
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-md shadow-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition"
            >
              S&apos;abonner
            </button>
          </div>
        </form>
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nous respectons votre vie privée. Consultez notre{" "}
            <a href="/privacy" className="underline text-accent hover:text-accent/80">
              politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
