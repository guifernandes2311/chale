import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/drizzle/schema'
import { registerSchema } from '@/lib/validations/usuario'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1)

    if (existing) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12)
    const [user] = await db
      .insert(users)
      .values({
        name: parsed.data.name,
        email: parsed.data.email,
        password: passwordHash,
        role: 'CUSTOMER',
      })
      .returning({ id: users.id, email: users.email, name: users.name })

    return NextResponse.json({ data: user }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/auth/register]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
