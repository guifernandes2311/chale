# PROJECT_CONTEXT.md

> Documento de contexto completo do projeto. Use este arquivo como referência principal ao gerar código, arquitetura, componentes e decisões técnicas.

---

## 1. VISÃO GERAL DO PROJETO

**Nome do Projeto:** Chalé Calçados
**Tipo:** E-commerce de calçados — tênis, botas, sandálias e sapatos sociais (marca própria / fashion lifestyle)
**Objetivo:** Criar uma loja virtual moderna, performática e com excelente experiência de compra, focada em conversão e identidade visual forte de marca própria.
**Público-alvo:** Consumidores finais (B2C), adultos de 20–45 anos, interesse em moda e lifestyle.
**Mercado:** Brasil — moeda BRL, idioma PT-BR, integração com meios de pagamento e frete nacionais.

---

## 2. STACK TÉCNICA

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript (strict mode)
- **Estilização:** Tailwind CSS + CSS Variables para design tokens
- **Componentes:** shadcn/ui como base, customizados para a identidade da marca
- **Animações:** Framer Motion
- **Gerenciamento de estado:** Zustand (carrinho, UI global) + TanStack Query (server state / cache)
- **Formulários:** React Hook Form + Zod (validação)
- **Ícones:** Lucide React

### Backend / API
- **API Routes:** Next.js API Routes (App Router — `route.ts`)
- **ORM:** Drizzle ORM
- **Banco de dados:** PostgreSQL (Supabase)
- **Autenticação:** NextAuth.js v5 (Auth.js) — email/senha + OAuth (Google)
- **Upload de imagens:** Cloudinary (Storage do Supabase inicialmente)
- **Pagamentos:** Stripe (cartão) + MercadoPago (PIX, boleto)
- **Emails transacionais:** Resend + React Email

### Infra & DevOps
- **Deploy:** Vercel (frontend + API)
- **Banco de dados:** Supabase (PostgreSQL + Storage)
- **Variáveis de ambiente:** `.env.local` (nunca commitar)
- **CI/CD:** GitHub Actions (lint + type-check antes de merge)

### Qualidade de código
- **Linting:** ESLint (config Next.js + regras customizadas)
- **Formatação:** Prettier
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- **Testes:** Vitest + Testing Library (unitários), Playwright (E2E críticos)

---

## 3. ESTRUTURA DE PASTAS

```
/
├── app/                          # Next.js App Router
│   ├── (store)/                  # Grupo de rotas da loja (layout público)
│   │   ├── page.tsx              # Home
│   │   ├── produtos/
│   │   │   ├── page.tsx          # Listagem com filtros
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Página do produto
│   │   ├── categorias/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── carrinho/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   └── conta/
│   │       ├── pedidos/
│   │       └── perfil/
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── registro/
│   │       └── page.tsx
│   ├── admin/                    # Painel administrativo (protegido)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── produtos/
│   │   ├── pedidos/
│   │   ├── clientes/
│   │   └── configuracoes/
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/
│   │   ├── produtos/
│   │   ├── pedidos/
│   │   ├── carrinho/
│   │   ├── pagamentos/
│   │   │   ├── stripe/
│   │   │   └── mercadopago/
│   │   └── webhooks/
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                       # Componentes base (shadcn/ui customizados)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── store/                    # Componentes da loja
│   │   ├── header/
│   │   │   ├── Header.tsx
│   │   │   ├── NavMenu.tsx
│   │   │   └── CartIcon.tsx
│   │   ├── footer/
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   └── NewsletterSection.tsx
│   │   ├── produto/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   ├── SizeSelector.tsx
│   │   │   ├── ColorSelector.tsx
│   │   │   └── RelatedProducts.tsx
│   │   ├── listagem/
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── SortSelect.tsx
│   │   │   └── Pagination.tsx
│   │   ├── carrinho/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   └── checkout/
│   │       ├── CheckoutForm.tsx
│   │       ├── AddressStep.tsx
│   │       ├── PaymentStep.tsx
│   │       └── OrderSummary.tsx
│   └── admin/                    # Componentes do painel admin
│       ├── Sidebar.tsx
│       ├── StatsCard.tsx
│       ├── DataTable.tsx
│       └── Charts.tsx
│
├── lib/
│   ├── db.ts                        # Singleton do Drizzle ORM Client
│   ├── auth.ts                   # Configuração NextAuth
│   ├── stripe.ts                 # Instância do Stripe
│   ├── mercadopago.ts
│   ├── cloudinary.ts
│   ├── validations/              # Schemas Zod reutilizáveis
│   │   ├── produto.ts
│   │   ├── pedido.ts
│   │   └── usuario.ts
│   └── utils/
│       ├── formatters.ts         # formatPrice, formatDate, etc.
│       ├── slugify.ts
│       └── cn.ts                 # clsx + twMerge helper
│
├── hooks/
│   ├── useCart.ts
│   ├── useAuth.ts
│   ├── useProducts.ts
│   └── useCheckout.ts
│
├── store/                        # Zustand stores
│   ├── cartStore.ts
│   └── uiStore.ts
│
├── types/
│   ├── index.ts                  # Re-exports
│   ├── produto.ts
│   ├── pedido.ts
│   ├── usuario.ts
│   └── next-auth.d.ts            # Extensão de tipos do NextAuth
│
├── drizzle/
│   ├── schema.ts
│   └── seed.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local                    # NÃO commitar
├── .env.example                  # Commitar (sem valores reais)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── PROJECT_CONTEXT.md            # Este arquivo
```

---

## 4. MODELO DE DADOS (Drizzle ORM Schema)

```Drizzle ORM
// Referência — schema completo em Drizzle ORM/schema.Drizzle ORM

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?   // hash bcrypt
  image         String?
  role          Role      @default(CUSTOMER)
  addresses     Address[]
  orders        Order[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  CUSTOMER
  ADMIN
}

model Address {
  id         String  @id @default(cuid())
  userId     String
  user       User    @relation(fields: [userId], references: [id])
  label      String  // "Casa", "Trabalho"
  cep        String
  street     String
  number     String
  complement String?
  district   String
  city       String
  state      String
  isDefault  Boolean @default(false)
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  image    String?
  parent   Category? @relation("SubCategories", fields: [parentId], references: [id])
  parentId String?
  children Category[] @relation("SubCategories")
  products Product[]
}

// Categorias principais: Tênis, Botas, Sandálias, Sapatos Sociais

model Product {
  id          String         @id @default(cuid())
  name        String
  slug        String         @unique
  description String
  price       Decimal        @db.Decimal(10, 2)
  compareAt   Decimal?       @db.Decimal(10, 2) // preço "de" (riscado)
  images      String[]
  categoryId  String
  category    Category       @relation(fields: [categoryId], references: [id])
  variants    Variant[]
  tags        String[]
  isActive    Boolean        @default(true)
  isFeatured  Boolean        @default(false)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model Variant {
  id        String      @id @default(cuid())
  productId String
  product   Product     @relation(fields: [productId], references: [id])
  size      String      // "P", "M", "G", "GG" / "38", "39", "40"...
  color     String?
  colorHex  String?
  stock     Int         @default(0)
  sku       String      @unique
  orderItems OrderItem[]
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  status          OrderStatus @default(PENDING)
  items           OrderItem[]
  subtotal        Decimal     @db.Decimal(10, 2)
  shippingCost    Decimal     @db.Decimal(10, 2)
  discount        Decimal     @default(0) @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  addressSnapshot Json        // snapshot do endereço no momento da compra
  paymentMethod   String      // "stripe" | "mercadopago"
  paymentId       String?     // ID externo do gateway
  trackingCode    String?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum OrderStatus {
  PENDING        // aguardando pagamento
  PAID           // pago
  PROCESSING     // em separação
  SHIPPED        // enviado
  DELIVERED      // entregue
  CANCELLED      // cancelado
  REFUNDED       // reembolsado
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  variantId String
  variant   Variant @relation(fields: [variantId], references: [id])
  quantity  Int
  unitPrice Decimal @db.Decimal(10, 2)
  snapshot  Json    // nome, imagem, tamanho, cor no momento da compra
}
```

---

## 5. FUNCIONALIDADES DETALHADAS

### 5.1 Loja (Público)

**Home**
- Hero banner com CTA (pode ser slider ou full-width estático)
- Grade de categorias (Roupas / Sapatos + subcategorias em destaque)
- Seção "Novidades" — produtos mais recentes
- Seção "Mais vendidos" / "Em destaque"
- Banner de promoção / lookbook
- Seção de newsletter

**Listagem de Produtos** (`/produtos`, `/categorias/[slug]`)
- Grid responsivo de cards de produto
- Filtros: categoria, subcategoria, tamanho, cor, faixa de preço, disponibilidade
- Ordenação: relevância, menor preço, maior preço, mais novo, mais vendido
- Paginação ou infinite scroll
- Breadcrumb de navegação
- Contador de resultados

**Página do Produto** (`/produtos/[slug]`)
- Galeria de imagens com zoom e troca por variante de cor
- Nome, preço (com desconto se houver), badge de categoria
- Seletor de tamanho com indicação de esgotado
- Seletor de cor (se aplicável)
- Botão "Adicionar ao Carrinho"
- Botão "Favoritar" (wishlist — pode ser fase 2)
- Guia de medidas (modal)
- Descrição completa + detalhes do produto (accordion)
- Informações de frete (integração ViaCEP + cálculo)
- Produtos relacionados

**Carrinho**
- Drawer lateral (não página separada)
- Lista de itens com imagem, nome, tamanho, cor, quantidade, preço
- Incrementar / decrementar / remover item
- Subtotal em tempo real
- Botão "Ir para Checkout"
- Persistência via Zustand + localStorage

**Checkout** (fluxo em steps)
1. **Identificação** — login ou continuar como convidado
2. **Endereço** — busca por CEP (ViaCEP API), formulário, selecionar endereço salvo
3. **Frete** — opções de entrega (simulado ou integração Correios/Melhor Envio)
4. **Pagamento** — Cartão (Stripe) / PIX (MercadoPago) / Boleto (MercadoPago)
5. **Confirmação** — resumo + número do pedido + email confirmação

**Área do Cliente** (`/conta`)
- Histórico de pedidos com status em tempo real
- Detalhes do pedido (itens, valores, rastreamento)
- Gerenciar endereços
- Editar perfil / senha

### 5.2 Autenticação

- Registro com email + senha (hash bcrypt)
- Login com email + senha
- Login social com Google (OAuth)
- Sessão persistida com JWT (NextAuth)
- Recuperação de senha por email (Resend)
- Proteção de rotas: middleware Next.js (`/conta/**`, `/admin/**`)
- Roles: `CUSTOMER` e `ADMIN`

### 5.3 Painel Admin (`/admin`)

> Acessível apenas para usuários com `role === "ADMIN"`

**Dashboard**
- Cards: receita total, pedidos hoje, pedidos pendentes, novos clientes
- Gráfico de vendas (últimos 30 dias)
- Lista de pedidos recentes
- Produtos com estoque baixo

**Gestão de Produtos**
- Tabela com busca, filtro e paginação
- Criar produto: formulário completo com upload de múltiplas imagens
- Editar produto
- Gerenciar variantes (tamanhos, cores, estoque, SKU)
- Ativar / desativar produto
- Marcar como destaque

**Gestão de Pedidos**
- Tabela com filtro por status, data, cliente
- Ver detalhes do pedido
- Atualizar status manualmente
- Adicionar código de rastreamento
- Cancelar / reembolsar pedido

**Gestão de Clientes**
- Lista de clientes cadastrados
- Ver histórico de compras por cliente
- Detalhes de conta

**Categorias**
- CRUD de categorias e subcategorias
- Gerenciar hierarquia (pai/filho)

---

## 6. DESIGN SYSTEM & UI

### Identidade Visual
- **Estilo:** Fashion/lifestyle moderno — limpo, elegante, com personalidade
- **Tom:** Sofisticado mas acessível
- **Referências visuais:** Arket, COS, Zara online

### Tokens de Design (Tailwind + CSS Variables)

```css
/* globals.css */
:root {
  --color-primary: #0f0f0f;       /* Quase preto — texto principal */
  --color-secondary: #f5f0eb;     /* Off-white quente — background */
  --color-accent: #c8a882;        /* Caramelo/nude — cor de destaque */
  --color-muted: #8a8a8a;         /* Cinza médio — textos secundários */
  --color-border: #e5e0d8;        /* Borda sutil */
  --color-error: #d94f4f;
  --color-success: #2d7a4f;

  --font-display: 'Playfair Display', serif;    /* Títulos */
  --font-body: 'DM Sans', sans-serif;           /* Corpo */

  --radius: 4px;                  /* Border radius padrão — sutil */
  --radius-lg: 8px;
}
```

### Componentes chave
- `ProductCard` — imagem com hover zoom, badge de desconto, nome, preço
- `SizeSelector` — botões de tamanho com estado: disponível / selecionado / esgotado
- `CartDrawer` — overlay lateral animado (Framer Motion)
- `FilterSidebar` — collapsible no mobile, fixo no desktop
- `StatusBadge` — cores semânticas por status do pedido

### Responsividade
- Mobile-first
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Grid de produtos: 2 colunas mobile → 3 tablet → 4 desktop
- Navegação: hamburger menu no mobile, nav horizontal no desktop

---

## 7. FLUXOS CRÍTICOS

### Fluxo de Compra
```
Home / Listagem → Página do Produto → [Adicionar ao Carrinho]
→ CartDrawer abre → [Ir para Checkout]
→ Step 1: Login/Convidado → Step 2: Endereço → Step 3: Frete
→ Step 4: Pagamento → Step 5: Confirmação + Email
→ Admin recebe notificação → Admin atualiza status → Cliente recebe email
```

### Fluxo de Pagamento (Stripe)
```
Checkout → POST /api/pagamentos/stripe/create-intent
→ Stripe retorna clientSecret → Frontend confirma com Stripe.js
→ Webhook /api/webhooks/stripe recebe `payment_intent.succeeded`
→ Atualiza Order.status para PAID → Envia email de confirmação
```

### Fluxo de Pagamento (MercadoPago PIX)
```
Checkout → POST /api/pagamentos/mercadopago/create-payment
→ MP retorna QR Code + código copia-e-cola
→ Usuário paga → Webhook /api/webhooks/mercadopago
→ Atualiza Order.status para PAID → Envia email
```

---

## 8. VARIÁVEIS DE AMBIENTE

```bash
# .env.example — copiar para .env.local e preencher

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# OAuth Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=

# Cloudinary / Uploadthing
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
# ou
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Resend (emails)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@suamarca.com.br

# ViaCEP (sem key — API pública)
# https://viacep.com.br/ws/{CEP}/json/
```

---

## 9. PADRÕES DE CÓDIGO

### Convenções gerais
- Componentes: PascalCase (`ProductCard.tsx`)
- Funções/hooks: camelCase (`useCart`, `formatPrice`)
- Constantes: UPPER_SNAKE_CASE (`MAX_CART_ITEMS`)
- Arquivos de tipo: camelCase (`produto.ts`)
- Rotas API: kebab-case (`/api/create-payment`)

### Estrutura de um Server Component (padrão)
```tsx
// app/(store)/produtos/page.tsx
import { Metadata } from 'next'
import { getProducts } from '@/lib/api/products'
import { ProductGrid } from '@/components/store/listagem/ProductGrid'
import { FilterSidebar } from '@/components/store/listagem/FilterSidebar'

export const metadata: Metadata = {
  title: 'Produtos | Marca',
}

interface Props {
  searchParams: { categoria?: string; tamanho?: string; pagina?: string }
}

export default async function ProductsPage({ searchParams }: Props) {
  const products = await getProducts(searchParams)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <FilterSidebar />
        <ProductGrid products={products} />
      </div>
    </main>
  )
}
```

### Estrutura de API Route (padrão)
```ts
// app/api/produtos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Drizzle ORM } from '@/lib/Drizzle ORM'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    // ... lógica
    return NextResponse.json({ data })
  } catch (error) {
    console.error('[GET /api/produtos]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  // ... lógica
}
```

### Zustand Store (padrão)
```ts
// store/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  variantId: string
  productId: string
  name: string
  image: string
  size: string
  color?: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, qty: number) => void
  clearCart: () => void
  toggleCart: () => void
  get totalItems(): number
  get subtotal(): number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      // ... implementação
    }),
    { name: 'cart-storage' }
  )
)
```

---

## 10. SEO & PERFORMANCE

### SEO
- Metadata dinâmica por página (Next.js Metadata API)
- `generateStaticParams` para páginas de produto e categoria
- `sitemap.ts` gerado dinamicamente
- `robots.ts`
- Open Graph images para produto e home
- Structured data (JSON-LD) para produtos (`Product` schema)
- URLs amigáveis com slug (`/produtos/tenis-runner-branco`)

### Performance
- Imagens: `next/image` com `priority` no hero, lazy nas listagens
- Fontes: `next/font` (sem layout shift)
- Bundle: Server Components por padrão, `"use client"` apenas quando necessário
- Cache: `revalidate` nas páginas de listagem (ISR), dados de produto cacheados
- Skeleton loading em todas as listagens

---

## 11. SEGURANÇA

- Senhas: hash com `bcrypt` (salt rounds: 12)
- Autenticação: JWT via NextAuth — tokens não expostos ao cliente
- Proteção de rotas admin: middleware + verificação de role no server
- Dados sensíveis: apenas em variáveis de ambiente server-side
- Webhooks: validação de assinatura (Stripe + MercadoPago)
- Inputs: validação com Zod em todas as API Routes
- CORS: configurado no `next.config.ts`
- Rate limiting nas rotas de auth (a implementar com Upstash Redis)

---

## 12. FASES DO PROJETO

### Fase 1 — MVP (loja funcional)
- [ ] Setup do projeto (Next.js, Drizzle ORM, NextAuth, Tailwind)
- [ ] Design system base (tokens, componentes UI)
- [ ] Autenticação completa (registro, login, Google, recuperação de senha)
- [ ] Catálogo: home, listagem e página de produto
- [ ] Carrinho (Zustand + localStorage)
- [ ] Checkout completo com Stripe (cartão)
- [ ] Área do cliente (pedidos, endereços)
- [ ] Painel admin: produtos e pedidos
- [ ] Deploy na Vercel

### Fase 2 — Melhorias pós-MVP
- [ ] Integração MercadoPago (PIX + Boleto)
- [ ] Cálculo de frete (Melhor Envio ou Correios)
- [ ] Wishlist / favoritos
- [ ] Busca com filtros avançados (Algolia ou Drizzle ORM full-text)
- [ ] Sistema de cupons e descontos
- [ ] Avaliações de produtos

### Fase 3 — Escala
- [ ] Analytics (GA4 + conversões)
- [ ] Programa de fidelidade
- [ ] Notificações push (restock, promoções)
- [ ] PWA
- [ ] Testes E2E com Playwright

---

## 13. INSTRUÇÕES PARA O CURSOR AI

> Ao trabalhar neste projeto, sempre siga estas diretrizes:

1. **Sempre use TypeScript strict** — sem `any`, tipar tudo explicitamente
2. **Server Components por padrão** — adicione `"use client"` apenas quando precisar de estado/eventos
3. **Zod em toda API Route** — nunca confie em input sem validar
4. **Drizzle ORM transactions** para operações que afetam múltiplas tabelas (ex: criar pedido + baixar estoque)
5. **Tratar erros explicitamente** — sem `catch` vazio, logar com contexto
6. **Componentes pequenos e focados** — máximo ~150 linhas por arquivo
7. **Nomes semânticos** — o código deve se auto-documentar
8. **Acessibilidade** — usar elementos semânticos HTML, `aria-label` quando necessário, navegação por teclado no carrinho e modais
9. **Não duplicar lógica** — extrair para `lib/utils` ou hooks customizados
10. **Checar este arquivo** antes de criar novas estruturas ou tomar decisões arquiteturais

---

*Última atualização: gerado em setup inicial do projeto*