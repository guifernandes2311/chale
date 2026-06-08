import { createSupabaseAdmin } from './server'

const BUCKET = 'produtos'
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function getPublicUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return path
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`
}

export async function uploadProductImage(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<{ url: string; path: string } | null> {
  const supabase = createSupabaseAdmin()
  if (!supabase) return null

  if (!ALLOWED_TYPES.includes(contentType)) {
    throw new Error('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.')
  }

  if (file.length > MAX_SIZE) {
    throw new Error('Arquivo muito grande. Máximo 5MB.')
  }

  const ext = contentType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'
  const path = `${filename}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType,
    upsert: true,
  })

  if (error) {
    throw new Error(`Erro no upload: ${error.message}`)
  }

  return { url: getPublicUrl(path), path }
}
