'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function CommentForm({ painId, lang }: { painId: string; lang: string }) {
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pain_id: painId, content: content.trim() }),
      })
      if (res.ok) {
        setContent('')
        setStatus('success')
        setTimeout(() => { setStatus('idle'); window.location.reload() }, 800)
      } else {
        setStatus('error')
      }
    } catch { setStatus('error') }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder={lang === 'es' ? 'Agrega tu opinión (anónimo)...' : 'Add your take (anonymous)...'}
        value={content}
        onChange={e => setContent(e.target.value)}
        required minLength={2} maxLength={500}
        rows={3} className="resize-none"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          🔒 {lang === 'es' ? 'Anónimo' : 'Anonymous'}
        </p>
        <Button type="submit" size="sm" disabled={status === 'loading' || !content.trim()}>
          {status === 'loading' ? '...' : status === 'success' ? '✓' : (lang === 'es' ? 'Comentar' : 'Comment')}
        </Button>
      </div>
    </form>
  )
}
