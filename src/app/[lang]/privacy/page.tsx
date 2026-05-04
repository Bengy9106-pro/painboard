import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'es' ? 'Política de privacidad — PainBoard' : 'Privacy Policy — PainBoard',
    description: lang === 'es'
      ? 'PainBoard no requiere registro. Usamos fingerprint anónimo para votar. Sin tracking de terceros ni venta de datos.'
      : 'PainBoard requires no registration. We use anonymous fingerprinting for voting. No third-party tracking or data selling.',
    alternates: { canonical: `https://painboard.site/${lang}/privacy` },
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isEs = lang === 'es'

  const sections = isEs ? [
    ['¿Qué datos recopilamos?', 'PainBoard está diseñado para minimizar la recopilación de datos. No requerimos registro para usar la plataforma. Para votar, usamos un fingerprint anónimo generado en tu navegador (combinación de características técnicas) que no permite identificarte personalmente. Detectamos tu país de forma aproximada mediante tu dirección IP al enviar un pain, pero no la almacenamos directamente. Si te registras opcionalmente, guardamos tu email y los datos de tu perfil público.'],
    ['Cookies y almacenamiento local', 'Usamos localStorage únicamente para recordar tu preferencia de tema (oscuro/claro). No usamos cookies de seguimiento, ni pixels de terceros, ni herramientas de analítica invasiva. No hay tracking publicitario de ningún tipo.'],
    ['¿Cómo usamos los datos?', 'Los datos que recopilamos se usan exclusivamente para: mostrar estadísticas agregadas y geográficas en la plataforma, prevenir votos duplicados y spam, y mejorar la experiencia de uso. Nunca vendemos, alquilamos ni compartimos tus datos con terceros para fines publicitarios.'],
    ['Datos de usuarios registrados', 'Si creas una cuenta, guardamos tu email, nombre de perfil y avatar (si usas Google OAuth). Estos datos se usan para personalizar tu experiencia y para el plan Pro si lo contratas. Puedes solicitar la eliminación completa de tu cuenta en cualquier momento.'],
    ['Retención de datos', 'Los pains enviados se conservan indefinidamente como parte de la base de datos pública. Si deseas eliminar contenido que enviaste, escríbenos. Los datos de sesión se eliminan al cerrar sesión.'],
    ['Seguridad', 'Usamos Supabase como infraestructura de base de datos y autenticación, con cifrado en tránsito (HTTPS/TLS) y en reposo. Seguimos las mejores prácticas de seguridad para proteger tu información.'],
    ['Tus derechos', 'Tienes derecho a acceder, corregir o eliminar tus datos personales. Para ejercer estos derechos o hacer cualquier consulta sobre privacidad, escribe a hello@painboard.site. Respondemos en un plazo máximo de 30 días.'],
    ['Cambios en esta política', 'Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos publicando la nueva versión en esta página con la fecha de actualización.'],
  ] : [
    ['What data do we collect?', 'PainBoard is designed to minimize data collection. No registration is required to use the platform. For voting, we use an anonymous fingerprint generated in your browser (a combination of technical characteristics) that cannot personally identify you. We detect your country approximately via your IP address when submitting a pain, but do not store it directly. If you optionally register, we store your email and public profile data.'],
    ['Cookies and local storage', 'We use localStorage solely to remember your theme preference (dark/light). We use no tracking cookies, third-party pixels, or invasive analytics tools. There is no advertising tracking of any kind.'],
    ['How do we use data?', 'The data we collect is used exclusively to: display aggregated and geographic statistics on the platform, prevent duplicate votes and spam, and improve the user experience. We never sell, rent, or share your data with third parties for advertising purposes.'],
    ['Registered user data', 'If you create an account, we store your email, profile name, and avatar (if using Google OAuth). This data is used to personalize your experience and for the Pro plan if you subscribe. You can request complete account deletion at any time.'],
    ['Data retention', 'Submitted pains are kept indefinitely as part of the public database. If you wish to delete content you submitted, contact us. Session data is deleted upon sign out.'],
    ['Security', 'We use Supabase for database infrastructure and authentication, with encryption in transit (HTTPS/TLS) and at rest. We follow security best practices to protect your information.'],
    ['Your rights', 'You have the right to access, correct, or delete your personal data. To exercise these rights or make any privacy inquiry, write to hello@painboard.site. We respond within 30 days.'],
    ['Changes to this policy', 'We may occasionally update this policy. We will notify you of significant changes by posting the new version on this page with the updated date.'],
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black mb-2">{isEs ? 'Política de privacidad' : 'Privacy Policy'}</h1>
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
