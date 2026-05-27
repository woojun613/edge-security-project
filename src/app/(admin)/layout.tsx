"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      // 1. 현재 로그인한 유저 정보 확인
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("🔒 로그인이 필요한 페이지입니다.");
        router.push('/login');
        return;
      }

      // 2. DB에서 권한(role)이 'admin'인지 확인
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        alert("🚨 접근 권한이 없습니다. 최고 관리자만 접근 가능합니다.");
        router.push('/'); // 일반 유저는 메인 화면으로 강제 추방
      } else {
        setIsAuthorized(true); // 관리자 확인 완료! 통과!
      }
      setLoading(false);
    };

    checkAdminAccess();
  }, [router]);

  // 검증 중일 때 보여줄 로딩 화면
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#C273FF]/20 border-t-[#C273FF] rounded-full animate-spin" />
      </div>
    );
  }

  // 검증을 통과한 관리자에게만 내부 페이지(children)를 렌더링
  if (!isAuthorized) return null;

  return <>{children}</>;
}