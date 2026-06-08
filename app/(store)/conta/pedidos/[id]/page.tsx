import { notFound } from 'next/navigation'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { getOrderById } from '@/lib/api/orders'
import { StatusBadge } from '@/components/store/StatusBadge'
import { formatPrice, formatDateTime } from '@/lib/utils/formatters'
import type { OrderStatus, OrderItemSnapshot } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const session = await auth()

  let order: Awaited<ReturnType<typeof getOrderById>> = null

  try {
    if (session?.user) {
      order = await getOrderById(id, session.user.id)
    }
  } catch {
    notFound()
  }

  if (!order) notFound()

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">
            Pedido #{order.id.slice(0, 8).toUpperCase()}
          </h2>
          <p className="text-sm text-muted">{formatDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status as OrderStatus} />
      </div>

      {order.trackingCode && (
        <p className="mt-4 text-sm">
          Rastreamento: <strong>{order.trackingCode}</strong>
        </p>
      )}

      <div className="mt-6 space-y-4">
        {order.items?.map((item) => {
          const snapshot = item.snapshot as OrderItemSnapshot
          return (
            <div key={item.id} className="flex gap-4 rounded-md border border-border p-4">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm">
                <Image src={snapshot.image} alt={snapshot.name} fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{snapshot.name}</p>
                <p className="text-sm text-muted">
                  Tam. {snapshot.size}
                  {snapshot.color && ` · ${snapshot.color}`} · Qtd: {item.quantity}
                </p>
              </div>
              <p className="font-medium">{formatPrice(parseFloat(item.unitPrice) * item.quantity)}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Frete</span>
          <span>{formatPrice(order.shippingCost)}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  )
}
