'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCartStore } from '@/store/cartStore'
import { CartItemRow } from './CartItem'
import { CartSummary } from './CartSummary'

export function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, subtotal } = useCartStore()

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Carrinho ({items.length})</SheetTitle>
        </SheetHeader>

        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <p className="text-muted">Seu carrinho está vazio</p>
              <Link
                href="/produtos"
                className="mt-4 text-sm text-accent hover:underline"
                onClick={() => toggleCart(false)}
              >
                Ver produtos
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto">
                {items.map((item) => (
                  <CartItemRow
                    key={item.variantId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
              <CartSummary subtotal={subtotal()} onClose={() => toggleCart(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  )
}
