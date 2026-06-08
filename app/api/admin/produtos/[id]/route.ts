import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getProductByIdAdmin } from '@/lib/api/products'

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
    const item = await getProductByIdAdmin(id)

    if (!item) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ data: item })
  } catch (error) {
    console.error('[GET /api/admin/produtos/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
