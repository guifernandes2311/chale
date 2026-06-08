'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

interface ProductResponse {
  product: {
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
}

function toFormData(product: ProductResponse['product']): ProductFormData {
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

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<ProductResponse['product'] | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editVariant, setEditVariant] = useState({ size: '', color: '', stock: 0, sku: '' })
  const [newVariant, setNewVariant] = useState({ size: '', color: '', stock: 10, sku: '' })

  const loadVariants = useCallback(() => {
    fetch(`/api/admin/produtos/${id}/variantes`)
      .then((r) => r.json())
      .then((d) => d.data && setVariants(d.data))
      .catch(() => {})
  }, [id])

  useEffect(() => {
    fetch(`/api/admin/produtos/${id}`)
      .then((r) => r.json())
      .then((d) => d.data && setProduct(d.data.product))
      .catch(() => {})
    loadVariants()
  }, [id, loadVariants])

  const addVariant = async () => {
    const res = await fetch(`/api/admin/produtos/${id}/variantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVariant),
    })
    if (res.ok) {
      const { data } = await res.json()
      setVariants([...variants, data])
      setNewVariant({ size: '', color: '', stock: 10, sku: '' })
      toast({ title: 'Variante adicionada' })
    } else {
      const data = await res.json().catch(() => ({}))
      toast({ title: data.error ?? 'Erro ao adicionar variante', variant: 'destructive' })
    }
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

  const saveVariant = async (variantId: string) => {
    const res = await fetch(`/api/admin/variantes/${variantId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editVariant),
    })
    if (res.ok) {
      const { data } = await res.json()
      setVariants(variants.map((v) => (v.id === variantId ? data : v)))
      cancelEdit()
      toast({ title: 'Variante atualizada' })
    } else {
      const data = await res.json().catch(() => ({}))
      toast({ title: data.error ?? 'Erro ao atualizar variante', variant: 'destructive' })
    }
  }

  const deleteVariant = async (variant: Variant) => {
    if (!window.confirm(`Excluir permanentemente a variante ${variant.size}${variant.color ? ` / ${variant.color}` : ''}?`)) {
      return
    }

    const res = await fetch(`/api/admin/variantes/${variant.id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))

    if (res.ok) {
      setVariants(variants.filter((v) => v.id !== variant.id))
      toast({ title: 'Variante excluída' })
    } else {
      toast({ title: data.error ?? 'Erro ao excluir variante', variant: 'destructive' })
    }
  }

  const deleteProduct = async () => {
    if (!product) return
    if (!window.confirm(`Excluir permanentemente o produto "${product.name}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    const res = await fetch(`/api/produtos/${product.slug}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))

    if (res.ok) {
      toast({ title: 'Produto excluído' })
      router.push('/admin/produtos')
      router.refresh()
    } else {
      toast({ title: data.error ?? 'Erro ao excluir produto', variant: 'destructive' })
    }
  }

  if (!product) return <p>Carregando...</p>

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
        <Button className="mt-4" onClick={addVariant}>
          Adicionar variante
        </Button>
      </div>
    </div>
  )
}
