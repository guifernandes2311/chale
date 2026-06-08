import { db } from '@/lib/db'
import { products, categories, variants, orderItems } from '@/drizzle/schema'
import { eq, and, gte, lte, ilike, desc, asc, sql, inArray } from 'drizzle-orm'
import type { ProductFilters } from '@/types'

const PAGE_SIZE = 12

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.name))
}

export async function getCategoryBySlug(slug: string) {
  const [category] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1)
  return category ?? null
}

export async function getProducts(filters: ProductFilters = {}) {
  const page = parseInt(filters.pagina ?? '1', 10)
  const offset = (page - 1) * PAGE_SIZE

  const conditions = [eq(products.isActive, true)]

  if (filters.categoria) {
    const [cat] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, filters.categoria))
      .limit(1)
    if (cat) conditions.push(eq(products.categoryId, cat.id))
  }

  if (filters.busca) {
    conditions.push(ilike(products.name, `%${filters.busca}%`))
  }

  if (filters.destaque === 'true') {
    conditions.push(eq(products.isFeatured, true))
  }

  if (filters.precoMin) {
    conditions.push(gte(products.price, filters.precoMin))
  }

  if (filters.precoMax) {
    conditions.push(lte(products.price, filters.precoMax))
  }

  let orderBy = desc(products.createdAt)
  switch (filters.ordenar) {
    case 'preco-asc':
      orderBy = asc(products.price)
      break
    case 'preco-desc':
      orderBy = desc(products.price)
      break
    case 'nome':
      orderBy = asc(products.name)
      break
  }

  const items = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(PAGE_SIZE)
    .offset(offset)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(and(...conditions))

  let result = items.map(({ product, category }) => ({
    ...product,
    category,
  }))

  if (filters.tamanho || filters.cor) {
    const productIds = result.map((p) => p.id)
    if (productIds.length > 0) {
      const variantConditions = [inArray(variants.productId, productIds)]
      if (filters.tamanho) variantConditions.push(eq(variants.size, filters.tamanho))
      if (filters.cor) variantConditions.push(ilike(variants.color, `%${filters.cor}%`))

      const matchingVariants = await db
        .select({ productId: variants.productId })
        .from(variants)
        .where(and(...variantConditions))

      const matchingIds = new Set(matchingVariants.map((v) => v.productId))
      result = result.filter((p) => matchingIds.has(p.id))
    }
  }

  return {
    products: result,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total: count,
      totalPages: Math.ceil(count / PAGE_SIZE),
    },
  }
}

export async function getProductBySlug(slug: string) {
  const [item] = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1)

  if (!item) return null

  const productVariants = await db
    .select()
    .from(variants)
    .where(eq(variants.productId, item.product.id))

  return {
    ...item.product,
    category: item.category,
    variants: productVariants,
  }
}

export async function getFeaturedProducts(limit = 8) {
  const items = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
    .orderBy(desc(products.createdAt))
    .limit(limit)

  return items.map(({ product, category }) => ({ ...product, category }))
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  const items = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.categoryId, categoryId),
        eq(products.isActive, true),
        sql`${products.id} != ${excludeId}`
      )
    )
    .limit(limit)

  return items.map(({ product, category }) => ({ ...product, category }))
}

export async function getVariantStock(variantId: string) {
  const [variant] = await db
    .select()
    .from(variants)
    .where(eq(variants.id, variantId))
    .limit(1)
  return variant ?? null
}

export async function getAllProductsAdmin(filters?: { categoria?: string }) {
  const conditions = []

  if (filters?.categoria) {
    const cat = await getCategoryBySlug(filters.categoria)
    if (cat) conditions.push(eq(products.categoryId, cat.id))
  }

  const query = db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt))

  if (conditions.length > 0) {
    return query.where(and(...conditions))
  }

  return query
}

export async function getProductByIdAdmin(id: string) {
  const [item] = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1)

  return item ?? null
}

export async function variantHasOrders(variantId: string) {
  const [item] = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .where(eq(orderItems.variantId, variantId))
    .limit(1)

  return !!item
}

export async function productHasOrders(productId: string) {
  const productVariants = await db
    .select({ id: variants.id })
    .from(variants)
    .where(eq(variants.productId, productId))

  if (productVariants.length === 0) return false

  const variantIds = productVariants.map((v) => v.id)
  const [item] = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .where(inArray(orderItems.variantId, variantIds))
    .limit(1)

  return !!item
}

export async function getLowStockVariants(threshold = 5) {
  return db
    .select({
      variant: variants,
      product: products,
    })
    .from(variants)
    .innerJoin(products, eq(variants.productId, products.id))
    .where(lte(variants.stock, threshold))
    .orderBy(asc(variants.stock))
    .limit(10)
}
