"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {

  const projectList = [
    { id: 1, title: "웹 취약점 진단 가이드", subtitle: "Web Security Audit", link: "/projects/web-security" }, // 실제 파일이 존재하는 경로 (준비 중 페이지)
    { id: 2, title: "제로트러스트 아키텍처", subtitle: "Zero-Trust Design", link: "/projects/zero-trust" }, // 존재하지 않는 경로로 설정하여 커스텀 404(not-found.tsx)를 유도
    { id: 3, title: "인공지능 보안 가이드북", subtitle: "AI Security Guide", link: "/projects/ai-security" },
    { id: 4, title: "개인 정보보호 컨설팅", subtitle: "Privacy Consulting", link: "/projects/privacy-consulting" },
  ];

  return (
    <main className="bg-black text-white selection:bg-[#C273FF]/30">
      
      {/* 1. 히어로 섹션 */}
      <section className="h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* 배경 조명 효과 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#484AF7]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          {/* 서브 타이틀 */}
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-[#C273FF] text-xs md:text-sm font-medium mb-6 uppercase"
          >
            Technology to People
          </motion.p>

          {/* 메인 타이틀 */}
          <h1 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tighter mb-8 text-white">
            우리는 <br />
            <span className="bg-gradient-to-r from-[#C273FF] via-[#484AF7] to-[#C273FF] bg-clip-text text-transparent">
              문제를 해결합니다
            </span>
          </h1>

          {/* 설명 문구 (이하 동일 부분 복구) */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-zinc-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
          >
            엣지시큐리티는 단순한 기술을 넘어 <br className="hidden md:block" />
            사람을 향한 보안 솔루션을 설계하고 구축합니다.
          </motion.p>
        </motion.div>

        {/* 스크롤 유도 아이콘 (애니메이션 추가) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] text-zinc-600 uppercase">Scroll</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" 
            />
          </div>
        </motion.div>
      </section>

      {/* 2. 프로젝트 미리보기 섹션 (스크롤 감지 페이드인) */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Selected Projects</h2>
          <div className="w-12 h-[2px] bg-[#C273FF]" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projectList.map((project) => (
            <Link 
              href={project.link}
              key={project.id}
              className="block" // Link가 전체 영역을 차지하도록 설정
            >
              <motion.div  // 모션 컴포넌트    프레이머 모션(Framer Motion) 라이브러리
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: project.id * 0.1 }}
                // hover 시 카드가 살짝 떠오르는 시네마틱 효과 추가
                whileHover={{ y: -10 }} 
                className="relative h-[500px] bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden group cursor-pointer"
              >
                {/* 이미지 섹션 */}
                <Image 
                  src={`/images/main/sub-hero-bg${project.id}.png`} 
                  alt={project.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                
                {/* 텍스트 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10">
                  <p className="text-[#C273FF] text-xs font-bold mb-2 tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {project.subtitle}
                  </p>
                  <h3 className="text-2xl font-bold text-white group-hover:text-[#C273FF] transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {project.title}
                  </h3>
                  
                  {/* '자세히 보기' 화살표 아이콘 (시네마틱 디테일) */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-xs text-zinc-400">
                    <span>VIEW PROJECT</span>
                    <div className="w-4 h-[1px] bg-zinc-400" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}