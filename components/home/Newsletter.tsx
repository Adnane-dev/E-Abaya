"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });

    setIsSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.info(t.home.newsletter.alreadySubscribed);
        setEmail("");
        return;
      }
      toast.error(t.home.newsletter.error(error.message));
      return;
    }

    toast.success(t.home.newsletter.success);
    setEmail("");
  }

  return (
    <div className="bg-secondary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t.home.newsletter.heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.home.newsletter.subtitle}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 w-full max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label htmlFor="newsletter-email" className="sr-only">
              {t.home.newsletter.emailLabel}
            </label>
            <input
              type="email"
              id="newsletter-email"
              placeholder={t.home.newsletter.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-md shadow-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition disabled:opacity-60"
            >
              {isSubmitting ? t.home.newsletter.submitting : t.home.newsletter.submit}
            </button>
          </div>
        </form>
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            {t.home.newsletter.privacyNotice}{" "}
            <a href="/privacy" className="underline text-accent hover:text-accent/80">
              {t.home.newsletter.privacyLink}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
