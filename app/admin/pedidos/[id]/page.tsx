'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/store/StatusBadge'
import { formatPrice } from '@/lib/utils/formatters'
import { toast } from '@/hooks/use-toast'
import type { OrderStatus } from '@/types'

const STATUSES: OrderStatus[] = [
  'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
]

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<{
    id: string
    status: OrderStatus
    total: string
    trackingCode: string | null
    notes: string | null
  } | null>(null)
  const [status, setStatus] = useState<OrderStatus>('PENDING')
  const [trackingCode, setTrackingCode] = useState('')

  useEffect(() => {
    fetch(`/api/pedidos/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setOrder(d.data)
          setStatus(d.data.status)
          setTrackingCode(d.data.trackingCode ?? '')
        }
      })
  }, [id])

  const handleSave = async () => {
    const res = await fetch(`/api/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingCode: trackingCode || null }),
    })
    if (res.ok) {
      toast({ title: 'Pedido atualizado' })
    } else {
      toast({ title: 'Erro', variant: 'destructive' })
    }
  }

  if (!order) return <p>Carregando...</p>

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-3xl font-semibold">Pedido #{order.id.slice(0, 8)}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-lg font-medium">{formatPrice(order.total)}</p>

      <div className="mt-8 space-y-4 rounded-md border border-border bg-white p-6">
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Código de rastreamento</Label>
          <Input
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            className="mt-1"
            placeholder="BR123456789BR"
          />
        </div>
        <Button onClick={handleSave}>Salvar alterações</Button>
      </div>
    </div>
  )
}
