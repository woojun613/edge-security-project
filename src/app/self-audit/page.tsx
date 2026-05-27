"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function SelfAuditPage() {
  // 1. 진단 항목 상태 관리
  const [empCount, setEmpCount] = useState(50); // 임직원 수
  const [remoteRatio, setRemoteRatio] = useState(30); // 원격 근무 비율
  const [cloudLevel, setCloudLevel] = useState(2); // 클라우드 도입 수준 (0~4)
  const [solutionCount, setSolutionCount] = useState(2); // 보안 솔루션 개수 (0~5)

  // 2. 실시간 점수 계산 로직 (가상의 가중치 적용)
  const auditResult = useMemo(() => {
    let score = 100;
    
    // 임직원이 많은데 솔루션이 적으면 감점
    if (empCount > 100 && solutionCount < 3) score -= 20;
    // 원격 근무가 많은데 클라우드 보안이 낮으면 감점
    if (remoteRatio > 50 && cloudLevel < 3) score -= 25;
    // 기본 솔루션 부족 감점
    score -= (5 - solutionCount) * 10;
    // 클라우드 미흡 감점
    score -= (4 - cloudLevel) * 5;

    const finalScore = Math.max(10, Math.min(100, score));
    
    let grade = "C";
    let color = "text-yellow-500";
    let message = "보안 체계 검토가 시급합니다.";

    if (finalScore >= 85) {
      grade = "A";
      color = "text-emerald-400";
      message = "매우 우수한 보안 수준을 유지하고 있습니다.";
    } else if (finalScore >= 60) {
      grade = "B";
      color = "text-[#C273FF]";
      message = "기본은 갖춰져 있으나 보완이 필요합니다.";
    } else {
      grade = "D";
      color = "text-red-500";
      message = "사이버 위협에 무방비로 노출되어 있습니다.";
    }

    return { finalScore, grade, color, message };
  }, [empCount, remoteRatio, cloudLevel, solutionCount]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* 좌측: 인터랙티브 슬라이더 영역 */}
        <div className="space-y-10">
          <div>
            <p className="text-[#C273FF] text-sm font-bold tracking-widest uppercase mb-2">Self-Audit Tool</p>
            <h1 className="text-4xl font-extrabold tracking-tighter">1분 보안 성숙도 진단</h1>
            <p className="text-zinc-400 mt-3">슬라이더를 조절하여 귀사의 현재 인프라 환경을 설정해 보세요.</p>
          </div>

          <div className="space-y-8 bg-zinc-900/30 border border-white/5 p-8 rounded-3xl">
            {/* 항목 1: 임직원 규모 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-zinc-300">임직원 규모 (명)</label>
                <span className="text-[#C273FF] font-mono font-bold">{empCount}</span>
              </div>
              <input 
                type="range" min="10" max="500" step="10" 
                value={empCount} onChange={(e) => setEmpCount(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C273FF]"
              />
            </div>

            {/* 항목 2: 원격 근무 비중 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-zinc-300">원격/재택 근무 비중 (%)</label>
                <span className="text-[#C273FF] font-mono font-bold">{remoteRatio}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="5" 
                value={remoteRatio} onChange={(e) => setRemoteRatio(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C273FF]"
              />
            </div>

            {/* 항목 3: 클라우드 도입 수준 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-zinc-300">클라우드 전환 및 관리 수준</label>
                <span className="text-[#C273FF] font-bold text-xs uppercase tracking-wider">Level {cloudLevel}</span>
              </div>
              <input 
                type="range" min="0" max="4" step="1" 
                value={cloudLevel} onChange={(e) => setCloudLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C273FF]"
              />
            </div>

            {/* 항목 4: 도입된 보안 솔루션 개수 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-zinc-300">보안 솔루션 도입 수 (WAF, IPS, EDR 등)</label>
                <span className="text-[#C273FF] font-mono font-bold">{solutionCount}개</span>
              </div>
              <input 
                type="range" min="0" max="5" step="1" 
                value={solutionCount} onChange={(e) => setSolutionCount(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C273FF]"
              />
            </div>
          </div>
        </div>

        {/* 우측: 실시간 결과 리포트 시각화 */}
        <div className="flex justify-center mt-10 lg:mt-0">
          {/* 💡 수정 1: 모바일에서는 최소 높이(min-h)를 보장하고, PC(lg)에서만 1:1 비율(aspect-square) 적용 */}
          <div className="relative w-full max-w-md min-h-[420px] lg:aspect-square bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[30px] lg:rounded-[40px] shadow-2xl flex flex-col items-center justify-center p-8 lg:p-12 text-center overflow-hidden">
            
            {/* 장식용 배경 광원 */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#C273FF]/5 blur-[100px] pointer-events-none" />

            <motion.div
              key={auditResult.grade}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* 💡 수정 2: 모바일 폰트 사이즈 축소 (90px) 및 마진 최적화 */}
              <div className={`text-[90px] lg:text-[120px] font-black leading-none mb-3 lg:mb-4 ${auditResult.color}`}>
                {auditResult.grade}
              </div>
              <div className="text-xl lg:text-2xl font-bold mb-2">보안 점수: {auditResult.finalScore}점</div>
              
              {/* 💡 수정 3: 모바일 텍스트 크기 축소 및 버튼과의 간격(mb-8) 확실히 확보 */}
              <p className="text-zinc-500 text-xs lg:text-sm mb-8 lg:mb-10 max-w-[220px] mx-auto">
                {auditResult.message}
              </p>

              <Link 
                href="/contact" 
                className="inline-block px-6 py-3.5 lg:px-8 lg:py-4 bg-white text-black text-xs lg:text-sm font-bold rounded-full hover:bg-[#C273FF] hover:text-white transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap shadow-lg"
              >
                상세 진단 리포트 신청하기
              </Link>
            </motion.div>

            {/* 하단 장식선 (모바일 크기 최적화) */}
            <div className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-6 h-1 lg:w-8 lg:h-1 rounded-full ${i < (auditResult.finalScore/20) ? 'bg-[#C273FF]' : 'bg-zinc-800'}`} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}