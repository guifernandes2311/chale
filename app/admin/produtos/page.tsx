import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAllProductsAdmin } from '@/lib/api/products'
import { formatPrice } from '@/lib/utils/formatters'

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof getAllProductsAdmin>> = []

  try {
    products = await getAllProductsAdmin()
  } catch {
    // DB not configured
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Produtos</h1>
        <Button asChild>
          <Link href="/admin/produtos/novo">Novo produto</Link>
        </Button>
      </div>

      <div className="mt-8 rounded-md border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
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
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/produtos/${product.id}`}>Editar</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length === 0 && (
          <p className="p-8 text-center text-muted">Nenhum produto cadastrado.</p>
        )}
      </div>
    </div>
  )
}
