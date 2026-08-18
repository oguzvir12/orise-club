import type { Metadata } from 'next'
import Image from 'next/image'
import { Flame, Compass, ArrowUpRight, MessageSquareHeart, Zap, Handshake } from 'lucide-react'
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

export default function CommunityPage() {
  return (
    <div className="pt-16">
      {/* 1. Sinematik Hero Alanı */}
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

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
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

      {/* 2. Canlı Etkinlik Takvimi & Branş Filtresi */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
          <div className="mb-8 flex flex-col gap-3">
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
              Tüm kulüp etkinliklerine katılım ücretsizdir. Branşını seç ve yerini ayırt.
            </p>
          </div>

          <EventList events={EVENTS} />
        </div>
      </section>

      {/* 3. Kulüp Felsefesi */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Zap className="h-3.5 w-3.5" />
            Kulüp Felsefesi
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Neden Birlikte Koşuyor ve Oynuyoruz?
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card lg:p-10">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary text-primary transition-transform duration-300 group-hover:scale-110">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Performans Baskısı Yok, Birlikte Hareket Var
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Kimsenin geride kalmadığı, yarışmak yerine hareket etmenin ve birlikte sosyalleşmenin keyfine odaklanan samimi bir kulüp ekosistemi.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card lg:p-10">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary text-primary transition-transform duration-300 group-hover:scale-110">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Dört Duvarın Dışında, Şehrin Kalbinde
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Klasik spor salonu rutinlerinden uzaklaşarak sahil şeridini, parkları ve açık hava tesislerini antrenman sahasına dönüştürüyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Katılım, İş Birliği & İletişim (3 Sütunlu Grid) */}
      <section className="border-t border-border bg-card/20">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <div className="grid gap-6 md:grid-cols-3">
            {/* 1: Instagram */}
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-border bg-card/60 p-8 text-center backdrop-blur-sm transition-all duration-500 hover:border-primary/50"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-transform duration-500 group-hover:scale-110">
                <InstagramIcon className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold">Topluluğa Katıl</h3>
                <p className="text-sm font-semibold text-primary">@orisecommunity</p>
                <p className="text-xs text-muted-foreground">
                  Haftalık etkinlik duyuruları ve buluşma kareleri için bizi takip et.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                <span>Takip Et</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </a>

            {/* 2: Kulüp Ekibi & İş Birliği */}
            <a
              href={COLLAB_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-primary/40 bg-card/80 p-8 text-center backdrop-blur-sm shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-500 hover:border-primary hover:shadow-[0_0_40px_rgba(249,115,22,0.2)]"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/50 bg-primary/10 text-primary shadow-[0_0_25px_rgba(249,115,22,0.2)] transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                <Handshake className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold">Ekip & İş Birliği</h3>
                <p className="text-sm font-semibold text-primary">Birlikte Büyütelim</p>
                <p className="text-xs text-muted-foreground">
                  Eğitmenlik, branş sorumluluğu, saha gönüllülüğü veya sponsorluk için başvur.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                <span>Bize Katıl</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </a>

            {/* 3: Geri Bildirim */}
            <a
              href={FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-border bg-card/60 p-8 text-center backdrop-blur-sm transition-all duration-500 hover:border-primary/50"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary text-primary transition-transform duration-500 group-hover:scale-110 group-hover:border-primary">
                <MessageSquareHeart className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold">Geri Bildirim</h3>
                <p className="text-sm font-semibold text-primary">Fikirlerini Paylaş</p>
                <p className="text-xs text-muted-foreground">
                  Topluluk önerileri veya deneyiminle ilgili düşüncelerini bize yaz.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <span>Formu Aç</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
