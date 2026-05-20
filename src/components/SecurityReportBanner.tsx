'use client';
import { useEffect, useState } from 'react';

export default function SecurityReportBanner() {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    // 1. 이미 분석을 했는지 확인 (중복 계산 방지)
    const alreadyScanned = sessionStorage.getItem('security-scanned');
    
    if (!alreadyScanned) {
      // 2. 쿠키에서 점수를 읽어옴
      const cookie = document.cookie.split('; ').find(row => row.startsWith('security-score='));
      if (cookie) {
        const scoreValue = parseInt(cookie.split('=')[1]);
        setScore(scoreValue);
        sessionStorage.setItem('security-scanned', 'true');
      }
    } else {
      // 이미 분석된 경우, 점수를 유지하기 위해 쿠키 값을 재확인
      const cookie = document.cookie.split('; ').find(row => row.startsWith('security-score='));
      if (cookie) setScore(parseInt(cookie.split('=')[1]));
    }
  }, []);

  if (score === null) return null;

  const getStatus = (s: number) => {
    if (s >= 80) return { text: 'EXCELLENT', color: 'text-emerald-400', desc: '매우 안전한 접속 환경입니다.' };
    if (s >= 60) return { text: 'GOOD', color: 'text-blue-400', desc: '안전한 접속 환경입니다.' };
    return { text: 'WARNING', color: 'text-amber-400', desc: '보안 점검이 필요한 환경입니다.' };
  };

  const status = getStatus(score);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 mb-12">
      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/10 transition-all">
        <div>
          <h3 className="text-xl font-bold mb-2">실시간 접속 환경 보안 분석</h3>
          <p className="text-zinc-400 text-sm">{status.desc}</p>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">보안 점수</p>
            <p className="text-3xl font-black text-white">{score}<span className="text-zinc-600 text-sm font-normal">/100</span></p>
          </div>
          <div className={`text-xl font-black ${status.color}`}>
            {status.text}
          </div>
        </div>
      </div>
    </div>
  );
}