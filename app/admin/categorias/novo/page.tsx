import { CategoryForm } from '@/components/admin/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Nova categoria</h1>
      <div className="mt-8">
        <CategoryForm mode="create" />
      </div>
    </div>
  )
}
