"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('인증에 실패했습니다: ' + error.message);
      } else if (data.user && !data.session) {
        alert('이메일 인증이 필요합니다. 메일함을 확인해주세요.');
      } else if (data.session && data.user) {
        // [수정 포인트] 유저의 메타데이터에서 role을 가져옵니다.
        const role = data.user.user_metadata?.role;

        console.log(`인증 성공: 권한(${role})`);

        if (role === 'admin') {
          // 관리자일 경우 관리자 대시보드로 이동
          router.push('/admin');
        } else {
          // 일반 사용자일 경우 메인 페이지 또는 사용자 페이지로 이동
          router.push('/');
        }
        return; 
      }
    } catch (err) {
      console.error("시스템 오류:", err);
      alert('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      {/* 배경 효과 및 UI는 동일하게 유지 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#C273FF]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/50 border border-white/5 p-10 rounded-[2rem] backdrop-blur-xl relative z-10"
      >
        <div className="text-center mb-10">
          <p className="text-[#C273FF] text-xs font-bold tracking-[0.4em] mb-4 uppercase">Authorized Personnel Only</p>
          <h1 className="text-3xl font-bold tracking-tighter text-white">로그인</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Admin Email</label>
            <input 
              required type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-[#C273FF] outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
            <input 
              required type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-[#C273FF] outline-none transition-all" 
            />
          </div>
          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-[#C273FF] hover:text-white transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "인증 중..." : "시스템 접속"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}