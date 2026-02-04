import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('site_config').select('*').single()

  return {
    title: data?.seo_title || "SM Saúde e Seguros | Proteção para você e sua família",
    description: data?.seo_description || "Consultoria especializada em planos de saúde e seguros. Proteja o que mais importa com a SM Saúde e Seguros.",
    openGraph: {
       images: data?.og_image_url ? [data.og_image_url] : []
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${josefinSans.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
