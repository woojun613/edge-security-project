"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 회원가입 시 metadata에 role(권한)과 nickname을 함께 저장합니다.
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),      // [중요] 앞뒤 공백 제거
        password: password.trim(), // [중요] 패스워드 공백 제거
        options: {
          data: {
            role: 'user', // 기본 권한은 보안상 항상 'user'로 설정
            nickname: nickname,
          },
        },
      });

      if (error) {
        alert('회원가입 실패: ' + error.message);
      } else {
        alert('회원가입 신청이 완료되었습니다! 이메일 인증 후 로그인이 가능합니다.');
        router.push('/login');
      }
    } catch (err) {
      console.error("시스템 오류:", err);
      alert('처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      {/* 배경 그라데이션 효과 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#C273FF]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/50 border border-white/5 p-10 rounded-[2rem] backdrop-blur-xl relative z-10"
      >
        <div className="text-center mb-10">
          <p className="text-[#C273FF] text-xs font-bold tracking-[0.4em] mb-4 uppercase">Join Edge Security</p>
          <h1 className="text-3xl font-bold tracking-tighter text-white">신규 계정 등록</h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* 닉네임 입력 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Nickname</label>
            <input 
              required type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="사용하실 이름을 입력하세요"
              className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-[#C273FF] outline-none transition-all placeholder:text-zinc-600" 
            />
          </div>

          {/* 이메일 입력 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              required type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@edgesec.co.kr"
              className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-[#C273FF] outline-none transition-all placeholder:text-zinc-600" 
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
            <input 
              required type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-4 text-white focus:border-[#C273FF] outline-none transition-all placeholder:text-zinc-600" 
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-[#C273FF] hover:text-white transition-all transform active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? "등록 중..." : "계정 생성"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-white hover:text-[#C273FF] transition-colors underline underline-offset-4">
              로그인하기
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}