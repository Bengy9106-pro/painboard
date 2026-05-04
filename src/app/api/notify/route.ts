import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const NOTIFY_EMAIL = 'luis63649085@gmail.com'

export async function POST(req: Request) {
  const { type, data } = await req.json()

  let subject = ''
  let html = ''

  if (type === 'new_user') {
    subject = '🟢 Nuevo usuario en PainBoard'
    html = `<p>Se registró un nuevo usuario:</p><p><strong>${data.email}</strong></p>`
  } else if (type === 'new_pain') {
    subject = '🔴 Nuevo pain agregado en PainBoard'
    html = `<p>Se agregó un nuevo pain:</p><p><strong>${data.title}</strong></p><p>Por: ${data.user_email || 'anónimo'}</p>`
  }

  await resend.emails.send({
    from: 'PainBoard <onboarding@resend.dev>',
    to: NOTIFY_EMAIL,
    subject,
    html,
  })

  return Response.json({ ok: true })
}
