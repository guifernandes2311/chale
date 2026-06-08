import { describe, it, expect } from 'vitest'
import { buildWhatsAppMessage, getWhatsAppUrl } from '@/lib/whatsapp'
import { customerSchema } from '@/lib/validations/pedido'

describe('buildWhatsAppMessage', () => {
  it('includes order details in message', () => {
    const message = buildWhatsAppMessage({
      orderId: 'abc12345-xyz',
      customerName: 'Maria Silva',
      customerPhone: '(11) 99999-9999',
      items: [
        { name: 'Tênis Runner', size: '38', color: 'Preto', quantity: 1, price: 299.9 },
      ],
      subtotal: 299.9,
      shippingCost: 34.9,
      shippingName: 'SEDEX — Correios',
      total: 334.8,
      address: {
        street: 'Av. Paulista',
        number: '1000',
        district: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        cep: '01310-100',
      },
    })

    expect(message).toContain('Chalé Calçados')
    expect(message).toContain('Maria Silva')
    expect(message).toContain('Tênis Runner')
    expect(message).toContain('ABC12345')
    expect(message).toContain('01310-100')
  })
})

describe('getWhatsAppUrl', () => {
  it('builds wa.me link with encoded message', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '5511987654321'
    const url = getWhatsAppUrl('11999999999', 'Olá teste')
    expect(url).toContain('wa.me/5511987654321')
    expect(url).toContain('text=')
  })
})

describe('customerSchema', () => {
  it('validates customer with phone', () => {
    const result = customerSchema.safeParse({
      name: 'Maria',
      phone: '11999999999',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing phone', () => {
    const result = customerSchema.safeParse({ name: 'Maria' })
    expect(result.success).toBe(false)
  })
})
