import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'es' ? 'Términos de uso — PainBoard' : 'Terms of Use — PainBoard',
    description: lang === 'es'
      ? 'Lee los términos de uso de PainBoard. Plataforma anónima de reporte de problemas reales.'
      : 'Read PainBoard\'s terms of use. Anonymous platform for reporting real-world problems.',
    alternates: { canonical: `https://painboard.site/${lang}/terms` },
  }
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isEs = lang === 'es'

  const sections = isEs ? [
    ['1. Aceptación de términos', 'Al acceder o usar PainBoard (painboard.site), aceptas quedar vinculado por estos Términos de Uso. Si no estás de acuerdo con alguna parte, no uses la plataforma.'],
    ['2. Uso permitido', 'PainBoard es una plataforma para reportar problemas y frustraciones reales de forma anónima. Está estrictamente prohibido publicar: spam o contenido promocional no solicitado, contenido ofensivo, discriminatorio o que incite al odio, información personal identificable de terceros sin su consentimiento, contenido ilegal bajo cualquier jurisdicción aplicable, y ataques personales o acoso dirigido a individuos.'],
    ['3. Contenido enviado por usuarios', 'Al enviar un pain u otro contenido, declaras que tienes el derecho de publicarlo y otorgas a PainBoard una licencia mundial, no exclusiva, libre de regalías para mostrar, reproducir y distribuir dicho contenido en la plataforma. Conservas todos los demás derechos sobre tu contenido.'],
    ['4. Anonimato y responsabilidad', 'La plataforma permite el uso anónimo. Sin embargo, el anonimato no exime de responsabilidad legal. Eres responsable de todo el contenido que publiques.'],
    ['5. Moderación', 'Nos reservamos el derecho de eliminar, editar o rechazar cualquier contenido que viole estos términos, a nuestra entera discreción y sin previo aviso.'],
    ['6. Propiedad intelectual', 'El diseño, código y marca de PainBoard son propiedad de sus creadores. Los datos agregados y estadísticas de la plataforma pueden ser usados libremente citando la fuente.'],
    ['7. Limitación de responsabilidad', 'PainBoard se proporciona "tal cual" sin garantías de ningún tipo. No somos responsables de daños directos, indirectos o consecuentes derivados del uso de la plataforma.'],
    ['8. Cambios en los términos', 'Podemos actualizar estos términos en cualquier momento. El uso continuado de la plataforma tras los cambios implica aceptación de los nuevos términos.'],
    ['9. Contacto', 'Para cualquier consulta sobre estos términos escribe a hello@painboard.site'],
  ] : [
    ['1. Acceptance of Terms', 'By accessing or using PainBoard (painboard.site), you agree to be bound by these Terms of Use. If you disagree with any part, do not use the platform.'],
    ['2. Permitted Use', 'PainBoard is a platform for anonymously reporting real problems and frustrations. The following is strictly prohibited: spam or unsolicited promotional content, offensive, discriminatory, or hate-inciting content, personally identifiable information of third parties without consent, content illegal under any applicable jurisdiction, and personal attacks or harassment directed at individuals.'],
    ['3. User-Submitted Content', 'By submitting a pain or other content, you declare you have the right to publish it and grant PainBoard a worldwide, non-exclusive, royalty-free license to display, reproduce, and distribute that content on the platform. You retain all other rights to your content.'],
    ['4. Anonymity and Responsibility', 'The platform allows anonymous use. However, anonymity does not exempt from legal responsibility. You are responsible for all content you publish.'],
    ['5. Moderation', 'We reserve the right to remove, edit, or reject any content that violates these terms, at our sole discretion and without prior notice.'],
    ['6. Intellectual Property', 'PainBoard\'s design, code, and brand are the property of its creators. Aggregated data and platform statistics may be freely used with attribution.'],
    ['7. Limitation of Liability', 'PainBoard is provided "as is" without warranties of any kind. We are not liable for direct, indirect, or consequential damages arising from use of the platform.'],
    ['8. Changes to Terms', 'We may update these terms at any time. Continued use of the platform after changes implies acceptance of the new terms.'],
    ['9. Contact', 'For any questions about these terms write to hello@painboard.site'],
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black mb-2">{isEs ? 'Términos de uso' : 'Terms of Use'}</h1>
      <p className="text-xs mb-10" style={{color:'var(--muted-foreground)'}}>{isEs ? 'Última actualización: mayo 2026' : 'Last updated: May 2026'}</p>
      <div className="space-y-6 text-[15px] leading-relaxed" style={{color:'var(--muted-foreground)'}}>
        {sections.map(([title, body]) => (
          <div key={title}>
            <h2 className="font-bold mb-2 text-base" style={{color:'var(--foreground)'}}>{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
