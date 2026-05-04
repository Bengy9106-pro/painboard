import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  // Verificar que viene de Supabase
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const email = body?.record?.email
  const lang = body?.record?.raw_user_meta_data?.lang || 'en'
  const isEs = lang === 'es'

  if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

  try {
    await resend.emails.send({
      from: 'PainBoard <hello@painboard.site>',
      to: email,
      subject: isEs ? '👋 Bienvenido a PainBoard' : '👋 Welcome to PainBoard',
      html: isEs ? `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 16px">
          <h2 style="font-size:24px;font-weight:900;margin-bottom:8px">Bienvenido a PainBoard 🎯</h2>
          <p style="color:#666;margin-bottom:24px">Ya puedes reportar pains, votar y explorar el mapa global de problemas reales.</p>
          <p style="color:#666;margin-bottom:24px">Cuando lleguemos a <strong>500 pains</strong>, activamos los planes Pro.</p>
          <a href="https://painboard.site/es" style="background:#e11d48;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Ver PainBoard →</a>
          <p style="color:#aaa;font-size:12px;margin-top:32px">PainBoard · <a href="https://painboard.site/es/privacy" style="color:#aaa">Privacidad</a></p>
        </div>
      ` : `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 16px">
          <h2 style="font-size:24px;font-weight:900;margin-bottom:8px">Welcome to PainBoard 🎯</h2>
          <p style="color:#666;margin-bottom:24px">You can now submit pains, vote, and explore the global map of real problems.</p>
          <p style="color:#666;margin-bottom:24px">When we hit <strong>500 pains</strong>, Pro plans go live.</p>
          <a href="https://painboard.site/en" style="background:#e11d48;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Visit PainBoard →</a>
          <p style="color:#aaa;font-size:12px;margin-top:32px">PainBoard · <a href="https://painboard.site/en/privacy" style="color:#aaa">Privacy</a></p>
        </div>
      `,
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
