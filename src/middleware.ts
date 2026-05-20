import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 1. /admin 경로 접근 제어 (인증이 필요한 영역)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 2. 보안 점수 측정 로직 (모든 방문자에게 적용!)
  let score = 50; 
  const requestHeaders = request.headers;
  
  // HTTPS 확인
  if (requestHeaders.get('x-forwarded-proto') === 'https') score += 30;
  
  // 브라우저 환경 보안 점수
  const ua = requestHeaders.get('user-agent') || '';
  if (ua.includes('Windows') || ua.includes('Mac OS X')) score += 20;
  
  // 계산된 점수를 쿠키에 저장
  // 모든 경로에서 점수를 사용할 수 있도록 'if' 문 밖으로 뺐습니다.
  response.cookies.set('security-score', score.toString(), { 
    path: '/', 
    httpOnly: false,
    secure: false, 
    sameSite: 'lax'
  });

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}