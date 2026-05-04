'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type User = { email?: string; user_metadata?: { avatar_url?: string; full_name?: string } }

export default function Navbar({ lang }: { lang: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const otherLang = lang === 'es' ? 'en' : 'es'
  const otherPath = pathname.replace(`/${lang}`, `/${otherLang}`)
  const [theme, setTheme] = useState<'dark'|'light'>('dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('pb-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(saved as 'dark'|'light')
    document.documentElement.setAttribute('data-theme', saved)

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('pb-theme', next)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setUserMenuOpen(false)
    router.push(`/${lang}`)
  }

  const navLinks = [
    { href: `/${lang}`, label: lang === 'es' ? 'Explorar' : 'Explore' },
    { href: `/${lang}/trending`, label: lang === 'es' ? 'Tendencias' : 'Trending' },
    { href: `/${lang}/map`, label: lang === 'es' ? 'Mapa' : 'Map' },
    { href: `/${lang}/pro`, label: '⚡ Pro' },
  ]

  const avatarUrl = user?.user_metadata?.avatar_url
  const initials = (user?.user_metadata?.full_name || user?.email || '?')[0].toUpperCase()

  return (
    <header className="border-b sticky top-0 z-50 backdrop-blur-md" style={{borderColor:'var(--border)', background:'color-mix(in oklab, var(--background) 85%, transparent)'}}>
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href={`/${lang}`} className="font-black text-[15px] tracking-tight shrink-0" style={{color:'var(--foreground)'}}>
          Pain<span style={{color:'var(--primary)'}}>Board</span>
        </Link>
        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{color: pathname === l.href ? 'var(--foreground)' : 'var(--muted-foreground)', background: pathname === l.href ? 'var(--muted)' : undefined}}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <Link href={otherPath} className="px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wide transition-colors" style={{color:'var(--muted-foreground)'}}>
            {otherLang}
          </Link>
          <button onClick={toggleTheme} aria-label="Toggle theme"
            className="p-1.5 rounded-md transition-colors" style={{color:'var(--muted-foreground)'}}>
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-1.5 rounded-md transition-colors" style={{color:'var(--muted-foreground)'}}>
            {menuOpen
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>}
          </button>

          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(o => !o)}
                className="flex items-center gap-2 ml-1 rounded-lg px-2 py-1 transition-colors hover:opacity-80">
                {avatarUrl
                  ? <img src={avatarUrl} alt="" width={26} height={26} className="rounded-full object-cover"/>
                  : <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold" style={{background:'var(--primary)',color:'var(--primary-foreground)'}}>{initials}</div>
                }
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-10 w-44 rounded-xl border shadow-lg overflow-hidden z-50"
                  style={{background:'var(--card)',borderColor:'var(--border)'}}>
                  <div className="px-3 py-2 border-b" style={{borderColor:'var(--border)'}}>
                    <p className="text-xs font-semibold truncate">{user?.user_metadata?.full_name || 'User'}</p>
                    <p className="text-[11px] truncate" style={{color:'var(--muted-foreground)'}}>{user?.email}</p>
                  </div>
                  <Link href={`/${lang}/saved`} onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:opacity-70">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    {lang === 'es' ? 'Guardados' : 'Saved'}
                  </Link>
                  <button onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:opacity-70 text-left"
                    style={{color:'var(--muted-foreground)'}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                    {lang === 'es' ? 'Cerrar sesión' : 'Sign out'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href={`/${lang}/login`}
              className="hidden sm:flex ml-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:opacity-90"
              style={{background:'var(--primary)', color:'var(--primary-foreground)'}}>
              {lang === 'es' ? 'Entrar' : 'Sign in'}
            </Link>
          )}

          {!user && (
            <Link href={`/${lang}/submit`}
              className="hidden sm:flex px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:opacity-90"
              style={{background:'var(--muted)', color:'var(--foreground)'}}>
              {lang === 'es' ? 'Reportar' : 'Submit'}
            </Link>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{background:'var(--background)', borderColor:'var(--border)'}}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              style={{color:'var(--muted-foreground)'}}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleSignOut} className="px-3 py-2 rounded-md text-sm font-medium text-left" style={{color:'var(--muted-foreground)'}}>
              {lang === 'es' ? 'Cerrar sesión' : 'Sign out'}
            </button>
          ) : (
            <Link href={`/${lang}/login`} onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium" style={{color:'var(--muted-foreground)'}}>
              {lang === 'es' ? 'Iniciar sesión' : 'Sign in'}
            </Link>
          )}
          <Link href={`/${lang}/submit`} onClick={() => setMenuOpen(false)}
            className="mt-1 px-3 py-2 rounded-lg text-sm font-semibold text-center"
            style={{background:'var(--primary)', color:'var(--primary-foreground)'}}>
            {lang === 'es' ? '💢 Reportar un problema' : '💢 Drop a pain'}
          </Link>
        </div>
      )}
    </header>
  )
}
