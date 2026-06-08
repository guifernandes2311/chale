import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadProductImage } from '@/lib/supabase/storage'
import { isSupabaseStorageConfigured } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (!isSupabaseStorageConfigured()) {
      return NextResponse.json(
        {
          error:
            'Supabase Storage não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.',
        },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = crypto.randomUUID()

    const result = await uploadProductImage(buffer, filename, file.type)
    if (!result) {
      return NextResponse.json({ error: 'Falha no upload' }, { status: 500 })
    }

    return NextResponse.json({ data: { url: result.url, path: result.path } })
  } catch (error) {
    console.error('[POST /api/upload]', error)
    const message = error instanceof Error ? error.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
