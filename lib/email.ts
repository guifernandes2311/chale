interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@chalecalcados.com.br'

  if (!apiKey) {
    console.log('[Email Fallback]', { to, subject, html: html.slice(0, 200) })
    return true
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    })
    return res.ok
  } catch (error) {
    console.error('[sendEmail]', error)
    return false
  }
}

export function orderConfirmationEmail(orderId: string, total: string): string {
  return `
    <h1>Pedido confirmado!</h1>
    <p>Seu pedido <strong>#${orderId.slice(0, 8)}</strong> foi recebido com sucesso.</p>
    <p>Total: <strong>${total}</strong></p>
    <p>Obrigado por comprar na Chalé Calçados!</p>
  `
}

export function passwordResetEmail(resetUrl: string): string {
  return `
    <h1>Recuperação de senha</h1>
    <p>Clique no link abaixo para redefinir sua senha:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>Este link expira em 1 hora.</p>
  `
}
