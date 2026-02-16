import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()

  const [
    { data: siteConfig },
    { data: heroSection },
    { data: solutions },
    { data: aboutSection },
    { data: aboutSpotlights },
    { data: aboutImages },
    { data: testimonials },
    { data: faqs },
    { data: menuItems },
  ] = await Promise.all([
    supabase.from('site_config').select('*').single(),
    supabase.from('hero_section').select('*').single(),
    supabase.from('solutions').select('*').order('sort_order', { ascending: true }),
    supabase.from('about_section').select('*').single(),
    supabase.from('about_spotlights').select('*').order('sort_order', { ascending: true }),
    supabase.from('about_images').select('*').order('sort_order', { ascending: true }),
    supabase.from('testimonials').select('*').order('sort_order', { ascending: true }),
    supabase.from('faqs').select('*').order('sort_order', { ascending: true }),
    supabase.from('menu_items').select('*').order('sort_order', { ascending: true }),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        logoUrl={siteConfig?.logo_url}
        menuItems={menuItems || []}
        ctaText={siteConfig?.header_cta_text}
        ctaLink={siteConfig?.header_cta_link}
      />
      <main className="flex-1">
        <Hero data={heroSection} siteConfig={siteConfig} />
        <Services data={solutions || []} />
        <About data={{ section: aboutSection, spotlights: aboutSpotlights || [], images: aboutImages || [] }} />
        <Testimonials data={testimonials || []} />
        <FAQ data={faqs || []} />
        <Contact data={siteConfig} />
      </main>
      <Footer data={siteConfig} />
      <FloatingWhatsApp data={siteConfig} />
    </div>
  )
}
