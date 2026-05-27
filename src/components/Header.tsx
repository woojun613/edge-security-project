'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, nickname')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setRole(data.role);
        setNickname(data.nickname); 
      }
    } catch (err) {
      console.error("프로필 로드 에러:", err);
    }
  };

  // 콘솔 이스터에그 (개발자들을 위한 환영 메시지)
  useEffect(() => {
    const asciiArt = `
    ███████╗██████╗  ██████╗ ███████╗
    ██╔════╝██╔══██╗██╔════╝ ██╔════╝
    █████╗  ██║  ██║██║  ███╗█████╗  
    ██╔══╝  ██║  ██║██║   ██║██╔══╝  
    ███████╗██████╔╝╚██████╔╝███████╗
    ╚══════╝╚═════╝  ╚═════╝ ╚══════╝
    `;

    // %c 를 사용하면 브라우저 콘솔창에도 CSS 스타일을 먹일 수 있습니다!
    console.log(
      `%c${asciiArt}`, 
      "color: #C273FF; font-weight: bold; font-family: monospace;"
    );
    console.log(
      "%c[EDGE SECURITY] 관리자 콘솔 접근을 환영합니다.", 
      "color: black; background: #C273FF; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px;"
    );
    console.log(
      "%c장우준의 보안 컨설팅 컨셉의 포트폴리오 입니다.\n👉 e-mail: dnwns06@naver.com",
      "color: #a1a1aa; font-size: 11px; line-height: 1.5;"
    );
  }, []);

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
        setNickname(null); 
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setIsMobileMenuOpen(false);
      router.push('/');
    }
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 border-b border-white/10 bg-black/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        
        <Link href="/" onClick={handleLinkClick} className="text-xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity z-50">
          EDGE SECURITY
        </Link>

        {/* --- [PC 버전] --- */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            <Link href="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">소개</Link>
            <Link href="/projects" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">프로젝트</Link>
            <Link href="/sandbox" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">AI 샌드박스</Link>
            <Link href="/self-audit" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">보안 진단</Link>
            <Link href="/contact" className="text-sm font-bold px-4 py-2 bg-[#C273FF]/10 text-[#C273FF] border border-[#C273FF]/20 rounded-lg hover:bg-[#C273FF] hover:text-white transition-all">문의하기</Link>
          </nav>

          <div className="w-[1px] h-4 bg-white/10" />

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-5 text-sm">
                
                {/* 💡 [PC] 관리자(admin) 전용 시크릿 메뉴 영역 */}
                {role === 'admin' && (
                  <div className="flex items-center gap-2">
                    <Link href="/admin" className="text-[11px] font-bold px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-1">
                      <span>🚨</span> 통합 관리 시스템
                    </Link>
                    <Link href="/kanban" className="text-[11px] font-bold px-3 py-1.5 bg-[#C273FF]/10 text-[#C273FF] border border-[#C273FF]/20 rounded-lg hover:bg-[#C273FF]/20 transition-all flex items-center gap-1">
                      <span>📋</span> 칸반 보드
                    </Link>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {role === 'admin' ? (
                    <span className="bg-gradient-to-r from-[#B4BEFF] to-[#CA57FF] bg-clip-text text-transparent font-bold">관리자</span>
                  ) : (
                    <span className="text-zinc-200 font-medium">
                      {nickname || user.user_metadata?.nickname || user.email?.split('@')[0]}
                    </span>
                  )}
                  <span className="text-zinc-500">님</span>
                </div>
                
                <Link href="/settings" className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors tracking-widest">
                  설정
                </Link>

                <button onClick={handleLogout} className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
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

        {/* --- [모바일 버전 버튼] --- */}
        <button 
          className="md:hidden text-zinc-400 hover:text-white p-2 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
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

      {/* --- [모바일 버전 드롭다운] --- */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 flex flex-col md:hidden shadow-2xl">
          <nav className="flex flex-col px-6 py-6 gap-6 text-lg">
            <Link href="/about" onClick={handleLinkClick} className="font-medium text-zinc-300 hover:text-white">소개</Link>
            <Link href="/projects" onClick={handleLinkClick} className="font-medium text-zinc-300 hover:text-white">프로젝트</Link>
            <Link href="/sandbox" onClick={handleLinkClick} className="font-medium text-zinc-300 hover:text-white">AI 샌드박스</Link>
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
                    <span className="text-zinc-200 font-medium">
                      {nickname || user.user_metadata?.nickname || user.email?.split('@')[0]}
                    </span>
                  )}
                  <span className="text-zinc-500">님 환영합니다</span>
                </div>
                
                {/* 💡 [모바일] 관리자(admin) 전용 시크릿 메뉴 영역 */}
                {role === 'admin' && (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/admin" onClick={handleLinkClick} className="text-center font-bold py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl flex justify-center items-center gap-2">
                      <span>🚨</span> 통합 관리 시스템
                    </Link>
                    <Link href="/kanban" onClick={handleLinkClick} className="text-center font-bold py-3 bg-[#C273FF]/10 text-[#C273FF] border border-[#C273FF]/20 rounded-xl flex justify-center items-center gap-2">
                      <span>📋</span> 칸반 보드
                    </Link>
                  </div>
                )}
                
                <Link href="/settings" onClick={handleLinkClick} className="text-left font-bold text-zinc-400 hover:text-white">
                  계정 설정
                </Link>

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