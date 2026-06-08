import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { variants } from '@/drizzle/schema'
import { variantHasOrders } from '@/lib/api/products'
import { variantSchema } from '@/lib/validations/produto'

interface Props {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = variantSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const [updated] = await db
      .update(variants)
      .set(parsed.data)
      .where(eq(variants.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Variante não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('[PUT /api/admin/variantes/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    const [variant] = await db.select().from(variants).where(eq(variants.id, id)).limit(1)
    if (!variant) {
      return NextResponse.json({ error: 'Variante não encontrada' }, { status: 404 })
    }

    if (await variantHasOrders(id)) {
      return NextResponse.json(
        { error: 'Esta variante possui pedidos e não pode ser excluída' },
        { status: 409 }
      )
    }

    await db.delete(variants).where(eq(variants.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/variantes/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
