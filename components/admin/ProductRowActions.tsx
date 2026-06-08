'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

interface ProductRowActionsProps {
  id: string
  slug: string
  name: string
}

export function ProductRowActions({ id, slug, name }: ProductRowActionsProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!window.confirm(`Excluir permanentemente o produto "${name}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    const res = await fetch(`/api/produtos/${slug}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))

    if (res.ok) {
      toast({ title: 'Produto excluído' })
      router.refresh()
    } else {
      toast({
        title: data.error ?? 'Erro ao excluir produto',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/admin/produtos/${id}`}>Editar</Link>
      </Button>
      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={handleDelete}>
        Excluir
      </Button>
    </div>
  )
}
