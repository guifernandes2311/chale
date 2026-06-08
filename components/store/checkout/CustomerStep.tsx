'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CustomerInput } from '@/lib/validations/pedido'

interface CustomerStepProps {
  value: Partial<CustomerInput>
  onChange: (customer: CustomerInput) => void
}

export function CustomerStep({ value, onChange }: CustomerStepProps) {
  const update = (field: keyof CustomerInput, val: string) => {
    onChange({ ...value, [field]: val } as CustomerInput)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="customerName">Nome completo</Label>
        <Input
          id="customerName"
          value={value.name ?? ''}
          onChange={(e) => update('name', e.target.value)}
          className="mt-1"
          required
        />
      </div>
      <div>
        <Label htmlFor="customerPhone">WhatsApp / Telefone</Label>
        <Input
          id="customerPhone"
          type="tel"
          placeholder="(11) 99999-9999"
          value={value.phone ?? ''}
          onChange={(e) => update('phone', e.target.value)}
          className="mt-1"
          required
        />
      </div>
      <div>
        <Label htmlFor="customerEmail">Email (opcional)</Label>
        <Input
          id="customerEmail"
          type="email"
          value={value.email ?? ''}
          onChange={(e) => update('email', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  )
}
