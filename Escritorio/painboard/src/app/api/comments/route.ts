import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const Schema = z.object({
  pain_id: z.string().uuid(),
  content: z.string().min(2).max(500).trim(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  const supabase = createAdminClient()
  const { error } = await supabase.from('comments').insert({
    pain_id: parsed.data.pain_id,
    content: parsed.data.content,
    is_anonymous: true,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
