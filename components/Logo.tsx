import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

const SIZES = {
  sm: 32,
  md: 48,
  lg: 64,
} as const

interface LogoProps {
  size?: keyof typeof SIZES
  variant?: 'default' | 'muted'
  className?: string
}

export function Logo({ size = 'md', variant = 'default', className }: LogoProps) {
  const dim = SIZES[size]
  return (
    <Image
      src="/icon-tranp.svg"
      alt="Chalé Calçados"
      width={dim}
      height={dim}
      unoptimized
      className={cn(variant === 'muted' && 'grayscale opacity-70', className)}
    />
  )
}
