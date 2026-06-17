import { notFound } from 'next/navigation'
import { EditCategoryClient } from '@/components/admin/EditCategoryClient'
import { getCategoryById } from '@/lib/api/categories'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params

  let category: Awaited<ReturnType<typeof getCategoryById>> | null = null

  try {
    category = await getCategoryById(id)
    if (!category) notFound()
  } catch {
    notFound()
  }

  return <EditCategoryClient category={category} />
}
