# Islamic Style-Girls

Boutique en ligne de mode modeste (abayas, hijabs, kaftans, robes), pensée pour un public africain et arabe, majoritairement basé au Niger.

Site en production : https://islamic-style-girls.netlify.app/

## Stack technique

- [Next.js 15](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- Framer Motion pour les animations
- [Supabase](https://supabase.com/) (Postgres + Auth + Storage) comme backend
- Déploiement continu sur Netlify (branche `master`)

## Démarrage local

```bash
npm install
npm run dev
```

Le site est disponible sur http://localhost:3000.

### Configuration Supabase

1. Créer un fichier `.env.local` à partir de `.env.local.example` :

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

   Ces valeurs se trouvent dans le dashboard Supabase, *Project Settings → API* (clé **publique**/`anon`/`publishable` — jamais la clé secrète/`service_role`, qui ne doit jamais être utilisée côté client).

2. Exécuter le script `supabase/schema.sql` dans l'éditeur SQL du projet Supabase (*SQL Editor → New query*) pour créer les tables (`products`, `profiles`, `orders`), les policies RLS, et le bucket de stockage `product-images`.

3. Le catalogue démarre vide : ajouter les produits (avec vos propres photos) via l'espace admin une fois connecté.

## Structure du projet

- `app/` — pages (App Router), y compris `app/admin/*` (back-office)
- `components/` — composants réutilisables (`home/`, `layout/`, `products/`, `ui/`)
- `lib/` — utilitaires partagés (`supabase.ts`, `motion.ts`, `cart.ts`)
- `supabase/schema.sql` — schéma de base de données de référence

## Déploiement

Le dépôt GitHub (`Adnane-dev/E-Abaya`) est connecté à Netlify : chaque push sur `master` déclenche automatiquement un build et un déploiement. Les variables d'environnement Supabase doivent aussi être configurées côté Netlify (*Site settings → Environment variables*) avec les mêmes valeurs que `.env.local`.

## App mobile

Une version mobile (Android + iOS) est prévue via [Capacitor](https://capacitorjs.com/), qui embarque le site déployé dans une coquille native installable sur le Play Store et l'App Store.
