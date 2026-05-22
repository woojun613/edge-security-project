"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import createGlobe from 'cobe'; 
import AdminGlobe from '@/components/AdminGlobe';

// 💡 1. 실시간 3D 글로벌 관제 레이더 컴포넌트 (색상 최적화)
function ThreatGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = 0;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 320 * 2,
      height: 320 * 2,
      phi: 0,
      theta: 0.3,
      dark: 1, // 다크모드 매핑 활성화
      diffuse: 1.2,
      mapSamples: 15000, // 대륙 입자 밀도 증가
      mapBrightness: 6,
      // 💡 암흑 배경에서도 대륙 형체가 완벽히 보이도록 그리드 색상 및 밝기 상향 조정
      baseColor: [0.2, 0.2, 0.25], 
      glowColor: [0.15, 0.15, 0.2], 
      markerColor: [239 / 255, 68 / 255, 68 / 255], // 위협 포인트 (레드)
      markers: [
        { location: [37.24, 127.07], size: 0.08 }, // 대한민국 본사 제어 거점
        { location: [55.75, 37.61], size: 0.05 },  // 해외 위협 시뮬레이션 좌표들
        { location: [39.90, 116.40], size: 0.05 },
        { location: [37.77, -122.41], size: 0.05 },
        { location: [51.50, -0.12], size: 0.05 },
        { location: [-23.55, -46.63], size: 0.05 },
      ],
      onRender: (state: any) => {
        phi += 0.006; // 관제 레이더 회전 속도
        state.phi = phi;
      },
    } as any);

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 320, height: 320, maxWidth: "100%", aspectRatio: "1/1", margin: "0 auto" }}
      className="cursor-grab active:cursor-grabbing opacity-90 hover:opacity-100 transition-opacity"
    />
  );
}

// ---------------------------------------------------------
// 데이터 인터페이스 정의
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

interface ThreatLog {
  id: string;
  time: string;
  ip: string;
  country: string;
  type: string;
  status: 'BLOCKED' | 'ALLOWED';
}

export default function IntegratedAdminPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'contacts' | 'members'>('analytics');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // 방문자 통계 상태
  const [weeklyVisitors, setWeeklyVisitors] = useState<{ date: string; count: number }[]>([]);
  const [stats, setStats] = useState({ today: 0, total: 0 });

  // 회원 관리 제어 상태
  const [memberFilter, setMemberFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [memberSort, setMemberSort] = useState<'asc' | 'desc'>('asc');
  const [memberPage, setMemberPage] = useState(1);
  const MEMBERS_PER_PAGE = 10; 

  // 문의 내역 제어 상태
  const [contactSort, setContactSort] = useState<'date_desc' | 'date_asc' | 'name_asc' | 'name_desc'>('date_desc');
  const [contactPage, setContactPage] = useState(1);
  const CONTACTS_PER_PAGE = 5; 

  // 실시간 방화벽 로그 상태
  const [threatLogs, setThreatLogs] = useState<ThreatLog[]>([]);

  const maxVisitorCount = Math.max(...weeklyVisitors.map(v => v.count), 1);

  // 실시간 방화벽 통제 로그 시뮬레이터 (3초 주기 스트리밍)
  useEffect(() => {
    if (activeTab !== 'analytics') return;

    const attackTypes = ['SQL Injection', 'Cross-Site Scripting (XSS)', 'Brute Force Attempt', 'DDoS Pattern Detecting', 'Directory Traversal'];
    const countries = ['RU (Russia)', 'CN (China)', 'US (USA)', 'BR (Brazil)', 'NL (Netherlands)', 'UA (Ukraine)'];
    
    const initialLogs: ThreatLog[] = Array.from({ length: 4 }).map((_, i) => ({
      id: Math.random().toString(),
      time: new Date(Date.now() - i * 4000).toLocaleTimeString(),
      ip: `172.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      country: countries[Math.floor(Math.random() * countries.length)],
      type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
      status: Math.random() > 0.1 ? 'BLOCKED' : 'ALLOWED' 
    }));
    setThreatLogs(initialLogs);

    const interval = setInterval(() => {
      const newLog: ThreatLog = {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString(),
        ip: `${Math.floor(Math.random() * 220) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        country: countries[Math.floor(Math.random() * countries.length)],
        type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
        status: Math.random() > 0.15 ? 'BLOCKED' : 'ALLOWED'
      };
      setThreatLogs(prev => [newLog, ...prev.slice(0, 5)]); 
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Supabase 데이터 패치 쿼리
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
      const { data } = await supabase.from('contacts').select('*');
      setContacts(data || []);
    } else if (activeTab === 'members') {
      const { data } = await supabase.from('profiles').select('*');
      setProfiles(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeTab]);
  useEffect(() => { setMemberPage(1); }, [memberFilter, memberSort]);
  useEffect(() => { setContactPage(1); }, [contactSort]);

  // 등급 변경 함수
  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (!error) {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
    }
  };

  // 회원 데이터 캐싱 가공 (useMemo)
  const processedProfiles = useMemo(() => {
    let result = [...profiles];
    if (memberFilter !== 'all') {
      result = result.filter(p => p.role === memberFilter);
    }
    result.sort((a, b) => {
      const nameA = (a.nickname || a.email).toLowerCase();
      const nameB = (b.nickname || b.email).toLowerCase();
      if (nameA < nameB) return memberSort === 'asc' ? -1 : 1;
      if (nameA > nameB) return memberSort === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [profiles, memberFilter, memberSort]);

  const totalPages = Math.max(Math.ceil(processedProfiles.length / MEMBERS_PER_PAGE), 1);
  const currentProfiles = processedProfiles.slice((memberPage - 1) * MEMBERS_PER_PAGE, memberPage * MEMBERS_PER_PAGE);

  // 문의 데이터 캐싱 가공 (useMemo)
  const processedContacts = useMemo(() => {
    let result = [...contacts];
    result.sort((a, b) => {
      if (contactSort === 'date_desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (contactSort === 'date_asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (contactSort === 'name_asc') return a.name.localeCompare(b.name);
      if (contactSort === 'name_desc') return b.name.localeCompare(a.name);
      return 0;
    });
    return result;
  }, [contacts, contactSort]);

  const totalContactPages = Math.max(Math.ceil(processedContacts.length / CONTACTS_PER_PAGE), 1);
  const currentContacts = processedContacts.slice((contactPage - 1) * CONTACTS_PER_PAGE, contactPage * CONTACTS_PER_PAGE);

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-24 md:pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* 상단 레이아웃 헤더 헤드 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 border-b border-white/5 pb-8 gap-6">
          <div className="w-full">
            <p className="text-[#C273FF] text-xs md:text-sm font-bold tracking-widest mb-2 uppercase">Command Center</p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter">통합 관리 시스템</h1>
            
            {/* 반응형 가로 탭바 */}
            <div className="flex overflow-x-auto gap-3 mt-6 md:mt-8 pb-2 scrollbar-hide">
              {[
                { id: 'analytics', label: '📊 트래픽 통계' },
                { id: 'contacts', label: '📩 문의 내역' },
                { id: 'members', label: '👥 회원 관리' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`whitespace-nowrap text-xs md:text-sm font-bold px-5 py-2.5 rounded-full transition-all shrink-0 ${
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
            className="w-full md:w-auto px-6 py-3 md:py-2 bg-zinc-900 border border-white/10 rounded-lg hover:bg-zinc-800 transition-all text-sm font-bold shrink-0"
          >
            새로고침
          </button>
        </div>

        {/* 뷰 체인지 렌더러 */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-40">
              <div className="w-10 h-10 border-4 border-[#C273FF]/20 border-t-[#C273FF] rounded-full animate-spin" />
            </motion.div>
          ) : activeTab === 'analytics' ? (
            
            /* TAB 1: 트래픽 종합 스탯 관제 */
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              {/* 📡 3D 위협 관제 센터 레이더 뷰 레이아웃 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 bg-zinc-900/40 border border-white/5 rounded-3xl p-6 gap-6 items-center overflow-hidden">
                <div className="lg:col-span-2 flex flex-col items-center justify-center relative bg-black/20 rounded-2xl py-6 border border-white/[0.02]">
                  <div className="absolute top-4 left-6 text-left">
                    <span className="flex h-2 w-2 relative mb-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <h4 className="text-sm font-bold uppercase tracking-wider">Global Threat Radar Map</h4>
                    <p className="text-[10px] text-zinc-500">실시간 글로벌 위협 IP 역추적 시뮬레이션</p>
                  </div>
                  
                  {/* 최적화된 독립형 3D 컴포넌트 탑재 */}
                  <AdminGlobe />
                </div>

                {/* 웅장한 방화벽 검문소 터미널 로그 */}
                <div className="bg-black/80 border border-white/10 rounded-2xl p-4 h-[340px] flex flex-col justify-between font-mono text-xs overflow-hidden">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3 shrink-0">
                    <span className="text-[#C273FF] font-bold text-[10px] tracking-widest">EDGE SECURITY FIREWALL</span>
                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">LIVE WATCH</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-hide">
                    <AnimatePresence>
                      {threatLogs.map((log) => (
                        <motion.div key={log.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="border-b border-white/[0.02] pb-1.5">
                          <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
                            <span>[{log.time}]</span>
                            <span className={log.status === 'BLOCKED' ? 'text-red-400 font-bold' : 'text-emerald-400'}>{log.status}</span>
                          </div>
                          <div className="text-zinc-300 truncate text-[11px]">
                            <span className="text-purple-400">{log.type}</span> from <span className="text-zinc-400 font-bold">{log.ip}</span> ({log.country})
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* 통계 스코어보드 */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
                <div className="bg-zinc-900/50 border border-white/5 p-4 md:p-6 rounded-2xl">
                  <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1 md:mb-2 text-balance">오늘 방문자</p>
                  <p className="text-2xl md:text-4xl font-black text-white">{stats.today} <span className="text-zinc-500 text-xs md:text-sm font-normal ml-1">명</span></p>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 p-4 md:p-6 rounded-2xl">
                  <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1 md:mb-2 text-balance">주간 누적 방문자</p>
                  <p className="text-2xl md:text-4xl font-black text-white">{stats.total} <span className="text-zinc-500 text-xs md:text-sm font-normal ml-1">명</span></p>
                </div>
              </div>

              {/* 주간 방문 트래픽 차트 */}
              <div className="bg-zinc-900/50 border border-white/5 p-4 md:p-8 rounded-2xl">
                <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8">주간 방문자 추이</h3>
                {stats.total === 0 ? (
                  <div className="h-48 md:h-64 flex items-center justify-center text-zinc-500 text-sm">아직 데이터가 없습니다.</div>
                ) : (
                  <div className="overflow-x-auto pb-2 pt-12 scrollbar-hide">
                    <div className="min-w-[320px] h-40 md:h-56 flex items-end gap-2 md:gap-8">
                      {weeklyVisitors.map((data, index) => {
                        const barHeight = (data.count / maxVisitorCount) * 90;
                        return (
                          <div key={index} className="flex-1 flex flex-col justify-end items-center gap-2 md:gap-4 group h-full">
                            <div className="relative w-full flex justify-center h-full items-end">
                              <div className="absolute -top-8 md:-top-10 bg-black text-white text-[10px] md:text-xs font-bold py-1 px-2 md:px-3 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-white/10">
                                {data.count}
                              </div>
                              <motion.div 
                                initial={{ height: 0 }} 
                                animate={{ height: `${barHeight}%` }} 
                                transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }} 
                                className="w-full max-w-[20px] md:max-w-[40px] bg-gradient-to-t from-[#C273FF]/10 to-[#C273FF] rounded-t-sm md:rounded-t-md opacity-90 md:opacity-70 md:group-hover:opacity-100 transition-opacity" 
                              />
                            </div>
                            <span className="text-zinc-500 text-[9px] md:text-xs font-medium">{data.date}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeTab === 'contacts' ? (
            
            /* TAB 2: 고객사 1:1 인콰이어리 문의 내역 */
            <motion.div key="contacts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-900/50 border border-white/5 p-4 rounded-xl gap-4">
                <select 
                  value={contactSort} 
                  onChange={(e) => setContactSort(e.target.value as any)} 
                  className="w-full sm:w-auto bg-zinc-800 text-white text-sm font-bold px-4 py-3 sm:py-2 rounded-lg border border-white/10 outline-none focus:border-[#C273FF] transition-all cursor-pointer"
                >
                  <option value="date_desc">최신순 ↓</option>
                  <option value="date_asc">과거순 ↑</option>
                  <option value="name_asc">이름 가나다순 ↓</option>
                  <option value="name_desc">이름 역순 ↑</option>
                </select>
                <div className="text-zinc-500 text-xs sm:text-sm font-bold">
                  총 <span className="text-[#C273FF]">{processedContacts.length}</span>건의 문의
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {currentContacts.length === 0 ? (
                  <div className="text-center py-20 md:py-40 text-zinc-500 border border-white/5 rounded-2xl bg-zinc-900/50 text-sm">접수된 문의가 없습니다.</div>
                ) : (
                  currentContacts.map((item, index) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="bg-zinc-900/50 border border-white/5 p-5 md:p-8 rounded-2xl hover:border-[#C273FF]/30 transition-all">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 md:gap-6">
                        <div className="space-y-3 md:space-y-4 flex-1 overflow-hidden">
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="px-2 md:px-3 py-1 bg-[#C273FF]/10 text-[#C273FF] text-[9px] md:text-[10px] font-bold rounded-full uppercase">Inquiry</span>
                            <span className="text-zinc-500 text-[10px] md:text-xs">{new Date(item.created_at).toLocaleString()}</span>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold truncate">{item.name} <span className="text-zinc-500 text-xs md:text-sm font-normal ml-1 md:ml-2">{item.company}</span></h3>
                          <p className="text-zinc-300 md:text-zinc-400 text-sm md:text-base leading-relaxed bg-black/30 p-4 md:p-6 rounded-xl border border-white/5 whitespace-pre-wrap">{item.message}</p>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 pt-2 md:pt-0">
                          <a href={`mailto:${item.email}`} className="flex-1 md:w-28 py-3 md:py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-[#C273FF] hover:text-white transition-all text-center flex items-center justify-center">답변하기</a>
                          <button 
                            onClick={async () => { 
                              if(confirm('정말 삭제하시겠습니까?')) { 
                                // 1. 실제 삭제 실행
                                const { error: deleteError } = await supabase
                                  .from('contacts')
                                  .delete()
                                  .eq('id', item.id);

                                if (deleteError) {
                                  console.error("삭제 에러:", deleteError);
                                  alert("삭제 실패: " + deleteError.message);
                                } else {
                                  alert("성공적으로 삭제되었습니다!");
                                  fetchData(); // 화면을 새로고침해서 목록을 갱신합니다.
                                }
                              } 
                            }}
                            className="flex-1 md:w-28 py-3 md:py-2 bg-zinc-800 text-zinc-400 text-xs font-bold rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-all"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* 문의 리스트 페이지네이션 */}
              {totalContactPages > 1 && (
                <div className="flex justify-center items-center gap-1 md:gap-2 mt-6 md:mt-8">
                  <button onClick={() => setContactPage(p => Math.max(1, p - 1))} disabled={contactPage === 1} className="px-3 py-2 rounded-lg bg-zinc-900 border border-white/5 text-white disabled:opacity-30 font-bold">&lt;</button>
                  {Array.from({ length: totalContactPages }).map((_, idx) => (
                    <button key={idx} onClick={() => setContactPage(idx + 1)} className={`w-8 md:w-10 h-8 md:h-10 rounded-lg text-xs md:text-sm font-bold ${contactPage === idx + 1 ? 'bg-[#C273FF] text-white' : 'bg-zinc-900 text-zinc-400'}`}>{idx + 1}</button>
                  ))}
                  <button onClick={() => setContactPage(p => Math.min(totalContactPages, p + 1))} disabled={contactPage === totalContactPages} className="px-3 py-2 rounded-lg bg-zinc-900 border border-white/5 text-white disabled:opacity-30 font-bold">&gt;</button>
                </div>
              )}
            </motion.div>
          ) : (
            
            /* TAB 3: 엔터프라이즈 계정 권한 통제실 */
            <motion.div key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-900/50 border border-white/5 p-4 rounded-xl gap-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value as any)} className="w-full sm:w-auto bg-zinc-800 text-white text-sm font-bold px-4 py-3 sm:py-2 rounded-lg border border-white/10 outline-none focus:border-[#C273FF] transition-all cursor-pointer">
                    <option value="all">전체 회원</option>
                    <option value="admin">관리자만 (Admin)</option>
                    <option value="user">일반 회원 (User)</option>
                  </select>
                  <button onClick={() => setMemberSort(prev => prev === 'asc' ? 'desc' : 'asc')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-800 text-white text-sm font-bold px-4 py-3 sm:py-2 rounded-lg border border-white/10 hover:border-[#C273FF] transition-all">
                    {memberSort === 'asc' ? '가나다순 ↓' : '역순 ↑'}
                  </button>
                </div>
                <div className="text-zinc-500 text-xs sm:text-sm font-bold w-full sm:w-auto text-right sm:text-left">검색 결과: <span className="text-[#C273FF]">{processedProfiles.length}</span>명</div>
              </div>

              {/* 회원 표 반응형 레이아웃 */}
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-x-auto scrollbar-hide">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">User Info</th>
                      <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                      <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {currentProfiles.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-20 text-center text-zinc-500 font-bold text-sm">조건에 맞는 회원이 없습니다.</td></tr>
                    ) : (
                      currentProfiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 md:px-6 py-4 md:py-6">
                            <div className="text-white font-bold text-sm md:text-base">{profile.nickname || 'Guest'}</div>
                            <div className="text-zinc-500 text-[10px] md:text-xs">{profile.email}</div>
                          </td>
                          <td className="px-4 md:px-6 py-4 md:py-6">
                            <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${profile.role === 'admin' ? 'bg-[#C273FF]/10 text-[#C273FF] border border-[#C273FF]/20' : 'bg-zinc-800 text-zinc-500'}`}>{profile.role}</span>
                          </td>
                          <td className="px-4 md:px-6 py-4 md:py-6 text-right">
                            <button onClick={() => toggleRole(profile.id, profile.role)} className="text-[10px] md:text-xs font-bold px-3 md:px-4 py-2 rounded-lg border border-white/10 text-zinc-400 hover:border-[#C273FF] hover:text-[#C273FF] transition-all whitespace-nowrap">
                              {profile.role === 'admin' ? '권한 해제' : '관리자 승격'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* 멤버 관리 페이징 제어단 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 md:gap-2 mt-6 md:mt-8">
                  <button onClick={() => setMemberPage(p => Math.max(1, p - 1))} disabled={memberPage === 1} className="px-3 py-2 rounded-lg bg-zinc-900 border border-white/5 text-white disabled:opacity-30 font-bold">&lt;</button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button key={idx} onClick={() => setMemberPage(idx + 1)} className={`w-8 md:w-10 h-8 md:h-10 rounded-lg text-xs md:text-sm font-bold ${memberPage === idx + 1 ? 'bg-[#C273FF] text-white' : 'bg-zinc-900 text-zinc-400'}`}>{idx + 1}</button>
                  ))}
                  <button onClick={() => setMemberPage(p => Math.min(totalPages, p + 1))} disabled={memberPage === totalPages} className="px-3 py-2 rounded-lg bg-zinc-900 border border-white/5 text-white disabled:opacity-30 font-bold">&gt;</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}