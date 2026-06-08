import { MetadataRoute } from 'next'
import { getCategories, getProducts } from '@/lib/api/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/produtos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  try {
    const [{ products }, categories] = await Promise.all([
      getProducts({ pagina: '1' }),
      getCategories(),
    ])

    const productPages = products.map((p) => ({
      url: `${baseUrl}/produtos/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const categoryPages = categories.map((c) => ({
      url: `${baseUrl}/categorias/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...productPages, ...categoryPages]
  } catch {
    return staticPages
  }
}
