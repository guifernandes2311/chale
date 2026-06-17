import { Suspense } from 'react'
import { Metadata } from 'next'
import { ProductGrid } from '@/components/store/listagem/ProductGrid'
import { FilterSidebar } from '@/components/store/listagem/FilterSidebar'
import { SortSelect } from '@/components/store/listagem/SortSelect'
import { Pagination } from '@/components/store/listagem/Pagination'
import { FilterNavigationProvider } from '@/hooks/useFilterNavigation'
import { ListingPendingRegion } from '@/components/store/listagem/ListingPendingRegion'
import { Skeleton } from '@/components/ui/skeleton'
import { getProducts } from '@/lib/api/products'
import { getCategories } from '@/lib/api/categories'
import type { ProductFilters } from '@/types'

export const metadata: Metadata = {
  title: 'Produtos',
}

interface Props {
  searchParams: Promise<ProductFilters>
}

function FilterSidebarFallback() {
  return <Skeleton className="h-80 w-full shrink-0 md:w-56" />
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
    <FilterNavigationProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Produtos</h1>
            <p className="mt-1 text-sm text-muted">{data.pagination.total} resultados</p>
          </div>
          <Suspense fallback={<Skeleton className="h-10 w-44" />}>
            <SortSelect />
          </Suspense>
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <Suspense fallback={<FilterSidebarFallback />}>
            <FilterSidebar categories={categories} />
          </Suspense>
          <ListingPendingRegion>
            <ProductGrid products={data.products} />
            <Suspense fallback={null}>
              <Pagination
                page={data.pagination.page}
                totalPages={data.pagination.totalPages}
                basePath="/produtos"
              />
            </Suspense>
          </ListingPendingRegion>
        </div>
      </div>
    </FilterNavigationProvider>
  )
}
