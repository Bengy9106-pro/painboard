import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'
const redis = Redis.fromEnv()
export const voteRateLimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 m') })
export const submitRateLimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 h') })
export async function checkRateLimit(req: NextRequest, limiter: Ratelimit): Promise<NextResponse | null> {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success, remaining } = await limiter.limit(ip)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'X-RateLimit-Remaining': String(remaining) } })
  return null
}
