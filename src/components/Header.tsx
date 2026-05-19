'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  // 1. DB의 profiles 테이블에서 사용자의 실제 권한(role)을 가져오는 함수
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setRole(data.role);
      }
    } catch (err) {
      console.error("프로필 로드 에러:", err);
    }
  };

  useEffect(() => {
    // 2. 초기 로드 시 유저 정보 확인
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchProfile(user.id);
    };
    getUser();

    // 3. 인증 상태 실시간 구독 (로그인/로그아웃 즉시 반영)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 4. 로그아웃 핸들러: 세션 종료 후 메인 페이지로 강제 이동
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/'); // 보안 구역에서 일반 구역으로 리다이렉트
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 border-b border-white/10 bg-black/50 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        
        {/* 로고 영역 */}
        <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity">
          EDGE SECURITY
        </Link>

        {/* 메뉴 + 인증 영역 */}
        <div className="flex items-center gap-8">
          
          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex gap-8">
            <Link href="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">소개</Link>
            <Link href="/projects" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">프로젝트</Link>
            <Link href="/contact" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">문의하기</Link>
          </nav>

          {/* 세로 구분선 */}
          <div className="w-[1px] h-4 bg-white/10 hidden md:block" />

          {/* 사용자 정보 및 버튼 세트 */}
          <div className="flex items-center gap-4">
            {user ? (
              /* 로그인 상태 UI */
              <div className="flex items-center gap-5 text-sm">
                
                {/* 관리자(admin)일 때만 나타나는 대시보드 버튼 */}
                {role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="text-[11px] font-bold px-3 py-1.5 bg-[#C273FF]/10 text-[#C273FF] border border-[#C273FF]/20 rounded-lg hover:bg-[#C273FF]/20 transition-all"
                  >
                    관리자 대시보드
                  </Link>
                )}

                {/* 환영 메시지 */}
                <div className="flex items-center gap-2">
                  {role === 'admin' ? (
                    <span className="bg-gradient-to-r from-[#B4BEFF] to-[#CA57FF] bg-clip-text text-transparent font-bold">
                      관리자
                    </span>
                  ) : (
                    <span className="text-zinc-200 font-medium">
                      {user.user_metadata?.nickname || user.email?.split('@')[0]}
                    </span>
                  )}
                  <span className="text-zinc-500">님</span>
                </div>
                
                {/* 로그아웃 버튼 */}
                <button 
                  onClick={handleLogout}
                  className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Logout
                </button>
              </div>
            ) : (
              /* 로그아웃 상태 UI */
              <div className="flex items-center gap-6">
                <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  로그인
                </Link>
                <Link 
                  href="/signup" 
                  className="text-sm font-bold px-5 py-2 bg-white text-black rounded-full hover:bg-[#C273FF] hover:text-white transition-all transform active:scale-95"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}