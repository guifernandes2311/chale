export interface ProductVariant {
  id: string
  productId: string
  size: string
  color: string | null
  colorHex: string | null
  stock: number
  sku: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  image: string | null
  parentId: string | null
  showOnHome: boolean
  homeOrder: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: string
  compareAt: string | null
  images: string[]
  categoryId: string
  category?: ProductCategory
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  weight: number
  height: number
  width: number
  length: number
  variants?: ProductVariant[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductFilters {
  categoria?: string
  tamanho?: string
  cor?: string
  precoMin?: string
  precoMax?: string
  ordenar?: string
  pagina?: string
  busca?: string
  destaque?: string
}
