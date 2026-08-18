import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Space_Grotesk } from 'next/font/google'
import { CartProvider } from '@/components/cart/cart-provider'
import { SiteHeader } from '@/components/site-header'
import { CartDrawer } from '@/components/cart/cart-drawer'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'ORISE CLUB — More Than a Brand, a Club',
  description:
    'ORISE — Şehrin enerjisini birlikte yükselten yeni nesil topluluk hareketi. Koşu, voleybol, yoga, tenis ve haftalık etkinlikler. Kulübe özel sınırlı üretim tekstil koleksiyonları.',
  generator: 'v0.app',
  metadataBase: new URL('https://oriseclub.com'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'ORISE CLUB — More Than a Brand, a Club',
    description:
      'Şehrin enerjisini birlikte yükselten yeni nesil topluluk hareketi ve kulübe özel drop koleksiyonlar.',
    url: 'https://oriseclub.com',
    siteName: 'ORISE CLUB',
    locale: 'tr_TR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#09090b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="tr"
      className={`${geist.variable} ${spaceGrotesk.variable} bg-background`}
    >
      <body className="font-sans antialiased text-foreground bg-background">
        <CartProvider>
          <SiteHeader />
          <div className="w-full">{children}</div>
          <CartDrawer />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
