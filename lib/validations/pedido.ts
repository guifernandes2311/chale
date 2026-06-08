import { z } from 'zod'
import { addressSchema } from './usuario'

export const cartItemSchema = z.object({
  variantId: z.string(),
  productId: z.string(),
  name: z.string(),
  image: z.string(),
  size: z.string(),
  color: z.string().optional(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
})

export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  address: addressSchema,
  shippingMethod: z.string(),
  shippingCost: z.number().min(0),
  paymentMethod: z.enum(['stripe', 'mercadopago']),
  guestEmail: z.string().email().optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'PAID',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ]),
  trackingCode: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
