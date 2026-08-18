import { Activity, Sparkles, Users, Waves } from 'lucide-react'
import { SplitHero } from '@/components/home/split-hero'

const MISSION_ITEMS = [
  {
    icon: Users,
    title: 'Bir Topluluk',
    text: 'Aynı frekanstaki insanlarla bağ kurmanın en keyifli hali.',
  },
  {
    icon: Activity,
    title: 'Hareket Odaklı',
    text: 'Koşudan voleybola, yogadan tenise; performans baskısından uzak.',
  },
  {
    icon: Waves,
    title: 'Şehrin Enerjisi',
    text: 'Sokaklara, sahillere ve doğaya yön veren yeni nesil hareket.',
  },
  {
    icon: Sparkles,
    title: 'Kulübe Özel',
    text: 'Sınırlı üretim drop koleksiyonları ve club-only ayrıcalıklar.',
  },
]

export default function HomePage() {
  return (
    <div className="pt-16">
      <SplitHero />

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            <span className="font-display font-semibold text-foreground">
              ORISE
            </span>{' '}
            — insanları tek başınalığın rutininden çıkararak sporu bir yaşam
            tarzına, hareketi ise bağ kurmanın en keyifli yoluna dönüştüren bir
            kulüp.
          </p>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {MISSION_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 bg-card p-6 transition-colors hover:bg-secondary"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
