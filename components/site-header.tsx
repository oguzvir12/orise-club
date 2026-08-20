'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border/80 bg-background/85 backdrop-blur-2xl py-3.5 shadow-2xl'
          : 'border-b border-transparent bg-gradient-to-b from-background/90 via-background/40 to-transparent py-5',
      )}
    >
      <div className="relative flex w-full items-center justify-between px-6 sm:px-10 lg:px-14">
        <div className="flex w-10 items-center" />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link
            href="/"
            aria-label="ORISE CLUB Ana Sayfa"
            className="transition-transform duration-300 hover:scale-105"
          >
            <Logo />
          </Link>
        </div>

        {/* Sağ üstteki sepet butonu kaldırıldı, temiz alan bırakıldı */}
        <div className="flex items-center" />
      </div>
    </header>
  )
}
