"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden text-white">
      
      {/* 1. 배경 이펙트 (동일 무드 유지) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20" 
            style={{ backgroundImage: 'linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF4848]/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-4"
      >
        {/* 에러 배지 */}
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block px-3 py-1 border border-red-500/30 rounded-full bg-red-500/5 mb-6"
        >
          <span className="text-red-500 text-[10px] font-bold tracking-[0.3em] uppercase">
            404 Error: Access Denied
          </span>
        </motion.div>

        {/* 메인 텍스트 */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          페이지를 <br className="md:hidden" /> 
          <span className="bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            찾을 수 없습니다
          </span>
        </h1>

        <p className="text-zinc-500 text-sm md:text-base font-light max-w-md mx-auto leading-relaxed mb-12">
          요청하신 경로는 존재하지 않거나 보안상 접근이 제한되었습니다. <br />
          아래 버튼을 통해 안전한 구역으로 이동해 주세요.
        </p>

        {/* 메인으로 복귀 */}
        <Link href="/">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-black text-xs font-bold rounded-full hover:bg-red-500 hover:text-white transition-colors duration-300 shadow-xl shadow-white/5"
          >
            안전 구역으로 돌아가기 (Main)
          </motion.button>
        </Link>
      </motion.div>

      {/* 하단 장식용 데이터 라인 */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="flex flex-col gap-1 text-[8px] text-zinc-700 font-mono">
          <p>STATUS: 404_NOT_FOUND</p>
          <p>LOG_LEVEL: CRITICAL</p>
          <p>REF: {typeof window !== 'undefined' ? window.location.pathname : 'unknown'}</p>
        </div>
      </div>
    </main>
  );
}