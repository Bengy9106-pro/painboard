import { createClient } from '@/lib/supabase/server'
import PainCard from '@/components/pain-card'
export default async function TrendingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const supabase = await createClient()
  const { data: pains } = await supabase.from('pains').select('*, categories(id,slug,name_es,name_en,emoji,color)').eq('status','active').order('votes_count',{ascending:false}).limit(25)
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-2">🔥 {lang==='es'?'Tendencias':'Trending'}</h1>
      <p className="mb-10" style={{color:'var(--muted-foreground)'}}>{lang==='es'?'Los problemas más votados esta semana.':'Top voted problems this week.'}</p>
      {pains && pains.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-10">
          {['🥇','🥈','🥉'].map((medal,i) => (
            <a key={pains[i].id} href={`/${lang}/pain/${pains[i].slug}`}
              className="rounded-2xl border p-4 hover:border-foreground/30 transition-all"
              style={{background:'var(--card)',borderColor:'var(--border)'}}>
              <div className="text-3xl mb-2">{medal}</div>
              <div className="text-xs mb-1" style={{color:'var(--muted-foreground)'}}>{pains[i].categories?.emoji} {lang==='es'?pains[i].categories?.name_es:pains[i].categories?.name_en}</div>
              <p className="font-semibold text-sm leading-snug line-clamp-3">{pains[i].title}</p>
              <div className="mt-3 text-xs font-bold" style={{color:'var(--primary)'}}>↑ {pains[i].votes_count}</div>
            </a>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2">{(pains||[]).slice(3).map((p:any,i:number)=><PainCard key={p.id} pain={p} lang={lang} rank={i+4}/>)}</div>
    </div>
  )
}
