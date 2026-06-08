'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { toast } from '@/hooks/use-toast'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
}

export function ImageUpload({ value, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error ?? 'Erro no upload')
    }

    const { data } = await res.json()
    return data.url as string
  }

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      if (value.length + fileArray.length > maxImages) {
        toast({
          title: 'Limite de imagens',
          description: `Máximo ${maxImages} imagens por produto.`,
          variant: 'destructive',
        })
        return
      }

      setUploading(true)
      try {
        const urls: string[] = []
        for (const file of fileArray) {
          const url = await uploadFile(file)
          urls.push(url)
        }
        onChange([...value, ...urls])
        toast({ title: 'Imagem enviada com sucesso' })
      } catch (error) {
        toast({
          title: 'Erro no upload',
          description: error instanceof Error ? error.message : 'Tente novamente',
          variant: 'destructive',
        })
      } finally {
        setUploading(false)
      }
    },
    [value, onChange, maxImages]
  )

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border p-6 transition-colors',
          dragOver && 'border-accent bg-secondary',
          uploading && 'pointer-events-none opacity-60'
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
        }}
        onClick={() => document.getElementById('image-upload-input')?.click()}
      >
        <input
          id="image-upload-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted" />
            <p className="mt-2 text-sm text-muted">
              Arraste imagens ou clique para enviar
            </p>
            <p className="text-xs text-muted">JPEG, PNG ou WebP — máx. 5MB</p>
          </>
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, i) => (
            <div key={url} className="relative h-20 w-20 overflow-hidden rounded-sm border border-border">
              <Image src={url} alt="" fill className="object-cover" sizes="80px" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-0 top-0 h-6 w-6"
                onClick={() => removeImage(i)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
