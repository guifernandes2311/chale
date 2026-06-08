import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Novo produto</h1>
      <div className="mt-8">
        <ProductForm mode="create" />
      </div>
    </div>
  )
}
