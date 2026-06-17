import { Skeleton } from '@/components/ui/skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-10" />
              ))}
            </div>
          </div>
          <Skeleton className="mt-8 h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
