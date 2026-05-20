"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import Link from 'next/link'; // 💡 1. Next.js Link 컴포넌트를 불러옵니다.

export default function AboutPage() {
  
  const fadeInVariant: HTMLMotionProps<"div"> = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-[#C273FF]/30 overflow-x-hidden">
      
      {/* --- 1. HERO SECTION (등장 시 즉시 실행) --- */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#C273FF]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <p className="text-[#C273FF] text-sm font-bold tracking-[0.3em] mb-6 uppercase animate-pulse">
            On the Edge of Security
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-[1.1]">
            우리는 보안의 <br />
            <span className="text-zinc-500">새로운 기준을 만듭니다</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            단순한 점검을 넘어, 비즈니스의 연속성을 보장하는 실질적인 보안 솔루션을 제안합니다. 
            엣지시큐리티는 기술과 신뢰를 연결하는 디지털 방어선의 최전선입니다.
          </p>
        </motion.div>
      </section>

      {/* --- 2. MISSION & VISION --- */}
      <motion.section 
        {...fadeInVariant}
        className="py-24 px-6 bg-zinc-900/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div>
                <div className="w-12 h-1 bg-[#C273FF] mb-6" />
                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  우리는 복잡한 보안 규제와 위협 속에서 고객사가 안심하고 비즈니스에만 집중할 수 있는 
                  환경을 만드는 것을 사명으로 합니다. 기술적 취약점뿐만 아니라 사람과 프로세스를 
                  아우르는 통합 보안 컨설팅을 지향합니다.
                </p>
              </div>
              <div>
                <div className="w-12 h-1 bg-zinc-700 mb-6" />
                <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  빠르게 변화하는 IT 환경 속에서 고객사의 소중한 자산을 안전하게 보호하고, 
                  단순한 외주 업체가 아닌 전략적 보안 파트너로서 업계 최고의 신뢰를 받는 
                  글로벌 보안 기업으로 성장하고자 합니다.
                </p>
              </div>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#C273FF] to-[#484AF7] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-800">
                <img 
                  src="/images/about/s5-bg.png" 
                  alt="Edge Security Vision" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* --- 3. CORE VALUES (순차적 등장 효과) --- */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInVariant} className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Core Values</h2>
            <p className="text-zinc-500 uppercase tracking-widest text-sm">우리가 일하는 방식</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Expertise", desc: "분야별 최고 전문가들이 깊이 있는 분석과 해답을 제시합니다." },
              { title: "Integrity", desc: "보안의 기본인 정직함과 투명성을 바탕으로 신뢰를 쌓습니다." },
              { title: "Innovation", desc: "기존의 형식을 파괴하고 가장 효율적인 보안 기술을 연구합니다." }
            ].map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }} // 01, 02, 03 순서대로 등장
                className="p-8 rounded-2xl bg-zinc-900 border border-white/5 hover:border-[#C273FF]/50 transition-all duration-500 group"
              >
                <div className="text-[#C273FF] text-4xl font-black mb-6 opacity-20 group-hover:opacity-100 transition-opacity">0{index + 1}</div>
                <h4 className="text-xl font-bold mb-4 group-hover:text-[#C273FF] transition-colors">{value.title}</h4>
                <p className="text-zinc-400 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. STRATEGIC ADVANTAGE --- */}
      <motion.section 
        {...fadeInVariant}
        className="py-24 px-6 bg-[#C273FF]/5 border-y border-[#C273FF]/10"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="/images/about/Rectangle-1749.png" 
                alt="Security Integrated Development" 
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              보안이 내재화된 <br />
              <span className="text-[#C273FF]">디지털 빌딩</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              엣지시큐리티는 홈페이지 제작 단계부터 보안 진단을 병행합니다. 
              이는 사후 보안 조치 비용을 획기적으로 절감하며, 오픈과 동시에 가장 안전한 
              서비스를 제공할 수 있도록 돕습니다.
            </p>
            <ul className="space-y-4">
              {['시큐어 코딩 적용', '웹 취약점 진단 기본 포함', '개인정보 보호 최적화'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C273FF]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* --- 5. CALL TO ACTION --- */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-32 px-6 text-center relative overflow-hidden"
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">안전한 비즈니스의 시작,<br />지금 엣지시큐리티와 상의하세요</h2>
          
          <Link 
            href="/contact" 
            className="inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-[#C273FF] hover:text-white transition-all duration-500 transform active:scale-95 cursor-pointer"
          >
            문의하기 →
          </Link>
        </div>
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 text-[15rem] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none">
          EDGE SECURITY
        </div>
      </motion.section>

    </main>
  );
}