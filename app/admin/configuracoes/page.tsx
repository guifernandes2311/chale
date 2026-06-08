export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Configurações</h1>
      <p className="mt-4 text-muted">
        Configure as variáveis de ambiente no arquivo <code>.env.local</code> e na Vercel.
      </p>

      <h2 className="mt-8 font-display text-lg font-semibold">Obrigatório</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
        <li>DATABASE_URL — Supabase PostgreSQL</li>
        <li>AUTH_SECRET — NextAuth (openssl rand -base64 32)</li>
        <li>NEXT_PUBLIC_WHATSAPP_NUMBER — WhatsApp da loja</li>
        <li>MELHOR_ENVIO_TOKEN — Token Melhor Envio</li>
        <li>STORE_CEP — CEP de origem dos envios</li>
      </ul>

      <h2 className="mt-8 font-display text-lg font-semibold">Supabase Storage (imagens)</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
        <li>NEXT_PUBLIC_SUPABASE_URL</li>
        <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
        <li>SUPABASE_SERVICE_ROLE_KEY — apenas server-side</li>
        <li>Criar bucket público <code>produtos</code> no dashboard Supabase</li>
      </ul>

      <h2 className="mt-8 font-display text-lg font-semibold">Opcional</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
        <li>RESEND_API_KEY — emails transacionais</li>
        <li>GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET — login social</li>
        <li>MELHOR_ENVIO_SANDBOX=true — usar ambiente de testes Melhor Envio</li>
      </ul>
    </div>
  )
}
