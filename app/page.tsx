'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import StoreContent from './store/page'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // URL hash veya search kısmında şifre sıfırlama / recovery token'ı var mı kontrol et
    const hash = window.location.hash
    const searchParams = new URLSearchParams(window.location.search)
    
    if (hash.includes('type=recovery') || hash.includes('access_token') || searchParams.get('type') === 'recovery') {
      // Kullanıcıyı ana sayfada bırakma, token ile birlikte doğrudan reset-password sayfasına yolla
      router.push(`/reset-password${hash}${window.location.search}`)
    }
  }, [router])

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <StoreContent />
    </Suspense>
  )
}
