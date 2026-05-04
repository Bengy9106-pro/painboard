'use client'
import { useState } from 'react'

export default function NewsletterForm({ lang }: { lang: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang })
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'success') return (
    <p className="font-medium" style={{color:'var(--primary)'}}>
      ✓ {lang === 'es' ? '¡Suscrito! Te escribimos el lunes.' : 'Subscribed! See you Monday.'}
    </p>
  )

  return (
    <div>
      <h3 className="font-bold text-lg mb-1">
        📬 {lang === 'es' ? 'Top 5 problemas de la semana' : 'Top 5 problems of the week'}
      </h3>
      <p className="text-sm mb-4" style={{color:'var(--muted-foreground)'}}>
        {lang === 'es' ? 'Cada lunes. Sin spam.' : 'Every Monday. No spam.'}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder={lang === 'es' ? 'tu@email.com' : 'your@email.com'}
          className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none transition-colors"
          style={{background:'var(--card)', borderColor:'var(--border)', color:'var(--foreground)'}}
        />
        <button
          type="submit" disabled={status === 'loading'}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:opacity-90 disabled:opacity-50 shrink-0"
          style={{background:'var(--primary)', color:'var(--primary-foreground)'}}>
          {status === 'loading' ? '...' : (lang === 'es' ? 'Suscribir' : 'Subscribe')}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs mt-2 text-red-500">
          {lang === 'es' ? 'Algo falló, intenta de nuevo.' : 'Something went wrong, try again.'}
        </p>
      )}
    </div>
  )
}
