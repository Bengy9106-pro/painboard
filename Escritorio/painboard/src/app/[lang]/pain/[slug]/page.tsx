import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PainCard from '@/components/pain-card'
import CommentForm from '@/components/comment-form'

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('pains').select('title, description').eq('slug', slug).single()
  if (!data) return { title: 'Not found' }
  return { title: data.title, description: data.description || data.title }
}

export default async function PainPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const supabase = await createClient()
  const { data: pain } = await supabase
    .from('pains')
    .select('*, categories(slug, name_es, name_en, emoji, color)')
    .eq('slug', slug)
    .in('status', ['active', 'featured'])
    .single()
  if (!pain) notFound()
  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('pain_id', pain.id)
    .order('created_at', { ascending: true })
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <a href={`/${lang}`} className="text-xs text-muted-foreground hover:text-foreground mb-6 block">
        ← {lang === 'es' ? 'Volver' : 'Back'}
      </a>
      <PainCard pain={pain} lang={lang} />
      <section className="mt-10">
        <h2 className="font-bold text-lg mb-6">
          💬 {lang === 'es' ? 'Comentarios' : 'Comments'} ({comments?.length || 0})
        </h2>
        <CommentForm painId={pain.id} lang={lang} />
        <div className="flex flex-col gap-3 mt-6">
          {(!comments || comments.length === 0) && (
            <p className="text-muted-foreground text-sm py-4">
              {lang === 'es' ? 'Sin comentarios todavía. Sé el primero.' : 'No comments yet. Be the first.'}
            </p>
          )}
          {comments?.map(c => (
            <div key={c.id} className="border rounded-xl p-4 bg-muted/20">
              <p className="text-sm leading-relaxed">{c.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(c.created_at).toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
