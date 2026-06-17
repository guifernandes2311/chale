import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
})

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Chalé Calçados',
    template: '%s | Chalé Calçados',
  },
  description: 'Loja de calçados com estilo e conforto. Tênis, botas, sandálias e sapatos sociais.',
  icons: {
    icon: [
      { url: '/favicon-chale/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-chale/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon-chale/favicon.ico',
    apple: '/favicon-chale/apple-touch-icon.png',
  },
  manifest: '/favicon-chale/site.webmanifest',
  openGraph: {
    title: 'Chalé Calçados',
    description: 'Calçados com estilo e conforto para o seu dia a dia.',
    siteName: 'Chalé Calçados',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
