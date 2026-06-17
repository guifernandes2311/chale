'use client'

import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

interface CategoryHomeToggleProps {
  id: string
  showOnHome: boolean
}

export function CategoryHomeToggle({ id, showOnHome: initial }: CategoryHomeToggleProps) {
  const [showOnHome, setShowOnHome] = useState(initial)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    const next = !showOnHome
    setShowOnHome(next)
    setLoading(true)

    const res = await fetch(`/api/categorias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showOnHome: next }),
    })
    setLoading(false)

    if (res.ok) {
      return
    }

    setShowOnHome(!next)
    const data = await res.json().catch(() => ({}))
    toast({
      title: typeof data.error === 'string' ? data.error : 'Erro ao atualizar',
      variant: 'destructive',
    })
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={showOnHome}
      aria-label={showOnHome ? 'Remover da página inicial' : 'Exibir na página inicial'}
      disabled={loading}
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors disabled:opacity-50 ${
        showOnHome ? 'bg-primary' : 'bg-border'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          showOnHome ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
