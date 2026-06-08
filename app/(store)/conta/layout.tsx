import Link from 'next/link'

const LINKS = [
  { href: '/conta/perfil', label: 'Perfil' },
  { href: '/conta/pedidos', label: 'Pedidos' },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-semibold">Minha conta</h1>
      <nav className="mt-6 flex gap-4 border-b border-border pb-4">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-muted hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  )
}
