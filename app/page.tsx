import { SplitHero } from '@/components/home/split-hero'

export default function HomePage() {
  return (
    <main className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-background">
      {/* İki taraflı split alanını ekranın tamamına yayar */}
      <div className="flex-1 w-full h-full">
        <SplitHero />
      </div>

      {/* Ekranın en altında sabit, ince, transparan kulüp barı */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex h-12 items-center justify-between border-t border-border/40 bg-background/70 px-6 backdrop-blur-md text-xs text-muted-foreground">
        <span>© 2026 ORISE CLUB</span>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/orisecommunity/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors font-medium"
          >
            @orisecommunity
          </a>
          <span className="opacity-40">·</span>
          <a
            href="https://www.instagram.com/orisestore/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors font-medium"
          >
            @orisestore
          </a>
        </div>
        <span className="hidden sm:inline tracking-widest text-[10px] uppercase">Istanbul · TR</span>
      </div>
    </main>
  )
}
