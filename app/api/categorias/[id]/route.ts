import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { categories } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { getCategoryById, categoryHasProducts, isSlugTaken } from '@/lib/api/categories'
import { categorySchema, categoryToggleSchema } from '@/lib/validations/categoria'
import { slugify } from '@/lib/utils/slugify'
import { revalidateCategories } from '@/lib/revalidate'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const category = await getCategoryById(id)
    if (!category) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ data: category })
  } catch (error) {
    console.error('[GET /api/categorias/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const existing = await getCategoryById(id)
    if (!existing) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = categoryToggleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const [category] = await db
      .update(categories)
      .set({ showOnHome: parsed.data.showOnHome })
      .where(eq(categories.id, id))
      .returning()

    revalidateCategories()

    return NextResponse.json({ data: category })
  } catch (error) {
    console.error('[PATCH /api/categorias/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const existing = await getCategoryById(id)
    if (!existing) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const slug = parsed.data.slug?.trim() || slugify(parsed.data.name)
    if (await isSlugTaken(slug, id)) {
      return NextResponse.json({ error: 'Slug já está em uso' }, { status: 409 })
    }

    const [category] = await db
      .update(categories)
      .set({
        name: parsed.data.name,
        slug,
        image: parsed.data.image ?? null,
        parentId: null,
        showOnHome: parsed.data.showOnHome,
        homeOrder: 0,
      })
      .where(eq(categories.id, id))
      .returning()

    revalidateCategories()

    return NextResponse.json({ data: category })
  } catch (error) {
    console.error('[PUT /api/categorias/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const existing = await getCategoryById(id)
    if (!existing) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    }

    if (await categoryHasProducts(id)) {
      return NextResponse.json(
        { error: 'Não é possível excluir uma categoria com produtos vinculados' },
        { status: 409 }
      )
    }

    await db.delete(categories).where(eq(categories.id, id))

    revalidateCategories()

    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    console.error('[DELETE /api/categorias/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
