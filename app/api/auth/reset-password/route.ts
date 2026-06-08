import { NextRequest, NextResponse } from 'next/server'
import { eq, and, gt } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users, passwordResetTokens } from '@/drizzle/schema'
import { resetPasswordSchema } from '@/lib/validations/usuario'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, parsed.data.token),
          gt(passwordResetTokens.expires, new Date())
        )
      )
      .limit(1)

    if (!resetToken) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12)
    await db
      .update(users)
      .set({ password: passwordHash, updatedAt: new Date() })
      .where(eq(users.id, resetToken.userId))

    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, resetToken.id))

    return NextResponse.json({ message: 'Senha redefinida com sucesso' })
  } catch (error) {
    console.error('[POST /api/auth/reset-password]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
