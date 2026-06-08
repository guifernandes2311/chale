'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/formatters'
import type { CartItem } from '@/store/cartStore'

interface WhatsAppStepProps {
  items: CartItem[]
  subtotal: number
  shippingCost: number
  shippingName: string
  total: number
  loading: boolean
  onSubmit: () => void
}

export function WhatsAppStep({
  items,
  subtotal,
  shippingCost,
  shippingName,
  total,
  loading,
  onSubmit,
}: WhatsAppStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-md border border-border bg-white p-6">
        <h3 className="font-display text-lg font-semibold">Finalizar no WhatsApp</h3>
        <p className="mt-2 text-sm text-muted">
          Seu pedido será registrado e você será redirecionada para o WhatsApp da Chalé
          Calçados para combinar pagamento e confirmar a compra.
        </p>

        <div className="mt-4 space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between">
              <span>
                {item.name} ({item.size}) x{item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Frete ({shippingName})</span>
              <span>{formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <Button size="lg" className="w-full gap-2" onClick={onSubmit} disabled={loading}>
        <MessageCircle className="h-5 w-5" />
        {loading ? 'Registrando pedido...' : 'Enviar pedido no WhatsApp'}
      </Button>
    </div>
  )
}
