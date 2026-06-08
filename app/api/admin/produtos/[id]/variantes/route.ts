import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { variants } from '@/drizzle/schema'
import { variantSchema } from '@/lib/validations/produto'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const items = await db.select().from(variants).where(eq(variants.productId, id))
    return NextResponse.json({ data: items })
  } catch (error) {
    console.error('[GET /api/admin/produtos/[id]/variantes]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: Props) {
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

    const [variant] = await db
      .insert(variants)
      .values({ ...parsed.data, productId: id })
      .returning()

    return NextResponse.json({ data: variant }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/produtos/[id]/variantes]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
