'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ArrowUpRight, ShoppingBag, Users, Sparkles, Mail, X, ShieldCheck, User, LogOut } from 'lucide-react'
import { OriseMark } from '@/components/logo'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import AuthModal from '@/components/AuthModal'

const PANELS = [
  {
    id: 'community',
    href: '/community',
    slogan: 'KULÜBE KATIL · RİTMİNİ BUL',
    title: 'TOPLULUK',
    subtitle:
      'Tek başınalıktan çık, şehre karış. Birlikte hareket eden yeni nesil spor topluluğu.',
    cta: 'Buluşmaları Keşfet',
    meta: 'KOŞU · VOLEYBOL · TENİS · PİLATES · YELKEN',
    icon: Users,
    bgImage: '/community-hero.jpeg',
    align: 'left',
  },
  {
    id: 'store',
    href: '/store',
    slogan: 'HAREKET KULÜBÜ & STÜDYO',
    title: 'MAĞAZA',
    subtitle:
      'Kulüp kültüründen ilham alan özel tasarım teknik spor ve sokak parçaları.',
    cta: 'Koleksiyonu İncele',
    meta: 'TEKNİK GİYİM · ATLETİK STİL',
    icon: ShoppingBag,
    bgImage: '/store-hero.jpeg',
    align: 'right',
  },
]

const LEGAL_DOCS: Record<string, { title: string; content: string }> = {
  kvkk: {
    title: 'KVKK Aydınlatma & Açık Rıza Metni',
    content:
      '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, ORISE CLUB tarafından toplanan ad, soyad, e-posta, telefon numarası ve etkinlik katılım verileriniz; yalnızca kulüp organizasyonlarının yönetilmesi, katılım doğrulaması yapılması ve üyelik bilgilendirmelerinin iletilmesi amacıyla güvenli sunucularda şifreli olarak işlenmektedir. Verileriniz üçüncü şahıslarla pazarlama amacıyla paylaşılmaz.',
  },
  privacy: {
    title: 'Gizlilik ve Çerez Politikası',
    content:
      'ORISE CLUB, kullanıcılarının gizliliğine ve kişisel haklarına saygı duyar. Web sitemizde kullanıcı deneyimini iyileştirmek, oturum durumunu korumak ve güvenliği sağlamak amacıyla zorunlu teknik çerezler kullanılmaktadır. Sitemizi kullanarak bu çerezlerin kullanımını kabul etmiş sayılırsınız.',
  },
  terms: {
    title: 'Mesafeli Satış ve Hizmet Sözleşmesi',
    content:
      'İşbu sözleşme, ORISE CLUB üzerinden gerçekleştirilen ürün siparişleri ve etkinlik katılımlarının şartlarını düzenler. Tüketici, sipariş vermeden önce ürün niteliklerini, satış fiyatını ve teslimat koşullarını incelediğini teyit eder.',
  },
  refund: {
    title: 'İptal ve İade Koşulları',
    content:
      'Mağazadan satın alınan ürünler, teslimat tarihinden itibaren 14 gün içerisinde orijinal ambalajı bozulmamış olarak iade edilebilir. Etkinlik katılımlarında ise etkinlik saatinden 24 saat öncesine kadar yapılan iptallerde üyelik hakları muhafaza edilir.',
  },
}

export function SplitHero() {
  const [hovered, setHovered] = useState<'community' | 'store' | null>(null)
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden md:flex-row bg-black select-none font-sans">
      
      {/* Üst Logo ve Giriş / Sepet Alanı (Çakışmayı önleyen düzen) */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Sol üst marka göstergesi */}
          <span className="text-xs font-mono font-bold tracking-widest text-zinc-400">ORISE</span>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Giriş Yap / Kayıt Ol veya Profil/Çıkış Butonu */}
          {user ? (
            <div className="flex items-center gap-3 rounded-full border border-white/15 bg-zinc-900/90 px-4 py-1.5 backdrop-blur-md shadow-lg">
              <span className="text-[11px] font-mono text-zinc-300 hidden sm:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Çıkış</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary backdrop-blur-md hover:bg-primary/20 hover:border-primary transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
            >
              <User className="h-3.5 w-3.5" />
              <span>Giriş Yap / Kayıt Ol</span>
            </button>
          )}
        </div>
      </div>

      {/* Merkez Dikey Ayrım Çizgisi */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />

      {/* Dinamik Merkez Çekirdek */}
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
            'absolute inset-0 -m-6 rounded-full bg-primary/25 blur-2xl transition-all duration-500',
            hovered ? 'scale-125 opacity-100 bg-primary/45' : 'scale-100 opacity-40',
          )}
        />
        <div
          className={cn(
            'absolute inset-0 -m-2 rounded-full border border-primary/25 transition-all duration-500',
            hovered ? 'scale-110 border-primary/50 opacity-100' : 'scale-100 opacity-30',
          )}
        />
        <div
          className={cn(
            'relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/85 backdrop-blur-2xl transition-all duration-500 lg:h-24 lg:w-24 shadow-[0_0_50px_rgba(0,0,0,0.9)]',
            hovered ? 'border-primary/80 scale-105 shadow-[0_0_35px_rgba(249,115,22,0.35)]' : '',
          )}
        >
          <OriseMark
            className={cn(
              'h-10 w-10 text-primary transition-transform duration-500 lg:h-11 lg:w-11',
              hovered ? 'scale-110 drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]' : 'scale-100',
            )}
          />
        </div>
      </div>

      {/* Sol ve Sağ Paneller */}
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
            className="group relative flex w-full flex-col items-center justify-center border-b border-white/5 p-8 text-center transition-all duration-500 last:border-b-0 md:h-full md:w-1/2 md:border-b-0 md:border-r md:last:border-r-0 md:p-12 lg:p-16 pb-28 md:pb-28"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={panel.bgImage}
                alt={panel.title}
                fill
                priority
                className={cn(
                  'object-cover transition-all duration-1000 ease-out',
                  isHovered
                    ? 'scale-105 opacity-40 grayscale-0 contrast-115'
                    : 'scale-100 opacity-20 grayscale contrast-125',
                  isOtherHovered && 'opacity-10 blur-[2px]',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            </div>

            <div
              className={cn(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 hidden 2xl:block text-[10px] font-mono tracking-[0.35em] text-zinc-600 uppercase [writing-mode:vertical-rl] transition-colors duration-500 group-hover:text-primary/80',
                panel.align === 'left' ? 'left-8 rotate-180' : 'right-8',
              )}
            >
              {panel.meta}
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-primary backdrop-blur-md transition-all duration-300 group-hover:border-primary group-hover:bg-primary/20">
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
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-zinc-900/80 px-7 py-3 text-xs font-bold tracking-wider uppercase text-zinc-100 backdrop-blur-md transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-black group-hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] group-hover:scale-105">
                  <Icon className="h-4 w-4 text-primary group-hover:text-black transition-colors" />
                  <span>{panel.cta}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          </Link>
        )
      })}

      {/* BELİRGİN FOOTER & YASAL SÖZLEŞME MODALLARI */}
      <footer className="absolute bottom-0 inset-x-0 z-40 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10 py-3.5 bg-black/80 border-t border-white/10 backdrop-blur-xl text-xs font-mono text-zinc-400 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-white tracking-wider">ORISE CLUB</span>
          <span className="text-zinc-600">/</span>
          <span className="text-[11px] tracking-widest text-primary uppercase">ATHLETICS & STUDIO</span>
        </div>

        {/* Yasal Sözleşmeler / Gizlilik Metinleri */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveLegalModal('kvkk')}
            className="hover:text-primary transition-colors underline decoration-zinc-700 underline-offset-4"
          >
            KVKK
          </button>
          <span className="text-zinc-700">·</span>
          <button
            type="button"
            onClick={() => setActiveLegalModal('privacy')}
            className="hover:text-primary transition-colors underline decoration-zinc-700 underline-offset-4"
          >
            Gizlilik
          </button>
          <span className="text-zinc-700">·</span>
          <button
            type="button"
            onClick={() => setActiveLegalModal('terms')}
            className="hover:text-primary transition-colors underline decoration-zinc-700 underline-offset-4"
          >
            Mesafeli Satış
          </button>
          <span className="text-zinc-700">·</span>
          <button
            type="button"
            onClick={() => setActiveLegalModal('refund')}
            className="hover:text-primary transition-colors underline decoration-zinc-700 underline-offset-4"
          >
            İade Koşulları
          </button>
        </div>

        {/* Sosyal Medya Butonları */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.instagram.com/orisecommunity/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/90 px-3.5 py-1 text-xs text-zinc-200 backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-white"
          >
            <span className="font-semibold text-white group-hover:text-primary">Topluluğa Katıl</span>
          </a>

          <a
            href="https://www.instagram.com/orisestore/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/90 px-3.5 py-1 text-xs text-zinc-200 backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-white"
          >
            <span className="font-semibold text-white group-hover:text-primary">Mağazayı Keşfet</span>
          </a>

          <div className="flex items-center gap-2 pl-1 border-l border-white/10">
            <a
              href="mailto:oguzvir12@gmail.com"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 transition-colors hover:border-primary hover:text-white"
              title="E-posta İletişim"
            >
              <Mail className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* HUKUKİ METİN POP-UP MODAL */}
      {activeLegalModal && LEGAL_DOCS[activeLegalModal] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveLegalModal(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>Yasal Bilgilendirme</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="font-sans text-xl font-black text-white">
              {LEGAL_DOCS[activeLegalModal].title}
            </h3>

            <p className="text-xs font-sans leading-relaxed text-zinc-300 whitespace-pre-line">
              {LEGAL_DOCS[activeLegalModal].content}
            </p>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="rounded-full bg-primary px-6 py-2 text-xs font-bold uppercase text-black hover:scale-105 transition-transform"
              >
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GİRİŞ / KAYIT MODAL BİLEŞENİ */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
        }}
      />
    </section>
  )
}
