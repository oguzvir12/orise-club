import type { Metadata } from 'next'
import Image from 'next/image'
import { Flame, Compass, ArrowUpRight, MessageSquareHeart } from 'lucide-react'
import { EVENTS } from '@/lib/events'
import { EventCard } from '@/components/community/event-card'
import { InstagramIcon } from '@/components/icons/instagram-icon'

export const metadata: Metadata = {
  title: 'Topluluk — ORISE CLUB',
  description:
    'Şehrin enerjisini birlikte yükseltiyoruz. Haftalık koşu, voleybol, yoga ve antrenman buluşmaları.',
}

const INSTAGRAM = 'https://www.instagram.com/orisecommunity/'
const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfJRN2-iQXB7Cq958-2dITBaAYALQ983dUJac8MgXZQysa2hg/viewform'

export default function CommunityPage() {
  return (
    <div className="pt-16">
      {/* Hero Alanı */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1600&auto=format&fit=crop"
            alt="ORISE Topluluk Koşusu"
            fill
            priority
            className="object-cover grayscale contrast-125 opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            ORISE Topluluk Hareketi
          </div>
          <h1 className="font-display max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Şehrin Enerjisini{' '}
            <span className="text-primary">Birlikte</span>{' '}
            Yükseltiyoruz.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
            Tek başınalıktan çık, şehre karış. Koşu, voleybol, yoga ve açık hava
            antrenmanlarını bir yaşam tarzına dönüştüren yeni nesil spor kulübü.
          </p>
        </div>
      </section>

      {/* Kulüp Değerleri */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-3xl border border-border bg-card/60 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card lg:p-10">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary/80 text-primary transition-transform duration-300 group-hover:scale-110">
              <Flame className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              01 / KULÜP RUHU
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground">
              Performans Baskısı Yok, Birlikte Hareket Var.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Koşudan sahile, voleyboldan yogaya; kimsenin geride kalmadığı, sadece hareket etmenin ve şehri paylaşmanın keyfine odaklanan samimi bir ekosistem.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-border bg-card/60 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card lg:p-10">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary/80 text-primary transition-transform duration-300 group-hover:scale-110">
              <Compass className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              02 / ŞEHİR VE DOĞA
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground">
              Klasik Salonların Dışında, Açık Havada.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Dört duvar arasına sıkışmak yerine şehrin sokaklarını, sahillerini ve parklarını antrenman alanına dönüştüren modern bir kulüp deneyimi.
            </p>
          </div>
        </div>
      </section>

      {/* Canlı Etkinlik Takvimi */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Haftalık Takvim
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Bu Haftanın Buluşmaları
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Tüm kulüp etkinliklerine katılım ücretsizdir. Kontenjan dolmadan formdan kaydını tamamla.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Alt Bölüm: Instagram ve İletişim & Geri Bildirim Formu */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Instagram Kutusu */}
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-border bg-card/60 p-8 text-center backdrop-blur-sm transition-all duration-500 hover:border-primary/50 lg:p-12"
          >
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-transform duration-500 group-hover:scale-110">
              <InstagramIcon className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold">Harekete Instagram'dan Katıl</h3>
              <p className="text-sm font-semibold text-primary">@orisecommunity</p>
              <p className="text-xs text-muted-foreground">
                Haftalık etkinlik duyuruları ve buluşma kareleri için topluluğu takip et.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
              <span>Takip Et</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </a>

          {/* Geri Bildirim & İletişim Kutusu */}
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-border bg-card/60 p-8 text-center backdrop-blur-sm transition-all duration-500 hover:border-primary/50 lg:p-12"
          >
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary text-primary shadow-[0_0_25px_rgba(255,255,255,0.05)] transition-transform duration-500 group-hover:scale-110 group-hover:border-primary">
              <MessageSquareHeart className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold">İletişim & Geri Bildirim</h3>
              <p className="text-sm font-semibold text-primary">Fikirlerini Paylaş</p>
              <p className="text-xs text-muted-foreground">
                Topluluk önerileri, iş birliği veya ürün geri bildirimleri için bize yazabilirsin.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <span>Formu Doldur</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </a>
        </div>
      </section>
    </div>
  )
}
