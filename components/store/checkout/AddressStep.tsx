'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchAddressByCep } from '@/lib/utils/viacep'
import type { AddressInput } from '@/lib/validations/usuario'

export function AddressStep() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<AddressInput>()
  const [loading, setLoading] = useState(false)

  const handleCepBlur = async () => {
    const cep = getValues('cep')
    if (!cep) return
    setLoading(true)
    const data = await fetchAddressByCep(cep)
    setLoading(false)
    if (data) {
      setValue('street', data.logradouro)
      setValue('district', data.bairro)
      setValue('city', data.localidade)
      setValue('state', data.uf)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="label">Identificação</Label>
          <Input id="label" placeholder="Casa, Trabalho..." className="mt-1" {...register('label')} />
          {errors.label && <p className="mt-1 text-xs text-red-600">{errors.label.message}</p>}
        </div>
        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            placeholder="00000-000"
            className="mt-1"
            {...register('cep')}
            onBlur={handleCepBlur}
          />
          {errors.cep && <p className="mt-1 text-xs text-red-600">{errors.cep.message}</p>}
          {loading && <p className="mt-1 text-xs text-muted">Buscando endereço...</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="street">Rua</Label>
        <Input id="street" className="mt-1" {...register('street')} />
        {errors.street && <p className="mt-1 text-xs text-red-600">{errors.street.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="number">Número</Label>
          <Input id="number" className="mt-1" {...register('number')} />
          {errors.number && <p className="mt-1 text-xs text-red-600">{errors.number.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" className="mt-1" {...register('complement')} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="district">Bairro</Label>
          <Input id="district" className="mt-1" {...register('district')} />
          {errors.district && <p className="mt-1 text-xs text-red-600">{errors.district.message}</p>}
        </div>
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" className="mt-1" {...register('city')} />
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
        </div>
        <div>
          <Label htmlFor="state">UF</Label>
          <Input
            id="state"
            maxLength={2}
            className="mt-1"
            {...register('state', {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase()
              },
            })}
          />
          {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
        </div>
      </div>
    </div>
  )
}
