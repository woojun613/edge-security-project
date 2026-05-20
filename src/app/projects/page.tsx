"use client";

import React from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps } from 'framer-motion';

const projects = [
  { 
    id: 1,
    title: "웹 취약점 진단 가이드", 
    subtitle: "Web Security Audit", 
    link: "/projects/web-security",
    desc: "최신 취약점 분석 기법을 통한 웹 서비스 무결성 검증과 실무 대응 체계 수립",
    status: "Coming Soon" 
  },
  { 
    id: 2,
    title: "제로트러스트 아키텍처", 
    subtitle: "Zero-Trust Design", 
    link: "/projects/zero-trust",
    desc: "신뢰하지 않는 네트워크 환경을 위한 차세대 보안 모델 설계 및 구현 전략",
    status: "Under Construction"
  },
  { 
    id: 3,
    title: "인공지능 보안 가이드북", 
    subtitle: "AI Security Guide", 
    link: "/projects/ai-security",
    desc: "LLM 및 AI 에이전트 환경에서 발생하는 새로운 보안 위협 분석과 대응 기술",
    status: "View Project"
  },
  { 
    id: 4,
    title: "개인 정보보호 컨설팅", 
    subtitle: "Privacy Consulting", 
    link: "/projects/privacy-consulting",
    desc: "ISMS-P 및 글로벌 데이터 규제 준수를 위한 통합 개인정보 거버넌스 구축",
    status: "View Project"
  },
];

export default function ProjectsPage() {
  const fadeInVariant: HTMLMotionProps<"div"> = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-40 pb-24 px-6 overflow-hidden">
      {/* 소개 페이지와 동일한 배경 글로우 추가 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#C273FF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* --- Header Section (About 페이지와 스타일 동기화) --- */}
        <div className="mb-24">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[#C273FF] text-sm font-bold tracking-[0.3em] mb-6 uppercase"
          >
            Our Expertise
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05]"
          >
            보안 그 이상의 <br />
            <span className="text-zinc-500">가치를 증명합니다</span>
          </motion.h1>
        </div>

        {/* --- Projects Grid --- */}
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12"
        >
          {projects.map((project) => (
            <Link href={project.link} key={project.id} className="group">
              <motion.div 
                variants={{
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="relative h-[450px] rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 group-hover:border-[#C273FF]/30 transition-all duration-500"
              >
                {/* 배경 이미지 */}
                <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                  <img 
                    src={`/images/projects/main-card-bg-${project.id}.png`}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <p className="text-[#C273FF] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                    {project.subtitle}
                  </p>
                  <h3 className="text-3xl font-bold mb-4 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-zinc-400 text-base leading-relaxed mb-8 line-clamp-2 max-w-[90%]">
                    {project.desc}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em]">
                    <span className={`w-1.5 h-1.5 rounded-full ${project.id > 2 ? 'bg-[#C273FF] shadow-[0_0_8px_#C273FF]' : 'bg-zinc-600'}`} />
                    <span className={project.id > 2 ? 'text-white' : 'text-zinc-600'}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="absolute top-10 right-10 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#C273FF] group-hover:border-[#C273FF] transition-all duration-500">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500">
                    <path d="M5 15L15 5M15 5H7M15 5V13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* --- Bottom CTA --- */}
        <motion.div 
          {...fadeInVariant}
          className="mt-40 p-16 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C273FF]/50 to-transparent" />
          <h2 className="text-3xl font-bold mb-6 leading-tight">찾으시는 프로젝트 내용이 없나요?</h2>
          <p className="text-zinc-400 mb-10 leading-relaxed max-w-xl mx-auto">
            엣지시큐리티는 고객사의 특수한 환경과 요구사항에 맞춘 <br className="hidden md:block" /> 
            전용 보안 아키텍처 설계 및 컨설팅 서비스를 제공합니다.
          </p>
          
          <Link 
            href="/contact"
            className="inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-[#C273FF] hover:text-white transition-all duration-500 cursor-pointer"
          >
            기술 협력 문의하기
          </Link>
          
        </motion.div>

      </div>
    </main>
  );
}