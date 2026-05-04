'use client'
import { useState } from 'react'
import Link from 'next/link'
import { getFingerprint } from '@/lib/fingerprint'
import { createClient } from '@/lib/supabase/client'

type Pain = {
  id: string; slug: string; title: string; description?: string
  votes_count: number; country_code?: string; is_solved: boolean; created_at: string
  categories?: { slug: string; name_es: string; name_en: string; emoji: string; color: string }
}

const FLAGS: Record<string,string> = {
  US:'🇺🇸',CO:'🇨🇴',MX:'🇲🇽',AR:'🇦🇷',BR:'🇧🇷',ES:'🇪🇸',CL:'🇨🇱',PE:'🇵🇪',
  GB:'🇬🇧',FR:'🇫🇷',DE:'🇩🇪',CA:'🇨🇦',AU:'🇦🇺',IN:'🇮🇳',JP:'🇯🇵',MA:'🇲🇦',
  VE:'🇻🇪',EC:'🇪🇨',CR:'🇨🇷',PA:'🇵🇦',GT:'🇬🇹',HN:'🇭🇳',NI:'🇳🇮',SV:'🇸🇻',
}

function signal(votes: number, date: string) {
  const h = (Date.now() - new Date(date).getTime()) / 3_600_000
  return Math.min(100, Math.round(((votes - 1) / Math.pow(h + 2, 1.8)) * 500))
}

export default function PainCard({ pain, lang, rank }: { pain: Pain; lang: string; rank?: number }) {
  const [votes, setVotes] = useState(pain.votes_count)
  const [voted, setVoted] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const catName = lang === 'es' ? pain.categories?.name_es : pain.categories?.name_en
  const flag = pain.country_code ? (FLAGS[pain.country_code] || '') : ''
  const score = signal(votes, pain.created_at)

  async function handleVote(e: React.MouseEvent) {
    e.preventDefault()
    if (voted || loading) return
    setLoading(true)
    try {
      const fp = await getFingerprint()
      const res = await fetch('/api/vote', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pain_id: pain.id, user_fingerprint: fp }),
      })
      if (res.ok) { setVotes(v => v + 1); setVoted(true) }
    } finally { setLoading(false) }
  }

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault()
    if (saveLoading) return
    setSaveLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = `/${lang}/login`; return }

      if (saved) {
        await supabase.from('bookmarks').delete()
          .eq('user_id', user.id).eq('pain_id', pain.id)
        setSaved(false)
      } else {
        await supabase.from('bookmarks').insert({ user_id: user.id, pain_id: pain.id })
        setSaved(true)
      }
    } finally { setSaveLoading(false) }
  }

  return (
    <Link href={`/${lang}/pain/${pain.slug}`} className="block group">
      <div className={`flex gap-3 px-3 py-3 rounded-xl border transition-all hover:border-foreground/30 hover:bg-muted/30 ${voted ? 'border-primary/40 bg-primary/5' : 'border-border'}`}>
        {/* Upvote */}
        <button onClick={handleVote} disabled={voted || loading}
          className={`flex flex-col items-center justify-start pt-0.5 min-w-[40px] transition-colors ${voted ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill={voted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M12 4l8 8H4z"/></svg>
          <span className="text-sm font-bold mt-0.5">{votes}</span>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5 text-xs text-muted-foreground">
            {pain.categories && <span className="font-medium">{pain.categories.emoji} {catName}</span>}
            {flag && <span>{flag} {pain.country_code}</span>}
            {pain.is_solved && <span className="text-green-600 font-semibold">✓ Solved</span>}
            {score >= 40 && <span className="text-yellow-600">🚨 Market Signal</span>}
          </div>
          <h2 className="font-semibold text-[15px] leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1">{pain.title}</h2>
          {pain.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{pain.description}</p>}
          <div className="flex items-center gap-2">
            {score >= 80 && <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-full">🔴 {score} · High Signal</span>}
            {score >= 40 && score < 80 && <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-full">🟠 {score} · Rising</span>}
          </div>
        </div>

        {/* Right: save + rank */}
        <div className="flex flex-col items-end justify-between shrink-0 gap-2">
          <button onClick={handleSave} disabled={saveLoading}
            aria-label={saved ? 'Unsave' : 'Save'}
            className={`p-1.5 rounded-lg transition-colors ${saved ? 'text-primary' : 'text-muted-foreground hover:text-foreground'} disabled:opacity-40`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          {rank && <div className="text-2xl font-black text-muted-foreground/20">#{rank}</div>}
        </div>
      </div>
    </Link>
  )
}
