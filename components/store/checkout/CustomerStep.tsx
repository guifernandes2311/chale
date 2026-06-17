'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CustomerInput } from '@/lib/validations/pedido'

export function CustomerStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CustomerInput>()

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="customerName">Nome completo</Label>
        <Input id="customerName" className="mt-1" {...register('name')} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="customerPhone">WhatsApp / Telefone</Label>
        <Input
          id="customerPhone"
          type="tel"
          placeholder="(11) 99999-9999"
          className="mt-1"
          {...register('phone')}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
      </div>
      <div>
        <Label htmlFor="customerEmail">Email (opcional)</Label>
        <Input id="customerEmail" type="email" className="mt-1" {...register('email')} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
    </div>
  )
}
