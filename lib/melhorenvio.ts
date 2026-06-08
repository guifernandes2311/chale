export interface ShippingItem {
  productId: string
  quantity: number
  weight: number
  height: number
  width: number
  length: number
  price: number
}

export interface ShippingOption {
  id: string
  name: string
  company: string
  price: number
  deliveryDays: number
}

const SANDBOX_URL = 'https://sandbox.melhorenvio.com.br/api/v2'
const PROD_URL = 'https://melhorenvio.com.br/api/v2'

export function isMelhorEnvioConfigured(): boolean {
  return Boolean(process.env.MELHOR_ENVIO_TOKEN && process.env.STORE_CEP)
}

function getBaseUrl(): string {
  return process.env.MELHOR_ENVIO_SANDBOX === 'true' ? SANDBOX_URL : PROD_URL
}

export async function calculateShipping(
  toCep: string,
  items: ShippingItem[]
): Promise<ShippingOption[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN
  const fromCep = process.env.STORE_CEP?.replace(/\D/g, '')
  const to = toCep.replace(/\D/g, '')

  if (!token || !fromCep) {
    throw new Error('Melhor Envio não configurado')
  }

  const products = items.map((item) => ({
    id: item.productId,
    width: item.width,
    height: item.height,
    length: item.length,
    weight: item.weight / 1000,
    insurance_value: item.price,
    quantity: item.quantity,
  }))

  const res = await fetch(`${getBaseUrl()}/me/shipment/calculate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      from: { postal_code: fromCep },
      to: { postal_code: to },
      products,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[MelhorEnvio]', err)
    throw new Error('Erro ao calcular frete')
  }

  const data = await res.json()

  if (!Array.isArray(data)) {
    return []
  }

  return data
    .filter((opt: { error?: string }) => !opt.error)
    .map(
      (opt: {
        id: number
        name: string
        company: { name: string }
        price: string
        delivery_time: number
      }) => ({
        id: String(opt.id),
        name: opt.name,
        company: opt.company?.name ?? 'Transportadora',
        price: parseFloat(opt.price),
        deliveryDays: opt.delivery_time,
      })
    )
    .sort((a, b) => a.price - b.price)
}
