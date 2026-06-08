'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/store/StatusBadge'
import { formatPrice } from '@/lib/utils/formatters'
import { toast } from '@/hooks/use-toast'
import type { AddressSnapshot, OrderStatus } from '@/types'

const STATUSES: OrderStatus[] = [
  'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
]

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<{
    id: string
    status: OrderStatus
    total: string
    paymentMethod: string
    trackingCode: string | null
    notes: string | null
    addressSnapshot: AddressSnapshot
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
      const data = await res.json()
      toast({ title: data.error ?? 'Erro', variant: 'destructive' })
    }
  }

  if (!order) return <p>Carregando...</p>

  const snap = order.addressSnapshot
  const phone = snap.customerPhone?.replace(/\D/g, '')
  const whatsappLink = phone ? `https://wa.me/55${phone.replace(/^55/, '')}` : null

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-3xl font-semibold">Pedido #{order.id.slice(0, 8)}</h1>
        <StatusBadge status={order.status} paymentMethod={order.paymentMethod} />
      </div>
      <p className="mt-2 text-lg font-medium">{formatPrice(order.total)}</p>

      {(snap.customerName || snap.customerPhone) && (
        <div className="mt-4 rounded-md border border-border bg-white p-4 text-sm">
          <p className="font-medium">{snap.customerName}</p>
          {snap.customerPhone && <p className="text-muted">{snap.customerPhone}</p>}
          {snap.shippingName && (
            <p className="mt-1 text-muted">Frete: {snap.shippingName}</p>
          )}
          <p className="mt-2 text-muted">
            {snap.street}, {snap.number} — {snap.district}, {snap.city}/{snap.state}
          </p>
          {whatsappLink && (
            <Button variant="outline" size="sm" className="mt-3 gap-2" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Abrir no WhatsApp
              </a>
            </Button>
          )}
        </div>
      )}

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
          {order.paymentMethod === 'whatsapp' && status === 'PROCESSING' && (
            <p className="mt-1 text-xs text-muted">
              Ao marcar como Em separação, o estoque será baixado automaticamente.
            </p>
          )}
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
