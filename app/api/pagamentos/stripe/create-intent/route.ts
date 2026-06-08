import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { getOrderById } from '@/lib/api/orders'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe não configurado' }, { status: 503 })
    }

    const { orderId } = await request.json()
    if (!orderId) {
      return NextResponse.json({ error: 'orderId obrigatório' }, { status: 400 })
    }

    const order = await getOrderById(orderId)
    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json({ error: 'Pedido já processado' }, { status: 400 })
    }

    if (session?.user && order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const amount = Math.round(parseFloat(order.total) * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      metadata: { orderId: order.id },
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('[POST /api/pagamentos/stripe/create-intent]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
