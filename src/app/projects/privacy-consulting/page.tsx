"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';

export default function AISecurityPage() {
  const fadeInVariant: HTMLMotionProps<"div"> = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-[#C273FF]/30 overflow-x-hidden">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-32 md:pt-48 pb-16 md:pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[400px] md:h-[600px] bg-[#C273FF]/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#C273FF] text-xs md:text-sm font-bold tracking-[0.3em] md:tracking-[0.4em] mb-4 md:mb-6 uppercase"
          >
            Project 04 / Privacy Consulting
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-extrabold mb-6 md:mb-10 tracking-tighter leading-[1.15] md:leading-[1.05] break-keep"
          >
            개인정보보호 <br />
            <span className="text-zinc-500">통합 컨설팅 솔루션</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-16 md:w-20 h-1 bg-[#C273FF] mx-auto mb-8 md:mb-10" 
          />
        </div>
      </section>

      {/* --- 2. PROJECT OVERVIEW --- */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <motion.div {...fadeInVariant} className="order-2 md:order-1">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 aspect-video">
              <img 
                src="/images/projects/privacy-consulting/recruit-s3-bg.png" 
                alt="Privacy Consulting Concept" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div {...fadeInVariant} className="order-1 md:order-2 space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Overview</h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-light break-keep">
              데이터 3법 및 ISMS-P 등 강화된 규제 준수를 위해 기업의 개인정보 생애주기를 분석하고 리스크를 최소화합니다.
            </p>
            <div className="grid grid-cols-2 gap-6 md:gap-8 pt-2 md:pt-4">
              <div>
                <p className="text-[#C273FF] text-xl md:text-2xl font-bold mb-1">100%</p>
                <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest">Compliance Match</p>
              </div>
              <div>
                <p className="text-[#C273FF] text-xl md:text-2xl font-bold mb-1">Zero</p>
                <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest">Legal Risk</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 3. CORE MODULES --- */}
      <section className="py-16 md:py-24 px-6 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInVariant} className="mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Core Modules</h2>
            <p className="text-zinc-500 uppercase tracking-widest text-xs md:text-sm">가이드북 주요 내용</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "ISMS-P 인증 지원", desc: "국내외 보안 인증 취득 및 유지 관리 전략" },
              { title: "개인정보 영향평가 (PIA)", desc: "신규 서비스 도입 시 잠재적 프라이버시 위험 분석" },
              { title: "글로벌 컴플라이언스", desc: "GDPR, CCPA 등 글로벌 데이터 규제 완벽 대응" }
            ].map((module, i) => (
              <motion.div 
                key={i}
                {...fadeInVariant}
                transition={{ delay: i * 0.1 }}
                className="p-6 md:p-10 rounded-2xl md:rounded-3xl bg-zinc-900 border border-white/5 hover:border-[#C273FF]/30 transition-colors group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#C273FF]/10 flex items-center justify-center text-[#C273FF] mb-6 md:mb-8 group-hover:bg-[#C273FF] group-hover:text-white transition-all text-sm md:text-base font-bold">
                  {i + 1}
                </div>
                <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-4">{module.title}</h4>
                <p className="text-zinc-500 leading-relaxed text-sm">{module.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. PROJECT PROCESS --- */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeInVariant} className="text-3xl md:text-4xl font-bold mb-10 md:mb-16 text-center">Process</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { step: "01", label: "Current State", desc: "현황 분석 및 자산 식별" },
              { step: "02", label: "Gap Analysis", desc: "보안 요구사항 대비 차이 분석" },
              { step: "03", label: "Strategy", desc: "개인정보보호 마스터플랜 수립" },
              { step: "04", label: "Audit", desc: "이행 점검 및 사후 관리" }
            ].map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center space-y-2 md:space-y-4"
              >
                <div className="text-[#C273FF] text-xs md:text-sm font-black opacity-30">{p.step}</div>
                <h4 className="text-lg md:text-xl font-bold">{p.label}</h4>
                <p className="text-zinc-500 text-xs md:text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. CTA --- */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-8 md:p-16 rounded-2xl md:rounded-[3rem] bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/5 text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 leading-tight break-keep">
            안전한 AI 비즈니스,<br className="hidden md:block" />엣지시큐리티가 앞장섭니다.
          </h2>
          <Link 
            href="/contact"
            className="inline-block px-8 py-3 md:px-12 md:py-4 bg-[#C273FF] text-white text-sm md:text-base font-bold rounded-full hover:bg-[#A155E0] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(194,115,255,0.3)] whitespace-nowrap"
          >
            프로젝트 상세 문의하기
          </Link>
        </motion.div>
      </section>

    </main>
  );
}