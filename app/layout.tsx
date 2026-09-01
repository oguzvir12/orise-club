import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { Geist, Space_Grotesk } from 'next/font/google'
import { CartProvider } from '@/components/cart/cart-provider'
import { SiteHeader } from '@/components/site-header'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { ShieldCheck, Mail, Instagram, Linkedin, ArrowUpRight } from 'lucide-react'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'ORISE STORE — Hareket Kulübü & Stüdyo Mağazası',
  description: 'Kulüp kültüründen ilham alan özel tasarım teknik spor giyim ve sokak stili e-ticaret mağazası.',
  generator: 'v0.app',
  metadataBase: new URL('https://oriseclub.com'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'ORISE STORE — Hareket Kulübü & Stüdyo Mağazası',
    description: 'Şehrin enerjisini birlikte yükselten yeni nesil spor topluluğu ve kulübe özel drop koleksiyonlar.',
    url: 'https://oriseclub.com',
    siteName: 'ORISE STORE',
    locale: 'tr_TR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#09090b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="tr"
      className={`${geist.variable} ${spaceGrotesk.variable} bg-black text-white`}
    >
      <body className="font-sans antialiased bg-black text-white flex flex-col min-h-screen selection:bg-primary selection:text-black">
        <CartProvider>
          {/* Üst Menü */}
          <SiteHeader />

          {/* Sayfa İçeriği */}
          <main className="flex-1 pt-16 w-full">
            {children}
          </main>

          {/* Sepet Çekmecesi */}
          <CartDrawer />

          {/* Profesyonel, Sütunlu ve Kapsamlı E-Ticaret Footer */}
          <footer className="w-full border-t border-white/10 bg-zinc-950 py-16 px-6 sm:px-10 lg:px-16 z-30 font-sans">
            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
              
              {/* 1. Sütun: Marka & Güvence */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xl font-black tracking-tighter text-white">ORISE <span className="text-primary">STORE</span></span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                  Şehrin enerjisinden ve kulüp kültüründen ilham alan yeni nesil teknik spor giyim, sokak stili ve performans drop koleksiyonları.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-mono text-emerald-400 font-bold">
                  <ShieldCheck className="h-4 w-4" /> 256-BIT SSL & İyzico Güvenceli Ödeme
                </div>
              </div>

              {/* 2. Sütun: Kurumsal / Hakkımızda */}
              <div className="space-y-3 font-mono">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Kurumsal</h4>
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li><Link href="/hakkimizda" className="hover:text-white transition-colors flex items-center gap-1">Hakkımızda <ArrowUpRight size={12}/></Link></li>
                  <li><Link href="/store" className="hover:text-white transition-colors flex items-center gap-1">Mağaza Koleksiyonu <ArrowUpRight size={12}/></Link></li>
                  <li><Link href="/community" className="hover:text-white transition-colors flex items-center gap-1">Topluluk Takvimi <ArrowUpRight size={12}/></Link></li>
                </ul>
              </div>

              {/* 3. Sütun: Yasal Mevzuatlar */}
              <div className="space-y-3 font-mono">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Yasal & Güvenlik</h4>
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li><Link href="/gizlilik" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
                  <li><Link href="/mesafeli-satis" className="hover:text-white transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
                  <li><Link href="/iade-kosullari" className="hover:text-white transition-colors">İade & Değişim Koşulları</Link></li>
                </ul>
              </div>

              {/* 4. Sütun: Sosyal Medya & İletişim */}
              <div className="space-y-3 font-mono">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary">İletişim & Sosyal</h4>
                <ul className="space-y-2.5 text-xs text-zinc-400">
                  <li>
                    <a href="mailto:store@oriseclub.com" className="hover:text-primary transition-colors flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-primary" /> store@oriseclub.com
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/orisestore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                      <Instagram className="h-3.5 w-3.5 text-primary" /> @orisestore
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/orisecommunity" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                      <Instagram className="h-3.5 w-3.5 text-primary" /> @orisecommunity
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/company/orisecommunity/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                      <Linkedin className="h-3.5 w-3.5 text-primary" /> LinkedIn
                    </a>
                  </li>
                </ul>
              </div>

            </div>

            {/* Alt Telif ve Onur Bandı */}
            <div className="mx-auto max-w-7xl mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
              <p>© 2026 ORISE STORE. Tüm hakları saklıdır.</p>
              <p className="tracking-widest uppercase">STÜDYO & HAREKET KULÜBÜ</p>
            </div>
          </footer>
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
