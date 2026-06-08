import { z } from 'zod'
import { addressSchema } from './usuario'

export { addressSchema }

export const customerSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
})

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
  customer: customerSchema,
  address: addressSchema,
  shippingMethod: z.string(),
  shippingName: z.string(),
  shippingCost: z.number().min(0),
  paymentMethod: z.enum(['whatsapp', 'stripe', 'mercadopago']),
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
export type CustomerInput = z.infer<typeof customerSchema>
