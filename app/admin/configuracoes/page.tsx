export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Configurações</h1>
      <p className="mt-4 text-muted">
        Configure as variáveis de ambiente no arquivo <code>.env.local</code> e na Vercel para
        habilitar Stripe, Resend, Google OAuth e demais integrações.
      </p>
      <ul className="mt-6 list-inside list-disc space-y-2 text-sm text-muted">
        <li>DATABASE_URL — Supabase PostgreSQL</li>
        <li>AUTH_SECRET — NextAuth (openssl rand -base64 32)</li>
        <li>STRIPE_SECRET_KEY / NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</li>
        <li>RESEND_API_KEY — emails transacionais</li>
        <li>GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET — login social</li>
      </ul>
    </div>
  )
}
