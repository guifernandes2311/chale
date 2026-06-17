import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products } from '@/drizzle/schema'
import { getProductBySlug, productHasOrders } from '@/lib/api/products'
import { productSchema } from '@/lib/validations/produto'
import { slugify } from '@/lib/utils/slugify'
import { revalidateProduct } from '@/lib/revalidate'

interface Props {
  params: Promise<{ slug: string }>
}

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params
    const product = await getProductBySlug(slug)
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }
    return NextResponse.json({ data: product })
  } catch (error) {
    console.error('[GET /api/produtos/[slug]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { slug } = await params
    const body = await request.json()
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const [updated] = await db
      .update(products)
      .set({
        ...parsed.data,
        slug: slugify(parsed.data.name),
        updatedAt: new Date(),
      })
      .where(eq(products.slug, slug))
      .returning()

    revalidateProduct(updated.slug)

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('[PUT /api/produtos/[slug]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { slug } = await params

    const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    if (await productHasOrders(product.id)) {
      return NextResponse.json(
        { error: 'Este produto possui pedidos e não pode ser excluído' },
        { status: 409 }
      )
    }

    await db.delete(products).where(eq(products.slug, slug))
    revalidateProduct(slug)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/produtos/[slug]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
