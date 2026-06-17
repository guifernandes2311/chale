'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface NavMenuProps {
  categories?: { slug: string; name: string }[]
  onNavigate?: () => void
  className?: string
}

export function NavMenu({ categories = [], onNavigate, className }: NavMenuProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/produtos', label: 'Produtos' },
    ...categories.map((cat) => ({
      href: `/categorias/${cat.slug}`,
      label: cat.name,
    })),
  ]

  return (
    <nav className={cn('flex flex-col gap-4 md:flex-row md:items-center md:gap-8', className)}>
      {navItems.map((item) => (
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
