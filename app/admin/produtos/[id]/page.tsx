import { notFound } from 'next/navigation'
import { EditProductClient } from '@/components/admin/EditProductClient'
import { getProductByIdAdmin, getVariantsByProductId } from '@/lib/api/products'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params

  let item: Awaited<ReturnType<typeof getProductByIdAdmin>> | null = null
  let variantList: Awaited<ReturnType<typeof getVariantsByProductId>> = []

  try {
    item = await getProductByIdAdmin(id)
    if (!item) notFound()
    variantList = await getVariantsByProductId(id)
  } catch {
    notFound()
  }

  return <EditProductClient product={item.product} initialVariants={variantList} />
}
