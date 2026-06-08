import { Metadata } from 'next'
import { CheckoutForm } from '@/components/store/checkout/CheckoutForm'

export const metadata: Metadata = {
  title: 'Checkout',
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display mb-8 text-3xl font-semibold">Finalizar compra</h1>
      <CheckoutForm />
    </div>
  )
}
