'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FilterSidebarProps {
  categories: { slug: string; name: string }[]
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('pagina')
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => router.push(window.location.pathname)

  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="space-y-6 rounded-md border border-border bg-white p-4">
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted">Categoria</Label>
          <Select
            value={searchParams.get('categoria') ?? ''}
            onValueChange={(v) => updateFilter('categoria', v === 'all' ? '' : v)}
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
          <Input
            className="mt-2"
            placeholder="Ex: 38"
            defaultValue={searchParams.get('tamanho') ?? ''}
            onBlur={(e) => updateFilter('tamanho', e.target.value)}
          />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted">Preço mín.</Label>
          <Input
            className="mt-2"
            type="number"
            placeholder="0"
            defaultValue={searchParams.get('precoMin') ?? ''}
            onBlur={(e) => updateFilter('precoMin', e.target.value)}
          />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted">Preço máx.</Label>
          <Input
            className="mt-2"
            type="number"
            placeholder="999"
            defaultValue={searchParams.get('precoMax') ?? ''}
            onBlur={(e) => updateFilter('precoMax', e.target.value)}
          />
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
          Limpar filtros
        </Button>
      </div>
    </aside>
  )
}
