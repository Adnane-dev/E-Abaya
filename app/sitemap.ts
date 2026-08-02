import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const STATIC_ROUTES = [
  "",
  "/products",
  "/collections",
  "/about",
  "/contact",
  "/shipping",
  "/sizing",
  "/returns",
  "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const [{ data: products }, { data: categories }, { data: shops }] = await Promise.all([
    supabase.from("products").select("id"),
    supabase.from("categories").select("slug"),
    supabase.from("shops").select("slug").eq("is_approved", true),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const productEntries: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${SITE_URL}/products/${p.id}`,
    lastModified: new Date(),
  }));

  const categoryEntries: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: new Date(),
  }));

  const shopEntries: MetadataRoute.Sitemap = (shops ?? []).map((s) => ({
    url: `${SITE_URL}/boutique/${s.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...productEntries, ...categoryEntries, ...shopEntries];
}
