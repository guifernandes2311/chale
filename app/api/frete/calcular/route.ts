import { NextRequest, NextResponse } from 'next/server'
import { inArray } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { products } from '@/drizzle/schema'
import { calculateShipping, isMelhorEnvioConfigured } from '@/lib/melhorenvio'

const schema = z.object({
  cep: z.string().min(8),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    if (!isMelhorEnvioConfigured()) {
      return NextResponse.json(
        { error: 'Melhor Envio não configurado. Defina MELHOR_ENVIO_TOKEN e STORE_CEP.' },
        { status: 503 }
      )
    }

    const productIds = parsed.data.items.map((i) => i.productId)
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds))

    const productMap = Object.fromEntries(dbProducts.map((p) => [p.id, p]))

    const shippingItems = parsed.data.items.map((item) => {
      const product = productMap[item.productId]
      if (!product) throw new Error(`Produto ${item.productId} não encontrado`)
      return {
        productId: item.productId,
        quantity: item.quantity,
        weight: product.weight,
        height: product.height,
        width: product.width,
        length: product.length,
        price: item.price,
      }
    })

    const options = await calculateShipping(parsed.data.cep, shippingItems)
    return NextResponse.json({ data: options })
  } catch (error) {
    console.error('[POST /api/frete/calcular]', error)
    const message = error instanceof Error ? error.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
