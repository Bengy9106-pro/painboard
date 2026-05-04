'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { getCountryFromIP } from '@/lib/geo'
type Category = { id: string; slug: string; name_es: string; name_en: string; emoji: string }
export default function PainForm({ categories, lang }: { categories: Category[]; lang: string }) {
  const [form, setForm] = useState({ title: '', description: '', category_id: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [error, setError] = useState('')
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.category_id) { setError(lang === 'es' ? 'Selecciona una categoría' : 'Select a category'); return }
    setStatus('loading'); setError('')
    try {
      const country = await getCountryFromIP() || ''
      const res = await fetch('/api/pains', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang, country_code: country }),
      })
      const data = await res.json()
      if (!res.ok) { setError(typeof data.error === 'string' ? data.error : 'Error'); setStatus('error'); return }
      setStatus('success')
    } catch { setStatus('error'); setError(lang === 'es' ? 'Error al publicar.' : 'Error publishing.') }
  }
  if (status === 'success') return (
    <div className="text-center py-16">
      <p className="text-5xl mb-4">✅</p>
      <h2 className="text-2xl font-bold mb-2">{lang === 'es' ? '¡Publicado!' : 'Published!'}</h2>
      <p className="text-muted-foreground mb-8">{lang === 'es' ? 'Tu problema fue enviado.' : 'Your pain was submitted.'}</p>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => { setForm({ title: '', description: '', category_id: '' }); setStatus('idle') }}>
          {lang === 'es' ? 'Reportar otro' : 'Report another'}
        </Button>
        <a href={`/${lang}`}><Button>{lang === 'es' ? 'Ver todos' : 'Browse all'}</Button></a>
      </div>
    </div>
  )
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-3">{lang === 'es' ? 'Categoría *' : 'Category *'}</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {categories.map(cat => (
            <button key={cat.id} type="button" onClick={() => setForm(f => ({ ...f, category_id: cat.id }))}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all text-xs font-medium cursor-pointer ${form.category_id === cat.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground'}`}>
              <span className="text-2xl">{cat.emoji}</span>
              <span className="leading-tight">{lang === 'es' ? cat.name_es : cat.name_en}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">{lang === 'es' ? '¿Cuál es el problema? *' : 'What is the problem? *'}</label>
        <Textarea
          placeholder={lang === 'es' ? 'Ej: Los bancos te congelan la cuenta por mover tu propio dinero' : 'E.g: Banks freeze your account for moving your own money'}
          value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          required minLength={10} maxLength={150} rows={3} className="resize-none text-base" />
        <p className="text-xs mt-1 text-right text-muted-foreground">{form.title.length}/150</p>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">{lang === 'es' ? 'Más contexto (opcional)' : 'More context (optional)'}</label>
        <Textarea
          placeholder={lang === 'es' ? 'Cuanto más específico, más útil para quien quiera resolverlo.' : 'The more specific, the more useful for anyone trying to solve it.'}
          value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          maxLength={1000} rows={4} className="resize-none" />
      </div>
      {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-lg border border-red-200 dark:border-red-900">⚠️ {error}</div>}
      <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={status === 'loading'}>
        {status === 'loading' ? '⏳ ...' : (lang === 'es' ? '💢 Publicar (anónimo)' : '💢 Publish (anonymous)')}
      </Button>
      <p className="text-xs text-center text-muted-foreground">🔒 {lang === 'es' ? '100% anónimo · Sin registro' : '100% anonymous · No sign-up'}</p>
    </form>
  )
}
