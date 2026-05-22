'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  // 💡 1. 모바일 메뉴 열림/닫힘 상태를 관리하는 State 추가
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

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
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchProfile(user.id);
    };
    getUser();

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setIsMobileMenuOpen(false); // 로그아웃 시 모바일 메뉴 닫기
      router.push('/');
    }
  };

  // 💡 모바일 메뉴 링크 클릭 시 메뉴 닫아주는 함수
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 border-b border-white/10 bg-black/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        
        {/* 로고 영역 */}
        <Link href="/" onClick={handleLinkClick} className="text-xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity z-50">
          EDGE SECURITY
        </Link>

        {/* --- [PC 버전 메뉴 + 인증 영역] --- */}
        <div className="hidden md:flex items-center gap-8">
          
          <nav className="flex gap-8">
            <Link href="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">소개</Link>
            <Link href="/projects" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">프로젝트</Link>
            <Link href="/sandbox" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">AI 샌드박스</Link>
            <Link href="/contact" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">문의하기</Link>
          </nav>

          <div className="w-[1px] h-4 bg-white/10" />

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-5 text-sm">
                {role === 'admin' && (
                  <Link href="/admin" className="text-[11px] font-bold px-3 py-1.5 bg-[#C273FF]/10 text-[#C273FF] border border-[#C273FF]/20 rounded-lg hover:bg-[#C273FF]/20 transition-all">
                    관리자 대시보드
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  {role === 'admin' ? (
                    <span className="bg-gradient-to-r from-[#B4BEFF] to-[#CA57FF] bg-clip-text text-transparent font-bold">관리자</span>
                  ) : (
                    <span className="text-zinc-200 font-medium">{user.user_metadata?.nickname || user.email?.split('@')[0]}</span>
                  )}
                  <span className="text-zinc-500">님</span>
                </div>
                <button onClick={handleLogout} className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">로그인</Link>
                <Link href="/signup" className="text-sm font-bold px-5 py-2 bg-white text-black rounded-full hover:bg-[#C273FF] hover:text-white transition-all transform active:scale-95">
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* --- [모바일 버전 햄버거 버튼] --- */}
        <button 
          className="md:hidden text-zinc-400 hover:text-white p-2 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {/* 메뉴가 열려있으면 'X', 닫혀있으면 '햄버거(三)' 아이콘 표시 */}
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* --- [모바일 버전 드롭다운 메뉴] --- */}
      {/* isMobileMenuOpen이 true일 때만 화면에 렌더링됩니다 */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 flex flex-col md:hidden shadow-2xl">
          
          <nav className="flex flex-col px-6 py-6 gap-6 text-lg">
            <Link href="/about" onClick={handleLinkClick} className="font-medium text-zinc-300 hover:text-white">소개</Link>
            <Link href="/projects" onClick={handleLinkClick} className="font-medium text-zinc-300 hover:text-white">프로젝트</Link>
            <Link href="/contact" onClick={handleLinkClick} className="font-medium text-zinc-300 hover:text-white">문의하기</Link>
          </nav>

          <div className="px-6 pb-8">
            <div className="w-full h-[1px] bg-white/10 mb-6" />
            
            {user ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-lg">
                  {role === 'admin' ? (
                    <span className="bg-gradient-to-r from-[#B4BEFF] to-[#CA57FF] bg-clip-text text-transparent font-bold">관리자</span>
                  ) : (
                    <span className="text-zinc-200 font-medium">{user.user_metadata?.nickname || user.email?.split('@')[0]}</span>
                  )}
                  <span className="text-zinc-500">님 환영합니다</span>
                </div>
                
                {role === 'admin' && (
                  <Link href="/admin" onClick={handleLinkClick} className="text-center font-bold py-3 bg-[#C273FF]/10 text-[#C273FF] border border-[#C273FF]/20 rounded-xl">
                    관리자 대시보드
                  </Link>
                )}
                
                <button onClick={handleLogout} className="text-left font-bold text-zinc-500 hover:text-white uppercase tracking-widest">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link href="/login" onClick={handleLinkClick} className="text-center font-medium py-3 text-zinc-300 bg-white/5 rounded-xl border border-white/10">
                  로그인
                </Link>
                <Link href="/signup" onClick={handleLinkClick} className="text-center font-bold py-3 bg-white text-black rounded-xl">
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}