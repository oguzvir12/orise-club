'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { useCart } from '@/components/cart/cart-provider'

export function SiteHeader() {
  const { count, openCart } = useCart()
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

        <div className="flex items-center">
          <button
            type="button"
            onClick={openCart}
            aria-label="Sepeti aç"
            className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-secondary/60 text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_20px_rgba(249,115,22,0.25)] cursor-pointer"
          >
            <ShoppingBag className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground shadow-[0_0_10px_rgba(249,115,22,0.6)]">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
