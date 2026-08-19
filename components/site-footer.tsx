import { InstagramIcon } from '@/components/icons/instagram-icon'
import { Mail, Linkedin } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between border-t border-border/40 bg-background/90 px-6 backdrop-blur-xl text-xs text-muted-foreground sm:px-10 lg:px-14">
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

      {/* Merkez: Telif & LinkedIn */}
      <div className="flex items-center gap-2.5 text-[11px] font-medium tracking-wider uppercase">
        <span className="hidden md:inline opacity-70">© 2026 ORISE CLUB</span>
        <span className="hidden md:inline opacity-30">·</span>
        <a
          href="https://www.linkedin.com/company/orisecommunity"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold normal-case text-foreground transition-all hover:text-primary hover:scale-105"
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
    </footer>
  )
}
