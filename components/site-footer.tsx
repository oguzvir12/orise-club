'use client'

import { InstagramIcon } from '@/components/icons/instagram-icon'
import { Mail, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function SiteFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between border-t border-white/10 bg-black/95 px-4 sm:px-8 backdrop-blur-xl text-xs text-zinc-400">
      
      {/* Sol Taraf: Sosyal & İletişim */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs">
        <a
          href="https://www.instagram.com/orisecommunity/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-white hover:text-primary transition-colors"
        >
          <InstagramIcon className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">@orisecommunity</span>
        </a>
        <span className="opacity-30">·</span>
        <a
          href="mailto:community@oriseclub.com"
          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
        >
          <Mail className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">community@oriseclub.com</span>
        </a>
      </div>

      {/* Orta: Yasal Linkler */}
      <div className="hidden md:flex items-center gap-2.5 text-[10px] font-mono tracking-wider uppercase">
        <Link href="/gizlilik" className="hover:text-primary transition-colors">Gizlilik</Link>
        <span>·</span>
        <Link href="/mesafeli-satis" className="hover:text-primary transition-colors">Mesafeli Satış</Link>
        <span>·</span>
        <Link href="/iade-kosullari" className="hover:text-primary transition-colors">İade</Link>
      </div>

      {/* Sağ Taraf: SSL ve Resmi İyzico Logosu */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
          <ShieldCheck className="h-3.5 w-3.5" /> 256-BIT SSL
        </span>
        <div className="flex items-center bg-zinc-900/80 border border-white/10 px-2.5 py-1 rounded-lg">
          <Image 
            src="/images/logo_band_white.svg" 
            alt="İyzico Güvenli Ödeme" 
            width={90} 
            height={18} 
            className="object-contain h-4 w-auto"
          />
        </div>
      </div>

    </footer>
  )
}
