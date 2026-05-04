export default async function ProPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEs = lang === 'es';

  const plans = [
    {
      name: isEs ? 'Gratis' : 'Free',
      price: '$0',
      period: isEs ? 'para siempre' : 'forever',
      featured: false,
      features: [
        isEs ? '✓ Reportar pains (anónimo)' : '✓ Submit pains (anonymous)',
        isEs ? '✓ Votar pains' : '✓ Vote on pains',
        isEs ? '✓ Ver trending y mapa' : '✓ Browse trending & map',
        isEs ? '✓ Newsletter semanal' : '✓ Weekly newsletter',
        isEs ? '✗ Sin alertas' : '✗ No alerts',
      ],
      cta: null,
      ctaHref: null,
    },
    {
      name: 'Builder',
      price: '$19',
      period: isEs ? '/mes' : '/mo',
      featured: true,
      features: [
        isEs ? '✓ Todo lo gratis' : '✓ Everything in Free',
        isEs ? '✓ Alertas por categoría/país' : '✓ Category & country alerts',
        isEs ? '✓ Export CSV mensual' : '✓ Monthly CSV export',
        isEs ? '✓ Historial 6 meses' : '✓ 6-month history',
        isEs ? '✓ Sin publicidad' : '✓ No ads',
      ],
      cta: isEs ? 'Quiero acceso Builder' : 'Get Builder Access',
      ctaHref: isEs
        ? 'mailto:hello@painboard.site?subject=Acceso%20Builder%20-%20%2419%2Fmes&body=Hola%2C%20me%20interesa%20el%20plan%20Builder%20de%20%2419%2Fmes.%20Por%20favor%20ind%C3%ADcame%20c%C3%B3mo%20proceder.'
        : 'mailto:hello@painboard.site?subject=Builder%20Access%20-%20%2419%2Fmo&body=Hi%2C%20I%27m%20interested%20in%20the%20Builder%20plan%20at%20%2419%2Fmo.%20Please%20let%20me%20know%20how%20to%20proceed.',
    },
    {
      name: 'Founder Pro',
      price: '$49',
      period: isEs ? '/mes' : '/mo',
      featured: false,
      features: [
        isEs ? '✓ Todo lo de Builder' : '✓ Everything in Builder',
        isEs ? '✓ API REST completo' : '✓ Full REST API',
        isEs ? '✓ Dashboard analítico' : '✓ Analytics dashboard',
        isEs ? '✓ Badge "building this"' : '✓ "Building this" badge',
        isEs ? '✓ Early access' : '✓ Early access',
      ],
      cta: isEs ? 'Quiero acceso Founder Pro' : 'Get Founder Pro Access',
      ctaHref: isEs
        ? 'mailto:hello@painboard.site?subject=Acceso%20Founder%20Pro%20-%20%2449%2Fmes&body=Hola%2C%20me%20interesa%20el%20plan%20Founder%20Pro%20de%20%2449%2Fmes.%20Por%20favor%20ind%C3%ADcame%20c%C3%B3mo%20proceder.'
        : 'mailto:hello@painboard.site?subject=Founder%20Pro%20Access%20-%20%2449%2Fmo&body=Hi%2C%20I%27m%20interested%20in%20the%20Founder%20Pro%20plan%20at%20%2449%2Fmo.%20Please%20let%20me%20know%20how%20to%20proceed.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <div
          className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
          style={{ color: 'var(--primary)', background: 'color-mix(in srgb, var(--primary) 10%, transparent)' }}
        >
          Pro
        </div>
        <h1 className="text-5xl font-black mb-4">
          {isEs ? 'Para los que quieren actuar' : 'For those who want to act'}
        </h1>
        <p className="max-w-md mx-auto" style={{ color: 'var(--muted-foreground)' }}>
          {isEs
            ? 'Los problemas son datos. Los datos son oportunidades.'
            : 'Problems are data. Data is opportunity.'}
        </p>
      </div>

      {/* Plans grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {plans.map((p) => (
          <div
            key={p.name}
            className="relative rounded-2xl border p-6 flex flex-col"
            style={{
              background: 'var(--card)',
              borderColor: p.featured ? 'var(--primary)' : 'var(--border)',
              boxShadow: p.featured ? '0 0 0 1px var(--primary)' : undefined,
            }}
          >
            {p.featured && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-0.5 rounded-full tracking-wide"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                POPULAR
              </div>
            )}
            <div className="mb-4">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {p.name}
              </p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black">{p.price}</span>
                <span className="text-sm pb-1" style={{ color: 'var(--muted-foreground)' }}>
                  {p.period}
                </span>
              </div>
            </div>

            <ul className="space-y-2.5 flex-1 mb-6">
              {p.features.map((f) => (
                <li
                  key={f}
                  className="text-sm"
                  style={{ color: f.startsWith('✗') ? 'var(--muted-foreground)' : 'var(--foreground)' }}
                >
                  {f}
                </li>
              ))}
            </ul>

            {p.cta && p.ctaHref && (
              <a
                href={p.ctaHref}
                className="w-full py-2.5 rounded-xl font-semibold text-sm text-center transition-colors block"
                style={
                  p.featured
                    ? { background: 'var(--primary)', color: 'var(--primary-foreground)' }
                    : { border: '1px solid var(--border)', color: 'var(--foreground)', background: 'transparent' }
                }
              >
                {p.cta}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Manual contact notice */}
      <div
        className="rounded-2xl border p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: 'color-mix(in srgb, var(--primary) 5%, var(--card))', borderColor: 'color-mix(in srgb, var(--primary) 25%, var(--border))' }}
      >
        <div className="text-2xl">✉️</div>
        <div className="flex-1">
          <p className="font-semibold text-sm mb-0.5">
            {isEs ? '¿Cómo funciona el acceso Pro?' : 'How does Pro access work?'}
          </p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {isEs
              ? 'Hacemos clic en el botón → se abre tu email con el asunto listo → respondemos en menos de 24h con el link de pago (PayPal o transferencia).'
              : 'Click the button → your email opens pre-filled → we reply within 24h with the payment link (PayPal or transfer).'}
          </p>
        </div>
        <a
          href={`mailto:hello@painboard.site`}
          className="shrink-0 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
          style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)', color: 'var(--primary)' }}
        >
          hello@painboard.site
        </a>
      </div>

      {/* Footer notice */}
      <p className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
        ⏳{' '}
        {isEs
          ? 'Los planes de pago se activan al llegar a 500 pains. Hasta entonces: todo gratis.'
          : 'Paid plans activate at 500 pains. Until then: everything is free.'}
      </p>
    </div>
  );
}
