import { unstable_cache } from 'next/cache'
import { Header } from '@/components/store/header/Header'
import { Footer } from '@/components/store/footer/Footer'
import { CartDrawer } from '@/components/store/carrinho/CartDrawer'
import { getRootCategories } from '@/lib/api/categories'

const getCachedNavCategories = unstable_cache(
  async () => {
    try {
      const categories = await getRootCategories()
      return categories.map((c) => ({ slug: c.slug, name: c.name }))
    } catch {
      return []
    }
  },
  ['store-nav-categories'],
  { revalidate: 60 }
)

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const rootCategories = await getCachedNavCategories()

  return (
    <>
      <Header categories={rootCategories} />
      <main className="flex-1">{children}</main>
      <Footer categories={rootCategories} />
      <CartDrawer />
    </>
  )
}
