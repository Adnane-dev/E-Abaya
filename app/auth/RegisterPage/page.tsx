"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const v = t.auth.register.validation;

    if (!formData.fullName) newErrors.fullName = v.fullNameRequired;
    if (!formData.email) newErrors.email = v.emailRequired;
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = v.emailInvalid;
    if (!formData.password) newErrors.password = v.passwordRequired;
    else if (formData.password.length < 6) newErrors.password = v.passwordTooShort;
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = v.passwordMismatch;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }

    if (data.user) {
      await supabase
        .from("profiles")
        .update({ full_name: formData.fullName, address: formData.address })
        .eq("id", data.user.id);
    }

    toast.success(t.auth.register.successToast);
    setIsSubmitting(false);
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full p-6 bg-card shadow-lg rounded-md border border-border">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-sm mb-4">
          <ArrowLeft className="h-4 w-4" />
          {t.auth.register.backHome}
        </Link>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{t.auth.register.title}</h2>

        <GoogleButton />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">{t.auth.register.orEmail}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
              {t.auth.register.fullNameLabel}
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              {t.auth.register.emailLabel}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              {t.auth.register.passwordLabel}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
              {t.auth.register.confirmPasswordLabel}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-foreground">
              {t.auth.register.addressLabel}
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-60"
          >
            {isSubmitting ? t.auth.register.submitting : t.auth.register.submit}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.auth.register.alreadyAccount}{" "}
          <Link href="/auth/login" className="text-accent hover:text-accent/80 font-medium">
            {t.auth.register.login}
          </Link>
        </p>
      </div>
    </div>
  );
}
