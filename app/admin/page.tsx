import Link from 'next/link'
import { StatsCard } from '@/components/admin/StatsCard'
import { StatusBadge } from '@/components/store/StatusBadge'
import { getDashboardStats, getAllOrders } from '@/lib/api/orders'
import { getLowStockVariants } from '@/lib/api/products'
import { formatPrice, formatDateTime } from '@/lib/utils/formatters'
import type { OrderStatus } from '@/types'

export default async function AdminDashboardPage() {
  let stats = { revenue: '0', ordersToday: 0, pendingOrders: 0, newCustomers: 0 }
  let recentOrders: Awaited<ReturnType<typeof getAllOrders>> = []
  let lowStock: Awaited<ReturnType<typeof getLowStockVariants>> = []

  try {
    ;[stats, recentOrders, lowStock] = await Promise.all([
      getDashboardStats(),
      getAllOrders(),
      getLowStockVariants(),
    ])
  } catch {
    // DB not configured
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Receita total" value={formatPrice(stats.revenue)} />
        <StatsCard title="Pedidos hoje" value={stats.ordersToday} />
        <StatsCard title="Pedidos pendentes" value={stats.pendingOrders} />
        <StatsCard title="Novos clientes hoje" value={stats.newCustomers} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-white p-6">
          <h2 className="font-display text-lg font-semibold">Pedidos recentes</h2>
          <div className="mt-4 space-y-3">
            {recentOrders.slice(0, 5).map(({ order, user }) => (
              <Link
                key={order.id}
                href={`/admin/pedidos/${order.id}`}
                className="flex items-center justify-between rounded-sm p-2 hover:bg-secondary"
              >
                <div>
                  <p className="text-sm font-medium">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted">{user.name ?? user.email}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status as OrderStatus} />
                  <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                </div>
              </Link>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-sm text-muted">Nenhum pedido ainda.</p>
            )}
          </div>
        </div>

        <div className="rounded-md border border-border bg-white p-6">
          <h2 className="font-display text-lg font-semibold">Estoque baixo</h2>
          <div className="mt-4 space-y-3">
            {lowStock.map(({ variant, product }) => (
              <div key={variant.id} className="flex justify-between text-sm">
                <span>
                  {product.name} — {variant.size}
                </span>
                <span className="font-medium text-error">{variant.stock} un.</span>
              </div>
            ))}
            {lowStock.length === 0 && (
              <p className="text-sm text-muted">Estoque ok.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
