'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import zxcvbn from 'zxcvbn';

export default function PasswordAnalyzer() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<zxcvbn.ZXCVBNResult | null>(null);

  // 비밀번호가 입력될 때마다 실시간으로 다크웹 사전과 대조하여 분석
  useEffect(() => {
    if (password) {
      setResult(zxcvbn(password));
    } else {
      setResult(null);
    }
  }, [password]);

  // 점수(0~4)에 따른 상태값 매핑
  const getScoreDetails = (score: number) => {
    switch (score) {
      case 0: return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500/50', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.2)]', text: '매우 위험 (즉시 해킹 가능)' };
      case 1: return { label: 'WEAK', color: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500/50', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]', text: '취약함 (수 초 내 해킹)' };
      case 2: return { label: 'FAIR', color: 'text-yellow-400', bg: 'bg-yellow-400', border: 'border-yellow-400/50', glow: 'shadow-[0_0_30px_rgba(250,204,21,0.2)]', text: '보통 (사전 대입 공격에 취약)' };
      case 3: return { label: 'GOOD', color: 'text-emerald-400', bg: 'bg-emerald-400', border: 'border-emerald-400/50', glow: 'shadow-[0_0_30px_rgba(52,211,153,0.2)]', text: '안전 (일반적인 공격 방어 가능)' };
      case 4: return { label: 'SECURE', color: 'text-[#C273FF]', bg: 'bg-[#C273FF]', border: 'border-[#C273FF]/50', glow: 'shadow-[0_0_40px_rgba(194,115,255,0.4)]', text: '철통 보안 (해킹 사실상 불가능)' };
      default: return { label: 'WAITING', color: 'text-zinc-500', bg: 'bg-zinc-800', border: 'border-white/5', glow: '', text: '비밀번호를 입력해주세요' };
    }
  };

  const status = result ? getScoreDetails(result.score) : getScoreDetails(-1);

  // 번역: zxcvbn의 영어 피드백을 한국어로 변환
  const translateFeedback = (feedback: string) => {
    if (!feedback) return "";
    if (feedback.includes("Use a few words")) return "여러 단어를 조합하고 기호를 피하는 것이 외우기도 좋고 더 안전합니다.";
    if (feedback.includes("Add another word")) return "단어를 한두 개 더 추가해 보세요.";
    if (feedback.includes("Repeats like")) return "동일한 문자의 반복은 피해주세요 (예: aaa).";
    if (feedback.includes("Sequences like")) return "연속된 문자나 숫자 패턴은 위험합니다 (예: abc, 1234).";
    if (feedback.includes("top 10") || feedback.includes("top 100")) return "경고: 다크웹에서 가장 많이 유출된 최악의 비밀번호입니다!";
    if (feedback.includes("common password")) return "경고: 해커들의 사전(Dictionary)에 등록된 흔한 비밀번호입니다.";
    return "영문, 숫자, 특수문자를 혼합하여 길게 작성해 보세요.";
  };

  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* 백그라운드 빛 반사 효과 (비밀번호 강도에 따라 색상이 변함!) */}
      <motion.div 
        animate={{ backgroundColor: result ? status.color.replace('text-', '') : 'rgba(255,255,255,0.02)' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] rounded-full opacity-10 transition-colors duration-700 pointer-events-none"
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <p className="text-[#C273FF] text-xs font-bold tracking-[0.4em] mb-4 uppercase">Security Test Lab</p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">당신의 비밀번호는 <br className="md:hidden" />안전합니까?</h2>
        <p className="text-zinc-400 mb-12">실제 해커들이 사용하는 브루트 포스(무차별 대입) 알고리즘으로<br className="hidden md:block" /> 현재 사용 중인 비밀번호의 크래킹(해킹) 소요 시간을 분석해 드립니다.</p>

        <div className={`bg-zinc-900/50 border p-6 md:p-10 rounded-[2rem] backdrop-blur-xl transition-all duration-500 ${status.border} ${status.glow} max-w-2xl mx-auto text-left`}>
          
          <div className="mb-6">
            <input 
              type="text" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="테스트할 비밀번호를 입력해보세요"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-6 py-5 text-white text-lg focus:outline-none focus:border-white/30 transition-all font-mono"
            />
          </div>

          <div className="space-y-6">
            {/* 1. 상태 게이지 바 */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest">
                <span className={status.color}>{status.label}</span>
                <span className="text-zinc-500">Security Level {result ? result.score : 0}/4</span>
              </div>
              <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden bg-zinc-950">
                {[0, 1, 2, 3].map((index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0.2 }}
                    animate={{ 
                      opacity: result && result.score >= index + 1 ? 1 : 0.1,
                      backgroundColor: result && result.score >= index + 1 ? status.bg.replace('bg-', '') : '#3f3f46'
                    }}
                    className={`flex-1 ${result && result.score >= index + 1 ? status.bg : 'bg-zinc-700'}`}
                  />
                ))}
              </div>
            </div>

            {/* 2. 크래킹 분석 결과 (핵심 요소) */}
            <div className="bg-zinc-950 rounded-xl p-6 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">예상 크래킹 소요 시간</p>
                <div className="text-3xl font-black font-mono tracking-tight">
                  {result ? (
                    result.score === 4 ? (
                      <span className="text-[#C273FF]">{result.crack_times_display.offline_slow_hashing_1e4_per_second}</span>
                    ) : result.score >= 2 ? (
                      <span className="text-white">{result.crack_times_display.offline_slow_hashing_1e4_per_second}</span>
                    ) : (
                      <span className="text-red-500">0.01 초 (즉시 해킹)</span>
                    )
                  ) : (
                    <span className="text-zinc-700">00:00:00</span>
                  )}
                </div>
              </div>
              
              <div className="text-left md:text-right">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">AI 컨설팅 의견</p>
                <p className="text-sm font-medium text-zinc-300">
                  {result?.feedback.warning 
                    ? <span className="text-red-400">{translateFeedback(result.feedback.warning)}</span>
                    : result?.feedback.suggestions[0] 
                      ? translateFeedback(result.feedback.suggestions[0])
                      : status.text}
                </p>
              </div>
            </div>
            
            <div className="text-center mt-4">
               <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                 Powered by zxcvbn / All data is processed locally.
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}