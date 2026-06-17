import { ProductGridSkeleton } from '@/components/store/listagem/ProductGridSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-2 h-9 w-48" />
          <Skeleton className="mt-2 h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-44" />
      </div>
      <ProductGridSkeleton />
    </div>
  )
}
