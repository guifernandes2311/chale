import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { addresses } from '@/drizzle/schema'
import { addressSchema } from '@/lib/validations/usuario'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const items = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, session.user.id))

    return NextResponse.json({ data: items })
  } catch (error) {
    console.error('[GET /api/enderecos]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = addressSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    if (parsed.data.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, session.user.id))
    }

    const [address] = await db
      .insert(addresses)
      .values({ ...parsed.data, userId: session.user.id })
      .returning()

    return NextResponse.json({ data: address }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/enderecos]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
