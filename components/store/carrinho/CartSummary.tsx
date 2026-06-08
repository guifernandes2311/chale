'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/formatters'

interface CartSummaryProps {
  subtotal: number
  onClose?: () => void
}

export function CartSummary({ subtotal, onClose }: CartSummaryProps) {
  return (
    <div className="border-t border-border pt-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted">Subtotal</span>
        <span className="font-medium">{formatPrice(subtotal)}</span>
      </div>
      <p className="mt-1 text-xs text-muted">Frete calculado na finalização</p>
      <Button variant="default" className="mt-4 w-full" asChild onClick={onClose}>
        <Link href="/checkout">Finalizar pedido</Link>
      </Button>
    </div>
  )
}
