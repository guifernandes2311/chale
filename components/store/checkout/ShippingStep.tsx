'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { CartItem } from '@/store/cartStore'
import type { ShippingOption } from '@/lib/melhorenvio'

interface ShippingStepProps {
  cep: string
  items: CartItem[]
  selected: ShippingOption | null
  onSelect: (option: ShippingOption) => void
}

export function ShippingStep({ cep, items, selected, onSelect }: ShippingStepProps) {
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8 || items.length === 0) return

    setLoading(true)
    setError(null)

    fetch('/api/frete/calcular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cep: cleanCep,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Erro ao calcular frete')
        setOptions(data.data ?? [])
        if (data.data?.length === 1) onSelect(data.data[0])
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao calcular frete'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep, items])

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Calculando frete...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-error/30 bg-error/5 p-4 text-sm text-error">
        {error}
        <p className="mt-2 text-muted">
          Verifique se MELHOR_ENVIO_TOKEN e STORE_CEP estão configurados no servidor.
        </p>
      </div>
    )
  }

  if (options.length === 0) {
    return <p className="text-muted">Nenhuma opção de frete disponível para este CEP.</p>
  }

  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt)}
          className={`w-full rounded-md border p-4 text-left transition-colors ${
            selected?.id === opt.id ? 'border-primary bg-secondary' : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {opt.name} — {opt.company}
              </p>
              <p className="text-sm text-muted">
                Entrega em até {opt.deliveryDays} dia(s) úteis
              </p>
            </div>
            <p className="font-medium">
              {opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2)}`}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
