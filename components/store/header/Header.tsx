'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, User, X } from 'lucide-react'
import { NavMenu } from './NavMenu'
import { CartIcon } from './CartIcon'
import { Button } from '@/components/ui/button'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-secondary/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          Chalé Calçados
        </Link>

        <NavMenu className="hidden md:flex" />

        <div className="flex items-center gap-2">
          <div className="relative">
            <CartIcon />
          </div>

          {session ? (
            <div className="hidden items-center gap-2 md:flex">
              {session.user.role === 'ADMIN' && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/conta/perfil">
                  <User className="mr-1 h-4 w-4" />
                  Conta
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                Sair
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-secondary px-4 py-4 md:hidden">
          <NavMenu onNavigate={() => setMobileOpen(false)} />
          <div className="mt-4 flex flex-col gap-2">
            {session ? (
              <>
                <Link href="/conta/perfil" className="text-sm" onClick={() => setMobileOpen(false)}>
                  Minha conta
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-sm" onClick={() => setMobileOpen(false)}>
                    Admin
                  </Link>
                )}
                <button className="text-left text-sm" onClick={() => signOut({ callbackUrl: '/' })}>
                  Sair
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm" onClick={() => setMobileOpen(false)}>
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
