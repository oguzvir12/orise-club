import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Geist, Space_Grotesk } from 'next/font/google'
import { CartProvider } from '@/components/cart/cart-provider'
import { SiteHeader } from '@/components/site-header'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { ShieldCheck, Mail, ArrowUpRight } from 'lucide-react'
import { InstagramIcon } from '@/components/icons/instagram-icon'
import { LinkedinIcon } from '@/components/icons/linkedin-icon'
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
  title: 'ORISE STORE — Bir Markadan Fazlası, Bir Kulüp',
  description: 'Şehrin enerjisinden ve kulüp kültüründen ilham alan yeni nesil teknik spor giyim, sokak stili ve performans drop koleksiyonları.',
  generator: 'v0.app',
  metadataBase: new URL('https://oriseclub.com'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'ORISE STORE — Bir Markadan Fazlası, Bir Kulüp',
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

          {/* Çok Sütunlu Footer */}
          <footer className="w-full border-t border-white/10 bg-zinc-950 pt-16 pb-12 px-6 sm:px-10 lg:px-16 font-sans text-xs">
            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              {/* 1. Sütun: Kurumsal & Güvence */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xl font-black tracking-tighter text-white">ORISE <span className="text-primary">STORE</span></span>
                </div>
                <p className="text-zinc-400 leading-relaxed text-xs">
                  Bir Markadan Fazlası, Bir Kulüp. Şehrin ritminden ve kulüp kültüründen ilham alan özel seri teknik parçalar.
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
                <h4 className="text-xs font-bold uppercase tracking-widest text-white">Kurumsal & Mağaza</h4>
                <ul className="space-y-2.5 text-zinc-400">
                  <li><Link href="/store" className="hover:text-primary transition-colors flex items-center gap-1">Tüm Koleksiyon <ArrowUpRight size={12}/></Link></li>
                  <li><Link href="/store?category=sale" className="hover:text-primary transition-colors flex items-center gap-1">Fırsat & İndirimler <ArrowUpRight size={12}/></Link></li>
                  <li><Link href="/community" className="hover:text-primary transition-colors flex items-center gap-1">Etkinlik Takvimi <ArrowUpRight size={12}/></Link></li>
                  <li><Link href="/hakkimizda" className="hover:text-primary transition-colors">Hakkımızda</Link></li>
                </ul>
              </div>

              {/* 3. Sütun: Kulüp & Sosyal */}
              <div className="space-y-3 font-mono">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white">Kulüp & Sosyal</h4>
                <ul className="space-y-2.5 text-zinc-400">
                  <li>
                    <a href="https://www.instagram.com/orisecommunity" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2 font-bold text-white">
                      <InstagramIcon className="h-4 w-4 text-primary" /> ORISE COMMUNITY
                    </a>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Etkinlikler, paylaşımlar ve kulüp haberleri için bizi takip et.</p>
                  </li>
                  <li className="pt-1">
                    <a href="https://www.instagram.com/orisestore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                      <InstagramIcon className="h-3.5 w-3.5 text-primary" /> @orisestore
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/company/orisecommunity/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                      <LinkedinIcon className="h-3.5 w-3.5 text-primary" /> LinkedIn
                    </a>
                  </li>
                </ul>
              </div>

              {/* 4. Sütun: Bize Ulaşın */}
              <div className="space-y-3 font-mono">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white">Bize Ulaşın</h4>
                <div className="space-y-3 text-zinc-400 text-[11px]">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Mağaza ile alakalı sorunlar için:</span>
                    <a href="mailto:store@oriseclub.com" className="hover:text-primary transition-colors font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3.5 w-3.5 text-primary" /> store@oriseclub.com
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Topluluk etkinlikleri için:</span>
                    <a href="mailto:community@oriseclub.com" className="hover:text-primary transition-colors font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3.5 w-3.5 text-primary" /> community@oriseclub.com
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">İşbirliği için:</span>
                    <a href="mailto:info@oriseclub.com" className="hover:text-primary transition-colors font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3.5 w-3.5 text-primary" /> info@oriseclub.com
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Alt Telif ve Yasal Onur Bandı */}
            <div className="mx-auto max-w-7xl mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
              <p>© 2026 ORISE CLUB. Tüm Hakları Saklıdır. // Bir Markadan Fazlası, Bir Kulüp.</p>
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
