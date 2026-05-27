"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2초 뒤에 로딩이 끝나도록 설정 (실제 컨텐츠 로딩에 맞춰 조정 가능)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 보안 분석 중인 느낌을 주는 텍스트 애니메이션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-[#C273FF] text-2xl font-bold tracking-widest mb-4">
              EDGE SECURITY
            </h2>
            <p className="text-zinc-500 text-sm">
              인프라 보안 프로토콜 분석 중...
            </p>
          </motion.div>
          
          {/* 하단 로딩 바 */}
          <motion.div 
            className="w-48 h-[2px] bg-zinc-800 mt-8 overflow-hidden"
          >
            <motion.div 
              className="h-full bg-[#C273FF]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}