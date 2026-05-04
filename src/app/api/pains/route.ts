import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PainSchema } from '@/lib/validations'
import { uniqueSlug } from '@/lib/slugify'
import { checkRateLimit, submitRateLimit } from '@/lib/rate-limit'
export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const lang = searchParams.get('lang') || 'es'
  const sort = searchParams.get('sort') || 'votes'
  let query = supabase.from('pains').select('*, categories(slug, name_es, name_en, emoji)').eq('status', 'active').eq('lang', lang)
  if (sort === 'recent') query = query.order('created_at', { ascending: false })
  else query = query.order('votes_count', { ascending: false })
  const { data, error } = await query.limit(30)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req, submitRateLimit)
  if (limited) return limited
  const body = await req.json()
  const parsed = PainSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const supabase = createAdminClient()
  const slug = uniqueSlug(parsed.data.title)
  const { data, error } = await supabase.from('pains').insert({ ...parsed.data, slug, status: 'active' }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
