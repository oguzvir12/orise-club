import { SplitHero } from '@/components/home/split-hero'
import { InstagramIcon } from '@/components/icons/instagram-icon'
import { Mail } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      {/* İki taraflı split portal */}
      <div className="h-full w-full">
        <SplitHero />
      </div>

      {/* Ekranın En Altındaki İki Taraflı İletişim Barı */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between border-t border-border/40 bg-background/85 px-6 backdrop-blur-md text-xs text-muted-foreground sm:px-12">
        {/* Sol Taraf: Community İletişim */}
        <div className="flex items-center gap-4">
          <span className="hidden font-semibold text-foreground md:inline">Topluluk:</span>
          <a
            href="https://www.instagram.com/orisecommunity/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
            title="Instagram Topluluk Sayfası"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
            <span>@orisecommunity</span>
          </a>
          <span className="opacity-30">·</span>
          <a
            href="mailto:community@oriseclub.com"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            title="Topluluk E-posta"
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">community@oriseclub.com</span>
            <span className="lg:hidden">E-posta</span>
          </a>
        </div>

        {/* Orta: Telif Bilgisi */}
        <span className="hidden xl:inline text-[11px] opacity-60">© 2026 ORISE CLUB</span>

        {/* Sağ Taraf: Store İletişim */}
        <div className="flex items-center gap-4">
          <span className="hidden font-semibold text-foreground md:inline">Mağaza:</span>
          <a
            href="https://www.instagram.com/orisestore/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
            title="Instagram Mağaza Sayfası"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
            <span>@orisestore</span>
          </a>
          <span className="opacity-30">·</span>
          <a
            href="mailto:store@oriseclub.com"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            title="Mağaza E-posta"
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">store@oriseclub.com</span>
            <span className="lg:hidden">E-posta</span>
          </a>
        </div>
      </div>
    </main>
  )
}
