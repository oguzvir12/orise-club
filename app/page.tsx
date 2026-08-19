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

      {/* Ekranın En Altındaki İki Taraflı İletişim & Kurumsal Barı */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between border-t border-border/40 bg-background/85 px-6 backdrop-blur-md text-xs text-muted-foreground sm:px-10 lg:px-14">
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
            <InstagramIcon className="h-3.5 w-3.5 text-primary" />
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

        {/* Orta: Telif & LinkedIn */}
        <div className="hidden md:flex items-center gap-2.5 text-[11px] font-medium tracking-wider uppercase opacity-80">
          <span>© 2026 ORISE CLUB</span>
          <span className="opacity-40">·</span>
          <a
            href="https://www.linkedin.com/company/orisecommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 normal-case font-semibold text-foreground transition-colors hover:text-primary"
            title="ORISE Community LinkedIn"
          >
            <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>

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
            <InstagramIcon className="h-3.5 w-3.5 text-primary" />
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
