export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface AddressSnapshot {
  label: string
  cep: string
  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  shippingMethod?: string
  shippingName?: string
}

export interface OrderItemSnapshot {
  name: string
  image: string
  size: string
  color?: string
}

export interface OrderItem {
  id: string
  orderId: string
  variantId: string
  quantity: number
  unitPrice: string
  snapshot: OrderItemSnapshot
}

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  subtotal: string
  shippingCost: string
  discount: string
  total: string
  addressSnapshot: AddressSnapshot
  paymentMethod: string
  paymentId: string | null
  trackingCode: string | null
  notes: string | null
  items?: OrderItem[]
  createdAt: Date
  updatedAt: Date
}
