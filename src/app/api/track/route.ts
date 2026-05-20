import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    // 💡 문제가 되던 req.ip를 삭제하고, Vercel 환경에 맞는 헤더 추출 방식만 남겼습니다.
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // Supabase page_views 테이블에 데이터 삽입
    const { error } = await supabase.from('page_views').insert({
      page_url: url,
      ip_address: ip
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('기록 실패:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}