import { SplitHero } from '@/components/home/split-hero'
import { InstagramIcon } from '@/components/icons/instagram-icon'
import { Mail, Linkedin } from 'lucide-react'

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
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden font-semibold text-foreground sm:inline">Topluluk:</span>
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
            <span className="hidden xl:inline">community@oriseclub.com</span>
            <span className="xl:hidden">E-posta</span>
          </a>
        </div>

        {/* Orta: Telif & LinkedIn (Tam Ekran Ortasına Sabitlendi) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
          <span className="hidden md:inline whitespace-nowrap opacity-70">© 2026 ORISE CLUB</span>
          <span className="hidden md:inline opacity-40">·</span>
          <a
            href="https://www.linkedin.com/company/orisecommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold normal-case text-foreground transition-colors hover:text-primary"
            title="ORISE Community LinkedIn"
          >
            <Linkedin className="h-3.5 w-3.5 text-primary" />
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Sağ Taraf: Store İletişim */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden font-semibold text-foreground sm:inline">Mağaza:</span>
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
            <span className="hidden xl:inline">store@oriseclub.com</span>
            <span className="xl:hidden">E-posta</span>
          </a>
        </div>
      </div>
    </main>
  )
}
