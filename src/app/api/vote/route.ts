import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { VoteSchema } from '@/lib/validations'
import { checkRateLimit, voteRateLimit } from '@/lib/rate-limit'
export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req, voteRateLimit)
  if (limited) return limited
  const body = await req.json()
  const parsed = VoteSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  const supabase = createAdminClient()
  const { error } = await supabase.from('votes').insert({ pain_id: parsed.data.pain_id, user_fingerprint: parsed.data.user_fingerprint })
  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Already voted' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true }, { status: 201 })
}
