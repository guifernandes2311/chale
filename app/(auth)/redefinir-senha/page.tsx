'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirmPassword }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Erro ao redefinir senha')
      return
    }

    router.push('/login')
  }

  if (!token) {
    return <p className="text-center text-sm text-error">Link inválido.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="password">Nova senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1"
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1"
          required
        />
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : 'Redefinir senha'}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Nova senha</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense>
          <ResetForm />
        </Suspense>
        <p className="mt-4 text-center text-sm">
          <Link href="/login" className="text-accent hover:underline">
            Voltar ao login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
