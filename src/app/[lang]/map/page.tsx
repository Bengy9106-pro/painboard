import { createClient } from '@/lib/supabase/server'
import WorldMap from '@/components/world-map'

export default async function MapPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('pains').select('country_code,votes_count').eq('status','active')
  const stats: Record<string,{pains:number;votes:number}> = {}
  for (const p of data||[]) {
    if (!p.country_code) continue
    if (!stats[p.country_code]) stats[p.country_code]={pains:0,votes:0}
    stats[p.country_code].pains++
    stats[p.country_code].votes += p.votes_count||0
  }
  const top = Object.entries(stats).sort((a,b)=>b[1].votes-a[1].votes).slice(0,15)
  const maxP = Math.max(...top.map(([,s])=>s.pains),1)
  const isEs = lang==='es'

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-2">🗺️ {isEs?'Mapa mundial':'World map'}</h1>
      <p className="mb-10" style={{color:'var(--muted-foreground)'}}>
        {isEs?'Dónde duele más el mundo.':'Where the world hurts most.'}
      </p>

      {/* Mapa SVG interactivo */}
      <div className="rounded-2xl border overflow-hidden mb-10" style={{background:'var(--card)',borderColor:'var(--border)'}}>
        <WorldMap stats={stats} lang={lang} />
      </div>

      {/* Ranking */}
      {top.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-4">🏆 {isEs?'Países con más problemas':'Countries with most pains'}</h2>
          <div className="rounded-xl border overflow-hidden" style={{borderColor:'var(--border)'}}>
            {top.map(([code,s],i)=>(
              <div key={code} className="flex items-center gap-4 px-4 py-3 border-b last:border-0 transition-colors hover:opacity-80"
                style={{borderColor:'var(--border)',background: i===0?'var(--muted)':undefined}}>
                <span className="font-mono text-sm w-5" style={{color:'var(--muted-foreground)'}}>{i+1}</span>
                <span className="font-bold text-sm w-8">{code}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{background:'var(--muted)'}}>
                  <div className="h-full rounded-full transition-all" style={{width:`${(s.pains/maxP)*100}%`,background:'var(--primary)'}}/>
                </div>
                <span className="text-xs w-16 text-right" style={{color:'var(--muted-foreground)'}}>{s.pains} {isEs?'prob.':'pains'}</span>
                <span className="text-xs font-semibold" style={{color:'var(--primary)'}}>↑ {s.votes}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
