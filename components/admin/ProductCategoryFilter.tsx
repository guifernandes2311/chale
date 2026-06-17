'use client'

import { useSearchParams } from 'next/navigation'
import { useAdminFilterNavigation } from '@/hooks/useFilterNavigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ProductCategoryFilterProps {
  categories: { slug: string; name: string }[]
  count: number
}

export function ProductCategoryFilter({ categories, count }: ProductCategoryFilterProps) {
  const searchParams = useSearchParams()
  const { pushQuery, isPending } = useAdminFilterNavigation()

  const updateFilter = (value: string) => {
    pushQuery((params) => {
      if (value && value !== 'all') params.set('categoria', value)
      else params.delete('categoria')
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-4" aria-busy={isPending}>
      <Select
        value={searchParams.get('categoria') ?? 'all'}
        onValueChange={updateFilter}
        disabled={isPending}
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
