import { HeroBanner } from '@/components/store/home/HeroBanner'
import { CategoryGrid } from '@/components/store/home/CategoryGrid'
import { FeaturedProducts } from '@/components/store/home/FeaturedProducts'
import { getCategories, getFeaturedProducts, getProducts } from '@/lib/api/products'

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = []
  let featured: Awaited<ReturnType<typeof getFeaturedProducts>> = []
  let recent: Awaited<ReturnType<typeof getProducts>>['products'] = []

  try {
    ;[categories, featured, { products: recent }] = await Promise.all([
      getCategories(),
      getFeaturedProducts(8),
      getProducts({ ordenar: 'novo', pagina: '1' }),
    ])
  } catch {
    // DB not configured yet — show static home
  }

  return (
    <>
      <HeroBanner />
      {categories.length > 0 && <CategoryGrid categories={categories} />}
      <FeaturedProducts title="Em destaque" products={featured} />
      <FeaturedProducts title="Novidades" products={recent.slice(0, 8)} />
    </>
  )
}
