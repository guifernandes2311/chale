import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { categories } from '@/drizzle/schema'
import { getCategories, isSlugTaken } from '@/lib/api/categories'
import { categorySchema } from '@/lib/validations/categoria'
import { slugify } from '@/lib/utils/slugify'
import { revalidateCategories } from '@/lib/revalidate'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json({ data: categories })
  } catch (error) {
    console.error('[GET /api/categorias]', error)
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
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const slug = parsed.data.slug?.trim() || slugify(parsed.data.name)
    if (await isSlugTaken(slug)) {
      return NextResponse.json({ error: 'Slug já está em uso' }, { status: 409 })
    }

    const [category] = await db
      .insert(categories)
      .values({
        name: parsed.data.name,
        slug,
        image: parsed.data.image ?? null,
        parentId: null,
        showOnHome: parsed.data.showOnHome,
        homeOrder: 0,
      })
      .returning()

    revalidateCategories()

    return NextResponse.json({ data: category }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/categorias]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
