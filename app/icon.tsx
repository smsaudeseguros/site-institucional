import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_config').select('favicon_url, logo_url').single()

  const imageUrl = data?.favicon_url || data?.logo_url || 'https://i.ibb.co/VvzKzHq/logo.png' // Default logo fallback for absolute url

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
