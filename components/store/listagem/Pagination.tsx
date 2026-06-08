'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  basePath?: string
}

export function Pagination({ page, totalPages, basePath = '' }: PaginationProps) {
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const buildUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('pagina', p.toString())
    return `${basePath}?${params.toString()}`
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildUrl(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
      )}
      <span className="text-sm text-muted">
        Página {page} de {totalPages}
      </span>
      {page < totalPages ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildUrl(page + 1)}>
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
