'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin, Mail } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="w-full bg-black border-t border-white/10 text-zinc-400 font-sans text-xs py-10 px-6 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-between">
        
        {/* Sol: Marka & Künye */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="font-black text-white text-sm tracking-wider">ORISE CLUB</span>
            <span className="text-zinc-600">/</span>
            <span className="text-[10px] tracking-widest text-primary uppercase font-mono">ATHLETICS & STUDIO</span>
          </div>
          <p className="text-[11px] text-zinc-500">Yeni nesil spor topluluğu ve kulüp kültürü.</p>
        </div>

        {/* Orta: Departman Mailleri & Yasal Sayfalar */}
        <div className="flex flex-col md:items-center space-y-3">
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <Link href="/gizlilik" className="hover:text-primary transition-colors uppercase">Gizlilik Politikası</Link>
            <Link href="/mesafeli-satis" className="hover:text-primary transition-colors uppercase">Mesafeli Satış</Link>
            <Link href="/iade-kosullari" className="hover:text-primary transition-colors uppercase">İptal & İade</Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-[11px] font-mono text-zinc-300">
            <a href="mailto:community@oriseclub.com" className="hover:text-primary transition-colors inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" /> community@oriseclub.com
            </a>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <a href="mailto:store@oriseclub.com" className="hover:text-primary transition-colors inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" /> store@oriseclub.com
            </a>
          </div>
        </div>

        {/* Sağ: Doğru Sosyal Medya Hesapları ve Güvenlik Rozetleri */}
        <div className="flex items-center justify-start md:justify-end gap-3">
          <a
            href="https://www.instagram.com/orisecommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-300 hover:border-primary hover:text-primary transition-all"
            title="Topluluk Instagram"
          >
            <Instagram className="h-3.5 w-3.5" /> @orisecommunity
          </a>
          <a
            href="https://www.instagram.com/orisestore"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-300 hover:border-primary hover:text-primary transition-all"
            title="Mağaza Instagram"
          >
            <Instagram className="h-3.5 w-3.5" /> @orisestore
          </a>
          <a
            href="https://www.linkedin.com/company/orisecommunity/?viewAsMember=true"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-zinc-900 text-zinc-300 hover:border-primary hover:text-primary transition-all"
            title="LinkedIn"
          >
            <Linkedin className="h-3.5 w-3.5" />
          </a>
        </div>

      </div>
    </footer>
  )
}
