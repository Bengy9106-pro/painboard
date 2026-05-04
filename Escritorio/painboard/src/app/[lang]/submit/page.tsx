import { createClient } from '@/lib/supabase/server'
import PainForm from '@/components/pain-form'

export default async function SubmitPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const supabase = await createClient()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, slug, name_es, name_en, emoji, color, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  console.log('categories loaded:', categories?.length, error)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-10">
        <a href={`/${lang}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 block">
          ← {lang === 'es' ? 'Volver' : 'Back'}
        </a>
        <h1 className="text-4xl font-black mb-3">
          {lang === 'es' ? '💢 Reporta un problema' : '💢 Drop a pain'}
        </h1>
        <p className="text-muted-foreground">
          {lang === 'es' ? 'Anónimo. Sin registro. Sin tracking.' : 'Anonymous. No sign-up. No tracking.'}
        </p>
      </div>
      <PainForm categories={categories ?? []} lang={lang} />
    </div>
  )
}
