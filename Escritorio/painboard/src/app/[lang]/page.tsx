import { createClient } from '@/lib/supabase/server'
import PainList from '@/components/pain-list'
import NewsletterForm from '@/components/newsletter-form'

export default async function HomePage({ params, searchParams }: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ category?: string; sort?: string }>
}) {
  const { lang } = await params
  const { category, sort = 'trending' } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('pains')
    .select('*, categories(id, slug, name_es, name_en, emoji, color)')
    .eq('status', 'active')

  if (category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (sort === 'recent') query = query.order('created_at', { ascending: false })
  else query = query.order('votes_count', { ascending: false })

  const { data: pains } = await query.limit(30)
  const { data: categories } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order')

  const totalVotes = pains?.reduce((s, p) => s + (p.votes_count || 0), 0) || 0
  const countries = new Set(pains?.map((p: any) => p.country_code).filter(Boolean)).size

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <section className="mb-14">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary/70 mb-4">painboard.site</span>
        <h1 className="text-5xl font-black tracking-tight leading-none mb-5 max-w-2xl">
          {lang === 'es'
            ? <span>Lo que realmente <span className="text-primary">le jode</span> a la gente</span>
            : <span>What actually <span className="text-primary">pisses people off</span></span>}
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-8">
          {lang === 'es'
            ? 'No ideas. No tendencias. Solo problemas reales, enviados y votados por humanos.'
            : 'Not ideas. Not trends. Just stuff that genuinely sucks, submitted by humans, voted by humans.'}
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <a href={`/${lang}/submit`} className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm">
            {lang === 'es' ? '💢 Reportar un problema' : '💢 Drop a pain'}
          </a>
          <a href="#explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {lang === 'es' ? 'o solo explorar →' : 'or just lurk →'}
          </a>
        </div>
        <div className="flex gap-6 mt-8 flex-wrap">
          <div className="text-sm text-muted-foreground"><span className="text-foreground font-bold text-base">{pains?.length || 0}</span> {lang === 'es' ? 'problemas' : 'pains'}</div>
          <div className="text-sm text-muted-foreground"><span className="text-foreground font-bold text-base">{countries}</span> {lang === 'es' ? 'países' : 'countries'}</div>
          <div className="text-sm text-muted-foreground"><span className="text-foreground font-bold text-base">{totalVotes.toLocaleString()}</span> {lang === 'es' ? 'votos' : 'upvotes'}</div>
        </div>
      </section>
      <div id="explore">
        <PainList pains={pains || []} categories={categories || []} lang={lang} currentSort={sort} currentCategory={category} />
      </div>
      <section className="mt-20 border rounded-2xl p-8 text-center" style={{background:'var(--card)',borderColor:'var(--border)'}}>
        <NewsletterForm lang={lang} />
      </section>
    </div>
  )
}
