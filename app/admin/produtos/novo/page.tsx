'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    compareAt: '',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80'],
    categoryId: '',
    isActive: true,
    isFeatured: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/categorias')
      .then((r) => r.json())
      .then((d) => d.data && setCategories(d.data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (res.ok) {
      toast({ title: 'Produto criado' })
      router.push('/admin/produtos')
    } else {
      toast({ title: 'Erro ao criar produto', variant: 'destructive' })
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl font-semibold">Novo produto</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <Label>Nome</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" required />
        </div>
        <div>
          <Label>Descrição</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Preço</Label>
            <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1" required />
          </div>
          <div>
            <Label>Preço de (opcional)</Label>
            <Input value={form.compareAt} onChange={(e) => setForm({ ...form, compareAt: e.target.value })} className="mt-1" />
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
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>URL da imagem</Label>
          <Input
            value={form.images[0]}
            onChange={(e) => setForm({ ...form, images: [e.target.value] })}
            className="mt-1"
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Criar produto'}
        </Button>
      </form>
    </div>
  )
}
