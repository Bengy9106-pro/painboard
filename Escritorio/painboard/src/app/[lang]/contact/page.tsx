export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; const isEs = lang==='es'
  const contacts = [['✉️',isEs?'Email general':'General email','hello@painboard.site'],['🚨',isEs?'Reportar contenido':'Report content','abuse@painboard.site'],['💼','Partnerships','sponsor@painboard.site']]
  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black mb-3">{isEs?'Contacto':'Contact'}</h1>
      <p className="mb-8 text-[15px]" style={{color:'var(--muted-foreground)'}}>{isEs?'¿Pregunta, bug o colaboración?':'Question, bug, or collaboration?'}</p>
      <div className="space-y-3">
        {contacts.map(([emoji,label,email])=>(
          <div key={email} className="rounded-xl border p-5 flex gap-4 items-start" style={{background:'var(--card)',borderColor:'var(--border)'}}>
            <span className="text-2xl">{emoji}</span>
            <div><p className="font-semibold text-sm mb-0.5">{label}</p><a href={`mailto:${email}`} className="text-sm hover:underline" style={{color:'var(--primary)'}}>{email}</a></div>
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-8" style={{color:'var(--muted-foreground)'}}>{isEs?'Respondemos en 24–48h.':'We reply within 24–48h.'}</p>
    </div>
  )
}
