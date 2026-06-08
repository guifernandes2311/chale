import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Preço inválido'),
  compareAt: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Preço inválido')
    .optional()
    .nullable(),
  images: z.array(z.string().url()).min(1, 'Adicione pelo menos uma imagem'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  weight: z.number().int().min(1).default(500),
  height: z.number().int().min(1).default(12),
  width: z.number().int().min(1).default(30),
  length: z.number().int().min(1).default(20),
})

export const variantSchema = z.object({
  size: z.string().min(1),
  color: z.string().optional().nullable(),
  colorHex: z.string().optional().nullable(),
  stock: z.number().int().min(0),
  sku: z.string().min(1),
})

export type ProductInput = z.infer<typeof productSchema>
export type VariantInput = z.infer<typeof variantSchema>
