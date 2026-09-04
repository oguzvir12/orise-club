import Link from 'next/link';
import { ShoppingBag, Calendar, Users, Home } from 'lucide-react';

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans">
      {/* ORISE STORE Köprüsü / Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-between">
        <span className="truncate">🔥 Yeni Pacer Koleksiyonu yayında! İlk sen keşfet.</span>
        <Link
          href="https://oriseclub.com"
          target="_blank"
          className="bg-black/30 hover:bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all shrink-0 ml-2"
        >
          <ShoppingBag size={12} />
          ORISE STORE'a Git ↗
        </Link>
      </div>

      {/* Topluluk Üst Navigasyonu */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/community" className="text-xl font-extrabold tracking-wider text-orange-500">
            ORISE <span className="text-white">COMMUNITY</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <Link href="/community" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Calendar size={16} /> Etkinlikler
            </Link>
            <Link href="/community/profile" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Users size={16} /> Profilim & Ekip
            </Link>
          </nav>
        </div>
        <Link
          href="https://oriseclub.com"
          target="_blank"
          className="text-xs border border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white px-3 py-1.5 rounded-lg transition-all font-medium"
        >
          Ana Mağaza ↗
        </Link>
      </header>

      {/* Sayfa İçeriği */}
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
