import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function HeroBanner() {
  return (
    <section className="relative h-[70vh] min-h-[400px] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&q=80"
        alt="Coleção Chalé Calçados"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium uppercase tracking-widest text-white/80">
            Nova coleção
          </p>
          <h1 className="font-display mt-2 max-w-xl text-4xl font-semibold text-white md:text-6xl">
            Estilo que acompanha seus passos
          </h1>
          <p className="mt-4 max-w-md text-white/90">
            Descubra calçados exclusivos com design moderno e conforto incomparável.
          </p>
          <Button variant="accent" size="lg" className="mt-8" asChild>
            <Link href="/produtos">Ver coleção</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
