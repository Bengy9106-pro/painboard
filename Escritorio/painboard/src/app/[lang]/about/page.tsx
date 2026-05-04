import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'es' ? 'Acerca de PainBoard — El mapa de problemas reales del mundo' : 'About PainBoard — The world\'s real problem map',
    description: lang === 'es'
      ? 'PainBoard es una plataforma anónima donde personas de todo el mundo reportan y votan sus frustraciones reales. Sin filtros, sin tendencias inventadas.'
      : 'PainBoard is an anonymous platform where people worldwide report and vote on their real frustrations. No filters, no made-up trends.',
    alternates: { canonical: `https://painboard.site/${lang}/about` },
    openGraph: {
      title: lang === 'es' ? 'Acerca de PainBoard' : 'About PainBoard',
      description: lang === 'es' ? 'El mapa colectivo de problemas reales del mundo.' : 'The collective map of the world\'s real problems.',
      url: `https://painboard.site/${lang}/about`,
      siteName: 'PainBoard',
      type: 'website',
    },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isEs = lang === 'es'

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'PainBoard',
        url: 'https://painboard.site',
        description: isEs ? 'Mapa colectivo de problemas reales del mundo' : 'Collective map of the world\'s real problems',
        inLanguage: lang,
      })}} />

      <h1 className="text-4xl font-black mb-4">{isEs ? 'Acerca de PainBoard' : 'About PainBoard'}</h1>
      <p className="text-xs mb-10" style={{color:'var(--muted-foreground)'}}>{isEs ? 'La base de datos más honesta de problemas sin resolver.' : 'The most honest database of unsolved problems.'}</p>

      <div className="space-y-6 text-[15px] leading-relaxed" style={{color:'var(--muted-foreground)'}}>
        <p className="text-lg font-medium" style={{color:'var(--foreground)'}}>
          {isEs ? 'PainBoard es un mapa colectivo de los problemas reales del mundo.' : 'PainBoard is a collective map of the world\'s real problems.'}
        </p>
        <p>
          {isEs
            ? 'No son ideas de startup ni tendencias de Twitter. Son frustraciones genuinas, reportadas de forma anónima por personas de todo el mundo — desde problemas cotidianos hasta fallos sistémicos que nadie ha resuelto.'
            : 'Not startup ideas or Twitter trends. Genuine frustrations, anonymously reported by people worldwide — from everyday annoyances to systemic failures nobody has fixed yet.'}
        </p>
        <p>
          {isEs
            ? 'El objetivo es crear la base de datos pública más honesta de problemas sin resolver, para que founders, investigadores y equipos de producto encuentren lo que el mundo realmente necesita — no lo que suena bien en un pitch deck.'
            : 'The goal is to build the most honest public database of unsolved problems, so founders, researchers, and product teams can find what the world actually needs — not what sounds good in a pitch deck.'}
        </p>

        <div className="rounded-xl p-5 space-y-3" style={{background:'var(--card)', border:'1px solid var(--border)'}}>
          <h2 className="font-bold text-base mb-3" style={{color:'var(--foreground)'}}>{isEs ? '¿Cómo funciona?' : 'How it works'}</h2>
          {(isEs ? [
            ['💢', 'Alguien reporta un problema real de forma anónima, sin registro.'],
            ['🔥', 'La comunidad vota los problemas que más les afectan.'],
            ['📊', 'Los pains con más señal y velocidad de votos aparecen primero.'],
            ['🗺️', 'El mapa mundial muestra dónde duele más cada categoría.'],
            ['⚡', 'Los usuarios Pro acceden a señales de mercado y datos exportables.'],
          ] : [
            ['💢', 'Someone reports a real problem anonymously, no sign-up needed.'],
            ['🔥', 'The community votes on what affects them most.'],
            ['📊', 'High-signal pains with fast vote velocity surface to the top.'],
            ['🗺️', 'The world map shows where each category hurts most.'],
            ['⚡', 'Pro users get market signals and exportable data.'],
          ]).map(([emoji, text]) => (
            <div key={text} className="flex gap-3 text-sm">
              <span className="shrink-0">{emoji}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-5" style={{background:'var(--card)', border:'1px solid var(--border)'}}>
          <h2 className="font-bold text-base mb-3" style={{color:'var(--foreground)'}}>{isEs ? '¿Para quién es PainBoard?' : 'Who is PainBoard for?'}</h2>
          <div className="space-y-2 text-sm">
            {(isEs ? [
              ['🚀 Founders', 'Encuentra problemas reales antes de construir tu producto.'],
              ['🔬 Investigadores', 'Accede a datos cualitativos de frustraciones globales.'],
              ['💡 Product managers', 'Valida hipótesis con señales reales de usuarios.'],
              ['😤 Cualquier persona', 'Desahógate y descubre que otros comparten tu frustración.'],
            ] : [
              ['🚀 Founders', 'Find real problems before building your product.'],
              ['🔬 Researchers', 'Access qualitative data on global frustrations.'],
              ['💡 Product managers', 'Validate hypotheses with real user signals.'],
              ['😤 Anyone', 'Vent and discover others share your frustration.'],
            ]).map(([role, desc]) => (
              <div key={role} className="flex gap-3">
                <span className="font-semibold shrink-0 w-40" style={{color:'var(--foreground)'}}>{role}</span>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <p>
          {isEs
            ? '100% anónimo. Sin registro para votar ni reportar un pain. Sin algoritmos que distorsionen la realidad — solo votos humanos reales.'
            : '100% anonymous. No sign-up to vote or report a pain. No algorithms distorting reality — just real human votes.'}
        </p>

        <p className="text-sm">
          {isEs ? '¿Preguntas o sugerencias? ' : 'Questions or suggestions? '}
          <a href="mailto:hello@painboard.site" className="underline" style={{color:'var(--primary)'}}>hello@painboard.site</a>
        </p>
      </div>
    </div>
  )
}
