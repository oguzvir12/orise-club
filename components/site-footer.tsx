'use client'

import Link from 'next/link'
import { Instagram, Linkedin, Mail } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="w-full bg-black border-t border-white/10 text-zinc-400 font-sans text-xs py-6 px-6 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Sol: Marka & Künye */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="font-black text-white text-sm tracking-wider">ORISE CLUB</span>
            <span className="text-zinc-600">/</span>
            <span className="text-[10px] tracking-widest text-primary uppercase font-mono">ATHLETICS & STUDIO</span>
          </div>
          <p className="text-[11px] text-zinc-500">Yeni nesil spor topluluğu ve kulüp kültürü.</p>
        </div>

        {/* Orta: Yasal Sayfalar & Mailler */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono">
            <Link href="/hakkimizda" className="text-primary font-bold hover:underline uppercase">Hakkımızda</Link>
            <Link href="/gizlilik" className="hover:text-primary transition-colors uppercase">Gizlilik</Link>
            <Link href="/mesafeli-satis" className="hover:text-primary transition-colors uppercase">Mesafeli Satış</Link>
            <Link href="/iade-kosullari" className="hover:text-primary transition-colors uppercase">İptal & İade</Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-zinc-300">
            <a href="mailto:community@oriseclub.com" className="hover:text-primary transition-colors inline-flex items-center gap-1.5">
              <Mail className="h-3 w-3 text-primary" /> community@oriseclub.com
            </a>
            <span className="text-zinc-700">·</span>
            <a href="mailto:store@oriseclub.com" className="hover:text-primary transition-colors inline-flex items-center gap-1.5">
              <Mail className="h-3 w-3 text-primary" /> store@oriseclub.com
            </a>
          </div>
        </div>

        {/* Sağ: Sosyal Medya */}
        <div className="flex items-center justify-center gap-3">
          <a
            href="https://www.instagram.com/orisecommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-300 hover:border-primary hover:text-primary transition-all"
          >
            <Instagram className="h-3.5 w-3.5" /> @orisecommunity
          </a>
          <a
            href="https://www.instagram.com/orisestore"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-300 hover:border-primary hover:text-primary transition-all"
          >
            <Instagram className="h-3.5 w-3.5" /> @orisestore
          </a>
        </div>

      </div>
    </footer>
  )
}
