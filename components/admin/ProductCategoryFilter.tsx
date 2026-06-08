'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ProductCategoryFilterProps {
  categories: { slug: string; name: string }[]
  count: number
}

export function ProductCategoryFilter({ categories, count }: ProductCategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set('categoria', value)
    else params.delete('categoria')
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select
        value={searchParams.get('categoria') ?? 'all'}
        onValueChange={updateFilter}
      >
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Todas as categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.slug} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted">
        {count} {count === 1 ? 'produto' : 'produtos'}
      </p>
    </div>
  )
}
