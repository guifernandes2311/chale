'use client'

import { cn } from '@/lib/utils/cn'
import type { ProductVariant } from '@/types'

interface ColorSelectorProps {
  variants: ProductVariant[]
  selectedSize: string | null
  selectedColor: string | null
  onSelect: (color: string) => void
}

export function ColorSelector({
  variants,
  selectedSize,
  selectedColor,
  onSelect,
}: ColorSelectorProps) {
  const filtered = selectedSize
    ? variants.filter((v) => v.size === selectedSize)
    : variants

  const colors = filtered.reduce<
    { name: string; hex: string | null; stock: number }[]
  >((acc, v) => {
    if (!v.color) return acc
    const existing = acc.find((c) => c.name === v.color)
    if (existing) {
      existing.stock += v.stock
    } else {
      acc.push({ name: v.color, hex: v.colorHex, stock: v.stock })
    }
    return acc
  }, [])

  if (colors.length <= 1) return null

  return (
    <div>
      <p className="text-sm font-medium">Cor</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {colors.map((color) => {
          const isOut = color.stock === 0
          const isSelected = selectedColor === color.name

          return (
            <button
              key={color.name}
              type="button"
              disabled={isOut}
              onClick={() => onSelect(color.name)}
              title={color.name}
              className={cn(
                'h-8 w-8 rounded-full border-2 transition-all',
                isSelected ? 'border-primary ring-2 ring-accent' : 'border-border',
                isOut && 'opacity-40'
              )}
              style={{ backgroundColor: color.hex ?? '#ccc' }}
            />
          )
        })}
      </div>
      {selectedColor && <p className="mt-1 text-xs text-muted">{selectedColor}</p>}
    </div>
  )
}
