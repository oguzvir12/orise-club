import type { Metadata } from 'next'
import { Target, Telescope } from 'lucide-react'
import { EVENTS } from '@/lib/events'
import { EventCard } from '@/components/community/event-card'
import { InstagramIcon } from '@/components/icons/instagram-icon'

export const metadata: Metadata = {
  title: 'Community — ORISE CLUB',
  description:
    'Şehrin enerjisini birlikte yükseltiyoruz. Haftalık koşu, voleybol ve yoga etkinlikleri, canlı etkinlik takvimi.',
}

const INSTAGRAM = 'https://www.instagram.com/orisecommunity/'

export default function CommunityPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            ORISE Community
          </p>
          <h1 className="font-display max-w-3xl text-4xl font-bold leading-tight tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Şehrin Enerjisini{' '}
            <span className="text-gradient-orange">Birlikte</span>{' '}
            Yükseltiyoruz.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            More than a brand, a club. Koşu, voleybol, yoga ve tenisi bir yaşam
            tarzına dönüştüren, aynı frekanstaki insanların buluşma noktası.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="group rounded-3xl border border-border bg-card p-8 transition-colors hover:border-primary/40 lg:p-10">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Misyonumuz
            </h2>
            <p className="mt-4 text-xl leading-relaxed text-pretty">
              İnsanları tek başınalığın rutininden çıkararak; sporu bir yaşam
              tarzına, hareketi ise aynı frekanstaki insanlarla bağ kurmanın en
              keyifli yoluna dönüştürmek.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Koşudan yelkene, voleyboldan yogaya; performans baskısından uzak,
              samimi bir ekosistem.
            </p>
          </div>

          <div className="group rounded-3xl border border-border bg-card p-8 transition-colors hover:border-primary/40 lg:p-10">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary text-primary">
              <Telescope className="h-6 w-6" />
            </div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Vizyonumuz
            </h2>
            <p className="mt-4 text-xl leading-relaxed text-pretty">
              Geleneksel spor kulübü anlayışının ötesine geçerek; enerjisiyle
              şehrin sokaklarına, sahillerine ve doğasına yön veren, Türkiye'nin
              en ilham verici yeni nesil topluluk hareketi olmak.
            </p>
          </div>
        </div>
      </section>

      {/* Live Calendar */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Canlı Takvim
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Bu Haftanın Etkinlikleri
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Katılım ücretsiz, enerji sınırsız. Yerini ayırt ve topluluğa
              katıl.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram banner */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-border bg-card p-10 text-center transition-colors hover:border-primary/50 sm:p-16"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-500 group-hover:scale-110">
            <InstagramIcon className="h-8 w-8" />
          </div>
          <div className="relative space-y-2">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Harekete Instagram'dan Katıl
            </h2>
            <p className="text-lg font-medium text-primary">@orisecommunity</p>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Etkinlik duyuruları, buluşma kareleri ve topluluğun enerjisi için
              bizi takip et.
            </p>
          </div>
          <span className="relative inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground">
            Takip Et
          </span>
        </a>
      </section>
    </div>
  )
}
