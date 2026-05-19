"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase'; // 아까 만든 클라이언트 임포트

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. 폼 데이터 추출
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const message = formData.get('message') as string;

    // 2. Supabase DB에 데이터 삽입 (Insert)
    const { error } = await supabase
      .from('contacts') // 아까 만든 테이블 이름
      .insert([{ name, email, company, message }]);

    if (error) {
      console.error('보안 사고 발생(데이터 전송 실패):', error.message);
      alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    } else {
      // 3. 성공 처리
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-40 pb-24 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#C273FF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#C273FF] text-sm font-bold tracking-[0.4em] mb-6 uppercase">Contact Us</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-[1.05]">
            보안 파트너십의 <br /> <span className="text-zinc-500">첫 걸음을 시작하세요</span>
          </motion.h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900/50 border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-sm">
          {isSuccess ? (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-[#C273FF]/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-[#C273FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">정상적으로 접수되었습니다.</h2>
              <p className="text-zinc-400">엣지시큐리티에서 검토 후 신속히 연락드리겠습니다.</p>
              <button onClick={() => setIsSuccess(false)} className="mt-10 text-[#C273FF] hover:underline">추가 문의하기</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Name</label>
                <input required type="text" name="name" placeholder="성함" className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-4 focus:outline-none focus:border-[#C273FF] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email</label>
                <input required type="email" name="email" placeholder="email@company.com" className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-4 focus:outline-none focus:border-[#C273FF] transition-all" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Company</label>
                <input type="text" name="company" placeholder="회사명 또는 소속" className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-4 focus:outline-none focus:border-[#C273FF] transition-all" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Message</label>
                <textarea required name="message" rows={5} placeholder="문의하실 보안 서비스 내용을 입력해주세요." className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-4 focus:outline-none focus:border-[#C273FF] transition-all resize-none"></textarea>
              </div>
              <div className="md:col-span-2 pt-4">
                <button disabled={isSubmitting} type="submit" className="w-full py-5 bg-white text-black font-bold rounded-xl hover:bg-[#C273FF] hover:text-white transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
                      데이터 보안 전송 중...
                    </>
                  ) : "보안 컨설팅 문의하기 →"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}