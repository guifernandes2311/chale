'use client'

import { useCallback, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { CustomerStep } from './CustomerStep'
import { AddressStep } from './AddressStep'
import { ShippingStep } from './ShippingStep'
import { WhatsAppStep } from './WhatsAppStep'
import { OrderSummary } from './OrderSummary'
import { useCartStore } from '@/store/cartStore'
import { customerSchema, type CustomerInput } from '@/lib/validations/pedido'
import { addressSchema, type AddressInput } from '@/lib/validations/usuario'
import { toast } from '@/hooks/use-toast'
import {
  clearCheckoutDraft,
  loadCheckoutDraft,
  saveCheckoutDraft,
  slugFromStep,
  stepFromSlug,
} from '@/lib/checkout-draft'
import type { ShippingOption } from '@/lib/melhorenvio'

const STEPS = ['Seus dados', 'Endereço', 'Frete', 'WhatsApp', 'Confirmação']

export function CheckoutForm() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items, subtotal, clearCart } = useCartStore()

  const initialDraft = typeof window !== 'undefined' ? loadCheckoutDraft() : null
  const urlStep = stepFromSlug(searchParams.get('step'))

  const [step, setStep] = useState(initialDraft?.step ?? urlStep)
  const [shipping, setShipping] = useState<ShippingOption | null>(
    (initialDraft?.shipping as ShippingOption | null) ?? null
  )
  const [orderId, setOrderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const orderSubmittedRef = useRef(false)
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID())

  const customerForm = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: initialDraft?.customer?.name ?? session?.user?.name ?? '',
      email: initialDraft?.customer?.email ?? session?.user?.email ?? '',
      phone: initialDraft?.customer?.phone ?? '',
    },
  })

  const addressForm = useForm<AddressInput>({
    resolver: zodResolver(addressSchema) as never,
    defaultValues: {
      label: (initialDraft?.address?.label as string) ?? 'Casa',
      cep: (initialDraft?.address?.cep as string) ?? '',
      street: (initialDraft?.address?.street as string) ?? '',
      number: (initialDraft?.address?.number as string) ?? '',
      district: (initialDraft?.address?.district as string) ?? '',
      city: (initialDraft?.address?.city as string) ?? '',
      state: (initialDraft?.address?.state as string) ?? '',
      isDefault: false,
    },
  })

  const cartSubtotal = subtotal()
  const shippingCost = shipping?.price ?? 0
  const total = cartSubtotal + shippingCost

  const syncUrlStep = useCallback(
    (nextStep: number) => {
      if (nextStep >= 4) return
      const slug = slugFromStep(nextStep)
      if (searchParams.get('step') !== slug) {
        router.replace(`/checkout?step=${slug}`, { scroll: false })
      }
    },
    [router, searchParams]
  )

  const persistDraft = useCallback(
    (nextStep: number) => {
      if (nextStep >= 4) {
        clearCheckoutDraft()
        return
      }
      saveCheckoutDraft({
        step: nextStep,
        customer: customerForm.getValues() as Record<string, string>,
        address: addressForm.getValues() as unknown as Record<string, string | boolean>,
        shipping: shipping
          ? { id: shipping.id, name: shipping.name, company: shipping.company, price: shipping.price }
          : null,
      })
    },
    [addressForm, customerForm, shipping]
  )

  const goToStep = useCallback(
    (nextStep: number) => {
      setStep(nextStep)
      syncUrlStep(nextStep)
      persistDraft(nextStep)
    },
    [persistDraft, syncUrlStep]
  )

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
    if (orderSubmittedRef.current || loading) return

    const customerValid = await customerForm.trigger()
    const addressValid = await addressForm.trigger()
    if (!customerValid) {
      goToStep(0)
      return
    }
    if (!addressValid) {
      goToStep(1)
      return
    }
    if (!shipping) {
      toast({ title: 'Selecione uma opção de frete', variant: 'destructive' })
      goToStep(2)
      return
    }

    setLoading(true)
    orderSubmittedRef.current = true

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKeyRef.current,
        },
        body: JSON.stringify({
          items,
          customer: customerForm.getValues(),
          address: addressForm.getValues(),
          shippingMethod: shipping.id,
          shippingName: `${shipping.name} — ${shipping.company}`,
          shippingCost: shipping.price,
          paymentMethod: 'whatsapp',
        }),
      })

      if (!res.ok) {
        orderSubmittedRef.current = false
        const err = await res.json()
        throw new Error(err.error ?? 'Erro ao criar pedido')
      }

      const { order, whatsappUrl } = await res.json()
      setOrderId(order.id)

      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank')
      }

      clearCart()
      clearCheckoutDraft()
      setStep(4)
      router.replace('/checkout?step=confirmacao', { scroll: false })
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
          <FormProvider {...customerForm}>
            <div>
              <CustomerStep />
              <div className="mt-6 flex gap-2">
                {!session && (
                  <Button variant="outline" asChild>
                    <Link href="/login?callbackUrl=/checkout">Já tenho conta</Link>
                  </Button>
                )}
                <Button
                  onClick={customerForm.handleSubmit(() => goToStep(1))}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </FormProvider>
        )}

        {step === 1 && (
          <FormProvider {...addressForm}>
            <div>
              <AddressStep />
              <div className="mt-6 flex gap-2">
                <Button variant="outline" onClick={() => goToStep(0)}>
                  Voltar
                </Button>
                <Button onClick={addressForm.handleSubmit(() => goToStep(2))}>
                  Continuar
                </Button>
              </div>
            </div>
          </FormProvider>
        )}

        {step === 2 && (
          <div>
            <ShippingStep
              key={addressForm.getValues('cep') ?? ''}
              cep={addressForm.getValues('cep') ?? ''}
              items={items}
              selected={shipping}
              onSelect={setShipping}
            />
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => goToStep(1)}>
                Voltar
              </Button>
              <Button disabled={!shipping} onClick={() => goToStep(3)}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 3 && shipping && (
          <div aria-live="polite">
            <WhatsAppStep
              items={items}
              subtotal={cartSubtotal}
              shippingCost={shippingCost}
              shippingName={`${shipping.name} — ${shipping.company}`}
              total={total}
              loading={loading}
              onSubmit={submitWhatsAppOrder}
            />
            <Button variant="outline" className="mt-4" onClick={() => goToStep(2)}>
              Voltar
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="rounded-md border border-border bg-white p-8 text-center" aria-live="polite">
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
