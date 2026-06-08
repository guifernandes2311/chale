'use client'

import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'

export function CartIcon() {
  const totalItems = useCartStore((s) => s.totalItems())
  const toggleCart = useCartStore((s) => s.toggleCart)

  return (
    <Button variant="ghost" size="icon" onClick={() => toggleCart(true)} aria-label="Abrir carrinho">
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-primary">
          {totalItems}
        </span>
      )}
    </Button>
  )
}
