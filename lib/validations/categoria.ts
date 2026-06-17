import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  slug: z.string().min(2).optional(),
  image: z.string().url().optional().nullable(),
  showOnHome: z.boolean().default(false),
})

export const categoryToggleSchema = z.object({
  showOnHome: z.boolean(),
})

export type CategoryInput = z.infer<typeof categorySchema>
