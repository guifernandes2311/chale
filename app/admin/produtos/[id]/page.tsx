'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<{ name: string; slug: string; price: string } | null>(null)
  const [variants, setVariants] = useState<{ id: string; size: string; color: string | null; stock: number; sku: string }[]>([])
  const [newVariant, setNewVariant] = useState({ size: '', color: '', stock: 10, sku: '' })

  useEffect(() => {
    fetch('/api/produtos?admin=true')
      .then((r) => r.json())
      .then((d) => {
        const item = d.data?.find((p: { product: { id: string } }) => p.product.id === id)
        if (item) setProduct(item.product)
      })
    fetch(`/api/admin/produtos/${id}/variantes`)
      .then((r) => r.json())
      .then((d) => d.data && setVariants(d.data))
      .catch(() => {})
  }, [id])

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
    }
  }

  if (!product) return <p>Carregando...</p>

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">{product.name}</h1>
      <p className="text-sm text-muted">/{product.slug}</p>

      <div className="mt-8 rounded-md border border-border bg-white p-6">
        <h2 className="font-display text-lg font-semibold">Variantes</h2>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Tamanho</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>SKU</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.size}</TableCell>
                <TableCell>{v.color ?? '—'}</TableCell>
                <TableCell>{v.stock}</TableCell>
                <TableCell>{v.sku}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          <Input placeholder="Tamanho" value={newVariant.size} onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })} />
          <Input placeholder="Cor" value={newVariant.color} onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })} />
          <Input type="number" placeholder="Estoque" value={newVariant.stock} onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) })} />
          <Input placeholder="SKU" value={newVariant.sku} onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })} />
        </div>
        <Button className="mt-4" onClick={addVariant}>Adicionar variante</Button>
      </div>
    </div>
  )
}
