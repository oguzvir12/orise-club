import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Geist, Space_Grotesk } from 'next/font/google'
import { CartProvider } from '@/components/cart/cart-provider'
import { SiteHeader } from '@/components/site-header'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { ShieldCheck, Mail, ArrowUpRight } from 'lucide-react'
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
  title: 'ORISE STORE — More Than a Brand, a Club',
  description: 'Şehrin enerjisinden ve kulüp kültüründen ilham alan yeni nesil teknik spor giyim, sokak stili ve performans drop koleksiyonları.',
  generator: 'v0.app',
  metadataBase: new URL('https://oriseclub.com'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'ORISE STORE — More Than a Brand, a Club',
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
      <body className="font-sans antialiased bg-black text-white flex flex-col min-h-screen selection:bg-primary selection:text-black overflow-x-hidden">
        <CartProvider>
          {/* Üst Menü */}
          <SiteHeader />

          {/* Sayfa İçeriği */}
          <main className="flex-1 w-full pt-16">
            {children}
          </main>

          {/* Sepet Çekmecesi */}
          <CartDrawer />

          {/* Profesyonel Nike / Kurumsal Tarz Çok Sütunlu Footer */}
          <footer className="w-full border-t border-white/10 bg-zinc-950 pt-16 pb-12 px-6 sm:px-10 lg:px-16 font-sans text-xs">
            <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
              
              {/* 1. Sütun: Marka & Güvence & İyzico Logoband */}
              <div className="col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xl font-black tracking-tighter text-white">ORISE <span className="text-primary">STORE</span></span>
                </div>
                <p className="text-zinc-400 leading-relaxed max-w-sm">
                  More Than a Brand, a Club. Şehrin ritminden ve kulüp kültüründen ilham alan özel seri teknik parçalar.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-mono text-emerald-400 font-bold">
                  <ShieldCheck className="h-4 w-4" /> 256-BIT SSL & İyzico Güvencesi
                </div>
                <div className="pt-2">
                  <Image 
                    src="/images/logo_band_white.svg" 
                    alt="İyzico ve Güvenli Ödeme Logoları" 
                    width={200} 
                    height={30} 
                    className="object-contain h-6 w-auto opacity-85"
                  />
                </div>
              </div>

              {/* 2. Sütun: Kaynaklar / Mağaza */}
              <div className="space-y-3 font-mono">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white">Kaynaklar</h4>
                <ul className="space-y-2.5 text-zinc-400">
                  <li><Link href="/store" className="hover:text-primary transition-colors flex items-center gap-1">Tüm Koleksiyon <ArrowUpRight size={12}/></Link></li>
                  <li><Link href="/store?category=sale" className="hover:text-primary transition-colors flex items-center gap-1">Fırsat & İndirimler <ArrowUpRight size={12}/></Link></li>
                  <li><Link href="/community" className="hover:text-primary transition-colors flex items-center gap-1">Etkinlik Takvimi <ArrowUpRight size={12}/></Link></li>
                  <li><Link href="/hakkimizda" className="hover:text-primary transition-colors">Üye Ol & Kulüp</Link></li>
                </ul>
              </div>

              {/* 3. Sütun: Yardım & Destek */}
              <div className="space-y-3 font-mono">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white">Yardım</h4>
                <ul className="space-y-2.5 text-zinc-400">
                  <li><Link href="/store" className="hover:text-primary transition-colors">Sipariş Durumu</Link></li>
                  <li><Link href="/store" className="hover:text-primary transition-colors">Kargo ve Teslimat</Link></li>
                  <li><Link href="/iade-kosullari" className="hover:text-primary transition-colors">İadeler & Değişim</Link></li>
                  <li><Link href="/store" className="hover:text-primary transition-colors">Ödeme Seçenekleri</Link></li>
                  <li><a href="mailto:store@oriseclub.com" className="hover:text-primary transition-colors">Bize Ulaşın</a></li>
                </ul>
              </div>

              {/* 4. Sütun: Şirket & Sosyal */}
              <div className="space-y-3 font-mono col-span-2 lg:col-span-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white">Şirket & Sosyal</h4>
                <ul className="space-y-2.5 text-zinc-400">
                  <li><Link href="/hakkimizda" className="hover:text-primary transition-colors">Orise Hakkında</Link></li>
                  <li><Link href="/community" className="hover:text-primary transition-colors">Topluluk & Haberler</Link></li>
                  <li>
                    <a href="https://www.instagram.com/orisestore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> @orisestore
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/company/orisecommunity/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 text-primary fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> LinkedIn
                    </a>
                  </li>
                </ul>
              </div>

            </div>

            {/* Alt Telif ve Yasal Onur Bandı */}
            <div className="mx-auto max-w-7xl mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
              <p>© 2026 ORISE STORE. Tüm Hakları Saklıdır. // More Than a Brand, a Club.</p>
              <div className="flex items-center gap-6">
                <Link href="/gizlilik" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
                <Link href="/mesafeli-satis" className="hover:text-white transition-colors">Kullanım ve Satış Şartları</Link>
                <Link href="/iade-kosullari" className="hover:text-white transition-colors">Şirket Ayrıntıları</Link>
              </div>
            </div>
          </footer>
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
