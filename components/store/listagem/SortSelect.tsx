'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const SORT_OPTIONS = [
  { value: 'novo', label: 'Mais novo' },
  { value: 'preco-asc', label: 'Menor preço' },
  { value: 'preco-desc', label: 'Maior preço' },
  { value: 'nome', label: 'Nome A-Z' },
]

export function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('ordenar', value)
    router.push(`?${params.toString()}`)
  }

  return (
    <Select value={searchParams.get('ordenar') ?? 'novo'} onValueChange={handleChange}>
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
