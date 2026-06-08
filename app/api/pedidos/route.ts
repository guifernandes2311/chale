import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createOrder, getOrdersByUser, getAllOrders } from '@/lib/api/orders'
import { createOrderSchema } from '@/lib/validations/pedido'
import { db } from '@/lib/db'
import { users } from '@/drizzle/schema'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'

    if (admin) {
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
      }
      const status = searchParams.get('status') as Parameters<typeof getAllOrders>[0]
      const orders = await getAllOrders(status ?? undefined)
      return NextResponse.json({ data: orders })
    }

    const orders = await getOrdersByUser(session.user.id)
    return NextResponse.json({ data: orders })
  } catch (error) {
    console.error('[GET /api/pedidos]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    let userId = session?.user?.id

    if (!userId) {
      const guestEmail = parsed.data.guestEmail ?? `guest-${Date.now()}@chale.local`
      const passwordHash = await bcrypt.hash(crypto.randomUUID(), 12)
      const [guest] = await db
        .insert(users)
        .values({
          email: guestEmail,
          name: 'Convidado',
          password: passwordHash,
          role: 'CUSTOMER',
        })
        .returning()
      userId = guest.id
    }

    const order = await createOrder(userId, parsed.data)
    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/pedidos]', error)
    const message = error instanceof Error ? error.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
