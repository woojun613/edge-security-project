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
  const [activeTab, setActiveTab] = useState<'analytics' | 'contacts' | 'members'>('analytics');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // 💡 1. 방문자 통계를 담을 실제 상태(State) 추가
  const [weeklyVisitors, setWeeklyVisitors] = useState<{ date: string; count: number }[]>([]);
  const [stats, setStats] = useState({ today: 0, total: 0 });

  // 차트 높이 비율을 계산하기 위한 가장 높은 방문자 수 (데이터가 0일 때 에러 방지용으로 기본값 1 설정)
  const maxVisitorCount = Math.max(...weeklyVisitors.map(v => v.count), 1);

  // 💡 2. 데이터 불러오기 (통합)
  const fetchData = async () => {
    setLoading(true);
    
    if (activeTab === 'analytics') {
      // 최근 7일 날짜 계산
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 오늘 포함 7일
      sevenDaysAgo.setHours(0, 0, 0, 0);

      // Supabase에서 최근 7일간의 방문 기록 가져오기
      const { data, error } = await supabase
        .from('page_views')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (data && !error) {
        const todayStr = new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('. ', '/').replace('.', '');

        // 최근 7일 날짜 배열 뼈대 만들기 (예: '05/14', '05/15')
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('. ', '/').replace('.', '');
        });

        // 날짜별로 방문자 수 카운팅
        const counts: { [key: string]: number } = {};
        last7Days.forEach(date => { counts[date] = 0; });

        data.forEach(row => {
          const dateStr = new Date(row.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('. ', '/').replace('.', '');
          if (counts[dateStr] !== undefined) {
            counts[dateStr] += 1;
          }
        });

        // 차트와 상단 요약본 상태 업데이트
        setWeeklyVisitors(last7Days.map(date => ({ date, count: counts[date] })));
        setStats({
          today: counts[todayStr] || 0,
          total: data.length // 최근 7일 누적 방문자
        });
      }
    } else if (activeTab === 'contacts') {
      const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      setContacts(data || []);
    } else if (activeTab === 'members') {
      const { data } = await supabase.from('profiles').select('*').order('updated_at', { ascending: false });
      setProfiles(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

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
            
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { id: 'analytics', label: '📊 트래픽 통계' },
                { id: 'contacts', label: '📩 문의 내역' },
                { id: 'members', label: '👥 회원 관리' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-sm font-bold px-6 py-2 rounded-full transition-all ${
                    activeTab === tab.id 
                    ? 'bg-[#C273FF] text-white shadow-[0_0_20px_rgba(194,115,255,0.3)]' 
                    : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-white/5'
                  }`}
                >
                  {tab.label}
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
          ) : activeTab === 'analytics' ? (
            
            /* 💡 3. 실제 DB 데이터가 연동된 통계 화면 */
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-2">오늘 방문자</p>
                  <p className="text-4xl font-black text-white">{stats.today} <span className="text-zinc-500 text-sm font-normal ml-2">명</span></p>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-2">주간 누적 방문자</p>
                  <p className="text-4xl font-black text-white">{stats.total} <span className="text-zinc-500 text-sm font-normal ml-2">명</span></p>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-8">주간 방문자 추이</h3>
                
                {/* 데이터가 없을 때의 화면 처리 */}
                {stats.total === 0 ? (
                  <div className="h-64 flex items-center justify-center text-zinc-500">
                    아직 수집된 방문자 데이터가 없습니다.
                  </div>
                ) : (
                  <div className="h-64 flex items-end gap-2 md:gap-8 mt-10">
                    {weeklyVisitors.map((data, index) => {
                      const barHeight = (data.count / maxVisitorCount) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-4 group">
                          <div className="relative w-full flex justify-center h-full items-end">
                            <div className="absolute -top-10 bg-black text-white text-xs font-bold py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 border border-white/10">
                              {data.count}명
                            </div>
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${barHeight}%` }}
                              transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                              className="w-full max-w-[40px] bg-gradient-to-t from-[#C273FF]/10 to-[#C273FF] rounded-t-md opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                          </div>
                          <span className="text-zinc-500 text-[10px] md:text-xs font-medium">{data.date}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeTab === 'contacts' ? (
            
            /* 문의 내역 */
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
            
            /* 회원 관리 */
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