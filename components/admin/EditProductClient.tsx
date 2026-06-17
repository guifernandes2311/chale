'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductForm, type ProductFormData } from '@/components/admin/ProductForm'
import { toast } from '@/hooks/use-toast'

interface Variant {
  id: string
  size: string
  color: string | null
  stock: number
  sku: string
}

export interface EditProductData {
  id: string
  name: string
  slug: string
  description: string
  price: string
  compareAt: string | null
  images: string[]
  categoryId: string
  isActive: boolean
  isFeatured: boolean
  weight: number
  height: number
  width: number
  length: number
}

function toFormData(product: EditProductData): ProductFormData {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    compareAt: product.compareAt ?? '',
    images: product.images,
    categoryId: product.categoryId,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    weight: product.weight,
    height: product.height,
    width: product.width,
    length: product.length,
  }
}

interface EditProductClientProps {
  product: EditProductData
  initialVariants: Variant[]
}

export function EditProductClient({ product, initialVariants }: EditProductClientProps) {
  const router = useRouter()
  const [variants, setVariants] = useState<Variant[]>(initialVariants)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editVariant, setEditVariant] = useState({ size: '', color: '', stock: 0, sku: '' })
  const [newVariant, setNewVariant] = useState({ size: '', color: '', stock: 10, sku: '' })

  const addVariantMutation = useMutation({
    mutationFn: async (payload: typeof newVariant) => {
      const res = await fetch(`/api/admin/produtos/${product.id}/variantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Erro ao adicionar variante')
      return data.data as Variant
    },
    onSuccess: (data) => {
      setVariants((prev) => [...prev, data])
      setNewVariant({ size: '', color: '', stock: 10, sku: '' })
      toast({ title: 'Variante adicionada' })
    },
    onError: (err) => {
      toast({
        title: err instanceof Error ? err.message : 'Erro ao adicionar variante',
        variant: 'destructive',
      })
    },
  })

  const updateVariantMutation = useMutation({
    mutationFn: async ({ variantId, payload }: { variantId: string; payload: typeof editVariant }) => {
      const res = await fetch(`/api/admin/variantes/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Erro ao atualizar variante')
      return data.data as Variant
    },
    onSuccess: (data) => {
      setVariants((prev) => prev.map((v) => (v.id === data.id ? data : v)))
      cancelEdit()
      toast({ title: 'Variante atualizada' })
    },
    onError: (err) => {
      toast({
        title: err instanceof Error ? err.message : 'Erro ao atualizar variante',
        variant: 'destructive',
      })
    },
  })

  const deleteVariantMutation = useMutation({
    mutationFn: async (variantId: string) => {
      const res = await fetch(`/api/admin/variantes/${variantId}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Erro ao excluir variante')
      return variantId
    },
    onSuccess: (variantId) => {
      setVariants((prev) => prev.filter((v) => v.id !== variantId))
      toast({ title: 'Variante excluída' })
    },
    onError: (err) => {
      toast({
        title: err instanceof Error ? err.message : 'Erro ao excluir variante',
        variant: 'destructive',
      })
    },
  })

  const addVariant = () => {
    addVariantMutation.mutate(newVariant)
  }

  const startEdit = (variant: Variant) => {
    setEditingId(variant.id)
    setEditVariant({
      size: variant.size,
      color: variant.color ?? '',
      stock: variant.stock,
      sku: variant.sku,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditVariant({ size: '', color: '', stock: 0, sku: '' })
  }

  const saveVariant = (variantId: string) => {
    updateVariantMutation.mutate({ variantId, payload: editVariant })
  }

  const deleteVariant = (variant: Variant) => {
    if (!window.confirm(`Excluir permanentemente a variante ${variant.size}${variant.color ? ` / ${variant.color}` : ''}?`)) {
      return
    }
    deleteVariantMutation.mutate(variant.id)
  }

  const deleteProduct = async () => {
    if (!window.confirm(`Excluir permanentemente o produto "${product.name}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    const res = await fetch(`/api/produtos/${product.slug}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))

    if (res.ok) {
      toast({ title: 'Produto excluído' })
      router.push('/admin/produtos')
    } else {
      toast({ title: data.error ?? 'Erro ao excluir produto', variant: 'destructive' })
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Editar produto</h1>
      <p className="text-sm text-muted">/{product.slug}</p>

      <div className="mt-8">
        <ProductForm
          mode="edit"
          initialData={toFormData(product)}
          slug={product.slug}
          onDelete={deleteProduct}
        />
      </div>

      <div className="mt-8 rounded-md border border-border bg-white p-6">
        <h2 className="font-display text-lg font-semibold">Variantes</h2>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Tamanho</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((v) => (
              <TableRow key={v.id}>
                {editingId === v.id ? (
                  <>
                    <TableCell>
                      <Input
                        value={editVariant.size}
                        onChange={(e) => setEditVariant({ ...editVariant, size: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editVariant.color}
                        onChange={(e) => setEditVariant({ ...editVariant, color: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={editVariant.stock}
                        onChange={(e) => setEditVariant({ ...editVariant, stock: parseInt(e.target.value) || 0 })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editVariant.sku}
                        onChange={(e) => setEditVariant({ ...editVariant, sku: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => saveVariant(v.id)}>
                          Salvar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                          Cancelar
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{v.size}</TableCell>
                    <TableCell>{v.color ?? '—'}</TableCell>
                    <TableCell>{v.stock}</TableCell>
                    <TableCell>{v.sku}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(v)}>
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteVariant(v)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          <Input
            placeholder="Tamanho"
            value={newVariant.size}
            onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
          />
          <Input
            placeholder="Cor"
            value={newVariant.color}
            onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Estoque"
            value={newVariant.stock}
            onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
          />
          <Input
            placeholder="SKU"
            value={newVariant.sku}
            onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
          />
        </div>
        <Button className="mt-4" onClick={addVariant} disabled={addVariantMutation.isPending}>
          {addVariantMutation.isPending ? 'Adicionando...' : 'Adicionar variante'}
        </Button>
      </div>
    </div>
  )
}
