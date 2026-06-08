import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/formatters'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product & { category?: { name: string; slug: string } }
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAt && parseFloat(product.compareAt) > parseFloat(product.price)
  const discountPercent = hasDiscount
    ? Math.round(
        ((parseFloat(product.compareAt!) - parseFloat(product.price)) /
          parseFloat(product.compareAt!)) *
          100
      )
    : 0

  return (
    <Link href={`/produtos/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-white">
        <Image
          src={product.images[0] ?? '/images/placeholder.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <Badge variant="accent" className="absolute left-2 top-2">
            -{discountPercent}%
          </Badge>
        )}
        {product.isFeatured && !hasDiscount && (
          <Badge variant="outline" className="absolute left-2 top-2 bg-white">
            Destaque
          </Badge>
        )}
      </div>
      <div className="mt-3">
        {product.category && (
          <p className="text-xs uppercase tracking-wide text-muted">{product.category.name}</p>
        )}
        <h3 className="mt-1 text-sm font-medium group-hover:text-accent">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-medium">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.compareAt!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
