'use client'

import { useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFilterNavigation } from '@/hooks/useFilterNavigation'

interface FilterSidebarProps {
  categories: { slug: string; name: string }[]
}

function DebouncedInput({
  filterKey,
  pushQuery,
  ...props
}: {
  filterKey: string
  pushQuery: (mutate: (params: URLSearchParams) => void) => void
} & React.ComponentProps<typeof Input>) {
  const searchParams = useSearchParams()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const paramValue = searchParams.get(filterKey) ?? ''

  const handleChange = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        pushQuery((params) => {
          if (value) params.set(filterKey, value)
          else params.delete(filterKey)
          params.delete('pagina')
        })
      }, 300)
    },
    [filterKey, pushQuery]
  )

  return (
    <Input
      key={`${filterKey}-${paramValue}`}
      defaultValue={paramValue}
      onChange={(e) => handleChange(e.target.value)}
      {...props}
    />
  )
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const searchParams = useSearchParams()
  const { pushQuery, clearQuery, isPending } = useFilterNavigation()

  const updateCategory = (v: string) => {
    pushQuery((params) => {
      if (v && v !== 'all') params.set('categoria', v)
      else params.delete('categoria')
      params.delete('pagina')
    })
  }

  return (
    <aside className="w-full shrink-0 md:w-56" aria-busy={isPending}>
      <div className="space-y-6 rounded-md border border-border bg-white p-4">
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted">Categoria</Label>
          <Select
            value={searchParams.get('categoria') ?? 'all'}
            onValueChange={updateCategory}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted">Tamanho</Label>
          <DebouncedInput filterKey="tamanho" pushQuery={pushQuery} className="mt-2" placeholder="Ex: 38" />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted">Preço mín.</Label>
          <DebouncedInput
            filterKey="precoMin"
            pushQuery={pushQuery}
            className="mt-2"
            type="number"
            placeholder="0"
          />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted">Preço máx.</Label>
          <DebouncedInput
            filterKey="precoMax"
            pushQuery={pushQuery}
            className="mt-2"
            type="number"
            placeholder="999"
          />
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={clearQuery} disabled={isPending}>
          Limpar filtros
        </Button>
      </div>
    </aside>
  )
}
