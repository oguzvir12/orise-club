'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowUpRight, Users, ShoppingBag, Sparkles, ShieldCheck, X, Mail } from 'lucide-react'
import { OriseMark } from '@/components/logo'
import { cn } from '@/lib/utils'

const PANELS = [
  {
    id: 'community',
    href: '/community',
    slogan: 'KULÜBE KATIL · RİTMİNİ BUL',
    title: 'TOPLULUK',
    subtitle:
      'Şehrin enerjisini birlikte yükselten haftalık koşu, yoga ve açık hava antrenman buluşmaları.',
    cta: 'Etkinlikleri Keşfet',
    meta: 'KOŞU · VOLEYBOL · TENİS · PİLATES · YELKEN',
    icon: Users,
    bgImage: '/community-hero.jpeg',
    align: 'left',
    subText: 'Haftalık Antrenman & Atölyeler',
  },
  {
    id: 'store',
    href: '/store',
    slogan: 'HAREKET KULÜBÜ & STÜDYO',
    title: 'MAĞAZA',
    subtitle:
      'Kulüp kültüründen ilham alan özel tasarım teknik spor ve sokak giyimi e-ticaret koleksiyonu.',
    cta: 'Koleksiyonu İncele',
    meta: 'TEKNİK GİYİM · ATLETİK STİL',
    icon: ShoppingBag,
    bgImage: '/store-hero.jpeg',
    align: 'right',
    subText: 'Özel Seri Teknik Drop Parçalar',
    primary: true,
  },
]

const LEGAL_DOCS: Record<string, { title: string; content: string[] }> = {
  kvkk: {
    title: 'KVKK Aydınlatma & Açık Rıza Metni',
    content: [
      '1. Veri Sorumlusunun Kimliği: 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Orise Club olarak kişisel verileriniz, veri sorumlusu sıfatıyla aşağıda açıklanan kapsamda işlenmektedir.',
      '2. İşlenen Kişisel Verileriniz: Ad-soyad, e-posta adresi, telefon numarası, teslimat/fatura adresleri ve etkinlik katılım/sağlık beyanı bilgileriniz.',
      '3. Kişisel Verilerin İşlenme Amaçları: Mağaza alışverişlerinizin faturalandırma ve kargo teslimat süreçlerinin yürütülmesi, güvenli ödeme altyapısının sağlanması ve topluluk etkinliklerine katılım süreçlerinin yönetilmesi.',
      '4. İletişim: Mağaza işlemleri için store@oriseclub.com, topluluk için community@oriseclub.com adresleri üzerinden bize ulaşabilirsiniz.'
    ],
  },
  privacy: {
    title: 'Gizlilik ve Çerez Politikası',
    content: [
      '1. Gizlilik İlkemiz: Orise Club, e-ticaret müşterilerinin ve topluluk üyelerinin gizliliğine son derece önem verir. Tüm ödeme verileri şifrelenmiş güvenli altyapıyla korunur.',
      '2. Çerez Kullanımı: Sitemizdeki alışveriş sepeti ve oturum işlemlerinin yürütülmesi için zorunlu çerezler kullanılmaktadır.',
      '3. İletişim Kanalları: Sorularınız için store@oriseclub.com üzerinden destek alabilirsiniz.'
    ],
  },
  terms: {
    title: 'Mesafeli Satış ve Hizmet Sözleşmesi',
    content: [
      '1. Taraflar: İş bu sözleşme, Orise Club ("Satıcı") ile internet sitesi üzerinden alışveriş yapan Alıcı arasında akdedilmiştir.',
      '2. Konu: İnternet sitesi üzerinden satışa sunulan teknik tekstil ürünlerinin teslimatı ve satış şartlarını düzenler. Topluluk etkinlikleri ise ücretsiz buluşma niteliğindedir.',
      '3. İletişim: store@oriseclub.com'
    ],
  },
  refund: {
    title: 'İptal ve İade Koşulları',
    content: [
      '1. Ürün İadeleri: Mağazamızdan satın alınan kullanılmamış ürünler teslim tarihinden itibaren 14 gün içinde iade edilebilir.',
      '2. Destek: İade ve değişim talepleriniz için store@oriseclub.com adresine e-posta gönderebilirsiniz.'
    ],
  },
}

export function SplitHero() {
  const [hovered, setHovered] = useState<'community' | 'store' | null>(null)
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null)

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden md:flex-row bg-black select-none font-sans">
      {/* Merkez Dikey Ayrım Lazer Çizgisi */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />

      {/* Dinamik Sağa/Sola Kayan Merkez Çekirdek */}
      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-y-1/2 transition-all duration-500 ease-out md:block',
          hovered === 'community'
            ? '-translate-x-[calc(50%+10px)]'
            : hovered === 'store'
              ? '-translate-x-[calc(50%-10px)]'
              : '-translate-x-1/2',
        )}
      >
        <div
          className={cn(
            'absolute inset-0 -m-6 rounded-full bg-primary/30 blur-2xl transition-all duration-500',
            hovered ? 'scale-125 opacity-100 bg-primary/50' : 'scale-100 opacity-50',
          )}
        />
        <div
          className={cn(
            'absolute inset-0 -m-2 rounded-full border border-primary/30 transition-all duration-500',
            hovered ? 'scale-110 border-primary/70 opacity-100' : 'scale-100 opacity-40',
          )}
        />
        <div
          className={cn(
            'relative flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-black/90 backdrop-blur-2xl transition-all duration-500 lg:h-24 lg:w-24 shadow-[0_0_60px_rgba(0,0,0,0.95)]',
            hovered ? 'border-primary scale-105 shadow-[0_0_40px_rgba(249,115,22,0.4)]' : '',
          )}
        >
          <OriseMark
            className={cn(
              'h-10 w-10 text-primary transition-transform duration-500 lg:h-11 lg:w-11',
              hovered ? 'scale-110 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]' : 'scale-100',
            )}
          />
        </div>
      </div>

      {PANELS.map((panel) => {
        const Icon = panel.icon
        const isHovered = hovered === panel.id
        const isOtherHovered = hovered !== null && hovered !== panel.id

        return (
          <Link
            key={panel.href}
            href={panel.href}
            onMouseEnter={() => setHovered(panel.id as 'community' | 'store')}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "group relative flex w-full flex-col items-center justify-center border-b border-white/5 p-8 text-center transition-all duration-700 last:border-b-0 md:h-full md:border-b-0 md:border-r md:last:border-r-0 md:p-12 lg:p-16 pb-24 md:pb-24",
              panel.primary ? "md:w-[52%]" : "md:w-[48%]"
            )}
          >
            {/* Arka Plan Görseli */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={panel.bgImage}
                alt={panel.title}
                fill
                priority
                className={cn(
                  'object-cover transition-all duration-1000 ease-out',
                  isHovered
                    ? 'scale-105 opacity-45 grayscale-0 contrast-115'
                    : panel.primary
                      ? 'scale-100 opacity-25 grayscale contrast-125'
                      : 'scale-100 opacity-20 grayscale contrast-125',
                  isOtherHovered && 'opacity-10 blur-[3px]',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            </div>

            {/* Yan Kenar Editoryal Damgası */}
            <div
              className={cn(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 hidden 2xl:block text-[10px] font-mono tracking-[0.35em] text-zinc-500 uppercase [writing-mode:vertical-rl] transition-colors duration-500 group-hover:text-primary',
                panel.align === 'left' ? 'left-8 rotate-180' : 'right-8',
              )}
            >
              {panel.meta}
            </div>

            {/* İçerik Bloğu */}
            <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-4">
              <div>
                <div className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] backdrop-blur-md transition-all duration-300",
                  panel.primary 
                    ? "border border-primary/50 bg-primary/20 text-primary shadow-[0_0_20px_rgba(249,115,22,0.3)]" 
                    : "border border-white/20 bg-white/5 text-zinc-300 group-hover:border-primary/40 group-hover:text-primary"
                )}>
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>{panel.slogan}</span>
                </div>
              </div>

              <h2 className="whitespace-nowrap font-sans text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl transition-all duration-300 drop-shadow-md">
                {panel.title}
              </h2>

              <p className="max-w-sm text-sm font-normal leading-relaxed text-zinc-300/90 text-pretty transition-colors duration-300 group-hover:text-white drop-shadow">
                {panel.subtitle}
              </p>

              <div className="pt-2">
                <div className={cn(
                  "inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-xs font-bold tracking-wider uppercase backdrop-blur-md transition-all duration-300 group-hover:scale-105",
                  panel.primary
                    ? "border border-primary bg-primary text-black shadow-[0_0_35px_rgba(249,115,22,0.6)] font-black"
                    : "border border-white/20 bg-zinc-900/80 text-zinc-100 group-hover:border-primary group-hover:bg-primary group-hover:text-black"
                )}>
                  <Icon className={cn("h-4 w-4 transition-colors", panel.primary ? "text-black" : "text-primary group-hover:text-black")} />
                  <span>{panel.cta}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Temiz, Emojisiz Editoryal Alt Etiket */}
              <div className="pt-1 text-[10px] font-mono text-zinc-500 tracking-[0.25em] uppercase">
                {panel.subText}
              </div>
            </div>
          </Link>
        )
      })}

      {/* FOOTER & İLETİŞİM / SOSYAL MEDYA LİNKLERİ */}
      <footer className="absolute bottom-0 inset-x-0 z-40 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 sm:px-10 py-3 bg-black/95 border-t border-white/10 backdrop-blur-xl text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-white tracking-wider">ORISE CLUB</span>
          <span className="text-zinc-600">/</span>
          <span className="text-[10px] tracking-widest text-primary uppercase">ATHLETICS & STUDIO</span>
        </div>

        {/* Yasal Metin Tetikleyicileri */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
          {['kvkk', 'privacy', 'terms', 'refund'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveLegalModal(key)}
              className="hover:text-primary transition-colors underline decoration-zinc-700 underline-offset-4 cursor-pointer uppercase"
            >
              {key === 'kvkk' ? 'KVKK' : key === 'privacy' ? 'Gizlilik' : key === 'terms' ? 'Mesafeli Satış' : 'İade'}
            </button>
          ))}
        </div>

        {/* E-posta ve Sosyal Medya Bağlantıları */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Mail className="h-3 w-3 text-primary" />
            <span className="text-[10px] text-zinc-400 lowercase">store@oriseclub.com</span>
          </div>
          <span className="text-zinc-700">|</span>
          <a href="https://www.instagram.com/orisestore/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Mağaza IG</a>
          <span className="text-zinc-600">·</span>
          <a href="https://www.instagram.com/orisecommunity/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Topluluk IG</a>
          <span className="text-zinc-600">·</span>
          <a href="https://www.linkedin.com/company/orisecommunity" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
        </div>
      </footer>

      {/* YASAL METİN MODALİ */}
      {activeLegalModal && LEGAL_DOCS[activeLegalModal] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setActiveLegalModal(null)}>
          <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 space-y-4 text-white max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-primary font-bold text-sm uppercase flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Yasal Bilgilendirme</span>
              <button onClick={() => setActiveLegalModal(null)} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <h3 className="text-xl font-black">{LEGAL_DOCS[activeLegalModal].title}</h3>
            <div className="space-y-3 pt-2">
              {LEGAL_DOCS[activeLegalModal].content.map((paragraph, index) => (
                <p key={index} className="text-xs text-zinc-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
