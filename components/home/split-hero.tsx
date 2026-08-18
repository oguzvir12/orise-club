import Link from 'next/link'
import { ArrowUpRight, ShoppingBag, Users } from 'lucide-react'
import { OriseMark } from '@/components/logo'

const PANELS = [
  {
    href: '/community',
    num: '01',
    eyebrow: 'Topluluk & Hareket',
    title: 'ORISE COMMUNITY',
    subtitle:
      'Koşu, voleybol, yoga, tenis ve haftalık etkinlikler. Şehrin yeni nesil kulüp enerjisi.',
    cta: 'Topluluğa Katıl & Takvim',
    icon: Users,
    glowPosition: '-left-20 top-1/2 -translate-y-1/2',
  },
  {
    href: '/store',
    num: '02',
    eyebrow: 'Koleksiyon & Drop',
    title: 'ORISE STORE',
    subtitle:
      'Kulübe özel teknik kumaşlar, sınırlı sayıda drop parçalar ve yeni nesil spor koleksiyonları.',
    cta: 'Koleksiyonu Keşfet',
    icon: ShoppingBag,
    glowPosition: '-right-20 top-1/2 -translate-y-1/2',
  },
]

export function SplitHero() {
  return (
    <section className="relative grid h-full w-full grid-cols-1 overflow-hidden md:grid-cols-2">
      {/* Merkez Logo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border/80 bg-background/90 shadow-[0_0_50px_rgba(249,115,22,0.25)] backdrop-blur-md">
          <OriseMark className="h-10 w-10 text-primary" />
        </div>
      </div>

      {PANELS.map((panel) => {
        const Icon = panel.icon
        return (
          <Link
            key={panel.href}
            href={panel.href}
            className="group relative flex h-full flex-col justify-center border-b border-border/50 p-8 transition-colors last:border-b-0 md:border-b-0 md:border-r md:p-14 lg:p-20 md:last:border-r-0"
          >
            {/* Arka Plan Işık Efekti */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-card/40 to-background" />
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
              <div
                className={`absolute h-[400px] w-[400px] rounded-full bg-primary/15 blur-[120px] ${panel.glowPosition}`}
              />
            </div>

            {/* 01 - 02 Devasa Sayılar (Dikeyde Tam Merkeze Hizalı) */}
            <span className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 font-display text-[24vw] font-black leading-none text-foreground/[0.03] transition-transform duration-700 group-hover:scale-105 select-none md:text-[14vw]">
              {panel.num}
            </span>

            {/* Kart İçeriği */}
            <div className="relative z-10 max-w-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary/80 text-primary backdrop-blur-sm transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground md:h-14 md:w-14">
                <Icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                {panel.eyebrow}
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                {panel.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                {panel.subtitle}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground transition-colors group-hover:text-primary md:mt-8">
                {panel.cta}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </Link>
        )
      })}
    </section>
  )
}
