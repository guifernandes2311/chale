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
