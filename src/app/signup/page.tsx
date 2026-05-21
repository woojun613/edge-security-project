"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  
  // 💡 [추가] 닉네임 중복 확인 관련 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 페이지 진입 시 로그인 여부 확인 및 리다이렉트
  useEffect(() => {
    const checkAlreadyLoggedIn = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = '/'; 
      }
    };
    checkAlreadyLoggedIn();
  }, []);

  // 💡 [추가] 닉네임 중복 확인 함수
  const checkNicknameDuplicate = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setIsCheckingNickname(true);

    try {
      // profiles 테이블에서 해당 닉네임이 있는지 검색합니다.
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', nickname.trim())
        .maybeSingle(); // 1개가 나오거나 안 나오거나(null)

      if (error) throw error;

      if (data) {
        alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
        setIsNicknameChecked(false);
      } else {
        alert('사용 가능한 닉네임입니다!');
        setIsNicknameChecked(true);
      }
    } catch (err) {
      console.error("중복 확인 오류:", err);
      alert('중복 확인 중 시스템 오류가 발생했습니다.');
    } finally {
      setIsCheckingNickname(false);
    }
  };

  // 💡 [추가] 사용자가 닉네임을 다시 수정하면 중복 확인 상태를 초기화
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setIsNicknameChecked(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 💡 [추가] 중복 확인을 안 했다면 가입 차단!
    if (!isNicknameChecked) {
      alert('닉네임 중복 확인을 진행해주세요.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            role: 'user',
            nickname: nickname.trim(),
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          alert('이미 가입된 이메일(아이디)입니다. 다른 이메일을 사용하거나 로그인해주세요.');
        } else {
          alert('회원가입 실패: ' + error.message);
        }
      } else {
        if (data.session) {
          alert('회원가입 및 로그인이 완료되었습니다!');
          window.location.href = '/'; 
        } else {
          alert('회원가입 신청이 완료되었습니다! 이메일 인증 후 로그인이 가능합니다.');
          router.push('/login'); 
        }
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
          
          {/* 💡 닉네임 입력 및 중복 확인 영역 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Nickname</label>
            <div className="flex gap-2">
              <input 
                required type="text" 
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="사용하실 이름을 입력하세요"
                className={`flex-1 bg-zinc-800 border rounded-xl px-4 py-4 text-white outline-none transition-all placeholder:text-zinc-600 ${
                  isNicknameChecked ? 'border-emerald-500 focus:border-emerald-400' : 'border-white/5 focus:border-[#C273FF]'
                }`} 
              />
              <button 
                type="button" 
                onClick={checkNicknameDuplicate}
                disabled={isCheckingNickname || !nickname.trim() || isNicknameChecked}
                className={`px-6 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  isNicknameChecked 
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-white/5'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isCheckingNickname ? "확인 중..." : isNicknameChecked ? "확인 완료" : "중복 확인"}
              </button>
            </div>
            {/* 상태 안내 텍스트 */}
            {isNicknameChecked && (
              <p className="text-emerald-500 text-xs font-bold ml-1 mt-1">사용 가능한 닉네임입니다.</p>
            )}
          </div>

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