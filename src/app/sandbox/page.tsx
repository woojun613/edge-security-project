import React from 'react';
import AISecuritySandbox from '@/components/AISecuritySandbox';

export default function SandboxPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-28 pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* 페이지 헤더 */}
        <div className="text-center space-y-4">
          <p className="text-[#C273FF] text-xs md:text-sm font-bold tracking-widest uppercase">
            Interactive Security Lab
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter">
            AI 취약점 모의 테스트
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed text-balance">
            최근 가장 위협적인 공격 기법인 '프롬프트 인젝션(Prompt Injection)'을 직접 체험해 보세요. 
            교묘한 명령어로 엣지시큐리티의 가상 AI 에이전트를 속여 기밀 데이터를 탈취할 수 있는지 테스트합니다.
          </p>
        </div>

        <AISecuritySandbox />

        {/* 하단 설명 섹션 */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 md:p-8 text-sm text-zinc-400 space-y-4">
          <h3 className="text-white font-bold text-base">🛡️ 방어 메커니즘 (Zero-cost Simulation)</h3>
          <p>
            본 테스트 환경은 실제 LLM API를 호출하지 않고, 프론트엔드 환경에서 정규식 패턴 매칭을 통해 
            악의적인 프롬프트 우회 시도를 실시간으로 탐지하고 차단하는 엣지시큐리티의 경량화된 방어 로직을 시뮬레이션합니다.
          </p>
        </div>
        
      </div>
    </main>
  );
}