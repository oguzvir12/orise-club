import type { Metadata } from 'next'
import { SplitHero } from '@/components/home/split-hero'

export const metadata: Metadata = {
  title: 'ORISE CLUB — Topluluk & Mağaza',
  description:
    'Şehrin enerjisini birlikte yükselten yeni nesil spor topluluğu ve kulüp kültüründen ilham alan özel tasarım spor/sokak giyimi.',
}

export default function HomePage() {
  return (
    <main className="h-screen w-full overflow-hidden bg-black">
      <SplitHero />
    </main>
  )
}
