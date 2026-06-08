import { db } from '@/lib/db'
import { orders, orderItems, variants, users } from '@/drizzle/schema'
import { eq, desc, and, sql, gte } from 'drizzle-orm'
import type { CreateOrderInput } from '@/lib/validations/pedido'
import type { OrderStatus } from '@/types'

export async function createOrder(userId: string, data: CreateOrderInput) {
  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + data.shippingCost

  return db.transaction(async (tx) => {
    for (const item of data.items) {
      const [variant] = await tx
        .select()
        .from(variants)
        .where(eq(variants.id, item.variantId))
        .limit(1)

      if (!variant || variant.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para ${item.name} (${item.size})`)
      }

      await tx
        .update(variants)
        .set({ stock: variant.stock - item.quantity })
        .where(eq(variants.id, item.variantId))
    }

    const [order] = await tx
      .insert(orders)
      .values({
        userId,
        status: 'PENDING',
        subtotal: subtotal.toFixed(2),
        shippingCost: data.shippingCost.toFixed(2),
        discount: '0',
        total: total.toFixed(2),
        addressSnapshot: data.address,
        paymentMethod: data.paymentMethod,
      })
      .returning()

    await tx.insert(orderItems).values(
      data.items.map((item) => ({
        orderId: order.id,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.price.toFixed(2),
        snapshot: {
          name: item.name,
          image: item.image,
          size: item.size,
          color: item.color,
        },
      }))
    )

    return order
  })
}

export async function getOrdersByUser(userId: string) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
}

export async function getOrderById(orderId: string, userId?: string) {
  const conditions = [eq(orders.id, orderId)]
  if (userId) conditions.push(eq(orders.userId, userId))

  const [order] = await db
    .select()
    .from(orders)
    .where(and(...conditions))
    .limit(1)

  if (!order) return null

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))
  return { ...order, items }
}

export async function getAllOrders(status?: OrderStatus) {
  const conditions = status ? [eq(orders.status, status)] : []
  return db
    .select({
      order: orders,
      user: users,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingCode?: string | null,
  notes?: string | null
) {
  const [updated] = await db
    .update(orders)
    .set({
      status,
      trackingCode: trackingCode ?? undefined,
      notes: notes ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning()
  return updated
}

export async function updateOrderPayment(orderId: string, paymentId: string) {
  const [updated] = await db
    .update(orders)
    .set({ status: 'PAID', paymentId, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning()
  return updated
}

export async function getDashboardStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [revenue] = await db
    .select({ total: sql<string>`coalesce(sum(${orders.total}), 0)` })
    .from(orders)
    .where(eq(orders.status, 'PAID'))

  const [ordersToday] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(gte(orders.createdAt, today))

  const [pendingOrders] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(eq(orders.status, 'PENDING'))

  const [newCustomers] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(and(eq(users.role, 'CUSTOMER'), gte(users.createdAt, today)))

  return {
    revenue: revenue?.total ?? '0',
    ordersToday: ordersToday?.count ?? 0,
    pendingOrders: pendingOrders?.count ?? 0,
    newCustomers: newCustomers?.count ?? 0,
  }
}
