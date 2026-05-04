import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const NOTIFY_EMAIL = 'luis63649085@gmail.com'

export async function POST(req: Request) {
  const body = await req.json()

  // Supabase webhook format
  const email = body?.record?.email || body?.data?.email || 'desconocido'
  const type = body?.type || 'new_user'

  let subject = ''
  let html = ''

  if (type === 'new_pain') {
    subject = '🔴 Nuevo pain en PainBoard'
    html = `<p>Nuevo pain: <strong>${body?.record?.title || ''}</strong></p>`
  } else {
    subject = '🟢 Nuevo usuario en PainBoard'
    html = `<p>Se registró: <strong>${email}</strong></p>`
  }

  await resend.emails.send({
    from: 'PainBoard <onboarding@resend.dev>',
    to: NOTIFY_EMAIL,
    subject,
    html,
  })

  return Response.json({ ok: true })
}
