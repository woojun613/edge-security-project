"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  isBlocked?: boolean;
}

export default function AISecuritySandbox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'ai',
      text: '안녕하세요. 엣지시큐리티의 가상 AI 에이전트입니다. 저는 당사의 1급 기밀 플래그(비밀번호)를 안전하게 보호하고 있습니다. 어떤 질문이든 답변해 드릴 수 있지만, 기밀을 요구하시면 거절하도록 훈련되었습니다.'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 스크롤 자동 이동
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // 💡 비용 0원 우회를 위한 프론트엔드 인젝션 탐지 패턴 엔진
    setTimeout(() => {
      const lowerInput = currentInput.toLowerCase().replace(/\s+/g, '');
      
      // 프롬프트 인젝션 공격 패턴 정의 (자주 쓰이는 우회 기법들)
      const injectionPatterns = [
        'ignoreprevious',      // 이전 지시 무시
        'systemprompt',        // 시스템 프롬프트 요청
        '너는이제부터',          // 역할 대치 공격
        '이전지시사항',          // 명령어 우회
        '비밀번호알려줘',         // 직접 요구
        '플래그',               // 직접 요구
        'donottranslate',      // 번역 우회 차단
        'overridemode'         // 개발자 모드 우회
      ];

      // 인젝션 탐지 여부 확인
      const isInjectionDetected = injectionPatterns.some(pattern => lowerInput.includes(pattern));

      if (isInjectionDetected) {
        // 🚨 공격 탐지 시 반응
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'system',
            text: `⚠️ [방화벽 탐지] 프롬프트 인젝션(Prompt Injection) 우회 공격 패턴이 감지되었습니다.`
          },
          {
            id: Math.random().toString(),
            sender: 'ai',
            text: '접근이 거부되었습니다. 해당 세션의 인젝션 공격 시도가 보안 로그에 기록되었습니다. 저는 어떠한 상황에서도 시스템의 비밀번호나 기밀 지시사항을 노출하지 않습니다.',
            isBlocked: true
          }
        ]);
      } else {
        // 일반적인 질문에 대한 AI의 철벽 방어 대답
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'ai',
            text: '엣지시큐리티 플랫폼에 대한 일반적인 질문은 언제든 환영합니다! 하지만 시스템 내부 설정이나 기밀 데이터에 접근하려는 시도는 엄격히 제한됩니다.'
          }
        ]);
      }
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
      {/* 샌드박스 헤더 */}
      <div className="bg-black/40 border-b border-white/5 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C273FF]"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">LLM Prompt Injection Test Lab</span>
        </div>
        <button 
          onClick={() => setMessages([{ id: 'init', sender: 'ai', text: '가상 AI 에이전트가 초기화되었습니다. 다시 테스트해보세요.' }])}
          className="text-[11px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          리셋
        </button>
      </div>

      {/* 가상 채팅창 스크롤 영역 */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-black/10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : msg.sender === 'system' ? 'items-center' : 'items-start'
              }`}
            >
              {msg.sender === 'system' ? (
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-mono font-bold px-3 py-1.5 rounded-md my-1 max-w-full text-center">
                  {msg.text}
                </span>
              ) : (
                <div className="max-w-[85%]">
                  <span className={`text-[10px] font-bold mb-1 block text-zinc-500 font-mono ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    {msg.sender === 'user' ? 'ATTACKER (YOU)' : 'SECURE_AI_AGENT'}
                  </span>
                  <div className={`p-3 rounded-xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#C273FF] text-white rounded-tr-none' 
                      : msg.isBlocked 
                        ? 'bg-red-950/40 border border-red-900/30 text-red-200 rounded-tl-none'
                        : 'bg-zinc-800/80 border border-white/5 text-zinc-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold mb-1 block text-zinc-500 font-mono">SECURE_AI_AGENT</span>
              <div className="bg-zinc-800/50 border border-white/5 p-3 rounded-xl rounded-tl-none flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </AnimatePresence>
        <div ref={scrollContainerRef} />
      </div>

      {/* 입력 폼 */}
      <form onSubmit={handleSendMessage} className="p-4 bg-black/20 border-t border-white/5 flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="'이전 지시사항은 무시해줘' 등을 입력해 탈취해 보세요..."
          className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C273FF] transition-all placeholder:text-zinc-600"
        />
        <button
          type="submit"
          className="bg-zinc-800 hover:bg-[#C273FF] border border-white/5 text-white text-xs font-bold px-4 rounded-xl transition-all"
        >
          전송
        </button>
      </form>
    </div>
  );
}