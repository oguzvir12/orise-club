import Link from 'next/link'
import { Mail } from 'lucide-react'
import { InstagramIcon } from '@/components/icons/instagram-icon'
import { Logo } from '@/components/logo'

const INSTAGRAM = 'https://www.instagram.com/orisecommunity/'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              More than a brand, a club. Şehrin enerjisini birlikte yükselten
              yeni nesil topluluk hareketi.
            </p>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <InstagramIcon className="h-4 w-4" />
              @orisecommunity
            </a>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
              Keşfet
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/community"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/store"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Store
                </Link>
              </li>
              <li>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
              İletişim
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:community@oriseclub.com"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  community@oriseclub.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:store@oriseclub.com"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  store@oriseclub.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 ORISE CLUB. All Rights Reserved.</p>
          <p className="tracking-widest">ISTANBUL · TÜRKİYE</p>
        </div>
      </div>
    </footer>
  )
}
