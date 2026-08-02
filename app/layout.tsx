import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { createClient } from '@supabase/supabase-js';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Islamic Style-Girls - Mode modeste premium',
  description: 'Abayas, hijabs, kaftans et robes soigneusement sélectionnés, entre héritage africain et raffinement arabe.',
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
    <html lang="en">
      <head>
        <style>{`:root { --accent: ${accentHsl}; --ring: ${accentHsl}; }`}</style>
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
