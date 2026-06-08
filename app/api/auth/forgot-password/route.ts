import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, passwordResetTokens } from '@/drizzle/schema'
import { forgotPasswordSchema } from '@/lib/validations/usuario'
import { sendEmail, passwordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1)

    if (user) {
      const token = crypto.randomUUID()
      const expires = new Date(Date.now() + 60 * 60 * 1000)

      await db.insert(passwordResetTokens).values({
        userId: user.id,
        token,
        expires,
      })

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/redefinir-senha?token=${token}`
      await sendEmail({
        to: user.email,
        subject: 'Recuperação de senha — Chalé Calçados',
        html: passwordResetEmail(resetUrl),
      })
    }

    return NextResponse.json({
      message: 'Se o email existir, você receberá instruções para redefinir a senha.',
    })
  } catch (error) {
    console.error('[POST /api/auth/forgot-password]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
