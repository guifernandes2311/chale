import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { ProductGrid } from '@/components/store/listagem/ProductGrid'
import { SortSelectStandalone } from '@/components/store/listagem/SortSelect'
import { Pagination } from '@/components/store/listagem/Pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { getProducts } from '@/lib/api/products'
import { getCategoryBySlug } from '@/lib/api/categories'
import type { ProductFilters } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<ProductFilters>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const category = await getCategoryBySlug(slug)
    return { title: category?.name ?? 'Categoria' }
  } catch {
    return { title: 'Categoria' }
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const filters = await searchParams

  let category: Awaited<ReturnType<typeof getCategoryBySlug>> | null = null
  let data = { products: [] as Awaited<ReturnType<typeof getProducts>>['products'], pagination: { page: 1, totalPages: 0, total: 0, pageSize: 12 } }

  try {
    category = await getCategoryBySlug(slug)
    if (!category) notFound()
    data = await getProducts({ ...filters, categoria: slug })
  } catch {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Categoria</p>
          <h1 className="font-display text-3xl font-semibold">{category.name}</h1>
          <p className="mt-1 text-sm text-muted">{data.pagination.total} produtos</p>
        </div>
        <Suspense fallback={<Skeleton className="h-10 w-44" />}>
          <SortSelectStandalone />
        </Suspense>
      </div>
      <ProductGrid products={data.products} />
      <Suspense fallback={null}>
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          basePath={`/categorias/${slug}`}
        />
      </Suspense>
    </div>
  )
}
