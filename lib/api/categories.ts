import { db } from '@/lib/db'
import { categories, products } from '@/drizzle/schema'
import { eq, and, asc, sql, ne } from 'drizzle-orm'

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.name))
}

export async function getHomeCategories() {
  return db
    .select()
    .from(categories)
    .where(eq(categories.showOnHome, true))
    .orderBy(asc(categories.name))
}

export async function getRootCategories() {
  return getCategories()
}

export async function getCategoryBySlug(slug: string) {
  const [category] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1)
  return category ?? null
}

export async function getCategoryById(id: string) {
  const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1)
  return category ?? null
}

export async function categoryHasProducts(id: string): Promise<boolean> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.categoryId, id))
  return (row?.count ?? 0) > 0
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const conditions = excludeId
    ? and(eq(categories.slug, slug), ne(categories.id, excludeId))
    : eq(categories.slug, slug)

  const [row] = await db.select({ id: categories.id }).from(categories).where(conditions).limit(1)
  return !!row
}
