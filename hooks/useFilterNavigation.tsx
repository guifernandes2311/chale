'use client'

import { createContext, useCallback, useContext, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface FilterNavigationContextValue {
  pushQuery: (mutate: (params: URLSearchParams) => void) => void
  clearQuery: () => void
  isPending: boolean
}

const FilterNavigationContext = createContext<FilterNavigationContextValue | null>(null)

export function FilterNavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const pushQuery = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      mutate(params)
      const qs = params.toString()
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname)
      })
    },
    [pathname, router, searchParams]
  )

  const clearQuery = useCallback(() => {
    startTransition(() => router.push(pathname))
  }, [pathname, router])

  return (
    <FilterNavigationContext.Provider value={{ pushQuery, clearQuery, isPending }}>
      {children}
    </FilterNavigationContext.Provider>
  )
}

export function useFilterNavigation() {
  const ctx = useContext(FilterNavigationContext)
  if (!ctx) {
    throw new Error('useFilterNavigation must be used within FilterNavigationProvider')
  }
  return ctx
}

/** Standalone hook for admin filters without provider */
export function useAdminFilterNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const pushQuery = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      mutate(params)
      const qs = params.toString()
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname)
      })
    },
    [pathname, router, searchParams]
  )

  return { pushQuery, isPending }
}
