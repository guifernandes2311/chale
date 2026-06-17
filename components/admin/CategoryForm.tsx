'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { toast } from '@/hooks/use-toast'

export interface CategoryFormData {
  name: string
  slug: string
  image: string | null
  showOnHome: boolean
}

interface CategoryFormProps {
  mode: 'create' | 'edit'
  categoryId?: string
  initialData?: CategoryFormData
  onDelete?: () => void
}

const defaultForm: CategoryFormData = {
  name: '',
  slug: '',
  image: null,
  showOnHome: false,
}

export function CategoryForm({ mode, categoryId, initialData, onDelete }: CategoryFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<CategoryFormData>(initialData ?? defaultForm)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const body = {
      name: form.name,
      slug: form.slug.trim() || undefined,
      image: form.image,
      showOnHome: form.showOnHome,
    }

    const res = await fetch(
      mode === 'create' ? '/api/categorias' : `/api/categorias/${categoryId}`,
      {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )
    setLoading(false)

    if (res.ok) {
      toast({ title: mode === 'create' ? 'Categoria criada' : 'Categoria atualizada' })
      router.push('/admin/categorias')
    } else {
      const data = await res.json().catch(() => ({}))
      const errorMsg =
        typeof data.error === 'string'
          ? data.error
          : `Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} categoria`
      toast({ title: errorMsg, variant: 'destructive' })
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
        <Label>Slug (opcional)</Label>
        <Input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="mt-1"
          placeholder="Gerado automaticamente a partir do nome"
        />
      </div>
      <div>
        <Label>Imagem</Label>
        <div className="mt-1">
          <ImageUpload
            value={form.image ? [form.image] : []}
            onChange={(images) => setForm({ ...form, image: images[0] ?? null })}
            maxImages={1}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.showOnHome}
          onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })}
          className="h-4 w-4 rounded border-border"
        />
        Exibir na página inicial
      </label>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : mode === 'create' ? 'Criar categoria' : 'Salvar alterações'}
        </Button>
        {mode === 'edit' && onDelete && (
          <Button type="button" variant="outline" className="text-red-600 hover:text-red-700" onClick={onDelete}>
            Excluir categoria
          </Button>
        )}
      </div>
    </form>
  )
}
