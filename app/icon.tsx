import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic' // Disable static caching for dynamic updates
export const revalidate = 0

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_config').select('favicon_url, logo_url').single()

  if (error) {
    console.error("Error fetching site_config for icon:", error)
  }

  // Ensure strings are not empty before fallback
  const favicon = data?.favicon_url ? data.favicon_url.trim() : null;
  const logo = data?.logo_url ? data.logo_url.trim() : null;
  const imageUrl = favicon || logo || 'https://ibb.co/dwVXMpFB' // Default logo fallback for absolute url

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <img
          src={imageUrl}
          alt="Site Icon"
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
