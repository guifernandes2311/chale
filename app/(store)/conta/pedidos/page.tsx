import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getOrdersByUser } from '@/lib/api/orders'
import { StatusBadge } from '@/components/store/StatusBadge'
import { formatPrice, formatDate } from '@/lib/utils/formatters'
import type { OrderStatus } from '@/types'

export default async function OrdersPage() {
  const session = await auth()
  let orders: Awaited<ReturnType<typeof getOrdersByUser>> = []

  try {
    if (session?.user) {
      orders = await getOrdersByUser(session.user.id)
    }
  } catch {
    // DB not configured
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold">Meus pedidos</h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-muted">Você ainda não fez nenhum pedido.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/conta/pedidos/${order.id}`}
              className="block rounded-md border border-border bg-white p-4 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-muted">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status as OrderStatus} />
                  <p className="mt-1 font-medium">{formatPrice(order.total)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
