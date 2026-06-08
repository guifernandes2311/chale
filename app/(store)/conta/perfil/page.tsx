'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import type { UserAddress } from '@/types'

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [newAddress, setNewAddress] = useState({
    label: 'Casa',
    cep: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    isDefault: false,
  })

  useEffect(() => {
    fetch('/api/usuario/perfil')
      .then((r) => r.json())
      .then((d) => d.data && setProfile({ name: d.data.name ?? '', email: d.data.email }))
    fetch('/api/enderecos')
      .then((r) => r.json())
      .then((d) => d.data && setAddresses(d.data))
  }, [])

  const saveProfile = async () => {
    const res = await fetch('/api/usuario/perfil', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    if (res.ok) toast({ title: 'Perfil atualizado' })
    else toast({ title: 'Erro', variant: 'destructive' })
  }

  const savePassword = async () => {
    const res = await fetch('/api/usuario/perfil', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwords),
    })
    if (res.ok) {
      toast({ title: 'Senha atualizada' })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else toast({ title: 'Erro ao atualizar senha', variant: 'destructive' })
  }

  const addAddress = async () => {
    const res = await fetch('/api/enderecos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAddress),
    })
    if (res.ok) {
      const { data } = await res.json()
      setAddresses([...addresses, data])
      toast({ title: 'Endereço adicionado' })
    }
  }

  const removeAddress = async (id: string) => {
    await fetch(`/api/enderecos/${id}`, { method: 'DELETE' })
    setAddresses(addresses.filter((a) => a.id !== id))
  }

  return (
    <div className="max-w-lg space-y-8">
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Dados pessoais</h2>
        <div>
          <Label>Nome</Label>
          <Input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="mt-1"
          />
        </div>
        <Button onClick={saveProfile}>Salvar perfil</Button>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Alterar senha</h2>
        <Input
          type="password"
          placeholder="Senha atual"
          value={passwords.currentPassword}
          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Nova senha"
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Confirmar nova senha"
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
        />
        <Button onClick={savePassword}>Atualizar senha</Button>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Endereços</h2>
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-md border border-border p-4 text-sm">
            <p className="font-medium">{addr.label}</p>
            <p className="text-muted">
              {addr.street}, {addr.number} — {addr.district}, {addr.city}/{addr.state}
            </p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => removeAddress(addr.id)}>
              Remover
            </Button>
          </div>
        ))}
        <div className="grid gap-2 sm:grid-cols-2">
          <Input placeholder="Rótulo" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
          <Input placeholder="CEP" value={newAddress.cep} onChange={(e) => setNewAddress({ ...newAddress, cep: e.target.value })} />
          <Input placeholder="Rua" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="sm:col-span-2" />
          <Input placeholder="Número" value={newAddress.number} onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })} />
          <Input placeholder="Bairro" value={newAddress.district} onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })} />
          <Input placeholder="Cidade" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
          <Input placeholder="UF" maxLength={2} value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
        </div>
        <Button onClick={addAddress}>Adicionar endereço</Button>
      </section>
    </div>
  )
}
