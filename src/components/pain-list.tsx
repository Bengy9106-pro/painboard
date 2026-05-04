'use client'
import { useRouter } from 'next/navigation'
import PainCard from './pain-card'
type Category = { id: string; slug: string; name_es: string; name_en: string; emoji: string }
export default function PainList({ pains, categories, lang, currentSort, currentCategory }: {
  pains: any[]; categories: Category[]; lang: string; currentSort?: string; currentCategory?: string
}) {
  const router = useRouter()
  function setFilter(key: string, value: string | undefined) {
    const params = new URLSearchParams()
    if (key !== 'sort' && currentSort) params.set('sort', currentSort)
    if (key !== 'category' && currentCategory) params.set('category', currentCategory)
    if (value) params.set(key, value)
    router.push(`/${lang}?${params.toString()}`)
  }
  return (
    <div>
      <div className="flex items-center gap-1 mb-4 border-b pb-4">
        <button onClick={() => setFilter('sort', 'trending')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentSort !== 'recent' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
          🔥 {lang === 'es' ? 'Tendencias' : 'Trending'}
        </button>
        <button onClick={() => setFilter('sort', 'recent')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentSort === 'recent' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
          🕐 {lang === 'es' ? 'Recientes' : 'Recent'}
        </button>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter('category', undefined)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${!currentCategory ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'}`}>
          {lang === 'es' ? 'Todos' : 'All'}
        </button>
        {categories.map(cat => (
          <button key={cat.slug} onClick={() => setFilter('category', currentCategory === cat.slug ? undefined : cat.slug)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${currentCategory === cat.slug ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'}`}>
            {cat.emoji} {lang === 'es' ? cat.name_es : cat.name_en}
          </button>
        ))}
      </div>
      {pains.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-5xl mb-4">👀</p>
          <p className="font-semibold text-lg">{lang === 'es' ? 'Nada aquí todavía' : 'Nothing here yet'}</p>
          <a href={`/${lang}/submit`} className="text-sm text-primary hover:underline mt-3 block">{lang === 'es' ? '→ Sé el primero' : '→ Be the first'}</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {pains.map((pain: any) => <PainCard key={pain.id} pain={pain} lang={lang} />)}
        </div>
      )}
    </div>
  )
}
