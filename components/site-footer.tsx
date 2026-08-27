'use client'

import { InstagramIcon } from '@/components/icons/instagram-icon'
import { Mail, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between border-t border-border/40 bg-background/90 px-6 backdrop-blur-xl text-xs text-muted-foreground sm:px-10 lg:px-14">
      
      {/* Sol Taraf: İletişim & Sosyal */}
      <div className="flex items-center gap-3 sm:gap-4">
        <a
          href="https://www.instagram.com/orisecommunity/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
          title="Instagram"
        >
          <InstagramIcon className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">@orisecommunity</span>
        </a>
        <span className="opacity-30">·</span>
        <a
          href="mailto:community@oriseclub.com"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
          title="E-posta"
        >
          <Mail className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">community@oriseclub.com</span>
        </a>
      </div>

      {/* Orta: Yasal Sayfalar & Telif */}
      <div className="hidden md:flex items-center gap-3 text-[11px] font-medium tracking-wider uppercase">
        <span className="opacity-70">© 2026 ORISE CLUB</span>
        <span className="opacity-30">·</span>
        <Link href="/gizlilik" className="hover:text-primary transition-colors">Gizlilik</Link>
        <span className="opacity-30">·</span>
        <Link href="/mesafeli-satis" className="hover:text-primary transition-colors">Mesafeli Satış</Link>
        <span className="opacity-30">·</span>
        <Link href="/iade-kosullari" className="hover:text-primary transition-colors">İade</Link>
      </div>

      {/* Sağ Taraf: Güvenli Ödeme Logoları (Visa, Master, Troy, İyzico) */}
      <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-zinc-400">
        <span className="hidden lg:inline opacity-70 flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 256-bit SSL
        </span>
        <span className="hidden lg:inline opacity-30">|</span>
        <div className="flex items-center gap-1.5 font-bold uppercase text-[9px]">
          <span className="rounded bg-zinc-900 border border-white/10 px-1.5 py-0.5 text-blue-400">VISA</span>
          <span className="rounded bg-zinc-900 border border-white/10 px-1.5 py-0.5 text-amber-400">MC</span>
          <span className="rounded bg-zinc-900 border border-white/10 px-1.5 py-0.5 text-red-400">TROY</span>
          <span className="rounded bg-zinc-900 border border-white/10 px-1.5 py-0.5 text-primary">İYZİCO</span>
        </div>
      </div>

    </footer>
  )
}
