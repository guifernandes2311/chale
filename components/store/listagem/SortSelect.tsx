'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFilterNavigation } from '@/hooks/useFilterNavigation'

const SORT_OPTIONS = [
  { value: 'novo', label: 'Mais novo' },
  { value: 'preco-asc', label: 'Menor preço' },
  { value: 'preco-desc', label: 'Maior preço' },
  { value: 'nome', label: 'Nome A-Z' },
]

function SortSelectInner({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Ordenar" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Uses FilterNavigationProvider (produtos listing) */
export function SortSelect() {
  const searchParams = useSearchParams()
  const { pushQuery, isPending } = useFilterNavigation()

  const handleChange = (value: string) => {
    pushQuery((params) => {
      params.set('ordenar', value)
    })
  }

  return (
    <SortSelectInner
      value={searchParams.get('ordenar') ?? 'novo'}
      onChange={handleChange}
      disabled={isPending}
    />
  )
}

/** Standalone for routes without FilterNavigationProvider */
export function SortSelectStandalone() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('ordenar', value)
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <SortSelectInner
      value={searchParams.get('ordenar') ?? 'novo'}
      onChange={handleChange}
      disabled={isPending}
    />
  )
}
