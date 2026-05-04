import { z } from 'zod'
export const PainSchema = z.object({
  title: z.string().min(10).max(150).trim(),
  description: z.string().max(1000).optional(),
  lang: z.enum(['es', 'en']),
  category_id: z.string().uuid(),
  country_code: z.string().length(2).toUpperCase().optional(),
})
export const VoteSchema = z.object({
  pain_id: z.string().uuid(),
  user_fingerprint: z.string().min(1),
})
export const SubscribeSchema = z.object({
  email: z.string().email(),
  lang: z.enum(['es', 'en']).default('es'),
  country_code: z.string().length(2).optional(),
})
