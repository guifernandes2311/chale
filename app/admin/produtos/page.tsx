import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductCategoryFilter } from '@/components/admin/ProductCategoryFilter'
import { ProductRowActions } from '@/components/admin/ProductRowActions'
import { getAllProductsAdmin, getCategories } from '@/lib/api/products'
import { formatPrice } from '@/lib/utils/formatters'

interface Props {
  searchParams: Promise<{ categoria?: string }>
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { categoria } = await searchParams
  let products: Awaited<ReturnType<typeof getAllProductsAdmin>> = []
  let categories: Awaited<ReturnType<typeof getCategories>> = []

  try {
    ;[products, categories] = await Promise.all([
      getAllProductsAdmin({ categoria }),
      getCategories(),
    ])
  } catch {
    // DB not configured
  }

  const emptyMessage = categoria
    ? 'Nenhum produto nesta categoria.'
    : 'Nenhum produto cadastrado.'

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Produtos</h1>
        <Button asChild>
          <Link href="/admin/produtos/novo">Novo produto</Link>
        </Button>
      </div>

      <div className="mt-6">
        <Suspense fallback={null}>
          <ProductCategoryFilter
            categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
            count={products.length}
          />
        </Suspense>
      </div>

      <div className="mt-4 rounded-md border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(({ product, category }) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? 'success' : 'error'}>
                    {product.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ProductRowActions id={product.id} slug={product.slug} name={product.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length === 0 && (
          <p className="p-8 text-center text-muted">{emptyMessage}</p>
        )}
      </div>
    </div>
  )
}
