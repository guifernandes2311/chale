import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate } from '@/lib/utils/formatters'

describe('formatPrice', () => {
  it('formats BRL currency', () => {
    expect(formatPrice(299.9)).toContain('299')
    expect(formatPrice(299.9)).toContain('R$')
  })

  it('formats string values', () => {
    expect(formatPrice('150.00')).toContain('150')
  })
})

describe('formatDate', () => {
  it('formats date in pt-BR', () => {
    const result = formatDate(new Date('2024-06-15'))
    expect(result).toContain('2024')
  })
})
