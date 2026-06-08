'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface ProductGalleryProps {
  images: string[]
  alt: string
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80']

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-md bg-white">
        <Image
          src={displayImages[selected]}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {displayImages.length > 1 && (
        <div className="flex gap-2">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                'relative h-16 w-16 overflow-hidden rounded-sm border-2',
                selected === i ? 'border-primary' : 'border-transparent'
              )}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
