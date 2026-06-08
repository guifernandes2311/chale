import Link from 'next/link'
import { StatusBadge } from '@/components/store/StatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAllOrders } from '@/lib/api/orders'
import { formatPrice, formatDateTime } from '@/lib/utils/formatters'
import type { OrderStatus } from '@/types'

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof getAllOrders>> = []

  try {
    orders = await getAllOrders()
  } catch {
    // DB not configured
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Pedidos</h1>
      <div className="mt-8 rounded-md border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Data</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(({ order, user }) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">#{order.id.slice(0, 8)}</TableCell>
                <TableCell>{user.name ?? user.email}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status as OrderStatus} />
                </TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell className="text-sm text-muted">{formatDateTime(order.createdAt)}</TableCell>
                <TableCell>
                  <Link href={`/admin/pedidos/${order.id}`} className="text-sm text-accent hover:underline">
                    Ver
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-muted">Nenhum pedido.</p>
        )}
      </div>
    </div>
  )
}
