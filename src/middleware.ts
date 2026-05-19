// src/middleware.ts
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

  // [수정 포인트] /admin 경로 접근 제어
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // ⭐️ 중요: DB의 profiles 테이블 권한 확인 (RPC나 직접 쿼리가 안되므로 metadata 우선 활용)
    // 혹은 metadata에 role이 아직 'user'로 남아있는지 확인해보세요.
    if (user.user_metadata?.role !== 'admin') {
       // 만약 DB만 수정하고 metadata를 안바꿨다면 여기서 걸릴 수 있습니다.
       // 테스트를 위해 이 조건문만 잠시 주석 처리해보고 접속되는지 보세요.
       // return NextResponse.redirect(new URL('/', request.url)) 
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}