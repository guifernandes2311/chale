'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SizeSelector } from './SizeSelector'
import { ColorSelector } from './ColorSelector'
import { formatPrice } from '@/lib/utils/formatters'
import { useCart } from '@/hooks/useCart'
import type { Product, ProductVariant } from '@/types'

interface ProductInfoProps {
  product: Product & {
    category?: { name: string; slug: string }
    variants: ProductVariant[]
  }
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const { addToCart } = useCart()

  const selectedVariant = useMemo(() => {
    return product.variants.find((v) => {
      const sizeMatch = selectedSize ? v.size === selectedSize : true
      const colorMatch = selectedColor ? v.color === selectedColor : true
      return sizeMatch && colorMatch && v.stock > 0
    })
  }, [product.variants, selectedSize, selectedColor])

  const hasDiscount =
    product.compareAt && parseFloat(product.compareAt) > parseFloat(product.price)

  const handleAddToCart = async () => {
    if (!selectedVariant || adding) return
    setAdding(true)
    try {
      await addToCart({
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        image: product.images[0] ?? '',
        size: selectedVariant.size,
        color: selectedVariant.color ?? undefined,
        price: parseFloat(product.price),
        quantity: 1,
      })
    } finally {
      setAdding(false)
    }
  }

  return (
    <div>
      {product.category && (
        <Badge variant="outline" className="mb-2">
          {product.category.name}
        </Badge>
      )}
      <h1 className="font-display text-3xl font-semibold">{product.name}</h1>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
        {hasDiscount && (
          <span className="text-lg text-muted line-through">
            {formatPrice(product.compareAt!)}
          </span>
        )}
      </div>

      <div className="mt-8 space-y-6">
        <SizeSelector
          variants={product.variants}
          selectedSize={selectedSize}
          onSelect={(size) => {
            setSelectedSize(size)
            setSelectedColor(null)
          }}
        />
        <ColorSelector
          variants={product.variants}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onSelect={setSelectedColor}
        />
      </div>

      <div aria-live="polite" className="mt-8">
        <Button
          variant="default"
          size="lg"
          className="w-full"
          disabled={!selectedVariant || adding}
          onClick={handleAddToCart}
          aria-busy={adding}
        >
          {adding
            ? 'Adicionando...'
            : selectedVariant
              ? 'Adicionar ao carrinho'
              : 'Selecione tamanho e cor'}
        </Button>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="text-sm font-medium">Descrição</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{product.description}</p>
      </div>

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="frete">
          <AccordionTrigger>Frete e entrega</AccordionTrigger>
          <AccordionContent>
            Entrega para todo o Brasil. Prazo estimado de 5 a 12 dias úteis após confirmação do
            pagamento.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
