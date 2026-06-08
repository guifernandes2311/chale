import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/api/products'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json({ data: categories })
  } catch (error) {
    console.error('[GET /api/categorias]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
