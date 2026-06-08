import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/drizzle/schema'
import { formatDate } from '@/lib/utils/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function AdminClientsPage() {
  let clients: { id: string; name: string | null; email: string; createdAt: Date }[] = []

  try {
    clients = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, 'CUSTOMER'))
  } catch {
    // DB not configured
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Clientes</h1>
      <div className="mt-8 rounded-md border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cadastro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name ?? '—'}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell className="text-muted">{formatDate(client.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {clients.length === 0 && (
          <p className="p-8 text-center text-muted">Nenhum cliente cadastrado.</p>
        )}
      </div>
    </div>
  )
}
