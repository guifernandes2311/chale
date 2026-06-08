import { Header } from '@/components/store/header/Header'
import { Footer } from '@/components/store/footer/Footer'
import { CartDrawer } from '@/components/store/carrinho/CartDrawer'

// Busca produtos em runtime (evita página estática vazia no build da Vercel)
export const dynamic = 'force-dynamic'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  )
}
