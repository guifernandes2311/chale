import { NextRequest, NextResponse } from 'next/server'
import { getVariantStock } from '@/lib/api/products'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const variant = await getVariantStock(id)
    if (!variant) {
      return NextResponse.json({ error: 'Variante não encontrada' }, { status: 404 })
    }
    return NextResponse.json({ stock: variant.stock })
  } catch (error) {
    console.error('[GET /api/variantes/[id]/estoque]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
