import '../lib/load-env'
import { db } from '@/lib/db'
import {
  users,
  categories,
  products,
  variants,
} from '@/drizzle/schema'
import bcrypt from 'bcryptjs'
import { eq, inArray } from 'drizzle-orm'
import { slugify } from '@/lib/utils/slugify'

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
  'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
]

const CATEGORY_DATA = [
  { name: 'Tênis', slug: 'tenis' },
  { name: 'Botas', slug: 'botas' },
  { name: 'Sandálias', slug: 'sandalias' },
  { name: 'Sapatos Sociais', slug: 'sapatos-sociais' },
]

const PRODUCT_DATA = [
  { name: 'Tênis Runner Branco', category: 'tenis', price: '299.90', compareAt: '349.90', featured: true },
  { name: 'Tênis Urban Preto', category: 'tenis', price: '259.90', featured: true },
  { name: 'Tênis Casual Bege', category: 'tenis', price: '219.90', featured: false },
  { name: 'Bota Chelsea Marrom', category: 'botas', price: '389.90', compareAt: '449.90', featured: true },
  { name: 'Bota Cano Curto Preta', category: 'botas', price: '329.90', featured: false },
  { name: 'Bota Over-the-Knee', category: 'botas', price: '459.90', featured: true },
  { name: 'Sandália Rasteira Nude', category: 'sandalias', price: '149.90', featured: true },
  { name: 'Sandália Plataforma', category: 'sandalias', price: '179.90', featured: false },
  { name: 'Sandália Slide', category: 'sandalias', price: '129.90', featured: false },
  { name: 'Sapato Oxford Preto', category: 'sapatos-sociais', price: '349.90', featured: true },
  { name: 'Sapato Loafer Caramelo', category: 'sapatos-sociais', price: '299.90', featured: false },
  { name: 'Sapato Social Azul', category: 'sapatos-sociais', price: '319.90', compareAt: '379.90', featured: true },
]

const SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44']
const COLORS = [
  { name: 'Preto', hex: '#1a1a1a' },
  { name: 'Branco', hex: '#f5f5f5' },
  { name: 'Marrom', hex: '#6b4423' },
]

async function seed() {
  console.log('🌱 Iniciando seed...')

  const passwordHash = await bcrypt.hash('senha123', 12)

  await db.insert(users).values([
    {
      id: 'admin-user-id',
      name: 'Admin Chalé',
      email: 'admin@chalecalcados.com.br',
      password: passwordHash,
      role: 'ADMIN',
    },
    {
      id: 'customer-user-id',
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      password: passwordHash,
      role: 'CUSTOMER',
    },
  ])

  const insertedCategories = await db
    .insert(categories)
    .values(CATEGORY_DATA)
    .returning()

  const categoryMap = Object.fromEntries(insertedCategories.map((c) => [c.slug, c.id]))

  for (let i = 0; i < PRODUCT_DATA.length; i++) {
    const p = PRODUCT_DATA[i]
    const slug = slugify(p.name)
    const [product] = await db
      .insert(products)
      .values({
        name: p.name,
        slug,
        description: `${p.name} — calçado de alta qualidade da Chalé Calçados. Conforto e estilo para o seu dia a dia.`,
        price: p.price,
        compareAt: p.compareAt ?? null,
        images: [PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]],
        categoryId: categoryMap[p.category],
        tags: ['novo', p.category],
        isFeatured: p.featured,
      })
      .returning()

    const color = COLORS[i % COLORS.length]
    for (const size of SIZES) {
      await db.insert(variants).values({
        productId: product.id,
        size,
        color: color.name,
        colorHex: color.hex,
        stock: Math.floor(Math.random() * 20) + 5,
        sku: `${slug.toUpperCase().slice(0, 6)}-${size}-${color.name.slice(0, 3).toUpperCase()}`,
      })
    }
  }

  console.log('✅ Seed concluído!')
  console.log('   Admin: admin@chalecalcados.com.br / senha123')
  console.log('   Cliente: cliente@teste.com / senha123')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err)
  process.exit(1)
})
