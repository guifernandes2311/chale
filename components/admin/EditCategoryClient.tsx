'use client'

import { useRouter } from 'next/navigation'
import { CategoryForm, type CategoryFormData } from '@/components/admin/CategoryForm'
import { toast } from '@/hooks/use-toast'

interface CategoryData {
  id: string
  name: string
  slug: string
  image: string | null
  showOnHome: boolean
}

function toFormData(category: CategoryData): CategoryFormData {
  return {
    name: category.name,
    slug: category.slug,
    image: category.image,
    showOnHome: category.showOnHome,
  }
}

export function EditCategoryClient({ category }: { category: CategoryData }) {
  const router = useRouter()

  const deleteCategory = async () => {
    if (
      !window.confirm(`Excluir permanentemente a categoria "${category.name}"? Esta ação não pode ser desfeita.`)
    ) {
      return
    }

    const res = await fetch(`/api/categorias/${category.id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))

    if (res.ok) {
      toast({ title: 'Categoria excluída' })
      router.push('/admin/categorias')
    } else {
      toast({
        title: typeof data.error === 'string' ? data.error : 'Erro ao excluir categoria',
        variant: 'destructive',
      })
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Editar categoria</h1>
      <p className="text-sm text-muted">/{category.slug}</p>
      <div className="mt-8">
        <CategoryForm
          mode="edit"
          categoryId={category.id}
          initialData={toFormData(category)}
          onDelete={deleteCategory}
        />
      </div>
    </div>
  )
}
