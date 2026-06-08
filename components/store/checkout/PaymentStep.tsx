'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { isStripeConfigured } from '@/lib/stripe'
import { formatPrice } from '@/lib/utils/formatters'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

interface PaymentFormProps {
  orderId: string
  total: number
  onSuccess: () => void
}

function StripePaymentForm({ orderId, total, onSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?step=confirmacao&order=${orderId}`,
      },
      redirect: 'if_required',
    })

    setLoading(false)

    if (submitError) {
      setError(submitError.message ?? 'Erro no pagamento')
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-error">{error}</p>}
      <Button type="submit" className="w-full" disabled={!stripe || loading}>
        {loading ? 'Processando...' : `Pagar ${formatPrice(total)}`}
      </Button>
    </form>
  )
}

interface PaymentStepProps {
  orderId: string
  total: number
  clientSecret: string | null
  onSuccess: () => void
}

export function PaymentStep({ orderId, total, clientSecret, onSuccess }: PaymentStepProps) {
  if (!isStripeConfigured()) {
    return (
      <div className="rounded-md border border-border bg-secondary p-6 text-center">
        <p className="font-medium">Pagamento não configurado</p>
        <p className="mt-2 text-sm text-muted">
          Configure as variáveis STRIPE_SECRET_KEY e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no
          .env.local para habilitar pagamentos.
        </p>
        <p className="mt-4 text-sm">
          Seu pedido <strong>#{orderId.slice(0, 8)}</strong> foi criado com status pendente.
        </p>
        <Button className="mt-4" onClick={onSuccess}>
          Continuar
        </Button>
      </div>
    )
  }

  if (!clientSecret || !stripePromise) {
    return <p className="text-muted">Preparando pagamento...</p>
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentForm orderId={orderId} total={total} onSuccess={onSuccess} />
    </Elements>
  )
}
