"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// 인터페이스 정의
interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  role: string;
  nickname: string;
  updated_at: string;
}

export default function IntegratedAdminPage() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'members'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 데이터 불러오기 (통합)
  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'contacts') {
      const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      setContacts(data || []);
    } else {
      const { data } = await supabase.from('profiles').select('*').order('updated_at', { ascending: false });
      setProfiles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  // 2. 회원 권한 변경 로직
  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (!error) {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* 상단 헤더 & 탭 제어 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/5 pb-8 gap-6">
          <div>
            <p className="text-[#C273FF] text-sm font-bold tracking-widest mb-2 uppercase">Command Center</p>
            <h1 className="text-4xl font-extrabold tracking-tighter">통합 관리 시스템</h1>
            
            {/* 탭 버튼 세트 */}
            <div className="flex gap-4 mt-8">
              {['contacts', 'members'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`text-sm font-bold px-6 py-2 rounded-full transition-all ${
                    activeTab === tab 
                    ? 'bg-[#C273FF] text-white shadow-[0_0_20px_rgba(194,115,255,0.3)]' 
                    : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-white/5'
                  }`}
                >
                  {tab === 'contacts' ? '📩 문의 내역' : '👥 회원 관리'}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={fetchData}
            className="px-6 py-2 bg-zinc-900 border border-white/10 rounded-lg hover:bg-zinc-800 transition-all text-sm"
          >
            새로고침
          </button>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-40">
              <div className="w-10 h-10 border-4 border-[#C273FF]/20 border-t-[#C273FF] rounded-full animate-spin" />
            </motion.div>
          ) : activeTab === 'contacts' ? (
            /* 탭 1: 문의 관리 섹션 */
            <motion.div key="contacts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-6">
              {contacts.length === 0 ? (
                <div className="text-center py-40 text-zinc-500">접수된 문의가 없습니다.</div>
              ) : (
                contacts.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                    className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl hover:border-[#C273FF]/30 transition-all">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-[#C273FF]/10 text-[#C273FF] text-[10px] font-bold rounded-full uppercase">Inquiry</span>
                          <span className="text-zinc-500 text-xs">{new Date(item.created_at).toLocaleString()}</span>
                        </div>
                        <h3 className="text-xl font-bold">{item.name} <span className="text-zinc-500 text-sm font-normal ml-2">{item.company}</span></h3>
                        <p className="text-zinc-400 leading-relaxed bg-black/30 p-6 rounded-xl border border-white/5 whitespace-pre-wrap">{item.message}</p>
                      </div>
                      <div className="flex md:flex-col gap-2">
                        <button className="flex-1 md:w-32 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-[#C273FF] hover:text-white transition-all">답변하기</button>
                        <button onClick={async () => { if(confirm('삭제하시겠습니까?')) { await supabase.from('contacts').delete().eq('id', item.id); fetchData(); } }}
                          className="flex-1 md:w-32 py-2 bg-zinc-800 text-zinc-400 text-xs font-bold rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-all">삭제</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            /* 탭 2: 회원 관리 섹션 */
            <motion.div key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">User Info</th>
                    <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-6">
                        <div className="text-white font-bold">{profile.nickname || 'Guest'}</div>
                        <div className="text-zinc-500 text-xs">{profile.email}</div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${profile.role === 'admin' ? 'bg-[#C273FF]/10 text-[#C273FF] border border-[#C273FF]/20' : 'bg-zinc-800 text-zinc-500'}`}>
                          {profile.role}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button onClick={() => toggleRole(profile.id, profile.role)}
                          className="text-xs font-bold px-4 py-2 rounded-lg border border-white/10 text-zinc-400 hover:border-[#C273FF] hover:text-[#C273FF] transition-all">
                          {profile.role === 'admin' ? '권한 해제' : '관리자 승격'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}