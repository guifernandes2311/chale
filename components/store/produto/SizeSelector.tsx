'use client'

import { cn } from '@/lib/utils/cn'
import type { ProductVariant } from '@/types'

interface SizeSelectorProps {
  variants: ProductVariant[]
  selectedSize: string | null
  onSelect: (size: string) => void
}

export function SizeSelector({ variants, selectedSize, onSelect }: SizeSelectorProps) {
  const sizes = [...new Set(variants.map((v) => v.size))].sort(
    (a, b) => parseInt(a) - parseInt(b)
  )

  const getStock = (size: string) => {
    return variants.filter((v) => v.size === size).reduce((sum, v) => sum + v.stock, 0)
  }

  return (
    <div>
      <p className="text-sm font-medium">Tamanho</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {sizes.map((size) => {
          const stock = getStock(size)
          const isOut = stock === 0
          const isSelected = selectedSize === size

          return (
            <button
              key={size}
              type="button"
              disabled={isOut}
              onClick={() => onSelect(size)}
              className={cn(
                'min-w-[44px] rounded-sm border px-3 py-2 text-sm transition-colors',
                isSelected && 'border-primary bg-primary text-secondary',
                !isSelected && !isOut && 'border-border hover:border-primary',
                isOut && 'cursor-not-allowed border-border text-muted line-through opacity-50'
              )}
            >
              {size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
