import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductGallery } from '@/components/store/produto/ProductGallery'
import { ProductInfo } from '@/components/store/produto/ProductInfo'
import { RelatedProducts } from '@/components/store/produto/RelatedProducts'
import { getProductBySlug, getRelatedProducts } from '@/lib/api/products'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await getProductBySlug(slug)
    if (!product) return { title: 'Produto não encontrado' }
    return {
      title: product.name,
      description: product.description.slice(0, 160),
      openGraph: { images: product.images[0] ? [product.images[0]] : [] },
    }
  } catch {
    return { title: 'Produto' }
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  let product: Awaited<ReturnType<typeof getProductBySlug>> = null
  let related: Awaited<ReturnType<typeof getRelatedProducts>> = []

  try {
    product = await getProductBySlug(slug)
    if (product) {
      related = await getRelatedProducts(product.categoryId, product.id)
    }
  } catch {
    notFound()
  }

  if (!product) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />
        <ProductInfo product={product} />
      </div>
      <RelatedProducts products={related} />
    </div>
  )
}
