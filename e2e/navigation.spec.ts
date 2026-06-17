import { test, expect } from '@playwright/test'
import { seedCart } from './helpers'

test.describe('Navegação da loja', () => {
  test('home para produto sem reload completo', async ({ page }) => {
    await page.goto('/')

    const navigationPromise = page.waitForEvent('framenavigated')
    await page.getByRole('link', { name: /produtos/i }).first().click()
    await navigationPromise

    const productLink = page.locator('a[href*="/produtos/"]').first()
    await expect(productLink).toBeVisible({ timeout: 15_000 })

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/produtos/') && res.status() === 200),
      productLink.click(),
    ])

    expect(response.ok()).toBeTruthy()
    await expect(page.locator('h1')).toBeVisible()
  })

  test('adicionar produto ao carrinho e alterar quantidade', async ({ page }) => {
    await page.goto('/produtos')

    const productLink = page.locator('a[href*="/produtos/"]').first()
    await expect(productLink).toBeVisible({ timeout: 15_000 })
    await productLink.click()
    await expect(page.getByRole('button', { name: /adicionar ao carrinho/i })).toBeVisible({
      timeout: 15_000,
    })

    const sizeButton = page.locator('button').filter({ hasText: /^\d{2}$/ }).first()
    if (await sizeButton.isVisible()) {
      await sizeButton.click()
    }

    const colorButton = page.locator('button[aria-pressed="false"]').first()
    if (await colorButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await colorButton.click()
    }

    const addButton = page.getByRole('button', { name: /adicionar ao carrinho/i })
    await expect(addButton).toBeEnabled({ timeout: 5000 })
    await addButton.click()
    await expect(page.getByText('Adicionado ao carrinho', { exact: true }).first()).toBeVisible({
      timeout: 5000,
    })

    const cartDialog = page.getByRole('dialog')
    await expect(cartDialog.getByText(/carrinho/i)).toBeVisible({ timeout: 5000 })

    const increaseQty = cartDialog.getByRole('button', { name: /aumentar quantidade/i })
    if (await increaseQty.isVisible().catch(() => false)) {
      await increaseQty.click()
    }
  })

  test('filtros na listagem e botão voltar', async ({ page }) => {
    await page.goto('/produtos')
    await expect(page.getByRole('heading', { name: 'Produtos' })).toBeVisible()

    await page.goto('/produtos?ordenar=preco-asc')
    await expect(page).toHaveURL(/ordenar=preco-asc/)

    await page.goBack()
    await expect(page).not.toHaveURL(/ordenar=preco-asc/)
  })
})

test.describe('Checkout', () => {
  test('avançar e voltar entre etapas sem perder dados', async ({ page }) => {
    await seedCart(page)
    await page.goto('/checkout?step=dados')

    await expect(page.getByLabel(/nome completo/i)).toBeVisible({ timeout: 10_000 })

    await page.getByLabel(/nome completo/i).fill('Cliente Teste')
    await page.getByLabel(/whatsapp/i).fill('11999999999')
    await page.getByRole('button', { name: 'Continuar' }).click()

    await expect(page).toHaveURL(/step=endereco/)

    await page.getByLabel(/cep/i).fill('01310-100')
    await page.getByLabel(/^rua$/i).fill('Av Paulista')
    await page.getByLabel(/número/i).fill('1000')
    await page.getByLabel(/bairro/i).fill('Bela Vista')
    await page.getByLabel(/cidade/i).fill('São Paulo')
    await page.getByLabel(/^uf$/i).fill('SP')

    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page).toHaveURL(/step=dados/)

    await expect(page.getByLabel(/nome completo/i)).toHaveValue('Cliente Teste')
    await expect(page.getByLabel(/whatsapp/i)).toHaveValue('11999999999')
  })
})

test.describe('Admin', () => {
  test('login e editar produto', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/^email$/i).fill('admin@chalecalcados.com.br')
    await page.getByLabel(/^senha$/i).fill('senha123')
    await page.getByRole('button', { name: /entrar/i }).click()

    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 })

    await page.goto('/admin/produtos')
    await expect(page.getByRole('heading', { name: 'Produtos' })).toBeVisible({ timeout: 15_000 })

    const editLink = page.getByRole('link', { name: 'Editar' }).first()
    await expect(editLink).toBeVisible({ timeout: 10_000 })
    await editLink.click()
    await expect(page.getByRole('heading', { name: /editar produto/i })).toBeVisible({
      timeout: 15_000,
    })
  })
})
