import { Suspense } from 'react'
import { Metadata } from 'next'
import { CheckoutForm } from '@/components/store/checkout/CheckoutForm'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Checkout',
}

function CheckoutFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display mb-8 text-3xl font-semibold">Finalizar compra</h1>
      <Suspense fallback={<CheckoutFallback />}>
        <CheckoutForm />
      </Suspense>
    </div>
  )
}
