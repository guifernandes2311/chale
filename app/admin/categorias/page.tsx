import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CategoryRowActions } from '@/components/admin/CategoryRowActions'
import { CategoryHomeToggle } from '@/components/admin/CategoryHomeToggle'
import { getCategories } from '@/lib/api/categories'

export default async function AdminCategoriesPage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = []

  try {
    categories = await getCategories()
  } catch {
    // DB not configured
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Categorias</h1>
        <Button asChild>
          <Link href="/admin/categorias/novo">Nova categoria</Link>
        </Button>
      </div>

      <div className="mt-6 rounded-md border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Home</TableHead>
              <TableHead>Imagem</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted">
                  Nenhuma categoria cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>
                    <CategoryHomeToggle id={cat.id} showOnHome={cat.showOnHome} />
                  </TableCell>
                  <TableCell>
                    {cat.image ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded-sm">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <CategoryRowActions id={cat.id} name={cat.name} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
