import { ProductGrid } from '@/components/store/listagem/ProductGrid'
import type { Product } from '@/types'

interface RelatedProductsProps {
  products: (Product & { category?: { name: string; slug: string } })[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-semibold">Você também pode gostar</h2>
      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
