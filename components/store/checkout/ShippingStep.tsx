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
  const cleanCep = cep.replace(/\D/g, '')
  const canFetch = cleanCep.length === 8 && items.length > 0

  const [options, setOptions] = useState<ShippingOption[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canFetch) return

    let cancelled = false

    void fetch('/api/frete/calcular', {
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
        if (cancelled) return
        setOptions(data.data ?? [])
        if (data.data?.length === 1) onSelect(data.data[0])
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao calcular frete')
        }
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canFetch, cleanCep, items])

  const loading = canFetch && options.length === 0 && error === null

  if (!canFetch) {
    return <p className="text-sm text-muted-foreground">Informe um CEP válido para calcular o frete.</p>
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Calculando frete...
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma opção de frete disponível.</p>
  }

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={`${option.id}-${option.price}`}
          type="button"
          onClick={() => onSelect(option)}
          className={`w-full rounded-lg border p-4 text-left transition-colors ${
            selected?.id === option.id
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{option.name}</p>
              <p className="text-sm text-muted-foreground">
                {option.deliveryDays} dias úteis
              </p>
            </div>
            <p className="font-semibold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                option.price
              )}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
