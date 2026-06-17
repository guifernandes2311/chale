'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Logo } from '@/components/Logo'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-white p-4">
      <Link href="/" aria-label="Chalé Calçados — Página inicial">
        <Logo size="sm" />
      </Link>
      <nav className="mt-8 space-y-1">
        {LINKS.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors',
                active ? 'bg-secondary font-medium' : 'text-muted hover:bg-secondary/50'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
