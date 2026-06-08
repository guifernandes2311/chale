import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getOrderById, updateOrderStatus } from '@/lib/api/orders'
import { updateOrderStatusSchema } from '@/lib/validations/pedido'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { id } = await params
    const isAdmin = session.user.role === 'ADMIN'
    const order = await getOrderById(id, isAdmin ? undefined : session.user.id)

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ data: order })
  } catch (error) {
    console.error('[GET /api/pedidos/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = updateOrderStatusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const updated = await updateOrderStatus(
      id,
      parsed.data.status,
      parsed.data.trackingCode,
      parsed.data.notes
    )

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('[PATCH /api/pedidos/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
