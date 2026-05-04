import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'PainBoard', template: '%s — PainBoard' },
  description: 'Real problems submitted and voted by humans worldwide. The most honest database of unsolved problems.',
  metadataBase: new URL('https://painboard.site'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    siteName: 'PainBoard',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    site: '@painboard',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
