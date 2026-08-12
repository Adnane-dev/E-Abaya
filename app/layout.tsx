import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL, SITE_NAME } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

const TITLE = 'Islamic Style-Girls - Mode modeste premium';
const DESCRIPTION =
  'Abayas, hijabs, kaftans et robes soigneusement sélectionnés, entre héritage africain et raffinement arabe.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: '/logo.png', width: 1254, height: 1254, alt: SITE_NAME }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/logo.png'],
  },
};

const DEFAULT_ACCENT = '15 55% 40%';
const ACCENT_PATTERN = /^\d{1,3}\s\d{1,3}%\s\d{1,3}%$/;

// Theme color changes are rare — revalidate hourly instead of querying
// Supabase (and forcing every page to render dynamically) on every
// single request just to read one settings row.
export const revalidate = 3600;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Plain anon-key client (no cookies) so this public, auth-free read
  // doesn't force every page in the app to render dynamically — using
  // Next.js's cookies() API anywhere opts the whole route out of
  // static generation, which the theme color has no need for.
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await supabase.from('site_settings').select('accent_hsl').eq('id', 1).maybeSingle();
  const accentHsl = data?.accent_hsl && ACCENT_PATTERN.test(data.accent_hsl) ? data.accent_hsl : DEFAULT_ACCENT;

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <style>{`:root { --accent: ${accentHsl}; --ring: ${accentHsl}; }`}</style>
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Toaster position="top-center" richColors />
            <ServiceWorkerRegister />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
