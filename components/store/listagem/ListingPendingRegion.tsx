'use client'

import { useFilterNavigation } from '@/hooks/useFilterNavigation'

export function ListingPendingRegion({ children }: { children: React.ReactNode }) {
  const { isPending } = useFilterNavigation()
  return (
    <div className="flex-1" aria-busy={isPending} aria-live="polite">
      {children}
    </div>
  )
}
