import Link from 'next/link'
export default function Footer({ lang }: { lang: string }) {
  const links = lang === 'es'
    ? [['/', 'Explorar'],['/trending','Tendencias'],['/map','Mapa'],['/submit','Reportar'],['/about','Acerca de'],['/contact','Contacto'],['/pro','⚡ Pro'],['/terms','Términos'],['/privacy','Privacidad']]
    : [['/', 'Explore'],['/trending','Trending'],['/map','Map'],['/submit','Submit'],['/about','About'],['/contact','Contact'],['/pro','⚡ Pro'],['/terms','Terms'],['/privacy','Privacy']]
  return (
    <footer className="border-t mt-24 py-10 text-sm" style={{borderColor:'var(--border)', color:'var(--muted-foreground)'}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
          {links.map(([path, label]) => (
            <Link key={path} href={`/${lang}${path === '/' ? '' : path}`}
              className="hover:text-foreground transition-colors text-sm"
              style={{color:'var(--muted-foreground)'}}>{label}</Link>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="font-black text-sm" style={{color:'var(--foreground)'}}>
            Pain<span style={{color:'var(--primary)'}}>Board</span>
          </p>
          <p className="text-xs">© 2026 PainBoard · painboard.site · {lang === 'es' ? 'Hecho de noche ☕' : 'Built at night ☕'}</p>
        </div>
      </div>
    </footer>
  )
}
