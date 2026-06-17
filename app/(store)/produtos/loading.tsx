import { ProductGridSkeleton } from '@/components/store/listagem/ProductGridSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-40" />
          <Skeleton className="mt-2 h-4 w-28" />
        </div>
        <Skeleton className="h-10 w-44" />
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <Skeleton className="h-80 w-full shrink-0 md:w-56" />
        <div className="flex-1">
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  )
}
