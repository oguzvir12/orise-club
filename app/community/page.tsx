import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Flame,
  Compass,
  ArrowUpRight,
  MessageSquareHeart,
  Zap,
  Handshake,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'
import { EVENTS } from '@/lib/events'
import { EventList } from '@/components/community/event-list'
import { InstagramIcon } from '@/components/icons/instagram-icon'

export const metadata: Metadata = {
  title: 'Topluluk — ORISE CLUB',
  description:
    'Şehrin enerjisini birlikte yükseltiyoruz. Haftalık koşu, voleybol, yoga ve antrenman buluşmaları.',
}

const INSTAGRAM = 'https://www.instagram.com/orisecommunity/'
const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfJRN2-iQXB7Cq958-2dITBaAYALQ983dUJac8MgXZQysa2hg/viewform'
const COLLAB_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSckFjiI_x64YZ2n5R47cnKoZ48nxE9QZZOmWmBDDzN7Wx--yA/viewform'

const PILLARS = [
  {
    num: '01',
    icon: Flame,
    title: 'Performans Baskısı Yok',
    desc: 'Kimsenin geride kalmadığı, yarışmak yerine hareket etmenin ve birlikte sosyalleşmenin keyfine odaklanan samimi bir kulüp ekosistemi.',
  },
  {
    num: '02',
    icon: Compass,
    title: 'Şehrin Açık Sahaları',
    desc: 'Klasik spor salonu rutinlerinden uzaklaşarak sahil şeridini, parkları ve açık hava tesislerini antrenman alanına dönüştürüyoruz.',
  },
  {
    num: '03',
    icon: Sparkles,
    title: 'Kültür, Kahve & Sohbet',
    desc: 'Spor bittiğinde dağılmıyoruz; lokal partnerlerimizde kahve, sağlıklı ikramlar ve topluluk sohbetleriyle şehri paylaşıyoruz.',
  },
]

export default function CommunityPage() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      {/* Sol Üst Sabit Ana Sayfa Butonu */}
      <div className="fixed top-4 left-6 z-[60] sm:left-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.35)]"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Ana Sayfa</span>
        </Link>
      </div>

      {/* 1. ASİMETRİK EDİTORYAL HERO */}
      <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/community-hero.jpeg"
            alt="ORISE Topluluk Hareketi"
            fill
            priority
            className="object-cover opacity-25 grayscale contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span>ORISE TOPLULUK HAREKETİ</span>
              </div>

              <h1 className="font-sans text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl leading-[1.05]">
                Şehrin Enerjisini{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
                  Birlikte
                </span>{' '}
                Yükseltiyoruz.
              </h1>

              <p className="max-w-2xl text-base font-normal leading-relaxed text-zinc-300 sm:text-lg">
                Tek başınalıktan çık, şehre karış. Koşu, voleybol, tenis, yoga ve açık hava
                antrenmanlarını bir yaşam tarzına dönüştüren yeni nesil spor kulübü.
              </p>
            </div>

            <div className="hidden lg:col-span-4 lg:flex flex-col items-end justify-end space-y-2 text-right">
              <div className="text-xs font-mono tracking-[0.3em] text-primary/80 uppercase">
                [ ISTANBUL / 41.0082° N ]
              </div>
              <div className="text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                RUN · VOLLEYBALL · TENNIS · YOGA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ETKİNLİK TAKVİMİ */}
      <section className="border-b border-white/10 bg-zinc-950/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>HAFTALIK TAKVİM</span>
              </div>
              <h2 className="font-sans text-3xl font-black tracking-tight text-white sm:text-4xl">
                Buluşma Programı
              </h2>
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              BRANŞINI SEÇ · YERİNİ AYIRT
            </p>
          </div>

          <EventList events={EVENTS} />
        </div>
      </section>

      {/* 3. KULÜP DEĞERLERİ (NUMARALI YATAY EDİTORYAL BLOK) */}
      <section className="py-24 sm:py-28 border-b border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/10 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Zap className="h-3.5 w-3.5" />
                <span>KULÜP FELSEFESİ</span>
              </div>
              <h2 className="mt-2 font-sans text-3xl font-black tracking-tight text-white sm:text-4xl">
                Nasıl Hareket Ediyoruz?
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              [ 3 TEMEL İLKE ]
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between border-l border-white/15 pl-6 transition-all duration-300 hover:border-primary"
                >
                  <div>
                    <div className="flex items-center justify-between text-zinc-600 group-hover:text-primary transition-colors mb-6">
                      <span className="text-xs font-mono tracking-widest">{pillar.num}</span>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-sans text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. KATILIM, İŞ BİRLİĞİ & İLETİŞİM HUB */}
      <section className="bg-zinc-950 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Instagram */}
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-zinc-900/30 p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/60 hover:bg-zinc-900/80"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-black">
                  <InstagramIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-sans text-xl font-bold text-white">Topluluğa Katıl</h3>
                <p className="mt-1 text-xs font-mono text-primary uppercase tracking-wider">@orisecommunity</p>
                <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                  Haftalık etkinlik duyuruları ve buluşma hikayeleri için bizi takip et.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-bold uppercase tracking-widest text-zinc-300 group-hover:text-primary transition-colors">
                <span>Instagram'a Git</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>

            {/* İş Birliği */}
            <a
              href={COLLAB_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between rounded-3xl border border-primary/30 bg-primary/[0.03] p-8 backdrop-blur-md transition-all duration-500 hover:border-primary hover:bg-primary/[0.08]"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-black">
                  <Handshake className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-sans text-xl font-bold text-white">Ekip & İş Birliği</h3>
                <p className="mt-1 text-xs font-mono text-primary uppercase tracking-wider">Birlikte Büyütelim</p>
                <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                  Eğitmenlik, branş sorumluluğu, saha gönüllülüğü veya sponsorluk başvurusu.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-primary/20 pt-4 text-xs font-bold uppercase tracking-widest text-primary transition-colors">
                <span>Başvuru Formu</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>

            {/* Geri Bildirim */}
            <a
              href={FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-zinc-900/30 p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/60 hover:bg-zinc-900/80"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-black">
                  <MessageSquareHeart className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-sans text-xl font-bold text-white">Geri Bildirim</h3>
                <p className="mt-1 text-xs font-mono text-zinc-400 uppercase tracking-wider">Fikirlerini Paylaş</p>
                <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                  Topluluk önerileri veya antrenman deneyiminle ilgili düşüncelerini bize ilet.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-bold uppercase tracking-widest text-zinc-300 group-hover:text-primary transition-colors">
                <span>Görüş Bildir</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
