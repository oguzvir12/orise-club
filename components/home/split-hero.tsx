import Link from 'next/link'
import { ArrowRight, ShoppingBag, Users } from 'lucide-react'
import { OriseMark } from '@/components/logo'

type Panel = {
  href: string
  eyebrow: string
  title: string
  subtitle: string
  cta: string
  icon: typeof Users
  align: 'left' | 'right'
}

const PANELS: Panel[] = [
  {
    href: '/community',
    eyebrow: 'Topluluk',
    title: 'ORISE COMMUNITY',
    subtitle:
      'More than a brand, a club. Koşu, voleybol, yoga, tenis ve haftalık etkinlikler.',
    cta: 'Topluluğa Katıl & Takvimi İncele',
    icon: Users,
    align: 'left',
  },
  {
    href: '/store',
    eyebrow: 'Koleksiyon',
    title: 'ORISE STORE',
    subtitle:
      'Kulübe özel sınırlı üretim tekstil koleksiyonları ve drop parçalar.',
    cta: 'Koleksiyonu Keşfet',
    icon: ShoppingBag,
    align: 'right',
  },
]

export function SplitHero() {
  return (
    <section className="relative grid min-h-[92vh] grid-cols-1 md:min-h-screen md:grid-cols-2">
      {/* center emblem at the split seam */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background/80 shadow-[0_0_60px_rgba(249,115,22,0.25)] backdrop-blur">
          <OriseMark className="h-12 w-12 text-primary" />
        </div>
      </div>
      {PANELS.map((panel) => {
        const Icon = panel.icon
        return (
          <Link
            key={panel.href}
            href={panel.href}
            className="group relative flex min-h-[50vh] flex-col justify-end overflow-hidden border-b border-border p-8 transition-colors last:border-b-0 md:min-h-full md:border-b-0 md:border-r md:p-14 md:last:border-r-0"
          >
            {/* animated wash */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div
                className={`absolute h-[420px] w-[420px] rounded-full bg-primary/25 blur-[120px] ${
                  panel.align === 'left'
                    ? '-left-20 top-1/3'
                    : '-right-20 top-1/4'
                }`}
              />
            </div>

            {/* giant ghost index */}
            <span className="pointer-events-none absolute right-6 top-6 font-display text-[26vw] font-bold leading-none text-foreground/[0.03] transition-transform duration-700 group-hover:scale-110 md:text-[14vw]">
              {panel.align === 'left' ? '01' : '02'}
            </span>

            <div className="relative z-10 max-w-lg">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary text-primary transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                {panel.eyebrow}
              </p>
              <h2 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {panel.title}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
                {panel.subtitle}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {panel.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        )
      })}
    </section>
  )
}
