import { Suspense } from 'react'
import { Metadata } from 'next'
import { ProductGrid } from '@/components/store/listagem/ProductGrid'
import { FilterSidebar } from '@/components/store/listagem/FilterSidebar'
import { SortSelect } from '@/components/store/listagem/SortSelect'
import { Pagination } from '@/components/store/listagem/Pagination'
import { getProducts, getCategories } from '@/lib/api/products'
import type { ProductFilters } from '@/types'

export const metadata: Metadata = {
  title: 'Produtos',
}

interface Props {
  searchParams: Promise<ProductFilters>
}

export default async function ProductsPage({ searchParams }: Props) {
  const filters = await searchParams
  let data = { products: [] as Awaited<ReturnType<typeof getProducts>>['products'], pagination: { page: 1, totalPages: 0, total: 0, pageSize: 12 } }
  let categories: { slug: string; name: string }[] = []

  try {
    ;[data, categories] = await Promise.all([
      getProducts(filters),
      getCategories().then((cats) => cats.map((c) => ({ slug: c.slug, name: c.name }))),
    ])
  } catch {
    // DB not configured
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Produtos</h1>
          <p className="mt-1 text-sm text-muted">{data.pagination.total} resultados</p>
        </div>
        <Suspense>
          <SortSelect />
        </Suspense>
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <Suspense>
          <FilterSidebar categories={categories} />
        </Suspense>
        <div className="flex-1">
          <ProductGrid products={data.products} />
          <Suspense>
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              basePath="/produtos"
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
