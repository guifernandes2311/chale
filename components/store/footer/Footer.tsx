import Link from 'next/link'
import { NewsletterSection } from '@/components/store/home/NewsletterSection'
import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <NewsletterSection />
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" aria-label="Chalé Calçados — Página inicial">
              <Logo size="sm" variant="muted" />
            </Link>
            <p className="mt-2 text-sm text-muted">
              Calçados com estilo e conforto para o seu dia a dia.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Loja</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/produtos" className="hover:text-primary">Todos os produtos</Link></li>
              <li><Link href="/categorias/tenis" className="hover:text-primary">Tênis</Link></li>
              <li><Link href="/categorias/botas" className="hover:text-primary">Botas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Ajuda</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/conta/pedidos" className="hover:text-primary">Meus pedidos</Link></li>
              <li><Link href="/conta/perfil" className="hover:text-primary">Minha conta</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Contato</h4>
            <p className="mt-3 text-sm text-muted">contato@chalecalcados.com.br</p>
          </div>
        </div>
        <p className="mt-8 border-t border-border pt-8 text-center text-xs text-muted">
          © {new Date().getFullYear()} Chalé Calçados. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
