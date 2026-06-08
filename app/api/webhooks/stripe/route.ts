import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { updateOrderPayment } from '@/lib/api/orders'
import { sendEmail, orderConfirmationEmail } from '@/lib/email'
import { formatPrice } from '@/lib/utils/formatters'
import { db } from '@/lib/db'
import { users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe não configurado' }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('[Stripe Webhook] Assinatura inválida:', error)
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    const orderId = paymentIntent.metadata.orderId

    if (orderId) {
      const order = await updateOrderPayment(orderId, paymentIntent.id)

      if (order) {
        const [user] = await db.select().from(users).where(eq(users.id, order.userId)).limit(1)
        if (user?.email) {
          await sendEmail({
            to: user.email,
            subject: 'Pedido confirmado — Chalé Calçados',
            html: orderConfirmationEmail(order.id, formatPrice(order.total)),
          })
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
