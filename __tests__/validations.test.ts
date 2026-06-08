import { describe, it, expect } from 'vitest'
import { loginSchema, addressSchema } from '@/lib/validations/usuario'
import { cartItemSchema } from '@/lib/validations/pedido'

describe('loginSchema', () => {
  it('validates correct login', () => {
    const result = loginSchema.safeParse({ email: 'test@test.com', password: '123456' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: '123456' })
    expect(result.success).toBe(false)
  })
})

describe('addressSchema', () => {
  it('validates complete address', () => {
    const result = addressSchema.safeParse({
      label: 'Casa',
      cep: '01310-100',
      street: 'Av. Paulista',
      number: '1000',
      district: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
    })
    expect(result.success).toBe(true)
  })
})

describe('cartItemSchema', () => {
  it('validates cart item', () => {
    const result = cartItemSchema.safeParse({
      variantId: 'v1',
      productId: 'p1',
      name: 'Tênis',
      image: 'https://example.com/img.jpg',
      size: '40',
      price: 299.9,
      quantity: 1,
    })
    expect(result.success).toBe(true)
  })
})
