import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminCategoriesLoading() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-10 w-36" />
      </div>
      <AdminTableSkeleton rows={6} />
    </div>
  )
}
