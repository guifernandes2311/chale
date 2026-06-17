import { Skeleton } from '@/components/ui/skeleton'

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="mt-6 rounded-md border border-border bg-white p-4">
      <Skeleton className="mb-4 h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="mb-2 h-12 w-full" />
      ))}
    </div>
  )
}
