'use client'

import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Geist, Space_Grotesk } from 'next/font/google'
import { CartProvider } from '@/components/cart/cart-provider'
import { SiteHeader } from '@/components/site-header'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { ShieldCheck, Mail, ArrowUpRight, ChevronDown, ChevronUp, X } from 'lucide-react'
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isFooterMenuOpen, setIsFooterMenuOpen] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

  return (
    <html
      lang="tr"
      className={`${geist.variable} ${spaceGrotesk.variable} bg-[#111111] text-[#F5F2EC]`}
    >
      <body className="font-sans antialiased bg-[#111111] text-[#F5F2EC] flex flex-col min-h-screen selection:bg-[#F74A05] selection:text-white overflow-x-hidden">
        <CartProvider>
          <SiteHeader />

          {/* Üst boşluk kaldırıldı, video doğrudan ekranın en üstünden (header arkasından) başlayacak */}
          <main className="flex-1 w-full">
            {children}
          </main>

          <CartDrawer />

          {/* SAĞ ALT: İki ince çizgi butonuna tıklandığında hem WhatsApp hem Bülten açılır */}
          <div className="fixed bottom-6 right-6 z-[90]">
            {isFooterMenuOpen ? (
              <div className="w-80 rounded-3xl border border-[#D8D6D2]/20 bg-[#111111]/95 p-5 shadow-2xl backdrop-blur-2xl space-y-4 animate-fadeIn text-[#F5F2EC]">
                <div className="flex items-center justify-between border-b border-[#D8D6D2]/10 pb-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#F74A05] font-bold">Destek & Bülten</span>
                  <button onClick={() => setIsFooterMenuOpen(false)} className="text-[#D8D6D2] hover:text-[#FFFFFF] cursor-pointer"><X size={14} /></button>
                </div>

                {/* WhatsApp Hızlı Bağlantı */}
                <a 
                  href="https://wa.me/905070820800?text=Merhaba,%20ORISE%20Club%20hakkında%20bilgi%20almak%20istiyorum." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-[#25D366] text-white py-3 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>WhatsApp Destek Hattı</span>
                </a>

                {/* E-posta Bülten Alanı */}
                {newsletterSubscribed ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold text-center">
                    ✓ Bültene Kaydoldunuz!
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); if(newsletterEmail) setNewsletterSubscribed(true); }} className="space-y-3 pt-1">
                    <span className="text-[11px] font-mono text-[#D8D6D2] block">Koleksiyondan Haberdar Ol:</span>
                    <input 
                      type="email" 
                      required 
                      value={newsletterEmail} 
                      onChange={(e) => setNewsletterEmail(e.target.value)} 
                      placeholder="E-posta adresiniz..." 
                      className="w-full rounded-xl border border-[#D8D6D2]/20 bg-[#111111] px-4 py-2.5 text-xs text-[#FFFFFF] focus:border-[#F74A05] focus:outline-none" 
                    />
                    <button type="submit" className="w-full rounded-full bg-[#F74A05] py-2.5 text-xs font-bold uppercase tracking-widest text-[#111111] hover:bg-orange-600 transition-all cursor-pointer font-black">
                      Abone Ol
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setIsFooterMenuOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 border border-[#D8D6D2]/20 text-[#F74A05] shadow-2xl backdrop-blur-md hover:scale-110 hover:border-[#F74A05] transition-all cursor-pointer"
                title="Destek & Bülten Menüsü"
              >
                <div className="flex flex-col gap-1.5 items-center justify-center w-5">
                  <div className="w-4 h-[2px] bg-[#F74A05] rounded-full"></div>
                  <div className="w-2.5 h-[2px] bg-[#F74A05] rounded-full"></div>
                </div>
              </button>
            )}
          </div>

          <footer className="w-full border-t border-[#D8D6D2]/10 bg-[#111111] pt-16 pb-12 px-6 sm:px-10 lg:px-16 font-sans text-xs">
            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-['Vast_XXL',sans-serif] text-xl font-black tracking-tighter text-[#FFFFFF]">ORISE <span className="text-[#F74A05]">STORE</span></span>
                </div>
                <p className="text-[#D8D6D2] leading-relaxed text-xs">
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

              <div className="space-y-3 font-mono">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">Kurumsal & Mağaza</h4>
                <ul className="space-y-2.5 text-[#D8D6D2]">
                  <li><Link href="/store" className="hover:text-[#F74A05] transition-colors flex items-center gap-1">Tüm Koleksiyon <ArrowUpRight size={12}/></Link></li>
                  <li><Link href="/store?category=sale" className="hover:text-[#F74A05] transition-colors flex items-center gap-1">Fırsat & İndirimler <ArrowUpRight size={12}/></Link></li>
                  <li><Link href="/hakkimizda" className="hover:text-[#F74A05] transition-colors">Hakkımızda</Link></li>
                </ul>
              </div>

              <div className="space-y-3 font-mono">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">Kulüp & Sosyal</h4>
                <ul className="space-y-2.5 text-[#D8D6D2]">
                  <li>
                    <a href="https://www.instagram.com/orisecommunity" target="_blank" rel="noopener noreferrer" className="hover:text-[#F74A05] transition-colors flex items-center gap-2 font-bold text-[#FFFFFF]">
                      <InstagramIcon className="h-4 w-4 text-[#F74A05]" /> ORISE COMMUNITY
                    </a>
                    <p className="text-[10px] text-[#D8D6D2]/60 mt-0.5">Etkinlikler, paylaşımlar ve kulüp haberleri için bizi takip et.</p>
                  </li>
                  <li className="pt-1">
                    <a href="https://www.instagram.com/orisestore" target="_blank" rel="noopener noreferrer" className="hover:text-[#F74A05] transition-colors flex items-center gap-2">
                      <InstagramIcon className="h-3.5 w-3.5 text-[#F74A05]" /> @orisestore
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/company/orisecommunity/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-[#F74A05] transition-colors flex items-center gap-2">
                      <LinkedinIcon className="h-3.5 w-3.5 text-[#F74A05]" /> LinkedIn
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 font-mono">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">Bize Ulaşın</h4>
                <div className="space-y-3 text-[#D8D6D2] text-[11px]">
                  <div>
                    <span className="text-[10px] text-[#D8D6D2]/60 block">Mağaza ile alakalı sorunlar için:</span>
                    <a href="mailto:store@oriseclub.com" className="hover:text-[#F74A05] transition-colors font-bold text-[#FFFFFF] flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3.5 w-3.5 text-[#F74A05]" /> store@oriseclub.com
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#D8D6D2]/60 block">Topluluk etkinlikleri için:</span>
                    <a href="mailto:community@oriseclub.com" className="hover:text-[#F74A05] transition-colors font-bold text-[#FFFFFF] flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3.5 w-3.5 text-[#F74A05]" /> community@oriseclub.com
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#D8D6D2]/60 block">İşbirliği için:</span>
                    <a href="mailto:info@oriseclub.com" className="hover:text-[#F74A05] transition-colors font-bold text-[#FFFFFF] flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3.5 w-3.5 text-[#F74A05]" /> info@oriseclub.com
                    </a>
                  </div>
                </div>
              </div>

            </div>

            <div className="mx-auto max-w-7xl mt-14 pt-6 border-t border-[#D8D6D2]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#D8D6D2]/60">
              <p>© 2026 ORISE CLUB. Tüm Hakları Saklıdır. // Bir Markadan Fazlası, Bir Kulüp.</p>
              <div className="flex items-center gap-6">
                <Link href="/gizlilik" className="hover:text-[#FFFFFF] transition-colors">Gizlilik Politikası</Link>
                <Link href="/mesafeli-satis" className="hover:text-[#FFFFFF] transition-colors">Mesafeli Satış Sözleşmesi</Link>
                <Link href="/iade-kosullari" className="hover:text-[#FFFFFF] transition-colors">İade & Değişim</Link>
              </div>
            </div>
          </footer>
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
