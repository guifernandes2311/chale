import type { Page } from '@playwright/test'

const CART_STORAGE_KEY = 'chale-cart-storage'

export async function seedCart(page: Page) {
  await page.addInitScript((key) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        state: {
          items: [
            {
              variantId: 'e2e-variant-1',
              productId: 'e2e-product-1',
              name: 'Produto E2E',
              image: '/placeholder.png',
              size: '38',
              color: 'Preto',
              price: 199.9,
              quantity: 1,
            },
          ],
          isOpen: false,
        },
        version: 0,
      })
    )
  }, CART_STORAGE_KEY)
}
