import { ProductGrid } from '@/components/store/listagem/ProductGrid'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  title: string
  products: (Product & { category?: { name: string; slug: string } })[]
}

export function FeaturedProducts({ title, products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-display text-center text-3xl font-semibold">{title}</h2>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
