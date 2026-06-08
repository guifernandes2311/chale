import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products } from '@/drizzle/schema'
import { getProducts, getAllProductsAdmin } from '@/lib/api/products'
import { productSchema } from '@/lib/validations/produto'
import { slugify } from '@/lib/utils/slugify'
import type { ProductFilters } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'
    const session = await auth()

    if (admin) {
      if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
      }
      const items = await getAllProductsAdmin()
      return NextResponse.json({ data: items })
    }

    const filters: ProductFilters = {
      categoria: searchParams.get('categoria') ?? undefined,
      tamanho: searchParams.get('tamanho') ?? undefined,
      cor: searchParams.get('cor') ?? undefined,
      precoMin: searchParams.get('precoMin') ?? undefined,
      precoMax: searchParams.get('precoMax') ?? undefined,
      ordenar: searchParams.get('ordenar') ?? undefined,
      pagina: searchParams.get('pagina') ?? undefined,
      busca: searchParams.get('busca') ?? undefined,
      destaque: searchParams.get('destaque') ?? undefined,
    }

    const data = await getProducts(filters)
    return NextResponse.json({ data })
  } catch (error) {
    console.error('[GET /api/produtos]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const slug = slugify(parsed.data.name)
    const [product] = await db
      .insert(products)
      .values({ ...parsed.data, slug })
      .returning()

    return NextResponse.json({ data: product }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/produtos]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
