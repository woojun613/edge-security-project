"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  role: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newNickname, setNewNickname] = useState('');

  // 💡 [추가] 비밀번호 재설정 관련 상태 변수들
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // 1. 현재 로그인한 사용자 정보 및 프로필 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);
          setNewNickname(data.nickname || '');
        }
      }
      setLoading(false);
    };

    fetchUser();

    // 💡 [추가] 이메일에 있는 비밀번호 재설정 링크를 클릭해 들어왔는지 실시간 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true); // 재설정 링크 진입 시 비밀번호 변경창 활성화
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. 프로필 정보 업데이트 (중복 체크 + 자동 새로고침)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setSaving(true);

    if (newNickname !== profile.nickname) {
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('nickname', newNickname)
        .neq('id', profile.id);

      if (checkError) {
        alert("중복 확인 중 오류가 발생했습니다.");
        setSaving(false);
        return;
      }

      if (existingUsers && existingUsers.length > 0) {
        alert("🚨 이미 사용 중인 이름입니다. 다른 이름을 입력해 주세요.");
        setSaving(false);
        return;
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ nickname: newNickname, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    if (error) {
      alert("정보 업데이트 실패: " + error.message);
      setSaving(false);
    } else {
      alert("성공적으로 정보가 수정되었습니다.");
      window.location.reload(); 
    }
  };

  // 3. 비밀번호 재설정 인증 메일 발송 함수
  const handleResetPassword = async () => {
    if (!profile?.email) return;
    
    const confirmReset = confirm(`${profile.email} 메일함으로 비밀번호 재설정 링크를 보내시겠습니까?`);
    if (!confirmReset) return;

    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/settings`, // 링크 클릭 시 다시 이 설정페이지로 리다이렉트
    });

    if (error) {
      alert("메일 발송 실패: " + error.message);
    } else {
      alert("비밀번호 재설정 메일이 성공적으로 발송되었습니다! 메일함을 확인해 주세요.");
    }
  };

  // 4. 💡 [추가] 사용자가 입력한 새 비밀번호를 실제로 DB에 반영하는 함수
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("🚨 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 6) {
      alert("🔒 보안을 위해 비밀번호는 최소 6자리 이상이어야 합니다.");
      return;
    }

    setUpdatingPassword(true);

    // Supabase의 유저 패스워드 직접 업데이트 API 호출
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert("비밀번호 변경 실패: " + error.message);
    } else {
      alert("🔒 비밀번호가 안전하게 변경되었습니다! 보안을 위해 다시 로그인해 주세요.");
      
      // 1. 먼저 안전하게 로그아웃을 마칩니다.
      await supabase.auth.signOut();
      
      // 2. 컴포넌트 내부의 상태(State)들을 먼저 깔끔하게 초기화합니다.
      setIsRecoveryMode(false); 
      setNewPassword('');
      setConfirmPassword('');
      setUpdatingPassword(false); // 로딩 상태도 함께 꺼줍니다.
      
      // 3. 모든 정리가 끝난 가장 마지막에 로그인 페이지로 리다이렉트합니다.
      window.location.href = '/login';
      return; // 함수를 즉시 종료하여 이후 코드가 실행되지 않도록 차단
    }
    
    // 이 줄은 에러가 났을 때만 실행되도록 아래에 그대로 둡니다.
    setUpdatingPassword(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#C273FF]/20 border-t-[#C273FF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex justify-center items-center text-white">
        로그인이 필요한 페이지입니다.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-28 pb-20 px-4 md:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* 상단 타이틀 */}
        <div>
          <p className="text-[#C273FF] text-xs md:text-sm font-bold tracking-widest uppercase mb-2">Account Settings</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter">계정 보안 및 설정</h1>
          <p className="text-zinc-400 text-sm mt-2">엣지시큐리티 플랫폼에서 사용할 프로필과 보안 설정을 관리합니다.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* 💡 [추가 UI] 비밀번호 재설정 링크를 타고 들어왔을 때만 상단에 나타나는 비밀번호 확정 폼 */}
          {isRecoveryMode && (
            <motion.section 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="bg-purple-950/20 border border-[#C273FF]/30 rounded-2xl p-6 md:p-8 space-y-4"
            >
              <div className="flex items-center gap-2 text-[#C273FF]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C273FF]"></span>
                </span>
                <h2 className="text-xl font-bold">🔒 새 비밀번호 설정 권한 인증됨</h2>
              </div>
              <p className="text-zinc-400 text-xs">이메일 보안 인증이 확인되었습니다. 아래에 새롭게 사용할 안전한 비밀번호를 입력해 주세요.</p>
              
              <form onSubmit={handleUpdatePassword} className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wide">새 비밀번호 입력</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="최소 6자리 이상"
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C273FF] transition-all"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wide">새 비밀번호 확인</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="다시 한번 똑같이 입력"
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C273FF] transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRecoveryMode(false)}
                    className="px-4 py-2 bg-zinc-800 text-zinc-400 text-xs font-bold rounded-xl border border-white/5 hover:text-white transition-all"
                  >
                    닫기
                  </button>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-5 py-2 bg-[#C273FF] text-white text-xs font-bold rounded-xl hover:bg-[#B4BEFF] hover:text-black transition-all disabled:opacity-50"
                  >
                    {updatingPassword ? '변경 중...' : '비밀번호 확정 및 적용'}
                  </button>
                </div>
              </form>
            </motion.section>
          )}

          {/* 섹션 1: 프로필 정보 수정 폼 */}
          <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 border-b border-white/5 pb-4">프로필 정보</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wide">계정 이메일 (아이디)</label>
                <div className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed flex items-center justify-between">
                  <span>{profile.email}</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-white/10">수정 불가</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 ml-1">보안 정책상 이메일 변경은 고객센터 문의를 통해서만 가능합니다.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wide">사용자 이름 (닉네임)</label>
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="사용하실 이름을 입력하세요"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C273FF] transition-all"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving || newNickname === profile.nickname}
                  className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-[#C273FF] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '저장 중...' : '변경사항 저장'}
                </button>
              </div>
            </form>
          </section>

          {/* 섹션 2: 인프라 권한 및 비밀번호 제어 상태 */}
          <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 border-b border-white/5 pb-4">보안 및 권한 상태</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              
              <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${profile.role === 'admin' ? 'bg-[#C273FF]/20 text-[#C273FF]' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {profile.role === 'admin' ? 'A' : 'U'}
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">현재 권한 레벨</p>
                  <p className="text-white font-bold text-sm">{profile.role === 'admin' ? '최고 관리자 (Administrator)' : '일반 회원 (Standard User)'}</p>
                </div>
              </div>

              <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">비밀번호 변경</p>
                  <p className="text-zinc-400 text-xs leading-relaxed">보안 링크가 메일로 발송됩니다.</p>
                </div>
                <button 
                  onClick={handleResetPassword}
                  type="button"
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg border border-white/5 hover:border-[#C273FF] hover:text-[#C273FF] transition-all shrink-0"
                >
                  재설정 메일 발송
                </button>
              </div>

            </div>
          </section>

        </motion.div>
      </div>
    </main>
  );
}