const CHECKOUT_DRAFT_KEY = 'chale-checkout-draft'

export interface CheckoutDraft {
  step: number
  customer: Record<string, string>
  address: Record<string, string | boolean>
  shipping: { id: string; name: string; company: string; price: number } | null
}

export function loadCheckoutDraft(): CheckoutDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CheckoutDraft
  } catch {
    return null
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft))
}

export function clearCheckoutDraft() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(CHECKOUT_DRAFT_KEY)
}

export const STEP_SLUGS = ['dados', 'endereco', 'frete', 'whatsapp', 'confirmacao'] as const

export function stepFromSlug(slug: string | null): number {
  if (!slug) return 0
  const idx = STEP_SLUGS.indexOf(slug as (typeof STEP_SLUGS)[number])
  return idx >= 0 ? idx : 0
}

export function slugFromStep(step: number): string {
  return STEP_SLUGS[Math.min(step, STEP_SLUGS.length - 1)] ?? 'dados'
}
