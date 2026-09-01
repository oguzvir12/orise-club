import type { Metadata } from 'next'
import { Suspense } from 'react'
import StoreContent from './store/page' // Doğrudan mağaza bileşenini ana sayfaya taşıyoruz

export const metadata: Metadata = {
  title: 'ORISE STORE — Hareket Kulübü & Stüdyo Mağazası',
  description: 'Kulüp kültüründen ilham alan özel tasarım teknik spor giyim ve sokak stili e-ticaret mağazası.',
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <StoreContent />
    </Suspense>
  )
}
