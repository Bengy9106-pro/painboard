import { NextRequest, NextResponse } from 'next/server'
import Filter from 'bad-words-es'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

const filter = new Filter({ languages: ['es', 'en'] })

const extraBlocked = [
  'puta', 'puto', 'mierda', 'gonorrea', 'marica', 'hpta', 'verga', 
  'coño', 'polla', 'fuck', 'bitch', 'asshole', 'shit', 'nigger', 'cunt', 'faggot'
]

filter.addWords(...extraBlocked)

const urlRegex = /(https?:\/\/|www\.[a-z0-9-]+\.(com|net|org|io|co|gg|xyz|me|tv|ly|ru|cn|info|biz|app|dev|ai|to|sh|fm|us|uk|es|mx|ar|cl|pe|ve|ec|pa|do|pt))(\/\S*)?/i

function getClientIp(req: NextRequest) {
  const xff = req.headers.get('x-forwarded-for')
  const real = req.headers.get('x-real-ip')
  return (xff?.split(',')[0] || real || 'unknown').trim()
}

function hashIp(ip: string) {
  return crypto.createHash('sha256').update(ip).digest('hex')
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function hasProfanity(text: string) {
  return filter.isProfane(text)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const ip = getClientIp(req)
    const ipHash = hashIp(ip)

    const body = await req.json()
    const { title, description, category_id, country_code, lang } = body

    if (!title || title.length < 10 || title.length > 150) {
      return NextResponse.json({ error: 'Título inválido (10-150 caracteres)' }, { status: 400 })
    }

    const titleClean = normalizeText(title)
    const descClean = normalizeText(description || '')

    if (urlRegex.test(titleClean) || urlRegex.test(descClean)) {
      return NextResponse.json({ error: 'Links no permitidos' }, { status: 400 })
    }

    const baseSlug = slugify(titleClean)
    const uniqueSlug = `${baseSlug}-${Date.now()}`

    // Rate limit
    const { data: recentLogs } = await supabase
      .from('submission_logs')
      .select('id')
      .eq('ip_hash', ipHash)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .limit(3)

    if ((recentLogs?.length || 0) >= 3) {
      return NextResponse.json({ error: 'Demasiados envíos desde esta IP' }, { status: 429 })
    }

    // Insert pain
    const { error: painError } = await supabase
      .from('pains')
      .insert({
        slug: uniqueSlug,
        title: titleClean,
        description: descClean || null,
        lang: lang || 'es',
        category_id: category_id || null,
        country_code: country_code || null,
        status: 'pending',
        contains_link: false,
        abuse_reports_count: 0,
        moderation_reason: null,
        submitter_ip_hash: ipHash,
        flagged_terms: []
      })

    if (painError) {
      return NextResponse.json({ error: painError.message }, { status: 500 })
    }

    // Log submission
    await supabase.from('submission_logs').insert({
      ip_hash: ipHash,
      action: 'submit_pain'
    })

    return NextResponse.json({ success: true, slug: uniqueSlug }, { status: 201 })
  } catch (error) {
    console.error('POST /api/pains error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('pains')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/pains error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
