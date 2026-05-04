import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { SubscribeSchema } from '@/lib/validations'
export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = SubscribeSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  const supabase = createAdminClient()
  const { error } = await supabase.from('subscribers').insert({ email: parsed.data.email, lang: parsed.data.lang })
  if (error) {
    if (error.code === '23505') return NextResponse.json({ message: 'Already subscribed' })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true }, { status: 201 })
}
