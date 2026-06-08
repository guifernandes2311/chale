'use client'

import { useCartStore } from '@/store/cartStore'
import { toast } from '@/hooks/use-toast'

export function useCart() {
  const store = useCartStore()

  const addToCart = async (item: Parameters<typeof store.addItem>[0]) => {
    try {
      const res = await fetch(`/api/variantes/${item.variantId}/estoque`)
      if (res.ok) {
        const { stock } = await res.json()
        const existing = store.items.find((i) => i.variantId === item.variantId)
        const totalQty = (existing?.quantity ?? 0) + item.quantity
        if (totalQty > stock) {
          toast({
            title: 'Estoque insuficiente',
            description: `Apenas ${stock} unidade(s) disponível(is).`,
            variant: 'destructive',
          })
          return false
        }
      }
      store.addItem(item)
      toast({ title: 'Adicionado ao carrinho', description: item.name })
      return true
    } catch {
      store.addItem(item)
      toast({ title: 'Adicionado ao carrinho', description: item.name })
      return true
    }
  }

  return { ...store, addToCart }
}
