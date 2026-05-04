import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'PainBoard — What actually pisses people off',
  description: 'Real problems submitted and voted by humans worldwide.',
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return (
    <>
      <Navbar lang={lang} />
      <main className="min-h-[calc(100vh-56px)]">{children}</main>
      <Footer lang={lang} />
    </>
  )
}
