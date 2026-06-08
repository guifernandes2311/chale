'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { toast } from '@/hooks/use-toast'

export interface ProductFormData {
  name: string
  description: string
  price: string
  compareAt: string
  images: string[]
  categoryId: string
  isActive: boolean
  isFeatured: boolean
  weight: number
  height: number
  width: number
  length: number
}

interface ProductFormProps {
  mode: 'create' | 'edit'
  initialData?: ProductFormData
  slug?: string
  onDelete?: () => void
}

const defaultForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  compareAt: '',
  images: [],
  categoryId: '',
  isActive: true,
  isFeatured: false,
  weight: 500,
  height: 12,
  width: 30,
  length: 20,
}

export function ProductForm({ mode, initialData, slug, onDelete }: ProductFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState<ProductFormData>(initialData ?? defaultForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/categorias')
      .then((r) => r.json())
      .then((d) => d.data && setCategories(d.data))
  }, [])

  useEffect(() => {
    if (initialData) setForm(initialData)
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.images.length === 0) {
      toast({ title: 'Adicione pelo menos uma imagem', variant: 'destructive' })
      return
    }

    setLoading(true)
    const body = {
      ...form,
      compareAt: form.compareAt || null,
    }

    const res = await fetch(
      mode === 'create' ? '/api/produtos' : `/api/produtos/${slug}`,
      {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )
    setLoading(false)

    if (res.ok) {
      toast({ title: mode === 'create' ? 'Produto criado' : 'Produto atualizado' })
      router.push('/admin/produtos')
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      toast({
        title: data.error ?? `Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} produto`,
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <Label>Nome</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1"
          required
        />
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Preço</Label>
          <Input
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label>Preço de (opcional)</Label>
          <Input
            value={form.compareAt}
            onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label>Categoria</Label>
        <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Imagens</Label>
        <div className="mt-1">
          <ImageUpload value={form.images} onChange={(images) => setForm({ ...form, images })} />
        </div>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          Ativo
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          Destaque
        </label>
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wide text-muted">Dimensões para frete (opcional)</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Peso (g)"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: parseInt(e.target.value) || 500 })}
          />
          <Input
            type="number"
            placeholder="Altura (cm)"
            value={form.height}
            onChange={(e) => setForm({ ...form, height: parseInt(e.target.value) || 12 })}
          />
          <Input
            type="number"
            placeholder="Largura (cm)"
            value={form.width}
            onChange={(e) => setForm({ ...form, width: parseInt(e.target.value) || 30 })}
          />
          <Input
            type="number"
            placeholder="Comprimento (cm)"
            value={form.length}
            onChange={(e) => setForm({ ...form, length: parseInt(e.target.value) || 20 })}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : mode === 'create' ? 'Criar produto' : 'Salvar alterações'}
        </Button>
        {mode === 'edit' && onDelete && (
          <Button type="button" variant="outline" className="text-red-600 hover:text-red-700" onClick={onDelete}>
            Excluir produto
          </Button>
        )}
      </div>
    </form>
  )
}
