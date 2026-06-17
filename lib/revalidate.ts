import { revalidatePath } from 'next/cache'

export function revalidateProducts() {
  revalidatePath('/produtos')
  revalidatePath('/admin/produtos')
  revalidatePath('/')
}

export function revalidateProduct(slug: string) {
  revalidatePath(`/produtos/${slug}`)
  revalidateProducts()
}

export function revalidateCategories() {
  revalidatePath('/admin/categorias')
  revalidatePath('/')
  revalidatePath('/produtos')
}
