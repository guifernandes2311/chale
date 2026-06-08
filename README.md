# Chalé Calçados

E-commerce de calçados com checkout via WhatsApp, frete Melhor Envio e imagens no Supabase Storage.

## Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** API Routes, Drizzle ORM, PostgreSQL (Supabase)
- **Auth:** NextAuth.js v5
- **Imagens:** Supabase Storage
- **Frete:** Melhor Envio API
- **Vendas:** Checkout finaliza no WhatsApp (sem pagamento online)

## Fluxo de compra

1. Cliente adiciona produtos ao carrinho
2. Checkout: nome, telefone, endereço (ViaCEP)
3. Cálculo de frete via Melhor Envio
4. Pedido registrado no banco (status pendente, estoque não baixado)
5. Redirecionamento para WhatsApp com resumo completo
6. Admin confirma pagamento e marca pedido como "Em separação" (baixa estoque)

## Setup local

### 1. Dependências

```bash
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env.local
```

**Obrigatório:**

```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."                          # openssl rand -base64 32
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999  # WhatsApp da loja
MELHOR_ENVIO_TOKEN="..."                   # painel Melhor Envio
STORE_CEP=01310100                         # CEP de origem
MELHOR_ENVIO_SANDBOX=true                  # dev
```

**Supabase Storage (upload de imagens no admin):**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

No dashboard Supabase: Storage → criar bucket público `produtos`.

### 3. Banco de dados

```bash
npm run db:push
npm run db:seed
```

### 4. Rodar

```bash
npm run dev
```

## Credenciais de teste

| Papel   | Email                      | Senha    |
|---------|----------------------------|----------|
| Admin   | admin@chalecalcados.com.br | senha123 |
| Cliente | cliente@teste.com          | senha123 |

## Melhor Envio

1. Crie conta em [melhorenvio.com.br](https://melhorenvio.com.br)
2. Integrações → Gerar token de API
3. Use `MELHOR_ENVIO_SANDBOX=true` para testes

## Scripts

| Comando              | Descrição              |
|----------------------|------------------------|
| `npm run dev`        | Desenvolvimento        |
| `npm run build`      | Build produção         |
| `npm run test`       | Testes Vitest          |
| `npm run db:push`    | Aplicar schema         |
| `npm run db:seed`    | Dados iniciais         |

## Deploy Vercel

Configure todas as variáveis do `.env.example` na Vercel, incluindo `AUTH_URL` e `NEXT_PUBLIC_APP_URL` com o domínio de produção.
