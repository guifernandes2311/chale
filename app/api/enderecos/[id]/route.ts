import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { addresses } from '@/drizzle/schema'

interface Props {
  params: Promise<{ id: string }>
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { id } = await params
    await db
      .delete(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, session.user.id)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/enderecos/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
