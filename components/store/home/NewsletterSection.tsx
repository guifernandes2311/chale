'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export function NewsletterSection() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    toast({ title: 'Inscrição realizada!', description: 'Você receberá nossas novidades em breve.' })
    setEmail('')
  }

  return (
    <section className="bg-primary py-12 text-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-2xl font-semibold">Receba nossas novidades</h2>
        <p className="mt-2 text-sm text-secondary/80">
          Cadastre-se e fique por dentro de lançamentos e promoções exclusivas.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md gap-2">
          <Input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-primary"
            required
          />
          <Button type="submit" variant="accent">
            Inscrever
          </Button>
        </form>
      </div>
    </section>
  )
}
