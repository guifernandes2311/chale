'use client'

import Image from 'next/image'
import { formatPrice } from '@/lib/utils/formatters'
import type { CartItem } from '@/store/cartStore'

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  shippingCost: number
}

export function OrderSummary({ items, subtotal, shippingCost }: OrderSummaryProps) {
  const total = subtotal + shippingCost

  return (
    <div className="rounded-md border border-border bg-white p-6">
      <h3 className="font-display text-lg font-semibold">Resumo do pedido</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3">
            <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-sm">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted">
                {item.size} · Qtd: {item.quantity}
              </p>
            </div>
            <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Frete</span>
          <span>{shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
