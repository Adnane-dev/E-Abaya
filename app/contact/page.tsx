"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Message envoyé ! Nous vous répondrons rapidement.");
      event.currentTarget.reset();
      setIsSubmitting(false);
    }, 500);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground">Contactez-nous</h1>
        <p className="mt-4 text-muted-foreground">
          Une question sur une commande, une taille, ou nos collections ? Écrivez-nous.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder="Votre message"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-60"
          >
            {isSubmitting ? "Envoi…" : "Envoyer le message"}
          </button>
        </form>

        <div className="mt-10">
          <h2 className="font-serif text-xl font-medium text-foreground">Nous joindre</h2>
          <p className="mt-2 text-muted-foreground">
            Le formulaire ci-dessus est le moyen le plus rapide de nous contacter.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
