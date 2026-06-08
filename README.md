# Chalé Calçados

E-commerce de calçados — MVP com Next.js, Drizzle ORM, NextAuth e Stripe.

## Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion
- **Backend:** API Routes, Drizzle ORM, PostgreSQL (Supabase)
- **Auth:** NextAuth.js v5 (email/senha + Google OAuth opcional)
- **Pagamentos:** Stripe (cartão)
- **Emails:** Resend (com fallback para console)

## Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha pelo menos:

```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."   # openssl rand -base64 32
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Banco de dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie a connection string (Settings → Database → URI)
3. Execute migrations e seed:

```bash
npm run db:push
npm run db:seed
```

### 4. Rodar o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Credenciais de teste (seed)

| Papel    | Email                          | Senha    |
|----------|--------------------------------|----------|
| Admin    | admin@chalecalcados.com.br     | senha123 |
| Cliente  | cliente@teste.com              | senha123 |

## Scripts

| Comando           | Descrição                    |
|-------------------|------------------------------|
| `npm run dev`     | Servidor de desenvolvimento  |
| `npm run build`   | Build de produção            |
| `npm run lint`    | ESLint                       |
| `npm run type-check` | Verificação TypeScript    |
| `npm run test`    | Testes Vitest                |
| `npm run db:push` | Aplicar schema no banco      |
| `npm run db:seed` | Popular dados iniciais       |
| `npm run db:studio` | Drizzle Studio             |

## Stripe (modo teste)

1. Crie conta em [stripe.com](https://stripe.com)
2. Adicione ao `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. Para webhooks locais, use [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Deploy na Vercel

1. Conecte o repositório GitHub à Vercel
2. Configure todas as variáveis de `.env.example`
3. Rode `npm run db:push` no Supabase de produção
4. Rode `npm run db:seed` (apenas na primeira vez)
5. Configure webhook Stripe apontando para `https://seu-dominio.com/api/webhooks/stripe`

## Estrutura principal

```
app/
  (store)/     # Loja pública
  (auth)/      # Login e registro
  admin/       # Painel administrativo
  api/         # API Routes
components/    # UI e componentes da loja
drizzle/       # Schema e seed
lib/           # Auth, API, validações, utils
store/         # Zustand (carrinho)
```

## Próximos passos (Fase 2)

- MercadoPago (PIX + Boleto)
- Cálculo de frete (Melhor Envio)
- Wishlist e cupons de desconto
