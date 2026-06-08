import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'outline' }
> = {
  PENDING: { label: 'Aguardando pagamento', variant: 'warning' },
  PAID: { label: 'Pago', variant: 'success' },
  PROCESSING: { label: 'Em separação', variant: 'accent' },
  SHIPPED: { label: 'Enviado', variant: 'default' },
  DELIVERED: { label: 'Entregue', variant: 'success' },
  CANCELLED: { label: 'Cancelado', variant: 'error' },
  REFUNDED: { label: 'Reembolsado', variant: 'outline' },
}

interface StatusBadgeProps {
  status: OrderStatus
  paymentMethod?: string
}

export function StatusBadge({ status, paymentMethod }: StatusBadgeProps) {
  const config = { ...STATUS_CONFIG[status] }
  if (status === 'PENDING' && paymentMethod === 'whatsapp') {
    config.label = 'Aguardando contato'
  }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
