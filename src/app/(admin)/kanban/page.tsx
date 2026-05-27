"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Task {
  id: string;
  title: string;
  status: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  position: number;
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 💡 [추가] 폼 입력을 위한 상태 관리
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTags, setNewTaskTags] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true });
      
      if (error) {
        alert("데이터를 불러오는 중 오류가 발생했습니다: " + error.message);
      } else if (data) {
        setTasks(data);
      }
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.currentTarget.classList.add('opacity-50'); 
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    const previousTasks = [...tasks];
    
    // [프론트엔드] 낙관적 업데이트
    setTasks(prev => 
      prev.map(task => task.id === taskId ? { ...task, status: newStatus } : task)
    );

    // [백엔드] Supabase 업데이트
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      setTasks(previousTasks);
      alert("상태 업데이트 실패: " + error.message);
    }
  };

  // PC 환경의 드래그 앤 드롭 처리
  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    updateTaskStatus(taskId, newStatus); // 분리한 함수 호출
  };

  // 💡 [추가] 새로운 프로젝트를 DB에 추가하는 함수
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsSubmitting(true);

    // 쉼표로 구분된 태그 문자열을 배열로 변환하고 공백 제거
    const tagsArray = newTaskTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newTask = {
      title: newTaskTitle,
      status: 'todo', // 무조건 '진단 대기' 기둥으로 들어갑니다.
      tags: tagsArray,
      priority: newTaskPriority,
      position: tasks.length + 1
    };

    // Supabase에 데이터 삽입 (insert 후 select로 방금 넣은 데이터를 반환받음)
    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select();

    if (error) {
      alert("프로젝트 추가 실패: " + error.message);
    } else if (data) {
      setTasks([...tasks, data[0]]); // 화면에 즉시 반영
      // 입력 폼 초기화
      setNewTaskTitle('');
      setNewTaskTags('');
      setNewTaskPriority('medium');
    }
    setIsSubmitting(false);
  };

  // 💡 [추가] 프로젝트를 삭제하는 함수
  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (!confirm(`'${taskTitle}' 프로젝트를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;

    const previousTasks = [...tasks];
    
    // [프론트엔드] 화면에서 먼저 즉시 제거 (낙관적 업데이트)
    setTasks(tasks.filter(t => t.id !== taskId));

    // [백엔드] Supabase에서 실제 데이터 삭제
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      setTasks(previousTasks); // 실패 시 복구
      alert("삭제 실패: " + error.message);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#C273FF]/20 border-t-[#C273FF] rounded-full animate-spin" />
      </div>
    );
  }

  const columns = [
    { id: 'todo', title: '진단 대기 (To Do)' },
    { id: 'in_progress', title: '취약점 분석 중 (In Progress)' },
    { id: 'done', title: '조치 및 보고서 완료 (Done)' },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-28 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 헤더 타이틀 */}
        <div>
          <p className="text-[#C273FF] text-xs md:text-sm font-bold tracking-widest uppercase mb-2">Project Management</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter">보안 컨설팅 프로젝트 보드</h1>
          <p className="text-zinc-400 text-sm mt-2">드래그 앤 드롭으로 진행 상태를 제어하고 신규 프로젝트를 등록하세요.</p>
        </div>

        {/* 칸반 보드 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div 
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 flex flex-col h-full min-h-[500px]"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <h2 className="text-sm font-bold text-zinc-300">{column.title}</h2>
                <span className="bg-black/50 text-xs font-bold px-2.5 py-1 rounded-full text-[#C273FF]">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>

              <div className="flex-1 space-y-4">
                {tasks.filter(t => t.status === column.id).map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    className="group bg-zinc-800/50 border border-white/10 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-[#C273FF]/50 transition-all shadow-lg relative"
                  >
                    {/* 우선순위 뱃지와 삭제 버튼 */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      
                      {/* 💡 [추가] 삭제 버튼 (평소엔 흐릿하다가 호버 시 선명해짐) */}
                      <button 
                        onClick={() => handleDeleteTask(task.id, task.title)}
                        className="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                        title="프로젝트 삭제"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <h3 className="text-sm font-bold text-white mb-3 leading-snug">
                      {task.title}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {task.tags?.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 md:hidden">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-[#C273FF] cursor-pointer appearance-none text-center"
                      >
                        <option value="todo">➡️ 진단 대기로 이동</option>
                        <option value="in_progress">➡️ 취약점 분석 중으로 이동</option>
                        <option value="done">➡️ 조치 완료로 이동</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 💡 [추가] 신규 프로젝트 등록 폼 영역 */}
        <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8 mt-12">
          <h2 className="text-xl font-bold mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
            <span className="text-[#C273FF]">+</span> 신규 프로젝트 등록
          </h2>
          
          <form onSubmit={handleAddTask} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* 프로젝트 명 입력 */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wide">프로젝트 명</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="예: 경기 화성상공회의소 내부망 모의해킹"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C273FF] transition-all"
                  required
                />
              </div>

              {/* 해시태그 입력 */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wide">분류 태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={newTaskTags}
                  onChange={(e) => setNewTaskTags(e.target.value)}
                  placeholder="예: Web Security, 모의해킹"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C273FF] transition-all"
                />
              </div>

              {/* 우선순위 선택 */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wide">우선순위 (Priority)</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C273FF] transition-all cursor-pointer"
                >
                  <option value="high">🔴 High (긴급/중요)</option>
                  <option value="medium">🟡 Medium (보통)</option>
                  <option value="low">🟢 Low (여유)</option>
                </select>
              </div>

            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newTaskTitle.trim()}
                className="px-6 py-2.5 bg-[#C273FF] text-white text-sm font-bold rounded-xl hover:bg-[#B4BEFF] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '등록 중...' : '프로젝트 생성'}
              </button>
            </div>
          </form>
        </section>

      </div>
    </main>
  );
}