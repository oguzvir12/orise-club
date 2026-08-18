import type { Metadata } from 'next'
import Image from 'next/image'
import { Flame, Compass, ArrowUpRight } from 'lucide-react'
import { EVENTS } from '@/lib/events'
import { EventCard } from '@/components/community/event-card'
import { InstagramIcon } from '@/components/icons/instagram-icon'

export const metadata: Metadata = {
  title: 'Topluluk — ORISE CLUB',
  description:
    'Şehrin enerjisini birlikte yükseltiyoruz. Haftalık koşu, voleybol, yoga ve antrenman buluşmaları.',
}

const INSTAGRAM = 'https://www.instagram.com/orisecommunity/'

export default function CommunityPage() {
  return (
    <div className="pt-16">
      {/* Hero Alanı (Sinematik Arka Planlı) */}
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

      {/* Kulüp Değerleri (Eski Misyon/Vizyon yerine dinamik kartlar) */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Değer 1 */}
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

          {/* Değer 2 */}
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
              Tüm kulüp etkinliklerine katılım ücretsizdir. Kontenjan dolmadan yerini ayırt ve antrenmana katıl.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Kulüp Çağrısı */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-border bg-card/60 p-10 text-center backdrop-blur-sm transition-all duration-500 hover:border-primary/50 sm:p-16"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-500 group-hover:scale-110 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <InstagramIcon className="h-8 w-8" />
          </div>

          <div className="relative space-y-2">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Harekete Instagram'dan Katıl
            </h2>
            <p className="text-base font-semibold text-primary">@orisecommunity</p>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Haftalık etkinlik duyuruları, rota detayları ve buluşma anları için bizi takip et.
            </p>
          </div>

          <div className="relative inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]">
            <span>Kulübü Takip Et</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </a>
      </section>
    </div>
  )
}
