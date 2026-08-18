import type { Metadata } from 'next'
import { StoreGrid } from '@/components/store/store-grid'

export const metadata: Metadata = {
  title: 'Store — ORISE CLUB',
  description:
    'Kulübe özel sınırlı üretim tekstil koleksiyonları ve drop parçalar. Heavyweight cotton tişörtler, sweatshirtler, şapkalar ve ekipman.',
}

export default function StorePage() {
  return (
    <div className="pt-16">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            ORISE Store
          </p>
          <h1 className="font-display max-w-3xl text-4xl font-bold leading-tight tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Kulübe Özel <span className="text-gradient-orange">Drop</span>{' '}
            Koleksiyonu
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Sınırlı üretim tekstil parçaları. Premium kumaşlar, kulüp ruhuyla
            tasarlanmış detaylar — hepsi club-only.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StoreGrid />
      </section>
    </div>
  )
}
