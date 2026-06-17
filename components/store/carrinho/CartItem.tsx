'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/formatters'
import type { CartItem as CartItemType } from '@/store/cartStore'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (variantId: string, qty: number) => void
  onRemove: (variantId: string) => void
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 border-b border-border py-4">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm">
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
      </div>
      <div className="flex flex-1 flex-col">
        <p className="text-sm font-medium">{item.name}</p>
        <p className="text-xs text-muted">
          Tam. {item.size}
          {item.color && ` · ${item.color}`}
        </p>
        <p className="mt-1 text-sm font-medium">{formatPrice(item.price)}</p>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            aria-label="Diminuir quantidade"
            onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            aria-label="Aumentar quantidade"
            onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7 text-muted"
            onClick={() => onRemove(item.variantId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
