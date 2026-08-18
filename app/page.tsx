import { SplitHero } from '@/components/home/split-hero'
import { InstagramIcon } from '@/components/icons/instagram-icon'

export default function HomePage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      {/* İki taraflı split portal (Ekranı tam kaplar) */}
      <div className="h-full w-full">
        <SplitHero />
      </div>

      {/* Sayfa altındaki tek ve minimal bar */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between border-t border-border/40 bg-background/80 px-6 backdrop-blur-md text-xs text-muted-foreground sm:px-10">
        <span>© 2026 ORISE CLUB</span>

        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/orisecommunity/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium hover:text-primary transition-colors"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
            <span>@orisecommunity</span>
          </a>
          <span className="opacity-30">·</span>
          <a
            href="https://www.instagram.com/orisestore/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium hover:text-primary transition-colors"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
            <span>@orisestore</span>
          </a>
        </div>

        <span className="hidden sm:inline tracking-widest text-[10px] uppercase">ISTANBUL · TR</span>
      </div>
    </main>
  )
}
