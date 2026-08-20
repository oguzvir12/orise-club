import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Eğer kullanıcı giriş yapmadıysa ve /profile sayfasına girmeye çalışıyorsa
  if (!session && request.nextUrl.pathname.startsWith('/profile')) {
    // Ana sayfaya yönlendir
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}
