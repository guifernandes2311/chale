'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchAddressByCep } from '@/lib/utils/viacep'
import type { AddressInput } from '@/lib/validations/usuario'

interface AddressStepProps {
  value: Partial<AddressInput>
  onChange: (address: AddressInput) => void
}

export function AddressStep({ value, onChange }: AddressStepProps) {
  const [loading, setLoading] = useState(false)

  const update = (field: keyof AddressInput, val: string) => {
    onChange({ ...value, [field]: val } as AddressInput)
  }

  const handleCepBlur = async () => {
    if (!value.cep) return
    setLoading(true)
    const data = await fetchAddressByCep(value.cep)
    setLoading(false)
    if (data) {
      onChange({
        ...value,
        cep: value.cep ?? '',
        label: value.label ?? 'Casa',
        street: data.logradouro,
        district: data.bairro,
        city: data.localidade,
        state: data.uf,
        number: value.number ?? '',
        complement: value.complement,
        isDefault: value.isDefault ?? false,
      } as AddressInput)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="label">Identificação</Label>
          <Input
            id="label"
            placeholder="Casa, Trabalho..."
            value={value.label ?? ''}
            onChange={(e) => update('label', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            placeholder="00000-000"
            value={value.cep ?? ''}
            onChange={(e) => update('cep', e.target.value)}
            onBlur={handleCepBlur}
            className="mt-1"
          />
          {loading && <p className="mt-1 text-xs text-muted">Buscando endereço...</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="street">Rua</Label>
        <Input
          id="street"
          value={value.street ?? ''}
          onChange={(e) => update('street', e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            value={value.number ?? ''}
            onChange={(e) => update('number', e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            value={value.complement ?? ''}
            onChange={(e) => update('complement', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="district">Bairro</Label>
          <Input
            id="district"
            value={value.district ?? ''}
            onChange={(e) => update('district', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            value={value.city ?? ''}
            onChange={(e) => update('city', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="state">UF</Label>
          <Input
            id="state"
            maxLength={2}
            value={value.state ?? ''}
            onChange={(e) => update('state', e.target.value.toUpperCase())}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )
}
