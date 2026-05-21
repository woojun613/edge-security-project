"use client";

import React, { useEffect, useState, useMemo } from 'react';
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

  // 방문자 통계 상태
  const [weeklyVisitors, setWeeklyVisitors] = useState<{ date: string; count: number }[]>([]);
  const [stats, setStats] = useState({ today: 0, total: 0 });

  // 💡 [추가된 부분] 회원 관리 탭을 위한 제어 상태
  const [memberFilter, setMemberFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [memberSort, setMemberSort] = useState<'asc' | 'desc'>('asc');
  const [memberPage, setMemberPage] = useState(1);
  const MEMBERS_PER_PAGE = 10; // 한 페이지에 보여줄 인원 수

  const maxVisitorCount = Math.max(...weeklyVisitors.map(v => v.count), 1);

  const fetchData = async () => {
    setLoading(true);
    
    if (activeTab === 'analytics') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('page_views')
        .select('created_at, ip_address') 
        .gte('created_at', sevenDaysAgo.toISOString());

      if (data && !error) {
        const formatDate = (date: Date) => {
          const m = String(date.getMonth() + 1).padStart(2, '0');
          const d = String(date.getDate()).padStart(2, '0');
          return `${m}/${d}`;
        };

        const todayStr = formatDate(new Date());
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return formatDate(d);
        });

        const uniqueIpsPerDate: { [key: string]: Set<string> } = {};
        last7Days.forEach(date => { uniqueIpsPerDate[date] = new Set(); });

        data.forEach(row => {
          const rowDate = formatDate(new Date(row.created_at));
          if (uniqueIpsPerDate[rowDate] !== undefined && row.ip_address) {
            uniqueIpsPerDate[rowDate].add(row.ip_address);
          }
        });

        const counts: { [key: string]: number } = {};
        last7Days.forEach(date => { counts[date] = uniqueIpsPerDate[date].size; });

        setWeeklyVisitors(last7Days.map(date => ({ date, count: counts[date] })));
        setStats({
          today: counts[todayStr] || 0,
          total: new Set(data.map(row => row.ip_address).filter(Boolean)).size 
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

  // 💡 [추가된 부분] 필터나 정렬이 바뀌면 무조건 1페이지로 되돌아가는 로직
  useEffect(() => {
    setMemberPage(1);
  }, [memberFilter, memberSort]);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (!error) {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
    }
  };

  // 💡 [추가된 부분] 원본 데이터를 건드리지 않고 화면용으로 가공하는 마법의 로직 (useMemo)
  const processedProfiles = useMemo(() => {
    let result = [...profiles];

    // 1. 역할 필터링 (Admin/User)
    if (memberFilter !== 'all') {
      result = result.filter(p => p.role === memberFilter);
    }

    // 2. 가나다순 정렬 (닉네임이 없으면 이메일 기준)
    result.sort((a, b) => {
      const nameA = (a.nickname || a.email).toLowerCase();
      const nameB = (b.nickname || b.email).toLowerCase();
      if (nameA < nameB) return memberSort === 'asc' ? -1 : 1;
      if (nameA > nameB) return memberSort === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [profiles, memberFilter, memberSort]);

  // 전체 페이지 수 계산
  const totalPages = Math.max(Math.ceil(processedProfiles.length / MEMBERS_PER_PAGE), 1);
  
  // 현재 페이지 번호에 맞게 10명만 잘라내기
  const currentProfiles = processedProfiles.slice(
    (memberPage - 1) * MEMBERS_PER_PAGE,
    memberPage * MEMBERS_PER_PAGE
  );

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
            className="px-6 py-2 bg-zinc-900 border border-white/10 rounded-lg hover:bg-zinc-800 transition-all text-sm font-bold"
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
            
            /* 통계 화면 (기존과 동일) */
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
                {stats.total === 0 ? (
                  <div className="h-64 flex items-center justify-center text-zinc-500">
                    아직 수집된 방문자 데이터가 없습니다.
                  </div>
                ) : (
                  <div className="h-64 flex items-end gap-2 md:gap-8 mt-10">
                    {weeklyVisitors.map((data, index) => {
                      const barHeight = (data.count / maxVisitorCount) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col justify-end items-center gap-4 group h-full">
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
            
            /* 문의 내역 (기존과 동일) */
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
            
            /* 💡 회원 관리 (UI 완벽 업그레이드) */
            <motion.div key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              {/* 컨트롤 패널 (필터 및 정렬) */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-900/50 border border-white/5 p-4 rounded-xl gap-4">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <select 
                    value={memberFilter} 
                    onChange={(e) => setMemberFilter(e.target.value as any)}
                    className="bg-zinc-800 text-white text-sm font-bold px-4 py-2 rounded-lg border border-white/10 outline-none focus:border-[#C273FF] transition-all cursor-pointer"
                  >
                    <option value="all">전체 보기</option>
                    <option value="admin">관리자만 (Admin)</option>
                    <option value="user">일반 회원만 (User)</option>
                  </select>
                  
                  <button 
                    onClick={() => setMemberSort(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-2 bg-zinc-800 text-white text-sm font-bold px-4 py-2 rounded-lg border border-white/10 hover:border-[#C273FF] hover:text-[#C273FF] transition-all"
                  >
                    {memberSort === 'asc' ? '이름 가나다순 ↓' : '이름 역순 ↑'}
                  </button>
                </div>
                <div className="text-zinc-500 text-sm font-bold">
                  검색 결과: <span className="text-[#C273FF]">{processedProfiles.length}</span>명
                </div>
              </div>

              {/* 회원 테이블 영역 */}
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">User Info</th>
                      <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {currentProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-20 text-center text-zinc-500 font-bold">
                          조건에 맞는 회원이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      currentProfiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-6">
                            <div className="text-white font-bold">{profile.nickname || 'Guest'}</div>
                            <div className="text-zinc-500 text-xs">{profile.email}</div>
                          </td>
                          <td className="px-6 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              profile.role === 'admin' 
                              ? 'bg-[#C273FF]/10 text-[#C273FF] border border-[#C273FF]/20' 
                              : 'bg-zinc-800 text-zinc-500'
                            }`}>
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 (10명 초과 시 등장) */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button 
                    onClick={() => setMemberPage(p => Math.max(1, p - 1))}
                    disabled={memberPage === 1}
                    className="px-3 py-2 rounded-lg bg-zinc-900 border border-white/5 text-white disabled:opacity-30 hover:bg-zinc-800 hover:border-[#C273FF]/50 transition-all font-bold"
                  >
                    &lt;
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMemberPage(idx + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                        memberPage === idx + 1 
                        ? 'bg-[#C273FF] text-white shadow-[0_0_15px_rgba(194,115,255,0.4)]' 
                        : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-[#C273FF]/50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => setMemberPage(p => Math.min(totalPages, p + 1))}
                    disabled={memberPage === totalPages}
                    className="px-3 py-2 rounded-lg bg-zinc-900 border border-white/5 text-white disabled:opacity-30 hover:bg-zinc-800 hover:border-[#C273FF]/50 transition-all font-bold"
                  >
                    &gt;
                  </button>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}