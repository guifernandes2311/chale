'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CustomerStep } from './CustomerStep'
import { AddressStep } from './AddressStep'
import { ShippingStep } from './ShippingStep'
import { WhatsAppStep } from './WhatsAppStep'
import { OrderSummary } from './OrderSummary'
import { useCartStore } from '@/store/cartStore'
import { addressSchema, type CustomerInput } from '@/lib/validations/pedido'
import { customerSchema } from '@/lib/validations/pedido'
import { toast } from '@/hooks/use-toast'
import type { ShippingOption } from '@/lib/melhorenvio'

const STEPS = ['Seus dados', 'Endereço', 'Frete', 'WhatsApp', 'Confirmação']

export function CheckoutForm() {
  const { data: session } = useSession()
  const { items, subtotal, clearCart } = useCartStore()
  const [step, setStep] = useState(0)
  const [customer, setCustomer] = useState<Partial<CustomerInput>>({
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    phone: '',
  })
  const [address, setAddress] = useState<Partial<Parameters<typeof AddressStep>[0]['value']>>({
    label: 'Casa',
  })
  const [shipping, setShipping] = useState<ShippingOption | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const cartSubtotal = subtotal()
  const shippingCost = shipping?.price ?? 0
  const total = cartSubtotal + shippingCost

  if (items.length === 0 && step < 4) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Seu carrinho está vazio.</p>
        <Button className="mt-4" asChild>
          <Link href="/produtos">Ver produtos</Link>
        </Button>
      </div>
    )
  }

  const submitWhatsAppOrder = async () => {
    const parsedCustomer = customerSchema.safeParse(customer)
    const parsedAddress = addressSchema.safeParse(address)

    if (!parsedCustomer.success) {
      toast({ title: 'Dados incompletos', description: 'Preencha nome e telefone.', variant: 'destructive' })
      setStep(0)
      return
    }
    if (!parsedAddress.success) {
      toast({ title: 'Endereço incompleto', variant: 'destructive' })
      setStep(1)
      return
    }
    if (!shipping) {
      toast({ title: 'Selecione uma opção de frete', variant: 'destructive' })
      setStep(2)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: parsedCustomer.data,
          address: parsedAddress.data,
          shippingMethod: shipping.id,
          shippingName: `${shipping.name} — ${shipping.company}`,
          shippingCost: shipping.price,
          paymentMethod: 'whatsapp',
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Erro ao criar pedido')
      }

      const { order, whatsappUrl } = await res.json()
      setOrderId(order.id)

      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank')
      }

      clearCart()
      setStep(4)
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao criar pedido',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`shrink-0 rounded-sm px-3 py-1 text-xs ${
                i === step ? 'bg-primary text-secondary' : i < step ? 'bg-accent/30' : 'bg-border/50'
              }`}
            >
              {i + 1}. {s}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <CustomerStep value={customer} onChange={setCustomer} />
            <div className="mt-6 flex gap-2">
              {!session && (
                <Button variant="outline" asChild>
                  <Link href="/login?callbackUrl=/checkout">Já tenho conta</Link>
                </Button>
              )}
              <Button
                onClick={() => {
                  const parsed = customerSchema.safeParse(customer)
                  if (!parsed.success) {
                    toast({ title: 'Preencha nome e telefone', variant: 'destructive' })
                    return
                  }
                  setStep(1)
                }}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <AddressStep value={address} onChange={setAddress} />
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>
                Voltar
              </Button>
              <Button
                onClick={() => {
                  const parsed = addressSchema.safeParse(address)
                  if (!parsed.success) {
                    toast({ title: 'Endereço incompleto', variant: 'destructive' })
                    return
                  }
                  setStep(2)
                }}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <ShippingStep
              cep={address.cep ?? ''}
              items={items}
              selected={shipping}
              onSelect={setShipping}
            />
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button disabled={!shipping} onClick={() => setStep(3)}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 3 && shipping && (
          <div>
            <WhatsAppStep
              items={items}
              subtotal={cartSubtotal}
              shippingCost={shippingCost}
              shippingName={`${shipping.name} — ${shipping.company}`}
              total={total}
              loading={loading}
              onSubmit={submitWhatsAppOrder}
            />
            <Button variant="outline" className="mt-4" onClick={() => setStep(2)}>
              Voltar
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="rounded-md border border-border bg-white p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-success">Pedido enviado!</h2>
            {orderId && (
              <p className="mt-2 text-muted">
                Número do pedido: <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>
              </p>
            )}
            <p className="mt-4 text-sm">
              Abrimos o WhatsApp com os detalhes do seu pedido. Aguarde nossa confirmação para
              combinar o pagamento.
            </p>
            {session && (
              <Button className="mt-6" asChild>
                <Link href="/conta/pedidos">Ver meus pedidos</Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {step < 4 && (
        <OrderSummary items={items} subtotal={cartSubtotal} shippingCost={shippingCost} />
      )}
    </div>
  )
}
