'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/produtos', label: 'Produtos' },
  { href: '/categorias/tenis', label: 'Tênis' },
  { href: '/categorias/botas', label: 'Botas' },
  { href: '/categorias/sandalias', label: 'Sandálias' },
  { href: '/categorias/sapatos-sociais', label: 'Sociais' },
]

interface NavMenuProps {
  onNavigate?: () => void
  className?: string
}

export function NavMenu({ onNavigate, className }: NavMenuProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex flex-col gap-4 md:flex-row md:items-center md:gap-8', className)}>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            'text-sm font-medium transition-colors hover:text-accent',
            pathname === item.href || pathname.startsWith(item.href + '/')
              ? 'text-accent'
              : 'text-primary'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
