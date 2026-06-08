import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/drizzle/schema'

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://localhost:5432/chale_calcados'

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined
}

const client = globalForDb.client ?? postgres(connectionString, { prepare: false })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client
}

export const db = drizzle(client, { schema })
