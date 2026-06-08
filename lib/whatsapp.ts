import { formatPrice } from '@/lib/utils/formatters'

export interface WhatsAppOrderItem {
  name: string
  size: string
  color?: string
  quantity: number
  price: number
}

export interface WhatsAppOrderData {
  orderId: string
  customerName: string
  customerPhone: string
  items: WhatsAppOrderItem[]
  subtotal: number
  shippingCost: number
  shippingName: string
  total: number
  address: {
    street: string
    number: string
    complement?: string
    district: string
    city: string
    state: string
    cep: string
  }
}

export function buildWhatsAppMessage(data: WhatsAppOrderData): string {
  const lines = [
    'Olá! Gostaria de finalizar meu pedido na Chalé Calçados.',
    '',
    `*Pedido #${data.orderId.slice(0, 8).toUpperCase()}*`,
    `*Cliente:* ${data.customerName} — ${data.customerPhone}`,
    '',
    '*Itens:*',
    ...data.items.map((item) => {
      const color = item.color ? ` | ${item.color}` : ''
      return `- ${item.name} | Tam. ${item.size}${color} | Qtd: ${item.quantity} | ${formatPrice(item.price * item.quantity)}`
    }),
    '',
    `*Subtotal:* ${formatPrice(data.subtotal)}`,
    `*Frete (${data.shippingName}):* ${formatPrice(data.shippingCost)}`,
    `*Total:* ${formatPrice(data.total)}`,
    '',
    '*Entrega:*',
    `${data.address.street}, ${data.address.number}${data.address.complement ? ` — ${data.address.complement}` : ''}`,
    `${data.address.district}, ${data.address.city}/${data.address.state} — CEP ${data.address.cep}`,
    '',
    'Aguardo confirmação e formas de pagamento. Obrigada!',
  ]

  return lines.join('\n')
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const storePhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? cleanPhone).replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${storePhone}?text=${encoded}`
}
