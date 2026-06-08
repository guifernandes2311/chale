'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AddressStep } from './AddressStep'
import { PaymentStep } from './PaymentStep'
import { OrderSummary } from './OrderSummary'
import { useCartStore } from '@/store/cartStore'
import { addressSchema, type AddressInput } from '@/lib/validations/usuario'
import { toast } from '@/hooks/use-toast'

const STEPS = ['Identificação', 'Endereço', 'Frete', 'Pagamento', 'Confirmação']

const SHIPPING_OPTIONS = [
  { id: 'pac', label: 'PAC', days: '8-12 dias úteis', price: 19.9 },
  { id: 'sedex', label: 'SEDEX', days: '3-5 dias úteis', price: 34.9 },
  { id: 'free', label: 'Frete Grátis', days: '10-15 dias úteis', price: 0 },
]

export function CheckoutForm() {
  const { data: session } = useSession()
  const { items, subtotal, clearCart } = useCartStore()
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState<Partial<AddressInput>>({ label: 'Casa' })
  const [shipping, setShipping] = useState(SHIPPING_OPTIONS[0])
  const [orderId, setOrderId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const cartSubtotal = subtotal()
  const total = cartSubtotal + shipping.price

  if (items.length === 0 && step < 4) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Seu carrinho está vazio.</p>
        <Button className="mt-4" asChild>
          <Link href="/produtos">Ver produtos</Link>
        </Button>
      </div>
    )
  }

  const createOrder = async () => {
    const parsed = addressSchema.safeParse(address)
    if (!parsed.success) {
      toast({ title: 'Endereço incompleto', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          address: parsed.data,
          shippingMethod: shipping.id,
          shippingCost: shipping.price,
          paymentMethod: 'stripe',
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Erro ao criar pedido')
      }

      const { order } = await res.json()
      setOrderId(order.id)

      const paymentRes = await fetch('/api/pagamentos/stripe/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      })

      if (paymentRes.ok) {
        const { clientSecret: secret } = await paymentRes.json()
        setClientSecret(secret)
      }

      setStep(3)
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao criar pedido',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    setStep(4)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`shrink-0 rounded-sm px-3 py-1 text-xs ${
                i === step ? 'bg-primary text-secondary' : i < step ? 'bg-accent/30' : 'bg-border/50'
              }`}
            >
              {i + 1}. {s}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            {session ? (
              <p>
                Olá, <strong>{session.user?.name ?? session.user?.email}</strong>! Continue para o
                endereço de entrega.
              </p>
            ) : (
              <div className="space-y-2">
                <p>Faça login para acompanhar seu pedido ou continue como convidado.</p>
                <Button variant="outline" asChild>
                  <Link href="/login?callbackUrl=/checkout">Entrar</Link>
                </Button>
              </div>
            )}
            <Button onClick={() => setStep(1)}>Continuar</Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <AddressStep value={address} onChange={setAddress} />
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>
                Voltar
              </Button>
              <Button onClick={() => setStep(2)}>Continuar</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {SHIPPING_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setShipping(opt)}
                className={`w-full rounded-md border p-4 text-left transition-colors ${
                  shipping.id === opt.id ? 'border-primary bg-secondary' : 'border-border'
                }`}
              >
                <p className="font-medium">{opt.label}</p>
                <p className="text-sm text-muted">{opt.days}</p>
                <p className="mt-1 text-sm">
                  {opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2)}`}
                </p>
              </button>
            ))}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button onClick={createOrder} disabled={loading}>
                {loading ? 'Criando pedido...' : 'Ir para pagamento'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && orderId && (
          <div>
            <PaymentStep
              orderId={orderId}
              total={total}
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        )}

        {step === 4 && (
          <div className="rounded-md border border-border bg-white p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-success">Pedido confirmado!</h2>
            {orderId && (
              <p className="mt-2 text-muted">
                Número do pedido: <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>
              </p>
            )}
            <p className="mt-4 text-sm">Você receberá um email com os detalhes da compra.</p>
            <Button className="mt-6" asChild>
              <Link href="/conta/pedidos">Ver meus pedidos</Link>
            </Button>
          </div>
        )}
      </div>

      {step < 4 && (
        <OrderSummary items={items} subtotal={cartSubtotal} shippingCost={shipping.price} />
      )}
    </div>
  )
}
