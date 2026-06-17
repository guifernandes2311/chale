import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Chalé Calçados — Tênis, botas, sandálias e sapatos sociais'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), 'public/favicon-chale/web-app-manifest-192x192.png'),
    'base64',
  )
  const logoSrc = `data:image/png;base64,${logoData}`

  return new ImageResponse(
    (
      <div
        style={{
          background: '#f5f0eb',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          position: 'relative',
        }}
      >
        {/* accent border bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: '#c8a882',
          }}
        />

        <img src={logoSrc} width={160} height={160} style={{ borderRadius: 16 }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: 'serif',
              fontSize: 64,
              fontWeight: 700,
              color: '#0f0f0f',
              letterSpacing: '-1px',
            }}
          >
            Chalé Calçados
          </span>
          <span
            style={{
              fontFamily: 'sans-serif',
              fontSize: 28,
              color: '#6b6560',
              letterSpacing: '0.5px',
            }}
          >
            Calçados com estilo e conforto para o seu dia a dia
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
