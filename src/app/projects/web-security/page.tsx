"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ProjectDetail() {
  return (
    <main className="h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden text-white">
      
      {/* 1. 배경 이펙트 (시네마틱 무드) */}
      <div className="absolute inset-0">
        {/* 은은한 그리드 배경 (보안 장비 느낌) */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        
        {/* 중앙에서 뿜어져 나오는 푸른 조명 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#484AF7]/15 blur-[150px] rounded-full" />
      </div>

      {/* 2. 콘텐츠 섹션 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-4"
      >
        {/* 상단 배지 */}
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block px-3 py-1 border border-[#C273FF]/30 rounded-full bg-[#C273FF]/5 mb-6"
        >
          <span className="text-[#C273FF] text-[10px] font-bold tracking-[0.3em] uppercase">
            System Updating...
          </span>
        </motion.div>

        {/* 메인 텍스트 */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          콘텐츠를 <br className="md:hidden" /> 
          <span className="bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            준비 중입니다
          </span>
        </h1>

        <p className="text-zinc-500 text-sm md:text-base font-light max-w-md mx-auto leading-relaxed mb-12">
          더 정교하고 안전한 정보를 전달하기 위해 <br />
          현재 상세 내용을 구성하고 있습니다. 곧 공개됩니다.
        </p>

        {/* 3. 하단 액션 버튼 */}
        <Link href="/">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-black text-xs font-bold rounded-full hover:bg-[#C273FF] hover:text-white transition-colors duration-300 shadow-xl shadow-white/5"
          >
            메인으로 돌아가기
          </motion.button>
        </Link>
      </motion.div>

      {/* 4. 장식용 데이터 라인 (사이드) */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="flex flex-col gap-1 text-[8px] text-zinc-700 font-mono">
          <p>STATUS: DEPLOYING_CONTENT</p>
          <p>LOCATION: KR_HWASEONG_EDGE_HQ</p>
          <p>ENCRYPTION: AES_256_ACTIVE</p>
        </div>
      </div>
    </main>
  );
}