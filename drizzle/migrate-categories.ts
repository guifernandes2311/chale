import '../lib/load-env'
import postgres from 'postgres'

async function migrate() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL não configurada')
    process.exit(1)
  }

  const sql = postgres(connectionString)

  await sql`
    ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS show_on_home boolean NOT NULL DEFAULT false
  `
  await sql`
    ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS home_order integer NOT NULL DEFAULT 0
  `
  await sql`
    UPDATE categories
    SET show_on_home = true,
        home_order = CASE slug
          WHEN 'tenis' THEN 1
          WHEN 'botas' THEN 2
          WHEN 'sandalias' THEN 3
          WHEN 'sapatos-sociais' THEN 4
          ELSE home_order
        END
    WHERE slug IN ('tenis', 'botas', 'sandalias', 'sapatos-sociais')
  `

  console.log('✅ Migração de categorias concluída')
  await sql.end()
}

migrate().catch((err) => {
  console.error('❌ Erro na migração:', err)
  process.exit(1)
})
