import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PainCard from '@/components/pain-card'

export default async function SavedPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('pain_id, pains(*, categories(id, slug, name_es, name_en, emoji, color))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const pains = bookmarks?.map((b: any) => b.pains).filter(Boolean) || []
  const isEs = lang === 'es'

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2">
        {isEs ? '🔖 Guardados' : '🔖 Saved'}
      </h1>
      <p className="text-sm mb-10" style={{color:'var(--muted-foreground)'}}>
        {isEs ? 'Los pains que guardaste.' : 'Pains you bookmarked.'}
      </p>

      {pains.length === 0 ? (
        <div className="text-center py-20" style={{color:'var(--muted-foreground)'}}>
          <p className="text-5xl mb-4">🔖</p>
          <p className="font-semibold text-lg mb-2">{isEs ? 'Nada guardado aún' : 'Nothing saved yet'}</p>
          <a href={`/${lang}`} className="text-sm hover:underline" style={{color:'var(--primary)'}}>
            {isEs ? '→ Explorar pains' : '→ Browse pains'}
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {pains.map((pain: any) => <PainCard key={pain.id} pain={pain} lang={lang} />)}
        </div>
      )}
    </div>
  )
}
