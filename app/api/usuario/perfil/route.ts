import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/drizzle/schema'
import { profileSchema, passwordSchema } from '@/lib/validations/usuario'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    return NextResponse.json({ data: user })
  } catch (error) {
    console.error('[GET /api/usuario/perfil]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await request.json()

    if (body.currentPassword) {
      const parsed = passwordSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
      }

      const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)
      if (!user?.password) {
        return NextResponse.json({ error: 'Usuário sem senha' }, { status: 400 })
      }

      const valid = await bcrypt.compare(parsed.data.currentPassword, user.password)
      if (!valid) {
        return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })
      }

      const hash = await bcrypt.hash(parsed.data.newPassword, 12)
      await db.update(users).set({ password: hash, updatedAt: new Date() }).where(eq(users.id, session.user.id))
      return NextResponse.json({ message: 'Senha atualizada' })
    }

    const parsed = profileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const [updated] = await db
      .update(users)
      .set({ name: parsed.data.name, email: parsed.data.email, updatedAt: new Date() })
      .where(eq(users.id, session.user.id))
      .returning()

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('[PATCH /api/usuario/perfil]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
