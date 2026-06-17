'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

interface CategoryRowActionsProps {
  id: string
  name: string
}

export function CategoryRowActions({ id, name }: CategoryRowActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!window.confirm(`Excluir permanentemente a categoria "${name}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    const res = await fetch(`/api/categorias/${id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))

    if (res.ok) {
      toast({ title: 'Categoria excluída' })
      startTransition(() => router.refresh())
    } else {
      toast({
        title: typeof data.error === 'string' ? data.error : 'Erro ao excluir categoria',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/admin/categorias/${id}`}>Editar</Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? 'Excluindo...' : 'Excluir'}
      </Button>
    </div>
  )
}
