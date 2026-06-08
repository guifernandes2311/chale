import { Header } from '@/components/store/header/Header'
import { Footer } from '@/components/store/footer/Footer'
import { CartDrawer } from '@/components/store/carrinho/CartDrawer'

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
