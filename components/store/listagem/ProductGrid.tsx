import { ProductCard } from '@/components/store/produto/ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products: (Product & { category?: { name: string; slug: string } })[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-muted">
        <p>Nenhum produto encontrado.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
