import Link from 'next/link'
import Image from 'next/image'

const FALLBACK_IMAGES: Record<string, string> = {
  tenis: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
  botas: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80',
  sandalias: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
  'sapatos-sociais': 'https://images.unsplash.com/photo-1614252239476-1cfb049c1f48?w=600&q=80',
}

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-display text-center text-3xl font-semibold">Categorias</h2>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((cat) => {
          const imageSrc = cat.image ?? FALLBACK_IMAGES[cat.slug] ?? FALLBACK_IMAGES.tenis
          return (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-md"
            >
              <Image
                src={imageSrc}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
              <span className="absolute bottom-4 left-4 font-display text-lg font-semibold text-white">
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
